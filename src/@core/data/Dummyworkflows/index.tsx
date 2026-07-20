export type LevelUserType = 'user' | 'userGroup'

export interface ApprovalLevel {
  id: number
  userType: LevelUserType
  selectedUser: string
}

export type ApprovalFlow = 'sequential' | 'parallel' | 'none'

export interface WorkflowRecord {
  id: string
  workflowCode: string
  workflowDescription: string
  partyId: string
  approvalFlow: ApprovalFlow
  levels: ApprovalLevel[]
}

export const dummyAccountUsers = [
  { id: '99999991_Maker1', label: 'Maker 1 (99999991_Maker1)' },
  { id: '99999991_Checker1', label: 'Checker 1 (99999991_Checker1)' },
  { id: '99999992_Maker1', label: 'Maker 1 (99999992_Maker1)' },
  { id: '99999992_Checker1', label: 'Checker 1 (99999992_Checker1)' },
  { id: '99999993_Maker1', label: 'Maker 1 (99999993_Maker1)' },
  { id: '99999993_Checker1', label: 'Checker 1 (99999993_Checker1)' }
]

export const approvalFlowLabels: Record<ApprovalFlow, string> = {
  sequential: 'Sequential',
  parallel: 'Parallel',
  none: 'No Approval'
}

export const dummyWorkflows: WorkflowRecord[] = [
  {
    id: 'WF-001',
    workflowCode: 'WF-ONB-01',
    workflowDescription: 'Customer Onboarding Approval',
    partyId: 'P-0001',
    approvalFlow: 'sequential',
    levels: [
      { id: 1, userType: 'user', selectedUser: '99999991_Maker1' },
      { id: 2, userType: 'user', selectedUser: '99999991_Checker1' }
    ]
  },
  {
    id: 'WF-002',
    workflowCode: 'WF-LMT-02',
    workflowDescription: 'Limit Increase Approval',
    partyId: 'P-0001',
    approvalFlow: 'parallel',
    levels: [
      { id: 1, userType: 'userGroup', selectedUser: '99999992_Maker1' },
      { id: 2, userType: 'user', selectedUser: '99999992_Checker1' }
    ]
  },
  {
    id: 'WF-003',
    workflowCode: 'WF-KYC-03',
    workflowDescription: 'KYC Update Verification',
    partyId: 'P-0002',
    approvalFlow: 'sequential',
    levels: [
      { id: 1, userType: 'user', selectedUser: '99999993_Maker1' },
      { id: 2, userType: 'user', selectedUser: '99999993_Checker1' },
      { id: 3, userType: 'userGroup', selectedUser: '99999991_Checker1' }
    ]
  },
  {
    id: 'WF-004',
    workflowCode: 'WF-CLS-04',
    workflowDescription: 'Account Closure Request',
    partyId: 'P-0003',
    approvalFlow: 'none',
    levels: [{ id: 1, userType: 'user', selectedUser: '99999991_Maker1' }]
  }
]