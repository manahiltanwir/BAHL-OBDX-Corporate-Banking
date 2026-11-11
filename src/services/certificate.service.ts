import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import {AccountStatementPayload, CertificateRequestPayload, BalanceCertificatePayload } from 'src/types/apps/certificate'

const Services = {
  requestBalanceCertificate(body: BalanceCertificatePayload):
Promise<AxiosResponse> {
    return requests.post(`/account-service/api/balance-certificate`, body)
  },

  requestMaintenanceCertificate(body: CertificateRequestPayload):
      Promise<AxiosResponse> {
    return requests.post(`/account-service/api/maintenance-certificate`, body)
  },

  requestAccountStatement(body: AccountStatementPayload):
Promise<AxiosResponse> {
    return requests.post(`/account-service/api/accountstatement`, body)
  }
}

export default Services