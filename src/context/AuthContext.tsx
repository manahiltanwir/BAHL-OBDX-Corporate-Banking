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
  ISignupFormValues,
  ICompanyFormValues,
  ChannelParams,
  ForgotPasswordParams,
  ResetPasswordParams,
  ForgotUsernameParams, 
  

} from './types'

// ** Third Party Imports
import toast from 'react-hot-toast'
// import { IUser } from 'src/types/apps/user'

// ** Dummy Login Response Import
import login_response from 'src/json/login_response.json'

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
  // Signup related
  activeStep: 0,
  steps,
  handleBack: () => Promise.resolve(),
  handleNext: () => Promise.resolve(),
  handleReset: () => Promise.resolve(),

  // API status
  status: 'idle',
  // @ts-ignore
  setStatus: () => ''
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

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setLoading(true)

      // const ddd = window.localStorage.getItem(authConfig.storageTokenKeyName)
      // console.log('====================================');
      // console.log("initAuth", ddd);
      // console.log('====================================');
      // AuthServices.me()
      //   .then((data) => {
      //     console.log('====================================');
      //     console.log("initAuth", data);
      //     console.log('====================================');
      //   })
      //   .catch((error) => {
      //     console.log('====================================');
      //     console.log("initAuth", error.response);
      //     console.log('====================================');
      //   })

      setIsInitialized(true)

      const accessToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      const refreshToken = window.localStorage.getItem(authConfig.refreshTokenKeyName)
      const user = JSON.parse(window.localStorage.getItem('userData') || '{}')

      // console.log('====================================')
      // console.log(user)
      // console.log('====================================')
      // console.log(accessToken);
      // console.log('====================================');
      // console.log(refreshToken);
      // console.log('====================================');

      if (accessToken && refreshToken && user) {
        saveLogin({ accessToken, refreshToken, user })
      }

      //   if (storedToken) {
      //     setLoading(true)
      //     await axios
      //       .get(authConfig.meEndpoint, {
      //         headers: {
      //           Authorization: storedToken
      //         }
      //       })
      //       .then(async response => {
      //         setLoading(false)
      //         setUser({ ...response.data.userData })
      //       })
      //       .catch(() => {
      //         localStorage.removeItem('userData')
      //         localStorage.removeItem('refreshToken')
      //         localStorage.removeItem('accessToken')
      //         setUser(null)
      //         setLoading(false)
      //       })
      //   } else {
      //   }
      setLoading(false)
    }
    initAuth()
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    setStatus('pending')
    AuthServices.login(params)
      .then(async ({ data: response }) => {
        saveLogin({
          accessToken: response.data.tokens.accessToken || '',
          refreshToken: response.data.tokens.refreshToken || '',
          user: response.data.user
        })
        router.push('/')
        setStatus('success')
      })
      .catch(error => {
        
        saveLogin({
          accessToken: login_response.accessToken || '',
          refreshToken: login_response.refreshToken || '',
          user: login_response.userDTO
        })
        // saveLogin({
        //   accessToken: "thisisaccestoken",
        //   refreshToken: 'thisisrefreshtoken',
        //   user: {
        //     id: "123",
        //     gender: "Male",
        //     role: { id: "123", code: "Any" },
        //     email: 'test@gmail.com',
        //     fullName: "Syed Manahil Tanveer",
        //     first_name: "Syed",
        //     last_name: "Manahil",
        //     username: 'manahiltanwir',
        //     password: "321"
        //   }
        // })
        debugger
        if(login_response.userDTO.userProfile.enterpriseRole === 'Corporate User'){
          router.push('/dashboard')
        }else{
          router.push('/corporate-dashboard')
        }
        setStatus('success')
        // setStatus('error')
        // if (errorCallback) errorCallback(error.response?.data)
      })
  }
const handleForgotUsername = (
  params: ForgotUsernameParams,
  errorCallback?: ErrCallbackType
) => {
  setStatus('pending')

  setTimeout(() => {
    if (
      params.email === 'test@gmail.com' &&
      params.mobile === '03327694746' &&
      params.cnic === '42101-7277719-2'
    ) {
      toast.success('OTP sent successfully')
      setStatus('success')
            router.push('/otp') // <-- Navigate here

    } else {
      setStatus('error')

      if (errorCallback) {
        errorCallback({
          message: 'Invalid Email, Phone Number or CNIC'
        })
      }
    }
  }, 1000)
}
  const handleLogout = () => {
    setUser(null)
    setIsInitialized(false)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem(authConfig.refreshTokenKeyName)
    router.push('/login')
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

  const changePassword = async (body: any, errorCallback?: ErrCallbackType) => {
    setStatus('pending')
    try {
      const { data } = await AuthServices.changePassword(body)
      router.push('/channels')
      setStatus('success')
      handleNext()
    } catch (error: any) {
      setStatus('error')
      toast.error(error?.response?.data?.message || 'Something went wrong!')
      if (errorCallback) errorCallback(error?.response?.data)
    }
  }

  // const handleProfileUpdate = (id: string, body: IUser, errorCallback?: ErrCallbackType) => {
  const handleProfileUpdate = (id: string, body: any, errorCallback?: ErrCallbackType) => {
    setStatus('pending')
    AuthServices.profileUpdate(id, body)
      .then(async ({ data: response }) => {
        let data = {
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


  // ** Forget password
  const handleForgotPassword = (params: ForgotPasswordParams, errorCallback?: ErrCallbackType) => {
    setStatus('pending')
    AuthServices.forgotPassword(params)
      .then(async ({ data: response }) => {
        toast.success('Email send success, Check your email')
        setStatus('success')
        router.push('/login')
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || `Something went wrong`)
        setStatus('error')
        if (errorCallback) errorCallback(error.response?.data)
      })
  }

  // ** Forget password
  const handleResetPassword = (params: ResetPasswordParams, token: string, errorCallback?: ErrCallbackType) => {
    setStatus('pending')
    AuthServices.resetPassword(params, token)
      .then(async ({ data: response }) => {
        toast.success('Password reset success, Try login Now')
        setStatus('success')
        router.push('/login')
      })
      .catch((error) => {
        toast.error(`Something went wrong`)
        setStatus('error')
        if (errorCallback) errorCallback(error.response?.data)
      })
  }


  // Handle Stepper Back
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  // Handle Stepper Next
  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
    if (activeStep === steps.length - 1) {
      toast.success('Form Submitted')
    }
  }

  // Handle Stepper Reset all process
  const handleReset = () => {
    setActiveStep(0)
  }

  const saveLogin = ({ accessToken, refreshToken, user }: { accessToken: string; refreshToken: string; user: any }) => {
    // save token in localStorage
    window.localStorage.setItem(authConfig.storageTokenKeyName, accessToken)
    window.localStorage.setItem(authConfig.refreshTokenKeyName, refreshToken)

    const returnUrl = router.query.returnUrl

    // console.log('=========returnUrl===========================')
    // console.log(returnUrl)
    // console.log('====================================')

    setUser(user)
    window.localStorage.setItem('userData', JSON.stringify(user))

    const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : router.asPath

    // router.replace(redirectURL as string)
    router.replace(redirectURL as string)
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
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    handleBack,
    handleNext,
    handleReset,
    status,
    setStatus
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
