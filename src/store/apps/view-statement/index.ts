
// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState, } from 'src/store'

// ** Toast
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { viewStatementService } from 'src/services'

// ** Types Imports
import { GetParams } from 'src/types/api'
import { ViewStatementApi, ViewStatementForm } from 'src/types/apps/viewStatement'

// ** Initial State Of Slice

interface InitialState {
    entities: ViewStatementApi[] | [];
    entity: ViewStatementForm | {};
    params: GetParams;
    status: 'pending' | 'error' | 'success' | 'idle';
}

// Api Error
const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue: (reasaon: string) => void) => {
    dispatch(ViewStatementSlice.actions.handleStatus('error'))
    toast.error(error?.response ? error.response.data.message : "Something Went Wrong")
    return rejectWithValue(error.response.data.message || "Something Went Wrong")
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState
    dispatch: Dispatch<any>
}>()

// ** Fetch One
export const fetchOneAction = createAppAsyncThunk(
    'viewStatement/fetchOne',
    async ({ id }: { id: string }, { getState, dispatch, rejectWithValue }) => {
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

// ** Fetch All
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

    dispatch(
      ViewStatementSlice.actions.handleStatus('pending')
    )

    try {

      const response = await viewStatementService.getAll({
        accountNo: accountNumber,
        fromDate,
        toDate
      })

      dispatch(
        ViewStatementSlice.actions.handleStatus('success')
      )

      return response.data

    } catch (error: any) {

      return ApiError(
        error,
        dispatch,
        rejectWithValue
      )
    }
  }
)

// ** Add
export const addAction = createAppAsyncThunk(
    'viewStatement/add',
    async ({ data }: { data: ViewStatementForm }, { getState, dispatch, rejectWithValue }) => {
        dispatch(ViewStatementSlice.actions.handleStatus('pending'))
        try {
            const response = await viewStatementService.add(data as any);
            const query = getState().dashboard.params.query;
            // dispatch(fetchAllAction({ query }))
            toast.success("Added succesfully!")
            dispatch(ViewStatementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

// ** Update
export const updateAction = createAppAsyncThunk(
    'viewStatement/update',
    async ({ id, data }: { id: string, data: ViewStatementForm }, { getState, dispatch, rejectWithValue }) => {
        dispatch(ViewStatementSlice.actions.handleStatus('pending'))
        try {
            const response = await viewStatementService.update(id, data as any);
            const query = getState().dashboard.params.query;
            // dispatch(fetchAllAction({ query }))
            toast.success("updated succesfully!")
            dispatch(ViewStatementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

// ** Delete
export const deleteAction = createAppAsyncThunk(
    'viewStatement/delete',
    async ({ id }: { id: string }, { getState, dispatch, rejectWithValue }) => {
        dispatch(ViewStatementSlice.actions.handleStatus('pending'))
        try {
            const response = await viewStatementService.delete(id);
            const query = getState().dashboard.params.query;
            // dispatch(fetchAllAction({ query }))
            toast.success("deleted succesfully!")
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
        entity: {},
        params: {},
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
            state.entities = action.payload;
            // state.entities = data || [];
            // state.params.pagination = data?.pagination
        })
        builder.addCase(fetchOneAction.fulfilled, (state, action) => {
            const { data } = action.payload;
            state.entity = data;
        })
    }
})

export default ViewStatementSlice.reducer
