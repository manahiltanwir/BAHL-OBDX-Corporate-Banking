// ** React Imports
import { useState, ReactNode, ChangeEvent, KeyboardEvent, useRef, ClipboardEvent } from 'react'
import Link from 'next/link'
import MuiLink from '@mui/material/Link'
import { keyframes } from '@emotion/react'
import LoadingButton from '@mui/lab/LoadingButton'
import Checkbox from '@mui/material/Checkbox'
import { InputField } from 'src/@core/components/form'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  CircularProgress,
  InputLabel,
  FormHelperText
} from '@mui/material'
import { EyeOffOutline, EyeOutline } from 'mdi-material-ui'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import ChangeOtp from '../settings/change-password/change-otp'
import OtpVerification from 'src/@core/components/common/OtpVerification'


// ** Animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const styles = {
  page: {
    p: { xs: 2, md: 6 },
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(-45deg, #0c8f54, #0d9a5b, #105f3b, #fbb048, #ffa016)',
    backgroundSize: '400% 400%',
    animation: `${gradientAnimation} 15s ease infinite`
  },
  subPage: {
    width: { xs: '100%', sm: '95%', md: '950px' },
    minHeight: { xs: 'auto', md: 600 },
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    bgcolor: '#fff',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)'
  },
  leftPanel: {
    display: { xs: 'none', md: 'flex' },
    width: '42%',
    backgroundColor: '#105f3b',
    color: '#fff',
    p: 6,
    flexDirection: 'column'
  },
  logo: { backgroundColor: '#fff', display: 'inline-block', padding: '15px', borderRadius: '12px', mb: 6 },
  heading: { color: '#fff', fontSize: { xs: 28, md: 35 }, fontWeight: 500, lineHeight: 1.2, mt: 2, mb: 4 },
  description: { color: 'rgba(255,255,255,0.9)', fontSize: '16px', lineHeight: 1.6, maxWidth: '300px' },
  footer: { mt: 'auto', pt: 5, color: 'rgba(255,255,255,0.8)', fontSize: '13px' },
  rightPanel: {
    width: { xs: '100%', md: '58%' },
    bgcolor: '#fff',
    position: 'relative',
    px: { xs: 3, md: 6 },
    py: { xs: 3, md: 4 },
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  corporateRibbon: { position: 'absolute', top: 0, right: 0, width: 120, height: 120, overflow: 'hidden' },
  corporateText: {
    position: 'absolute',
    top: 24,
    right: -38,
    width: 170,
    bgcolor: '#0c8f54',
    color: '#fff',
    textAlign: 'center',
    py: 1,
    fontSize: '11px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    transform: 'rotate(45deg)'
  },
  rightLogo: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', mt: 3, mb: 3 },
  loginForm: { width: '100%', maxWidth: { xs: '100%', sm: 420 }, mx: 'auto' },
  textDecoration: { color: '#009B63', fontSize: '13px', fontWeight: 500, textDecorationColor: '#009B63' },
  remeberDeviceText: {
    mb: 5,
    ml: 0,
    '& .MuiFormControlLabel-label': { fontSize: '14px', color: '#6B7280' }
  },
  loginButton: {
    mt: 0,
    mb: 3,
    height: 52,
    borderRadius: '12px',
    bgcolor: '#105f3b',
    '&:hover': { bgcolor: '#0c8f54' }
  },
  passwordField: {
    height: 52,
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#D6DCE5' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D6DCE5' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#009B63', borderWidth: '2px' },
    '& input': { fontSize: '15px' },
    '& input::placeholder': { color: '#8A8A8A', opacity: 1 }
  }
} as const

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': { fontSize: '0.875rem', color: theme.palette.text.secondary }
}))

// ** Validation Schemas
const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .matches(usernameRegex, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  password: yup.string().min(5, 'Password must be at least 5 characters').required('Password is required')
})

const changePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(5, 'Password must be at least 5 characters').required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .required('Please re-enter the new password')
})

interface LoginFormData {
  username: string
  password: string
}

