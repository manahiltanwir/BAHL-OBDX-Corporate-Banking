import { AxiosResponse } from 'axios'
import { IUser } from 'src/types/apps/user'
import requests from './httpService'
import { ForgotPasswordParams, ResetPasswordParams } from 'src/context/types'

const AuthServices = {
  login(body: any, activity?: string, userDetails?: any): Promise<AxiosResponse<any, any>> {
    
    return requests.post(`/auth-server/auth/login`, body, activity == 'OTP' ? {
      headers: {
        'x-2fa-challenge-id': userDetails.challengeId,
        'x-2fa-verification-token': userDetails.verificationToken,
        'x-2fa-otp': userDetails.otp
      }
    } : {})
  },
  logout(refreshToken: string | null): Promise<AxiosResponse<any, any>> {
    return requests.post(`/auth-server/auth/logout?refreshToken=${refreshToken}`)
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
  changePassword(body: {
    userId: string
    oldPassword: string
    newPassword: string
    updatedBy: string
  }): Promise<AxiosResponse<any, any>> {
    return requests.put(`user-service/user/change-password`, body)
  },
  forceChangePassword(body: {
    currentPassword: string
    newPassword: string
    confirmNewPassword: string
  }): Promise<AxiosResponse<any, any>> {
    return requests.post(`/auth-server/auth/forceChangePassword`, body)
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