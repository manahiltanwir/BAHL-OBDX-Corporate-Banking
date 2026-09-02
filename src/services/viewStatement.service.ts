import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { ViewStatementForm } from 'src/types/apps/viewStatement';
import { GetParams } from 'src/types/api'

const Services = {
    getAll(body: {
  accountNo: string
  fromDate: string
  toDate: string
}): Promise<AxiosResponse> {
  return requests.post(
    `/view-statement-service/api/view-statement`,
    body
  )
},
    getById(id: string): Promise<AxiosResponse> {
      return requests.get(`/account-service/api/useraccounts/${id}`)
    },
    add(body: ViewStatementForm): Promise<AxiosResponse> {
      return requests.post('/dashboard', body)
    },
    update(id: string, body: ViewStatementForm): Promise<AxiosResponse> {
      return requests.put(`dashboard/${id}`, body)
    },
    delete(id: string): Promise<AxiosResponse> {
      return requests.delete(`dashboard/${id}`)
    },
};

export default Services;
