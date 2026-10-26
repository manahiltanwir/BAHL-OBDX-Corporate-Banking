import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { AdminUserManagementForm } from 'src/types/apps/adminUserManagement';
import { GetParams } from 'src/types/api'

const Services = {
  getAll({ query }: GetParams): Promise<AxiosResponse> {
    return requests.get(`/dashboard`, { params: query })
  },
  getUsers(body: AdminUserManagementForm): Promise<AxiosResponse> {
    return requests.post(`/usermanagement-service/admins/search`, body)
  },
  resendUsername(userId: string): Promise<AxiosResponse> {
    return requests.post(`/usermanagement-service/admins/resendusername/${userId}`)
  },
  resetPassword(userId: string): Promise<AxiosResponse> {
    return requests.post(`/usermanagement-service/admins/resetpassword/${userId}`)
  },
  getById(id: string): Promise<AxiosResponse> {
    return requests.get(`/usermanagement-service/admins/search/userid/${id}`)
  },
  getRolesById(id: string): Promise<AxiosResponse> {
    return requests.get(`/role-task-service/roles/enterprise-role/100000`)
  },
  add(body: AdminUserManagementForm): Promise<AxiosResponse> {
    return requests.post('/usermanagement-service/admins/createuser', body)
  },
  update(id: string, body: AdminUserManagementForm): Promise<AxiosResponse> {
    return requests.patch(`/usermanagement-service/admins/updateuser/${id}`, body)
  },
  updateStatus(id: string, body: AdminUserManagementForm): Promise<AxiosResponse> {
    return requests.patch(`/usermanagement-service/admins/lockunlock/${id}`, body)
  },
  updateUsername(id: string): Promise<AxiosResponse> {
    return requests.patch(`/usermanagement-service/admins/updateuser/${id}`)
  },
  checkUsernameAvailability(username: string): Promise<AxiosResponse> {
    return requests.get(`/usermanagement-service/admins/search/checkusernameexists/${username}`)
  },
  delete(id: string): Promise<AxiosResponse> {
    return requests.delete(`dashboard/${id}`)
  },
};

export default Services;
