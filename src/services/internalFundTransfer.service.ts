import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import {
  TitleFetchPayload, InstantTransferPayload, BeneTransferPayload} from 'src/types/apps/internalFundTrasnfer'

const Services = {
  fetchTitle(body: TitleFetchPayload): Promise<AxiosResponse> {
    return requests.post(`/internal-transfer/api/title-fetch`, body)
  },

  instantTransfer(body: InstantTransferPayload): Promise<AxiosResponse> {
    return requests.post(`/internal-transfer/api/internal-transfer-instant`, body)
  },

  beneTransfer(body: BeneTransferPayload): Promise<AxiosResponse> {
    return requests.post(`/internal-transfer/api/internal-transfer-bene`, body)
  }
}

export default Services