
export interface IUserManagement {
  partyId: string
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
  userDTO?: IUserDTO
  userProfileDTO?: IUserProfileDTO
  isLocked?: string
  userParties?: IUserParty
  roles?:{
    checker?: boolean
    viewer?: boolean,
    maker?: boolean,
    offshoreViewer?: boolean,
    tradeMaker?: boolean,
    tradeViewer?: boolean
  }
  // newUsername?: string
  // confirmNewUsername?: string
}

export interface IUserDTO {
  deleteReason: string
  forcePasswordChange: string
  id: string
  lockCounter: string | number | null
  lockReason: string | null
  pwdExpiryDate: Date
  status: string
  userId: string
  username: string
  isLocked?: string
}
export interface IUserProfileDTO {
  firstName: string
  middleName: string
  lastName: string
  email: string
  mobileNumber: string | number | null
  landlineNumber: string | number | null
  lockReason: string | null
  pwdExpiryDate: Date
  status: string | 'A' | "I"
  userId: string
  username: string
  cnic: string
  title: string
  dob: string | Date
  passport: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  zipCode: string
  createdBy: string
  creationDate: string | Date
  updatedDate: string | Date
  updatedBy: string
  addressLineOne: string | number | null
  addressLineTwo: string | number | null
  addressLineThree: string | number | null
  addressLineFour: string | number | null
}

export const userParty: IUserParty = {
  id: string | number | null | undefined,
  partyId: string,
  partyName: string,
  partyStatus: "ACTIVE" | "INACTIVE",
  statusReason: string
}

export const userPartiesArray: IUserParty[] = [userParty]
export interface UserManagementApi extends IUserManagement {
  id: string,
  createdAt: Date
  updatedAt: Date
}

export interface UserManagementForm extends IUserManagement { }

export type UserManagementKeys = keyof UserManagementForm;
