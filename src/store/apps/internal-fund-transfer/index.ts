import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/store'
import toast from 'react-hot-toast'
import { DashboardService, InternalFundTransfer } from 'src/services'
import {
  TransferFromAccount,
  Beneficiary,
  TransferDraft,
  ReviewState,
  TitleFetchResponse,
  InternalTransferPayload,
  InternalTransferResponse
} from 'src/types/apps/internalFundTrasnfer'

interface InitialState {
  accounts: TransferFromAccount[]
  //beneficiaries: Beneficiary[]
  review: ReviewState | null
  confirmation: InternalTransferResponse | null
  status: 'pending' | 'error' | 'success' | 'idle'
}

const initialState: InitialState = {
  accounts: [],
  //beneficiaries: [],
  review: null,
  confirmation: null,
  status: 'idle'
}

const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue:
(reason: string) => void) => {
  dispatch(InternalFundTransferSlice.actions.handleStatus('error'))
  toast.error(error?.response ? error.response.data.message :
'Something Went Wrong')
  return rejectWithValue(error.response?.data?.message || 'Something Went Wrong') }

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

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

export const confirmInternalTransferAction = createAppAsyncThunk(
  'internalFundTransfer/confirmTransfer',
  async ({ data }: { data: ReviewState }, { dispatch, rejectWithValue }) => {
    dispatch(InternalFundTransferSlice.actions.handleStatus('pending'))
    try {
      const request: InternalTransferPayload = {
        fromAccount: data.draft.fromAccount,
        toAccount: data.draft.toAccount,
        toAccountName: data.toAccountName,
        currency: data.draft.currency,
        amount: data.draft.amount,
        isBeneExists: data.draft.isBeneExists,
        purpose: data.draft.purpose,
        purposeCode: data.draft.purposeCode,
        createdBy: data.draft.createdBy
      }

      const res = await InternalFundTransfer.internalTransfer(request)
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

// export const fetchBeneficiariesAction = createAppAsyncThunk(
//   'internalFundTransfer/fetchBeneficiaries',
//   async ({ cnic }: { cnic: string }, { dispatch, rejectWithValue }) => {
//     dispatch(InternalFundTransferSlice.actions.handleStatus('pending'))
//     try {
//       const res = await InternalFundTransfer.getBeneficiaries(cnic)
//       dispatch(InternalFundTransferSlice.actions.handleStatus('success'))
//       return ((res.data?.data ?? []) as Beneficiary[])
//     } catch (error: any) {
//       return ApiError(error, dispatch, rejectWithValue)
//     }
//   }
// )

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
      state.status = 'idle'
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchTitleAction.fulfilled, (state, action) => {
      state.review = action.payload as ReviewState
    })
    
    builder.addCase(confirmInternalTransferAction.fulfilled, (state, action) => {
      state.confirmation = action.payload as InternalTransferResponse
    })

    // builder.addCase(fetchBeneficiariesAction.fulfilled, (state, action) => {
    //   state.beneficiaries = Array.isArray(action.payload) ? action.payload : []
    // })
  }
})

export const { resetInternalFundTransfer, resetReview } = InternalFundTransferSlice.actions

export default InternalFundTransferSlice.reducer
