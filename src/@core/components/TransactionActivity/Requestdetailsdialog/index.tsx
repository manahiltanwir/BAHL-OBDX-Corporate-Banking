import React from 'react'
import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Typography } from '@mui/material'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LoadingButton from '@mui/lab/LoadingButton'
import { ApprovalRequest, colors, formatAmount, statusChipStyle } from '../Types'
import { StyledInfoLabel } from '../Styled'

interface RequestDetailsDialogProps {
  request: ApprovalRequest | null
  isMobile: boolean
  processingId: string | null
  canAction?: boolean
  onClose: () => void
  onApprove: (request: ApprovalRequest) => void
  onReject: (request: ApprovalRequest) => void
}

const Field = ({ label, value, mono = false, xs = 12, sm = 6 }: { label: string; value?: React.ReactNode; mono?: boolean; xs?: number; sm?: number }) => {
  if (value === undefined || value === null || value === '') return null

  return (
    <Grid item xs={xs} sm={sm}>
      <StyledInfoLabel>{label}</StyledInfoLabel>
      <Typography sx={{ fontWeight: 600, fontFamily: mono ? 'monospace' : undefined, overflowWrap: 'anywhere' }}>{value}</Typography>
    </Grid>
  )
}

const RequestDetailsDialog = ({
  request,
  isMobile,
  processingId,
  canAction = true,
  onClose,
  onApprove,
  onReject
}: RequestDetailsDialogProps) => {
  if (!request) return null

  const hasAmount = request.amount !== undefined && request.amount !== null
  const isPending = request.status === 'pending'

  return (
    <Dialog open={Boolean(request)} onClose={onClose} fullWidth maxWidth='sm' fullScreen={isMobile}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
          <Avatar sx={{ bgcolor: colors.green, flexShrink: 0 }}>
            <AssignmentTurnedInIcon fontSize='small' sx={{ color: '#fff' }} />
          </Avatar>
          <Typography variant='h6' sx={{ overflowWrap: 'anywhere' }}>
            Request Details
          </Typography>
        </Box>
        <IconButton size='small' onClick={onClose}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2.5,
            flexWrap: 'wrap',
            p: 2,
            mb: 3,
            borderRadius: 2,
            bgcolor: 'rgba(21, 128, 79, 0.08)',
            border: '1px solid rgba(21, 128, 79, 0.25)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: colors.green, width: 40, height: 40 }}>
              <PersonOutlineIcon fontSize='small' sx={{ color: '#fff' }} />
            </Avatar>
            <Box>
              <StyledInfoLabel sx={{ mb: 0 }}>Maker</StyledInfoLabel>
              <Typography sx={{ fontWeight: 700 }}>{request.maker}</Typography>
              {request.makerId && (
                <Typography variant='caption' color='text.secondary'>
                  {request.makerId}
                </Typography>
              )}
            </Box>
          </Box>
          <Divider orientation={isMobile ? 'horizontal' : 'vertical'} flexItem sx={{ width: { xs: '100%', sm: 'auto' } }} />
          <Box>
            <StyledInfoLabel sx={{ mb: 0 }}>Activity</StyledInfoLabel>
            <Typography sx={{ fontWeight: 700 }}>{request.type}</Typography>
            {request.operationCode && (
              <Typography variant='caption' color='text.secondary'>
                {request.operationCode}
              </Typography>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Field label='Request ID' value={request.id} mono />
          <Grid item xs={12} sm={6}>
            <StyledInfoLabel>Status</StyledInfoLabel>
            <Chip
              size='small'
              label={statusChipStyle[request.status].label}
              sx={{ fontWeight: 700, color: '#fff', bgcolor: statusChipStyle[request.status].bg }}
            />
          </Grid>

          <Field label='Execution Status' value={request.executionStatus} />
          {hasAmount && (
            <Grid item xs={12} sm={6}>
              <StyledInfoLabel>Amount</StyledInfoLabel>
              <Typography sx={{ fontWeight: 700, color: colors.green }}>{formatAmount(request)}</Typography>
            </Grid>
          )}
          <Field label='Initiated Date' value={request.initiatedDate} />
          <Field label='Service' value={request.serviceId} />
          <Field label='Context ID' value={request.contextId} />
          <Field label='Current Step' value={request.step} />

          {request.details && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Field label='Details' value={request.details} xs={12} sm={12} />
            </>
          )}

          {!isPending && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledInfoLabel>Approver</StyledInfoLabel>
                <Typography sx={{ fontWeight: 600 }}>{request.actionedBy ?? '—'}</Typography>
                {request.approverId && (
                  <Typography variant='caption' color='text.secondary'>
                    {request.approverId}
                  </Typography>
                )}
              </Grid>
              <Field label='Actioned Date' value={request.actionedDate} />
            </>
          )}

          {request.remarks && (
            <Grid item xs={12}>
              <StyledInfoLabel>{request.status === 'rejected' ? 'Rejection Reason' : 'Remarks'}</StyledInfoLabel>
              <Typography sx={{ fontWeight: 500, color: request.status === 'rejected' ? colors.danger : 'text.primary' }}>
                {request.remarks}
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      {isPending && canAction && (
        <DialogActions sx={{ p: 2, flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
          <Button
            fullWidth={isMobile}
            variant='contained'
            disabled={processingId === request.id}
            startIcon={<ClearIcon fontSize='small' />}
            onClick={() => onReject(request)}
            sx={{ bgcolor: colors.danger, '&:hover': { bgcolor: colors.dangerHover } }}
          >
            Reject
          </Button>
          <LoadingButton
            fullWidth={isMobile}
            variant='contained'
            loading={processingId === request.id}
            startIcon={<CheckIcon fontSize='small' />}
            onClick={() => onApprove(request)}
          >
            Approve
          </LoadingButton>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default RequestDetailsDialog