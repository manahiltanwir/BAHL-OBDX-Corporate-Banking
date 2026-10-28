import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/store'
import toast from 'react-hot-toast'
import { BeneficiaryService, InternalFundTransfer } from 'src/services'
import { TitleFetchResponse } from 'src/types/apps/internalFundTrasnfer'
import { Beneficiary, CreateBeneficiaryPayload, AddBeneficiaryDraft, AddBeneficiaryReview } from 'src/types/apps/beneficiary'

interface InitialState {
  beneficiaries: Beneficiary[]
  addReview: AddBeneficiaryReview | null
  status: 'pending' | 'error' | 'success' | 'idle'
}

const initialState: InitialState = {
  beneficiaries: [],
  addReview: null,
  status: 'idle'
}

const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue:
(reason: string) => any) => {
  dispatch(BeneficiarySlice.actions.handleStatus('error'))
  toast.error(error?.response ? error.response.data.message :
'Something Went Wrong')
  return rejectWithValue(error.response?.data?.message || 'Something Went Wrong') }

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

export const fetchBeneficiariesAction = createAppAsyncThunk(
  'beneficiary/fetchBeneficiaries',
  async ({ userId }: { userId: string }, { dispatch, rejectWithValue }) => {
    dispatch(BeneficiarySlice.actions.handleStatus('pending'))
    try {
      const res = await BeneficiaryService.getBeneficiaries(userId)
      dispatch(BeneficiarySlice.actions.handleStatus('success'))
      return (res.data?.data ?? []) as Beneficiary[]
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const fetchBeneficiaryTitleAction = createAppAsyncThunk(
  'beneficiary/fetchBeneficiaryTitle',
  async ({ data }: { data: AddBeneficiaryDraft }, { dispatch, rejectWithValue }) => {
    dispatch(BeneficiarySlice.actions.handleStatus('pending'))
    try {
      const res = await InternalFundTransfer.fetchTitle({
        toAccount: data.accountNumber,
        amount: '0.00',
        titleType: '1LINK-ACCOUNTNUMBER'
      })
      const title = (res.data?.data ?? res.data) as TitleFetchResponse

      if (title?.status !== 'SUCCESS' || !title?.accountTitle) {
        throw { response: { data: { message: 'Unable to fetch account title' } } } // message baad me tay hoga
      }

      dispatch(BeneficiarySlice.actions.handleStatus('success'))
      return { draft: data, beneficiaryName: title.accountTitle } as AddBeneficiaryReview
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const createBeneficiaryAction = createAppAsyncThunk(
  'beneficiary/createBeneficiary',
  async ({ data }: { data: CreateBeneficiaryPayload }, { dispatch, rejectWithValue }) => {
    dispatch(BeneficiarySlice.actions.handleStatus('pending'))
    try {
      const res = await BeneficiaryService.createBeneficiary(data)

      if (res.data?.status !== 'SUCCESS') {
        throw { response: { data: { message: res.data?.message || 'Unable to create beneficiary' } } }
      }

      toast.success(res.data?.message || 'Beneficiary created successfully!')
      dispatch(BeneficiarySlice.actions.handleStatus('success'))
      return res.data.data as Beneficiary
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const deleteBeneficiaryAction = createAppAsyncThunk(
  'beneficiary/deleteBeneficiary',
  async ({ id }: { id: number }, { dispatch, rejectWithValue }) => {
    dispatch(BeneficiarySlice.actions.handleStatus('pending'))
    try {
      const res = await BeneficiaryService.deleteBeneficiary(id)

      if (res.data?.status && res.data.status !== 'SUCCESS') {
        throw { response: { data: { message: res.data?.message || 'Unable to delete beneficiary' } } }
      }

      toast.success(res.data?.message || 'Beneficiary deleted successfully!')
      dispatch(BeneficiarySlice.actions.handleStatus('success'))
      return id
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const BeneficiarySlice = createSlice({
  name: 'beneficiary',
  initialState,
  reducers: {
    handleStatus: (state, action) => {
      state.status = action.payload
    },
    clearAddReview: state => {
      state.addReview = null
    },
    resetBeneficiary: state => {
      state.beneficiaries = []
      state.status = 'idle'
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchBeneficiariesAction.fulfilled, (state, action) => {
      state.beneficiaries = Array.isArray(action.payload) ? action.payload : []
    })
    builder.addCase(fetchBeneficiaryTitleAction.fulfilled, (state, action) => {
      state.addReview = action.payload as AddBeneficiaryReview
    })
    builder.addCase(createBeneficiaryAction.fulfilled, (state, action) => {
      if (action.payload) state.beneficiaries = [action.payload as Beneficiary, ...state.beneficiaries]
    })
    builder.addCase(deleteBeneficiaryAction.fulfilled, (state, action) => {
      state.beneficiaries = state.beneficiaries.filter(b => b.id !== action.payload)
    })
  }
})

export const { resetBeneficiary, clearAddReview } = BeneficiarySlice.actions

export default BeneficiarySlice.reducer