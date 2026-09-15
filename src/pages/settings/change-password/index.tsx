import { FormEvent, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
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
import UserServices from 'src/services/Userservices'
import { useAuth } from 'src/hooks/useAuth'
import ConfirmDialog from 'src/@core/components/Confirmdialog'


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
  const auth = useAuth()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [visible, setVisible] = useState({ current: false, new: false, confirm: false })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  const toggleVisible = (field: keyof typeof visible) =>
    setVisible(prev => ({ ...prev, [field]: !prev[field] }))

  const resetFields = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleOpenConfirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearMessages()

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields.')

      return
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.')

      return
    }

    setConfirmOpen(true)
  }

  const handleCloseConfirm = () => {
    if (!loading) setConfirmOpen(false)
  }

  const handleConfirmChangePassword = async () => {
    setLoading(true)

    try {
      await UserServices.changePassword({
        userId: auth.user?.userId,
        oldPassword: currentPassword,
        newPassword,
        updatedBy: auth.user?.username
      } as any)

      setSuccess('Password changed successfully.')
      resetFields()
      setConfirmOpen(false)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to change password. Please try again.')
      setConfirmOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h5' sx={{ mb: 1, fontWeight: 600 }}>
          Change Password
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Enter your current password and create a secure new password.
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
                Update Your Password
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Enter your current password, then choose a new one.
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
            <Alert
              severity='success'
              icon={<CheckCircleOutline fontSize='inherit' />}
              onClose={() => setSuccess('')}
              sx={{ mb: 4 }}
            >
              {success}
            </Alert>
          )}

          <Box component='form' noValidate autoComplete='off' onSubmit={handleOpenConfirm}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
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

              <Grid item xs={12} md={6}>
                <PasswordField
                  label='New Password'
                  placeholder='Enter new password'
                  value={newPassword}
                  disabled={loading}
                  visible={visible.new}
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
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    size='large'
                    type='submit'
                    variant='contained'
                    disabled={loading}
                    sx={{ width: { xs: '100%', sm: 'auto' }, px: 5, fontWeight: 600, textTransform: 'none' }}
                  >
                    Change Password
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmChangePassword}
        loading={loading}
        message='Are you sure you want to change your password?'
      />
    </Box>
  )
}

ChangePassword.acl = {
  action: 'itsHaveAccess',
  subject: 'change-password'
}

export default ChangePassword