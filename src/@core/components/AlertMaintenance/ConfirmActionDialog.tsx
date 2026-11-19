
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'

interface ConfirmActionDialogProps {
  open: boolean
  title: string
  message: React.ReactNode
  confirmLabel?: string
  confirmColor?: 'primary' | 'warning' | 'error' | 'success'
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

const ConfirmActionDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Yes, continue',
  confirmColor = 'primary',
  loading = false,
  onConfirm,
  onClose
}: ConfirmActionDialogProps) => (
  <Dialog open={open} fullWidth maxWidth='xs' onClose={loading ? undefined : onClose}>
    <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
    <DialogContent>
      <Typography variant='body2' color='text.secondary' component='div'>
        {message}
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button variant='outlined' color='secondary' disabled={loading} onClick={onClose}>
        No, go back
      </Button>
      <Button
        variant='contained'
        disableElevation
        color={confirmColor}
        disabled={loading}
        onClick={onConfirm}
        startIcon={loading ? <CircularProgress size={16} color='inherit' /> : undefined}
      >
        {loading ? 'Please wait...' : confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
)

export default ConfirmActionDialog