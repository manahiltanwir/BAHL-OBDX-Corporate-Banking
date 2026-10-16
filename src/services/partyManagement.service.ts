import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { PartyManagementForm } from 'src/types/apps/partyManagement'
import { GetParams } from 'src/types/api'

export type UpdateMethod = 'put' | 'post'

const Services = {
  getAll({ query }: GetParams): Promise<AxiosResponse> {
    return requests.get(`/category`, { params: query })
  },
  getById(id: string): Promise<AxiosResponse> {
    return requests.get(`/party-service/api/${id}`)
  },
  add(body: PartyManagementForm): Promise<AxiosResponse> {
    return requests.post('/category', body)
  },
  update(id: string, body: PartyManagementForm | any, method: UpdateMethod = 'put'): Promise<AxiosResponse> {
    if (method === 'post') {
      return requests.post(`/party-service/api`, body)
    }
    return requests.put(`/party-service/api/status/${id}`, body)
  },
  delete(id: string): Promise<AxiosResponse> {
    return requests.delete(`category/${id}`)
  }
}

export default Services