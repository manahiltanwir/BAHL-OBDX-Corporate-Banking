import React from 'react'
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ResultsTable, { ResultsTableColumn } from 'src/@core/components/Resultstable'
import { useAuth } from 'src/hooks/useAuth'
import { ApprovalRequest, RequestStatus, formatAmount } from '../Types'

interface RequestsTableDesktopProps {
  requests: ApprovalRequest[]
  activeTab: RequestStatus
  processingId: string | null
  canAction?: boolean
  onOpen: (id: string) => void
  onApprove: (request: ApprovalRequest) => void
  onReject: (request: ApprovalRequest) => void
}

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
  const { user } = useAuth()

  const currentUserId: string = (user as any)?.userId ?? ''

  const showApprover = activeTab === 'in_progress' || activeTab === 'rejected'
  const approverLabel = activeTab === 'rejected' ? 'Rejected By' : 'Pending At'
  const hasDetails = requests.some(r => Boolean(r.details))
  const hasAmount = requests.some(r => r.amount !== undefined && r.amount !== null)

  const columns: ResultsTableColumn[] = [
    { key: 'sno', label: 'S.No' },
    { key: 'type', label: 'Activity' },
    ...(hasDetails ? [{ key: 'details', label: 'Details' }] : []),
    ...(hasAmount ? [{ key: 'amount', label: 'Amount' }] : []),
    { key: 'maker', label: 'Maker' },
    ...(showApprover ? [{ key: 'approver', label: approverLabel }] : []),
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action' }
  ]

  const gridColumns = [
    'minmax(0, 0.5fr)',
    'minmax(0, 1.8fr)',
    ...(hasDetails ? ['minmax(0, 2fr)'] : []),
    ...(hasAmount ? ['minmax(0, 1.1fr)'] : []),
    'minmax(0, 1.2fr)',
    ...(showApprover ? ['minmax(0, 1.2fr)'] : []),
    'minmax(0, 1.3fr)',
    'minmax(0, 1fr)',
    'minmax(0, 0.8fr)'
  ].join(' ')

  const statusChipStyle: Record<RequestStatus, { label: string; bg: string }> = {
    pending: { label: 'Pending', bg: theme.palette.warning.main },
    in_progress: { label: 'In Progress', bg: theme.palette.info.main },
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
      emptyMessage={`No ${activeTab.replace('_', ' ')} requests.`}
      headerColor={theme.palette.primary.main}
      renderRow={request => {
        const isActionable = request.status === 'pending' || request.status === 'in_progress'
        const isInitiator = Boolean(request.makerId) && request.makerId === currentUserId
        const showActions = isActionable && canAction && !isInitiator

        return (
          <>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              {request.serialNo}
            </Typography>

            <Typography variant='body2' sx={wrapText}>
              {request.type}
            </Typography>

            {hasDetails && (
              <Typography variant='body2' sx={wrapText}>
                {request.details}
              </Typography>
            )}

            {hasAmount && (
              <Typography variant='body2' sx={{ ...wrapText, fontWeight: 600 }}>
                {formatAmount(request)}
              </Typography>
            )}

            <Typography variant='body2' sx={wrapText}>
              {request.maker}
            </Typography>

            {showApprover && (
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
              {showActions ? (
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
        )
      }}
    />
  )
}

export default RequestsTableDesktop