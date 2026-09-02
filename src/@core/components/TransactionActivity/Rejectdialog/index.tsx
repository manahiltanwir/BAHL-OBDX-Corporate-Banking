import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { ApprovalRequest, colors } from '../Types'

interface RejectDialogProps {
  target: ApprovalRequest | null
  reason: string
  submitting: boolean
  isMobile: boolean
  onReasonChange: (value: string) => void
  onCancel: () => void
  onConfirm: () => void
}

const RejectDialog = ({ target, reason, submitting, isMobile, onReasonChange, onCancel, onConfirm }: RejectDialogProps) => (
  <Dialog open={!!target} onClose={onCancel} fullWidth maxWidth='sm' fullScreen={isMobile}>
    <DialogTitle sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>Reject Request {target?.id}</DialogTitle>
    <DialogContent>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Please provide a reason for rejecting this request. This will be visible to the maker.
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={3}
        autoFocus
        placeholder='e.g. Missing supporting documents, incorrect beneficiary details...'
        value={reason}
        onChange={event => onReasonChange(event.target.value)}
      />
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3, flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
      <Button fullWidth={isMobile} onClick={onCancel} sx={{ color: 'text.secondary' }}>
        Cancel
      </Button>
      <LoadingButton
        fullWidth={isMobile}
        variant='contained'
        loading={submitting}
        disabled={!reason.trim()}
        onClick={onConfirm}
        sx={{ bgcolor: colors.danger, '&:hover': { bgcolor: colors.dangerHover } }}
      >
        Confirm Reject
      </LoadingButton>
    </DialogActions>
  </Dialog>
)

export default RejectDialog