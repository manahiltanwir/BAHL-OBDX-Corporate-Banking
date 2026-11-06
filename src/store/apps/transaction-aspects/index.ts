// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/store'

// ** Toast
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { transactionAspectsService } from 'src/services'

// ** Types Imports
import { GetParams } from 'src/types/api'
import {
  IAspect,
  IAspectUpdatePayload,
  ITransactionAspects,
  TransactionAspectsApi,
  TransactionAspectsForm
} from 'src/types/apps/transactionAspects'

interface InitialState {
  entities: TransactionAspectsApi[] | []
  entity: TransactionAspectsApi | {}
  params: GetParams
  status: 'pending' | 'error' | 'success' | 'idle'
}

// Api Error (showToast false ho to sirf reject hota hai, toast nahi aata)
const ApiError = (
  error: any,
  dispatch: AppDispatch,
  rejectWithValue: (reasaon: string) => void,
  showToast: boolean = true
) => {
  dispatch(Slice.actions.handleStatus('error'))
  if (showToast) {
    toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')
  }
  return rejectWithValue(error?.response?.data?.message || 'Something Went Wrong')
}

// ** Maker-checker detection (status number ho ya string, wrapper ho ya na ho, crash nahi karta)
const isPendingApprovalResponse = (res: any) => {
  const s = String(res?.status ?? res?.data?.status ?? '').toUpperCase()

  return s.includes('PENDING') || !!res?.workflowId || !!res?.data?.workflowId
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

export const fetchOneAction = createAppAsyncThunk(
  'transactionAspects/fetchOne',
  async ({ id }: { id: string }, { getState, dispatch, rejectWithValue }) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await transactionAspectsService.getById(id)
      dispatch(Slice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const fetchAllAction = createAppAsyncThunk(
  'transactionAspects/fetchAll',
  async (enterpriseRoleId: string | number, { getState, dispatch, rejectWithValue }) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await transactionAspectsService.getAll(enterpriseRoleId)
      dispatch(Slice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const addAction = createAppAsyncThunk(
  'transactionAspects/add',
  async ({ data }: { data: TransactionAspectsForm }, { dispatch, rejectWithValue }) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await transactionAspectsService.add(data)
      dispatch(Slice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue, false)
    }
  }
)
// Hardcoded toast hata diya, error par toast band: hook modal/toast decide karta hai
export const updateAction = createAppAsyncThunk(
  'transactionAspects/update',
  async (
    {
      id,
      data
    }: {
      id: string
      data: IAspectUpdatePayload[]
      selectedTransaction?: ITransactionAspects | undefined
    },
    { dispatch, rejectWithValue }
  ) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await transactionAspectsService.update(id, data)
      dispatch(Slice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue, false)
    }
  }
)

// ** Delete
export const deleteAction = createAppAsyncThunk(
  'transactionAspects/delete',
  async ({ id }: { id: string }, { getState, dispatch, rejectWithValue }) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await transactionAspectsService.delete(id)
      toast.success('deleted succesfully!')
      dispatch(Slice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const Slice = createSlice({
  name: 'transactionAspects',
  initialState: {
    entities: [],
    entity: {},
    params: {}
  } as InitialState,
  reducers: {
    handleStatus: (state, action) => {
      state.status = action.payload
    },
    handleQuery: (state, action) => {
      const prev_query = state.params.query || {}
      state.params.query = { ...prev_query, ...action.payload }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchAllAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entities = data
    })
    builder.addCase(fetchOneAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entity = data.category
    })
    builder.addCase(updateAction.fulfilled, (state, action) => {
      // Maker-checker: approval pending hai to change abhi apply nahi hua,
      // isliye aspects ki enabled state mat badlo.
      if (isPendingApprovalResponse(action.payload)) return

      const { data } = action.meta.arg

      if (!Array.isArray(data) || data.length === 0) return
      const updates = new Map<number, any>(data.map((u: any) => [u.aspectId, u.isEnabled]))

      ;(state.entities as any[]).forEach(entity => {
        if (!entity?.aspects) return

        entity.aspects = entity.aspects.map((aspect: any) =>
          updates.has(aspect.id) ? { ...aspect, isEnabled: updates.get(aspect.id) } : aspect
        )
      })
    })
  }
})

export default Slice.reducer