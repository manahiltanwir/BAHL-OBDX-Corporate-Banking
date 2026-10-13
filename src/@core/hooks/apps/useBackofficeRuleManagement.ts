import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  fetchAdminTasksByCategoryAction,
  fetchAdminUsersAction,
  fetchAdminWorkflowsAction,
  fetchAdminRulesAction,
  fetchAdminRuleByIdAction,
  createAdminRuleAction,
  updateAdminRuleAction,
  resetAdminRuleSearch
} from 'src/store/apps/backoffice-rule-management'
import { RuleTaskCategory, RuleApiPayload, AdminRuleApiPayload } from 'src/types/apps/backofficeRuleManagement'

export const useAdminRuleTransactions = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.adminRuleManagement)

  const fetchTransactions = (category: RuleTaskCategory) => dispatch(fetchAdminTasksByCategoryAction(category))

  return { transactionOptions: store.transactionOptions, fetchTransactions }
}

export const useAdminRuleUsers = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.adminRuleManagement)

  useEffect(() => {
    dispatch(fetchAdminUsersAction())
  }, [dispatch])

  return { userOptions: store.userOptions, status: store.usersStatus }
}

export const useAdminRuleWorkflows = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.adminRuleManagement)

  const fetchWorkflows = () => dispatch(fetchAdminWorkflowsAction())

  return {
    workflowOptions: store.workflowOptions,
    status: store.workflowsStatus,
    fetchWorkflows
  }
}

export const useAdminRuleList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.adminRuleManagement)

  const fetchRules = (userId: string) => dispatch(fetchAdminRulesAction(userId))
  const resetRules = () => dispatch(resetAdminRuleSearch())

  return {
    rules: store.rules,
    status: store.rulesStatus,
    fetchRules,
    resetRules
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

  const createRule = (payload: RuleApiPayload | AdminRuleApiPayload) => dispatch(createAdminRuleAction(payload))
  const updateRule = (id: number, payload: RuleApiPayload | AdminRuleApiPayload) =>
    dispatch(updateAdminRuleAction({ id, payload }))

  return { status: store.createStatus, createRule, updateRule }
}