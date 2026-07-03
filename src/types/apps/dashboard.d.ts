
export interface IDashboard {
  order: number
  name: string
  title: string
  status: string
  id: string
  image: string
  createdAt?: Date
}

export interface DashboardApi extends IDashboard {
  id: string,
  createdAt: Date
  updatedAt: Date
}

export interface DashboardForm extends IDashboard { }

export type DashboardKeys = keyof DashboardForm;
