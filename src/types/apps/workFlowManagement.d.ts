export interface WorkflowUserDTO {
  deleteReason: string | null
  forcePasswordChange: string
  id: number
  isLocked?: string
  lockCounter: number
  lockReason: string | null
  pwdExpiryDate: string
  status: string
  userId: string
  username: string
}

export interface WorkflowUserParty {
  id: number
  partyId: string
  partyName: string
  partyStatus: string
  statusReason: string
}

export interface WorkflowUserProfileDTO {
  address: string
  city: string
  cnic: string
  country: string
  createdBy: string | null
  creationDate: string | null
  dob: string
  email: string
  firstName: string
  lastName: string
  middleName: string
  mobileNumber: string
  passport: string
  postalCode: string
  state: string
  title: string
  updatedBy: string | null
  updatedDate: string | null
  userId: string
}

export interface WorkflowUserRole {
  enterpriseRole: string
  roleId: number
  roleName: string
}

export interface WorkflowPartyUserItem {
  userDTO: WorkflowUserDTO | null
  userParties: WorkflowUserParty[]
  userProfileDTO: WorkflowUserProfileDTO
  userRoles: WorkflowUserRole[]
}

export interface WorkflowPartyInfo {
  partyId: string
  partyName: string
}

export interface WorkflowUserOption {
  id: string
  userId: string
  partyId: string
  label: string
}

export interface WorkflowApprover {
  id?: number
  approvalType: string // 'USER'
  approverTargetId: string
}

export interface WorkflowStep {
  id?: number
  sequenceNo: number
  routingType: 'PARALLEL' | 'SERIAL'
  approvers: WorkflowApprover[]
}

export interface WorkflowRecordApi {
  id: number
  workflowCode: string
  description: string
  partyId: string
  status: string
  createdBy: string
  steps: WorkflowStep[]
}