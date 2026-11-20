import { AxiosResponse } from 'axios'
import requests from 'src/services/httpService'
import { IActivityGroupPayload } from 'src/types/apps/transactionGroup'

const Services = {
  getAll(): Promise<AxiosResponse> {
    return requests.get('limit-management-service/api/v1/activity-groups')
  },

  getById(groupId: number | string): Promise<AxiosResponse> {
    return requests.get(`limit-management-service/api/v1/activity-groups/${groupId}`)
  },

  create(body: IActivityGroupPayload): Promise<AxiosResponse> {
    return requests.post('limit-management-service/api/v1/activity-groups', body)
  },

  update(groupId: number | string, body: IActivityGroupPayload): Promise<AxiosResponse> {
    return requests.put(`limit-management-service/api/v1/activity-groups/${groupId}`, body)
  },

  deactivate(groupId: number | string): Promise<AxiosResponse> {
    return requests.post(`limit-management-service/api/v1/activity-groups/${groupId}/deactivate`, {})
  },

  getFinancialTransactions(enterpriseRoleId: number | string): Promise<AxiosResponse> {
    return requests.get(`/role-task-service/tasks/category/${enterpriseRoleId}/financial`)
  }
}

export default Services