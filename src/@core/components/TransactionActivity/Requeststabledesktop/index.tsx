import React from 'react'
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ResultsTable, { ResultsTableColumn } from 'src/@core/components/Resultstable'
import { ApprovalRequest, RequestStatus, formatAmount } from '../Types'

interface RequestsTableDesktopProps {
  requests: ApprovalRequest[]
  activeTab: RequestStatus
  processingId: string | null
  onOpen: (id: string) => void
  onApprove: (request: ApprovalRequest) => void
  onReject: (request: ApprovalRequest) => void
}

const RequestsTableDesktop = ({ requests, activeTab, processingId, onOpen, onApprove, onReject }: RequestsTableDesktopProps) => {
  const theme = useTheme()

  // Column tab dikhega jab kisi bhi row mein data ho
  const hasDetails = requests.some(r => Boolean(r.details))
  const hasAmount = requests.some(r => r.amount !== undefined && r.amount !== null)

  const columns: ResultsTableColumn[] = [
    { key: 'id', label: 'Request ID' },
    { key: 'type', label: 'Activity' },
    ...(hasDetails ? [{ key: 'details', label: 'Details' }] : []),
    ...(hasAmount ? [{ key: 'amount', label: 'Amount' }] : []),
    { key: 'maker', label: 'Maker' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action' }
  ]

  const gridColumns = [
    '1fr',
    '1.1fr',
    ...(hasDetails ? ['2.2fr'] : []),
    ...(hasAmount ? ['1.2fr'] : []),
    '1.1fr',
    '1.3fr',
    '1fr',
    '0.8fr'
  ].join(' ')

  const statusChipStyle: Record<RequestStatus, { label: string; bg: string }> = {
    pending: { label: 'Pending', bg: theme.palette.warning.main },
    approved: { label: 'Approved', bg: theme.palette.primary.main },
    rejected: { label: 'Rejected', bg: theme.palette.error.main }
  }

  return (
    <ResultsTable
      columns={columns}
      gridTemplateColumns={gridColumns}
      rows={requests}
      getRowKey={request => request.id}
      onRowClick={request => onOpen(request.id)}
      emptyMessage={`No ${activeTab} requests.`}
      headerColor={theme.palette.primary.main}
      renderRow={request => (
        <>
          <Typography variant='body2' sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
            {request.id}
          </Typography>

          <Box>
            <Typography variant='body2'>{request.type}</Typography>
            {/* Details column nahi hai to remarks yahan dikhao */}
            {!hasDetails && request.remarks && (
              <Typography variant='caption' sx={{ color: 'error.main', display: 'block', mt: 0.25 }}>
                Reason: {request.remarks}
              </Typography>
            )}
          </Box>

          {hasDetails && (
            <Box>
              <Typography variant='body2' sx={{ overflowWrap: 'anywhere' }}>
                {request.details}
              </Typography>
              {request.remarks && (
                <Typography variant='caption' sx={{ color: 'error.main', display: 'block', mt: 0.25 }}>
                  Reason: {request.remarks}
                </Typography>
              )}
            </Box>
          )}

          {hasAmount && (
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              {formatAmount(request)}
            </Typography>
          )}

          <Typography variant='body2'>{request.maker}</Typography>

          <Box>
            <Typography variant='body2'>{activeTab === 'pending' ? request.initiatedDate : request.actionedDate}</Typography>
            {activeTab !== 'pending' && request.actionedBy && (
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
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: 'success.main',
                        '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.18) }
                      }}
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
                      sx={{
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        color: 'error.main',
                        '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.18) }
                      }}
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
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: 'success.main',
                    '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.18) }
                  }}
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
}

export default RequestsTableDesktop