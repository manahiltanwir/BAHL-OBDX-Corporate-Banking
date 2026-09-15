import { ReactNode } from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

type ConfirmDialogProps = {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    message: ReactNode
    title?: string
    loading?: boolean
    confirmText?: string
    cancelText?: string
    confirmColor?: 'primary' | 'error' | 'warning' | 'success' | 'inherit'
}

const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    message,
    title = 'Confirm',
    loading = false,
    confirmText = 'Yes',
    cancelText = 'Cancel',
    confirmColor = 'primary'
}: ConfirmDialogProps) => {
    return (
        <Dialog open={open} onClose={() => !loading && onClose()} maxWidth='xs' fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} disabled={loading} color='inherit'>
                    {cancelText}
                </Button>
                <Button onClick={onConfirm} variant='contained' color={confirmColor} disabled={loading}>
                    {loading ? <CircularProgress size={21} color='inherit' /> : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog