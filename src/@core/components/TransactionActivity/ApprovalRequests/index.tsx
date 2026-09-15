import React, { useMemo, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Box, Grid, Typography } from '@mui/material'
import { ApprovalRequest, RequestStatus, initialRequests } from '../Types'
import { StyledTab, StyledTabs } from '../Styled'
import StatCards from '../Statcards'
import RequestsList from '../Requestslist'
import RequestDetailsDialog from '../Requestdetailsdialog'
import RejectDialog from '../Rejectdialog'

const ApprovalRequests = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const [requests, setRequests] = useState<ApprovalRequest[]>(initialRequests)
  const [activeTab, setActiveTab] = useState<RequestStatus>('pending')
  const [processingId, setProcessingId] = useState<string | null>(null)

  const [rejectTarget, setRejectTarget] = useState<ApprovalRequest | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectSubmitting, setRejectSubmitting] = useState(false)

  const [viewTargetId, setViewTargetId] = useState<string | null>(null)
  const viewTarget = useMemo(() => requests.find(r => r.id === viewTargetId) ?? null, [requests, viewTargetId])

  const handleRejectClick = (request: ApprovalRequest) => {
    setRejectTarget(request)
    setRejectReason('')
    setViewTargetId(null)
  }

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
    setProcessingId(request.id)
    await new Promise(resolve => setTimeout(resolve, 700))

    setRequests(prev =>
      prev.map(r => (r.id === request.id ? { ...r, status: 'approved', actionedBy: 'You', actionedDate: new Date().toLocaleString() } : r))
    )
    setProcessingId(null)
    setViewTargetId(null)
  }

  const handleConfirmReject = async () => {
    if (!rejectTarget || !rejectReason.trim()) return
    setRejectSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 700))

    setRequests(prev =>
      prev.map(r =>
        r.id === rejectTarget.id
          ? { ...r, status: 'rejected', actionedBy: 'You', actionedDate: new Date().toLocaleString(), remarks: rejectReason.trim() }
          : r
      )
    )

    setRejectSubmitting(false)
    setRejectTarget(null)
    setRejectReason('')
    setViewTargetId(null)
  }

  return (
    <Grid container spacing={{ xs: 3, sm: 6 }}>
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ fontWeight: 200, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Review and action requests raised by makers before they take effect.
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <StatCards pending={counts.pending} approved={counts.approved} rejected={counts.rejected} />
      </Grid>

      <Grid item xs={12}>
        <StyledTabs value={activeTab} onChange={(_, value) => setActiveTab(value)} variant='scrollable' scrollButtons='auto' allowScrollButtonsMobile>
          <StyledTab value='pending' label={`Pending (${counts.pending})`} />
          <StyledTab value='approved' label={`Approved (${counts.approved})`} />
          <StyledTab value='rejected' label={`Rejected (${counts.rejected})`} />
        </StyledTabs>

        <Box sx={{ mt: 3 }}>
          <RequestsList
            requests={visibleRequests}
            activeTab={activeTab}
            isTablet={isTablet}
            processingId={processingId}
            onOpen={setViewTargetId}
            onApprove={handleApprove}
            onReject={handleRejectClick}
          />
        </Box>
      </Grid>

      <RequestDetailsDialog
        request={viewTarget}
        isMobile={isMobile}
        processingId={processingId}
        onClose={() => setViewTargetId(null)}
        onApprove={handleApprove}
        onReject={handleRejectClick}
      />

      <RejectDialog
        target={rejectTarget}
        reason={rejectReason}
        submitting={rejectSubmitting}
        isMobile={isMobile}
        onReasonChange={setRejectReason}
        onCancel={() => setRejectTarget(null)}
        onConfirm={handleConfirmReject}
      />
    </Grid>
  )
}

export default ApprovalRequests