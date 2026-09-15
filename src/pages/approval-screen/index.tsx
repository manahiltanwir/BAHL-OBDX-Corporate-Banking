import React from 'react'
import ApprovalRequests from 'src/@core/components/TransactionActivity/ApprovalRequests'
const Page = () => {
  return <ApprovalRequests />
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'approval-screen'
}

export default Page