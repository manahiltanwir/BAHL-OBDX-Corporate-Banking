import LoadingButton from "@mui/lab/LoadingButton"
import { Box, CircularProgress, keyframes, OutlinedInput, Typography } from "@mui/material"
import { ChangeEvent, ClipboardEvent, KeyboardEvent, useRef, useState } from "react"
import MuiLink from '@mui/material/Link'


// ** Animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const otpStyles = {
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

type OtpFieldElement = HTMLInputElement | HTMLTextAreaElement

const OtpVerification = ({ setOtps, otps, handleSubmitLogin, setIsOTPRequired }: any) => {


    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [successOpen, setSuccessOpen] = useState(false)

    const otpRefs = useRef<Array<HTMLInputElement | null>>([])
    const OTP_LENGTH = 6

    const handleOtpChange = (event: ChangeEvent<OtpFieldElement>, index: number) => {
        const digit = event.target.value.replace(/\D/g, '').slice(-1)

        // @ts-ignore
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

        // @ts-ignore
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


    return (
        <Box sx={otpStyles.subPage}>
            <Box sx={otpStyles.rightPanel}>
                <Box sx={otpStyles.rightLogo}>
                    <img src='/images/pages/alhabib.png' alt='Bank AL Habib' style={{ width: 185, height: 'auto' }} />
                </Box>
                <Typography sx={otpStyles.otpDescription}>
                    Enter the 6-digit code sent to your phone.
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
                    {otps.map((digit: any, index: any) => (
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
                    onClick={() => handleSubmitLogin()}
                    // @ts-ignore
                    disabled={loading || otps.some(digit => digit === '')}
                    loadingIndicator={<CircularProgress size={22} color='inherit' />}
                    sx={otpStyles.confirmButton}
                >
                    Confirm
                </LoadingButton>

                <Box sx={otpStyles.resendDescription}>
                    <Typography sx={{ mr: 1, color: 'text.secondary' }}>Didn't get the code?</Typography>
                    <Typography
                        component='button'
                        type='button'
                        disabled={resendLoading}
                        onClick={() => console.log('Resend Otp Btn Clicked!')}
                        sx={{
                            ...otpStyles.resendText,
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

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, textDecoration: 'underline' }} onClick={() => {
                    setIsOTPRequired(false)
                    setOtps(Array(OTP_LENGTH).fill(''))
                }}>
                    <Typography component={MuiLink} sx={{ color: '#009B63', fontWeight: 600, textDecoration: 'none' }}>
                        Back to Login
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default OtpVerification;