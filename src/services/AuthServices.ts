import { AxiosResponse } from 'axios'
import { IUser } from 'src/types/apps/user'
import requests from './httpService'
import { ForgotPasswordParams, ResetPasswordParams } from 'src/context/types'

const AuthServices = {
  login(body: any): Promise<AxiosResponse<any, any>> {
    return requests.post(`/auth/signin`, body)
  },
  signup(body: any, query?: any): Promise<AxiosResponse<any, any>> {
    if (query !== null) {
      return requests.post(`/auth/signup?referCode=${query}`, body)
    } else {
      return requests.post(`/auth/signup`, body)
    }
  },
  profileUpdate(id: string, body: IUser): Promise<AxiosResponse<any, any>> {
    return requests.put(`/auth/users/${id}`, body)
  },
  changePassword(body: IUser): Promise<AxiosResponse<any, any>> {
    return requests.put(`/auth/change/password`, body)
  },
  me(): Promise<AxiosResponse<any, any>> {
    return requests.get(`/auth/me`)
  },
  forgotPassword(body: ForgotPasswordParams): Promise<AxiosResponse<any, any>> {
    return requests.post(`/auth/forgot-password`, body);
  },
  resetPassword(body: ResetPasswordParams, token: string): Promise<AxiosResponse<any, any>> {
    return requests.post(`/auth/reset-password?token=${token}`, body);
  },
  channelSwitch(id: number): Promise<AxiosResponse<any, any>> {
    return requests.get(`/auth/switch/${id}`)
  }
}

export default AuthServices
