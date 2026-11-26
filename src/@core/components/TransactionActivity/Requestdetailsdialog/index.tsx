import React from 'react'
import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Typography } from '@mui/material'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LoadingButton from '@mui/lab/LoadingButton'
import { ApprovalRequest, RequestApprover, approverActionStyle, colors, formatAmount, statusChipStyle } from '../Types'
import { StyledInfoLabel } from '../Styled'
import { useAuth } from 'src/hooks/useAuth'

interface RequestDetailsDialogProps {
  request: ApprovalRequest | null
  isMobile: boolean
  processingId: string | null
  canAction?: boolean
  onClose: () => void
  onApprove: (request: ApprovalRequest) => void
  onReject: (request: ApprovalRequest) => void
}

const wrapText = { overflowWrap: 'anywhere', wordBreak: 'break-word', minWidth: 0 } as const

const Field = ({ label, value, mono = false, xs = 12, sm = 6 }: { label: string; value?: React.ReactNode; mono?: boolean; xs?: number; sm?: number }) => {
  if (value === undefined || value === null || value === '') return null

  return (
    <Grid item xs={xs} sm={sm}>
      <StyledInfoLabel>{label}</StyledInfoLabel>
      <Typography sx={{ fontWeight: 600, fontFamily: mono ? 'monospace' : undefined, overflowWrap: 'anywhere' }}>{value}</Typography>
    </Grid>
  )
}

const approversGridColumns = { xs: '1fr', sm: '56px minmax(0, 1.4fr) 104px minmax(0, 1.6fr)' }

const ApproversGrid = ({ approvers }: { approvers: RequestApprover[] }) => (
  <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
    <Box
      sx={{
        display: { xs: 'none', sm: 'grid' },
        gridTemplateColumns: approversGridColumns,
        columnGap: 1.5,
        px: 1.5,
        py: 1,
        bgcolor: 'action.hover'
      }}
    >
      {['Level', 'Approver', 'Status', 'Remarks'].map(heading => (
        <StyledInfoLabel key={heading} sx={{ mb: 0 }}>
          {heading}
        </StyledInfoLabel>
      ))}
    </Box>

    {approvers.map((approver, index) => {
      const chip = approver.action
        ? approverActionStyle[approver.action] ?? { label: approver.action, bg: '#64748b' }
        : null

      return (
        <Box
          key={`${approver.id}-${approver.sequenceNo}`}
          sx={{
            display: 'grid',
            gridTemplateColumns: approversGridColumns,
            columnGap: 1.5,
            rowGap: 0.75,
            alignItems: 'start',
            px: 1.5,
            py: 1.25,
            borderTop: index === 0 ? 'none' : '1px solid',
            borderTopColor: 'divider'
          }}
        >
          <Typography variant='body2' sx={{ fontWeight: 700 }}>
            <Box component='span' sx={{ display: { xs: 'inline', sm: 'none' } }}>
              Level{' '}
            </Box>
            {approver.sequenceNo}
          </Typography>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant='body2' sx={{ ...wrapText, fontWeight: 600 }}>
              {approver.name}
            </Typography>
            <Typography variant='caption' color='text.secondary' sx={wrapText}>
              {approver.id}
            </Typography>
          </Box>

          <Box>
            {chip ? (
              <Chip size='small' label={chip.label} sx={{ fontWeight: 700, color: '#fff', bgcolor: chip.bg }} />
            ) : (
              <Typography variant='body2' color='text.secondary'>
                -
              </Typography>
            )}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant='caption'
              sx={{ display: { xs: 'block', sm: 'none' }, color: 'text.secondary', fontWeight: 700 }}
            >
              Remarks
            </Typography>
            <Typography variant='body2' sx={wrapText}>
              {approver.remarks ?? '-'}
            </Typography>
          </Box>
        </Box>
      )
    })}
  </Box>
)

const RequestDetailsDialog = ({
  request,
  isMobile,
  processingId,
  canAction = true,
  onClose,
  onApprove,
  onReject
}: RequestDetailsDialogProps) => {
  const { user } = useAuth()
  const currentUserId: string = (user as any)?.userId ?? ''
  if (!request) return null
  const hasAmount = request.amount !== undefined && request.amount !== null
  const hasApprovers = Boolean(request.approvers && request.approvers.length > 0)
  const isActionable = request.status === 'pending' || request.status === 'in_progress'
  const isInitiator = Boolean(request.makerId) && request.makerId === currentUserId
  const showActions = isActionable && canAction && !isInitiator

  return (
    <Dialog open={Boolean(request)} onClose={onClose} fullWidth maxWidth='md' fullScreen={isMobile}>
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
        {/* Maker + Activity */}
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
          <Field label='Actioned Date' value={request.actionedDate} />
          <Field label='Service' value={request.serviceId} />
          <Field label='Context ID' value={request.contextId} />
          <Field label='Current Step' value={request.step} />
          <Field label='Workflow ID' value={request.workflowId} />

          {request.details && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Field label='Details' value={request.details} xs={12} sm={12} />
            </>
          )}

          {hasApprovers && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={12}>
                <StyledInfoLabel>Approvers ({request.approvers!.length})</StyledInfoLabel>
                <ApproversGrid approvers={request.approvers!} />
              </Grid>
            </>
          )}

          {/* {request.remarks && (
            <Grid item xs={12}>
              <StyledInfoLabel>{request.status === 'rejected' ? 'Rejection Reason' : 'Remarks'}</StyledInfoLabel>
              <Typography sx={{ fontWeight: 500, color: request.status === 'rejected' ? colors.danger : 'text.primary' }}>
                {request.remarks}
              </Typography>
            </Grid>
          )} */}
        </Grid>
      </DialogContent>

      {showActions && (
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