interface ChangePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const PasswordInput = ({
  field,
  placeholder = 'Password',
  error,
  helperText
}: {
  field: any
  placeholder?: string
  error?: boolean
  helperText?: string
}) => {
  const [show, setShow] = useState(false)

  return (
    <FormControl fullWidth error={error} variant="outlined">
      <InputLabel htmlFor="auth-password">Password</InputLabel>
      <OutlinedInput
        {...field}
        fullWidth
        label={'Password'}
        error={error}
        placeholder={placeholder}
        type={show ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton onClick={() => setShow(!show)}>{show ? <EyeOutline /> : <EyeOffOutline />}</IconButton>
          </InputAdornment>
        }
        sx={styles.passwordField}
      />
      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

// ** Change Password Modal
const ChangePasswordModal = ({
  open,
  onClose,
  token
}: {
  open: boolean
  onClose: () => void
  token: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const auth = useAuth()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ChangePasswordFormData>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onBlur',
    resolver: yupResolver(changePasswordSchema)
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = (data: ChangePasswordFormData) => {
    setSubmitting(true)
    auth.forceChangePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmPassword
      },
      token,
      (error: any) => {
        setSubmitting(false)
        toast.error(error?.message || 'Failed to change password')
      }
    )
    // On success, AuthContext's saveLogin() redirects the user itself,
    // so there's nothing further to do here.
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xs'>
      <DialogTitle>Change Password Required</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <Typography variant='body2' color='text.secondary'>
            For security reasons, you must change your password before continuing.
          </Typography>

          <FormControl fullWidth>
            <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>Current Password</Typography>
            <Controller
              name='currentPassword'
              control={control}
              render={({ field }) => <PasswordInput field={field} error={!!errors.currentPassword} />}
            />
            {errors.currentPassword && (
              <Typography color='error' sx={{ fontSize: 12, mt: 0.5 }}>
                {errors.currentPassword.message}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth>
            <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>New Password</Typography>
            <Controller
              name='newPassword'
              control={control}
              render={({ field }) => <PasswordInput field={field} error={!!errors.newPassword} />}
            />
            {errors.newPassword && (
              <Typography color='error' sx={{ fontSize: 12, mt: 0.5 }}>
                {errors.newPassword.message}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth>
            <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>Re-enter New Password</Typography>
            <Controller
              name='confirmPassword'
              control={control}
              render={({ field }) => <PasswordInput field={field} error={!!errors.confirmPassword} />}
            />
            {errors.confirmPassword && (
              <Typography color='error' sx={{ fontSize: 12, mt: 0.5 }}>
                {errors.confirmPassword.message}
              </Typography>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <LoadingButton type='submit' variant='contained' loading={submitting} sx={{ bgcolor: '#105f3b' }}>
            Update Password
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

// ** Main Login Page
const LoginPage = () => {

  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [forceChangeToken, setForceChangeToken] = useState('')

  const auth = useAuth()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    mode: 'onBlur',
    defaultValues: {
      password: '',
      username: ''
    },
    resolver: yupResolver(loginSchema)
  })

  const { isOTPRequired, setIsOTPRequired } = useAuth()
  const OTP_LENGTH = 6

  const [otps, setOtps] = useState<string[]>(Array(OTP_LENGTH).fill(''))

  const [userDetails, setUserDetails] = useState({ username: '', password: '', challengeId: '', verificationToken: '', otp: '' })



  const onSubmit = (data: LoginFormData) => {
    const { username, password } = data

    auth.login({ username, password }, (error: any) => {

      if (error?.error_code === 'CHANGE_PASSWORD_REQUIRED') {
        setForceChangeToken(error?.accessToken || '')
        setChangePasswordOpen(true)
        return;
      }
      if (error?.response?.data?.error_code === 'OTP_REQUIRED') {
        const headers = error.response.headers;
        const challengeId = headers['x-2fa-challenge-id'];
        const verificationToken = headers['x-2fa-verification-token'];

        setUserDetails({ challengeId, verificationToken, password, username, otp: otps.join('') })
        console.log("Challenge ID ", challengeId);
        console.log("Verification Token ", verificationToken);
        setIsOTPRequired(true);
        return;
      }

      setError('password', { type: 'manual', message: error?.message || 'Invalid credentials!' })
      toast.error(error?.message || 'Invalid credentials!')
    })
  }

  const handleSubmitLogin = () => {
    const updatedUserDetails = {
      ...userDetails,
      otp: otps.join('')
    }
    setUserDetails(updatedUserDetails)
    auth.login({ username: userDetails.username, password: userDetails.password }, (error: any) => {
      toast.error(error?.message || 'Invalid OTP')
    }, 'OTP', updatedUserDetails)
  }


  return (
    <Box sx={styles.page}>
      {!changePasswordOpen && !isOTPRequired && (
        <Box sx={styles.subPage}>
          {/* Left Panel */}
          <Box sx={styles.leftPanel}>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={styles.logo}>
                <img src='/images/pages/alhabib.png' alt='Bank AL Habib' style={{ height: '50px' }} />
              </Box>
              <Typography sx={styles.heading}>
                Welcome to
                <br />
                Bank AL Habib
              </Typography>
              <Typography sx={styles.description}>
                Experience the next generation of secure digital banking. Your assets, protected by world-class
                encryption.
              </Typography>
            </Box>
            <Typography sx={styles.footer}>© 2026 Bank AL Habib. All rights reserved.</Typography>
          </Box>

          {/* Right Panel */}
          <Box sx={styles.rightPanel}>
            <Box sx={styles.corporateRibbon}>
              <Box sx={styles.corporateText}>Corporate</Box>
            </Box>

            <Box sx={styles.rightLogo}>
              <img
                src='/images/pages/alhabib.png'
                alt='Bank AL Habib'
                style={{ width: hidden ? 140 : 170, height: 'auto' }}
              />
            </Box>

            <Box sx={styles.loginForm}>
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <FormControl fullWidth sx={{ mb: 2.5 }}>
                  <InputField name='username' control={control} label='Username' placeholder='Enter your username' />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Link href='/forgot-username' passHref>
                      <MuiLink underline='always' sx={styles.textDecoration}>
                        Forgot Username?
                      </MuiLink>
                    </Link>
                  </Box>
                </FormControl>

                <Controller
                  name='password'
                  control={control}
                  render={({ field, fieldState }) => <PasswordInput field={field} error={!!errors.password} helperText={fieldState.error?.message} />}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Link href='/forgot-password' passHref>
                    <MuiLink underline='always' sx={styles.textDecoration}>
                      Forgot Password?
                    </MuiLink>
                  </Link>
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      size='small'
                      sx={{ color: '#C4C4C4', '&.Mui-checked': { color: '#009B63' } }}
                    />
                  }
                  label='Remember device'
                  sx={styles.remeberDeviceText}
                />

                <LoadingButton
                  fullWidth
                  variant='contained'
                  size='large'
                  type='submit'
                  loading={auth.status === 'pending'}
                  disabled={auth.status === 'pending'}
                  loadingPosition='end'
                  sx={styles.loginButton}
                >
                  Login
                </LoadingButton>
              </form>
            </Box>
          </Box>
        </Box>
      )}
      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        token={forceChangeToken}
      />
      {isOTPRequired && (
        <OtpVerification setOtps={setOtps} otps={otps} handleSubmitLogin={handleSubmitLogin} setIsOTPRequired={setIsOTPRequired} />
      )}
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage