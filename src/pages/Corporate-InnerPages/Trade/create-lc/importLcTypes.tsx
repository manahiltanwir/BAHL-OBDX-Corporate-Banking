// ==========================================
// Import LC — types matching the ORIGINAL HTML form 1:1
// Only fields that exist in the HTML are included here.
// ==========================================

export interface AttachmentRecord {
  id: string
  docType: string
  fileName: string
  fileSize: string
  file?: File
}

export interface ImportLCFormState {
  // ---------------- Basic Information ----------------
  branch: string
  lcNumber: string
  applicationDate: string
  accountNumber: string
  accountTitle: string
  expiryDate: string
  placeOfExpiry: string

  // ---------------- Applicant Details ----------------
  applicantName: string
  applicantAddress: string
  applicantPhone: string
  applicantEmail: string

  // ---------------- Beneficiary Details ----------------
  beneficiaryId: string
  beneficiaryCountry: string
  beneficiaryAddress: string
  beneficiaryPhone: string
  beneficiaryEmail: string

  // ---------------- Advising Bank Details ----------------
  advisingBankName: string
  swiftBic: string
  advisingBankBicCode: string
  advisingBankAddress: string
  advisingBankPhone: string
  advisingBankEmail: string

  // ---------------- Documentary Credit Details ----------------
  lcCurrency: string
  lcAmount: string
  amountInWords: string
  toleranceEnabled: boolean
  toleranceBasis: '' | 'lc_amount' | 'quantity_goods' | 'unit_price' | 'not_exceeding'
  toleranceInput1: string
  toleranceInput2: string

  // ---------------- Credit Tenor, Payment & Financial Instrumentation ----------------
  creditAvailableWith: string
  lcTenorBasis: '' | 'At Sight' | 'For Usance'
  availabilityType: string
  mixedPaymentDetails: string
  usanceOption: string
  usanceUserInputDays: string
  usanceCustomDays: string
  usanceCustomDate: string

  // ---------------- Incoterms & Shipment Routing ----------------
  incotermsAnyMode: string
  incotermsSeaMode: string
  shipmentFrom: string
  shipmentTo: string
  modeOfShipment: string
  partialShipment: 'Allowed' | 'Not Allowed'
  transshipment: 'Allowed' | 'Not Allowed'
  billOfExchange: 'Yes' | 'No'
  drawnOnBank: string
  forwardCover: 'Yes' | 'No'
  tenorForwardContract: string
  placeOfTakingInCharge: string
  portOfLoading: string
  portOfDischarge: string
  placeOfFinalDestination: string

  // ---------------- Description of Goods and/or Services ----------------
  // hsCode: string
  proformaInvoiceNo: string
  proformaDate: string
  goodsDescription: string

  // ---------------- Documents Required & Transport Details ----------------
  docInvoiceToggle: boolean
  invoiceOriginals: string
  invoiceCopies: string
  invoiceOrigin: string

  docInsuranceToggle: boolean

  docOriginToggle: boolean
  originIssuer: string

  docPackingToggle: boolean
  packingOriginals: string
  packingCopies: string

  docBolToggle: boolean
  docAwbToggle: boolean
  docTruckReceiptToggle: boolean
  docOthersInput: string

  // ---------------- Additional Conditions & Specifications ----------------
  standardConditions: string[]

  presentationDaysToggle: boolean
  presentationDays: string

  confirmationToggle: boolean
  confirmationInstruction: '' | 'Without' | 'Confirm' | 'May Add'

  confChargesToggle: boolean
  confirmationCharges: '' | 'applicant' | 'beneficiary'

  foreignChargesToggle: boolean
  foreignBanksCharges: '' | 'applicant' | 'beneficiary'

  reimbursingChargesToggle: boolean
  reimbursingBankCharges: '' | 'applicant' | 'beneficiary'

  discrepancyFeeToggle: boolean
  discrepancyFee: '' | 'applicant' | 'beneficiary'

  otherSpecify: string
  additionalConditions: string

  // ---------------- Supporting Document Attachments ----------------
  attachments: AttachmentRecord[]

  // ---------------- Terms & Conditions (kept separate, not merged) ----------------
  termsAccepted: boolean
}

// ---- Mock lookups (mirrors the HTML's hard-coded JS auto-fill values) ----

export interface AccountLookup {
  accountNumber: string
  label: string
  accountTitle: string
  applicantName: string
  applicantAddress: string
  applicantPhone: string
  applicantEmail: string
}

