import React from 'react'
import { Box, Button, Chip, Divider, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { ApprovalRequest, RequestStatus, colors, formatAmount, statusChipStyle } from '../Types'
import { StyledInfoLabel, StyledMobileCard } from '../Styled'

interface RequestMobileCardProps {
  request: ApprovalRequest
  activeTab: RequestStatus
  processingId: string | null
  onOpen: (id: string) => void
  onApprove: (request: ApprovalRequest) => void
  onReject: (request: ApprovalRequest) => void
}

const RequestMobileCard = ({ request, activeTab, processingId, onOpen, onApprove, onReject }: RequestMobileCardProps) => (
  <StyledMobileCard onClick={() => onOpen(request.id)}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant='body2' sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
          {request.id}
        </Typography>
        <Typography variant='caption' color='text.secondary'>
          {request.type}
        </Typography>
      </Box>
      <Chip
        size='small'
        label={statusChipStyle[request.status].label}
        sx={{ fontWeight: 700, color: '#fff', bgcolor: statusChipStyle[request.status].bg, flexShrink: 0 }}
      />
    </Box>

    <Typography variant='body2' sx={{ mt: 1.5, overflowWrap: 'anywhere' }}>
      {request.details}
    </Typography>
    {request.remarks && (
      <Typography variant='caption' sx={{ color: colors.danger, display: 'block', mt: 0.5 }}>
        Reason: {request.remarks}
      </Typography>
    )}

    <Divider sx={{ my: 1.5 }} />

    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 1, columnGap: 1 }}>
      <Box>
        <StyledInfoLabel sx={{ mb: 0 }}>Amount</StyledInfoLabel>
        <Typography variant='body2' sx={{ fontWeight: 600 }}>
          {formatAmount(request)}
        </Typography>
      </Box>
      <Box>
        <StyledInfoLabel sx={{ mb: 0 }}>Maker</StyledInfoLabel>
        <Typography variant='body2'>{request.maker}</Typography>
      </Box>
      <Box>
        <StyledInfoLabel sx={{ mb: 0 }}>{activeTab === 'pending' ? 'Initiated' : 'Actioned'}</StyledInfoLabel>
        <Typography variant='body2'>{activeTab === 'pending' ? request.initiatedDate : request.actionedDate}</Typography>
      </Box>
      {activeTab !== 'pending' && (
        <Box>
          <StyledInfoLabel sx={{ mb: 0 }}>By</StyledInfoLabel>
          <Typography variant='body2'>{request.actionedBy}</Typography>
        </Box>
      )}
    </Box>

    {activeTab === 'pending' && (
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }} onClick={event => event.stopPropagation()}>
        <Button
          fullWidth
          size='small'
          variant='contained'
          startIcon={<CheckIcon fontSize='small' />}
          disabled={processingId === request.id}
          onClick={() => onApprove(request)}
          sx={{ bgcolor: colors.green, '&:hover': { bgcolor: colors.greenHover } }}
        >
          Approve
        </Button>
        <Button
          fullWidth
          size='small'
          variant='outlined'
          startIcon={<ClearIcon fontSize='small' />}
          disabled={processingId === request.id}
          onClick={() => onReject(request)}
          sx={{ color: colors.danger, borderColor: colors.danger }}
        >
          Reject
        </Button>
      </Box>
    )}
  </StyledMobileCard>
)

export default RequestMobileCard