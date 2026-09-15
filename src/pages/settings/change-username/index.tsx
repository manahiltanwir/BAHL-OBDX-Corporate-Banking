import { FormEvent, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AccountEditOutline from 'mdi-material-ui/AccountEditOutline'
import CheckCircleOutline from 'mdi-material-ui/CheckCircleOutline'
import UserServices from 'src/services/Userservices'
import { useAuth } from 'src/hooks/useAuth'
import ConfirmDialog from 'src/@core/components/Confirmdialog'


const ChangeUsername = () => {
  const auth = useAuth()

  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Local copy of the "current" username so the field updates immediately
  // after a successful change, without waiting on the auth store.
  const [currentUsername, setCurrentUsername] = useState(auth.user?.username || '')

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  // Step 1: form submit -> just open the confirmation popup
  const handleOpenConfirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearMessages()

    if (!username.trim()) {
      setError('Please enter a new username.')

      return
    }

    setConfirmOpen(true)
  }

  const handleCloseConfirm = () => {
    if (!loading) setConfirmOpen(false)
  }

  // Step 2: user confirms in the popup -> actual API call
  const handleConfirmChangeUsername = async () => {
    setLoading(true)

    try {
      await UserServices.changeUsername({
        userId: auth.user?.userId,
        username,
        updatedBy: auth.user?.username
      })

      // Reflect the new username in the "Current Username" field right away
      setCurrentUsername(username)

      // Keep the auth context in sync so it's correct app-wide without a refresh...
      const updatedUser = { ...auth.user, username }
      auth.setUser(updatedUser)

      // ...and persist it, since AuthProvider re-hydrates `user` from
      // localStorage('userData') on page load/refresh.
      window.localStorage.setItem('userData', JSON.stringify(updatedUser))

      setSuccess('Username changed successfully.')
      setUsername('')
      setConfirmOpen(false)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to change username. Please try again.')
      setConfirmOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h5' sx={{ mb: 1, fontWeight: 600 }}>
          Change Username
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Choose a new username for your account.
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
              <AccountEditOutline />
            </Box>
            <Box>
              <Typography variant='h6' sx={{ mb: 0.5, fontWeight: 600 }}>
                Update Your Username
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Enter the new username you'd like to use.
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
              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ mb: 1.5, fontWeight: 600 }}>
                  Current Username
                </Typography>
                <TextField fullWidth disabled value={currentUsername} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant='body2' sx={{ mb: 1.5, fontWeight: 600 }}>
                  New Username
                </Typography>
                <TextField
                  fullWidth
                  autoFocus
                  value={username}
                  disabled={loading}
                  placeholder='Enter new username'
                  onChange={event => {
                    setUsername(event.target.value)
                    if (error) setError('')
                  }}
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
                    Change Username
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
        onConfirm={handleConfirmChangeUsername}
        loading={loading}
        message='Are you sure you want to change your username?'
      />
    </Box>
  )
}

ChangeUsername.acl = {
  action: 'itsHaveAccess',
  subject: 'change-username'
}

export default ChangeUsername