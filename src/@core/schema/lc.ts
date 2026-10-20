import * as yup from 'yup'

export default {
  add: yup.object().shape({
    // --- General Information ---
    branch: yup.string().required('Branch is required'),
    lcNumber: yup.string().nullable(), // Usually auto-generated or optional initially
    applicationDate: yup.string().required('Application date is required'),
    accountNumber: yup.string().required('Account number is required'),
    accountTitle: yup.string().required('Account title is required'),
    expiryDate: yup.string().required('Expiry date is required'),
    placeOfExpiry: yup.string().required('Place of expiry is required'),

    // --- Applicant Information ---
    applicantName: yup.string().required('Applicant name is required'),
    applicantAddress: yup.string().required('Applicant address is required'),
    applicantPhone: yup.string().required('Applicant phone is required'),
    applicantEmail: yup.string().email('Invalid email format').required('Applicant email is required'),

    // --- Beneficiary Information ---
    beneficiaryId: yup.string().required('Beneficiary ID is required'),
    beneficiaryCountry: yup.string().required('Beneficiary country is required'),
    beneficiaryAddress: yup.string().required('Beneficiary address is required'),
    beneficiaryPhone: yup.string().required('Beneficiary phone is required'),
    beneficiaryEmail: yup.string().email('Invalid email format').required('Beneficiary email is required'),

    // --- Advising Bank Information ---
    advisingBankId: yup.string().required('Advising bank ID is required'),
    advisingBankName: yup.string().required('Advising bank name is required'),
    swiftBic: yup.string().required('SWIFT/BIC is required'),
    advisingBankBicCode: yup.string().required('Advising bank BIC code is required'),
    advisingBankAddress: yup.string().required('Advising bank address is required'),
    advisingBankPhone: yup.string().required('Advising bank phone is required'),
    advisingBankEmail: yup.string().email('Invalid email format').required('Advising bank email is required'),

    // --- Financials & Tolerances ---
    lcCurrency: yup.string().required('Currency is required'),
    lcAmount: yup
      .number()
      .typeError('Amount must be a number')
      .positive('Amount must be positive')
      .required('LC Amount is required'),
    amountInWords: yup.string().required('Amount in words is required'),

    // Conditional validation for Tolerance percentage values
    toleranceEnabled: yup.boolean().required(),
    tolerancePositive: yup.string().when('toleranceEnabled', {
      is: true,
      then: schema => schema.required('Positive tolerance % is required'),
      otherwise: schema => schema.nullable().strip()
    }),
    toleranceNegative: yup.string().when('toleranceEnabled', {
      is: true,
      then: schema => schema.required('Negative tolerance % is required'),
      otherwise: schema => schema.nullable().strip()
    }),

    // --- Credit Availability & Tenor ---
    creditAvailableWith: yup.string().required('Credit availability bank is required'),
    lcTenorBasis: yup.string().required('LC tenor basis is required'),
    availabilityType: yup.string().required('Availability type is required'),
    mixedPaymentDetails: yup.string().nullable(),
    usanceBasis: yup.string().nullable(),
    usanceDays: yup.string().nullable(),

    // --- Shipment Details ---
    incoterm: yup.string().required('Incoterm is required'),
    shipmentFrom: yup.string().required('Shipment origin is required'),
    shipmentTo: yup.string().required('Shipment destination is required'),
    modeOfShipment: yup.string().required('Mode of shipment is required'),
    partialShipment: yup.string().oneOf(['Allowed', 'Not Allowed']).required(),
    transshipment: yup.string().oneOf(['Allowed', 'Not Allowed']).required(),
    billOfExchange: yup.string().oneOf(['Yes', 'No']).required(),
    drawnOnBank: yup.string().nullable(),
    forwardCover: yup.string().oneOf(['Yes', 'No']).required(),
    tenorForwardContract: yup.string().nullable(),
    placeOfTakingInCharge: yup.string().nullable(),
    portOfLoading: yup.string().required('Port of loading is required'),
    portOfDischarge: yup.string().required('Port of discharge is required'),
    placeOfFinalDestination: yup.string().nullable(),

    // --- Goods & Documents ---
    proformaInvoiceNo: yup.string().required('Proforma Invoice No is required'),
    proformaDate: yup.string().required('Proforma Date is required'),
    goodsDescription: yup.string().required('Goods description is required'),

    // Invoice Documents Conditional Rules
    docInvoiceToggle: yup.boolean().required(),
    invoiceOriginals: yup.string().when('docInvoiceToggle', {
      is: true,
      then: schema => schema.required('Number of originals required')
    }),
    invoiceCopies: yup.string().when('docInvoiceToggle', {
      is: true,
      then: schema => schema.required('Number of copies required')
    }),
    invoiceOrigin: yup.string().when('docInvoiceToggle', {
      is: true,
      then: schema => schema.required('Invoice place of origin required')
    }),

    docInsuranceToggle: yup.boolean().required(),

    // Certificate of Origin Conditional Rules
    docOriginToggle: yup.boolean().required(),
    originIssuer: yup.string().when('docOriginToggle', {
      is: true,
      then: schema => schema.required('Origin issuer is required')
    }),

    // Packing List Conditional Rules
    docPackingToggle: yup.boolean().required(),
    packingOriginals: yup.string().when('docPackingToggle', {
      is: true,
      then: schema => schema.required('Number of packing originals required')
    }),
    packingCopies: yup.string().when('docPackingToggle', {
      is: true,
      then: schema => schema.required('Number of packing copies required')
    }),

    // Transport Documents Toggles
    docBolToggle: yup.boolean().required(),
    docAwbToggle: yup.boolean().required(),
    docTruckReceiptToggle: yup.boolean().required(),
    docOthersInput: yup.string().nullable(),

    // --- Conditions & Presentations ---
    standardConditions: yup.array().of(yup.string()).ensure(),

    presentationDaysToggle: yup.boolean().required(),
    presentationDays: yup.string().when('presentationDaysToggle', {
      is: true,
      then: schema => schema.required('Presentation days are required')
    }),

    // --- Confirmation & Charges Toggles ---
    confirmationToggle: yup.boolean().required(),
    confirmationInstruction: yup.string().when('confirmationToggle', {
      is: true,
      then: schema => schema.required('Confirmation instruction is required')
    }),

    confChargesToggle: yup.boolean().required(),
    confirmationCharges: yup.string().when('confChargesToggle', {
      is: true,
      then: schema => schema.required('Confirmation charges specification required')
    }),

    foreignChargesToggle: yup.boolean().required(),
    foreignBanksCharges: yup.string().when('foreignChargesToggle', {
      is: true,
      then: schema => schema.required('Foreign bank charges specification required')
    }),

    reimbursingChargesToggle: yup.boolean().required(),
    reimbursingBankCharges: yup.string().when('reimbursingChargesToggle', {
      is: true,
      then: schema => schema.required('Reimbursing bank charges specification required')
    }),

    discrepancyFeeToggle: yup.boolean().required(),
    discrepancyFee: yup.string().when('discrepancyFeeToggle', {
      is: true,
      then: schema => schema.required('Discrepancy fee specification required')
    }),

    // --- Footer Metadata & Submissions ---
    otherSpecify: yup.string().nullable(),
    additionalConditions: yup.string().nullable(),
    attachments: yup.array().ensure(), // Ensures it defaults to an empty array gracefully if missing

    termsAccepted: yup.boolean().oneOf([true], 'You must accept the terms and conditions').required()
  })
}
