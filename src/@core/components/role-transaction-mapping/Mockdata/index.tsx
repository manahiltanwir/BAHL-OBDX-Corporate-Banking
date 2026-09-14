import type { EnabledServiceMap, EnterpriseRoleDef, RoleDef, ServiceDef, TaskDef } from '../Types'
export const ENTERPRISE_ROLES: EnterpriseRoleDef[] = [
  { id: 1, name: 'Administrator' },
  { id: 2, name: 'Backoffice Administrator' },
  { id: 3, name: 'Corporate Administrator' },
  { id: 4, name: 'Corporate User' },
]

export const ROLES: RoleDef[] = [
  { id: 1, name: 'CPU Viewer' },
  { id: 2, name: 'Maker Viewer' },
  { id: 3, name: 'Checker' },
  { id: 4, name: 'CIM' },
  { id: 5, name: 'Call Center' },
  { id: 6, name: 'Call Center User' },
  { id: 7, name: 'Senior Maker 1' },
  { id: 8, name: 'CIM User' },
  { id: 9, name: 'Viewer' },
  { id: 10, name: 'Wajahat Viewer' },
  { id: 11, name: 'Shabbir Call Center' },
  { id: 12, name: 'AuthAdmin' },
  { id: 13, name: 'Sagar Viewer' },
  { id: 14, name: 'Sagar Call Center' },
  { id: 15, name: 'Sagar User' },
  { id: 16, name: 'CPU Maker' },
  { id: 17, name: 'CPU Checker' },
  { id: 18, name: 'Maker' },
  { id: 19, name: 'Wajahat Call Center' },
]

// Enterprise Role id -> Role ids assigned under it
export const ENTERPRISE_ROLE_ROLES: Record<number, number[]> = {
  1: [1, 12, 16, 17, 18],
  2: [3, 4, 8, 9],
  3: [2, 7, 10, 13],
  4: [5, 6, 11, 14, 15, 19],
}

export const TASKS: TaskDef[] = [
  { id: 1, name: 'Account Access' },
  { id: 2, name: 'Management' },
  { id: 3, name: 'Party Account Management' },
  { id: 4, name: 'Hello World' },
  { id: 5, name: 'User' },
  { id: 6, name: 'Authentication' },
  { id: 7, name: 'User Management' },
  { id: 8, name: 'Party Management' },
  { id: 9, name: 'User Access Management Sample' },
  { id: 10, name: 'Party' },
]

// Master Task Service catalogue
export const SERVICES: ServiceDef[] = [
  { id: 1, name: 'Create Party Account Access' },
  { id: 2, name: 'Create User Account Access' },
  { id: 3, name: 'READ Party' },
  { id: 4, name: 'Hello' },
  { id: 5, name: 'Secure' },
  { id: 6, name: 'Create New Customer' },
  { id: 7, name: 'Change Password' },
  { id: 8, name: 'Change Username' },
  { id: 9, name: 'Login' },
  { id: 10, name: 'Logout' },
  { id: 11, name: 'DELETE Party' },
  { id: 12, name: 'UPDATE Party' },
]

// Which services belong to which task
export const TASK_SERVICES: Record<number, number[]> = {
  1: [3, 9, 10],
  2: [1, 2, 7, 8],
  3: [1, 3, 11, 12],
  4: [4, 5],
  5: [7, 8, 9, 10],
  6: [9, 10, 7],
  7: [6, 7, 8],
  8: [1, 3, 11, 12],
  9: [1, 2],
  10: [3, 6, 11, 12],
}

// enterpriseRoleId -> roleId -> taskId -> enabled service ids
export const INITIAL_ENABLED: EnabledServiceMap = {
  1: {
    1: { 1: [3, 9] },
    12: { 6: [7, 8] },
    16: { 1: [3], 2: [1] },
    17: { 1: [3], 3: [1, 3] },
    18: { 1: [3], 2: [1], 3: [1, 3] },
  },
  2: {
    3: { 2: [1, 2], 3: [1, 11] },
    4: { 1: [3, 9] },
    8: { 1: [3, 9] },
    9: { 1: [3] },
  },
  3: {
    2: { 1: [3, 9] },
    7: { 1: [3], 2: [1], 3: [1] },
    10: { 1: [3] },
    13: { 1: [3] },
  },
  4: {
    5: { 1: [3], 6: [7] },
    6: { 1: [3] },
    11: { 1: [3], 6: [7] },
    14: { 1: [3], 6: [7] },
    15: { 1: [3] },
    19: { 1: [3], 6: [7] },
  },
}