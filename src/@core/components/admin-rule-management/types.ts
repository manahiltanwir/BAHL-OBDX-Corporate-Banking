import { RuleType, InitiatorType, ScopeMode } from 'src/@core/data/dummy-rules'
import { AdminRuleApiPayload } from 'src/types/apps/ruleManagement'
export type AdminOption = { id: string; label: string; taskCode?: string }

export type AdminReviewSection = {
  title: string
  fields: { label: string; value: string }[]
  chips?: { label: string }[]
}

export type AdminRuleFormPayload = {
  id?: number
  ruleType: RuleType
  ruleId: string
  ruleDescription: string
  initiatorType: InitiatorType
  initiatorUser: string
  transactionMode: ScopeMode
  selectedTransactions: string[]
  approvalRequired: 'yes' | 'no'
  selectedWorkflow: string
}

export type AdminRuleReviewPayload = {
  isEditMode: boolean
  rawPayload: AdminRuleFormPayload
  apiPayload: AdminRuleApiPayload
  sections: AdminReviewSection[]
}

export const ADMIN_RULE_REVIEW_KEY = 'adminRuleReviewData'

export const ADMIN_RULE_ROUTES = {
  list: '/admin-maintenance/admin-rule-management',
  create: '/admin-maintenance/admin-rule-management/admin-add-rule',
  review: '/admin-maintenance/admin-rule-management/admin-add-rule/admin-review-rule'
}