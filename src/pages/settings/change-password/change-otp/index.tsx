import { ChangeEvent, ClipboardEvent, KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import MuiLink from '@mui/material/Link'
import OutlinedInput from '@mui/material/OutlinedInput'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import CheckCircleOutline from 'mdi-material-ui/CheckCircleOutline'
import { keyframes } from '@emotion/react'
import toast from 'react-hot-toast'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const OTP_LENGTH = 6
const TEST_OTP = '123456' // TODO: remove once /api/verify-otp is wired up
type OtpFieldElement = HTMLInputElement | HTMLTextAreaElement

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const styles = {
  page: {
    minHeight: '100dvh',
    boxSizing: 'border-box',
    p: { xs: 2, md: 3 },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    background: 'linear-gradient(-45deg, #0c8f54, #0d9a5b, #105f3b, #fbb048, #ffa016)',
    backgroundSize: '400% 400%',
    animation: `${gradientAnimation} 15s ease infinite`
  },
  subPage: { width: { xs: '92%', sm: '500px' }, bgcolor: '#fff', borderRadius: '24px', p: { xs: 3, sm: 4 } },
  rightPanel: {
    width: '100%',
    bgcolor: '#fff',
    px: { xs: 1, sm: 2, md: 3 },
    py: { xs: 2, md: 3 },
    display: 'flex',
    flexDirection: 'column'
  },
  rightLogo: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', mt: 1, mb: 2 },
  confirmButton: {
    mt: 2,
    height: 50,
    borderRadius: '10px',
    bgcolor: '#105f3b',
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': { bgcolor: '#0c8f54' }
  },
  resendDescription: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', mt: 4, pb: 1 },
  resendText: { color: '#009B63', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' },
  otpDescription: { fontSize: '15px', color: '#6B7280', textAlign: 'center', width: '100%', mb: 3, mt: 1, lineHeight: 1.6 },
  verificationText: { fontSize: '22px', fontWeight: 700, color: '#0D2147', textAlign: 'center', mb: 1 }
}

const ChangeOtp = () => {
  const router = useRouter()
  const isChangePassword = router.query.purpose === 'change-otp'

  const [otps, setOtps] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  const otpRefs = useRef<Array<HTMLInputElement | null>>([])
  useEffect(() => {
    if (!router.isReady) return

    const purpose = typeof router.query.purpose === 'string' ? router.query.purpose : ''

    if (purpose && purpose !== 'change-otp') {
      router.replace('/login')
    }
  }, [router.isReady, router.query.purpose])

  const handleOtpChange = (event: ChangeEvent<OtpFieldElement>, index: number) => {
    const digit = event.target.value.replace(/\D/g, '').slice(-1)

    setOtps(prev => {
      const next = [...prev]
      next[index] = digit

      return next
    })

    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (event: KeyboardEvent<OtpFieldElement>, index: number) => {
    if (event.key !== 'Backspace') return

    setOtps(prev => {
      const next = [...prev]

      if (next[index]) {
        next[index] = ''
      } else if (index > 0) {
        next[index - 1] = ''
        otpRefs.current[index - 1]?.focus()
      }

      return next
    })
  }

  const handleOtpPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault()

    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return

    const next = Array(OTP_LENGTH).fill('')
    pasted.split('').forEach((digit, index) => (next[index] = digit))
    setOtps(next)

    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
  }

  const handleVerifyOtp = async () => {
    const otpCode = otps.join('')

    if (otpCode.length !== OTP_LENGTH) {
      toast.error('Please enter the complete 6-digit OTP.')

      return
    }

    setLoading(true)

    try {
      // TODO: replace with `await axios.post('/api/verify-otp', { otp: otpCode, purpose })`
      await new Promise(resolve => setTimeout(resolve, 700))

      if (otpCode !== TEST_OTP) {
        toast.error('Invalid OTP.')

        return
      }

      if (isChangePassword) {
        // TODO: call the real change-password confirmation API here, then:
        sessionStorage.removeItem('passwordChangeRequestId')
        setSuccessOpen(true)
      }
    } catch {
      toast.error('Unable to verify OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setResendLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 700))

      setOtps(Array(OTP_LENGTH).fill(''))
      otpRefs.current[0]?.focus()
      toast.success('OTP has been resent successfully.')
    } catch {
      toast.error('Unable to resend OTP. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  const handleGoToDashboard = () => {
    setSuccessOpen(false)
    router.replace('/dashboard')
  }

  return (
    <Box sx={styles.page}>
      <Box sx={styles.subPage}>
        <Box sx={styles.rightPanel}>
          <Box sx={styles.rightLogo}>
            <img src='/images/pages/alhabib.png' alt='Bank AL Habib' style={{ width: 185, height: 'auto' }} />
          </Box>

          <Typography sx={styles.verificationText}>
            {isChangePassword ? 'Confirm Password Change' : 'Verification'}
          </Typography>

          <Typography sx={styles.otpDescription}>
            {isChangePassword
              ? 'Enter the 6-digit code sent to confirm your password change.'
              : 'Enter the 6-digit code sent to your phone.'}
          </Typography>

          <Box
            onPaste={handleOtpPaste}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(6, minmax(38px, 1fr))', sm: 'repeat(6, 1fr)' },
              gap: { xs: 1, sm: 2 },
              my: { xs: 3, sm: 4 }
            }}
          >
            {otps.map((digit, index) => (
              <OutlinedInput
                key={index}
                value={digit}
                disabled={loading}
                autoFocus={index === 0}
                onChange={event => handleOtpChange(event, index)}
                onKeyDown={event => handleOtpKeyDown(event, index)}
                inputRef={element => (otpRefs.current[index] = element)}
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
                    height: { xs: 48, sm: 54 },
                    fontSize: { xs: 18, sm: 22 },
                    fontWeight: 600,
                    textAlign: 'center',
                    padding: 0
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#009B63', borderWidth: 2 }
                }}
              />
            ))}
          </Box>

          <LoadingButton
            fullWidth
            variant='contained'
            size='large'
            loading={loading}
            onClick={handleVerifyOtp}
            disabled={loading || otps.some(digit => digit === '')}
            loadingIndicator={<CircularProgress size={22} color='inherit' />}
            sx={styles.confirmButton}
          >
            Confirm
          </LoadingButton>

          <Box sx={styles.resendDescription}>
            <Typography sx={{ mr: 1, color: 'text.secondary' }}>Didn't get the code?</Typography>
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
                '&:disabled': { opacity: 0.6, cursor: 'not-allowed' }
              }}
            >
              {resendLoading ? 'Resending...' : 'Resend'}
            </Typography>
          </Box>

          {!isChangePassword && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Link passHref href='/login'>
                <Typography component={MuiLink} sx={{ color: '#009B63', fontWeight: 600, textDecoration: 'none' }}>
                  Back to Login
                </Typography>
              </Link>
            </Box>
          )}
        </Box>
      </Box>

      {/* Password-changed success popup */}
      <Dialog open={successOpen} maxWidth='xs' fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogContent sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#0c8f54', width: 68, height: 68, mb: 1 }}>
            <CheckCircleOutline sx={{ fontSize: 38 }} />
          </Avatar>

          <Typography sx={{ fontSize: '19px', fontWeight: 700, color: '#0D2147', textAlign: 'center' }}>
            Your password has been changed
          </Typography>

          <Typography sx={{ fontSize: '14px', color: '#6B7280', textAlign: 'center', lineHeight: 1.6 }}>
            You can now use your new password the next time you sign in.
          </Typography>

          <Button fullWidth variant='contained' onClick={handleGoToDashboard} sx={{ ...styles.confirmButton, mt: 1 }}>
            Go to Dashboard
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

ChangeOtp.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
ChangeOtp.acl = {
  action: 'itsHaveAccess',
  subject: 'change-password'
}

export default ChangeOtp