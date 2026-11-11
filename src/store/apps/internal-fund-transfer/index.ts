import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/store'
import toast from 'react-hot-toast'
import { DashboardService, InternalFundTransfer } from 'src/services'
import {
  TransferFromAccount,
  TransferDraft,
  ReviewState,
  TitleFetchResponse,
  InternalTransferResponse
} from 'src/types/apps/internalFundTrasnfer'

interface InitialState {
  accounts: TransferFromAccount[]
  review: ReviewState | null
  confirmation: InternalTransferResponse | null
  status: 'pending' | 'error' | 'success' | 'idle'
}

const initialState: InitialState = {
  accounts: [],
  review: null,
  confirmation: null,
  status: 'idle'
}

const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue:
(reason: string) => any) => {
  dispatch(InternalFundTransferSlice.actions.handleStatus('error'))
  toast.error(error?.response ? error.response.data.message :
'Something Went Wrong')
  return rejectWithValue(error.response?.data?.message || 'Something Went Wrong') }

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

export const fetchTransferFromAccountsAction = createAppAsyncThunk(
  'internalFundTransfer/fetchTransferFromAccounts',
  async ({ username }: { username: string }, { dispatch, rejectWithValue }) => {
    dispatch(InternalFundTransferSlice.actions.handleStatus('pending'))
    try {
      const response = await DashboardService.getAll(username)
      dispatch(InternalFundTransferSlice.actions.handleStatus('success'))
      return (response.data?.data ?? response.data) as TransferFromAccount[]
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// Review click par: sirf title fetch (new aur existing dono tabs ke liye) 
export const fetchTitleAction = createAppAsyncThunk(
  'internalFundTransfer/fetchTitle',
  async ({ data }: { data: TransferDraft }, { dispatch, rejectWithValue }) => {
    dispatch(InternalFundTransferSlice.actions.handleStatus('pending'))
    try {
      const res = await InternalFundTransfer.fetchTitle({
        toAccount: data.toAccount,
        amount: '0.00',
        titleType: '1LINK-ACCOUNTNUMBER'
      })
      const title = (res.data?.data ?? res.data) as TitleFetchResponse

      if (title?.status !== 'SUCCESS' || !title?.accountTitle) {
        throw { response: { data: { message: 'Unable to fetch account title' } } } // message baad me tay hoga
      }

      dispatch(InternalFundTransferSlice.actions.handleStatus('success'))
      return { draft: data, toAccountName: title.accountTitle } as ReviewState
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// Confirm click par: existing beneficiary => /internal-transfer-bene, warna /internal-transfer-instant 
export const confirmInternalTransferAction = createAppAsyncThunk(
  'internalFundTransfer/confirmTransfer',
  async ({ data }: { data: ReviewState }, { dispatch, rejectWithValue }) => {
    dispatch(InternalFundTransferSlice.actions.handleStatus('pending'))
    try {
      const { draft, toAccountName } = data

      const base = {
        fromAccount: draft.fromAccount,
        toAccount: draft.toAccount,
        toAccountName,
        currency: draft.currency,
        amount: draft.amount,
        purpose: draft.purpose,
        purposeCode: draft.purposeCode
      }

      let res

      if (draft.isBeneExists === 'Y') {
        if (draft.beneficiaryId === undefined) {
          throw { response: { data: { message: 'Beneficiary not selected' } } }
        }

        res = await InternalFundTransfer.beneTransfer({
          ...base,
          isBeneExists: 'Y',
          beneficiaryId: draft.beneficiaryId
        })
      } else {
        res = await InternalFundTransfer.instantTransfer({ ...base, isBeneExists: 'N' })
      }

      const response = (res.data?.data ?? res.data) as InternalTransferResponse

      if (response?.status !== 'SUCCESS') {
        throw { response: { data: { message: 'Transfer failed' } } } // message baad me tay hoga
      }

      toast.success('Fund transfer completed successfully!')
      dispatch(InternalFundTransferSlice.actions.handleStatus('success'))

      return response
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const InternalFundTransferSlice = createSlice({
  name: 'internalFundTransfer',
  initialState,
  reducers: {
    handleStatus: (state, action) => {
      state.status = action.payload
    },
    resetReview: state => {
      state.review = null
      state.confirmation = null
    },
    resetInternalFundTransfer: state => {
      state.accounts = []
      state.review = null
      state.confirmation = null
      state.status = 'idle'
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchTransferFromAccountsAction.fulfilled, (state,
action) => {
      state.accounts = Array.isArray(action.payload) ? action.payload : []
    })
    builder.addCase(fetchTitleAction.fulfilled, (state, action) => {
      state.review = action.payload as ReviewState
    })
    builder.addCase(confirmInternalTransferAction.fulfilled, (state,
action) => {
      state.confirmation = action.payload as InternalTransferResponse
    })
  }
})

export const { resetInternalFundTransfer, resetReview } = InternalFundTransferSlice.actions

export default InternalFundTransferSlice.reducer