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

// ** Initial State Of Slice

interface InitialState {
  entities: TransactionAspectsApi[] | []
  entity: TransactionAspectsApi | {}
  params: GetParams
  status: 'pending' | 'error' | 'success' | 'idle'
}

// Api Error
const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue: (reasaon: string) => void) => {
  dispatch(Slice.actions.handleStatus('error'))
  toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')
  return rejectWithValue(error.response.data.message || 'Something Went Wrong')
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

// ** Fetch One
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

// ** Fetch All
export const fetchAllAction = createAppAsyncThunk(
  'transactionAspects/fetchAll',
  async (enterpriseRoleId: string | number, { getState, dispatch, rejectWithValue }) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      dispatch(Slice.actions.handleStatus('pending'))
      const response = await transactionAspectsService.getAll(enterpriseRoleId)
      dispatch(Slice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      debugger
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** Add
export const addAction = createAppAsyncThunk(
  'transactionAspects/add',
  async ({ data }: { data: TransactionAspectsForm }, { getState, dispatch, rejectWithValue }) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await transactionAspectsService.add(data)
      const query = getState().transactionAspects.params.query
      //   dispatch(fetchAllAction({ query }))
      toast.success('Added succesfully!')
      dispatch(Slice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** Update
export const updateAction = createAppAsyncThunk(
  'transactionAspects/update',
  async (
    {
      id,
      data,
      selectedTransaction
    }: { id: string; data: IAspectUpdatePayload[]; selectedTransaction: ITransactionAspects | undefined },
    { getState, dispatch, rejectWithValue }
  ) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await transactionAspectsService.update(id, data)
      toast.success('updated succesfully!')
      dispatch(Slice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
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
      const query = getState().transactionAspects.params.query
      //   dispatch(fetchAllAction({ query }))
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
      const { data, selectedTransaction } = action.meta.arg

      if (!selectedTransaction) return
      const index = state.entities.findIndex(item => item?.taskServiceId === selectedTransaction?.taskServiceId)

      if (index !== -1) {
        const updatedAspects: any = state.entities[index]?.aspects?.map(aspect => {
          const matchingUpdate = Array.isArray(data) ? data.find((u: any) => u.aspectId === aspect.id) : null
          return {
            ...aspect,
            isEnabled: matchingUpdate ? matchingUpdate.isEnabled : aspect.isEnabled
          }
        })

        state.entities[index].aspects = updatedAspects
      }
    })
  }
})

export default Slice.reducer
