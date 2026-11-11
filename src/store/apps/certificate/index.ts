import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/store'
import toast from 'react-hot-toast'
import { CertificateService } from 'src/services'
import {
  AccountStatementData,
  AccountStatementPayload,
  BalanceCertificateData,
  BalanceCertificatePayload,
  CertificateRequestPayload,
  CertificateResponse,
  CertificateResult,
  MaintenanceCertificateData,
  WrappedCertificateResponse
} from 'src/types/apps/certificate'

interface InitialState {
  status: 'pending' | 'error' | 'success' | 'idle'
}

const initialState: InitialState = {
  status: 'idle'
}

const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue:
(reason: string) => any) => {
  const message = error?.response?.data?.message || 'Something went wrong'

  dispatch(CertificateSlice.actions.handleStatus('error'))
  toast.error(message)

  return rejectWithValue(message)
}

// Bahar ka status ya andar ka result, dono me se koi fail ho to error 
const assertSuccess = (body: CertificateResponse | undefined, inner?:
CertificateResult, outerMessage?: string) => {
  if (body?.status !== 'SUCCESS' || (inner?.status && inner.status !==
'SUCCESS')) {
    throw { response: { data: { message: inner?.message || body?.message || outerMessage } } }
  }
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

// Balance certificate request
export const requestBalanceCertificateAction = createAppAsyncThunk(
  'certificate/requestBalanceCertificate',
  async ({ data }: { data: BalanceCertificatePayload }, { dispatch, rejectWithValue }) => {
    dispatch(CertificateSlice.actions.handleStatus('pending'))
    try {
      const res = await CertificateService.requestBalanceCertificate(data)
      const wrapped = res.data as
WrappedCertificateResponse<BalanceCertificateData>
      const body = wrapped?.data

      assertSuccess(body,
body?.data?.AccountBalanceCertificateResponseDTO?.result,
wrapped?.message)
      dispatch(CertificateSlice.actions.handleStatus('success'))

      return body
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// Maintenance certificate request
export const requestMaintenanceCertificateAction = createAppAsyncThunk(
  'certificate/requestMaintenanceCertificate',
  async ({ data }: { data: CertificateRequestPayload }, { dispatch, rejectWithValue }) => {
    dispatch(CertificateSlice.actions.handleStatus('pending'))
    try {
      const res = await CertificateService.requestMaintenanceCertificate(data)
      const body = res.data as CertificateResponse<MaintenanceCertificateData>

      assertSuccess(body,
body?.data?.AccountMaintenanceCertificateResponseDTO?.result)
      dispatch(CertificateSlice.actions.handleStatus('success'))

      return body
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const requestAccountStatementAction = createAppAsyncThunk(
  'certificate/requestAccountStatement',
  async ({ data }: { data: AccountStatementPayload }, { dispatch, rejectWithValue }) => {
    dispatch(CertificateSlice.actions.handleStatus('pending'))
    try {
      const res = await CertificateService.requestAccountStatement(data)
      const wrapped = res.data as
WrappedCertificateResponse<AccountStatementData>
      const body = wrapped?.data

      assertSuccess(body,
body?.data?.AccountStatementResponseDTO?.result, wrapped?.message)
      dispatch(CertificateSlice.actions.handleStatus('success'))

      return body
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const CertificateSlice = createSlice({
  name: 'certificate',
  initialState,
  reducers: {
    handleStatus: (state, action) => {
      state.status = action.payload
    }
  }
})

export default CertificateSlice.reducer