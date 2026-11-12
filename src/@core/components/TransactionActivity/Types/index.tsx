export const colors = {
  green: '#15804f',
  greenHover: '#309a6a',
  yellow: '#eab308',
  yellowHover: '#F0A528',
  danger: '#ef4444',
  dangerHover: '#dc2626'
}

export type RequestStatus = 'pending' | 'approved' | 'rejected'

export type RequestType = string

export interface ApprovalRequest {
  id: string
  serialNo?: number
  type: RequestType
  operationCode?: string
  maker: string 
  makerId?: string
  details?: string
  amount?: number
  currency?: string
  initiatedDate: string
  status: RequestStatus
  executionStatus?: string
  actionedBy?: string 
  approverId?: string
  actionedDate?: string
  remarks?: string
  serviceId?: string
  contextId?: string
  step?: number
}

export const statusChipStyle: Record<RequestStatus, { label: string; bg: string }> = {
  pending: { label: 'Pending', bg: colors.yellow },
  approved: { label: 'Approved', bg: colors.green },
  rejected: { label: 'Rejected', bg: colors.danger }
}

export const formatAmount = (request: ApprovalRequest) =>
  request.amount === undefined || request.amount === null
    ? ''
    : `${request.currency ? `${request.currency} ` : ''}${request.amount.toLocaleString('en-US', {
        minimumFractionDigits: 2
      })}`