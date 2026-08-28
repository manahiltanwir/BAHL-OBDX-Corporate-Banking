import { createAsyncThunk, createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/store'
import toast from 'react-hot-toast'
import { UserAccountAccess } from 'src/services'
import {
  PartyUserSearchItem,
  PartyUserResultRow,
  UserAccountItem,
  UserAccountAccessApi,
  UserMappingPayload
} from 'src/types/apps/userAccountAccess'

const toPartyUserResultRow = (item: PartyUserSearchItem): PartyUserResultRow => {
  const { userDTO, userParties, userProfileDTO } = item

  const rawStatus = userDTO?.status
  const status = rawStatus === 'A' ? 'ACTIVE' : rawStatus === 'I' ? 'INACTIVE' : rawStatus || 'N/A'

  return {
    partyId: userParties?.[0]?.partyId ?? '',
    userId: userDTO?.userId ?? userProfileDTO.userId,
    userName: [userProfileDTO.firstName, userProfileDTO.lastName].filter(Boolean).join(' '),
    status,
    cnic: userProfileDTO.cnic
  }
}

interface InitialState {
  users: PartyUserResultRow[]
  selectedUser: PartyUserResultRow | null
  totalAccounts: UserAccountItem[]
  mappedAccounts: UserAccountItem[] | string[]
  status: 'pending' | 'error' | 'success' | 'idle'
}

const initialState: InitialState = {
  users: [],
  selectedUser: null,
  totalAccounts: [],
  mappedAccounts: [],
  status: 'idle'
}

const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue: (reason: string) => void) => {
  dispatch(UserAccountAccessSlice.actions.handleStatus('error'))
  toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')
  return rejectWithValue(error.response?.data?.message || 'Something Went Wrong')
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

export const searchPartyUsersAction = createAppAsyncThunk(
  'userAccountAccess/searchPartyUsers',
  async ({ partyId }: { partyId: string }, { dispatch, rejectWithValue }) => {
    dispatch(UserAccountAccessSlice.actions.handleStatus('pending'))
    try {
      const response = await UserAccountAccess.searchPartyUsers(partyId)
      dispatch(UserAccountAccessSlice.actions.handleStatus('success'))
      return response.data as PartyUserSearchItem[]
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const fetchUserAccountAccessAction = createAppAsyncThunk(
  'userAccountAccess/fetchUserAccountAccess',
  async ({ partyId, userId }: { partyId: string; userId: string }, { dispatch, rejectWithValue }) => {
    dispatch(UserAccountAccessSlice.actions.handleStatus('pending'))
    try {
      const response = await UserAccountAccess.getUserAccountAccess(partyId, userId)
      dispatch(UserAccountAccessSlice.actions.handleStatus('success'))
      return response.data?.data ?? response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const updateUserAccountMappingAction = createAppAsyncThunk(
  'userAccountAccess/updateUserAccountMapping',
  async ({ data }: { data: UserMappingPayload }, { dispatch, rejectWithValue }) => {
    dispatch(UserAccountAccessSlice.actions.handleStatus('pending'))
    try {
      const response = await UserAccountAccess.updateUserAccountMapping(data)
      const actionType = data.accounts[0]?.actionType
      toast.success(actionType === 'unmap' ? 'Accounts unmapped successfully!' : 'Accounts mapped successfully!')

      dispatch(UserAccountAccessSlice.actions.handleStatus('success'))
      return response.data?.data ?? response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const UserAccountAccessSlice = createSlice({
  name: 'userAccountAccess',
  initialState,
  reducers: {
    handleStatus: (state, action) => {
      state.status = action.payload
    },
    selectUser: (state, action: PayloadAction<PartyUserResultRow>) => {
      state.selectedUser = action.payload
    },
    backToResults: state => {
      state.selectedUser = null
      state.totalAccounts = []
      state.mappedAccounts = []
    },
    resetUserAccountAccess: state => {
      state.users = []
      state.selectedUser = null
      state.totalAccounts = []
      state.mappedAccounts = []
      state.status = 'idle'
    }
  },
  extraReducers: builder => {
    builder.addCase(searchPartyUsersAction.fulfilled, (state, action) => {
      state.users = (action.payload || []).map(toPartyUserResultRow)
    })
    builder.addCase(fetchUserAccountAccessAction.fulfilled, (state, action) => {
      const { totalAccounts, mappedAccounts } = action.payload as UserAccountAccessApi
      state.totalAccounts = totalAccounts || []
      state.mappedAccounts = mappedAccounts || []
    })
  }
})

export const { selectUser, backToResults, resetUserAccountAccess } = UserAccountAccessSlice.actions

export default UserAccountAccessSlice.reducer