import { AdvisingBankLookup, BeneficiaryLookup, ImportLCFormState } from 'src/types/apps/lc'

export const BENEFICIARY_OPTIONS: BeneficiaryLookup[] | any = [
  {
    id: 'BENEF-001',
    label: 'SinoTech Global Trading Co. Ltd.',
    country: 'CN',
    address: 'No. 88 Century Avenue, Pudong New Area, Shanghai, China',
    phone: '+86-21-68881234',
    email: 'exports@sinotech-trading.cn',
    suggestedAdvisingBankId: 'BOC_SHANGHAI'
  },
  {
    id: 'BENEF-002',
    label: 'Apex Industrial Equipment GmbH',
    country: 'DE',
    address: 'Industriestrasse 14, Munich, Germany',
    phone: '+49-89-99887700',
    email: 'sales@apex-equipment.de',
    suggestedAdvisingBankId: 'DEUTSCHE_FRANKFURT'
  }
]

export const COUNTRY_OPTIONS = [
  { value: 'CN', label: 'China' },
  { value: 'DE', label: 'Germany' },
  { value: 'US', label: 'United States' },
  { value: 'AED', label: "United Arab Emirates" }
]

// ---- Advising Bank dropdown (independent of Beneficiary auto-fill) ----

export const OTHERS_ADVISING_BANK_ID = 'OTHERS'

export const ADVISING_BANK_OPTIONS: AdvisingBankLookup[] = [
  {
    id: 'BOC_SHANGHAI',
    name: 'Bank of China (Shanghai Branch)',
    swiftBic: 'BKCHCNBJ110',
    bicCode: 'BKCHCNBJ110',
    address: '200 Yincheng Mid Road, Pudong New Area, Shanghai 200120, China',
    phone: '+86-21-50372288',
    email: 'tradefinance.sh@bankofchina.com'
  },
  {
    id: 'DEUTSCHE_FRANKFURT',
    name: 'Deutsche Bank AG',
    swiftBic: 'DEUTDEFFXXX',
    bicCode: 'DEUTDEFFXXX',
    address: 'Taunusanlage 12, 60325 Frankfurt am Main, Germany',
    phone: '+49-69-91000',
    email: 'trade.service@db.com'
  },
  {
    id: OTHERS_ADVISING_BANK_ID,
    name: 'Others (Enter Manually)',
    swiftBic: '',
    bicCode: '',
    address: '',
    phone: '',
    email: ''
  }
]

export const STANDARD_CONDITION_OPTIONS: { value: string; text: string }[] = [
  {
    value: 'LC number quoted on all documents',
    text: '1. The number of this LC (LC number) must be quoted on all documents.'
  },
  {
    value: 'Invoices exceeding LC amount not acceptable',
    text: '2. Invoices exceeding this LC amount not acceptable.'
  },
  {
    value: 'Short Form/Blank Back Bills of Lading prohibited',
    text: '3. Short Form/Blank Back Bills of Lading/Airway Bill/Non-negotiable Seaway Bill not acceptable.'
  },
  {
    value: 'Israeli Vessel/Airline Port Prohibited',
    text: '4. Shipment/Transshipment on Israeli Vessel/Airline Port/Airport Prohibited.'
  },
  {
    value: 'Documents prior to credit date not acceptable',
    text: '5. Documents bearing a date of issuance prior to that of the credit (LC) not acceptable.'
  }
]

// Reusable option list for the "In Original" / "And Copies" dropdowns
// (Signed Commercial Invoice no longer accepts free-text input).
export const COPY_COUNT_OPTIONS = Array.from({ length: 10 }, (_, i) => String(i + 1))

// export const buildInitialFormState = (): ImportLCFormState => ({
//   branch: 'Main Corporate Branch (Autofetched)',
//   lcNumber: '',
//   applicationDate: new Date().toISOString().slice(0, 10),
//   accountNumber: '',
//   accountTitle: '',
//   expiryDate: '',
//   placeOfExpiry: '',

//   applicantName: '',
//   applicantAddress: '',
//   applicantPhone: '',
//   applicantEmail: '',

//   beneficiaryId: '',
//   beneficiaryCountry: '',
//   beneficiaryAddress: '',
//   beneficiaryPhone: '',
//   beneficiaryEmail: '',

//   advisingBankId: '',
//   advisingBankName: '',
//   swiftBic: '',
//   advisingBankBicCode: '',
//   advisingBankAddress: '',
//   advisingBankPhone: '',
//   advisingBankEmail: '',

//   lcCurrency: 'USD',
//   lcAmount: '',
//   amountInWords: '',
//   toleranceEnabled: false,
//   tolerancePositive: '',
//   toleranceNegative: '',

