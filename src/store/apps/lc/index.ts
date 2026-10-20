// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/store'

// ** Toast
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { lcService } from 'src/services'

// ** Types Imports
import { GetParams } from 'src/types/api'
import {
  AccountLookup,
  AdvisingBankLookup,
  AttachmentRecord,
  BeneficiaryLookup,
  ImportLCFormState,
  StepKey
} from 'src/types/apps/lc'

// ** Initial State Of Slice

interface InitialState {
  entities: AccountLookup[] | AdvisingBankLookup[] | AttachmentRecord[] | BeneficiaryLookup[] | StepKey[] | []
  entity: AccountLookup | AdvisingBankLookup | AttachmentRecord | BeneficiaryLookup | StepKey | {}
  beneficiaryDetails: BeneficiaryLookup | {} | any
  advisoryBankDetails: BeneficiaryLookup | [] | any
  params: GetParams
  status: 'pending' | 'error' | 'success' | 'idle'
}

// Api Error
const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue: (reasaon: string) => void) => {
  dispatch(lcSlice.actions.handleStatus('error'))
  toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')
  return rejectWithValue(error.response.data.message || 'Something Went Wrong')
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

// ** Fetch One
export const fetchOneAction = createAppAsyncThunk(
  'lc/fetchOne',
  async ({ id }: { id: string }, { getState, dispatch, rejectWithValue }) => {
    dispatch(lcSlice.actions.handleStatus('pending'))
    try {
      const response = await lcService.getById(id)
      dispatch(lcSlice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** Fetch One Action For Beneficiaries
export const fetchOneActionForBeneficiary = createAppAsyncThunk(
  'lc/fetchOneActionForBeneficiary',
  async ({ partyId }: { partyId: string }, { getState, dispatch, rejectWithValue }) => {
    dispatch(lcSlice.actions.handleStatus('pending'))
    try {
      const response = await lcService.getAllBeneficiariesByParty(partyId)
      dispatch(lcSlice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const fetchOneActionForAdvisoryBank = createAppAsyncThunk(
  'lc/fetchOneActionForAdvisoryBank',
  async ({ partyId }: { partyId: string }, { getState, dispatch, rejectWithValue }) => {
    dispatch(lcSlice.actions.handleStatus('pending'))
    try {
      const response = await lcService.getAllAdvisoryBankByParty(partyId)
      dispatch(lcSlice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** Fetch All
export const fetchAllAction = createAppAsyncThunk(
  'lc/fetchAll',
  async (params: GetParams, { getState, dispatch, rejectWithValue }) => {
    dispatch(lcSlice.actions.handleStatus('pending'))
    try {
      dispatch(lcSlice.actions.handleQuery(params.query))
      const query = getState().lc.params.query
      // query && (query.limit = `${params.pagination?.limit}` || "10")
      // query && (query.page = `${params.pagination?.page}` || "1")
      // dispatch(lcSlice.actions.handleQuery({ query }))
      const response = await lcService.getAll({ query })
      dispatch(lcSlice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** Add
export const addAction = createAppAsyncThunk(
  'lc/add',
  async ({ data }: { data: ImportLCFormState }, { getState, dispatch, rejectWithValue }) => {
    dispatch(lcSlice.actions.handleStatus('pending'))
    try {
      const response = await lcService.add(data)
      dispatch(lcSlice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** Update
export const updateAction = createAppAsyncThunk(
  'lc/update',
  async ({ id, data }: { id: string; data: ImportLCFormState }, { getState, dispatch, rejectWithValue }) => {
    dispatch(lcSlice.actions.handleStatus('pending'))
    try {
      const response = await lcService.update(id, data)
      const query = getState().lc.params.query
      dispatch(fetchAllAction({ query }))
      toast.success('updated succesfully!')
      dispatch(lcSlice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** Delete
export const deleteAction = createAppAsyncThunk(
  'lc/delete',
  async ({ id }: { id: string }, { getState, dispatch, rejectWithValue }) => {
    dispatch(lcSlice.actions.handleStatus('pending'))
    try {
      const response = await lcService.delete(id)
      const query = getState().lc.params.query
      dispatch(fetchAllAction({ query }))
      toast.success('deleted succesfully!')
      dispatch(lcSlice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const lcSlice = createSlice({
  name: 'lc',
  initialState: {
    entities: [],
    entity: {},
    beneficiaryDetails: {},
    advisoryBankDetails: {},
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
      state.entities = data?.entities || []
      state.params.pagination = data?.pagination
    })
    builder.addCase(fetchOneAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entity = data.lc
    })
    builder.addCase(fetchOneActionForBeneficiary.fulfilled, (state, action) => {
      state.beneficiaryDetails = action.payload
    })
    builder.addCase(fetchOneActionForAdvisoryBank.fulfilled, (state, action) => {
      state.advisoryBankDetails = action.payload
    })
  }
})

export default lcSlice.reducer
