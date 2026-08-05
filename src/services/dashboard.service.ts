import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { DashboardForm } from 'src/types/apps/dashboard';
import { GetParams } from 'src/types/api'

const Services = {
  getMe(cnic: string): Promise<AxiosResponse> {
      return requests.get(`/party-service/api/${cnic}`)
    },
    getById(id: string): Promise<AxiosResponse> {
      return requests.get(`/dashboard/${id}`)
    },
    add(body: DashboardForm): Promise<AxiosResponse> {
      return requests.post('/dashboard', body)
    },
    update(id: string, body: DashboardForm): Promise<AxiosResponse> {
      return requests.put(`dashboard/${id}`, body)
    },
    delete(id: string): Promise<AxiosResponse> {
      return requests.delete(`dashboard/${id}`)
    },
};

export default Services;
