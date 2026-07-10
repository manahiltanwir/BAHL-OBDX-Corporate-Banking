
export interface IUserManagement {
  fullName: string
  userName: string
  status: string
  id: string
  image: string
  createdAt?: Date
}

export interface UserManagementApi extends IUserManagement {
  id: string,
  createdAt: Date
  updatedAt: Date
}

export interface UserManagementForm extends IUserManagement { }

export type UserManagementKeys = keyof UserManagementForm;
