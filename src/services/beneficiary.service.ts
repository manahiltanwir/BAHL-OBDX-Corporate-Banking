import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { CreateBeneficiaryPayload } from 'src/types/apps/beneficiary'

const Services = {
  getBeneficiaries(userId: string): Promise<AxiosResponse> {
    return requests.get(`/internal-transfer/beneficiary/userid/${userId}`)
  },

  createBeneficiary(body: CreateBeneficiaryPayload): Promise<AxiosResponse> {
    return requests.post(`/internal-transfer/beneficiary`, body)
  },

  deleteBeneficiary(id: number): Promise<AxiosResponse> {
    return requests.delete(`/internal-transfer/beneficiary/${id}`)
  }
}

export default Services