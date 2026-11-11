export interface TransferFromAccount {
  accountNumber: string
  accountStatus: string
  accountTitle: string
  accountType: string
  balance: number
  createdDate: string
  partyId: string
  currency: string
}

export interface FundTransferForm {
  transferFrom: string
  currency: string
  amount: string
  beneficiaryMode: 'existing' | 'new'
  selectedBeneficiaryId: string
  beneficiaryBank: string
  beneficiaryAccountNumber: string
  beneficiaryName: string
  purposeCode: string
}

export interface TitleFetchPayload {
  toAccount: string
  amount: string
  titleType: string
}

export interface TitleFetchResponse {
  status: string
  accountTitle: string
}

export interface InternalTransferPayload {
  fromAccount: string
  toAccount: string
  toAccountName: string
  currency: string
  amount: number
  isBeneExists: 'Y' | 'N'
  purpose: string
  purposeCode: string
  createdBy: string
  referenceNo?: string
  externalReferenceNo?: string
}

export interface InternalTransferResponse {
  code: string
  externalReferenceNo: string
  paymentId: string
  referenceNo: string
  status: string
}

// Page se thunk ko jane wala data
export interface ReviewTransferArgs {
  fromAccount: string
  toAccount: string
  currency: string
  amount: number
  isBeneExists: 'Y' | 'N'
  purpose: string
  purposeCode: string
  createdBy: string
}

// Review page ko chahiye: jo bheja gaya + jo wapas aaya 
export interface ReviewState {
  draft: TransferDraft
  toAccountName: string
}

//Changes done for beneficiary by faizan 22-10-2026
export interface Beneficiary {
  id: number
  accountInfo: string
  bankName: string
  beneficiaryName: string
  beneficiaryType: string
  nickname: string
  partyId: string
  userId: string
  createdBy: string
  creationDate: string
  updatedBy: string | null
  updationDate: string | null
}

export interface BeneficiariesResponse {
  status: string
  message: string
  data: Beneficiary[]
}

// Form se aane wala data, jo review screen aur confirm ko chahiye 
export interface TransferDraft {
  fromAccount: string
  toAccount: string
  currency: string
  amount: number
  isBeneExists: 'Y' | 'N'
  purpose: string
  purposeCode: string
  createdBy: string
  beneficiaryId?: number // sirf save-shuda (existing) beneficiary me 
}

interface TransferPayloadBase {
  fromAccount: string
  toAccount: string
  toAccountName: string
  currency: string
  amount: number
  purpose: string
  purposeCode: string
}

// /internal-transfer-instant: beneficiary save nahi hai (account number haath se likha) 
export interface InstantTransferPayload extends TransferPayloadBase {
  isBeneExists: 'N'
}

// /internal-transfer-bene: save-shuda beneficiary 
export interface BeneTransferPayload extends TransferPayloadBase {
  isBeneExists: 'Y'
  beneficiaryId: number
}