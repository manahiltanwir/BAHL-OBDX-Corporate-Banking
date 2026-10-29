// Core base entity interface
export interface ITransactionAspects {
  apiEndpoint: string | null
  operationCode: string
  operationName: string
  serviceId: string
  servicePath: string
  taskCode: string | null
  taskServiceId: number
  aspects?: IAspect[]
}

interface AspectsCardProps {
  isEdit: boolean
  setIsEdit: Dispatch<SetStateAction<boolean>>
  onBack?: () => void
  selectedTransaction: ITransactionAspects | undefined
}

// Sub-interface dependency
export interface IAspect {
  aspectId?: string | number
  aspect?: string
  id: number
  isEnabled: 'Y' | 'N'
  updatedBy?: string
}

interface IAspectUpdatePayload {
  aspectId: number
  isEnabled: 'Y' | 'N' | string
  updatedBy: string
}

// Full API representation including system timestamps
export interface TransactionAspectsApi extends ITransactionAspects {
  id: string
  createdAt: Date
  updatedAt: Date
}

// Form management schema alignment
export interface TransactionAspectsForm extends ITransactionAspects {}

// Lookup and utility keys derived from the structure
export type TransactionAspectsKeys = keyof TransactionAspectsForm

// Core wrapper representation for the server payloads
export interface IAspectsResponse {
  status: 'success' | 'error' | string
  data: ITransactionAspects[]
}
