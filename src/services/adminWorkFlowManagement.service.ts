import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'

const WORKFLOW_BASE = '/approval-workflow-rule-engine-service/api/v1/corporate/admin-workflows'

const Services = {
  searchPartyUsers(partyId: string): Promise<AxiosResponse> {
    return requests.get(`/usermanagement-service/users/search/partyId/${partyId}`)
  },
  createWorkflow(payload: any): Promise<AxiosResponse> {
    return requests.post(WORKFLOW_BASE, payload)
  },
  searchWorkflowsByCode(workflowCode: string): Promise<AxiosResponse> {
    return requests.get(`${WORKFLOW_BASE}/code/${encodeURIComponent(workflowCode)}`)
  },
  getWorkflowById(id: string | number): Promise<AxiosResponse> {
    return requests.get(`${WORKFLOW_BASE}/${id}`)
  },
  updateWorkflow(id: string | number, payload: any): Promise<AxiosResponse> {
    return requests.put(`${WORKFLOW_BASE}/${id}`, payload)
  }
}

export default Services