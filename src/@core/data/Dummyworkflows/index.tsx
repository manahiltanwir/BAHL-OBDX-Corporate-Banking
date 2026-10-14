export type LevelUserType = 'user' | 'userGroup'

export interface ApprovalLevel {
  id: number
  userType: LevelUserType
  selectedUser: string
}

export type ApprovalFlow = 'sequential' | 'parallel' | 'none'

export const dummyAccountUsers = [
  { id: '99999991_Maker1', label: 'Maker 1 (99999991_Maker1)' },
  { id: '99999991_Checker1', label: 'Checker 1 (99999991_Checker1)' },
  { id: '99999992_Maker1', label: 'Maker 1 (99999992_Maker1)' },
  { id: '99999992_Checker1', label: 'Checker 1 (99999992_Checker1)' },
  { id: '99999993_Maker1', label: 'Maker 1 (99999993_Maker1)' },
  { id: '99999993_Checker1', label: 'Checker 1 (99999993_Checker1)' }
]