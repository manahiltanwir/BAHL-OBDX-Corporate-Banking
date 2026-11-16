import { RuleType, InitiatorType, ScopeMode } from 'src/@core/data/dummy-rules'
import { RuleApiPayload, RuleMappedTaskPayload, RuleCriteriaPayload } from 'src/types/apps/ruleManagement'
import { ruleTypeOptions, DEFAULT_CURRENCY } from '../Constants'
import { Option, ReviewSectionData } from '../types'

export type BuildParams = {
  isEditMode: boolean
  id?: string | string[]
  createdBy: string
  partyInfo: { partyId: string; partyName: string } | null
  userOptions: Option[]
  ruleType: RuleType
  ruleId: string
  ruleDescription: string
  initiatorType: InitiatorType
  initiatorUser: string
  transactionMode: ScopeMode
  selectedTransactions: string[]
  transactionOptions: Option[]
  accountMode: ScopeMode
  selectedAccounts: string[]
  accountOptions: Option[]
  fromAmount: string
  toAmount: string
  currency: string
  approvalRequired: 'yes' | 'no'
  selectedWorkflow: string
  workflowOptions: Option[]
}

export const buildReviewSections = (p: BuildParams): ReviewSectionData[] => [
  {
    title: 'Party Information',
    fields: [
      { label: 'Party ID', value: p.partyInfo?.partyId ?? '' },
      { label: 'Party Name', value: p.partyInfo?.partyName ?? '' }
    ]
  },
  {
    title: 'Rule Details',
    fields: [
      { label: 'Rule Type', value: ruleTypeOptions.find(o => o.value === p.ruleType)?.label ?? p.ruleType },
      { label: 'Rule ID', value: p.ruleId },
      { label: 'Rule Description', value: p.ruleDescription }
    ]
  },
  {
    title: 'Initiator',
    fields: [
      { label: 'Initiator Type', value: p.initiatorType === 'user' ? 'User' : 'User Group' },
      { label: 'Initiator', value: p.userOptions.find(u => u.id === p.initiatorUser)?.label ?? p.initiatorUser }
    ]
  },
  {
    title: 'Transactions',
    fields: [{ label: 'Scope', value: p.transactionMode === 'all' ? 'All Transactions' : 'Specific Transactions' }],
    chips:
      p.transactionMode === 'specific'
        ? p.selectedTransactions.map(txnId => ({
            label: p.transactionOptions.find(t => t.id === txnId)?.label ?? txnId
          }))
        : undefined
  },
  {
    title: 'Accounts',
    fields: [{ label: 'Scope', value: p.accountMode === 'all' ? 'All Accounts' : 'Specific Accounts' }],
    chips:
      p.accountMode === 'specific'
        ? p.selectedAccounts.map(accId => ({
            label: p.accountOptions.find(acc => acc.id === accId)?.label ?? accId
          }))
        : undefined
  },
  ...(p.ruleType === 'Financial'
    ? [
        {
          title: 'Amount Range',
          fields: [
            { label: 'Currency', value: p.currency },
            { label: 'From Amount', value: p.fromAmount },
            { label: 'To Amount', value: p.toAmount }
          ]
        }
      ]
    : []),
  {
    title: 'Workflow Details',
    fields: [
      { label: 'Approval Required', value: p.approvalRequired === 'yes' ? 'Yes' : 'No' },
      ...(p.approvalRequired === 'yes'
        ? [
            {
              label: 'Workflow',
              value: p.workflowOptions.find(w => w.id === p.selectedWorkflow)?.label ?? p.selectedWorkflow
            }
          ]
        : [])
    ]
  }
]

export const buildApiPayload = (p: BuildParams): RuleApiPayload => {
  const isFinancial = p.ruleType === 'Financial'

  const mappedTasks: RuleMappedTaskPayload[] =
    p.transactionMode === 'all'
      ? [{ taskCode: 'ALL_TRANSACTIONS' }]
      : Array.from(new Set(p.selectedTransactions)).map(taskCode => ({ taskCode }))

  const criteriaList: RuleCriteriaPayload[] = [
    {
      fromAmount: isFinancial ? Number(p.fromAmount) || 0 : 0,
      toAmount: isFinancial ? Number(p.toAmount) || 0 : 0,
      currency: isFinancial ? p.currency : DEFAULT_CURRENCY,
      accountNumber: p.accountMode === 'all' ? 'ALL_ACCOUNTS' : p.selectedAccounts.join(', '),
      initiatorType: p.initiatorType === 'user' ? 'USER' : 'ROLE',
      initiatorId: p.initiatorUser
    }
  ]

  return {
    ...(p.isEditMode && p.id ? { id: Number(p.id) } : {}),
    isWorkflowRequired: p.approvalRequired === 'yes',
    ruleCode: p.ruleId,
    description: p.ruleDescription,
    createdBy: p.createdBy,
    contextType: 'PARTY',
    contextId: p.partyInfo!.partyId,
    ruleType: isFinancial ? 'FINANCIAL' : 'NON_FINANCIAL',
    workflowId: p.approvalRequired === 'yes' && p.selectedWorkflow ? Number(p.selectedWorkflow) : null,
    mappedTasks,
    criteriaList
  }
}