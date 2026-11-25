export interface RecentTransactionsPayload {
  accountId: string
  searchByType: 'LAST_N_TXN'
  noOfTransactions: string
}

export interface TxDate {
  dateString?: string // yyyyMMdd, maslan '20261021'
}

export interface TxMoney {
  amount: string // maslan '98000.00'
  currency: string
}

export interface RecentTransactionItem {
  postingDate: TxDate
  valueDate: TxDate
  transactionDate: TxDate
  remarks: string
  accountId: string
  subSequenceNumber: number
  amount: TxMoney
  userReferenceNumber: string
  runningBalance: TxMoney
  transactionType: 'C' | 'D'
  externalReferenceId: string
}

export interface RecentTransactionsResponse {
  code: string
  message: string
  data: RecentTransactionItem[] | null
}

// Component (RecentTransactions) ki Transaction shape
export interface RecentTransactionView {
  id: string
  name: string
  remarks: string
  amount: number
  currency: string
  status: 'Success' | 'Pending' | 'Failed'
  type: 'credit' | 'debit'
  dateTime: string
}
