export interface IAdminUserManagement {
  username: string
  userId: string
  mobileNumber: number | string
  email: string
  firstName: string
  lastName: string
  passport: string
  fullName?: string
  status?: string
  id?: string
  image?: string
  createdAt?: Date
  address?: string
  city?: string
  cnic?: string
  country?: string
  createdBy?: string
  creationDate?: Date
  dob?: Date | any
  middleName?: string
  postalCode?: string
  state?: string
  title?: string
  updatedBy?: string
  updatedDate?: Date
  userType?: string
  landline?: string
  addressLineOne?: string
  addressLineTwo?: string
  addressLineThree?: string
  addressLineFour?: string
  zipCode?: string
  limit?: string
  userDTO?: IAdminUserDTO
  userProfileDTO?: IAdminUserProfileDTO
  isLocked?: string
  userRoles?: IAdminUserRole[]
  roles?: Record<string, { id: string | number; checked: boolean }>
  roleName?: string
}

export interface IAdminUserRole {
  enterpriseRole: string
  roleId: number | string
  roleName: string
}

export interface IAdminUserDTO {
  deleteReason?: string | null
  forcePasswordChange?: string
  id: string | number
  lockCounter?: string | number | null
  lockReason?: string | null
  pwdExpiryDate?: Date | string
  status?: string
  userId: string
  username: string
  isLocked?: string
}

export interface IAdminUserProfileDTO {
  firstName: string
  middleName?: string
  lastName: string
  email: string
  mobileNumber: string | number | null
  landlineNumber?: string | number | null
  userId: string
  cnic: string
  title: string
  dob: string | Date
  passport: string
  address: string
  city: string
  state?: string
  country: string
  postalCode: string
  zipCode?: string
  createdBy: string
  creationDate: string | Date
  updatedDate: string | Date
  updatedBy: string
  enterpriseRoleId?: number
  addressLineOne?: string | number | null
  addressLineTwo?: string | number | null
  addressLineThree?: string | number | null
  addressLineFour?: string | number | null
  authorizedUIComponents?: IAuthorizedUIComponents[]
}

export interface IAuthorizedUIComponents {
  component: string
  id: number
  name: string
  parentId: number
}

export interface AdminUserManagementApi extends IAdminUserManagement {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface AdminUserManagementForm extends IAdminUserManagement {}

export type AdminUserManagementKeys = keyof AdminUserManagementForm