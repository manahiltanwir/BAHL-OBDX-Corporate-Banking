
export type RuleType = 'Financial' | 'NonFinancial' | 'Maintenance'
export type InitiatorType = 'user' | 'userGroup'
export type ScopeMode = 'all' | 'specific'

export interface RuleRecord {
  id: number
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
