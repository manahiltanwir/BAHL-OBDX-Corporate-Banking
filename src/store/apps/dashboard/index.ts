
// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState, } from 'src/store'

// ** Toast
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { DashboardService } from 'src/services'

// ** Types Imports
import { GetParams } from 'src/types/api'
import { DashboardApi, DashboardForm } from 'src/types/apps/dashboard'

// ** Initial State Of Slice

interface InitialState {
    entities: DashboardApi[] | [];
    entity: DashboardForm | {};
    params: GetParams;
    status: 'pending' | 'error' | 'success' | 'idle';
}

// Api Error
const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue: (reasaon: string) => void) => {
    dispatch(DashboardSlice.actions.handleStatus('error'))
    toast.error(error?.response ? error.response.data.message : "Something Went Wrong")
    return rejectWithValue(error.response.data.message || "Something Went Wrong")
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState
    dispatch: Dispatch<any>
}>()

// ** Fetch One
export const fetchOneAction = createAppAsyncThunk(
    'dashboard/fetchOne',
    async ({ id }: { id: string }, { getState, dispatch, rejectWithValue }) => {
        dispatch(DashboardSlice.actions.handleStatus('pending'))
        try {
            const response = await DashboardService.getById(id);
            dispatch(DashboardSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

// ** Fetch All
export const fetchAllAction = createAppAsyncThunk(
    'dashboard/fetchAll',
    async (params: GetParams, { getState, dispatch, rejectWithValue }) => {
        dispatch(DashboardSlice.actions.handleStatus('pending'))
        try {
            dispatch(DashboardSlice.actions.handleQuery(params.query))
            const query = getState().dashboard.params.query;
            // query && (query.limit = `${params.pagination?.limit}` || "10")
            // query && (query.page = `${params.pagination?.page}` || "1")
            // dispatch(DashboardSlice.actions.handleQuery({ query }))
            const response = await DashboardService.getAll({ query });
            dispatch(DashboardSlice.actions.handleStatus('success'))
            return response.data
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

// ** Add
export const addAction = createAppAsyncThunk(
    'dashboard/add',
    async ({ data }: { data: DashboardForm }, { getState, dispatch, rejectWithValue }) => {
        dispatch(DashboardSlice.actions.handleStatus('pending'))
        try {
            const response = await DashboardService.add(data);
            const query = getState().dashboard.params.query;
            dispatch(fetchAllAction({ query }))
            toast.success("Added succesfully!")
            dispatch(DashboardSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

// ** Update
export const updateAction = createAppAsyncThunk(
    'dashboard/update',
    async ({ id, data }: { id: string, data: DashboardForm }, { getState, dispatch, rejectWithValue }) => {
        dispatch(DashboardSlice.actions.handleStatus('pending'))
        try {
            const response = await DashboardService.update(id, data);
            const query = getState().dashboard.params.query;
            dispatch(fetchAllAction({ query }))
            toast.success("updated succesfully!")
            dispatch(DashboardSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

// ** Delete
export const deleteAction = createAppAsyncThunk(
    'dashboard/delete',
    async ({ id }: { id: string }, { getState, dispatch, rejectWithValue }) => {
        dispatch(DashboardSlice.actions.handleStatus('pending'))
        try {
            const response = await DashboardService.delete(id);
            const query = getState().dashboard.params.query;
            dispatch(fetchAllAction({ query }))
            toast.success("deleted succesfully!")
            dispatch(DashboardSlice.actions.handleStatus('success'))
            return response.data
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

export const DashboardSlice = createSlice({
    name: 'dashboard',
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
            const { data } = action.payload;
            state.entities = data?.entities || [];
            state.params.pagination = data?.pagination
        })
        builder.addCase(fetchOneAction.fulfilled, (state, action) => {
            const { data } = action.payload;
            state.entity = data.dashboard;
        })
    }
})

export default DashboardSlice.reducer
