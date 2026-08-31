import React, { useMemo, useState } from 'react'
import { styled } from '@mui/material/styles'
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LoadingButton from '@mui/lab/LoadingButton'
import ResultsTable, { ResultsTableColumn } from 'src/@core/components/Resultstable'

// ** Original Theme Colors (same palette as PartyUserManagement)
const colors = {
  green: '#15804f',
  greenHover: '#309a6a',
  yellow: '#eab308',
  yellowHover: '#F0A528',
  danger: '#ef4444',
  dangerHover: '#dc2626'
}

// ---------- Types ----------
type RequestStatus = 'pending' | 'approved' | 'rejected'

type RequestType = 'Single Payment' | 'Bulk Payment' | 'Create User' | 'Update User' | 'Party Onboarding' | 'Limit Change'

interface ApprovalRequest {
  id: string
  type: RequestType
  maker: string
  details: string
  amount?: number
  currency?: string
  initiatedDate: string
  status: RequestStatus
  actionedBy?: string
  actionedDate?: string
  remarks?: string
}

// TODO: yeh mock data real API (pending approvals queue) se replace karein
const initialRequests: ApprovalRequest[] = [
  {
    id: 'REQ-10231',
    type: 'Single Payment',
    maker: 'Ahmed Raza',
    details: 'Acme Technologies (Andorra)',
    amount: 250000,
    currency: 'PKR',
    initiatedDate: '2026-08-27 11:20 AM',
    status: 'pending'
  },
  {
    id: 'REQ-10232',
    type: 'Bulk Payment',
    maker: 'Sana Khan',
    details: 'Batch BATCH-OFTT-2026-0825 (3 transactions)',
    amount: 489000,
    currency: 'PKR',
    initiatedDate: '2026-08-27 10:05 AM',
    status: 'pending'
  },
  {
    id: 'REQ-10233',
    type: 'Create User',
    maker: 'Bilal Ahmed',
    details: 'New user: fatima.tariq (Maker role)',
    initiatedDate: '2026-08-26 04:40 PM',
    status: 'pending'
  },
  {
    id: 'REQ-10220',
    type: 'Single Payment',
    maker: 'Ahmed Raza',
    details: 'Apex Logistics (UAE)',
    amount: 150000,
    currency: 'PKR',
    initiatedDate: '2026-08-25 09:12 AM',
    status: 'approved',
    actionedBy: 'Imran Sheikh',
    actionedDate: '2026-08-25 11:30 AM'
  },
  {
    id: 'REQ-10218',
    type: 'Limit Change',
    maker: 'Sana Khan',
    details: 'Increase daily limit to 1,000,000 PKR',
    initiatedDate: '2026-08-24 02:15 PM',
    status: 'rejected',
    actionedBy: 'Imran Sheikh',
    actionedDate: '2026-08-24 03:00 PM',
    remarks: 'Limit increase requires additional supporting documents.'
  }
]

const statusChipStyle: Record<RequestStatus, { label: string; bg: string }> = {
  pending: { label: 'Pending', bg: colors.yellow },
  approved: { label: 'Approved', bg: colors.green },
  rejected: { label: 'Rejected', bg: colors.danger }
}

// ** Styled Components (matching PartyUserManagement)
const StyledInfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  color: theme.palette.text.secondary,
  fontWeight: 700,
  textTransform: 'uppercase',
  marginBottom: theme.spacing(0.5)
}))

const StyledTabs = styled(Tabs)(() => ({
  minHeight: 44,
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: 3,
    backgroundColor: colors.green
  }
}))

const StyledTab = styled(Tab)(() => ({
  minHeight: 44,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  '&.Mui-selected': {
    color: colors.green
  }
}))

const StyledStatCard = styled(Card)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2.75),
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: theme.shadows[2]
}))

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

