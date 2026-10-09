import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { RuleTaskCategory, RuleApiPayload, AdminRuleApiPayload } from 'src/types/apps/ruleManagement'

const BASE = '/approval-workflow-rule-engine-service/api/v1/corporate'

const ADMIN_ENTERPRISE_ROLE_ID = 100000



const Services = {
  getTasksByCategory(category: RuleTaskCategory): Promise<AxiosResponse> {
    return requests.get(`/role-task-service/tasks/category/100000/${category}`)
  },

  // ** Dropdown ke liye users
  getAdminUsers(): Promise<AxiosResponse> {
    return requests.get(`/usermanagement-service/users/enterpriserole/${ADMIN_ENTERPRISE_ROLE_ID}`)
  },

  // ** Workflow dropdown (Approval Required = Yes par)
  getAdminWorkflows(): Promise<AxiosResponse> {
    return requests.get(`${BASE}/admin-workflows/search`)
  },

  // ** Get all records (1): BACKOFFICE_USER context ke rules
  getAdminRulesByUser(userId: string): Promise<AxiosResponse> {
    // return requests.get(`${BASE}/admin-rules/context/BACKOFFICE_USER/${userId}`)
    return requests.get(`${BASE}/admin-rules/search?enterpriseRole=${ADMIN_ENTERPRISE_ROLE_ID}`)
  },

  // ** Get all records (2): global rules
  getGlobalAdminRules(): Promise<AxiosResponse> {
    return requests.get(`${BASE}/admin-rules/global`)
  },

  // ** ASSUMPTION: endpoint confirm kar lena
  getRuleById(id: string | number): Promise<AxiosResponse> {
    return requests.get(`${BASE}/admin-rules/${id}`)
  },

  // ** POST .../admin-rule (singular)
  createRule(payload: RuleApiPayload | AdminRuleApiPayload): Promise<AxiosResponse> {
    return requests.post(`${BASE}/admin-rules`, payload)
  },

  // ** ASSUMPTION: PUT .../admin-rule/{id}
  updateRule(id: number, payload: RuleApiPayload | AdminRuleApiPayload): Promise<AxiosResponse> {
    return requests.put(`${BASE}/admin-rules/${id}`, payload)
  }
}

export default Services