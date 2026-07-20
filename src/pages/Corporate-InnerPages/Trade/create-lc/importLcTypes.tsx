// ==========================================
// Import LC — shared types
// ==========================================

export type CustomerType = 'Existing' | 'NonCustomer'
export type LCType = 'Sight' | 'Usance' | 'Mixed Payment'
export type CreditAvailableBy = 'BY ACCEPTANCE' | 'BY PAYMENT' | 'BY DEF PAYMENT' | 'BY NEGOTIATION'
export type Incoterms = 'CIF' | 'FOB' | 'CFR'

export interface DraftRecord {
  id: string
  tenor: string
  creditDaysFrom: string
  draweeBank: string
  amount: number
}

export interface GoodsRecord {
  id: string
  category: string
  description: string
}

export interface DocumentRecord {
  id: string
  selected: boolean
  name: string
  originals: number
  copies: number
  clauses?: string[]
}

export interface ConditionRecord {
  id: string
  code: string
  identifier: string
  description: string
}

export interface CollateralAccount {
  id: string
  accountNumber: string
  balance: number
  contributionPercent: number
  exchangeRate: number
  calculatedAmount: number
}

export interface MarginAccount {
  id: string
  accountNumber: string
  amount: number
  maturityDate: string
}

export interface FinancialCharge {
  id: string
  accountNumber: string
  description: string
  currency: string
  amount: number
}

export interface ImportLCApplicationState {
  // Category 1: LC Details
  customerType: CustomerType
  applicantName: string
  applicantAddress: string
  accounteeName: string
  isTransferable: boolean
  lcType: LCType
  isRevolving: boolean
  productId: string
  expiryDate: string
  expiryPlace: string
  beneficiaryType: 'Existing' | 'New'
  beneficiaryName: string
  beneficiaryAddress: string
  beneficiaryCountry: string
  currency: string
  lcAmount: number
  underTolerancePercent: number
  aboveTolerancePercent: number
  additionalAmountCovered: string
  customerReferenceNumber: string
  creditAvailableBy: CreditAvailableBy
  creditAvailableWith: string
  drafts: DraftRecord[]

  // Category 2: Goods & Shipment
  partialShipment: 'ALLOWED' | 'DISALLOWED'
  transShipment: 'ALLOWED' | 'DISALLOWED'
  placeOfTakingInCharge: string
  portOfLoading: string
  portOfDischarge: string
  placeOfFinalDestination: string
  shipmentInputType: 'Date' | 'Period'
  latestShipmentDate?: string
  shipmentPeriod?: string
  goods: GoodsRecord[]

  // Category 3: Documents & Conditions
  documents: DocumentRecord[]
  conditions: ConditionRecord[]
  presentationDays: string
  incoterms: Incoterms

  // Category 4: Linkages
  collateralCurrency: string
  collateralPercent: number
  collaterals: CollateralAccount[]
  margins: MarginAccount[]

  // Category 5: Instructions & Insurance
  advisingBankType: 'SWIFT' | 'NameAddr'
  advisingBankSwift: string
  specialPaymentConditionsBeneficiary: string
  specialPaymentConditionsBank: string
  confirmationInstruction: 'CONFIRM' | 'MAY ADD' | 'WITHOUT'
  requestedConfirmationParty: string
  senderToReceiverInfo: string
  chargesDetails: string
  selectedInsurancePolicyId?: string

  // Category 6: Charges & Attachments
  charges: FinancialCharge[]
  taxes: FinancialCharge[]
  commissions: FinancialCharge[]
  attachedFile?: File
  saveAsTemplate: boolean
  accessType: 'Public' | 'Private'
  templateName?: string
  termsAccepted: boolean
}

