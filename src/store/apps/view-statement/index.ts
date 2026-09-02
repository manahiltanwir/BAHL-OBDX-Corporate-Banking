import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/store'
import toast from 'react-hot-toast'
import { viewStatementService } from 'src/services'
import { GetParams } from 'src/types/api'
import { ViewStatementApi, ViewStatementForm } from 'src/types/apps/viewStatement'

interface InitialState {
  entities: ViewStatementApi[];
  entity: ViewStatementForm | null;
  params: GetParams;
  status: 'pending' | 'error' | 'success' | 'idle';
}

const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue: (reason: string) => void) => {
  dispatch(ViewStatementSlice.actions.handleStatus('error'))
  toast.error(error?.response ? error.response.data.message : "Something Went Wrong")
  return rejectWithValue(error.response?.data?.message || "Something Went Wrong")
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

export const fetchOneAction = createAppAsyncThunk(
  'viewStatement/fetchOne',
  async ({ id }: { id: string }, { dispatch, rejectWithValue }) => {
    dispatch(ViewStatementSlice.actions.handleStatus('pending'))
    try {
      const response = await viewStatementService.getById(id);
      dispatch(ViewStatementSlice.actions.handleStatus('success'))
      return response.data;
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const fetchAllAction = createAppAsyncThunk(
  'viewStatement/fetchAll',
  async (
    {
      accountNumber,
      fromDate,
      toDate
    }: {
      accountNumber: string
      fromDate: string
      toDate: string
    },
    { dispatch, rejectWithValue }
  ) => {
    dispatch(ViewStatementSlice.actions.handleStatus('pending'))

    try {
      const response = await viewStatementService.getAll({
        accountNo: accountNumber,
        fromDate,
        toDate
      })

      dispatch(ViewStatementSlice.actions.handleStatus('success'))

      return response.data

    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const addAction = createAppAsyncThunk(
  'viewStatement/add',
  async ({ data }: { data: ViewStatementForm }, { dispatch, rejectWithValue }) => {
    dispatch(ViewStatementSlice.actions.handleStatus('pending'))
    try {
      const response = await viewStatementService.add(data as any);
      toast.success("Added succesfully!")
      dispatch(ViewStatementSlice.actions.handleStatus('success'))
      return response.data;
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const updateAction = createAppAsyncThunk(
  'viewStatement/update',
  async ({ id, data }: { id: string, data: ViewStatementForm }, { dispatch, rejectWithValue }) => {
    dispatch(ViewStatementSlice.actions.handleStatus('pending'))
    try {
      const response = await viewStatementService.update(id, data as any);
      toast.success("Updated succesfully!")
      dispatch(ViewStatementSlice.actions.handleStatus('success'))
      return response.data;
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const deleteAction = createAppAsyncThunk(
  'viewStatement/delete',
  async ({ id }: { id: string }, { dispatch, rejectWithValue }) => {
    dispatch(ViewStatementSlice.actions.handleStatus('pending'))
    try {
      const response = await viewStatementService.delete(id);
      toast.success("Deleted succesfully!")
      dispatch(ViewStatementSlice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const ViewStatementSlice = createSlice({
  name: 'viewStatement',
  initialState: {
    entities: [],
    entity: null,
    params: {},
    status: 'idle',
  } as InitialState,
  reducers: {
    handleStatus: (state, action) => {
      state.status = action.payload;
    },
    handleQuery: (state, action) => {
      const prev_query = state.params.query || {}
      state.params.query = { ...prev_query, ...action.payload };
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchAllAction.fulfilled, (state, action) => {
      state.entities = action.payload?.data ?? action.payload ?? []
    })
    builder.addCase(fetchOneAction.fulfilled, (state, action) => {
      state.entity = action.payload?.data ?? action.payload ?? null;
    })
  }
})

export default ViewStatementSlice.reducer