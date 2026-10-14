import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { RuleTaskCategory, RuleApiPayload, AdminRuleApiPayload } from 'src/types/apps/backofficeRuleManagement'

const BASE = '/approval-workflow-rule-engine-service/api/v1/corporate'

const ADMIN_ENTERPRISE_ROLE_ID = 100001



const Services = {
  getTasksByCategory(category: RuleTaskCategory): Promise<AxiosResponse> {
    return requests.get(`/role-task-service/tasks/category/${ADMIN_ENTERPRISE_ROLE_ID}/${category}`)
  },

  getAdminUsers(): Promise<AxiosResponse> {
    return requests.get(`/usermanagement-service/users/enterpriserole/${ADMIN_ENTERPRISE_ROLE_ID}`)
  },

  getAdminWorkflows(): Promise<AxiosResponse> {
    return requests.get(`${BASE}/backoffice-workflows/search`)
  },

  getAdminRulesByUser(userId: string): Promise<AxiosResponse> {
    return requests.get(`${BASE}/backoffice-rules/search?contextType=BACKOFFICE_USER`)
  },

  getRuleById(id: string | number): Promise<AxiosResponse> {
    return requests.get(`${BASE}/backoffice-rules/${id}`)
  },

  createRule(payload: RuleApiPayload | AdminRuleApiPayload): Promise<AxiosResponse> {
    return requests.post(`${BASE}/backoffice-rules`, payload)
  },

  updateRule(id: number, payload: RuleApiPayload | AdminRuleApiPayload): Promise<AxiosResponse> {
    return requests.put(`${BASE}/backoffice-rules/${id}`, payload)
  }
}

export default Services