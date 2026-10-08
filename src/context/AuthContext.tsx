// ** React Imports
import { createContext, useEffect, useState, ReactNode, useRef, useCallback } from 'react'

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
  setIsOTPRequired: () => Boolean,
  getCookie: (name: string) => Promise.resolve(),
  removeCookie: (name: string) => Promise.resolve(),
  setCookie: (name: string, value: any, daysToLive: Number) => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // Activity Handlers
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const INACTIVITY_TIMEOUT = 1 * 60 * 1000

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

      const accessToken = getCookie(authConfig.storageTokenKeyName)
      const refreshToken = getCookie(authConfig.refreshTokenKeyName)
      // const rawUserCookie = getCookie('userData')
      const rawUserData = window.sessionStorage.getItem('userData')
      let user = null
      
      if (rawUserData) {
        try {
          user = JSON.parse(rawUserData)
        } catch (error) {
          console.error('Error parsing user cookie during init:', error)
        }
      }

      // const user = JSON.parse(getCookie('userData') || '{}')

      if (accessToken && refreshToken && user && Object.keys(user).length > 0) {
        saveLogin({ accessToken, refreshToken, user }, false)
      }

      setLoading(false)
    }
    initAuth()
  }, [])

  // Activity

  const handleLogout = () => {
    
    setUser(null)
    setIsInitialized(false)
    const refreshToken = getCookie('refreshToken')
    AuthServices.logout(refreshToken)
      .then(() => {
        // removeCookie('userData')
        window.sessionStorage.removeItem('userData')
        removeCookie(authConfig.storageTokenKeyName)
        removeCookie(authConfig.refreshTokenKeyName)
        router.push('/login')
      })
      .catch(() => {
        // removeCookie('userData')
        window.sessionStorage.removeItem('userData')
        removeCookie(authConfig.storageTokenKeyName)
        removeCookie(authConfig.refreshTokenKeyName)
        router.push('/login')
      })
  }

  // Activity
  const resetInactivityTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    if (user) {
      timerRef.current = setTimeout(() => {
        
        handleLogout()
      }, INACTIVITY_TIMEOUT)
    }
  }, [user, handleLogout])

  useEffect(() => {
    if (!user) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'visibilitychange']

    const handleUserActivity = () => {
      if (document.visibilityState === 'hidden') {
        return
      }
      resetInactivityTimer()
    }

    resetInactivityTimer()

    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity)
      document.addEventListener(event, handleUserActivity)
    })

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity)
        document.removeEventListener(event, handleUserActivity)
      })
    }
  }, [user, resetInactivityTimer])

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
          setIsOTPRequired(false)
        }
        saveLogin({
          accessToken: response.accessToken || '',
          refreshToken: response.refreshToken || '',
          user: response.userDTO
        })
        
        if (response.userDTO.userProfile.enterpriseRole === 'Administrator') {
          router.push('/dashboard')
        } else if (response.userDTO.userProfile.enterpriseRole === 'Corporate User') {
          router.push('/corporate-dashboard')
        } else {
          router.push('/empty-dashboard')
        }
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
        toast.success(response.message || 'Username has been sent!', { duration: 5000 })
        setTimeout(() => {
          setStatus('success')
          router.push('/login')
        }, 3000)
      })
      .catch(error => {
        console.log('In Error Of Auth Context ' + error)
        setStatus('error')
        if (errorCallback) errorCallback(error.response?.data)
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
    setCookie(authConfig.storageTokenKeyName, token, 1)
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
      removeCookie(authConfig.storageTokenKeyName)
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
          accessToken: getCookie('accessToken') || '',
          refreshToken: getCookie('refreshToken') || '',
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
      .then(res => {
        toast.success(res.data.message, { duration: 5000 })
        setTimeout(() => {
          setStatus('success')
          router.push('/login')
        }, 3000)
      })
      .catch(error => {
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

  function setCookie(name: string, value: any, minutesToLive: Number | any) {
    
    // 1. Encode BOTH the name and the value to keep characters safe for browser storage
    let cookieString = encodeURIComponent(name) + '='

    if (name === 'accessToken' || name === 'refreshToken') {
      cookieString += encodeURIComponent(value)
    } else {
      // Stringify objects and immediately URL-encode them so characters like '{', '}', '"', ':' are accepted by browser rules
      const stringifiedValue = typeof value === 'string' ? value : JSON.stringify(value)
      cookieString += encodeURIComponent(stringifiedValue)
    }

    cookieString += '; path=/; SameSite=Lax'

    document.cookie = cookieString
  }

  function getCookie(name: any | null) {
    const nameEQ = encodeURIComponent(name) + '='
    const ca = document.cookie.split(';')

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim()

      if (c.indexOf(nameEQ) === 0) {
        // Decode the cookie value safely
        return decodeURIComponent(c.substring(nameEQ.length, c.length))
      }
    }
    return null
  }

  function removeCookie(name: string) {
    document.cookie = encodeURIComponent(name) + '=; max-age=0; path=/; SameSite=Lax'
  }

  const saveLogin = (
    { accessToken, refreshToken, user }: { accessToken: string; refreshToken: string; user: any },
    shouldRedirect = true
  ) => {
    
    setCookie(authConfig.storageTokenKeyName, accessToken, 1)
    setCookie(authConfig.refreshTokenKeyName, refreshToken, 1)

    let userObject = user
    if (typeof user === 'string') {
      try {
        userObject = JSON.parse(user)
      } catch (error) {
        
        console.error('Failed to parse user string context:', error)
      }
    }

    setUser(userObject)
    
    window.sessionStorage.setItem('userData', JSON.stringify(userObject))

    // setCookie('userData', JSON.stringify(user), 1)
    if (shouldRedirect) {
      const returnUrl = router.query.returnUrl
      const redirectURL = returnUrl && returnUrl !== '/' ? (returnUrl as string) : router.asPath
      router.replace(redirectURL)
    }
    // const returnUrl = router.query.returnUrl
    // const redirectURL = returnUrl && returnUrl !== '/' ? (returnUrl as string) : router.asPath

    // router.replace(redirectURL)
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
    setIsOTPRequired,
    getCookie,
    removeCookie,
    setCookie
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
