import { useMemo, useState } from 'react'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'

import {
    searchPartyUsersAction,
    fetchUserAccountAccessAction,
    updateUserAccountMappingAction,
    selectUser,
    backToResults,
    resetUserAccountAccess
} from 'src/store/apps/user-account-access'

import { UserAccountItem, MappingAccountItem, PartyUserResultRow } from 'src/types/apps/userAccountAccess'
import { AccountRow } from 'src/@core/components/AccountMappingTable'

export type UserAccountAccessStage = 'search' | 'results' | 'detail'

const toAccountRow = (account: UserAccountItem): AccountRow => ({
    id: account.accountNo,
    accountNumber: account.accountNo,
    currency: 'PKR', // not provided by API, defaulting to PKR
    productName: account.productName ?? '-',
    status: 'ACTIVE'// not provided by API, defaulting to Active
})

const extractMappedIds = (mappedAccounts: UserAccountItem[] | string[]): string[] => {
    if (!mappedAccounts || mappedAccounts.length === 0) return []

    return (mappedAccounts as any[]).map(item => (typeof item === 'string' ? item : item.accountNo))
}

export const useUserAccountAccess = () => {
    const dispatch = useDispatch<AppDispatch>()
    const store = useSelector((state: RootState) => state.userAccountAccess)

    const [stage, setStage] = useState<UserAccountAccessStage>('search')
    const [isSearching, setIsSearching] = useState(false)
    const [searchError, setSearchError] = useState('')
    const [searchedPartyId, setSearchedPartyId] = useState('')

    const [selectedToMap, setSelectedToMap] = useState<string[]>([])
    const [selectedToUnmap, setSelectedToUnmap] = useState<string[]>([])

    const accountRows = useMemo(() => store.totalAccounts.map(toAccountRow), [store.totalAccounts])
    const mappedAccountIds = useMemo(() => extractMappedIds(store.mappedAccounts), [store.mappedAccounts])

    const unmappedAccounts = accountRows.filter(account => !mappedAccountIds.includes(account.id))
    const mappedAccounts = accountRows.filter(account => mappedAccountIds.includes(account.id))

    // ** Step 1: GET /usermanagement-service/users/search/partyId/:partyId
    const searchPartyUsers = async (partyId: string) => {
        const trimmedId = partyId.trim()
        if (!trimmedId) return

        setIsSearching(true)
        setSearchError('')

        try {
            const res: any = await dispatch(searchPartyUsersAction({ partyId: trimmedId }))

            if (res?.error) {
                setSearchError('Search failed. Please check the Party ID and try again.')
                return
            }

            if (!res.payload || res.payload.length === 0) {
                setSearchError('No users found for this Party ID.')
                return
            }

            setSearchedPartyId(trimmedId)
            setStage('results')
        } catch (error) {
            setSearchError('Something went wrong. Please try again.')
        } finally {
            setIsSearching(false)
        }
    }

    const selectPartyUser = async (user: PartyUserResultRow) => {
        dispatch(selectUser(user))
        setSelectedToMap([])
        setSelectedToUnmap([])

        const res: any = await dispatch(fetchUserAccountAccessAction({ partyId: user.partyId }))
        if (res?.error) return

        setStage('detail')
    }
    const buildAccountsPayload = (accountIds: string[], actionType: 'map' | 'unmap'): MappingAccountItem[] => {
        return store.totalAccounts
            .filter(account => accountIds.includes(account.accountNo))
            .map(account => ({
                accountNo: account.accountNo,
                accountType: account.accountType ?? '',
                accountCategory: account.accountCategory ?? '',
                actionType,
                productName: account.productName ?? '',
                branchType: account.branchType ?? ''
            }))
    }

    const confirmMap = async () => {
        if (!store.selectedUser?.partyId || selectedToMap.length === 0) return

        const accounts = buildAccountsPayload(selectedToMap, 'map')

        try {
            await dispatch(
                updateUserAccountMappingAction({
                    data: {
                        partyId: store.selectedUser.partyId,
                        userId: store.selectedUser.userId,
                        updatedBy: store.selectedUser.userName,
                        accounts
                    }
                })
            ).unwrap()

            await dispatch(fetchUserAccountAccessAction({ partyId: store.selectedUser.partyId }))
            setSelectedToMap([])
        } catch (error) {
        }
    }

    const confirmUnmap = async () => {
        if (!store.selectedUser?.partyId || selectedToUnmap.length === 0) return

        const accounts = buildAccountsPayload(selectedToUnmap, 'unmap')

        try {
            await dispatch(
                updateUserAccountMappingAction({
                    data: {
                        partyId: store.selectedUser.partyId,
                        userId: store.selectedUser.userId,
                        updatedBy: store.selectedUser.userName,
                        accounts
                    }
                })
            ).unwrap()

            await dispatch(fetchUserAccountAccessAction({ partyId: store.selectedUser.partyId }))
            setSelectedToUnmap([])
        } catch (error) {
        }
    }

    const handleBackToResults = () => {
        setSelectedToMap([])
        setSelectedToUnmap([])
        dispatch(backToResults())
        setStage('results')
    }

    const handleReset = () => {
        setSearchedPartyId('')
        setSearchError('')
        setSelectedToMap([])
        setSelectedToUnmap([])
        dispatch(resetUserAccountAccess())
        setStage('search')
    }

    return {
        store,
        stage,
        isSearching,
        searchError,
        searchedPartyId,
        accountRows,
        unmappedAccounts,
        mappedAccounts,
        selectedToMap,
        setSelectedToMap,
        selectedToUnmap,
        setSelectedToUnmap,
        searchPartyUsers,
        selectPartyUser,
        confirmMap,
        confirmUnmap,
        handleBackToResults,
        handleReset
    }
}