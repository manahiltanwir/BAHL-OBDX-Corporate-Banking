import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { RuleTaskCategory, RuleApiPayload, AdminRuleApiPayload } from 'src/types/apps/ruleManagement'

const BASE = '/approval-workflow-rule-engine-service/api/v1/corporate'

const ADMIN_ENTERPRISE_ROLE_ID = 100000



const Services = {
  getTasksByCategory(category: RuleTaskCategory): Promise<AxiosResponse> {
    return requests.get(`/role-task-service/tasks/category/100000/${category}`)
  },

  getAdminUsers(): Promise<AxiosResponse> {
    return requests.get(`/usermanagement-service/users/enterpriserole/${ADMIN_ENTERPRISE_ROLE_ID}`)
  },

  getAdminWorkflows(): Promise<AxiosResponse> {
    return requests.get(`${BASE}/admin-workflows/search`)
  },

  getAdminRulesByUser(userId: string): Promise<AxiosResponse> {
   return requests.get(`${BASE}/admin-rules/search?contextType=ADMIN`)
  },

  getRuleById(id: string | number): Promise<AxiosResponse> {
    return requests.get(`${BASE}/admin-rules/${id}`)
  },

  createRule(payload: RuleApiPayload | AdminRuleApiPayload): Promise<AxiosResponse> {
    return requests.post(`${BASE}/admin-rules`, payload)
  },

  updateRule(id: number, payload: RuleApiPayload | AdminRuleApiPayload): Promise<AxiosResponse> {
    return requests.put(`${BASE}/admin-rules/${id}`, payload)
  }
}

export default Services