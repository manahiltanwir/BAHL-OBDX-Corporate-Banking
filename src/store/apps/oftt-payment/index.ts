import { createSlice, createAsyncThunk, Dispatch } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { RootState, AppDispatch } from 'src/store'
import { createOfttPayment, createOfttBeneficiaryPayment } from 'src/services'
import { OfttPaymentPayload, OfttPaymentResult, OfttBeneficiaryPaymentPayload, OfttBeneficiaryPaymentResult } from 'src/types/apps/ofttPayment'
// ApiError ka import bilkul waisa hi rakhein jaisa certificate slice mein hai

const createThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
  rejectValue: string
}>()

const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue:
(reason: string) => any) => {
  const message = error?.response?.data?.message || 'Something went wrong'

  dispatch(ofttPaymentSlice.actions.handleStatus('error'))
  return rejectWithValue(message)
}

export const createOfttPaymentAction = createThunk(
  'ofttPayment/create',
  async (payload: OfttPaymentPayload, { dispatch, rejectWithValue }) => {
    try {
      const res = await createOfttPayment(payload)
      const body = res.data

      // Sirf status 200 aur COMPLETED ko success maana hai
      if (body.status !== 200 || body.data?.status !== 'COMPLETED') {
        const message = body.data?.message || body.message || 'Payment could not be completed'

        toast.error(message)

        return rejectWithValue(message)
      }

      return body.data
    } catch (error) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const createOfttBeneficiaryPaymentAction = createThunk(
  'ofttPayment/createBeneficiaryPayment',
  async (payload: OfttBeneficiaryPaymentPayload, { dispatch, rejectWithValue }) => {
    try {
      const res = await createOfttBeneficiaryPayment(payload)
      const body = res.data

      // Sirf status 200 aur COMPLETED ko success maana hai
      if (body.status !== 200 || body.data?.status !== 'COMPLETED') {
        const message = body.message || 'Payment could not be completed'

        toast.error(message)

        return rejectWithValue(message)
      }

      return body.data
    } catch (error) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

interface OfttPaymentState {
  result: OfttPaymentResult | OfttBeneficiaryPaymentResult | null
  status: 'idle' | 'pending' | 'success' | 'error'
}

const initialState: OfttPaymentState = { result: null, status: 'idle' }

const ofttPaymentSlice = createSlice({
  name: 'ofttPayment',
  initialState,
  reducers: {
    handleStatus: (state, action) => {
      state.status = action.payload
    },
    clearAll: () => initialState
  },
  extraReducers: builder => {
    builder
      .addCase(createOfttPaymentAction.pending, state => {
        state.status = 'pending'
      })
      .addCase(createOfttPaymentAction.fulfilled, (state, action) => {
        state.status = 'success'
        state.result = action.payload
      })
      .addCase(createOfttPaymentAction.rejected, state => {
        state.status = 'error'
      })
      .addCase(createOfttBeneficiaryPaymentAction.pending, state => {
        state.status = 'pending'
      })
      .addCase(createOfttBeneficiaryPaymentAction.fulfilled, (state, action) => {
        state.status = 'success'
        state.result = action.payload
      })
      .addCase(createOfttBeneficiaryPaymentAction.rejected, state => {
        state.status = 'error'
      })
  }
})

export const { clearAll } = ofttPaymentSlice.actions
export default ofttPaymentSlice.reducer