const Page = () => {
  const [requests, setRequests] = useState<ApprovalRequest[]>(initialRequests)
  const [activeTab, setActiveTab] = useState<RequestStatus>('pending')
  const [processingId, setProcessingId] = useState<string | null>(null)

  const [rejectTarget, setRejectTarget] = useState<ApprovalRequest | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectSubmitting, setRejectSubmitting] = useState(false)

  const [viewTargetId, setViewTargetId] = useState<string | null>(null)
  const viewTarget = useMemo(() => requests.find(r => r.id === viewTargetId) ?? null, [requests, viewTargetId])

  const counts = useMemo(
    () => ({
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length
    }),
    [requests]
  )

  const visibleRequests = useMemo(() => requests.filter(r => r.status === activeTab), [requests, activeTab])

  const handleApprove = async (request: ApprovalRequest) => {
    // TODO: is poore body ko real API call se replace karein, e.g.:
    // await axios.post(`/api/approvals/${request.id}/approve`)
    setProcessingId(request.id)
    await new Promise(resolve => setTimeout(resolve, 700))

    setRequests(prev =>
      prev.map(r =>
        r.id === request.id
          ? { ...r, status: 'approved', actionedBy: 'You', actionedDate: new Date().toLocaleString() }
          : r
      )
    )
    setProcessingId(null)
  }

  const handleRejectClick = (request: ApprovalRequest) => {
    setRejectTarget(request)
    setRejectReason('')
  }

  const handleConfirmReject = async () => {
    if (!rejectTarget || !rejectReason.trim()) return

    // TODO: is poore body ko real API call se replace karein, e.g.:
    // await axios.post(`/api/approvals/${rejectTarget.id}/reject`, { reason: rejectReason })
    setRejectSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 700))

    setRequests(prev =>
      prev.map(r =>
        r.id === rejectTarget.id
          ? {
              ...r,
              status: 'rejected',
              actionedBy: 'You',
              actionedDate: new Date().toLocaleString(),
              remarks: rejectReason.trim()
            }
          : r
      )
    )

    setRejectSubmitting(false)
    setRejectTarget(null)
    setRejectReason('')
  }

  const handleCloseDetails = () => setViewTargetId(null)

  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ fontWeight: 200 }}>
          Review and action requests raised by makers before they take effect.
        </Typography>
      </Grid>

      {/* Summary stat cards */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <StyledStatCard sx={{ borderLeft: `6px solid ${colors.yellow}` }}>
            <StyledInfoLabel>Pending</StyledInfoLabel>
            <Typography variant='h5' sx={{ fontWeight: 700 }}>
              {counts.pending}
            </Typography>
          </StyledStatCard>
          <StyledStatCard sx={{ borderLeft: `6px solid ${colors.green}` }}>
            <StyledInfoLabel>Approved</StyledInfoLabel>
            <Typography variant='h5' sx={{ fontWeight: 700 }}>
              {counts.approved}
            </Typography>
          </StyledStatCard>
          <StyledStatCard sx={{ borderLeft: `6px solid ${colors.danger}` }}>
            <StyledInfoLabel>Rejected</StyledInfoLabel>
            <Typography variant='h5' sx={{ fontWeight: 700 }}>
              {counts.rejected}
            </Typography>
          </StyledStatCard>
        </Box>
      </Grid>

      {/* Tabs */}
      <Grid item xs={12}>
        <StyledTabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
          <StyledTab value='pending' label={`Pending (${counts.pending})`} />
          <StyledTab value='approved' label={`Approved (${counts.approved})`} />
          <StyledTab value='rejected' label={`Rejected (${counts.rejected})`} />
        </StyledTabs>

        <Box sx={{ mt: 3 }}>
          <ResultsTable
            columns={approvalColumns}
            gridTemplateColumns={approvalGridColumns}
            rows={visibleRequests}
            getRowKey={request => request.id}
            onRowClick={request => setViewTargetId(request.id)}
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
                  {request.amount
                    ? `${request.currency} ${request.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                    : '—'}
                </Typography>
                <Typography variant='body2'>{request.maker}</Typography>
                <Box>
                  <Typography variant='body2'>
                    {activeTab === 'pending' ? request.initiatedDate : request.actionedDate}
                  </Typography>
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
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  onClick={event => event.stopPropagation()}
                >
                  {activeTab === 'pending' ? (
                    <>
                      <Tooltip title='Approve'>
                        <span>
                          <IconButton
                            size='small'
                            onClick={() => handleApprove(request)}
                            disabled={processingId === request.id}
                            sx={{
                              bgcolor: 'rgba(21, 128, 79, 0.1)',
                              color: colors.green,
                              '&:hover': { bgcolor: 'rgba(21, 128, 79, 0.18)' }
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
                            onClick={() => handleRejectClick(request)}
                            disabled={processingId === request.id}
                            sx={{
                              bgcolor: 'rgba(239, 68, 68, 0.1)',
                              color: colors.danger,
                              '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.18)' }
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
                        onClick={() => setViewTargetId(request.id)}
                        sx={{
                          bgcolor: 'rgba(21, 128, 79, 0.1)',
                          color: colors.green,
                          '&:hover': { bgcolor: 'rgba(21, 128, 79, 0.18)' }
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
        </Box>
      </Grid>

      {/* Request Details Dialog */}
      <Dialog open={Boolean(viewTarget)} onClose={handleCloseDetails} fullWidth maxWidth='sm'>
        {viewTarget && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: colors.green }}>
                  <AssignmentTurnedInIcon fontSize='small' sx={{ color: '#fff' }} />
                </Avatar>
                Request Details
              </Box>
              <IconButton size='small' onClick={handleCloseDetails}>
                <CloseIcon fontSize='small' />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2.5,
                  flexWrap: 'wrap',
                  p: 2,
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: 'rgba(21, 128, 79, 0.08)',
                  border: '1px solid rgba(21, 128, 79, 0.25)'
                }}
              >
                <Avatar sx={{ bgcolor: colors.green, width: 40, height: 40 }}>
                  <PersonOutlineIcon fontSize='small' sx={{ color: '#fff' }} />
                </Avatar>
                <Box>
                  <StyledInfoLabel sx={{ mb: 0 }}>Maker</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 700 }}>{viewTarget.maker}</Typography>
                </Box>
                <Divider orientation='vertical' flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Box>
                  <StyledInfoLabel sx={{ mb: 0 }}>Request Type</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 700 }}>{viewTarget.type}</Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>Request ID</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{viewTarget.id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>Status</StyledInfoLabel>
                  <Chip
                    size='small'
                    label={statusChipStyle[viewTarget.status].label}
                    sx={{ fontWeight: 700, color: '#fff', bgcolor: statusChipStyle[viewTarget.status].bg }}
                  />
                </Grid>

                {viewTarget.amount !== undefined && (
                  <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Amount</StyledInfoLabel>
                    <Typography sx={{ fontWeight: 700, color: colors.green }}>
                      {viewTarget.currency} {viewTarget.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12} sm={viewTarget.amount !== undefined ? 6 : 12}>
                  <StyledInfoLabel>Initiated Date</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>{viewTarget.initiatedDate}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12}>
                  <StyledInfoLabel>Details</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}>{viewTarget.details}</Typography>
                </Grid>

                {viewTarget.status !== 'pending' && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledInfoLabel>Actioned By</StyledInfoLabel>
                      <Typography sx={{ fontWeight: 600 }}>{viewTarget.actionedBy}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledInfoLabel>Actioned Date</StyledInfoLabel>
                      <Typography sx={{ fontWeight: 600 }}>{viewTarget.actionedDate}</Typography>
                    </Grid>
                  </>
                )}

                {viewTarget.remarks && (
                  <Grid item xs={12}>
                    <StyledInfoLabel>Rejection Reason</StyledInfoLabel>
                    <Typography sx={{ fontWeight: 500, color: colors.danger }}>{viewTarget.remarks}</Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>

            {viewTarget.status === 'pending' && (
              <DialogActions sx={{ p: 2, flexWrap: 'wrap' }}>
                <Button
                  variant='contained'
                  startIcon={<ClearIcon fontSize='small' />}
                  onClick={() => {
                    handleRejectClick(viewTarget)
                    setViewTargetId(null)
                  }}
                  sx={{ bgcolor: colors.danger, '&:hover': { bgcolor: colors.dangerHover } }}
                >
                  Reject
                </Button>
                <LoadingButton
                  variant='contained'
                  loading={processingId === viewTarget.id}
                  startIcon={<CheckIcon fontSize='small' />}
                  onClick={async () => {
                    await handleApprove(viewTarget)
                    setViewTargetId(null)
                  }}
                >
                  Approve
                </LoadingButton>
              </DialogActions>
            )}
          </>
        )}
      </Dialog>

      {/* Reject reason dialog */}
      <Dialog open={!!rejectTarget} onClose={() => setRejectTarget(null)} fullWidth maxWidth='sm'>
        <DialogTitle sx={{ fontWeight: 700 }}>Reject Request {rejectTarget?.id}</DialogTitle>
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
            value={rejectReason}
            onChange={event => setRejectReason(event.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setRejectTarget(null)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <LoadingButton
            variant='contained'
            loading={rejectSubmitting}
            disabled={!rejectReason.trim()}
            onClick={handleConfirmReject}
            sx={{ bgcolor: colors.danger, '&:hover': { bgcolor: colors.dangerHover } }}
          >
            Confirm Reject
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'approval-screen'
}

export default Page