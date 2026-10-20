import React, { useEffect, useMemo, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Box, CircularProgress, Grid, Typography } from '@mui/material'
import { ApprovalActionType } from 'src/types/apps/approvalActivity'
import { ApprovalRequest, RequestStatus } from '../Types'
import { StyledTab, StyledTabs } from '../Styled'
import StatCards from '../Statcards'
import RequestsList from '../Requestslist'
import RequestDetailsDialog from '../Requestdetailsdialog'
import ActionDialog from '../Actiondialog'
import { useApprovalActivities } from 'src/@core/hooks/apps/useApprovalActivities'

const ApprovalRequests = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  const { requests, isLoading, isError, isChecker, processingId, fetchActivities, submitAction } = useApprovalActivities()
  const [activeTab, setActiveTab] = useState<RequestStatus>('pending')
  const [actionTarget, setActionTarget] = useState<{ request: ApprovalRequest; action: ApprovalActionType } | null>(null)
  const [remarks, setRemarks] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [viewTargetId, setViewTargetId] = useState<string | null>(null)
  const viewTarget = useMemo(() => requests.find(r => r.id === viewTargetId) ?? null, [requests, viewTargetId])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  const openActionDialog = (action: ApprovalActionType) => (request: ApprovalRequest) => {
    setActionTarget({ request, action })
    setRemarks('')
    setViewTargetId(null)
  }

  const handleCancelAction = () => {
    setActionTarget(null)
    setRemarks('')
  }

  const handleConfirmAction = async () => {
    if (!actionTarget || !remarks.trim()) return

    setSubmitting(true)
    const success = await submitAction(actionTarget.request.id, actionTarget.action, remarks.trim())
    setSubmitting(false)
    if (success) handleCancelAction()
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
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <Typography variant='body2' color='error' sx={{ textAlign: 'center', py: 4 }}>
              Failed to load requests. Please try again.
            </Typography>
          ) : (
            <RequestsList
              requests={visibleRequests}
              activeTab={activeTab}
              isTablet={isTablet}
              processingId={processingId}
              onOpen={setViewTargetId}
              onApprove={openActionDialog('APPROVE')}
              onReject={openActionDialog('REJECT')}
            />
          )}
        </Box>
      </Grid>

      <RequestDetailsDialog
        request={viewTarget}
        isMobile={isMobile}
        processingId={processingId}
        canAction={isChecker}
        onClose={() => setViewTargetId(null)}
        onApprove={openActionDialog('APPROVE')}
        onReject={openActionDialog('REJECT')}
      />

      <ActionDialog
        target={actionTarget?.request ?? null}
        action={actionTarget?.action ?? null}
        remarks={remarks}
        submitting={submitting}
        isMobile={isMobile}
        onRemarksChange={setRemarks}
        onCancel={handleCancelAction}
        onConfirm={handleConfirmAction}
      />
    </Grid>
  )
}

export default ApprovalRequests