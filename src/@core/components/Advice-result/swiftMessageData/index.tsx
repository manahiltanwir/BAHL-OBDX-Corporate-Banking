export interface SwiftMessageData {
  title:string
  customerNo: string
  producedOn: string
  branch: string
  messageType: string

  receiverBic: string
  receiverBankName: string
  receiverBankAddress: string

  sequenceOfTotal: string
  formOfCredit: string
  lcNumber: string
  dateOfIssue: string
  applicableRules: string
  dateOfExpiry: string
  placeOfExpiry: string

  applicantName: string
  applicantAddress: string
  beneficiaryName: string
  beneficiaryAddress: string

  currency: string
  amount: string
  tolerance: string

  availableWith: string
  availableBy: string
  draftsAt: string
  drawee: string

  partialShipments: string
  transhipment: string
  portOfLoading: string
  portOfDischarge: string
  latestShipmentDate: string

  goodsDescription: string[]
  documentsRequired: string[]
  additionalConditions: string[]

  charges: string
  presentationPeriod: string
  confirmationInstructions: string
  instructionsToBank: string
  senderToReceiverInfo: string[]
  
  status: string
  accountTitle: string
  adviceDate: string
  ccy: string
  billAmount: string
  totalDebit: string
  debitedAccount: string

}

export const dummySwiftMessage: SwiftMessageData = {
  customerNo: '003522',
  producedOn: '12/09/2026 at 10:39:26 AM',
  branch: 'KARACHI MAIN-1001',
  messageType: 'MT700',
    title: 'Swift Draft',

  status: 'Active',
  accountTitle: 'PREMIUM TEXTILE MILLS LTD',
  adviceDate: '12 Sep 2026',
  ccy: 'USD',
  billAmount: '27,688.00',
  totalDebit: '27,688.00',
  debitedAccount: '0110-1234567-001',

  receiverBic: 'BKCHCNBJ95C',
  receiverBankName: 'BANK OF CHINA',
  receiverBankAddress: '2 LIANGQING ROAD',

  sequenceOfTotal: '1/1',
  formOfCredit: 'IRREVOCABLE',
  lcNumber: '1001LC55176/2025',
  dateOfIssue: '06 Jan 2025',
  applicableRules: 'UCP LATEST VERSION',
  dateOfExpiry: '21 Feb 2025',
  placeOfExpiry: 'CHINA',

  applicantName: 'PREMIUM TEXTILE MILLS LTD',
  applicantAddress: '1ST FLOOR, HAJI ADAM CHAMBER, ALTAF HUSSAIN ROAD, NEW CHALLI, KARACHI-74000, PAKISTAN',
  beneficiaryName: 'BANG BANG TEXTILE GROUP LTD',
  beneficiaryAddress: 'HEAD QTRS BUILDING 15, CHANGTAI INTERNATIONAL, XIANFENG ROAD, XISHAN DISTRICT, WUXI, CHINA',

  currency: 'USD',
  amount: '27,688.00',
  tolerance: '±5%',

  availableWith: 'ANY BANK IN CHINA',
  availableBy: 'BY NEGOTIATION',
  draftsAt: 'SIGHT',
  drawee: 'BANK AL HABIB LIMITED, KARACHI, PAKISTAN',

  partialShipments: 'ALLOWED',
  transhipment: 'ALLOWED',
  portOfLoading: 'ANY CHINESE SEAPORT',
  portOfDischarge: 'KARACHI SEAPORT OR PORT QASIM, PAKISTAN',
  latestShipmentDate: '31 Jan 2025',

  goodsDescription: [
    'VIRGIN DOPE DYED POLYESTER STAPLE FIBER 1.4DX38MM',
    '1) BLUE 260 — QUANTITY 12.5 M/TONS (+/- 5 PCT) AT USD 1,225/- PER M/TON',
    '2) BLACK — QUANTITY 12.5 M/TONS (+/- 5 PCT) AT USD 990/- PER M/TON',
    'All other details as per Beneficiary Proforma Invoice No. PREMIUMPI32 dated Dec 28, 2024',
    'CFR Karachi Seaport or Port Qasim, Pakistan (Incoterms 2020)'
  ],

  documentsRequired: [
    "Beneficiary's signed commercial invoice in octuplicate certifying merchandise are of China origin, mentioning H.S. Code No. 5503.2010 and Importer's Registration No. W-100539",
    'Full set of clean shipped on board marine/ocean bills of lading made to the order of Bank AL Habib Ltd., Karachi, showing freight prepaid, marked notify the Applicant and the Bank',
    'Certificate from shipping company / agents / beneficiary confirming vessel classification and Pakistani maritime compliance, with approximate arrival date and vessel name',
    'Insurance covered by the Applicant — shipment to be advised to EFU General Insurance within 4 working days of shipment',
    'Packing list in triplicate',
    'Certificate confirming the Bill of Lading is issued directly by the shipping company with no intermediary/endorsing agent',
    "Beneficiary's certificate confirming arrangement with carrier to place invoice & packing list copy inside each container",
    'Certificate of Origin (1 original + 1 copy) confirming goods are of China origin, with manufacturer/exporter details'
  ],

  additionalConditions: [
    'Documents dated prior to date of issuance of this LC are not acceptable',
    'Drafts and all documents must show the Documentary Credit Number, date and name of issuing bank',
    'Charter party, short form, blank back, freight forwarder and house B/L not acceptable',
    'Negotiation under reserve/guarantee not allowed',
    'All documents must be dated and in English language',
    'Any overwriting/alteration must be authenticated with rubber stamp',
    'Negotiating bank must certify all charges are paid by the Beneficiary',
    'USD 102/- discrepancy charges will be deducted in case of discrepant documents',
    "Freight forwarder's / FIATA bills of lading not acceptable",
    '14 or 21 days free container detention period allowed at port of destination',
    '±5% tolerance allowed in quantity and amount'
  ],

  charges: "All bank charges outside Pakistan, including courier and reimbursing bank charges, are on Beneficiary's account.",
  presentationPeriod: '21 days from shipment date but within expiry',
  confirmationInstructions: 'WITHOUT',
  instructionsToBank:
    'We hereby engage with drawers and/or bonafide holders that drafts drawn and negotiated in conformity with the terms of this credit will be duly honoured on presentation. Documents must be sent to Bank AL Habib Ltd., Techno City, 7th Floor, Corporate Tower, Hasrat Mohani Road, Karachi in 1 lot by courier at Beneficiary\'s cost. Upon presentation of credit-conforming documents, proceeds will be remitted as instructed by the negotiating bank.',
  senderToReceiverInfo: ['ACKNOWLEDGE', 'Advise beneficiary by phone/fax', 'Acknowledge receipt by SWIFT']
  
}