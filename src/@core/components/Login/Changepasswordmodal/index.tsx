import { useState } from 'react'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import { useAuth } from 'src/hooks/useAuth'
import PasswordInput from '../Passwordinput'  

const changePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(5, 'Password must be at least 5 characters').required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .required('Please re-enter the new password')
})

interface ChangePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface ChangePasswordModalProps {
  open: boolean
  onClose: () => void
  token: string
}

const ChangePasswordModal = ({ open, onClose, token }: ChangePasswordModalProps) => {
  const [submitting, setSubmitting] = useState(false)
  const auth = useAuth()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ChangePasswordFormData>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onBlur',
    resolver: yupResolver(changePasswordSchema)
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = (data: ChangePasswordFormData) => {
    setSubmitting(true)
    auth.forceChangePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmPassword
      },
      token,
      (error: any) => {
        setSubmitting(false)
        toast.error(error?.message || 'Failed to change password')
      }
    )
    // On success, AuthContext's saveLogin() redirects the user itself.
  }

  const fields = [
    { name: 'currentPassword' as const, label: 'Current Password' },
    { name: 'newPassword' as const, label: 'New Password' },
    { name: 'confirmPassword' as const, label: 'Re-enter New Password' }
  ]

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xs'>
      <DialogTitle>Change Password Required</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <Typography variant='body2' color='text.secondary'>
            For security reasons, you must change your password before continuing.
          </Typography>

          {fields.map(({ name, label }) => (
            <FormControl fullWidth key={name}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>{label}</Typography>
              <Controller
                name={name}
                control={control}
                render={({ field }) => <PasswordInput field={field} error={!!errors[name]} />}
              />
              {errors[name] && (
                <Typography color='error' sx={{ fontSize: 12, mt: 0.5 }}>
                  {errors[name]?.message}
                </Typography>
              )}
            </FormControl>
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <LoadingButton type='submit' variant='contained' loading={submitting} sx={{ bgcolor: '#105f3b' }}>
            Update Password
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ChangePasswordModal