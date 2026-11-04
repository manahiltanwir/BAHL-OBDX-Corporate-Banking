export interface PartySearchApi {
  alreadyExist: boolean
  partyId: string
  partyName: string
  partyStatus: string
  statusReason: string
}

export interface RawAccount {
  accountCategory: string
  accountNumber: string
  accountStatus: string
  accountTitle: string
  accountType: string
  balance: number
  branchType: string
  partyId: string
  productName: string
  currency:string
}

export interface MappedAccountItem {
  accountCategory: string
  accountNo: string
  accountType: string
  actionType: 'map' | 'unmap' | null
  branchType: string
  mapped: boolean | null
  partyId: string
  productName: string
}

export interface AccountAccessApi {
  mappedAccounts: MappedAccountItem[] | string[]
  totalAccounts: RawAccount[]
}

export interface MappingAccountItem {
  accountNo: string
  accountType: string
  accountCategory: string
  actionType: 'map' | 'unmap'
  productName: string
  branchType: string
}

export interface MappingPayload {
  partyId: string
  updatedBy: string
  accounts: MappingAccountItem[]
}

export type AccountMappingKeys = keyof PartySearchApi