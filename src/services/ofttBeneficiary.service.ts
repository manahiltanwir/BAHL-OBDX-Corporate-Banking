import httpService from 'src/services/httpService'
import {
  CreateOfttBeneficiaryPayload,
  CreateOfttBeneficiaryResponse,
  OfttBeneficiaryFormInput
} from 'src/types/apps/ofttBeneficiary'

// Dropdown ki value (code) -> API ko bhejne wala poora naam
// Add page ke countryOptions ke labels se bilkul match hona chahiye
const COUNTRY_NAMES: Record<string, string> = {
  PK: 'Pakistan',
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia',
  GB: 'United Kingdom',
  US: 'United States'
}

// Form ke field names ko API ke field names me badalta hai
export const toCreateOfttPayload = (input: OfttBeneficiaryFormInput): CreateOfttBeneficiaryPayload => ({
  toBankName: input.bank.trim(),
  accountNumberIban: input.accountNumber.trim(),
  beneficiaryName: input.name.trim(),
  department: input.department.trim(),
  subDepartment: input.subDepartment.trim(),
  streetName: input.streetName.trim(),
  buildingNumber: input.buildingNumber.trim(),
  buildingName: input.buildingName.trim(),
  floor: input.floor.trim(),
  postbox: input.postBox.trim(),
  room: input.room.trim(),
  postCode: input.postCode.trim(),
  townName: input.townName.trim(),
  townLocationName: input.townLocationName.trim(),
  districtName: input.districtName.trim(),
  countrySubdivision: input.countrySubdivision.trim(),
  country: input.country.trim().toUpperCase()
})

export const createOfttBeneficiary = (payload: CreateOfttBeneficiaryPayload) =>
  httpService.post<CreateOfttBeneficiaryResponse>('/oftt-service/beneficiary/create', payload)