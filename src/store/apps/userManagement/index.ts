
// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState, } from 'src/store'

// ** Toast
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { UserManagementService } from 'src/services'

// ** Types Imports
import { GetParams } from 'src/types/api'
import { UserManagementForm,UserManagementApi } from 'src/types/apps/userManagement'

// ** Initial State Of Slice

interface InitialState {
    entities: UserManagementApi[] | [];
    entity: UserManagementApi | {};
    params: GetParams;
    status: 'pending' | 'error' | 'success' | 'idle';
}

import user_management from "src/json/user_management.json"

// Api Error
const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue: (reasaon: string) => void) => {
    dispatch(UserManagementSlice.actions.handleStatus('error'))
    toast.error(error?.response ? error.response.data.message : "Something Went Wrong")
    return rejectWithValue(error.response.data.message || "Something Went Wrong")
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState
    dispatch: Dispatch<any>
}>()

// ** Fetch One
export const fetchOneAction = createAppAsyncThunk(
    'userManagement/fetchOne',
    async ({ id }: { id: string }, { getState, dispatch, rejectWithValue }) => {
        dispatch(UserManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await UserManagementService.getById(id);
            dispatch(UserManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

// // ** Fetch All
// export const fetchAllAction = createAppAsyncThunk(
//     'userManagement/fetchAll',
//     async (params: GetParams, { getState, dispatch, rejectWithValue }) => {
//         dispatch(UserManagementSlice.actions.handleStatus('pending'))
//         try {
//             dispatch(UserManagementSlice.actions.handleQuery(params.query))
//             const query = getState().userManagement.params.query;
//             // query && (query.limit = `${params.pagination?.limit}` || "10")
//             // query && (query.page = `${params.pagination?.page}` || "1")
//             // dispatch(CategorySlice.actions.handleQuery({ query }))
//             const response = await UserManagementService.getAll({ query });
//             dispatch(UserManagementSlice.actions.handleStatus('success'))
//             return response.data
//         } catch (error: any) {
//             return ApiError(error, dispatch, rejectWithValue)
//         }
//     }
// )


export const fetchAllAction = createAppAsyncThunk(
    'userManagement/fetchAll',
    async (params: GetParams, { getState, dispatch, rejectWithValue }) => {
        dispatch(UserManagementSlice.actions.handleStatus('pending'))
        dispatch(UserManagementSlice.actions.handleStatus('success'))
        return user_management
        // try {
        //     dispatch(UserManagementSlice.actions.handleQuery(params.query))
        //     const query = getState().userManagement.params.query;
        //     // query && (query.limit = `${params.pagination?.limit}` || "10")
        //     // query && (query.page = `${params.pagination?.page}` || "1")
        //     // dispatch(CategorySlice.actions.handleQuery({ query }))
        //     const response = await UserManagementService.getAll({ query });
        //     dispatch(UserManagementSlice.actions.handleStatus('success'))
        //     return response.data
        // } catch (error: any) {
        //     return ApiError(error, dispatch, rejectWithValue)
        // }
    }
)

// ** Add
export const addAction = createAppAsyncThunk(
    'userManagement/add',
    async ({ data }: { data: UserManagementForm }, { getState, dispatch, rejectWithValue }) => {
        dispatch(UserManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await UserManagementService.add(data);
            const query = getState().userManagement.params.query;
            dispatch(fetchAllAction({ query }))
            toast.success("Added succesfully!")
            dispatch(UserManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

// ** Update
export const updateAction = createAppAsyncThunk(
    'userManagement/update',
    async ({ id, data }: { id: string, data: UserManagementForm }, { getState, dispatch, rejectWithValue }) => {
        dispatch(UserManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await UserManagementService.update(id, data);
            const query = getState().userManagement.params.query;
            dispatch(fetchAllAction({ query }))
            toast.success("updated succesfully!")
            dispatch(UserManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

// ** Delete
export const deleteAction = createAppAsyncThunk(
    'userManagement/delete',
    async ({ id }: { id: string }, { getState, dispatch, rejectWithValue }) => {
        dispatch(UserManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await UserManagementService.delete(id);
            const query = getState().userManagement.params.query;
            dispatch(fetchAllAction({ query }))
            toast.success("deleted succesfully!")
            dispatch(UserManagementSlice.actions.handleStatus('success'))
            return response.data
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

export const UserManagementSlice = createSlice({
    name: 'userManagement',
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
            console.log(action.payload);
            // state.entities = action.payload || [];
            
            
            // const { data } = action.payload;
            // state.entities = data?.entities || [];
            // state.params.pagination = data?.pagination
        })
        builder.addCase(fetchAllAction.rejected, (state, action) => {
            console.log('In Builder');
            
            // const { data } = action.payload;
            // state.entities = data?.entities || [];
            // state.params.pagination = data?.pagination
        })
        builder.addCase(fetchOneAction.fulfilled, (state, action) => {
            const { data } = action.payload;
            state.entity = data.userManagement;
        })
    }
})

export default UserManagementSlice.reducer
