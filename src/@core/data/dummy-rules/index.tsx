
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

export const dummyRulesData: RuleRecord[] = [
  {
    id: 1,
    ruleType: 'Financial',
    ruleId: 'RULE001',
    ruleDescription: 'High value IBFT transfer control',
    initiatorType: 'user',
    initiatorUser: '99999992_Maker1',
    transactionMode: 'specific',
    selectedTransactions: ['IBFT', 'Raast'],
    accountMode: 'all',
    selectedAccounts: [],
    fromAmount: '10000',
    toAmount: '500000',
    approvalRequired: 'yes',
    selectedWorkflow: 'Maker 999999-6'
  },
  {
    id: 2,
    ruleType: 'NonFinancial',
    ruleId: 'RULE002',
    ruleDescription: 'Profile update maker-checker rule',
    initiatorType: 'userGroup',
    initiatorUser: '99999993_Maker2',
    transactionMode: 'all',
    selectedTransactions: [],
    accountMode: 'specific',
    selectedAccounts: ['ACC-1002'],
    fromAmount: '',
    toAmount: '',
    approvalRequired: 'no',
    selectedWorkflow: ''
  }
]