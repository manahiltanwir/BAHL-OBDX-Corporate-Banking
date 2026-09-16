import { IUser } from 'src/types/apps/user'

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  username: string
  password: string
}

export type ChannelParams = {
  id: number
}
export type ForgotUsernameParams = {
  email: string
  cnicOrPassport: string
  partyId: string
  dob: string
}

export type ForgotPasswordParams = {
  username: string
  dob: string
}

export type RegisterParams = {
  first_name: '',
  last_name: '',
  password: '',
  confirm_password: '',
  email: '',
  gender: 'MALE' | 'FEMALE',
  role: 'TEACHER' | 'STUDENT'
}

export type UserDataType = {
  id: string
  gender?: string
  role: { id: string; code: string }
  email: string
  fullName: string
  first_name?: string
  last_name: string
  username: string
  password: string
  avatar?: string | null
  user?: any
}

export type AuthValuesType = {
  isOTPRequired: boolean
  setIsOTPRequired: (value: boolean) => void
  loading: boolean
  setLoading: (value: boolean) => void
  logout: () => void
  isInitialized: boolean
  user: UserDataType | any
  setUser: (value: UserDataType | null) => void
  setIsInitialized: (value: boolean) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType, activity?: string, userDetails?: any) => void
  forgotUsername: (params: ForgotUsernameParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, query?: any, errorCallback?: ErrCallbackType) => void
  profileUpdate: (id: string, body: IUser, errorCallback?: ErrCallbackType) => void
  changeCredentials: (body: IUser, errorCallback?: ErrCallbackType) => void
  forceChangePassword: (
    body: { currentPassword: string; newPassword: string; confirmNewPassword: string },
    token: string,
    errorCallback?: ErrCallbackType
  ) => void
  forgotPassword: (body: ForgotPasswordParams, errorCallback?: ErrCallbackType) => void
  resetPassword: (body: ResetPasswordParams, token: string, errorCallback?: ErrCallbackType) => void,
  // Signup related
  activeStep: number
  steps: { title: string; subtitle: string }[]
  handleBack: () => void
  handleNext: () => void
  handleReset: () => void

  // API status
  status: 'idle' | 'pending' | 'success' | 'error'
}

export type SocketValuesType = {
  socket: any
  setSocket?: any
}

export interface ISignupFormValues {
  first_name: string
  last_name: string
  email: string
  password: string
  confirm_password?: string
  // gender: string;
  API_ERROR?: {}
}

export interface ICompanyFormValues {
  name: string
  email: string
  address: string
  API_ERROR?: {}
}

export type ResetPasswordParams = {
  password: string
}