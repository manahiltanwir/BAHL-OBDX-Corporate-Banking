export interface TermDepositAccount {
  accountDisplayName: string
  accountId: string
  accountStatus: string
  branchId: string
  certificateNo: string
  currency: string
  depositDate: string
  interestRate: number
  maturityAmount: number
  maturityDate: string
  partyId: string
  principalAmount: number
  productId: string
}

export interface TermDepositDetails extends TermDepositAccount {
  accruedInterest: number
  availableBalance: number
  currentPrincipalAmount: number
  holdAmount: number
  holdingPattern: string
  lastInterestAccrualDate: string
  payoutAccountId: string
  payoutPercentage: number
  redemptionAmount: number
  redemptionCharges: number
  redemptionDate: string
  redemptionNewPrincipalAmount: number
  redemptionType: string
  rolloverAmount: number
  rolloverType: string
  tenureDays: number
  tenureMonths: number
  tenureYears: number
  valueDate: string
}

export interface TermDepositDetailsPayload {
  partyId: string
  accountId: string
}

export interface TermDepositResponse<T> {
  status: string
  data: T
}