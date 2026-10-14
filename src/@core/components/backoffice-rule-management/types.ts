import { RuleType, InitiatorType, ScopeMode } from 'src/@core/data/dummy-rules'
import { AdminRuleApiPayload } from 'src/types/apps/backofficeRuleManagement'
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

export const BACKOFFICE_RULE_ROUTES = {
  list: '/backoffice-maintenance/backoffice-rule-management',
  create: '/backoffice-maintenance/backoffice-rule-management/backoffice-add-rule',
  review: '/backoffice-maintenance/backoffice-rule-management/backoffice-add-rule/backoffice-review-rule'
}