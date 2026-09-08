import { AxiosResponse } from 'axios'
import requests from './httpService'

const UserServices = {
  changePassword(body: {
    userId: string
    oldPassword: string
    newPassword: string
    updatedBy: string
  }): Promise<AxiosResponse<any, any>> {
    return requests.put(`/user-service/user/change-password`, body)
  },

  changeUsername(body: {
    userId: string
    username: string
    updatedBy: string
  }): Promise<AxiosResponse<any, any>> {
    return requests.put(`/user-service/user/change-username`, body)
  }
}

export default UserServices