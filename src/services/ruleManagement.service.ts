import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { RuleTaskCategory, RuleApiPayload } from 'src/types/apps/ruleManagement'

const Services = {
  searchPartyUsers(partyId: string): Promise<AxiosResponse> {
    return requests.get(`/usermanagement-service/users/search/partyId/${partyId}`)
  },

  getPartyAccounts(partyId: string): Promise<AxiosResponse> {
    return requests.get(`/account-access/partyAccountAccess/${partyId}`)
  },

  getTasksByCategory(category: RuleTaskCategory): Promise<AxiosResponse> {
    return requests.get(`/role-task-service/tasks/category/${category}`)
  },

  searchWorkflowsByParty(partyId: string): Promise<AxiosResponse> {
    return requests.get(`/approval-workflow-rule-engine-service/api/v1/corporate/workflows/party/${partyId}`)
  },
  createRule(payload: RuleApiPayload): Promise<AxiosResponse> {
    return requests.post(`/approval-workflow-rule-engine-service/api/v1/corporate/rules`, payload)
  },

  updateRule(id: number, payload: RuleApiPayload): Promise<AxiosResponse> {
    return requests.put(`/approval-workflow-rule-engine-service/api/v1/corporate/rules/${id}`, payload)
  },

  getRulesByParty(partyId: string): Promise<AxiosResponse> {
    return requests.get(`/approval-workflow-rule-engine-service/api/v1/corporate/rules/party/${partyId}`)
  },

  getRuleById(id: string | number): Promise<AxiosResponse> {
    return requests.get(`/approval-workflow-rule-engine-service/api/v1/corporate/rules/${id}`)
  }
}

export default Services