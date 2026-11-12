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
  canAction?: boolean // sirf Checker User ko Approve/Reject buttons
  onOpen: (id: string) => void
  onApprove: (request: ApprovalRequest) => void
  onReject: (request: ApprovalRequest) => void
}

// Lamba text apne column mein hi wrap ho, agle column mein na ghuse
const wrapText = { overflowWrap: 'anywhere', wordBreak: 'break-word', minWidth: 0 } as const

const RequestsTableDesktop = ({
  requests,
  activeTab,
  processingId,
  canAction = true,
  onOpen,
  onApprove,
  onReject
}: RequestsTableDesktopProps) => {
  const theme = useTheme()

  const isPending = activeTab === 'pending'
  const hasDetails = requests.some(r => Boolean(r.details))
  const hasAmount = requests.some(r => r.amount !== undefined && r.amount !== null)

  const columns: ResultsTableColumn[] = [
    { key: 'sno', label: 'S.No' },
    { key: 'type', label: 'Activity' },
    ...(hasDetails ? [{ key: 'details', label: 'Details' }] : []),
    ...(hasAmount ? [{ key: 'amount', label: 'Amount' }] : []),
    { key: 'maker', label: 'Maker' },
    ...(!isPending ? [{ key: 'approver', label: 'Approver' }] : []),
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action' }
  ]

  // minmax(0, Xfr): column apni width se bahar nahi phailta
  const gridColumns = [
    'minmax(0, 0.5fr)',
    'minmax(0, 1.8fr)',
    ...(hasDetails ? ['minmax(0, 2fr)'] : []),
    ...(hasAmount ? ['minmax(0, 1.1fr)'] : []),
    'minmax(0, 1.2fr)',
    ...(!isPending ? ['minmax(0, 1.2fr)'] : []),
    'minmax(0, 1.3fr)',
    'minmax(0, 1fr)',
    'minmax(0, 0.8fr)'
  ].join(' ')

  const statusChipStyle: Record<RequestStatus, { label: string; bg: string }> = {
    pending: { label: 'Pending', bg: theme.palette.warning.main },
    approved: { label: 'Approved', bg: theme.palette.primary.main },
    rejected: { label: 'Rejected', bg: theme.palette.error.main }
  }

  const renderRemarks = (request: ApprovalRequest) =>
    request.remarks ? (
      <Typography
        variant='caption'
        sx={{ ...wrapText, color: request.status === 'rejected' ? 'error.main' : 'text.secondary', display: 'block', mt: 0.25 }}
      >
        {request.status === 'rejected' ? 'Reason' : 'Remarks'}: {request.remarks}
      </Typography>
    ) : null

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
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            {request.serialNo}
          </Typography>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant='body2' sx={wrapText}>
              {request.type}
            </Typography>
            {!hasDetails && renderRemarks(request)}
          </Box>

          {hasDetails && (
            <Box sx={{ minWidth: 0 }}>
              <Typography variant='body2' sx={wrapText}>
                {request.details}
              </Typography>
              {renderRemarks(request)}
            </Box>
          )}

          {hasAmount && (
            <Typography variant='body2' sx={{ ...wrapText, fontWeight: 600 }}>
              {formatAmount(request)}
            </Typography>
          )}

          <Typography variant='body2' sx={wrapText}>
            {request.maker}
          </Typography>

          {!isPending && (
            <Typography variant='body2' sx={wrapText}>
              {request.actionedBy ?? '—'}
            </Typography>
          )}

          <Typography variant='body2' sx={wrapText}>
            {request.initiatedDate}
          </Typography>

          <Box>
            <Chip
              size='small'
              label={statusChipStyle[request.status].label}
              sx={{ fontWeight: 700, color: '#fff', bgcolor: statusChipStyle[request.status].bg }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={event => event.stopPropagation()}>
            {isPending && canAction ? (
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