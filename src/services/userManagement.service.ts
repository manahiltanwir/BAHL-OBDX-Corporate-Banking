import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'
import { UserManagementForm } from 'src/types/apps/userManagement';
import { GetParams } from 'src/types/api'

const Services = {
  getAll({ query }: GetParams): Promise<AxiosResponse> {
    return requests.get(`/dashboard`, { params: query })
  },
  getUsers(body: UserManagementForm): Promise<AxiosResponse> {
    return requests.post(`/usermanagement-service/users/search`, body)
  },
  getById(id: string): Promise<AxiosResponse> {
    return requests.get(`/usermanagement-service/users/search/userid/${id}`)
  },
  add(body: UserManagementForm): Promise<AxiosResponse> {
    console.log(body);
    
    return requests.post('/usermanagement-service/users/createuser', body)
  },
  update(id: string, body: UserManagementForm): Promise<AxiosResponse> {
    return requests.patch(`/usermanagement-service/users/updateuser/${id}`, body)
  },
  updateStatus(id: string, body: UserManagementForm): Promise<AxiosResponse> {
    return requests.patch(`/usermanagement-service/users/lockunlock/${id}`, body)
  },
  updateUsername(id: string): Promise<AxiosResponse> {
    return requests.patch(`/usermanagement-service/users/updateuser/${id}`)
  },
  checkUsernameAvailability(username: string): Promise<AxiosResponse> {
    return requests.get(`/usermanagement-service/users/search/checkusernameexists/${username}`)
  },
  delete(id: string): Promise<AxiosResponse> {
    return requests.delete(`dashboard/${id}`)
  },
};

export default Services;
