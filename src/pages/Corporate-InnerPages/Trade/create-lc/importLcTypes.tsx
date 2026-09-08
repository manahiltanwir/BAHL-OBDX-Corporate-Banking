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
  advisingBankId: string
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
  tolerancePositive: string
  toleranceNegative: string

  // ---------------- Credit Tenor, Payment & Financial Instrumentation ----------------
  creditAvailableWith: string
  lcTenorBasis: '' | 'At Sight' | 'For Usance'
  availabilityType: string
  mixedPaymentDetails: string
  // Tenor of Payment (For Usance): a required basis dropdown + a required
  usanceBasis: '' | 'B/L Date' | 'AWB Date' | 'Truck Receipt Date' | 'Invoice Date' | 'Days from Shipment'
  usanceDays: string

  // ---------------- Incoterms & Shipment Routing ----------------
  // Single Incoterms dropdown (the "Any Mode" and "Sea/Inland Waterway"
  incoterm: string
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
  attachments: AttachmentRecord[]
  termsAccepted: boolean
}


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
  // Suggested advising bank for this beneficiary — used only to
  suggestedAdvisingBankId: string
}

export const BENEFICIARY_OPTIONS: BeneficiaryLookup[] = [
  {
    id: 'BENEF-001', label: 'SinoTech Global Trading Co. Ltd.', country: 'CN',
    address: 'No. 88 Century Avenue, Pudong New Area, Shanghai, China',
    phone: '+86-21-68881234', email: 'exports@sinotech-trading.cn',
    suggestedAdvisingBankId: 'BOC_SHANGHAI',
  },
  {
    id: 'BENEF-002', label: 'Apex Industrial Equipment GmbH', country: 'DE',
    address: 'Industriestrasse 14, Munich, Germany',
    phone: '+49-89-99887700', email: 'sales@apex-equipment.de',
    suggestedAdvisingBankId: 'DEUTSCHE_FRANKFURT',
  },
]

export const COUNTRY_OPTIONS = [
  { value: 'CN', label: 'China' },
  { value: 'DE', label: 'Germany' },
  { value: 'US', label: 'United States' },
]

// ---- Advising Bank dropdown (independent of Beneficiary auto-fill) ----
export interface AdvisingBankLookup {
  id: string
  name: string
  swiftBic: string
  bicCode: string
  address: string
  phone: string
  email: string
}

export const OTHERS_ADVISING_BANK_ID = 'OTHERS'

export const ADVISING_BANK_OPTIONS: AdvisingBankLookup[] = [
  {
    id: 'BOC_SHANGHAI', name: 'Bank of China (Shanghai Branch)',
    swiftBic: 'BKCHCNBJ110', bicCode: 'BKCHCNBJ110',
    address: '200 Yincheng Mid Road, Pudong New Area, Shanghai 200120, China',
    phone: '+86-21-50372288', email: 'tradefinance.sh@bankofchina.com',
  },
  {
    id: 'DEUTSCHE_FRANKFURT', name: 'Deutsche Bank AG',
    swiftBic: 'DEUTDEFFXXX', bicCode: 'DEUTDEFFXXX',
    address: 'Taunusanlage 12, 60325 Frankfurt am Main, Germany',
    phone: '+49-69-91000', email: 'trade.service@db.com',
  },
  {
    id: OTHERS_ADVISING_BANK_ID, name: 'Others (Enter Manually)',
    swiftBic: '', bicCode: '', address: '', phone: '', email: '',
  },
]

export const STANDARD_CONDITION_OPTIONS: { value: string; text: string }[] = [
  { value: 'LC number quoted on all documents', text: '1. The number of this LC (LC number) must be quoted on all documents.' },
  { value: 'Invoices exceeding LC amount not acceptable', text: '2. Invoices exceeding this LC amount not acceptable.' },
  { value: 'Short Form/Blank Back Bills of Lading prohibited', text: '3. Short Form/Blank Back Bills of Lading/Airway Bill/Non-negotiable Seaway Bill not acceptable.' },
  { value: 'Israeli Vessel/Airline Port Prohibited', text: '4. Shipment/Transshipment on Israeli Vessel/Airline Port/Airport Prohibited.' },
  { value: 'Documents prior to credit date not acceptable', text: '5. Documents bearing a date of issuance prior to that of the credit (LC) not acceptable.' },
]

// Reusable option list for the "In Original" / "And Copies" dropdowns
// (Signed Commercial Invoice no longer accepts free-text input).
export const COPY_COUNT_OPTIONS = Array.from({ length: 10 }, (_, i) => String(i + 1))

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

  advisingBankId: '',
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
  tolerancePositive: '',
  toleranceNegative: '',

  creditAvailableWith: '',
  lcTenorBasis: '',
  availabilityType: '',
  mixedPaymentDetails: '',
  usanceBasis: '',
  usanceDays: '',

  incoterm: '',
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

// ---------------------------------------------------------------------
// Number -> Words (for the live "Amount in Words" field).
// e.g. numberToWords(5000) === "Five Thousand"
// ---------------------------------------------------------------------
const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

const threeDigitsToWords = (n: number): string => {
  const parts: string[] = []
  if (n >= 100) {
    parts.push(`${ONES[Math.floor(n / 100)]} Hundred`)
    n %= 100
  }
  if (n >= 20) {
    parts.push(TENS[Math.floor(n / 10)])
    n %= 10
    if (n > 0) parts.push(ONES[n])
  } else if (n > 0) {
    parts.push(ONES[n])
  }
  return parts.join(' ')
}

export const numberToWords = (value: number): string => {
  if (value === 0) return 'Zero'
  const integerPart = Math.floor(Math.abs(value))
  const decimalPart = Math.round((Math.abs(value) - integerPart) * 100)

  const SCALES: [number, string][] = [
    [1_000_000_000, 'Billion'],
    [1_000_000, 'Million'],
    [1_000, 'Thousand'],
  ]

  let n = integerPart
  const words: string[] = []
  for (const [scale, label] of SCALES) {
    if (n >= scale) {
      words.push(`${threeDigitsToWords(Math.floor(n / scale))} ${label}`)
      n %= scale
    }
  }
  if (n > 0) words.push(threeDigitsToWords(n))

  let result = words.join(' ').trim() || 'Zero'
  if (decimalPart > 0) {
    result += ` And ${threeDigitsToWords(decimalPart)} Cents`
  }
  return result
}

// Mirrors the HTML's live "Amount in Words" auto-conversion on LC Amount input.
// e.g. calculateAmountInWords('PKR', '5000') === 'PKR Five Thousand Only'
export const calculateAmountInWords = (currency: string, amount: string): string => {
  const val = parseFloat(amount)
  if (!val || Number.isNaN(val)) return ''
  return `${currency} ${numberToWords(val)} Only`
}

// ---------------------------------------------------------------------
// Per-step validation — so the wizard blocks "Next" on the SAME step
// that has a missing required field, instead of only failing at the
// very end on Submit.
// ---------------------------------------------------------------------
export type StepKey =
  | 'basic' | 'parties' | 'credit' | 'tenor' | 'shipment'
  | 'goods' | 'documents' | 'conditions' | 'attachments' | 'review'