export const DEFAULT_DOCUMENTS: Omit<DocumentRecord, 'id'>[] = [
  { name: 'Commercial Invoice', selected: false, originals: 1, copies: 2 },
  { name: 'Packing List', selected: false, originals: 1, copies: 2 },
  { name: 'Bill of Lading / Airway Bill', selected: false, originals: 3, copies: 2 },
  { name: 'Certificate of Origin', selected: false, originals: 1, copies: 1 },
  { name: 'Insurance Certificate / Policy', selected: false, originals: 1, copies: 1 },
  { name: 'Inspection Certificate', selected: false, originals: 1, copies: 1 },
  { name: "Beneficiary's Certificate", selected: false, originals: 1, copies: 1 },
  { name: 'Weight Certificate', selected: false, originals: 1, copies: 1 },
  { name: 'Phytosanitary Certificate', selected: false, originals: 1, copies: 1 },
  { name: 'Fumigation Certificate', selected: false, originals: 1, copies: 1 }
]

export const buildInitialState = (uuid: () => string): ImportLCApplicationState => ({
  customerType: 'Existing',
  applicantName: '',
  applicantAddress: '',
  accounteeName: '',
  isTransferable: false,
  lcType: 'Sight',
  isRevolving: false,
  productId: 'PROD_IMPORT_SIGHT',
  expiryDate: '',
  expiryPlace: '',
  beneficiaryType: 'Existing',
  beneficiaryName: '',
  beneficiaryAddress: '',
  beneficiaryCountry: '',
  currency: 'USD',
  lcAmount: 0,
  underTolerancePercent: 0,
  aboveTolerancePercent: 10,
  additionalAmountCovered: '',
  customerReferenceNumber: '',
  creditAvailableBy: 'BY ACCEPTANCE',
  creditAvailableWith: '',
  drafts: [],
  partialShipment: 'ALLOWED',
  transShipment: 'ALLOWED',
  placeOfTakingInCharge: '',
  portOfLoading: '',
  portOfDischarge: '',
  placeOfFinalDestination: '',
  shipmentInputType: 'Date',
  goods: [],
  documents: DEFAULT_DOCUMENTS.map((d) => ({ ...d, id: uuid() })),
  conditions: [],
  presentationDays: '21 days after shipment',
  incoterms: 'CIF',
  collateralCurrency: 'USD',
  collateralPercent: 100,
  collaterals: [],
  margins: [],
  advisingBankType: 'SWIFT',
  advisingBankSwift: '',
  specialPaymentConditionsBeneficiary: '',
  specialPaymentConditionsBank: '',
  confirmationInstruction: 'WITHOUT',
  requestedConfirmationParty: 'ADVISING_BANK',
  senderToReceiverInfo: '',
  chargesDetails: '',
  charges: [],
  taxes: [],
  commissions: [],
  saveAsTemplate: false,
  accessType: 'Private',
  termsAccepted: false
})

export const calculateTotalExposure = (state: ImportLCApplicationState): number => {
  const baseAmount = state.lcAmount || 0
  const toleranceMargin = (baseAmount * (state.aboveTolerancePercent || 0)) / 100
  return baseAmount + toleranceMargin
}

export const calculateRequiredCollateralAmount = (state: ImportLCApplicationState): number => {
  const exposure = calculateTotalExposure(state)
  return (exposure * (state.collateralPercent || 0)) / 100
}

export const calculateTableTotal = (rows: FinancialCharge[]): number =>
  rows.reduce((sum, item) => sum + (item.amount || 0), 0)

export const validateForm = (state: ImportLCApplicationState): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!state.applicantName) errors.push('Applicant Name is required.')
  if (!state.expiryDate) errors.push('Expiry Date is required.')
  if (!state.expiryPlace) errors.push('Expiry Place is required.')
  if (state.lcAmount <= 0) errors.push('LC Amount must be greater than 0.')
  if (!state.termsAccepted) errors.push('You must accept the Terms & Conditions.')

  return { isValid: errors.length === 0, errors }
}

export const validateAndAttachFile = (file: File): { success: boolean; message?: string } => {
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (extension !== 'jpg' && extension !== 'jpeg') {
    return { success: false, message: 'Invalid file type. Only JPG/JPEG files are allowed.' }
  }
  const maxSizeBytes = 500 * 1024
  if (file.size > maxSizeBytes) {
    return { success: false, message: 'File size exceeds maximum limit of 500KB.' }
  }
  return { success: true }
}