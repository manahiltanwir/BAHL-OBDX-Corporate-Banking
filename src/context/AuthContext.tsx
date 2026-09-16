// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Config
import authConfig from 'src/configs/auth'

import { AuthServices } from 'src/services'

// ** Types
import {
  AuthValuesType,
  RegisterParams,
  LoginParams,
  ErrCallbackType,
  UserDataType,
  ForgotPasswordParams,
  ResetPasswordParams,
  ForgotUsernameParams
} from './types'

// ** Third Party Imports
import toast from 'react-hot-toast'

const steps = [
  {
    title: 'Create Account',
    subtitle: 'Add Persnol Details'
  },
  {
    title: 'Create Company',
    subtitle: 'Add Company Details'
  },
  {
    title: 'Subscriptions',
    subtitle: 'Pick a plan that works best for you'
  }
]

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve(),
  profileUpdate: () => Promise.resolve(),
  changeCredentials: () => Promise.resolve(),
  // @ts-ignore - add `forceChangePassword` to AuthValuesType in ./types
  forceChangePassword: () => Promise.resolve(),
  // Signup related
  activeStep: 0,
  steps,
  handleBack: () => Promise.resolve(),
  handleNext: () => Promise.resolve(),
  handleReset: () => Promise.resolve(),

  // API status
  status: 'idle',
  // @ts-ignore
  setStatus: () => '',
  isOTPRequired: false,
  setIsOTPRequired: () => Boolean
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [status, setStatus] = useState<AuthValuesType['status']>('idle')
  const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized)
  const [activeStep, setActiveStep] = useState<number>(defaultProvider.activeStep) // signup step form
  const [isOTPRequired, setIsOTPRequired] = useState<boolean>(defaultProvider.isOTPRequired)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setLoading(true)
      setIsInitialized(true)

      const accessToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      const refreshToken = window.localStorage.getItem(authConfig.refreshTokenKeyName)
      const user = JSON.parse(window.localStorage.getItem('userData') || '{}')

      if (accessToken && refreshToken && user) {
        saveLogin({ accessToken, refreshToken, user })
      }

      setLoading(false)
    }
    initAuth()
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType, activity?: string, userDetails?: any) => {
    setStatus('pending')

    AuthServices.login(params, activity, userDetails)
      .then(async ({ data: response }) => {

        const forcePasswordChange =
          response?.error_code === 'CHANGE_PASSWORD_REQUIRED' ||
          response?.userDTO?.forcePasswordChange === 'Y' ||
          !response?.userDTO?.userProfile?.enterpriseRole

        if (forcePasswordChange) {
          setStatus('error')
          if (errorCallback) {
            errorCallback({
              error_code: 'CHANGE_PASSWORD_REQUIRED',
              message: response?.message || 'Force Password Change is required',
              userDTO: response?.userDTO,
              accessToken: response?.accessToken
            })
          }
          return
        }
        if (activity == 'OTP') {
          setIsOTPRequired(false);
        }
        saveLogin({
          accessToken: response.accessToken || '',
          refreshToken: response.refreshToken || '',
          user: response.userDTO
        })
        setStatus('success')
      })
      .catch(error => {

        setStatus('error')
        if (error?.response?.data?.error_code == 'OTP_REQUIRED') {
          if (errorCallback) errorCallback(error)
        } else {
          if (errorCallback) errorCallback(error.response?.data)
        }
      })
  }

  const handleForgotUsername = (params: ForgotUsernameParams, errorCallback?: ErrCallbackType) => {
    setStatus('pending')

    AuthServices.forgotUsername(params)
      .then(async ({ data: response }) => {
        toast.success(response.message || 'Username has been sent!', { duration:5000 })
        setTimeout(() => {
          setStatus('success')
          router.push('/login')
        }, 3000);
      })
      .catch(error => {
        console.log('In Error Of Auth Context ' + error);
        setStatus('error')
        if (errorCallback) errorCallback(error.response?.data)
      })
  }

  const handleLogout = () => {
    setUser(null)
    setIsInitialized(false)
    const refreshToken = window.localStorage.getItem('refreshToken')
    AuthServices.logout(refreshToken)
      .then(() => {
        window.localStorage.removeItem('userData')
        window.localStorage.removeItem(authConfig.storageTokenKeyName)
        window.localStorage.removeItem(authConfig.refreshTokenKeyName)
        router.push('/login')
      })
      .catch(() => {
        window.localStorage.removeItem('userData')
        window.localStorage.removeItem(authConfig.storageTokenKeyName)
        window.localStorage.removeItem(authConfig.refreshTokenKeyName)
        router.push('/login')
      })
  }

  const handleRegister = (params: RegisterParams, query: any, errorCallback?: ErrCallbackType) => {
    setStatus('pending')
    AuthServices.signup(params, query)
      .then(async ({ data: response }) => {
        saveLogin({
          accessToken: response.data.tokens.accessToken || '',
          refreshToken: response.data.tokens.refreshToken || '',
          user: response.data.user
        })
        router.push('/channels')
        setStatus('success')
      })
      .catch(error => {
        setStatus('error')
        if (errorCallback) errorCallback(error.response?.data)
      })
  }

  // Used on the login screen when the backend flags forcePasswordChange.
  // `token` is the accessToken returned alongside that flag (user isn't
  // fully logged in yet, so it isn't in localStorage — we stash it
  // temporarily so the axios interceptor attaches it as the Bearer token).
  const handleForceChangePassword = async (
    body: { currentPassword: string; newPassword: string; confirmNewPassword: string },
    token: string,
    errorCallback?: ErrCallbackType
  ) => {
    setStatus('pending')
    window.localStorage.setItem(authConfig.storageTokenKeyName, token)
    try {
      const { data: response } = await AuthServices.forceChangePassword(body)
      saveLogin({
        accessToken: response.accessToken || '',
        refreshToken: response.refreshToken || '',
        user: response.userDTO
      })
      setStatus('success')
    } catch (error: any) {
      // Change failed — user still isn't logged in, drop the temp token.
      window.localStorage.removeItem(authConfig.storageTokenKeyName)
      setStatus('error')
      toast.error(error?.response?.data?.message || 'Failed to change password')
      if (errorCallback) errorCallback(error?.response?.data)
    }
  }

  const changePassword = async (body: any, errorCallback?: ErrCallbackType) => {
    setStatus('pending')
    try {
      await AuthServices.changePassword(body)
      router.push('/channels')
      setStatus('success')
      handleNext()
    } catch (error: any) {
      setStatus('error')
      toast.error(error?.response?.data?.message || 'Something went wrong!')
      if (errorCallback) errorCallback(error?.response?.data)
    }
  }

  const handleProfileUpdate = (id: string, body: any, errorCallback?: ErrCallbackType) => {
    setStatus('pending')
    AuthServices.profileUpdate(id, body)
      .then(async ({ data: response }) => {
        const data = {
          activeChannel: response?.data?.employees?.activeChannel,
          email: response?.data?.employees?.email,
          firebase_uid: response?.data?.employees?.firebase_uid,
          first_name: response?.data?.employees?.first_name,
          gender: response?.data?.employees?.gender,
          id: response?.data?.employees?.id,
          last_name: response?.data?.employees?.last_name,
          profile_picture: response?.data?.employees?.profile_picture,
          referalCode: response?.data?.employees?.referalCode,
          role: response?.data?.employees?.role
        }
        saveLogin({
          accessToken: localStorage.getItem('accessToken') || '',
          refreshToken: localStorage.getItem('refreshToken') || '',
          user: data
        })
        router.push('/channels')
        setStatus('success')
      })
      .catch(error => {
        setStatus('error')
        if (errorCallback) errorCallback(error.response?.data)
      })
  }

  const handleForgotPassword = (params: ForgotPasswordParams, errorCallback?: ErrCallbackType) => {
    setStatus('pending')
    AuthServices.forgotPassword(params)
      .then((res) => {
        toast.success(res.data.message, { duration: 5000 })
        setTimeout(() => {
          setStatus('success')
          router.push('/login')
        }, 3000);
      })
      .catch(error => {
        debugger
        toast.error(error?.response?.data?.message || `Something went wrong`)
        setStatus('error')
        if (errorCallback) errorCallback(error.response?.data)
      })
  }

  const handleResetPassword = (params: ResetPasswordParams, token: string, errorCallback?: ErrCallbackType) => {
    setStatus('pending')
    AuthServices.resetPassword(params, token)
      .then(async () => {
        toast.success('Password reset success, Try login Now')
        setStatus('success')
        router.push('/login')
      })
      .catch(error => {
        toast.error(`Something went wrong`)
        setStatus('error')
        if (errorCallback) errorCallback(error.response?.data)
      })
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
    if (activeStep === steps.length - 1) {
      toast.success('Form Submitted')
    }
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const saveLogin = ({ accessToken, refreshToken, user }: { accessToken: string; refreshToken: string; user: any }) => {
    window.localStorage.setItem(authConfig.storageTokenKeyName, accessToken)
    window.localStorage.setItem(authConfig.refreshTokenKeyName, refreshToken)

    const returnUrl = router.query.returnUrl

    setUser(user)
    window.localStorage.setItem('userData', JSON.stringify(user))

    // Role-based landing page, falling back to any returnUrl / current path.
    const roleBasedUrl =
      user?.userProfile?.enterpriseRole === 'Corporate User' ? '/dashboard' : '/corporate-dashboard'

    const redirectURL = returnUrl && returnUrl !== '/' ? (returnUrl as string) : roleBasedUrl

    router.replace(redirectURL)
  }

  const values = {
    user,
    loading,
    activeStep,
    steps,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    forgotUsername: handleForgotUsername,
    profileUpdate: handleProfileUpdate,
    logout: handleLogout,
    register: handleRegister,
    changeCredentials: changePassword,
    forceChangePassword: handleForceChangePassword,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    handleBack,
    handleNext,
    handleReset,
    status,
    setStatus,
    isOTPRequired,
    setIsOTPRequired
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }