import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { ApprovalActionType } from 'src/types/apps/approvalActivity'
import { ApprovalRequest, colors } from '../Types'

interface ActionDialogProps {
  target: ApprovalRequest | null
  action: ApprovalActionType | null
  remarks: string
  submitting: boolean
  isMobile: boolean
  onRemarksChange: (value: string) => void
  onCancel: () => void
  onConfirm: () => void
}

const ActionDialog = ({ target, action, remarks, submitting, isMobile, onRemarksChange, onCancel, onConfirm }: ActionDialogProps) => {
  const isApprove = action === 'APPROVE'
  const accent = isApprove ? colors.green : colors.danger
  const accentHover = isApprove ? colors.greenHover : colors.dangerHover

  return (
    <Dialog open={!!target && !!action} onClose={submitting ? undefined : onCancel} fullWidth maxWidth='sm' fullScreen={isMobile}>
      <DialogTitle sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>
        {isApprove ? 'Approve' : 'Reject'} Request {target?.id}
      </DialogTitle>
      <DialogContent>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          {isApprove
            ? 'Please add remarks for approving this request. This will be visible to the maker.'
            : 'Please provide a reason for rejecting this request. This will be visible to the maker.'}
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={3}
          autoFocus
          label='Remarks'
          placeholder={
            isApprove
              ? 'e.g. Documents verified, amount limits cleared.'
              : 'e.g. Missing supporting documents, incorrect beneficiary details...'
          }
          value={remarks}
          onChange={event => onRemarksChange(event.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
        <Button fullWidth={isMobile} onClick={onCancel} disabled={submitting} sx={{ color: 'text.secondary' }}>
          Cancel
        </Button>
        <LoadingButton
          fullWidth={isMobile}
          variant='contained'
          loading={submitting}
          disabled={!remarks.trim()}
          onClick={onConfirm}
          sx={{ bgcolor: accent, '&:hover': { bgcolor: accentHover } }}
        >
          {isApprove ? 'Confirm Approve' : 'Confirm Reject'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default ActionDialog