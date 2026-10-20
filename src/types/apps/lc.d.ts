

export type StepKey =
  | 'basic'
  | 'parties'
  | 'credit'
  | 'tenor'
  | 'shipment'
  | 'goods'
  | 'documents'
  | 'conditions'
  | 'attachments'
  | 'review'

export interface AdvisingBankLookup {
  id: string
  name: string
  swiftBic: string
  bicCode: string
  address: string
  phone: string
  email: string
}

// export interface BeneficiaryLookup {
//   id: string
//   label: string
//   country: string
//   address: string
//   phone: string
//   email: string
//   // Suggested advising bank for this beneficiary — used only to
//   suggestedAdvisingBankId: string
// }



export interface AttachmentRecord {
  id: string
  docType: string
  fileName: string
  fileSize: string
  file?: File
}

export interface ImportLCFormState {
  lcRefSeq: string
  isDraft: "N" | "Y"
  status: "SUBMITTED" | "DRAFT"
  partyId: string
  userId: string
  createdBy: string
  updatedBy: string
  // ---------------- Basic Information ----------------
  branch: string
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
  beneficiaryName: string
  beneficiaryId?: string | number
  countryOfBeneficiary: string
  beneficiaryFullAddress: string
  telephoneNumber: string
  emailAddress: string

  // ---------------- Advising Bank Details ----------------
  advisingBankId?: string
  bankName: string
  swiftCode: string
  bicCode: string
  bankFullAddress: string
  bankTelephoneNumber: string
  bankEmailAddress: string

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
  specialInstructions: string
  // presentationDays: string
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
  attachments?: AttachmentRecord[]
  termsAccepted: boolean
}


export interface AccountLookup {
  accountNumber: string
  accountStatus: string
  accountTitle: string
  accountType: string
  balance: number
  createdDate: Date | string
  partyId: string
}

export interface BeneficiaryLookup {
  id: number
  partyId: string
  userId: string
  beneficiaryName: string
  beneficiaryFullAddress: string
  countryOfBeneficiary: string
  emailAddress: string
  telephoneNumber: string
  createdBy: string
  creationDate: string // ISO 8601 Date String (e.g., "2026-10-12T12:23:46.028424")
  updatedBy: string | null
  updatedDate: string | null
  label?: string
  bankName?: string
}
