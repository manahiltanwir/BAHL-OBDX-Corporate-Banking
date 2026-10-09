import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'

const WORKFLOW_BASE = '/approval-workflow-rule-engine-service/api/v1/corporate/admin-workflows'
const ADMIN_ENTERPRISE_ROLE_ID = 100000

const Services = {
  getAdminUsers(): Promise<AxiosResponse> {
  return requests.get(`/usermanagement-service/users/enterpriserole/${ADMIN_ENTERPRISE_ROLE_ID}`)
},
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