export interface BackofficeWorkflowUserDTO {
  id: number
  userId: string
  username: string
  status: string
  isLocked?: string
}

export interface BackofficeWorkflowUserProfileDTO {
  userId: string
  firstName: string
  lastName: string
  email: string
}

export interface BackofficeWorkflowUserItem {
  userDTO: BackofficeWorkflowUserDTO | null
  userProfileDTO: BackofficeWorkflowUserProfileDTO
}

export interface BackofficeWorkflowUserOption {
  id: string
  userId: string
  label: string
}

export interface BackofficeWorkflowApprover {
  id?: number
  approvalType: string
  approverTargetId: string
}

export interface BackofficeWorkflowStep {
  id?: number
  sequenceNo: number
  routingType: 'PARALLEL' | 'SERIAL'
  approvers: BackofficeWorkflowApprover[]
}

export interface BackofficeWorkflowRecordApi {
  id: number
  workflowCode: string
  description: string
  partyId?: string | null
  status: string
  createdBy: string
  contextType?: string
  steps: BackofficeWorkflowStep[]
}