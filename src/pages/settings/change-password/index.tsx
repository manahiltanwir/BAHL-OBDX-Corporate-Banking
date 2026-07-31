// ** React Imports
import { FormEvent, useState } from 'react'

// ** MUI Imports
import Alert from '@mui/material/Alert'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import LockCheckOutline from 'mdi-material-ui/LockCheckOutline'
import CheckCircleOutline from 'mdi-material-ui/CheckCircleOutline'

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
const router = useRouter()
  const [isVerified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState(false)

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  const handleVerifyPassword = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    clearMessages()

    if (!currentPassword.trim()) {
      setError('Please enter your current password.')

      return
    }

    try {
      setLoading(true)

      /*
       * Replace this temporary logic with your API:
       *
       * const response = await axios.post('/api/verify-password', {
       *   currentPassword
       * })
       *
       * if (!response.data.success) {
       *   setError(
       *     response.data.message || 'Current password is incorrect.'
       *   )
       *
       *   return
       * }
       */

      await new Promise(resolve => setTimeout(resolve, 600))

      // Temporary password for frontend testing
     if (currentPassword !== '123456') {
  setError('Current password is incorrect.')

  return
}

setIsVerified(true)

      setIsVerified(true)
      setSuccess('Current password verified successfully.')
    } catch (error) {
      setError('Unable to verify current password.')
    } finally {
      setLoading(false)
    }
  }

 const handleChangePassword = async (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault()
  clearMessages()

  if (!newPassword.trim() || !confirmPassword.trim()) {
    setError('Please enter and confirm your new password.')

    return
  }

  if (newPassword.length < 8) {
    setError('New password must contain at least 8 characters.')

    return
  }

  if (newPassword !== confirmPassword) {
    setError('New password and confirm password do not match.')

    return
  }

  if (newPassword === currentPassword) {
    setError('New password must be different from current password.')

    return
  }

  try {
    setLoading(true)

    sessionStorage.setItem(
      'changePasswordData',
      JSON.stringify({
        currentPassword,
        newPassword
      })
    )

    await router.push({
      pathname: '/settings/change-password/change-otp',
      query: {
        purpose: 'change-otp'
      }
    })
  } catch (error) {
    setError('Unable to send OTP. Please try again.')
  } finally {
    setLoading(false)
  }
}

