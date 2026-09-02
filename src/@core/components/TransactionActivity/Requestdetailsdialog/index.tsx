import React from 'react'
import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Typography } from '@mui/material'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LoadingButton from '@mui/lab/LoadingButton'
import { ApprovalRequest, colors, statusChipStyle } from '../Types'
import { StyledInfoLabel } from '../Styled'

interface RequestDetailsDialogProps {
  request: ApprovalRequest | null
  isMobile: boolean
  processingId: string | null
  onClose: () => void
  onApprove: (request: ApprovalRequest) => void
  onReject: (request: ApprovalRequest) => void
}

const RequestDetailsDialog = ({ request, isMobile, processingId, onClose, onApprove, onReject }: RequestDetailsDialogProps) => {
  if (!request) return null

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
            </Box>
          </Box>
          <Divider orientation={isMobile ? 'horizontal' : 'vertical'} flexItem sx={{ width: { xs: '100%', sm: 'auto' } }} />
          <Box>
            <StyledInfoLabel sx={{ mb: 0 }}>Request Type</StyledInfoLabel>
            <Typography sx={{ fontWeight: 700 }}>{request.type}</Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <StyledInfoLabel>Request ID</StyledInfoLabel>
            <Typography sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{request.id}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledInfoLabel>Status</StyledInfoLabel>
            <Chip
              size='small'
              label={statusChipStyle[request.status].label}
              sx={{ fontWeight: 700, color: '#fff', bgcolor: statusChipStyle[request.status].bg }}
            />
          </Grid>

          {request.amount !== undefined && (
            <Grid item xs={12} sm={6}>
              <StyledInfoLabel>Amount</StyledInfoLabel>
              <Typography sx={{ fontWeight: 700, color: colors.green }}>
                {request.currency} {request.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12} sm={request.amount !== undefined ? 6 : 12}>
            <StyledInfoLabel>Initiated Date</StyledInfoLabel>
            <Typography sx={{ fontWeight: 600 }}>{request.initiatedDate}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12}>
            <StyledInfoLabel>Details</StyledInfoLabel>
            <Typography sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}>{request.details}</Typography>
          </Grid>

          {request.status !== 'pending' && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledInfoLabel>Actioned By</StyledInfoLabel>
                <Typography sx={{ fontWeight: 600 }}>{request.actionedBy}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledInfoLabel>Actioned Date</StyledInfoLabel>
                <Typography sx={{ fontWeight: 600 }}>{request.actionedDate}</Typography>
              </Grid>
            </>
          )}

          {request.remarks && (
            <Grid item xs={12}>
              <StyledInfoLabel>Rejection Reason</StyledInfoLabel>
              <Typography sx={{ fontWeight: 500, color: colors.danger }}>{request.remarks}</Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      {request.status === 'pending' && (
        <DialogActions sx={{ p: 2, flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
          <Button
            fullWidth={isMobile}
            variant='contained'
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