//   creditAvailableWith: '',
//   lcTenorBasis: '',
//   availabilityType: '',
//   mixedPaymentDetails: '',
//   usanceBasis: '',
//   usanceDays: '',

//   incoterm: '',
//   shipmentFrom: '',
//   shipmentTo: '',
//   modeOfShipment: '',
//   partialShipment: 'Not Allowed',
//   transshipment: 'Not Allowed',
//   billOfExchange: 'No',
//   drawnOnBank: '',
//   forwardCover: 'No',
//   tenorForwardContract: '',
//   placeOfTakingInCharge: '',
//   portOfLoading: '',
//   portOfDischarge: '',
//   placeOfFinalDestination: '',

//   // hsCode: '',
//   proformaInvoiceNo: '',
//   proformaDate: '',
//   goodsDescription: '',

//   docInvoiceToggle: false,
//   invoiceOriginals: '',
//   invoiceCopies: '',
//   invoiceOrigin: '',

//   docInsuranceToggle: false,

//   docOriginToggle: false,
//   originIssuer: '',

//   docPackingToggle: false,
//   packingOriginals: '',
//   packingCopies: '',

//   docBolToggle: false,
//   docAwbToggle: false,
//   docTruckReceiptToggle: false,
//   docOthersInput: '',

//   standardConditions: [],

//   presentationDaysToggle: false,
//   presentationDays: '',

//   confirmationToggle: false,
//   confirmationInstruction: '',

//   confChargesToggle: false,
//   confirmationCharges: '',

//   foreignChargesToggle: false,
//   foreignBanksCharges: '',

//   reimbursingChargesToggle: false,
//   reimbursingBankCharges: '',

//   discrepancyFeeToggle: false,
//   discrepancyFee: '',

//   otherSpecify: '',
//   additionalConditions: '',

//   attachments: [],

//   termsAccepted: false
// })

// ---------------------------------------------------------------------
// Number -> Words (for the live "Amount in Words" field).
// e.g. numberToWords(5000) === "Five Thousand"
// ---------------------------------------------------------------------

// Mirrors the HTML's live "Amount in Words" auto-conversion on LC Amount input.
// e.g. calculateAmountInWords('PKR', '5000') === 'PKR Five Thousand Only'

// ---------------------------------------------------------------------
// Per-step validation — so the wizard blocks "Next" on the SAME step
// that has a missing required field, instead of only failing at the
// very end on Submit.
// ---------------------------------------------------------------------

// Validate a single step — used by "Next" so the error is shown on the

// Full-form validation (used as a final safety net on Submit) — runs

export const buildInitialFormState = (): ImportLCFormState => ({
  lcRefSeq: '',
  isDraft: 'N',
  status: 'SUBMITTED',
  partyId: '',
  userId: '',
  createdBy: '',
  updatedBy: '',

  // ---------------- Basic Information ----------------
  branch: 'Main Corporate Branch (Autofetched)',
  applicationDate: new Date().toISOString().slice(0, 10),
  accountNumber: '',
  accountTitle: '',
  expiryDate: '',
  placeOfExpiry: '',

  // ===== Applicant Details =====
  applicantName: '',
  applicantAddress: '',
  applicantPhone: '',
  applicantEmail: '',

  // ---------------- Beneficiary Details ----------------
  beneficiaryName: '',
  beneficiaryId: '', // FIX: Added missing property
  countryOfBeneficiary: '',
  beneficiaryFullAddress: '',
  telephoneNumber: '',
  emailAddress: '',

  // ---------------- Advising Bank Details ----------------
  advisingBankId: '', // FIX: Added missing property
  bankName: '',
  swiftCode: '',
  bicCode: '',
  bankFullAddress: '',
  bankTelephoneNumber: '',
  bankEmailAddress: '',

  // ===== Documentary Credit Details =====
  lcCurrency: 'USD',
  lcAmount: '',
  amountInWords: '',
  toleranceEnabled: false,
  tolerancePositive: '',
  toleranceNegative: '',

  // ---------------- Credit Tenor, Payment & Financial Instrumentation ----------------
  creditAvailableWith: '',
  lcTenorBasis: '',
  availabilityType: '',
  mixedPaymentDetails: '',
  usanceBasis: '',
  usanceDays: '',

  // ===== Incoterms & Shipment Routing =====
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

  // ===== Description of Goods =====
  proformaInvoiceNo: '',
  proformaDate: '',
  goodsDescription: '',

  // ===== Documents Required & Transport Details =====
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

  // ===== Additional Conditions and Specifications =====
  standardConditions: [],
  presentationDaysToggle: false,
  presentationDays: '',
  specialInstructions: '',
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
  attachments: [], // FIX: Double-check spelling inside interface matches this exactly
  termsAccepted: false
})


const DummyComponent = () => null
export default DummyComponent
