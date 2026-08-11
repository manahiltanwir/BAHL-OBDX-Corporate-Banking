
export interface IPartyManagement {
  alreadyExist: boolean
  partyId: string
  partyName: string
  partyStatus: 'ACTIVE' | 'INACTIVE' | ''
  statusReason: string
  id?: string
  createdAt?: Date
}

export interface PartyManagementApi extends IPartyManagement {
  id: string,
  createdAt: Date
}

export interface PartyPreferences {
  channelAccess: 'enable' | 'disable'
  corporateAdminFacility: 'enable' | 'disable'
  gracePeriod: string
}

export interface PartyManagementForm extends IPartyManagement { }

export type PartyManagementKeys = keyof PartyManagementForm;
