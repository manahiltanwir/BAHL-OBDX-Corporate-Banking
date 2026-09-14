export const colors = {
  headerBg: '#e9e6f5',
  border: '#1a1a1a',
  green: '#15804f',
  greenHover: '#0f6b41',
  greenSoft: '#e5f3ec',
  greenSofter: '#f2f9f6'
}

export interface DebitAdviceData {
  branch: string
  fiReference: string
  accountTitle: string
  address: string
  adviceDate: string
  lcNumber: string
  ccy: string
  billAmount: string
  rate: string
  billLocEqv: string
  lcCommCr: string
  fiCharges: string
  swift: string
  lcMarginPercent: string
  lcMarginAmount: string
  subTotal: string
  fed: string
  totalDebit: string
  debitedAccount: string
  debitedAmount: string
  status: 'Active'
}

export const dummyAdvice: DebitAdviceData = {
  branch: 'KARACHI MAIN - 1001',
  fiReference: 'AHB-IMP-000498-02012025',
  accountTitle: 'JUBILEE CORPORATION',
  address: '1ST FLOOR FAKHRI TRADE CENTRE',
  adviceDate: '06-September-2026',
  lcNumber: '1001LC736862026',
  ccy: 'EUR',
  billAmount: '29345.100',
  rate: '329.47200',
  billLocEqv: '9668388.780',
  lcCommCr: '4834.0',
  fiCharges: '100.0',
  swift: '2000.0',
  lcMarginPercent: '0.000%',
  lcMarginAmount: '0',
  subTotal: '6934.0',
  fed: '901.42',
  totalDebit: '7835.42',
  debitedAccount: '1001-0081-172290-01-4',
  debitedAmount: '7835.42',
  status: 'Active'
}