const handleBack = () => {
  clearMessages()
  setNewPassword('')
  setConfirmPassword('')
  setIsVerified(false)
}
  return (
    <Box
      sx={{
        width: '100%',
        p: {
          xs: 2,
          sm: 3,
          md: 4
        }
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant='h5'
          sx={{
            mb: 1,
            fontWeight: 600
          }}
        >
          Change Password
        </Typography>

        <Typography variant='body2' color='text.secondary'>
          Verify your current password and create a secure new password.
        </Typography>
      </Box>

      <Card
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: theme => theme.shadows[2]
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 3,
              sm: 4,
              md: 5
            },
            '&:last-child': {
              pb: {
                xs: 3,
                sm: 4,
                md: 5
              }
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2.5,
              mb: 3
            }}
          >
            <Box
              sx={{
                p: 2,
                display: 'flex',
                flexShrink: 0,
                borderRadius: 1.5,
                alignItems: 'center',
                justifyContent: 'center',
                color: 'common.white',
                bgcolor: 'primary.main'
              }}
            >
              <LockCheckOutline />
            </Box>

            <Box>
              <Typography
                variant='h6'
                sx={{
                  mb: 0.5,
                  fontWeight: 600
                }}
              >
                {isVerified
                  ? 'Create New Password'
                  : 'Verify Current Password'}
              </Typography>

              <Typography variant='body2' color='text.secondary'>
                {isVerified
                  ? 'Enter and confirm your new account password.'
                  : 'Enter your existing account password to continue.'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {error ? (
            <Alert
              severity='error'
              onClose={() => setError('')}
              sx={{ mb: 4 }}
            >
              {error}
            </Alert>
          ) : null}

          {success ? (
            <Alert
              severity='success'
              icon={<CheckCircleOutline fontSize='inherit' />}
              onClose={() => setSuccess('')}
              sx={{ mb: 4 }}
            >
              {success}
            </Alert>
          ) : null}

          {!isVerified ? (
            <Box
              component='form'
              noValidate
              autoComplete='off'
              onSubmit={handleVerifyPassword}
            >
              <Grid container spacing={3} alignItems='flex-end'>
                <Grid item xs={12} md={8}>
                  <Typography
                    variant='body2'
                    sx={{
                      mb: 1.5,
                      fontWeight: 600
                    }}
                  >
                    Current Password
                  </Typography>

                  <TextField
                    fullWidth
                    autoFocus
                    value={currentPassword}
                    disabled={loading}
                    placeholder='Enter current password'
                    type={showCurrentPassword ? 'text' : 'password'}
                    onChange={event => {
                      setCurrentPassword(event.target.value)

                      if (error) {
                        setError('')
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            disabled={loading}
                            aria-label='Show or hide current password'
                            onClick={() =>
                              setShowCurrentPassword(previous => !previous)
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOffOutline />
                            ) : (
                              <EyeOutline />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: {
                        xs: 'stretch',
                        md: 'flex-end'
                      }
                    }}
                  >
                    <Button
                      fullWidth
                      size='large'
                      type='submit'
                      variant='contained'
                      disabled={loading}
                      sx={{
                        maxWidth: {
                          md: 220
                        },
                        fontWeight: 600,
                        textTransform: 'none'
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={21} color='inherit' />
                      ) : (
                        'Verify Password'
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box
              component='form'
              noValidate
              autoComplete='off'
              onSubmit={handleChangePassword}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant='body2'
                    sx={{
                      mb: 1.5,
                      fontWeight: 600
                    }}
                  >
                    New Password
                  </Typography>

                  <TextField
                    fullWidth
                    autoFocus
                    value={newPassword}
                    disabled={loading}
                    placeholder='Enter new password'
                    type={showNewPassword ? 'text' : 'password'}
                    helperText='Use at least 8 characters.'
                    onChange={event => {
                      setNewPassword(event.target.value)

                      if (error) {
                        setError('')
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            disabled={loading}
                            aria-label='Show or hide new password'
                            onClick={() =>
                              setShowNewPassword(previous => !previous)
                            }
                          >
                            {showNewPassword ? (
                              <EyeOffOutline />
                            ) : (
                              <EyeOutline />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    variant='body2'
                    sx={{
                      mb: 1.5,
                      fontWeight: 600
                    }}
                  >
                    Confirm New Password
                  </Typography>

                  <TextField
                    fullWidth
                    value={confirmPassword}
                    disabled={loading}
                    placeholder='Confirm new password'
                    type={showConfirmPassword ? 'text' : 'password'}
                    onChange={event => {
                      setConfirmPassword(event.target.value)

                      if (error) {
                        setError('')
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            disabled={loading}
                            aria-label='Show or hide confirm password'
                            onClick={() =>
                              setShowConfirmPassword(previous => !previous)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOffOutline />
                            ) : (
                              <EyeOutline />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      mt: 1,
                      display: 'flex',
                      gap: 2,
                      justifyContent: 'flex-end',
                      flexDirection: {
                        xs: 'column-reverse',
                        sm: 'row'
                      }
                    }}
                  >
                    <Button
                      size='large'
                      variant='outlined'
                      disabled={loading}
                      onClick={handleBack}
                      sx={{
                        width: {
                          xs: '100%',
                          sm: 'auto'
                        },
                        px: 5,
                        fontWeight: 600,
                        textTransform: 'none'
                      }}
                    >
                      Back
                    </Button>

                    <Button
                      size='large'
                      type='submit'
                      variant='contained'
                      disabled={loading}
                      sx={{
                        width: {
                          xs: '100%',
                          sm: 'auto'
                        },
                        px: 5,
                        fontWeight: 600,
                        textTransform: 'none'
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={21} color='inherit' />
                      ) : (
                        'Change Password'
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

ChangePassword.acl = {
  action: 'itsHaveAccess',
  subject: 'change-password'
}

export default ChangePassword