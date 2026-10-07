import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { RuleTaskCategory, RuleApiPayload } from 'src/types/apps/ruleManagement'

const BASE = '/approval-workflow-rule-engine-service/api/v1/corporate/rules'

const Services = {
  getTasksByCategory(category: RuleTaskCategory): Promise<AxiosResponse> {
    return requests.get(`/role-task-service/tasks/category/${category}`)
  },

  getRuleByCode(ruleCode: string): Promise<AxiosResponse> {
    return requests.get(`${BASE}/code/${ruleCode}`)
  },

  // ** ASSUMPTION: get-all endpoint
  getAllRules(): Promise<AxiosResponse> {
    return requests.get(BASE)
  },

  getRuleById(id: string | number): Promise<AxiosResponse> {
    return requests.get(`${BASE}/${id}`)
  },

  createRule(payload: RuleApiPayload): Promise<AxiosResponse> {
    return requests.post(BASE, payload)
  },

  updateRule(id: number, payload: RuleApiPayload): Promise<AxiosResponse> {
    return requests.put(`${BASE}/${id}`, payload)
  }
}

export default Services