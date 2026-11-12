import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/store'
import toast from 'react-hot-toast'
import { PartyManagementService } from 'src/services'
import { GetParams } from 'src/types/api'
import { PartyManagementApi, PartyManagementForm } from 'src/types/apps/partyManagement'

interface InitialState {
    entities: PartyManagementApi[] | [];
    entity: PartyManagementForm;
    params: GetParams;
    status: 'pending' | 'error' | 'success' | 'idle';
    message: string | null;
}

const ApiError = (
    error: any,
    dispatch: AppDispatch,
    rejectWithValue: (reason: string) => any
) => {
    const msg: string = error?.response?.data?.message ?? error?.message ?? ''

    dispatch(PartyManagementSlice.actions.handleStatus('error'))
    dispatch(PartyManagementSlice.actions.setMessage(msg))
    if (msg) toast.error(msg)
    return rejectWithValue(msg)
}

const apiMessage = (res: any): string => {
    const m = typeof res === 'string' ? res : res?.message
    return typeof m === 'string' ? m : ''
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState
    dispatch: Dispatch<any>
}>()

export const fetchOneAction = createAppAsyncThunk(
    'partyManagement/fetchOne',
    async ({ id }: { id: string }, { dispatch, rejectWithValue }) => {
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

export const fetchAllAction = createAppAsyncThunk(
    'partyManagement/fetchAll',
    async (params: GetParams, { getState, dispatch, rejectWithValue }) => {
        dispatch(PartyManagementSlice.actions.handleStatus('pending'))
        try {
            dispatch(PartyManagementSlice.actions.handleQuery(params.query))
            const query = getState().partyManagement.params.query;
            const response = await PartyManagementService.getAll({ query });
            dispatch(PartyManagementSlice.actions.handleStatus('success'))
            return response.data
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

export const addAction = createAppAsyncThunk(
    'partyManagement/add',
    async ({ data }: { data: PartyManagementForm }, { getState, dispatch, rejectWithValue }) => {
        dispatch(PartyManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await PartyManagementService.add(data);
            const query = getState().partyManagement.params.query;
            dispatch(fetchAllAction({ query }))
            const msg = apiMessage(response.data)
            if (msg) toast.success(msg)
            dispatch(PartyManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

export const updateAction = createAppAsyncThunk(
    'partyManagement/update',
    async (
        { partyId, data, method = 'put' }: { partyId: string; data: PartyManagementForm | any; method?: 'put' | 'post' },
        { dispatch, rejectWithValue }
    ) => {
        dispatch(PartyManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await PartyManagementService.update(partyId, data, method)

            const msg = apiMessage(response.data)
            if (msg) toast.success(msg)

            dispatch(PartyManagementSlice.actions.handleStatus('success'))
            return response.data
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

export const deleteAction = createAppAsyncThunk(
    'partyManagement/delete',
    async ({ id }: { id: string }, { getState, dispatch, rejectWithValue }) => {
        dispatch(PartyManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await PartyManagementService.delete(id);
            const query = getState().partyManagement.params.query;
            dispatch(fetchAllAction({ query }))
            const msg = apiMessage(response.data)
            if (msg) toast.success(msg)
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
        status: 'idle',
        message: null
    } as InitialState,
    reducers: {
        handleStatus: (state, action) => {
            state.status = action.payload;
        },
        setMessage: (state, action) => {
            state.message = action.payload;
        },
        handleQuery: (state, action) => {
            const prev_query = state.params.query || {}
            state.params.query = { ...prev_query, ...action.payload };
        },
        clearEntity: (state) => {
            // @ts-ignore
            state.entity = {}
            state.message = null
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchAllAction.fulfilled, (state, action) => {
            const { data } = action.payload;
            state.entities = data?.entities || [];
            state.params.pagination = data?.pagination
        })

        builder.addCase(fetchOneAction.pending, (state) => {
            // @ts-ignore
            state.entity = {}
            state.message = null
        })
        builder.addCase(fetchOneAction.fulfilled, (state, action) => {
            state.entity = action.payload;
            state.message = action.payload?.message ?? null
        })
        builder.addCase(fetchOneAction.rejected, (state) => {
            // @ts-ignore
            state.entity = {}
        })
    }
})

export default PartyManagementSlice.reducer