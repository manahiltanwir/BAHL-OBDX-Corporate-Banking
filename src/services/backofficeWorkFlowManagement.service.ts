import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'

const WORKFLOW_BASE = '/approval-workflow-rule-engine-service/api/v1/corporate/backoffice-workflows'
const BACKOFFICE_ENTERPRISE_ROLE_ID = 100001

const Services = {
  getBackofficeUsers(): Promise<AxiosResponse> {
    return requests.get(`/usermanagement-service/users/enterpriserole/${BACKOFFICE_ENTERPRISE_ROLE_ID}`)
  },
  createWorkflow(payload: any): Promise<AxiosResponse> {
    return requests.post(WORKFLOW_BASE, payload)
  },
  getAllWorkflows(): Promise<AxiosResponse> {
    return requests.get(`${WORKFLOW_BASE}/search`)
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