export const ACCOUNT_OPTIONS: AccountLookup[] = [
  {
    accountNumber: '0001-0981234501', label: '0001-0981234501 (PKR - Current)',
    accountTitle: 'ALPHA TRADING CORPORATION PVT LTD', applicantName: 'ALPHA TRADING CORPORATION PVT LTD',
    applicantAddress: 'Plot 45-C, Commercial Area, Phase 5, DHA, Karachi, Pakistan',
    applicantPhone: '+92-21-35550199', applicantEmail: 'trade@alphatrading.com'
  },
  {
    accountNumber: '0001-0981234502', label: '0001-0981234502 (USD - Foreign)',
    accountTitle: 'ALPHA TRADING CORPORATION PVT LTD', applicantName: 'ALPHA TRADING CORPORATION PVT LTD',
    applicantAddress: 'Plot 45-C, Commercial Area, Phase 5, DHA, Karachi, Pakistan',
    applicantPhone: '+92-21-35550199', applicantEmail: 'trade@alphatrading.com'
  },
]

export interface BeneficiaryLookup {
  id: string
  label: string
  country: string
  address: string
  phone: string
  email: string
  advisingBankName: string
  swiftBic: string
  advisingBankBicCode: string
  advisingBankAddress: string
  advisingBankPhone: string
  advisingBankEmail: string
}

export const BENEFICIARY_OPTIONS: BeneficiaryLookup[] = [
  {
    id: 'BENEF-001', label: 'SinoTech Global Trading Co. Ltd.', country: 'CN',
    address: 'No. 88 Century Avenue, Pudong New Area, Shanghai, China',
    phone: '+86-21-68881234', email: 'exports@sinotech-trading.cn',
    advisingBankName: 'Bank of China (Shanghai Branch)', swiftBic: 'BKCHCNBJ110', advisingBankBicCode: 'BKCHCNBJ110',
    advisingBankAddress: '200 Yincheng Mid Road, Pudong New Area, Shanghai 200120, China',
    advisingBankPhone: '+86-21-50372288', advisingBankEmail: 'tradefinance.sh@bankofchina.com'
  },
  {
    id: 'BENEF-002', label: 'Apex Industrial Equipment GmbH', country: 'DE',
    address: 'Industriestrasse 14, Munich, Germany',
    phone: '+49-89-99887700', email: 'sales@apex-equipment.de',
    advisingBankName: 'Deutsche Bank AG', swiftBic: 'DEUTDEFFXXX', advisingBankBicCode: 'DEUTDEFFXXX',
    advisingBankAddress: 'Taunusanlage 12, 60325 Frankfurt am Main, Germany',
    advisingBankPhone: '+49-69-91000', advisingBankEmail: 'trade.service@db.com'
  },
]

export const COUNTRY_OPTIONS = [
  { value: 'CN', label: 'China' },
  { value: 'DE', label: 'Germany' },
  { value: 'US', label: 'United States' },
]

export const STANDARD_CONDITION_OPTIONS: { value: string; text: string }[] = [
  { value: 'LC number quoted on all documents', text: '1. The number of this LC (LC number) must be quoted on all documents.' },
  { value: 'Invoices exceeding LC amount not acceptable', text: '2. Invoices exceeding this LC amount not acceptable.' },
  { value: 'Short Form/Blank Back Bills of Lading prohibited', text: '3. Short Form/Blank Back Bills of Lading/Airway Bill/Non-negotiable Seaway Bill not acceptable.' },
  { value: 'Israeli Vessel/Airline Port Prohibited', text: '4. Shipment/Transshipment on Israeli Vessel/Airline Port/Airport Prohibited.' },
  { value: 'Documents prior to credit date not acceptable', text: '5. Documents bearing a date of issuance prior to that of the credit (LC) not acceptable.' },
]

export const buildInitialFormState = (): ImportLCFormState => ({
  branch: 'Main Corporate Branch (Autofetched)',
  lcNumber: '',
  applicationDate: new Date().toISOString().slice(0, 10),
  accountNumber: '',
  accountTitle: '',
  expiryDate: '',
  placeOfExpiry: '',

  applicantName: '',
  applicantAddress: '',
  applicantPhone: '',
  applicantEmail: '',

  beneficiaryId: '',
  beneficiaryCountry: '',
  beneficiaryAddress: '',
  beneficiaryPhone: '',
  beneficiaryEmail: '',

  advisingBankName: '',
  swiftBic: '',
  advisingBankBicCode: '',
  advisingBankAddress: '',
  advisingBankPhone: '',
  advisingBankEmail: '',

  lcCurrency: 'USD',
  lcAmount: '',
  amountInWords: '',
  toleranceEnabled: false,
  toleranceBasis: '',
  toleranceInput1: '',
  toleranceInput2: '',

  creditAvailableWith: '',
  lcTenorBasis: '',
  availabilityType: '',
  mixedPaymentDetails: '',
  usanceOption: '',
  usanceUserInputDays: '',
  usanceCustomDays: '',
  usanceCustomDate: '',

  incotermsAnyMode: '',
  incotermsSeaMode: '',
  shipmentFrom: '',
  shipmentTo: '',
  modeOfShipment: '',
  partialShipment: 'Not Allowed',
  transshipment: 'Not Allowed',
  billOfExchange: 'No',
  drawnOnBank: '',
  forwardCover: 'No',
  tenorForwardContract: '',
  placeOfTakingInCharge: '',
  portOfLoading: '',
  portOfDischarge: '',
  placeOfFinalDestination: '',

  // hsCode: '',
  proformaInvoiceNo: '',
  proformaDate: '',
  goodsDescription: '',

  docInvoiceToggle: false,
  invoiceOriginals: '',
  invoiceCopies: '',
  invoiceOrigin: '',

  docInsuranceToggle: false,

  docOriginToggle: false,
  originIssuer: '',

  docPackingToggle: false,
  packingOriginals: '',
  packingCopies: '',

  docBolToggle: false,
  docAwbToggle: false,
  docTruckReceiptToggle: false,
  docOthersInput: '',

  standardConditions: [],

  presentationDaysToggle: false,
  presentationDays: '',

  confirmationToggle: false,
  confirmationInstruction: '',

  confChargesToggle: false,
  confirmationCharges: '',

  foreignChargesToggle: false,
  foreignBanksCharges: '',

  reimbursingChargesToggle: false,
  reimbursingBankCharges: '',

  discrepancyFeeToggle: false,
  discrepancyFee: '',

  otherSpecify: '',
  additionalConditions: '',

  attachments: [],

  termsAccepted: false,
})

