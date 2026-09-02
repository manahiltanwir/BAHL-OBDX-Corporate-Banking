import React from 'react'
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ResultsTable, { ResultsTableColumn } from 'src/@core/components/Resultstable'
import { ApprovalRequest, RequestStatus, colors, formatAmount, statusChipStyle } from '../Types'

const approvalColumns: ResultsTableColumn[] = [
  { key: 'id', label: 'Request ID' },
  { key: 'type', label: 'Type' },
  { key: 'details', label: 'Details' },
  { key: 'amount', label: 'Amount' },
  { key: 'maker', label: 'Maker' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
  { key: 'action', label: 'Action' }
]

const approvalGridColumns = '1fr 1.1fr 2.2fr 1.2fr 1.1fr 1.3fr 1fr 0.8fr'

interface RequestsTableDesktopProps {
  requests: ApprovalRequest[]
  activeTab: RequestStatus
  processingId: string | null
  onOpen: (id: string) => void
  onApprove: (request: ApprovalRequest) => void
  onReject: (request: ApprovalRequest) => void
}

const RequestsTableDesktop = ({ requests, activeTab, processingId, onOpen, onApprove, onReject }: RequestsTableDesktopProps) => (
  <ResultsTable
    columns={approvalColumns}
    gridTemplateColumns={approvalGridColumns}
    rows={requests}
    getRowKey={request => request.id}
    onRowClick={request => onOpen(request.id)}
    emptyMessage={`No ${activeTab} requests.`}
    headerColor={colors.green}
    renderRow={request => (
      <>
        <Typography variant='body2' sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
          {request.id}
        </Typography>
        <Typography variant='body2'>{request.type}</Typography>
        <Box>
          <Typography variant='body2' sx={{ overflowWrap: 'anywhere' }}>
            {request.details}
          </Typography>
          {request.remarks && (
            <Typography variant='caption' sx={{ color: colors.danger, display: 'block', mt: 0.25 }}>
              Reason: {request.remarks}
            </Typography>
          )}
        </Box>
        <Typography variant='body2' sx={{ fontWeight: 600 }}>
          {formatAmount(request)}
        </Typography>
        <Typography variant='body2'>{request.maker}</Typography>
        <Box>
          <Typography variant='body2'>{activeTab === 'pending' ? request.initiatedDate : request.actionedDate}</Typography>
          {activeTab !== 'pending' && (
            <Typography variant='caption' color='text.secondary'>
              by {request.actionedBy}
            </Typography>
          )}
        </Box>
        <Box>
          <Chip
            size='small'
            label={statusChipStyle[request.status].label}
            sx={{ fontWeight: 700, color: '#fff', bgcolor: statusChipStyle[request.status].bg }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={event => event.stopPropagation()}>
          {activeTab === 'pending' ? (
            <>
              <Tooltip title='Approve'>
                <span>
                  <IconButton
                    size='small'
                    onClick={() => onApprove(request)}
                    disabled={processingId === request.id}
                    sx={{ bgcolor: 'rgba(21, 128, 79, 0.1)', color: colors.green, '&:hover': { bgcolor: 'rgba(21, 128, 79, 0.18)' } }}
                  >
                    <CheckIcon fontSize='small' />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title='Reject'>
                <span>
                  <IconButton
                    size='small'
                    onClick={() => onReject(request)}
                    disabled={processingId === request.id}
                    sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: colors.danger, '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.18)' } }}
                  >
                    <ClearIcon fontSize='small' />
                  </IconButton>
                </span>
              </Tooltip>
            </>
          ) : (
            <Tooltip title='View'>
              <IconButton
                size='small'
                onClick={() => onOpen(request.id)}
                sx={{ bgcolor: 'rgba(21, 128, 79, 0.1)', color: colors.green, '&:hover': { bgcolor: 'rgba(21, 128, 79, 0.18)' } }}
              >
                <VisibilityIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </>
    )}
  />
)

export default RequestsTableDesktop