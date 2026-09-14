import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

interface CreateRoleModalProps {
    open: boolean
    enterpriseRoleName: string
    isSubmitting: boolean
    onClose: () => void
    onSubmit: (roleName: string) => void
}

export function CreateRoleModal({ open, enterpriseRoleName, isSubmitting, onClose, onSubmit }: CreateRoleModalProps) {
    const [roleName, setRoleName] = useState('')
    const [error, setError] = useState('')

    // reset the field every time the modal is opened
    useEffect(() => {
        if (open) {
            setRoleName('')
            setError('')
        }
    }, [open])

    const handleSubmit = () => {
        const trimmed = roleName.trim()
        if (!trimmed) {
            setError('Role name is required.')
            return
        }
        onSubmit(trimmed)
    }

    return (
        <Dialog open={open} onClose={isSubmitting ? undefined : onClose} maxWidth='xs' fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>Create New Role</DialogTitle>
            <DialogContent>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    This role will be created under <b>{enterpriseRoleName}</b>.
                </Typography>
                <TextField
                    autoFocus
                    fullWidth
                    size='small'
                    label='Role Name'
                    placeholder='e.g., CPU Checker'
                    value={roleName}
                    onChange={e => {
                        setRoleName(e.target.value)
                        if (error) setError('')
                    }}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    error={Boolean(error)}
                    helperText={error}
                    disabled={isSubmitting}
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} variant='outlined' color='inherit' disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant='contained'
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={16} color='inherit' /> : undefined}
                >
                    {isSubmitting ? 'Creating...' : 'Create Role'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}