import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { PartyManagementForm } from 'src/types/apps/partyManagement'
import { GetParams } from 'src/types/api'

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
  update(id: string, body: PartyManagementForm): Promise<AxiosResponse> {
    return requests.put(`/party-service/api/${id}`, body)
  },
  delete(id: string): Promise<AxiosResponse> {
    return requests.delete(`category/${id}`)
  },
  // search({ query }: GetParams): Promise<AxiosResponse> {
  //   return requests.get(`category?${query}`)
  // },

}

export default Services
