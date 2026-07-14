// ** React Imports
import { ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import MuiLink from '@mui/material/Link'
import { keyframes } from '@emotion/react'
import LoadingButton from '@mui/lab/LoadingButton'

import Box, { BoxProps } from '@mui/material/Box'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { ChangeEvent, ClipboardEvent, KeyboardEvent, useRef, useState } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'

import toast from 'react-hot-toast'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

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
  }`
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
  subPage: {
    width: {
      xs: '92%',
      sm: '500px'
    },
    bgcolor: '#fff',
    borderRadius: '24px',
    p: {
      xs: 4,
      sm: 5
    }
  },

  rightPanel: {
    width: '100%',
    bgcolor: '#fff',
    px: {
      xs: 3,
      md: 5
    },
    py: {
      xs: 3,
      md: 4
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

  loginButton: {
    mb: 0,
    mt: 1,
    height: 50,
    borderRadius: '10px',
    bgcolor: '#105f3b',
    '&:hover': {
      bgcolor: '#0c8f54'
    }
  },
  resendDescription: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    mt: 5,
    pb: 2
  },
  createAccountText: {
    color: '#009B63',
    fontWeight: 'bold',
    textDecoration: 'underline'
  },
  otpsendDescription: {
    fontSize: '15px',
    color: '#6B7280',
    textAlign: 'center', // Left align text
    width: '100%', // Take full width
    mb: 4,
    mt: 2,
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

const otp = () => {
  const otpLength = 6

  const [otps, setOtps] = useState<string[]>(Array(otpLength).fill(''))

  const otpRefs = useRef<Array<HTMLInputElement | null>>([])
  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const bgClasses = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const handleOtpChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const digit = event.target.value.replace(/\D/g, '').slice(-1)

    const updatedOtp = [...otps]
    updatedOtp[index] = digit

    setOtps(updatedOtp)

    if (digit && index < otpLength - 1) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Backspace' && !otps[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault()

    const pastedOtp = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, otpLength)

    if (!pastedOtp) return

    const updatedOtp = Array(otpLength).fill('')

    pastedOtp.split('').forEach((digit, index) => {
      updatedOtp[index] = digit
    })

    setOtps(updatedOtp)

    const focusIndex = Math.min(pastedOtp.length, otpLength - 1)
    otpRefs.current[focusIndex]?.focus()
  }

  const handleVerifyOtp = () => {
    const otpCode = otps.join('')

    if (otpCode.length !== otpLength) {
      toast.error('Please enter the complete 6-digit OTP')

      return
    }

    console.log('OTP:', otpCode)

    toast.success('OTP verified successfully')
  }

  return (
    <Box sx={styles.page}>
      <Box sx={styles.subPage}>
        {/* Right Panel */}
        <Box sx={styles.rightPanel}>
          {/* Logo */}
          <Box sx={styles.rightLogo}>
            <img
              src='/images/pages/alhabib.png'
              style={{
                width: 185,
                height: 'auto'
              }}
            />
          </Box>
          <Typography sx={styles.verificationText}>Verification</Typography>
          <Typography sx={styles.otpsendDescription}>Enter the 6-digit code sent to your phone</Typography>
          <Box
            onPaste={handleOtpPaste}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 2,
              my: 5
            }}
          >
            {otps.map((digit, index) => (
              <OutlinedInput
                key={index}
                value={digit}
                onChange={event => handleOtpChange(event, index)}
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
                    height: 54,
                    fontSize: 22,
                    fontWeight: 600,
                    textAlign: 'center',
                    padding: 0
                  }
                }}
              />
            ))}
          </Box>

          {/* Login Button */}
          <LoadingButton
            fullWidth
            variant='contained'
            size='large'
            type='button'
            onClick={handleVerifyOtp}
            disabled={otps.some(digit => digit === '')}
            sx={styles.loginButton}
          >
            Confirm
          </LoadingButton>
          <Box sx={styles.resendDescription}>
            <Typography sx={{ mr: 1, color: 'text.secondary' }}>Didn't get the code?</Typography>

            <Link passHref href='/signup'>
              <Typography component={MuiLink} sx={styles.createAccountText}>
                Resend
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

otp.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

otp.guestGuard = true

export default otp
