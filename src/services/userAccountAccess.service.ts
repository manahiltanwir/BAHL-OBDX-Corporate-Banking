import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { UserMappingPayload } from 'src/types/apps/userAccountAccess'

const Services = {
  searchPartyUsers(partyId: string): Promise<AxiosResponse> {
    return requests.get(`/usermanagement-service/users/search/partyId/${partyId}`)
  },

  getUserAccountAccess(partyId: string, userId: string): Promise<AxiosResponse> {
    return requests.get(`/account-access/userAccountAccess/${partyId}/${userId}`)
  },

  updateUserAccountMapping(body: UserMappingPayload): Promise<AxiosResponse> {
    return requests.post(`/account-access/userAccountAccess/mapping`, body)
  }
}

export default Services