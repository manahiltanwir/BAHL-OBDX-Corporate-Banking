export interface EnterpriseRoleApi {
  enterpriseRole: string
  id: number
}

export interface RoleApi {
  id: number
  roleName: string
  enterpriseRoleId: string
  createdBy: string
  creationDate: string
  updatedBy: string | null
  updationDate: string
}

export interface TaskServiceApi {
  id: number
  taskId: number
  operationCode: string
  operationName: string
  serviceId: string
  servicePath: string
  apiEndpoint: string
  createdBy: string
  creationDate: string
  updatedBy: string | null
  updatedDate: string
}

export interface TaskApi {
  id: number
  enterpriseRoleId: number
  taskCode: string
  taskName: string
  category: string
  taskServices: TaskServiceApi[]
  createdBy: string
  creationDate: string
  updatedBy: string | null
  updatedDate: string
}

// Response wrapper for GET /role-task-service/tasks
export interface AllTasksResponse {
  tasks: TaskApi[]
}

export interface MappedServiceItem {
  taskServiceId: number
  taskId: number
  taskCode: string
  taskName: string
  operationCode: string
  operationName: string
  serviceId: string
  servicePath: string
  apiEndpoint: string
  isMapped: boolean
}

export interface TaskServiceRoleMappingResponse {
  enterpriseRoleId: number
  enterpriseRoleName: string
  roleId: number
  roleName: string
  services: MappedServiceItem[]
}

export interface CreateRoleItem {
  enterpriseRoleId: string
  roleName: string
  createdBy: string
}

export interface CreateRolePayload {
  roles: CreateRoleItem[]
}

export interface ServiceMappingActionItem {
  taskServiceId: number
  actionType: 'map' | 'unmap'
}

export interface UpdateTaskServiceMappingPayload {
  roleId: number
  services: ServiceMappingActionItem[]
  updatedBy: string
}

export interface TaskCoverage {
  enabled: number
  total: number
}
export interface MappedComponentItem {
  taskId: number
  componentId: number
  componentName: string
  isMapped: boolean
}

export interface ComponentNode {
  id: number
  name: string
  component: string | null
  mapped: boolean
  parentId: number | null
  components: ComponentNode[]
}

export type ComponentRoleMappingResponse = ComponentNode[]

export interface UpdateComponentMappingPayload {
  roleId: number
  updatedBy: string
  components: { componentId: number; actionType: 'MAP' | 'UNMAP' }[]
}