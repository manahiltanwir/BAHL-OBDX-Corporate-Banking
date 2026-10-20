import { useMemo, useState } from 'react'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'

import {
  searchPartyAction,
  fetchAccountAccessAction,
  updateAccountMappingAction,
  resetAccountMapping
} from 'src/store/apps/party-account-access'

import { RawAccount, MappedAccountItem, MappingAccountItem } from 'src/types/apps/partyAccountAccess'
import { AccountRow } from 'src/@core/components/AccountMappingTable'
import { ApiResponseInfo } from 'src/@core/components/ApiResponseDialog'

const toAccountRow = (account: RawAccount): AccountRow => ({
  id: account.accountNumber,
  accountNumber: account.accountNumber,
  currency: 'PKR', // not provided by API, defaulting to PKR (agar mil rahi ho to currency ayegi warna null ayaga)
  productName: account.productName ?? '-',
  status: account.accountStatus
})

const extractMappedIds = (mappedAccounts: MappedAccountItem[] | string[]): string[] => {
  if (!mappedAccounts || mappedAccounts.length === 0) return []

  return (mappedAccounts as any[]).map(item => (typeof item === 'string' ? item : item.accountNo))
}

export const useAccountMapping = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.accountMapping)

  const [showResult, setShowResult] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  const [selectedToMap, setSelectedToMap] = useState<string[]>([])
  const [selectedToUnmap, setSelectedToUnmap] = useState<string[]>([])

  const accountRows = useMemo(() => store.totalAccounts.map(toAccountRow), [store.totalAccounts])
  const mappedAccountIds = useMemo(() => extractMappedIds(store.mappedAccounts), [store.mappedAccounts])

  const unmappedAccounts = accountRows.filter(account => !mappedAccountIds.includes(account.id))
  const mappedAccounts = accountRows.filter(account => mappedAccountIds.includes(account.id))

  const searchParty = async (partyId: string) => {
    const trimmedId = partyId.trim()
    if (!trimmedId) return

    setIsSearching(true)
    setSearchError('')
    setShowResult(false)

    try {
      const partyRes: any = await dispatch(searchPartyAction({ partyId: trimmedId }))

      if (partyRes?.error) {
        setSearchError('Party search failed. Please check the Party ID and try again.')
        return
      }

      const partyPayload = partyRes.payload

      if (!partyPayload?.alreadyExist) {
        setSearchError(partyPayload?.statusReason || 'No party found against this Party ID.')
        return
      }

      const accountsRes: any = await dispatch(fetchAccountAccessAction({ partyId: partyPayload.partyId }))

      if (accountsRes?.error) {
        setSearchError('Failed to fetch accounts for this party.')
        return
      }

      setSelectedToMap([])
      setSelectedToUnmap([])
      setShowResult(true)
    } catch (error) {
      setSearchError('Something went wrong. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const buildAccountsPayload = (accountIds: string[], actionType: 'map' | 'unmap'): MappingAccountItem[] => {
    return store.totalAccounts
      .filter(account => accountIds.includes(account.accountNumber))
      .map(account => ({
        accountNo: account.accountNumber,
        accountType: account.accountType,
        accountCategory: account.accountCategory,
        actionType,
        productName: account.productName,
        branchType: account.branchType
      }))
  }

  // ** Shared helper: map aur unmap dono yahi use karte hain.
  // Response jaisa aaye waisa return hota hai (PENDING_APPROVAL ya direct success).
  // Fail par { status: 'FAILED', message } return hota hai.
  const submitMapping = async (
    accountIds: string[],
    actionType: 'map' | 'unmap',
    clearSelection: () => void
  ): Promise<ApiResponseInfo | null> => {
    if (!store.party?.partyId || accountIds.length === 0) return null

    const accounts = buildAccountsPayload(accountIds, actionType)

    try {
      const res: any = await dispatch(
        updateAccountMappingAction({
          data: {
            partyId: store.party.partyId,
            updatedBy: store.party.partyName,
            accounts
          }
        })
      ).unwrap()

      await dispatch(fetchAccountAccessAction({ partyId: store.party.partyId }))
      clearSelection()

      return res
    } catch (error: any) {
      return {
        status: 'FAILED',
        message: typeof error === 'string' ? error : error?.message
      }

    }
  }

  const confirmMap = () => submitMapping(selectedToMap, 'map', () => setSelectedToMap([]))

  const confirmUnmap = () => submitMapping(selectedToUnmap, 'unmap', () => setSelectedToUnmap([]))

  const handleBack = () => {
    setShowResult(false)
    setSearchError('')
    setSelectedToMap([])
    setSelectedToUnmap([])
    dispatch(resetAccountMapping())
  }

  return {
    store,
    showResult,
    isSearching,
    searchError,
    accountRows,
    mappedAccountIds,
    unmappedAccounts,
    mappedAccounts,
    selectedToMap,
    setSelectedToMap,
    selectedToUnmap,
    setSelectedToUnmap,
    searchParty,
    confirmMap,
    confirmUnmap,
    handleBack
  }
}