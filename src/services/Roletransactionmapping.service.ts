import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { CreateRolePayload, UpdateTaskServiceMappingPayload } from 'src/types/apps/roleTransactionMapping'

const Services = {
  // ** 1. GET /role-task-service/enterprise-role
  getEnterpriseRoles(): Promise<AxiosResponse> {
    return requests.get(`/role-task-service/enterprise-role`)
  },

  // ** 2. GET /role-task-service/roles/enterprise-role/:enterpriseRoleId
  getRolesByEnterpriseRole(enterpriseRoleId: number): Promise<AxiosResponse> {
    return requests.get(`/role-task-service/roles/enterprise-role/${enterpriseRoleId}`)
  },

  // ** 3. POST /role-task-service/roles
  createRole(body: CreateRolePayload): Promise<AxiosResponse> {
    return requests.post(`/role-task-service/roles`, body)
  },

  // ** 4. GET /role-task-service/tasks/enterprise-role/:enterpriseRoleId
  getTasksByEnterpriseRole(enterpriseRoleId: number): Promise<AxiosResponse> {
    return requests.get(`/role-task-service/tasks/enterprise-role/${enterpriseRoleId}`)
  },

  // ** 5. GET /role-task-service/task-service-role-mapping/:roleId
  getTaskServiceMappingByRole(roleId: number): Promise<AxiosResponse> {
    return requests.get(`/role-task-service/task-service-role-mapping/${roleId}`)
  },

  // ** 6. POST /role-task-service/task-service-role-mapping
  updateTaskServiceMapping(body: UpdateTaskServiceMappingPayload): Promise<AxiosResponse> {
    return requests.post(`/role-task-service/task-service-role-mapping`, body)
  },

  // ** 7. GET /role-task-service/tasks
  getAllTasks(): Promise<AxiosResponse> {
    return requests.get(`/role-task-service/tasks`)
  }
}

export default Services