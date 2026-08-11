import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/store'
import toast from 'react-hot-toast'
import { PartyAccountAccessService } from 'src/services'
import { PartySearchApi, AccountAccessApi, MappingPayload, RawAccount, MappedAccountItem } from 'src/types/apps/partyAccountAccess'
interface InitialState {
  party: PartySearchApi | null
  totalAccounts: RawAccount[]
  mappedAccounts: MappedAccountItem[] | string[]
  status: 'pending' | 'error' | 'success' | 'idle'
}

const initialState: InitialState = {
  party: null,
  totalAccounts: [],
  mappedAccounts: [],
  status: 'idle'
}

const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue: (reason: string) => void) => {
  dispatch(AccountMappingSlice.actions.handleStatus('error'))
  toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')
  return rejectWithValue(error.response?.data?.message || 'Something Went Wrong')
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

export const searchPartyAction = createAppAsyncThunk(
  'accountMapping/searchParty',
  async ({ partyId }: { partyId: string }, { dispatch, rejectWithValue }) => {
    dispatch(AccountMappingSlice.actions.handleStatus('pending'))
    try {
      const response = await PartyAccountAccessService.searchParty(partyId)
      dispatch(AccountMappingSlice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** Fetch Account Access (total + mapped accounts)
export const fetchAccountAccessAction = createAppAsyncThunk(
  'accountMapping/fetchAccountAccess',
  async ({ partyId }: { partyId: string }, { dispatch, rejectWithValue }) => {
    dispatch(AccountMappingSlice.actions.handleStatus('pending'))
    try {
      const response = await PartyAccountAccessService.getAccountAccess(partyId)
      dispatch(AccountMappingSlice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const updateAccountMappingAction = createAppAsyncThunk(
  'accountMapping/updateAccountMapping',
  async ({ data }: { data: MappingPayload }, { dispatch, rejectWithValue }) => {
    dispatch(AccountMappingSlice.actions.handleStatus('pending'))
    try {
      const response = await PartyAccountAccessService.updateAccountMapping(data)
      const actionType = data.accounts[0]?.actionType
      toast.success(actionType === 'unmap' ? 'Accounts unmapped successfully!' : 'Accounts mapped successfully!')

      dispatch(AccountMappingSlice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const AccountMappingSlice = createSlice({
  name: 'accountMapping',
  initialState,
  reducers: {
    handleStatus: (state, action) => {
      state.status = action.payload
    },
    resetAccountMapping: state => {
      state.party = null
      state.totalAccounts = []
      state.mappedAccounts = []
      state.status = 'idle'
    }
  },
  extraReducers: builder => {
    builder.addCase(searchPartyAction.fulfilled, (state, action) => {
      state.party = action.payload
    })
    builder.addCase(fetchAccountAccessAction.fulfilled, (state, action) => {
      const { totalAccounts, mappedAccounts } = action.payload as AccountAccessApi
      state.totalAccounts = totalAccounts || []
      state.mappedAccounts = mappedAccounts || []
    })
  }
})

export const { resetAccountMapping } = AccountMappingSlice.actions

export default AccountMappingSlice.reducer