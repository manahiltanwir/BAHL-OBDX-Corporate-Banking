// Add page ke form ka data (OfttBeneficiaryInput isi shape ka hai)
export interface OfttBeneficiaryFormInput {
  bank: string
  accountNumber: string
  name: string
  country: string
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

export interface CreateOfttBeneficiaryPayload {
  toBankName: string
  accountNumberIban: string
  beneficiaryName: string
  department: string
  subDepartment: string
  streetName: string
  buildingNumber: string
  buildingName: string
  floor: string
  postbox: string
  room: string
  postCode: string
  townName: string
  townLocationName: string
  districtName: string
  countrySubdivision: string
  country: string
}

export interface OfttBeneficiary extends CreateOfttBeneficiaryPayload {
  id: number
  partyId: string
  createdAt: string
  createdBy: string
  updatedAt: string | null
  updatedBy: string | null
}

export interface CreateOfttBeneficiaryResponse {
  status: number
  message: string
  data: OfttBeneficiary
}