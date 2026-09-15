import { ReactNode, useState } from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useAuth } from 'src/hooks/useAuth'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import OtpVerification from 'src/@core/components/common/OtpVerification'
import { getLoginStyles, usernameRegex } from 'src/@core/components/Login/Login.styles'
import LoginLeftPanel from 'src/@core/components/Login/LoginLeftPanel'
import LoginForm, { LoginFormData } from 'src/@core/components/Login/Loginform'
import ChangePasswordModal from 'src/@core/components/Login/Changepasswordmodal'

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .matches(usernameRegex, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  password: yup.string().min(5, 'Password must be at least 5 characters').required('Password is required')
})

const OTP_LENGTH = 6

const LoginPage = () => {
  const theme = useTheme()
  const styles = getLoginStyles(theme)
  const auth = useAuth()
  const { isOTPRequired, setIsOTPRequired } = useAuth()

  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [forceChangeToken, setForceChangeToken] = useState('')
  const [otps, setOtps] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [userDetails, setUserDetails] = useState({ username: '', password: '', challengeId: '', verificationToken: '', otp: '' })

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({ mode: 'onBlur', resolver: yupResolver(loginSchema) })

  const onSubmit = (data: LoginFormData) => {
    auth.login(data, (error: any) => {
      if (error?.error_code === 'CHANGE_PASSWORD_REQUIRED') {
        setForceChangeToken(error?.accessToken || '')
        setChangePasswordOpen(true)
        return
      }

      if (error?.response?.data?.error_code === 'OTP_REQUIRED') {
        const headers = error.response.headers
        setUserDetails({
          challengeId: headers['x-2fa-challenge-id'],
          verificationToken: headers['x-2fa-verification-token'],
          username: data.username,
          password: data.password,
          otp: otps.join('')
        })
        setIsOTPRequired(true)
        return
      }

      setError('password', { type: 'manual', message: error?.message || 'Invalid credentials!' })
      toast.error(error?.message || 'Invalid credentials!')
    })
  }

  const handleSubmitLogin = () => {
    const updatedUserDetails = { ...userDetails, otp: otps.join('') }
    setUserDetails(updatedUserDetails)
    auth.login({ username: userDetails.username, password: userDetails.password }, (error: any) => {
      toast.error(error?.message || 'Invalid OTP')
    }, 'OTP', updatedUserDetails)
  }

  return (
    <Box sx={styles.page}>
      {!changePasswordOpen && !isOTPRequired && (
        <Box sx={styles.subPage}>
          <LoginLeftPanel />
          <LoginForm control={control} errors={errors} loading={auth.status === 'pending'} onSubmit={handleSubmit(onSubmit)} />
        </Box>
      )}

      <ChangePasswordModal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} token={forceChangeToken} />

      {isOTPRequired && (
        <OtpVerification setOtps={setOtps} otps={otps} handleSubmitLogin={handleSubmitLogin} setIsOTPRequired={setIsOTPRequired} />
      )}
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage