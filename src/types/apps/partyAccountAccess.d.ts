// ** Party search API response shape -> GET /party-service/api/:id
export interface PartySearchApi {
  alreadyExist: boolean
  partyId: string
  partyName: string
  partyStatus: string
  statusReason: string
}

// ** Single account as returned inside totalAccounts[] by the account-access API
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
}

// ** Single account as returned inside mappedAccounts[] by the account-access API
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

// ** Account access API response shape -> GET /account-access/partyAccountAccess/:partyId
export interface AccountAccessApi {
  mappedAccounts: MappedAccountItem[] | string[]
  totalAccounts: RawAccount[]
}

// ** One account entry inside the mapping/unmapping request
export interface MappingAccountItem {
  accountNo: string
  accountType: string
  accountCategory: string
  actionType: 'map' | 'unmap'
  productName: string
  branchType: string
}

// ** Payload for POST /account-access/partyAccountAccess/mapping
export interface MappingPayload {
  partyId: string
  updatedBy: string
  accounts: MappingAccountItem[]
}

export type AccountMappingKeys = keyof PartySearchApi