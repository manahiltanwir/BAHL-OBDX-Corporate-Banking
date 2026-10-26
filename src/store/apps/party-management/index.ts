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
}

const ApiError = (
    error: any,
    dispatch: AppDispatch,
    rejectWithValue: (reasaon: string) => void,
    showToast: boolean = true
) => {
    dispatch(PartyManagementSlice.actions.handleStatus('error'))
    if (showToast) {
        toast.error(error?.response ? error.response.data.message : "Something Went Wrong")
    }
    return rejectWithValue(error?.response?.data?.message || "Something Went Wrong")
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
            toast.success("Added succesfully!")
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
            const response = await PartyManagementService.update(partyId, data, method);
            dispatch(PartyManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue, false)
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
            state.entity = action.payload;
        })
        builder.addCase(updateAction.fulfilled, (state, action) => {
            if (isPendingApprovalResponse(action.payload)) return

            state.entity = {
                ...state.entity,
                partyStatus: action.meta.arg.data.partyStatus,
                alreadyExist: true
            }
        })
    }
})

export default PartyManagementSlice.reducer