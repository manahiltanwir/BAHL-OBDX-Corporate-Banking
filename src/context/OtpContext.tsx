// import React, { createContext, useContext, useState } from 'react'
// import Dialog from '@mui/material/Dialog'
// import DialogContent from '@mui/material/DialogContent'
// import DialogTitle from '@mui/material/DialogTitle'
// import TextField from '@mui/material/TextField'
// import Button from '@mui/material/Button'
// import Box from '@mui/material/Box'
// import Typography from '@mui/material/Typography'
// import instance from 'src/services/httpService'

// interface OtpContextType {
//   triggerGlobalOtp: (retryConfig: any, errorInstance: any) => Promise<any>
// }

// const OtpContext = createContext<OtpContextType | undefined>(undefined)

// let triggerOtpFormOutsideReact: ((retryConfig: any, errorInstance: any) => Promise<any>) | null = null

// export const triggerGlobalOtpVerification = (retryConfig: any, errorInstance: any) => {
//   if (triggerOtpFormOutsideReact) {
//     return triggerOtpFormOutsideReact(retryConfig, errorInstance)
//   }
//   return Promise.reject(new Error('OtpProvider is not initialized.'))
// }

// export const OtpProvider = ({ children }: { children: React.ReactNode }) => {
//   const [open, setOpen] = useState(false)
//   const [otp, setOtp] = useState('')
//   const [error, setError] = useState('')
//   const [pendingRequest, setPendingRequest] = useState<any>(null)
//   const [errorPayload, setErrorPayload] = useState<any>(null)
//   const [resolver, setResolver] = useState<any>(null)

//   const triggerGlobalOtp = (retryConfig: any, errorInstance: any) => {
//     debugger
//     setOpen(true)
//     setOtp('')
//     setError('')
//     setPendingRequest(retryConfig)
//     setErrorPayload(errorInstance)

//     return new Promise((resolve, reject) => {
//       setResolver({ resolve, reject })
//     })
//   }

//   triggerOtpFormOutsideReact = triggerGlobalOtp

//   const handleVerify = async () => {
//     try {
//       setError('')
//       const headers = errorPayload?.response?.headers
//       const challengeId = headers?.['x-2fa-challenge-id']
//       const verificationToken = headers?.['x-2fa-verification-token']
//       debugger

//       const response = await instance.request({
//         method: pendingRequest.method,
//         url: pendingRequest.url,
//         data: JSON.parse(pendingRequest.data),
//         params: pendingRequest.params,
//         headers: {
//           ...pendingRequest.headers,
//           'x-2fa-challenge-id': challengeId,
//           'x-2fa-verification-token': verificationToken,
//           'x-2fa-otp': otp
//         }
//       })

//       debugger

//       setOpen(false)

//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Invalid OTP. Please try again.')
//     }
//   }

//   return (
//     <OtpContext.Provider value={{ triggerGlobalOtp }}>
//       {children}
//       <Dialog open={open}  maxWidth='xs' fullWidth disableEscapeKeyDown>
//         <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
//           <Typography variant='h5' component='span' fontWeight='600'>
//             Security Verification Required
//           </Typography>
//         </DialogTitle>
//         <DialogContent>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, gap: 3 }}>
//             <Typography variant='body2' sx={{ color: 'text.secondary', textAlign: 'center' }}>
//               Please enter the one-time authentication code sent to your registered device.
//             </Typography>
//             <TextField
//               fullWidth
//               label='OTP Code'
//               variant='outlined'
//               value={otp}
//               onChange={e => setOtp(e.target.value)}
//               error={!!error}
//               helperText={error}
//               inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.2rem' } }}
//             />
//             <Button fullWidth size='large' variant='contained' onClick={handleVerify} disabled={otp.length < 4}>
//               Verify Code
//             </Button>
//           </Box>
//         </DialogContent>
//       </Dialog>
//     </OtpContext.Provider>
//   )
// }

import React, { createContext, useState, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import OutlinedInput from '@mui/material/OutlinedInput'
import LoadingButton from '@mui/lab/LoadingButton'
import CircularProgress from '@mui/material/CircularProgress'
import MuiLink from '@mui/material/Link'
import { keyframes } from '@emotion/react'
import instance from 'src/services/httpService' // Adjust import pathway if needed
import { Button } from '@mui/material'
import otpConfig from 'src/configs/OTPConfig.json'
import themeConfig from 'src/configs/themeConfig'

const otpStyles = {
  dialogPaper: {
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: 'none'
  },
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
    bgcolor: '#105f3b',
    textTransform: 'none',
    borderRadius: '10px',
    fontWeight: 600,
    '&:hover': { bgcolor: '#0c8f54' },
    '&:disabled': { bgcolor: 'rgba(16, 95, 59, 0.4)', color: '#fff' }
  },
  resendDescription: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
    // mt: 4,
    // pb: 1
  },
  resendText: { color: '#009B63', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' },
  otpDescription: {
    fontSize: '15px',
    color: '#6B7280',
    textAlign: 'center',
    width: '100%',
    // mb: 3,
    // mt: 1,
    lineHeight: 1.6
  },
  verificationText: { fontSize: '22px', fontWeight: 700, color: '#0D2147', textAlign: 'center', mb: 1 }
}

