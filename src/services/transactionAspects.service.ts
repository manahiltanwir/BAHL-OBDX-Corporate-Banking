import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { IAspect, IAspectUpdatePayload, TransactionAspectsForm } from 'src/types/apps/transactionAspects'
import { GetParams } from 'src/types/api'

const Services = {
  getAll(enterpriseRoleId: string | number): Promise<AxiosResponse> {
    return requests.get(`/role-task-service/task-service-aspect/${enterpriseRoleId}`)
  },
  getById(id: string): Promise<AxiosResponse> {
    return requests.get(`/category/${id}`)
  },
  add(body: TransactionAspectsForm): Promise<AxiosResponse> {
    return requests.post('/category', body)
  },
  update(id: string, body: IAspectUpdatePayload[]): Promise<AxiosResponse> {
    return requests.put(`/role-task-service/task-service-aspect`, body)
  },
  delete(id: string): Promise<AxiosResponse> {
    return requests.delete(`category/${id}`)
  }
  // search({ query }: GetParams): Promise<AxiosResponse> {
  //   return requests.get(`category?${query}`)
  // },
}

export default Services
