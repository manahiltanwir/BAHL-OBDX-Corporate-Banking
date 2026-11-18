import { createSlice, createAsyncThunk, Dispatch } from '@reduxjs/toolkit'
import {AppDispatch, RootState } from 'src/store'
import { getTermDepositAccounts, getTermDepositDetails } from 'src/services'
import { TermDepositAccount, TermDepositDetails, TermDepositDetailsPayload } from 'src/types/apps/termDeposit'
// handleStatus aur ApiError ka import bilkul waisa hi rakhein jaisa certificate slice mein hai

const createThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
  rejectValue: string
}>()

const assertSuccess = (status: string) => {
  if (String(status).toLowerCase() !== 'success') throw new Error('Request failed')
}

const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue:
(reason: string) => any) => {
  const message = error?.response?.data?.message || 'Something went wrong'

  dispatch(termDepositSlice.actions.handleStatus('error'))
  return rejectWithValue(message)
}

export const fetchTermDepositAccountsAction = createThunk(
  'termDeposit/fetchAccounts',
  async (partyId: string, { dispatch, rejectWithValue }) => {
    try {
      const res = await getTermDepositAccounts(partyId)

      assertSuccess(res.data.status)

      return res.data.data
    } catch (error) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const fetchTermDepositDetailsAction = createThunk(
  'termDeposit/fetchDetails',
  async (payload: TermDepositDetailsPayload, { dispatch, rejectWithValue }) => {
    try {
      const res = await getTermDepositDetails(payload)

      assertSuccess(res.data.status)

      return res.data.data
    } catch (error) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

interface TermDepositState {
  accounts: TermDepositAccount[]
  details: TermDepositDetails | null
  status: 'idle' | 'pending' | 'success' | 'error'
  detailsStatus: 'idle' | 'pending' | 'success' | 'error'
}

const initialState: TermDepositState = {
  accounts: [],
  details: null,
  status: 'idle',
  detailsStatus: 'idle'
}

export const termDepositSlice = createSlice({
  name: 'termDeposit',
  initialState,
  reducers: {
    clearDetails: state => {
      state.details = null
      state.detailsStatus = 'idle'
    },handleStatus: (state, action) => {
      state.status = action.payload
    },
    clearAll: () => initialState
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTermDepositAccountsAction.pending, state => {
        state.status = 'pending'
      })
      .addCase(fetchTermDepositAccountsAction.fulfilled, (state, action) => {
        state.status = 'success'
        state.accounts = action.payload
      })
      .addCase(fetchTermDepositAccountsAction.rejected, state => {
        state.status = 'error'
        state.accounts = []
      })
      .addCase(fetchTermDepositDetailsAction.pending, state => {
        state.detailsStatus = 'pending'
      })
      .addCase(fetchTermDepositDetailsAction.fulfilled, (state, action) => {
        state.detailsStatus = 'success'
        state.details = action.payload
      })
      .addCase(fetchTermDepositDetailsAction.rejected, state => {
        state.detailsStatus = 'error'
        state.details = null
      })
  }
})

export const { clearDetails, clearAll } = termDepositSlice.actions
export default termDepositSlice.reducer