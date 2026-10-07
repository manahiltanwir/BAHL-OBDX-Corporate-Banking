export interface AdminWorkflowUserDTO {
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

export interface AdminWorkflowUserParty {
  id: number
  partyId: string
  partyName: string
  partyStatus: string
  statusReason: string
}

export interface AdminWorkflowUserProfileDTO {
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

export interface AdminWorkflowUserRole {
  enterpriseRole: string
  roleId: number
  roleName: string
}

export interface AdminWorkflowPartyUserItem {
  userDTO: AdminWorkflowUserDTO | null
  userParties: AdminWorkflowUserParty[]
  userProfileDTO: AdminWorkflowUserProfileDTO
  userRoles: AdminWorkflowUserRole[]
}

export interface AdminWorkflowPartyInfo {
  partyId: string
  partyName: string
}

export interface AdminWorkflowUserOption {
  id: string
  userId: string
  partyId: string
  label: string
}

export interface AdminWorkflowApprover {
  id?: number
  approvalType: string // 'USER'
  approverTargetId: string
}

export interface AdminWorkflowStep {
  id?: number
  sequenceNo: number
  routingType: 'PARALLEL' | 'SERIAL'
  approvers: AdminWorkflowApprover[]
}

export interface AdminWorkflowRecordApi {
  id: number
  workflowCode: string
  description: string
  partyId: string
  status: string
  createdBy: string
  steps: AdminWorkflowStep[]
}