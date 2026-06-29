
export interface ICategory {
  order: number
  name: string
  title: string
  status: string
  id: string
  image: string
  createdAt?: Date
}

export interface CategoryApi extends ICategory {
  id: string,
  createdAt: Date
  updatedAt: Date
}

export interface CategoryForm extends ICategory { }

export type CategoryKeys = keyof CategoryForm;
