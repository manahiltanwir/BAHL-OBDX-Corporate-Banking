import { createSlice, createAsyncThunk, Dispatch } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { RootState, AppDispatch } from 'src/store'
import { createOfttBeneficiary , getOfttBeneficiariesByUser } from 'src/services'
import { CreateOfttBeneficiaryPayload, OfttBeneficiary } from 'src/types/apps/ofttBeneficiary'
// ApiError ka import bilkul waisa hi rakhein jaisa certificate slice mein hai

const createThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
  rejectValue: string
}>()

const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue:
(reason: string) => any) => {
  const message = error?.response?.data?.message || 'Something went wrong'

  dispatch(ofttBeneficiarySlice.actions.handleStatus('error'))
  return rejectWithValue(message)
}

export const createOfttBeneficiaryAction = createThunk(
  'ofttBeneficiary/create',
  async (payload: CreateOfttBeneficiaryPayload, { dispatch, rejectWithValue }) => {
    try {
      const res = await createOfttBeneficiary(payload)
      const body = res.data

      if (body.status !== 201) {
        const message = body.message || 'Unable to create beneficiary'

        toast.error(message)

        return rejectWithValue(message)
      }

      return body.data
    } catch (error) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// User ki saari OFTT beneficiaries (user token se pehchana jata hai, request me koi id nahi jati)
export const fetchOfttBeneficiariesAction = createThunk(
  'ofttBeneficiary/fetchAll',
  async (_: void, { dispatch, rejectWithValue }) => {
    try {
      const res = await getOfttBeneficiariesByUser()
      const body = res.data

      if (body.status !== 200) {
        const message = body.message || 'Unable to load beneficiaries'

        toast.error(message)

        return rejectWithValue(message)
      }

      return body.data ?? []
    } catch (error) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

interface OfttBeneficiaryState {
  created: OfttBeneficiary | null
  status: 'idle' | 'pending' | 'success' | 'error'
  entities: OfttBeneficiary[]
  listStatus: 'idle' | 'pending' | 'success' | 'error'
}

const initialState: OfttBeneficiaryState = {
  created: null,
  status: 'idle',
  entities: [],
  listStatus: 'idle'
}

const ofttBeneficiarySlice = createSlice({
  name: 'ofttBeneficiary',
  initialState,
  reducers: {
    handleStatus: (state, action) => {
      state.status = action.payload
    },
    clearAll: () => initialState
  },
  extraReducers: builder => {
    builder
      .addCase(createOfttBeneficiaryAction.pending, state => {
        state.status = 'pending'
      })
      .addCase(createOfttBeneficiaryAction.fulfilled, (state, action) => {
        state.status = 'success'
        state.created = action.payload
      })
      .addCase(createOfttBeneficiaryAction.rejected, state => {
        state.status = 'error'
      })
      .addCase(fetchOfttBeneficiariesAction.pending, state => {
        state.listStatus = 'pending'
      })
      .addCase(fetchOfttBeneficiariesAction.fulfilled, (state, action) => {
        state.listStatus = 'success'
        state.entities = action.payload
      })
      .addCase(fetchOfttBeneficiariesAction.rejected, state => {
        state.listStatus = 'error'
        state.entities = []
      })
  }
})

export const { clearAll } = ofttBeneficiarySlice.actions
export default ofttBeneficiarySlice.reducer