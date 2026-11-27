import httpService from 'src/services/httpService'
import { countryOptions, purposeOptions, relationshipOptions } from 'src/@core/utils/ofttPayment'
import {  OfttBeneficiaryPaymentForm,  OfttBeneficiaryPaymentPayload,  OfttBeneficiaryPaymentResponse,  OfttPaymentForm,
  OfttPaymentPayload,
  OfttPaymentResponse
} from 'src/types/apps/ofttPayment'

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

export const toOfttBeneficiaryPaymentPayload = (form: OfttBeneficiaryPaymentForm): OfttBeneficiaryPaymentPayload => {
  const purpose = purposeOptions.find(option => option.value === form.purpose)
  const relationship = relationshipOptions.find(option => option.value === form.relationship)

  return {
    beneficiaryMode: 'Y',
    beneficiaryIBAN: form.beneficiaryAccountNumber.replace(/\s+/g, '').toUpperCase(),
    fromAccount: form.transferFrom.trim(),
    amount: Number(form.amount),
    currency: form.currency.trim().toUpperCase(),
    paymentPurpose: purpose?.label ?? form.purpose,
    purposeCode: purpose?.code ?? '',
    relationship: relationship?.label ?? form.relationship
  }
}

// Khali string = sab theek, warna user ko dikhane wala message
export const validateOfttBeneficiaryPayment = (payload: OfttBeneficiaryPaymentPayload) => {
  if (!payload.fromAccount) return 'Please select the account to transfer from'
  if (!payload.beneficiaryIBAN) return 'Please select a beneficiary'
  if (!Number.isFinite(payload.amount) || payload.amount <= 0) return 'Please enter a valid amount'
  if (!payload.paymentPurpose) return 'Please select a purpose'
  if (!payload.purposeCode) return 'Purpose code is not configured for the selected purpose'

  return ''
}

export const createOfttBeneficiaryPayment = (payload: OfttBeneficiaryPaymentPayload) =>
  httpService.post<OfttBeneficiaryPaymentResponse>('/oftt-service/api/oftt-payment/createbeneficiarypayment', payload)