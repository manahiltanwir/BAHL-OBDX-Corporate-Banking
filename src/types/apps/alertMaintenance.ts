export interface IEnterpriseRole {
  id: number
  enterpriseRole: string
}

export interface ITaskService {
  id: number
  operationName: string
  operationCode: string
  apiEndpoint: string
  endpoint: string
  method: string
  serviceId: string
}

export interface ITask {
  category: string
  taskCode: string
  taskId: number
  taskName: string
  taskServices: ITaskService[]
}

export type AlertType = 'EMAIL' | 'SMS'

export interface IAlertTemplate {
  id: number
  alertType: AlertType | string
  content: string
  isEnabled: 'Y' | 'N'
  name: string
  subject: string
}

// Either one or both fields can be sent
export interface IAlertTemplateUpdatePayload {
  isEnabled?: 'Y' | 'N'
  content?: string
}