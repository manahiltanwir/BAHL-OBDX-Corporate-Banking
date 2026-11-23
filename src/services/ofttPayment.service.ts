import httpService from 'src/services/httpService'
import { countryOptions, purposeOptions, relationshipOptions } from 'src/@core/utils/ofttPayment'
import { OfttPaymentForm, OfttPaymentPayload, OfttPaymentResponse } from 'src/types/apps/ofttPayment'

// Form ki values (codes) ko API ke labels/names me badalta hai
export const toOfttPaymentPayload = (form: OfttPaymentForm): OfttPaymentPayload => {
  const purpose = purposeOptions.find(option => option.value === form.purpose)
  const relationship = relationshipOptions.find(option => option.value === form.relationship)
  const country = countryOptions.find(option => option.value === form.country.trim().toUpperCase())

  return {
    fromAccount: form.transferFrom.trim(),
    amount: Number(form.amount),
    currency: form.currency.trim().toUpperCase(),
    beneficiaryMode: 'N',
    beneficiaryBank: form.beneficiaryBank.trim(),
    beneficiaryIBAN: form.beneficiaryAccountNumber.trim(),
    beneficiaryName: form.beneficiaryName.trim(),
    beneficiaryCountry: country?.label ?? form.country.trim(),
    paymentPurpose: purpose?.label ?? form.purpose,
    purposeCode: purpose?.code ?? '',
    relationship: relationship?.label ?? form.relationship,
    department: form.department.trim(),
    subDepartment: form.subDepartment.trim(),
    streetName: form.streetName.trim(),
    buildingNumber: form.buildingNumber.trim(),
    buildingName: form.buildingName.trim(),
    floor: form.floor.trim(),
    postBox: form.postBox.trim(),
    room: form.room.trim(),
    postCode: form.postCode.trim(),
    townName: form.townName.trim(),
    townLocationName: form.townLocationName.trim(),
    districtName: form.districtName.trim(),
    countrySubdivision: form.countrySubdivision.trim()
  }
}

export const createOfttPayment = (payload: OfttPaymentPayload) =>
  httpService.post<OfttPaymentResponse>('/oftt-service/api/oftt-payment/create', payload)