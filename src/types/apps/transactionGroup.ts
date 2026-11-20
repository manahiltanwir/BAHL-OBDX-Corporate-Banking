
export interface IActivityGroup {
  groupId: number
  groupCode: string
  groupName: string
  description: string
  active: boolean
  operationCodes: string[]
}

export interface IActivityGroupPayload {
  groupCode: string
  groupName: string
  description: string
  operationCodes: string[]
}

export interface IFinancialTaskService {
  id: number
  operationCode: string
  operationName: string
  serviceId: string
  servicePath: string
  apiEndpoint: string | null
  isWorkflowRequired?: 'Y' | 'N' | string
}

export interface IFinancialTask {
  id: number
  category: string
  taskCode: string
  taskName: string
  enterpriseRoleId: number
  taskServices: IFinancialTaskService[]
}

export interface ITransactionItem {
  transactionCode: string 
  transactionName: string 
}

export interface IMutationResult {
  message: string
}