type OtpFieldElement = HTMLInputElement | HTMLTextAreaElement

interface OtpContextType {
  triggerGlobalOtp: (retryConfig: any, errorInstance: any) => Promise<any>
}

const OtpContext = createContext<OtpContextType | undefined>(undefined)

let triggerOtpFormOutsideReact: ((retryConfig: any, errorInstance: any) => Promise<any>) | null = null

export const triggerGlobalOtpVerification = (retryConfig: any, errorInstance: any) => {
  if (triggerOtpFormOutsideReact) {
    return triggerOtpFormOutsideReact(retryConfig, errorInstance)
  }
  return Promise.reject(new Error('OtpProvider is not initialized.'))
}

export const OtpProvider = ({ children }: { children: React.ReactNode }) => {
  const OTP_LENGTH = 6
  const [open, setOpen] = useState(false)
  const [otps, setOtps] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [attemptsLeft, setAttemptsLeft] = useState(otpConfig.MAX_OTP_RESEND_ATTEMPTS)
  const [invalidOTPAttemptsLeft, setInvalidOTPAttemptsLeft] = useState(otpConfig.INVALID_OTP_ATTEMPTS)
  const [pendingRequest, setPendingRequest] = useState<any>(null)
  const [errorPayload, setErrorPayload] = useState<any>(null)
  const [resolver, setResolver] = useState<any>(null)

  const otpRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }

    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [open])

  const triggerGlobalOtp = (retryConfig: any, errorInstance: any) => {
    setOpen(true)
    setOtps(Array(OTP_LENGTH).fill(''))
    setError('')
    setLoading(false)
    setPendingRequest(retryConfig)
    setErrorPayload(errorInstance)

    return new Promise((resolve, reject) => {
      setResolver({ resolve, reject })
    })
  }

  triggerOtpFormOutsideReact = triggerGlobalOtp

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

  const handleVerifySubmit = async () => {
    try {
      setLoading(true)
      setError('')
      setInvalidOTPAttemptsLeft((value) => value - 1)
      const headers = errorPayload?.response?.headers
      const challengeId = headers?.['x-2fa-challenge-id']
      const verificationToken = headers?.['x-2fa-verification-token']
      const combinedOtpString = otps.join('')

      const response = await instance.request({
        method: pendingRequest.method,
        url: pendingRequest.url,
        data: pendingRequest.data,
        params: pendingRequest.params,
        headers: {
          ...pendingRequest.headers,
          'x-2fa-challenge-id': challengeId,
          'x-2fa-verification-token': verificationToken,
          'x-2fa-otp': combinedOtpString
        }
      })

      if (response.status === 200) {
        setOpen(false)
        setLoading(false)
        setAttemptsLeft(otpConfig.MAX_OTP_RESEND_ATTEMPTS)
        if (resolver) resolver.resolve(response)
      } else {
        debugger
      }
    } catch (err: any) {
      //     setOpen(false)
      //   setAttemptsLeft(otpConfig.MAX_OTP_RESEND_ATTEMPTS)
      if (
        err.response?.data?.message === 'Invalid OTP' &&
        err.response?.data?.error_code === '2FA_VERIFICATION_FAILED'
      ) {
        setLoading(false)
        setError(err.response?.data?.message || 'Invalid OTP code. Please try again.')
      } else {
        setOpen(false)
        setLoading(false)
        setAttemptsLeft(otpConfig.MAX_OTP_RESEND_ATTEMPTS)
        if (resolver) {
          debugger
          resolver.reject(err)
        }
        setError(err?.response?.data?.message || 'Request Failed. Please try again.')
      }
    }
  }

  const handleClose = () => {
    debugger
    setOpen(false)
    setLoading(false)
    setAttemptsLeft(otpConfig.MAX_OTP_RESEND_ATTEMPTS)
    if (resolver) resolver.reject(new Error('OTP operation cancelled.'))
  }

  //   const handleResendOTP = async () => {
  //     setAttemptsLeft(value => {
  //       debugger
  //       return value - 1
  //     })
  //     if (attemptsLeft !== 0) {
  //       const response = await instance.request({
  //         method: pendingRequest.method,
  //         url: pendingRequest.url,
  //         data: JSON.parse(pendingRequest.data),
  //         params: pendingRequest.params
  //       })

  //       debugger
  //     }
  //   }

  const handleResendOTP = async () => {
    setAttemptsLeft(value => value - 1)

    if (attemptsLeft !== 0) {
      try {
        setError('')

        const response = await instance.request({
          method: pendingRequest.method,
          url: pendingRequest.url,
          data: JSON.parse(pendingRequest.data),
          params: pendingRequest.params,
          // @ts-ignore
          _isResendRequest: true
        })

        if (response && response.headers) {
          setErrorPayload(response)
        }

        setOtps(Array(OTP_LENGTH).fill(''))
        debugger
      } catch (err: any) {
        if (err.response && err.response.headers) {
          setErrorPayload(err)
        }
        setError(err.response?.data?.message || 'Failed to resend authentication code.')
      }
    }
  }

  return (
    <OtpContext.Provider value={{ triggerGlobalOtp }}>
      {children}
      <Dialog
        open={open}
        // onClose={handleClose}
        maxWidth='xs'
        fullWidth
        disableEscapeKeyDown
        PaperProps={{ sx: otpStyles.dialogPaper }}
        disableScrollLock={false}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden'
            }
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={otpStyles.rightPanel}>
            <Box sx={otpStyles.rightLogo}>
              <img src='/images/pages/alhabib.png' alt={themeConfig.templateName} style={{ width: 185, height: 'auto' }} />
            </Box>

            <Typography sx={[otpStyles.otpDescription, { margin: 0 }]}>
              Enter the 6-digit code sent to your phone.
            </Typography>

            <Box
              onPaste={handleOtpPaste}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(6, minmax(38px, 1fr))', sm: 'repeat(6, 1fr)' },
                gap: { xs: 1, sm: 2 },
                my: { xs: 2, sm: 3 }
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

            {error && (
              <Typography sx={{ color: 'error.main', fontSize: '14px', textAlign: 'center', mb: 2 }}>
                {error}
              </Typography>
            )}

            {attemptsLeft !== 0 && (
              <Box sx={otpStyles.resendDescription}>
                <Typography
                  sx={[
                    { mr: 1, color: 'text.secondary' },
                    {
                      fontSize: '15px',
                      color: '#6B7280',
                      lineHeight: 1.6
                    }
                  ]}
                >
                  Didn't get the code?
                </Typography>
                <Typography
                  component='button'
                  type='button'
                  disabled={resendLoading}
                  onClick={() => handleResendOTP()}
                  sx={{
                    ...otpStyles.resendText,
                    p: 0,
                    border: 0,
                    bgcolor: 'transparent',
                    fontFamily: 'inherit',
                    fontSize: '15px',
                    '&:disabled': { opacity: 0.6, cursor: 'not-allowed' }
                  }}
                >
                  {resendLoading ? 'Resending...' : 'Resend'}
                </Typography>
              </Box>
            )}

            <Typography
              sx={[
                { margin: 0 },
                otpStyles.otpDescription,
                { textAlign: 'center' },
                { fontSize: '15px' },
                attemptsLeft === 0 ? { color: 'red' } : { color: '#6B7280' }
              ]}
            >
              {attemptsLeft === 0 ? 'Resend Activity Blocked.' : `${attemptsLeft} Max OTP Resend Attempts Left`}
            </Typography>

            {/* <Typography
              sx={[
                { margin: 0 },
                otpStyles.otpDescription,
                { textAlign: 'center' },
                { fontSize: '15px' },
                invalidOTPAttemptsLeft === 0 ? { color: 'red' } : { color: '#6B7280' }
              ]}
            >
              {invalidOTPAttemptsLeft === 0
                ? 'Your OTP count has been exhausted. Please try again after sometime'
                : `${invalidOTPAttemptsLeft} Max Invalid OTP Attempts Left`}
            </Typography> */}

            <Box display={'flex'} flexDirection={'row'} gap={1.5}>
              <LoadingButton
                fullWidth
                variant='contained'
                size='large'
                loading={loading}
                onClick={handleVerifySubmit}
                // disabled={loading || otps.some(digit => digit === '') || invalidOTPAttemptsLeft === 0}
                disabled={loading || otps.some(digit => digit === '')}
                loadingIndicator={<CircularProgress size={22} color='inherit' />}
                sx={otpStyles.confirmButton}
              >
                Confirm
              </LoadingButton>

              <LoadingButton
                fullWidth
                variant='contained'
                size='large'
                sx={{ height: 50, mt: 2, borderRadius: '10px', fontWeight: 600 }}
                onClick={handleClose}
                color='warning'
              >
                Cancel
              </LoadingButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </OtpContext.Provider>
  )
}
