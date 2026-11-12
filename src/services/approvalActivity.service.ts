import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { ApprovalActionPayload, ApprovalActivitiesParams ,ApprovalRejectPayload} from 'src/types/apps/approvalActivity'

const BASE = '/approval-workflow-rule-engine-service/api/v1/corporate/approvals'

const Services = {
  getApprovalActivities({ userId, status }: ApprovalActivitiesParams): Promise<AxiosResponse> {
    const query = new URLSearchParams({ userId, status }).toString()

    return requests.get(`${BASE}/activities?${query}`)
  },
// approve
  takeApprovalAction(body: ApprovalActionPayload): Promise<AxiosResponse> {
    return requests.post(`${BASE}/approve`, body)
  },
  // reject
  takerejectAction(body: ApprovalRejectPayload): Promise<AxiosResponse> {
    return requests.post(`${BASE}/reject`, body)
  }
}

export default Services