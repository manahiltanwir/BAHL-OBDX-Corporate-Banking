import { RuleType, InitiatorType, ScopeMode } from 'src/@core/data/dummy-rules'
import { RuleApiPayload } from 'src/types/apps/ruleManagement'

export type ReviewFieldData = { label: string; value: string }
export type ReviewChipData = { label: string }
export type ReviewSectionData = {
  title: string
  fields: ReviewFieldData[]
  chips?: ReviewChipData[]
}

export type RuleFormPayload = {
  id?: number
  partyId: string
  ruleType: RuleType
  ruleId: string
  ruleDescription: string
  initiatorType: InitiatorType
  initiatorUser: string
  transactionMode: ScopeMode
  selectedTransactions: string[]
  accountMode: ScopeMode
  selectedAccounts: string[]
  fromAmount: string
  toAmount: string
  approvalRequired: 'yes' | 'no'
  selectedWorkflow: string
}

export type RuleReviewPayload = {
  isEditMode: boolean
  rawPayload: RuleFormPayload
  apiPayload: RuleApiPayload
  sections: ReviewSectionData[]
}

export type Option = { id: string; label: string; taskCode?: string }