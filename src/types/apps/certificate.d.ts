export interface CertificateRequestPayload {
  accountNo?: string
  selectDate: string // yyyyMMdd000000
  iban?: string
}

export interface CertificateResult {
  status: string
  message: string
}

export interface CertificateResponse<T = unknown> {
  status: string
  message: string
  code: string
  data: T
}

export interface BalanceCertificateData {
  AccountBalanceCertificateResponseDTO?: { result?: CertificateResult }
  requestDetails?: {
    userId: string
    emailID: string
    partyId: string
    Id?: string
    AccountNo: string
    Iban?: string
    startDate: string
  }
}

export interface MaintenanceCertificateData {
  AccountMaintenanceCertificateResponseDTO?: { result?: CertificateResult }
  requestDetails?: {
    userId: string
    emailID: string
    partyId: string
    accountNo: string
    startDate: string
  }
}

export interface WrappedCertificateResponse<T = unknown> {
  status: number
  message: string
  data: CertificateResponse<T>
}

export interface BalanceCertificatePayload extends CertificateRequestPayload {
  iban?: string
}

export interface AccountStatementPayload {
  accountNo: string
  startDate: string // yyyy-MM-dd
  endDate: string // yyyy-MM-dd
  iban?: string
}

export interface AccountStatementData {
  AccountStatementResponseDTO?: { result?: CertificateResult }
  requestDetails?: {
    userId: string
    emailID: string
    partyId: string
    id?: string
    AccountNo: string
    Iban?: string
    startDate: string
    endDate: string
  }
}