
export interface IViewStatement {
  accountNumber: string
  id: string
  image: string
  createdAt?: Date
}

export interface ViewStatementApi extends IViewStatement {
  id: string,
  createdAt: Date
  updatedAt: Date
}

export interface ViewStatementForm extends IViewStatement { }

export type ViewStatementKeys = keyof ViewStatementForm;
