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

export interface ApprovalActionResponse {
  message: string
  status: string
}

export interface ApprovalActivityApi {
  transactionRefNo: string
  operationCode: string
  serviceId: string
  contextType: string
  contextId: string
  makerId: string
  makerType: string
  actorId: string | null
  actorType: string
  activityStatus: string
  currentStatus: string
  executionStatus: string | null
  currentStepSequence: number
  creationDate: string
  actionTimestamp: string | null
  remarks: string | null
  details?: string | null
  amount?: number | null
  currency?: string | null
}