import { AxiosResponse } from 'axios'
import requests from 'src/services/httpService'
import { IAlertTemplateUpdatePayload } from 'src/types/apps/alertMaintenance'

const Services = {
    // 1. Enterprise roles
    getEnterpriseRoles(): Promise<AxiosResponse> {
        return requests.get('alert-maintenance-service/alert-maintenance/enterprise-roles')
    },

    // 2. Tasks 
    getTasks(enterpriseRoleId: string | number): Promise<AxiosResponse> {
        return requests.get(`alert-maintenance-service/alert-maintenance/tasks/${enterpriseRoleId}`)
    },

    // 3. Templates of a task service 
    getTemplates(taskServiceId: number): Promise<AxiosResponse> {
        return requests.post('alert-maintenance-service/alert-maintenance/alert-templates', [taskServiceId])
    },

    // 4. Update
    updateTemplate(alertTemplateId: number, body: IAlertTemplateUpdatePayload): Promise<AxiosResponse> {
        return requests.put(`alert-maintenance-service/alert-maintenance/alert-templates/${alertTemplateId}`, body)
    }
}

export default Services