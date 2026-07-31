// ** React Imports
import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useRef,
  useState
} from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import MuiLink from '@mui/material/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import OutlinedInput from '@mui/material/OutlinedInput'
import CircularProgress from '@mui/material/CircularProgress'
import LoadingButton from '@mui/lab/LoadingButton'

// ** Emotion Import
import { keyframes } from '@emotion/react'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
`

const styles = {
  page: {
    minHeight: '100dvh',
    boxSizing: 'border-box',
    p: {
      xs: 2,
      md: 3
    },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    background:
      'linear-gradient(-45deg, #0c8f54, #0d9a5b, #105f3b, #fbb048, #ffa016)',
    backgroundSize: '400% 400%',
    animation: `${gradientAnimation} 15s ease infinite`
  },

  subPage: {
    width: {
      xs: '92%',
      sm: '500px'
    },
    bgcolor: '#fff',
    borderRadius: '24px',
    p: {
      xs: 3,
      sm: 4
    }
  },

  rightPanel: {
    width: '100%',
    bgcolor: '#fff',
    px: {
      xs: 1,
      sm: 2,
      md: 3
    },
    py: {
      xs: 2,
      md: 3
    },
    display: 'flex',
    flexDirection: 'column'
  },

  rightLogo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    mt: 1,
    mb: 2
  },

  confirmButton: {
    mt: 2,
    height: 50,
    borderRadius: '10px',
    bgcolor: '#105f3b',
    textTransform: 'none',
    fontWeight: 600,

    '&:hover': {
      bgcolor: '#0c8f54'
    }
  },

  resendDescription: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    mt: 4,
    pb: 1
  },

  resendText: {
    color: '#009B63',
    fontWeight: 600,
    textDecoration: 'underline',
    cursor: 'pointer'
  },

  otpDescription: {
    fontSize: '15px',
    color: '#6B7280',
    textAlign: 'center',
    width: '100%',
    mb: 3,
    mt: 1,
    lineHeight: 1.6
  },

  verificationText: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#0D2147',
    textAlign: 'center',
    mb: 1
  }
}

const changeOtp = () => {
  const otpLength = 6

  const router = useRouter()
  const auth = useAuth()

  const { purpose } = router.query

  const isChangePassword = purpose === 'change-otp'
 

  const [otps, setOtps] = useState<string[]>(
    Array(otpLength).fill('')
  )

  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const otpRefs = useRef<Array<HTMLInputElement | null>>([])

 useEffect(() => {
  if (!router.isReady) return

  const currentPurpose =
    typeof router.query.purpose === 'string'
      ? router.query.purpose
      : ''

  if (!currentPurpose) {
    return
  }

  if (
    currentPurpose !== 'change-otp' 
    // currentPurpose !== 'forgot-password' &&
    // currentPurpose !== 'forgot-username'
  )
   {
    router.replace('/login')
  }
}, [router.isReady, router.query.purpose])
  const handleOtpChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const digit = event.target.value
      .replace(/\D/g, '')
      .slice(-1)

    const updatedOtp = [...otps]
    updatedOtp[index] = digit

    setOtps(updatedOtp)

    if (digit && index < otpLength - 1) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === 'Backspace') {
      const updatedOtp = [...otps]

      if (updatedOtp[index]) {
        updatedOtp[index] = ''
        setOtps(updatedOtp)

        return
      }

      if (index > 0) {
        updatedOtp[index - 1] = ''
        setOtps(updatedOtp)

        otpRefs.current[index - 1]?.focus()
      }
    }
  }

  const handleOtpPaste = (
    event: ClipboardEvent<HTMLDivElement>
  ) => {
    event.preventDefault()

    const pastedOtp = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, otpLength)

    if (!pastedOtp) return

    const updatedOtp = Array(otpLength).fill('')

    pastedOtp.split('').forEach((digit, index) => {
      updatedOtp[index] = digit
    })

    setOtps(updatedOtp)

    const focusIndex = Math.min(
      pastedOtp.length,
      otpLength - 1
    )

    otpRefs.current[focusIndex]?.focus()
  }

  const handleVerifyOtp = async () => {
    const otpCode = otps.join('')

    if (otpCode.length !== otpLength) {
      toast.error('Please enter the complete 6-digit OTP.')

      return
    }

    try {
      setLoading(true)

      /*
       * Replace this temporary verification with your API.
       *
       * const response = await axios.post('/api/verify-otp', {
       *   otp: otpCode,
       *   purpose
       * })
       *
       * if (!response.data.success) {
       *   toast.error(
       *     response.data.message || 'Invalid OTP.'
       *   )
       *
       *   return
       * }
       */

      await new Promise(resolve => setTimeout(resolve, 700))

      // Temporary OTP for frontend testing
      if (otpCode !== '123456') {
        toast.error('Invalid OTP.')

        return
      }

      if (isChangePassword) {
        /*
         * Call the final change-password API here.
         *
         * const requestId = sessionStorage.getItem(
         *   'passwordChangeRequestId'
         * )
         *
         * await axios.post(
         *   '/api/change-password/confirm',
         *   {
         *     otp: otpCode,
         *     requestId
         *   }
         * )
         */

        sessionStorage.removeItem(
          'passwordChangeRequestId'
        )

        // toast.success('Password changed successfully.')

await router.replace('/settings/change-password')
        return
      }

    

    } catch (error) {
      toast.error('Unable to verify OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      setResendLoading(true)

      /*
       * Replace this with your resend OTP API.
       *
       * await axios.post('/api/resend-otp', {
       *   purpose
       * })
       */

      await new Promise(resolve => setTimeout(resolve, 700))

      setOtps(Array(otpLength).fill(''))

      otpRefs.current[0]?.focus()

      toast.success('OTP has been resent successfully.')
    } catch (error) {
      toast.error('Unable to resend OTP. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  const getHeading = () => {
    if (isChangePassword) {
      return 'Confirm Password Change'
    }

    return 'Verification'
  }

  const getDescription = () => {
    if (isChangePassword) {
      return 'Enter the 6-digit code sent to confirm your password change.'
    }


    return 'Enter the 6-digit code sent to your phone.'
  }

  return (
    <Box sx={styles.page}>
      <Box sx={styles.subPage}>
        <Box sx={styles.rightPanel}>
          <Box sx={styles.rightLogo}>
            <img
              src='/images/pages/alhabib.png'
              alt='Bank AL Habib'
              style={{
                width: 185,
                height: 'auto'
              }}
            />
          </Box>

          <Typography sx={styles.verificationText}>
            {getHeading()}
          </Typography>

          <Typography sx={styles.otpDescription}>
            {getDescription()}
          </Typography>

          <Box
            onPaste={handleOtpPaste}
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(6, minmax(38px, 1fr))',
                sm: 'repeat(6, 1fr)'
              },
              gap: {
                xs: 1,
                sm: 2
              },
              my: {
                xs: 3,
                sm: 4
              }
            }}
          >
            {otps.map((digit, index) => (
              <OutlinedInput
                key={index}
                value={digit}
                disabled={loading}
                autoFocus={index === 0}
                onChange={event =>
                  handleOtpChange(event, index)
                }
                onKeyDown={event =>
                  handleOtpKeyDown(
                    event as KeyboardEvent<HTMLInputElement>,
                    index
                  )
                }
                inputRef={element => {
                  otpRefs.current[index] = element
                }}
                inputProps={{
                  maxLength: 1,
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  'aria-label': `OTP digit ${index + 1}`
                }}
                sx={{
                  width: '100%',
                  borderRadius: '10px',
                  backgroundColor: '#fff',

                  '& input': {
                    height: {
                      xs: 48,
                      sm: 54
                    },
                    fontSize: {
                      xs: 18,
                      sm: 22
                    },
                    fontWeight: 600,
                    textAlign: 'center',
                    padding: 0
                  },

                  '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                    {
                      borderColor: '#009B63',
                      borderWidth: 2
                    }
                }}
              />
            ))}
          </Box>

          <LoadingButton
            fullWidth
            variant='contained'
            size='large'
            type='button'
            loading={loading}
            onClick={handleVerifyOtp}
            disabled={
              loading ||
              otps.some(digit => digit === '')
            }
            loadingIndicator={
              <CircularProgress
                size={22}
                color='inherit'
              />
            }
            sx={styles.confirmButton}
          >
            Confirm
          </LoadingButton>

          <Box sx={styles.resendDescription}>
            <Typography
              sx={{
                mr: 1,
                color: 'text.secondary'
              }}
            >
              Didn't get the code?
            </Typography>

            <Typography
              component='button'
              type='button'
              disabled={resendLoading}
              onClick={handleResendOtp}
              sx={{
                ...styles.resendText,
                p: 0,
                border: 0,
                bgcolor: 'transparent',
                fontFamily: 'inherit',

                '&:disabled': {
                  opacity: 0.6,
                  cursor: 'not-allowed'
                }
              }}
            >
              {resendLoading ? 'Resending...' : 'Resend'}
            </Typography>
          </Box>

          {!isChangePassword ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 1
              }}
            >
              <Link passHref href='/login'>
                <Typography
                  component={MuiLink}
                  sx={{
                    color: '#009B63',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  Back to Login
                </Typography>
              </Link>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  )
}

changeOtp.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)
changeOtp.acl = {
  action: 'itsHaveAccess',
  subject: 'change-password'
}
/*
 * Do not use:
 *
 * Otp.guestGuard = true
 *
 * The page supports both authenticated and guest OTP flows.
 */

export default changeOtp