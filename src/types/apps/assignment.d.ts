import { IProject } from './project'

export interface IAssignment {
  id: string
  status: boolean
  projectId: string
  project: IProject
  [key: string]: any
}

export interface IAssignmentStatus {
  [key: string]: {
    color: ThemeColor
  }
}
