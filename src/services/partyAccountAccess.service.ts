import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { MappingPayload } from 'src/types/apps/partyAccountAccess'

const Services = {
  searchParty(partyId: string): Promise<AxiosResponse> {
    return requests.get(`/party-service/api/${partyId}`)
  },

  getAccountAccess(partyId: string): Promise<AxiosResponse> {
    return requests.get(`/account-access/partyAccountAccess/${partyId}`)
  },

  updateAccountMapping(body: MappingPayload): Promise<AxiosResponse> {
    return requests.post(`/account-access/partyAccountAccess/mapping`, body)
  }
}

export default Services