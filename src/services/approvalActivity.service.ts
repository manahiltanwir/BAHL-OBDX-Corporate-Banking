import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { ApprovalActionPayload, ApprovalActivitiesParams } from 'src/types/apps/approvalActivity'

const BASE = '/approval-workflow-rule-engine-service/api/v1/corporate/approvals'

const Services = {
  // GET /activities?userId=...&status=ALL
  getApprovalActivities({ userId, status }: ApprovalActivitiesParams): Promise<AxiosResponse> {
    const query = new URLSearchParams({ userId, status }).toString()

    return requests.get(`${BASE}/activities?${query}`)
  },

  // POST /action  { transactionRefNo, checkerId, action, remarks }
  takeApprovalAction(body: ApprovalActionPayload): Promise<AxiosResponse> {
    return requests.post(`${BASE}/action`, body)
  }
}

export default Services