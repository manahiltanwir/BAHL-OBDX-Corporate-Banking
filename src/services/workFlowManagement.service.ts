import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'

const Services = {
  searchPartyUsers(partyId: string): Promise<AxiosResponse> {
    return requests.get(`/usermanagement-service/users/search/partyId/${partyId}`)
  },
  createWorkflow(payload: any): Promise<AxiosResponse> {
    return requests.post('/approval-workflow-rule-engine-service/api/v1/corporate/workflows', payload)
  },
  searchWorkflowsByParty(partyId: string): Promise<AxiosResponse> {
    return requests.get(`/approval-workflow-rule-engine-service/api/v1/corporate/workflows/party/${partyId}`)
  },
  getWorkflowById(id: string | number): Promise<AxiosResponse> {
    return requests.get(`/approval-workflow-rule-engine-service/api/v1/corporate/workflows/${id}`)
  },
  updateWorkflow(id: string | number, payload: any): Promise<AxiosResponse> {
    return requests.put(`/approval-workflow-rule-engine-service/api/v1/corporate/workflows/${id}`, payload)
  }
}

export default Services