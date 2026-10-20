import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { ImportLCFormState } from 'src/types/apps/lc'
import { GetParams } from 'src/types/api'

const Services = {
  getAll({ query }: GetParams): Promise<AxiosResponse> {
    return requests.get(`/category`, { params: query })
  },
  getAllBeneficiariesByParty(partyId: string): Promise<AxiosResponse> {
    return requests.get(`lc-service/lc-beneficiary/search-by-party/${partyId}`)
  },
  getAllAdvisoryBankByParty(partyId: string): Promise<AxiosResponse> {
    return requests.get(`/lc-service/lc-advising-bank/search-by-party/${partyId}`)
  },
  getById(id: string): Promise<AxiosResponse> {
    return requests.get(`/category/${id}`)
  },
  getLCReferenceNo(): Promise<AxiosResponse> {
    return requests.get(`lc-service/lc-reference-number/generate-lc-ref`)
  },
  add(body: ImportLCFormState): Promise<AxiosResponse> {
    return requests.post('/lc-service/lc/create-lc', body)
  },
  update(id: string, body: ImportLCFormState): Promise<AxiosResponse> {
    return requests.put(`category/${id}`, body)
  },
  delete(id: string): Promise<AxiosResponse> {
    return requests.delete(`category/${id}`)
  }
  // search({ query }: GetParams): Promise<AxiosResponse> {
  //   return requests.get(`category?${query}`)
  // },
}

export default Services
