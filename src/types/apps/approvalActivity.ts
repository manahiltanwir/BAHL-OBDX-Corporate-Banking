export type ApprovalActorType = 'MAKER' | 'CHECKER' | 'ALL'
export type ApprovalStatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'

export interface ApprovalActivitiesParams {
  userId: string
  actorType: ApprovalActorType
  status: ApprovalStatusFilter
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
