import React, { useState } from 'react'
import { Box, Typography, Button, TextField, Alert, CircularProgress, Paper, Divider } from '@mui/material'

import QRCode from 'qrcode'
import { generateSecret, generateURI, verify } from 'otplib'
import { useAuth } from 'src/hooks/useAuth'
import instance from 'src/services/httpService'

export default function EnableGoogleAuthView() {
    const [step, setStep] = useState(1)
    const [qrCode, setQrCode] = useState('')
    const [secretKey, setSecretKey] = useState('')
    const [verifyCode, setVerifyCode] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const { user } = useAuth()

    // const handleStartSetup = async () => {
    //     try {
    //         setLoading(true)
    //         setError('')
    //         const secret = generateSecret()

    //         const otpauthUri = generateURI({
    //             issuer: 'BAHL Al Habib International Connect',
    //             label: user.username,
    //             secret,
    //         })
    //         const qrDataUrl = await QRCode.toDataURL(otpauthUri)
    //         setSecretKey(secret)
    //         setQrCode(qrDataUrl)

    //         setStep(2)

    //     } catch (err) {
    //         console.error(err)
    //         setError('QR Code generate nahi ho saka.')
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    const handleStartSetup = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await instance.post('/api/auth/google-auth/setup')

            setQrCode(response.data.qrCodeDataUrl)

            setStep(2)

        } catch (err: any) {
            setError(
                err.response?.data?.message || 'Setup failed'
            )
        } finally {
            setLoading(false)
        }
    }


    const handleVerify = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await instance.post('/api/auth/google-auth/verify-setup',{code: verifyCode})

            if (response.data.success) {
                setSuccess(true)
                setStep(3)
            }

        } catch (err: any) {
            setError(
                err.response?.data?.message || 'Invalid OTP'
            )
        } finally {
            setLoading(false)
        }
    }

    // const handleVerify = async () => {
    //     try {
    //         setLoading(true)
    //         setError('')

    //         const result = await verify({
    //             token: verifyCode,
    //             secret: secretKey
    //         })

    //         if (result.valid) {
    //             setSuccess(true)
    //             setStep(3)
    //         } else {
    //             setError('Invalid code! Please check Google Authenticator Code')
    //         }

    //     } catch (err) {
    //         console.error(err)
    //         setError('OTP verification failed.')
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    const handleReset = () => {
        setStep(1)
        setQrCode('')
        setSecretKey('')
        setVerifyCode('')
        setError('')
        setSuccess(false)
    }

    return (
        <Paper
            elevation={2}
            sx={{
                maxWidth: 450,
                mx: 'auto',
                mt: 5,
                p: 4,
                borderRadius: 3,
                textAlign: 'center'
            }}
        >
            <Typography variant="h5" fontWeight={700} mb={3}>
                Google Authenticator Setup
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* STEP 1 */}
            {step === 1 && (
                <>
                    <Typography color="text.secondary" mb={3}>
                        Enable two-factor authentication using Google Authenticator.
                        Scan a QR code and verify your account.
                    </Typography>

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleStartSetup}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={22} color="inherit" />
                        ) : (
                            'Generate QR Code'
                        )}
                    </Button>
                </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
                <>
                    <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                        Open Google Authenticator on your mobile and scan this QR code.
                    </Alert>

                    <Typography fontWeight={600} mb={2}>
                        Scan QR Code
                    </Typography>

                    {qrCode && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mb: 3
                            }}
                        >
                            <img
                                src={qrCode}
                                alt="Google Authenticator QR Code"
                                width={220}
                                height={220}
                            />
                        </Box>
                    )}

                    <Divider sx={{ mb: 2 }}>
                        OR
                    </Divider>

                    <Typography variant="body2" color="text.secondary" mb={1}>
                        Enter this key manually in Google Authenticator
                    </Typography>

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            mb: 3,
                            bgcolor: 'grey.100',
                            wordBreak: 'break-all'
                        }}
                    >
                        <Typography
                            fontFamily="monospace"
                            fontWeight={700}
                        >
                            {secretKey}
                        </Typography>
                    </Paper>

                    <Typography fontWeight={600} mb={2}>
                        Enter 6-digit code from your mobile
                    </Typography>

                    <TextField
                        fullWidth
                        placeholder="000000"
                        value={verifyCode}
                        onChange={e =>
                            setVerifyCode(
                                e.target.value.replace(/\D/g, '').slice(0, 6)
                            )
                        }
                        inputProps={{
                            maxLength: 6,
                            inputMode: 'numeric',
                            style: {
                                textAlign: 'center',
                                letterSpacing: 8,
                                fontSize: 22,
                                fontWeight: 700
                            }
                        }}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        disabled={verifyCode.length !== 6 || loading}
                        onClick={handleVerify}
                    >
                        {loading ? (
                            <CircularProgress size={22} color="inherit" />
                        ) : (
                            'Verify & Activate'
                        )}
                    </Button>

                    <Button
                        fullWidth
                        sx={{ mt: 1 }}
                        color="inherit"
                        onClick={handleReset}
                    >
                        Cancel Setup
                    </Button>
                </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
                <>
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Google Authenticator successfully verified!
                    </Alert>

                    <Typography color="text.secondary" mb={3}>
                        Your Google Authenticator demo setup is complete.
                    </Typography>

                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleReset}
                    >
                        Test Again
                    </Button>
                </>
            )}
        </Paper>
    )
}