const STEP_VALIDATORS: Record<StepKey, (state: ImportLCFormState) => string[]> = {
  basic: (state) => {
    const errors: string[] = []
    if (!state.accountNumber) errors.push('Account Number is required.')
    if (!state.expiryDate) errors.push('Date of Expiry is required.')
    if (!state.placeOfExpiry) errors.push('Place of Expiry is required.')
    return errors
  },
  parties: (state) => {
    const errors: string[] = []
    if (!state.beneficiaryId) errors.push("Beneficiary's Name is required.")
    if (!state.beneficiaryCountry) errors.push('Country of Beneficiary is required.')
    if (!state.advisingBankId) errors.push('Advising Bank Name is required.')
    if (state.advisingBankId === OTHERS_ADVISING_BANK_ID) {
      if (!state.advisingBankName) errors.push('Advising Bank Name (manual entry) is required.')
      if (!state.swiftBic) errors.push('SWIFT Code is required.')
      if (!state.advisingBankAddress) errors.push('Advising Bank Full Address is required.')
    }
    return errors
  },
  credit: (state) => {
    const errors: string[] = []
    if (!state.lcAmount) errors.push('LC Amount is required.')
    if (state.toleranceEnabled) {
      if (!state.tolerancePositive) errors.push('Positive Tolerance (%) is required.')
      if (!state.toleranceNegative) errors.push('Negative Tolerance (%) is required.')
    }
    return errors
  },
  tenor: (state) => {
    const errors: string[] = []
    if (!state.creditAvailableWith) errors.push('Credit is Available With is required.')
    if (!state.lcTenorBasis) errors.push('Please select At Sight or For Usance.')
    if (state.lcTenorBasis && !state.availabilityType) errors.push('Availability Type is required.')
    if (state.availabilityType === 'By Mixed Payment / UPAS' && !state.mixedPaymentDetails) {
      errors.push('Mixed Payment / UPAS Details is required.')
    }
    if (state.lcTenorBasis === 'For Usance') {
      if (!state.usanceBasis) errors.push('Tenor of Payment basis (For Usance) is required.')
      if (!state.usanceDays) errors.push('Number of days (For Usance) is required.')
    }
    return errors
  },
  shipment: (state) => {
    const errors: string[] = []
    if (!state.incoterm) errors.push('Incoterms Rule is required.')
    if (!state.shipmentFrom) errors.push('Shipment From is required.')
    if (!state.shipmentTo) errors.push('Shipment To is required.')
    if (!state.modeOfShipment) errors.push('Mode of Shipment is required.')
    if (state.billOfExchange === 'Yes' && !state.drawnOnBank) errors.push('Drawn On (Bill of Exchange) is required.')
    if (state.forwardCover === 'Yes' && !state.tenorForwardContract) errors.push('Tenor of Forward Contract is required.')
    return errors
  },
  goods: (state) => {
    const errors: string[] = []
    if (!state.proformaInvoiceNo) errors.push('Proforma Invoice / Contract No is required.')
    if (!state.proformaDate) errors.push('Proforma Invoice Date is required.')
    if (!state.goodsDescription) errors.push('Description of Goods / Services is required.')
    return errors
  },
  documents: () => [],
  conditions: (state) => {
    const errors: string[] = []
    if (state.presentationDaysToggle && !state.presentationDays) errors.push('Presentation Days is required.')
    if (state.confirmationToggle && !state.confirmationInstruction) errors.push('Confirmation Instruction is required.')
    if (state.confChargesToggle && !state.confirmationCharges) errors.push('Confirmation Charges allocation is required.')
    if (state.foreignChargesToggle && !state.foreignBanksCharges) errors.push('Foreign Banks Charges allocation is required.')
    if (state.reimbursingChargesToggle && !state.reimbursingBankCharges) errors.push('Reimbursing Bank Charges allocation is required.')
    if (state.discrepancyFeeToggle && !state.discrepancyFee) errors.push('Discrepancy Fee allocation is required.')
    return errors
  },
  attachments: (state) => {
    const errors: string[] = []
    if (!state.termsAccepted) errors.push('You must review and accept the Terms & Conditions.')
    return errors
  },
  review: () => [],
}

export const STEP_ORDER: StepKey[] = ['basic', 'parties', 'credit', 'tenor', 'shipment', 'goods', 'documents', 'conditions', 'attachments', 'review']

// Validate a single step — used by "Next" so the error is shown on the
export const validateStep = (stepKey: StepKey, state: ImportLCFormState): string[] => STEP_VALIDATORS[stepKey](state)

// Full-form validation (used as a final safety net on Submit) — runs
export const validateForm = (state: ImportLCFormState): { isValid: boolean; errors: string[] } => {
  const errors = STEP_ORDER.flatMap((key) => STEP_VALIDATORS[key](state))
  return { isValid: errors.length === 0, errors }
}

const DummyComponent = () => null
export default DummyComponent