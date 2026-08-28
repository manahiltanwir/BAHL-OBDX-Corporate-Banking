export interface RulePartyUserDTO {
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

export interface RulePartyUserParty {
  id: number
  partyId: string
  partyName: string
  partyStatus: string
  statusReason: string
}

export interface RulePartyUserProfileDTO {
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

export interface RulePartyUserRole {
  enterpriseRole: string
  roleId: number
  roleName: string
}

export interface RulePartyUserItem {
  userDTO: RulePartyUserDTO | null
  userParties: RulePartyUserParty[]
  userProfileDTO: RulePartyUserProfileDTO
  userRoles: RulePartyUserRole[]
}

export interface RulePartyInfo {
  partyId: string
  partyName: string
}

export interface RulePartyUserOption {
  id: string
  userId: string
  partyId: string
  label: string
}
export interface RuleAccountRecord {
  accountCategory: string | null
  accountNumber: string
  accountStatus: string
  accountTitle: string
  accountType: string
  balance: number
  branchType: string | null
  partyId: string
  productName: string | null
}

export interface RulePartyAccountsResponse {
  mappedAccounts: any[]
  partyId: string
  totalAccounts: RuleAccountRecord[]
}

export interface RuleAccountOption {
  id: string
  label: string
}

export interface RuleTaskService {
  apiEndpoint: string | null
  id: number
  operationCode: string
  operationName: string
  serviceId: string
  servicePath: string | null
  taskId: number
}

export interface RuleTask {
  category: string
  id: number
  taskCode: string
  taskName: string
  taskServices: RuleTaskService[]
}

export interface RuleTransactionOption {
  id: string
  label: string
  taskCode: string
  taskName: string
}

export type RuleTaskCategory = 'financial' | 'non-financial'


export interface RuleWorkflowRecord {
  id: number
  workflowCode: string
}

export interface RuleWorkflowOption {
  id: string
  label: string
}

export interface RuleMappedTaskPayload {
  taskCode: string
}

export interface RuleCriteriaPayload {
  fromAmount: number
  toAmount: number
  currency: string
  accountNumber: string
  initiatorType: 'USER' | 'ROLE'
  initiatorId: string
}

export interface RuleApiPayload {
  id?: number
  ruleCode: string
  description: string
  partyId: string
  ruleType: 'FINANCIAL' | 'NON_FINANCIAL'
  workflowId?: number
  mappedTasks: RuleMappedTaskPayload[]
  criteriaList: RuleCriteriaPayload[]
}

export interface RuleApiRecord extends RuleApiPayload {
  id: number
  createdDate?: string
  updatedDate?: string
  status?: string
}