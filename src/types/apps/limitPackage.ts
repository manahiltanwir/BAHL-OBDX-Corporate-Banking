export type CoverageType = 'ACTIVITY' | 'ACTIVITY_GROUP'

export type Status = 'idle' | 'pending' | 'success' | 'error'

export interface ILimitValues {
  perTransactionAmount: number
  dailyCumulativeAmount: number
  monthlyCumulativeAmount: number
  dailyTransactionCount: number
  monthlyTransactionCount: number
}

export interface ILimitPackagePayload {
  packageCode: string
  packageName: string
  coverageType: CoverageType
  operationCode: string | null
  groupId: number | null
  channel: string
  currency: string
  limits: ILimitValues
}

export interface ILimitPackage extends ILimitPackagePayload {
  id: number | string | null
}

export interface IPackageGroup {
  groupId: number
  groupCode: string
  groupName: string
  description: string
  active: boolean
  operationCodes: string[]
}

export interface IPackageActivity {
  operationCode: string
  operationName: string
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

export interface IMutationResult {
  message: string
}