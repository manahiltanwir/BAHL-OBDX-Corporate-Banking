

export interface EnterpriseRoleDef {
  id: number
  name: string
}

export interface RoleDef {
  id: number
  name: string
}

export interface TaskDef {
  id: number
  name: string
}

export interface ServiceDef {
  id: number
  name: string
}

export type EnabledServiceMap = Record<number, Record<number, Record<number, number[]>>>