import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { GetParams } from 'src/services/service'

const Services = {
  getAll({ query }: GetParams): Promise<AxiosResponse> {
    return requests.get(`/reports?${query}`)
  },
  getById(id: string): Promise<AxiosResponse> {
    return requests.get(`/reports/${id}`)
  },
  add(body: any): Promise<AxiosResponse> {
    return requests.post('/reports', body)
  },
  addNewVersion(reportId: string, body: any): Promise<AxiosResponse> {
    return requests.post(`/reports/${reportId}`, body)
  },
  update(id: string, body: any): Promise<AxiosResponse> {
    return requests.put(`/reports/${id}`, body)
  },
  updateAssesst(assesstId: string, body: any): Promise<AxiosResponse> {
    return requests.put(`/reports/inspect/${assesstId}`, body)
  },
  updateLabel(reportId: string, labelId: string, body: any): Promise<AxiosResponse> {
    return requests.put(`/reports/label/${reportId}/${labelId}`, body)
  },
  delete(id: string): Promise<AxiosResponse> {
    return requests.delete(`/reports/${id}`)
  },
  // ==================================================================================
  // ===========================@Report Version========================================
  // ==================================================================================
  updateVersionLabel(id: string, body: any): Promise<AxiosResponse> {
    return requests.put(`/reports/version/label/${id}`, body)
  },
  updateVersionMeta(id: string, body: any): Promise<AxiosResponse> {
    return requests.put(`/reports/version/meta/${id}`, body)
  },
  // ==================================================================================
  // ===========================@Report Version========================================
  // ==================================================================================
  sendToClientDistributors(id: string): Promise<AxiosResponse> {
    return requests.post(`/distributor/client/${id}`)
  }
}

export default Services
