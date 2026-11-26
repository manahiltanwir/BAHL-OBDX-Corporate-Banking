export type ApprovalStatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
export type ApprovalActionType = 'APPROVE' | 'REJECT'

export interface ApprovalActivitiesParams {
  userId: string
  status: ApprovalStatusFilter
}

export interface ApprovalActionPayload {
  transactionRefNo: string
  checkerId: string
  action: ApprovalActionType
  remarks: string
}

export interface ApprovalRejectPayload {
  transactionRefNo: string
  checkerId: string
  action: ApprovalActionType
  remarks: string
}

export interface ApprovalActionResponse {
  message: string
  status: string
}

export interface ApprovalApproverApi {
  approverTargetId: string
  firstName: string | null
  lastName: string | null
  action: string | null
  remarks: string | null
  sequenceNo: number
}

export interface ApprovalActivityApi {
  transactionRefNo: string
  operationCode: string
  activityName?: string | null
  serviceId: string
  contextType: string | null
  contextId: string
  makerId: string
  makerType: string | null
  makerFullName?: string | null
  actorId: string | null
  actorType: string
  actorFullName?: string | null
  activityStatus: string
  currentStatus: string
  executionStatus: string | null
  currentStepSequence: number
  creationDate: string
  actionTimestamp: string | null
  remarks: string | null
  approvers?: ApprovalApproverApi[] | null
  workflowId?: number | null
  details?: string | null
  amount?: number | null
  currency?: string | null
}