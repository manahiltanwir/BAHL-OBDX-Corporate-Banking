
export interface IUserManagement {
  fullName?: string
  userName?: string
  status?: string
  id: string
  image: string
  createdAt?: Date
  address?: string
  city?: string
  cnic?: string
  country?: string
  createdBy?: string
  creattionDate: Date
  dob?: Date
  email?: string
  firstName?: string
  lastName?: string
  middleName?: string
  mobileNumber?: string
  passport?: string
  postalCode?: string
  state?: string
  title?: string
  updatedBy?: string
  updatedDate?: Date
  userId?: string
}

export interface UserManagementApi extends IUserManagement {
  id: string,
  createdAt: Date
  updatedAt: Date
}

export interface UserManagementForm extends IUserManagement { }

export type UserManagementKeys = keyof UserManagementForm;
