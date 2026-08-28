export interface UserDTO {
  deleteReason: string | null
  forcePasswordChange: string
  id: number
  lockCounter: number
  lockReason: string | null
  pwdExpiryDate: string
  status: string
  userId: string
  username: string
}

export interface UserPartyItem {
  id: number
  partyId: string
  partyName: string
  partyStatus: string
  statusReason: string
}

export interface UserProfileDTO {
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

export interface UserRoleItem {
  enterpriseRole: string
  roleId: number
  roleName: string
}

export interface PartyUserSearchItem {
  userDTO: UserDTO | null
  userParties: UserPartyItem[]
  userProfileDTO: UserProfileDTO
  userRoles: UserRoleItem[]
}

export interface PartyUserResultRow {
  partyId: string
  userId: string
  userName: string
  status: string
  cnic: string
}

export interface UserAccountItem {
  accountCategory: string | null
  accountNo: string
  accountType: string | null
  actionType: 'map' | 'unmap' | null
  branchType: string | null
  mapped: boolean | null
  partyId: string
  productName: string | null
}

export interface UserAccountAccessApi {
  mappedAccounts: UserAccountItem[] | string[]
  totalAccounts: UserAccountItem[]
}

export interface MappingAccountItem {
  accountNo: string
  accountType: string
  accountCategory: string
  actionType: 'map' | 'unmap'
  productName: string
  branchType: string
}

export interface UserMappingPayload {
  partyId: string
  userId: string
  updatedBy: string
  accounts: MappingAccountItem[]
}