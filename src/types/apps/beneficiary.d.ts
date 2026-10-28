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

export interface CreateBeneficiaryPayload {
  beneficiaryType: string
  bankName: string
  accountInfo: string
  nickname: string
  createdBy: string
  titleType: string
}

export interface AddBeneficiaryDraft {
  bankName: string
  accountNumber: string
  nickname: string
}

export interface AddBeneficiaryReview {
  draft: AddBeneficiaryDraft
  beneficiaryName: string // title-fetch se, jaisa aaya waisa 
  }