import React from 'react'
import { Stack, Typography } from '@mui/material'
import { RequestStatus ,ApprovalRequest } from '../Types'
import RequestMobileCard from '../Requestmobilecard'
import RequestsTableDesktop from '../Requeststabledesktop'
interface RequestsListProps {
  requests: ApprovalRequest[]
  activeTab: RequestStatus
  isTablet: boolean
  processingId: string | null
  onOpen: (id: string) => void
  onApprove: (request: ApprovalRequest) => void
  onReject: (request: ApprovalRequest) => void
}

const RequestsList = ({ requests, activeTab, isTablet, processingId, onOpen, onApprove, onReject }: RequestsListProps) => {
  if (!isTablet) {
    return (
      <RequestsTableDesktop
        requests={requests}
        activeTab={activeTab}
        processingId={processingId}
        onOpen={onOpen}
        onApprove={onApprove}
        onReject={onReject}
      />
    )
  }

  if (requests.length === 0) {
    return (
      <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center', py: 4 }}>
        {`No ${activeTab} requests.`}
      </Typography>
    )
  }

  return (
    <Stack spacing={2}>
      {requests.map(request => (
        <RequestMobileCard
          key={request.id}
          request={request}
          activeTab={activeTab}
          processingId={processingId}
          onOpen={onOpen}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </Stack>
  )
}

export default RequestsList