// Tolerance LOV -> field labels, mirrors the HTML's handleLovChange().
export const getToleranceLabels = (basis: ImportLCFormState['toleranceBasis']) => {
  switch (basis) {
    case 'lc_amount': return { label1: 'Positive Tolerance (%)', label2: 'Negative Tolerance (%)', showInput2: true }
    case 'quantity_goods': return { label1: 'Quantity Positive Tol (%)', label2: 'Quantity Negative Tol (%)', showInput2: true }
    case 'unit_price': return { label1: 'Unit Price Positive Tol (%)', label2: 'Unit Price Negative Tol (%)', showInput2: true }
    case 'not_exceeding': return { label1: 'Maximum Ceiling Limit', label2: '', showInput2: false }
    default: return { label1: 'Input 1', label2: 'Input 2', showInput2: true }
  }
}

// Mirrors the HTML's live "Amount in Words" auto-conversion on LC Amount input.
export const calculateAmountInWords = (currency: string, amount: string): string => {
  const val = parseFloat(amount)
  if (!val) return ''
  return `${currency} ${val.toLocaleString('en-US')} ONLY`
}

// Required-field validation mirroring the HTML's `required` attributes
// (only for fields that are always required, ignoring conditional ones
// that the UI itself hides/shows).
export const validateForm = (state: ImportLCFormState): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!state.accountNumber) errors.push('Account Number is required.')
  if (!state.expiryDate) errors.push('Date of Expiry is required.')
  if (!state.placeOfExpiry) errors.push('Place of Expiry is required.')
  if (!state.beneficiaryId) errors.push("Beneficiary's Name is required.")
  if (!state.beneficiaryCountry) errors.push('Country of Beneficiary is required.')
  if (!state.lcAmount) errors.push('LC Amount is required.')
  if (!state.creditAvailableWith) errors.push('Credit is Available With is required.')
  if (!state.lcTenorBasis) errors.push('Please select At Sight or For Usance.')
  if (state.lcTenorBasis && !state.availabilityType) errors.push('Availability Type is required.')
  if (state.availabilityType === 'By Mixed Payment / UPAS' && !state.mixedPaymentDetails) errors.push('Mixed Payment / UPAS Details is required.')
  if (state.lcTenorBasis === 'For Usance' && !state.usanceOption) errors.push('Tenor of Payment (For Usance) is required.')
  if (!state.shipmentFrom) errors.push('Shipment From is required.')
  if (!state.shipmentTo) errors.push('Shipment To is required.')
  if (!state.modeOfShipment) errors.push('Mode of Shipment is required.')
  if (state.billOfExchange === 'Yes' && !state.drawnOnBank) errors.push('Drawn On (Bill of Exchange) is required.')
  if (state.forwardCover === 'Yes' && !state.tenorForwardContract) errors.push('Tenor of Forward Contract is required.')
  // if (!state.hsCode) errors.push('HS Code is required.')
  if (!state.proformaInvoiceNo) errors.push('Proforma Invoice / Contract No is required.')
  if (!state.proformaDate) errors.push('Proforma Invoice Date is required.')
  if (!state.goodsDescription) errors.push('Description of Goods / Services is required.')
  if (!state.termsAccepted) errors.push('You must review and accept the Terms & Conditions.')

  return { isValid: errors.length === 0, errors }
}

// Dummy default export (keeps this a valid module under the project's
// existing "types" file pattern).
const DummyComponent = () => null
export default DummyComponent