export const colors = {
  green: '#15804f',
  greenHover: '#309a6a',
  yellow: '#eab308',
  yellowHover: '#F0A528',
  danger: '#ef4444',
  dangerHover: '#dc2626'
}

export type RequestStatus = 'pending' | 'approved' | 'rejected'

export type RequestType =
  | 'Single Payment'
  | 'Bulk Payment'
  | 'Create User'
  | 'Update User'
  | 'Party Onboarding'
  | 'Limit Change'

export interface ApprovalRequest {
  id: string
  type: RequestType
  maker: string
  details: string
  amount?: number
  currency?: string
  initiatedDate: string
  status: RequestStatus
  actionedBy?: string
  actionedDate?: string
  remarks?: string
}

// TODO: yeh mock data real API (pending approvals queue) se replace karein
export const initialRequests: ApprovalRequest[] = [
  {
    id: 'REQ-10231',
    type: 'Single Payment',
    maker: 'Ahmed Raza',
    details: 'Acme Technologies (Andorra)',
    amount: 250000,
    currency: 'PKR',
    initiatedDate: '2026-08-27 11:20 AM',
    status: 'pending'
  },
  {
    id: 'REQ-10232',
    type: 'Bulk Payment',
    maker: 'Sana Khan',
    details: 'Batch BATCH-OFTT-2026-0825 (3 transactions)',
    amount: 489000,
    currency: 'PKR',
    initiatedDate: '2026-08-27 10:05 AM',
    status: 'pending'
  },
  {
    id: 'REQ-10233',
    type: 'Create User',
    maker: 'Bilal Ahmed',
    details: 'New user: fatima.tariq (Maker role)',
    initiatedDate: '2026-08-26 04:40 PM',
    status: 'pending'
  },
  {
    id: 'REQ-10220',
    type: 'Single Payment',
    maker: 'Ahmed Raza',
    details: 'Apex Logistics (UAE)',
    amount: 150000,
    currency: 'PKR',
    initiatedDate: '2026-08-25 09:12 AM',
    status: 'approved',
    actionedBy: 'Imran Sheikh',
    actionedDate: '2026-08-25 11:30 AM'
  },
  {
    id: 'REQ-10218',
    type: 'Limit Change',
    maker: 'Sana Khan',
    details: 'Increase daily limit to 1,000,000 PKR',
    initiatedDate: '2026-08-24 02:15 PM',
    status: 'rejected',
    actionedBy: 'Imran Sheikh',
    actionedDate: '2026-08-24 03:00 PM',
    remarks: 'Limit increase requires additional supporting documents.'
  }
]

export const statusChipStyle: Record<RequestStatus, { label: string; bg: string }> = {
  pending: { label: 'Pending', bg: colors.yellow },
  approved: { label: 'Approved', bg: colors.green },
  rejected: { label: 'Rejected', bg: colors.danger }
}

export const formatAmount = (request: ApprovalRequest) =>
  request.amount
    ? `${request.currency} ${request.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    : '—'