
// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState, } from 'src/store'

// ** Toast
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { PartyManagementService } from 'src/services'

// ** Types Imports
import { GetParams } from 'src/types/api'
import { PartyManagementApi, PartyManagementForm } from 'src/types/apps/partyManagement'

// ** Initial State Of Slice

interface InitialState {
    entities: PartyManagementApi[] | [];
    entity: PartyManagementForm;
    params: GetParams;
    status: 'pending' | 'error' | 'success' | 'idle';
}

// Api Error
const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue: (reasaon: string) => void) => {
    dispatch(PartyManagementSlice.actions.handleStatus('error'))
    toast.error(error?.response ? error.response.data.message : "Something Went Wrong")
    return rejectWithValue(error.response.data.message || "Something Went Wrong")
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState
    dispatch: Dispatch<any>
}>()

// ** Fetch One
export const fetchOneAction = createAppAsyncThunk(
    'partyManagement/fetchOne',
    async ({ id }: { id: string }, { getState, dispatch, rejectWithValue }) => {
        dispatch(PartyManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await PartyManagementService.getById(id);
            dispatch(PartyManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

// ** Fetch All
export const fetchAllAction = createAppAsyncThunk(
    'partyManagement/fetchAll',
    async (params: GetParams, { getState, dispatch, rejectWithValue }) => {
        dispatch(PartyManagementSlice.actions.handleStatus('pending'))
        try {
            dispatch(PartyManagementSlice.actions.handleQuery(params.query))
            const query = getState().partyManagement.params.query;
            // query && (query.limit = `${params.pagination?.limit}` || "10")
            // query && (query.page = `${params.pagination?.page}` || "1")
            // dispatch(PartyManagementSlice.actions.handleQuery({ query }))
            const response = await PartyManagementService.getAll({ query });
            dispatch(PartyManagementSlice.actions.handleStatus('success'))
            return response.data
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

// ** Add
export const addAction = createAppAsyncThunk(
    'partyManagement/add',
    async ({ data }: { data: PartyManagementForm }, { getState, dispatch, rejectWithValue }) => {
        dispatch(PartyManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await PartyManagementService.add(data);
            const query = getState().partyManagement.params.query;
            dispatch(fetchAllAction({ query }))
            toast.success("Added succesfully!")
            dispatch(PartyManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

// ** Update
export const updateAction = createAppAsyncThunk(
    'partyManagement/update',
    async ({ partyId, data }: { partyId: string, data: PartyManagementForm }, { getState, dispatch, rejectWithValue }) => {
        dispatch(PartyManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await PartyManagementService.update(partyId, data);
            const query = getState().partyManagement.params.query;
            // dispatch(fetchAllAction({ query }))
            toast.success("updated succesfully!")
            dispatch(PartyManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

// ** Delete
export const deleteAction = createAppAsyncThunk(
    'partyManagement/delete',
    async ({ id }: { id: string }, { getState, dispatch, rejectWithValue }) => {
        dispatch(PartyManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await PartyManagementService.delete(id);
            const query = getState().partyManagement.params.query;
            dispatch(fetchAllAction({ query }))
            toast.success("deleted succesfully!")
            dispatch(PartyManagementSlice.actions.handleStatus('success'))
            return response.data
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

export const clearEntityState = createAppAsyncThunk(
    'partyManagement/clear',
    async ({ id }: { id: string }, { dispatch }) => {
        dispatch(PartyManagementSlice.actions.clearEntity())
    }
)

export const PartyManagementSlice = createSlice({
    name: 'partyManagement',
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
        },
        clearEntity: (state) => {
            // @ts-ignore
            state.entity = {}
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchAllAction.fulfilled, (state, action) => {
            const { data } = action.payload;
            state.entities = data?.entities || [];
            state.params.pagination = data?.pagination
        })
        builder.addCase(fetchOneAction.fulfilled, (state, action) => {
            const { payload } = action;
            state.entity = payload;
        })
        builder.addCase(updateAction.fulfilled, (state, action) => {
            const { payload } = action;

            state.entity = payload;
        })
    }
})


export default PartyManagementSlice.reducer
