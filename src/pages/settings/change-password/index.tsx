import { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'
import Alert from '@mui/material/Alert'
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
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import LockCheckOutline from 'mdi-material-ui/LockCheckOutline'
import CheckCircleOutline from 'mdi-material-ui/CheckCircleOutline'

export const CHANGE_PASSWORD_STORAGE_KEY = 'changePasswordData'

const TEST_CURRENT_PASSWORD = '123456' // TODO: remove once /api/verify-password is wired up

interface PasswordFieldProps {
  label: string
  value: string
  placeholder: string
  disabled: boolean
  visible: boolean
  onChange: (value: string) => void
  onToggleVisible: () => void
  autoFocus?: boolean
  helperText?: string
}

const PasswordField = ({
  label,
  value,
  placeholder,
  disabled,
  visible,
  onChange,
  onToggleVisible,
  autoFocus,
  helperText
}: PasswordFieldProps) => (
  <Box>
    <Typography variant='body2' sx={{ mb: 1.5, fontWeight: 600 }}>
      {label}
    </Typography>
    <TextField
      fullWidth
      autoFocus={autoFocus}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      type={visible ? 'text' : 'password'}
      helperText={helperText}
      onChange={event => onChange(event.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              edge='end'
              disabled={disabled}
              aria-label={`Show or hide ${label.toLowerCase()}`}
              onClick={onToggleVisible}
            >
              {visible ? <EyeOffOutline /> : <EyeOutline />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  </Box>
)

const ChangePassword = () => {
  const router = useRouter()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [visible, setVisible] = useState({ current: false, new: false, confirm: false })

  const [isVerified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  const toggleVisible = (field: keyof typeof visible) =>
    setVisible(prev => ({ ...prev, [field]: !prev[field] }))

  const handleVerifyPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearMessages()

    if (!currentPassword.trim()) {
      setError('Please enter your current password.')

      return
    }

    setLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 600))

      if (currentPassword !== TEST_CURRENT_PASSWORD) {
        setError('Current password is incorrect.')

        return
      }

      setIsVerified(true)
      setSuccess('Current password verified successfully.')
    } catch {
      setError('Unable to verify current password.')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
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

    setLoading(true)

    try {
      sessionStorage.setItem(CHANGE_PASSWORD_STORAGE_KEY, JSON.stringify({ currentPassword, newPassword }))
      await router.push({ pathname: '/settings/change-password/change-otp', query: { purpose: 'change-otp' } })
    } catch {
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
    <Box sx={{ width: '100%', p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h5' sx={{ mb: 1, fontWeight: 600 }}>
          Change Password
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Verify your current password and create a secure new password.
        </Typography>
      </Box>

      <Card sx={{ width: '100%', borderRadius: 2, boxShadow: theme => theme.shadows[2] }}>
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 }, '&:last-child': { pb: { xs: 3, sm: 4, md: 5 } } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, mb: 3 }}>
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
              <Typography variant='h6' sx={{ mb: 0.5, fontWeight: 600 }}>
                {isVerified ? 'Create New Password' : 'Verify Current Password'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {isVerified
                  ? 'Enter and confirm your new account password.'
                  : 'Enter your existing account password to continue.'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {error && (
            <Alert severity='error' onClose={() => setError('')} sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity='success' icon={<CheckCircleOutline fontSize='inherit' />} onClose={() => setSuccess('')} sx={{ mb: 4 }}>
              {success}
            </Alert>
          )}

          {!isVerified ? (
            <Box component='form' noValidate autoComplete='off' onSubmit={handleVerifyPassword}>
              <Grid container spacing={3} alignItems='flex-end'>
                <Grid item xs={12} md={8}>
                  <PasswordField
                    label='Current Password'
                    placeholder='Enter current password'
                    value={currentPassword}
                    disabled={loading}
                    visible={visible.current}
                    autoFocus
                    onChange={value => {
                      setCurrentPassword(value)
                      if (error) setError('')
                    }}
                    onToggleVisible={() => toggleVisible('current')}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', justifyContent: { xs: 'stretch', md: 'flex-end' } }}>
                    <Button
                      fullWidth
                      size='large'
                      type='submit'
                      variant='contained'
                      disabled={loading}
                      sx={{ maxWidth: { md: 220 }, fontWeight: 600, textTransform: 'none' }}
                    >
                      {loading ? <CircularProgress size={21} color='inherit' /> : 'Verify Password'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box component='form' noValidate autoComplete='off' onSubmit={handleChangePassword}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <PasswordField
                    label='New Password'
                    placeholder='Enter new password'
                    helperText='Use at least 8 characters.'
                    value={newPassword}
                    disabled={loading}
                    visible={visible.new}
                    autoFocus
                    onChange={value => {
                      setNewPassword(value)
                      if (error) setError('')
                    }}
                    onToggleVisible={() => toggleVisible('new')}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <PasswordField
                    label='Confirm New Password'
                    placeholder='Confirm new password'
                    value={confirmPassword}
                    disabled={loading}
                    visible={visible.confirm}
                    onChange={value => {
                      setConfirmPassword(value)
                      if (error) setError('')
                    }}
                    onToggleVisible={() => toggleVisible('confirm')}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      mt: 1,
                      display: 'flex',
                      gap: 2,
                      justifyContent: 'flex-end',
                      flexDirection: { xs: 'column-reverse', sm: 'row' }
                    }}
                  >
                    <Button
                      size='large'
                      variant='outlined'
                      disabled={loading}
                      onClick={handleBack}
                      sx={{ width: { xs: '100%', sm: 'auto' }, px: 5, fontWeight: 600, textTransform: 'none' }}
                    >
                      Back
                    </Button>

                    <Button
                      size='large'
                      type='submit'
                      variant='contained'
                      disabled={loading}
                      sx={{ width: { xs: '100%', sm: 'auto' }, px: 5, fontWeight: 600, textTransform: 'none' }}
                    >
                      {loading ? <CircularProgress size={21} color='inherit' /> : 'Change Password'}
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