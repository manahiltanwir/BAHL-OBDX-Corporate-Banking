import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  searchRulePartyUsersAction,
  resetRulePartySearch,
  fetchRulePartyAccountsAction,
  fetchRuleTasksByCategoryAction,
  searchRuleWorkflowsByPartyAction,
  createRuleAction,
  updateRuleAction,
  fetchRuleByIdAction,
  fetchRulesByPartyAction
} from 'src/store/apps/rule-management'
import { RuleTaskCategory, RuleApiPayload } from 'src/types/apps/ruleManagement'
export type RulePartySearchStatus = 'idle' | 'searching' | 'found' | 'not-found' | 'error'

export const useRulePartySearch = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.rulePartySearch)
  const [status, setStatus] = useState<RulePartySearchStatus>('idle')

  const searchParty = async (rawPartyId: string) => {
    const partyId = rawPartyId.trim()
    if (!partyId) return

    setStatus('searching')

    try {
      const res: any = await dispatch(searchRulePartyUsersAction({ partyId }))

      if (res?.error) {
        setStatus('error')
        return
      }

      if (!res.payload || res.payload.length === 0) {
        setStatus('not-found')
        return
      }

      setStatus('found')
    } catch (error) {
      setStatus('error')
    }
  }

  const resetPartySearch = () => {
    dispatch(resetRulePartySearch())
    setStatus('idle')
  }

  return {
    partyInfo: store.partyInfo,
    userOptions: store.userOptions,
    status,
    searchParty,
    resetPartySearch
  }
}

export const useRulePartyAccounts = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.rulePartySearch)

  const fetchAccounts = async (partyId: string) => {
    if (!partyId) return
    await dispatch(fetchRulePartyAccountsAction(partyId))
  }

  return {
    accountOptions: store.accountOptions,
    status: store.accountsStatus,
    fetchAccounts
  }
}

export const useRuleTransactions = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.rulePartySearch)

  const fetchTransactions = async (category: RuleTaskCategory) => {
    await dispatch(fetchRuleTasksByCategoryAction(category))
  }

  return {
    transactionOptions: store.transactionOptions,
    status: store.transactionsStatus,
    fetchTransactions
  }
}

export const useRuleWorkflows = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.rulePartySearch)

  const fetchWorkflows = async (partyId: string) => {
    if (!partyId) return
    await dispatch(searchRuleWorkflowsByPartyAction(partyId))
  }

  return {
    workflowOptions: store.workflowOptions,
    status: store.workflowsStatus,
    fetchWorkflows
  }
}
export const useRuleSubmit = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.rulePartySearch)

  const createRule = (payload: RuleApiPayload) => dispatch(createRuleAction(payload))
  const updateRule = (id: number, payload: RuleApiPayload) => dispatch(updateRuleAction({ id, payload }))

  return {
    status: store.createStatus,
    createRule,
    updateRule
  }
}
export const useRuleDetail = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.rulePartySearch)

  const fetchRuleDetail = (id: string | number) => dispatch(fetchRuleByIdAction(id))

  return {
    ruleDetail: store.ruleDetail,
    status: store.ruleDetailStatus,
    fetchRuleDetail
  }
}
export const useRulesList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.rulePartySearch)

  const fetchRulesByParty = (partyId: string) => dispatch(fetchRulesByPartyAction(partyId))

  return {
    rulesList: store.rulesList,
    status: store.rulesListStatus,
    fetchRulesByParty
  }
}