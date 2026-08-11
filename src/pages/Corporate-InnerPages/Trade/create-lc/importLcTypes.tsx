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
  hsCode?: string
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
export interface InsurancePolicy {
  id: string
  policyNumber: string
  companyName: string
  country: string
  coverDate: string
  expiryDate: string
  amount: string
}

export interface ImportLCApplicationState {
  // Category 1: LC Details
  customerType: CustomerType
  applicantName: string
  applicantAccountNumber: string
  applicantAddress: string
  applicantAccountType: 'Islamic' | 'Conventional' | ''
  accounteeName: string
  lcCreditType: 'Transferable' | 'Revolving' | 'IRREVOCABLE'
  lcType: LCType
  productId: string
  lcOpeningUnder: string
  lcOpeningDate: string
  expiryDate: string
  expiryPlace: string
  beneficiaryType: 'Existing' | 'New'
  beneficiaryAccountNumber: string
  beneficiaryName: string
  beneficiaryAddress: string
  beneficiaryCountry: string
  beneficiaryCountryOfOrigin: string
  currency: string
  lcAmount: number
  underTolerancePercent: number
  aboveTolerancePercent: number
  additionalAmountCovered: string
  totalexposure: string
  bankname: string
  bankAddress: string
  street: string
  specialInstruction:string
  categroyselection: string
  negotiation: string
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
  { name: 'Invoice', selected: false, originals: 1, copies: 2 },
  { name: 'Air Way', selected: false, originals: 1, copies: 2 },
  { name: 'Sea Way', selected: false, originals: 3, copies: 2 },
  { name: 'Other Doc', selected: false, originals: 1, copies: 1 },
  { name: 'Insurance Certificate / Policy', selected: false, originals: 1, copies: 1 },
]

export const MOCK_INSURANCE_POLICIES: InsurancePolicy[] = [
  { id: '1', policyNumber: 'ANZ1',    companyName: 'ING GLOBAL',   country: 'London', coverDate: '05 May 2021', expiryDate: '24 May 2027', amount: 'GBP10,000,000.00' },
  { id: '2', policyNumber: 'POLICY1', companyName: 'ING GLOBAL',   country: 'London', coverDate: '',            expiryDate: '25 May 2025', amount: 'GBP4,000,000.00' },
  { id: '3', policyNumber: 'POLICY2', companyName: 'Bajaj Allianz', country: 'CB',     coverDate: '05 Apr 2025', expiryDate: '15 May 2025', amount: 'GBP6,000,000.00' },
]

// Account Number -> Beneficiary lookup, used on the "59 - Beneficiary
// Details" step:
//  - Beneficiary Type = "New": an Account Number is selected, and the
//    matching Title (Beneficiary Name) is auto-filled and locked.
//  - Beneficiary Type = "Existing": a Beneficiary Name is selected, and the
//    matching Country and Address are auto-filled and locked.
export interface BeneficiaryAccount {
  accountNumber: string
  beneficiaryName: string
  beneficiaryCountry: string
  beneficiaryAddress: string
}

export const BENEFICIARY_ACCOUNTS: BeneficiaryAccount[] = [
  { accountNumber: '3001-556677-09', beneficiaryName: '1001-Abbas', beneficiaryCountry: 'Pakistan', beneficiaryAddress: 'Plot 45, Korangi Industrial Area, Karachi' },
  { accountNumber: '3002-889900-11', beneficiaryName: '5001-RazaAli', beneficiaryCountry: 'United Arab Emirates', beneficiaryAddress: 'Warehouse 12, Jebel Ali Free Zone, Dubai' },
]

// Account Number -> Applicant lookup, used on the "50 - Applicant Details"
// step. The Account Number is selected first; the matching Applicant Name
// and Applicant Address are then auto-filled and cannot be edited
// independently — they only change when a different Account Number is
// selected. accountType drives the Islamic/Conventional logic on the
// "40A - Type of Documentary Credit" step (LC Opening Under field).
export interface ApplicantAccount {
  accountNumber: string
  applicantName: string
  applicantAddress: string
  accountType: 'Islamic' | 'Conventional'
}

export const APPLICANT_ACCOUNTS: ApplicantAccount[] = [
  { accountNumber: '001-1023456-01', applicantName: 'GOODCARE PLC', applicantAddress: 'Suite 4, Trade Centre, I.I. Chundrigar Road, Karachi', accountType: 'Conventional' },
  { accountNumber: '002-2098765-03', applicantName: 'AFROOZ TEXTILE', applicantAddress: 'Plot 12, SITE Industrial Area, Karachi', accountType: 'Islamic' },
]

export const buildInitialState = (uuid: () => string): ImportLCApplicationState => ({
  customerType: 'Existing',
  applicantName: '',
  applicantAccountNumber: '',
  applicantAddress: '',
  applicantAccountType: '',
  accounteeName: '',
  lcCreditType: 'IRREVOCABLE',
  lcType: 'Sight',
  productId: 'PROD_IMPORT_SIGHT',
  lcOpeningUnder: '',
  lcOpeningDate: '',
  expiryDate: '',
  expiryPlace: '',
  beneficiaryType: 'Existing',
  beneficiaryAccountNumber: '',
  beneficiaryName: '',
  beneficiaryAddress: '',
  beneficiaryCountry: '',
  beneficiaryCountryOfOrigin: '',
  currency: 'USD',
  lcAmount: 0,
  underTolerancePercent: 0,
  aboveTolerancePercent: 10,
  additionalAmountCovered: '',
  totalexposure: 'GBP 11,00000.00',
  bankname:'',
  bankAddress:'',
  street:'',
  specialInstruction:'',
  categroyselection: '',
  customerReferenceNumber: '',
  negotiation: '',
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


// Dummy Component
const DummyComponent = () => null;
export default DummyComponent;