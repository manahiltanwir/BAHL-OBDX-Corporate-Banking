import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { ApprovalActivitiesParams } from 'src/types/apps/approvalActivity'

const Services = {
  getApprovalActivities({ userId, actorType, status }: ApprovalActivitiesParams): Promise<AxiosResponse> {
    const query = new URLSearchParams({ userId, actorType, status }).toString()

    return requests.get(`/approval-workflow-rule-engine-service/api/v1/corporate/approvals/activities?${query}`)
  }
}

export default Services