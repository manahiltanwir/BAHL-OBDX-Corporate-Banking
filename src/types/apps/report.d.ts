import { IAssignment } from './assignment'
export interface IReport {
  id: string
  // name: string,
  // max_image: number,
  // max_video: number,
  // max_doc: number,
  // labelId: string,
  // assignmentId: string,
  [key: string]: any
  assignment: IAssignment
  assignmentId: IAssignment['id']
}

export type LabelsOnReports = {
  details: string | null
  reportId: string
  labelId: string
}
