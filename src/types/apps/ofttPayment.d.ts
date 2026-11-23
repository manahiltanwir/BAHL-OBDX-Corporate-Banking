export interface OfttPaymentForm {
  transferFrom: string // source account ka IBAN
  amount: string
  currency: string
  beneficiaryBank: string
  beneficiaryAccountNumber: string
  beneficiaryName: string
  country: string
  purpose: string
  relationship: string
  department: string
  subDepartment: string
  streetName: string
  buildingNumber: string
  buildingName: string
  floor: string
  postBox: string
  room: string
  postCode: string
  townName: string
  townLocationName: string
  districtName: string
  countrySubdivision: string
}

export interface OfttPaymentPayload {
  fromAccount: string
  amount: number
  currency: string
  beneficiaryMode: 'N'
  beneficiaryBank: string
  beneficiaryIBAN: string
  beneficiaryName: string
  beneficiaryCountry: string
  paymentPurpose: string
  purposeCode: string
  relationship: string
  department: string
  subDepartment: string
  streetName: string
  buildingNumber: string
  buildingName: string
  floor: string
  postBox: string
  room: string
  postCode: string
  townName: string
  townLocationName: string
  districtName: string
  countrySubdivision: string
}

export interface OfttPaymentResult {
  referenceNo: string
  externalReferenceNo: string | null
  status: string
  message: string
}

export interface OfttPaymentResponse {
  status: number
  message: string
  data: OfttPaymentResult
}