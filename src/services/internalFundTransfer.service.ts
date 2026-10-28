import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { InternalFundTransferPayload, TitleFetchPayload, InternalTransferPayload } from 'src/types/apps/internalFundTrasnfer'

const Services = {
  submitTransfer(body: InternalFundTransferPayload): Promise<AxiosResponse> {
    return requests.post(`/payment-service/api/internal-fund-transfer`, body) // <-- URL placeholder
  },

  fetchTitle(body: TitleFetchPayload): Promise<AxiosResponse> {
    return requests.post(`internal-transfer/api/title-fetch`, body) // <-- service prefix check karein
  },

  internalTransfer(body: InternalTransferPayload): Promise<AxiosResponse> {
    return requests.post(`/internal-transfer/api/internal-transfer`, body)
  },

  //Changes done for beneficiary by faizan 22-10-2026
  // getBeneficiaries(cnic: string): Promise<AxiosResponse> {
  // return requests.get(`/internal-transfer/beneficiary/partyid/${cnic}`)
  // }
}

export default Services