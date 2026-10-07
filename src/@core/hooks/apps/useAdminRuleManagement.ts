import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  fetchAdminTasksByCategoryAction,
  searchAdminRulesAction,
  fetchAdminRuleByIdAction,
  createAdminRuleAction,
  updateAdminRuleAction,
  resetAdminRuleSearch
} from 'src/store/apps/admin-rule-management'
import { RuleTaskCategory, RuleApiPayload } from 'src/types/apps/ruleManagement'

export const useAdminRuleTransactions = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.adminRuleManagement)

  const fetchTransactions = (category: RuleTaskCategory) => dispatch(fetchAdminTasksByCategoryAction(category))

  return { transactionOptions: store.transactionOptions, fetchTransactions }
}

export const useAdminRuleSearch = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.adminRuleManagement)

  const searchRules = (ruleCode: string) => dispatch(searchAdminRulesAction(ruleCode))
  const resetSearch = () => dispatch(resetAdminRuleSearch())

  return {
    rules: store.rules,
    status: store.rulesStatus,
    fallback: store.searchFallback,
    searchRules,
    resetSearch
  }
}

export const useAdminRuleDetail = () => {
  const dispatch = useDispatch<AppDispatch>()

  const fetchRuleDetail = (id: string | number) => dispatch(fetchAdminRuleByIdAction(id))

  return { fetchRuleDetail }
}

export const useAdminRuleSubmit = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.adminRuleManagement)

  const createRule = (payload: RuleApiPayload) => dispatch(createAdminRuleAction(payload))
  const updateRule = (id: number, payload: RuleApiPayload) => dispatch(updateAdminRuleAction({ id, payload }))

  return { status: store.createStatus, createRule, updateRule }
}