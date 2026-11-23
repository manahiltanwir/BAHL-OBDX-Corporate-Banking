import { AxiosResponse } from 'axios'
import requests from 'src/services/httpService'
import { ILimitPackagePayload } from 'src/types/apps/limitPackage'

const Services = {
    getAll(): Promise<AxiosResponse> {
        return requests.get('limit-management-service/api/v1/packages')
    },

    create(body: ILimitPackagePayload): Promise<AxiosResponse> {
        return requests.post('limit-management-service/api/v1/packages', body)
    },

    getGroups(): Promise<AxiosResponse> {
        return requests.get('limit-management-service/api/v1/activity-groups')
    },

    getFinancialTransactions(enterpriseRoleId: number | string): Promise<AxiosResponse> {
        return requests.get(`/role-task-service/tasks/category/${enterpriseRoleId}/financial`)
    }
}

export default Services