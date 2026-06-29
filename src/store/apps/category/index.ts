
// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState, } from 'src/store'

// ** Toast
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { CategoryService } from 'src/services'

// ** Types Imports
import { GetParams } from 'src/types/api'
import { CategoryApi, CategoryForm } from 'src/types/apps/category'

// ** Initial State Of Slice

interface InitialState {
    entities: CategoryApi[] | [];
    entity: CategoryApi | {};
    params: GetParams;
    status: 'pending' | 'error' | 'success' | 'idle';
}

// Api Error
const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue: (reasaon: string) => void) => {
    dispatch(CategorySlice.actions.handleStatus('error'))
    toast.error(error?.response ? error.response.data.message : "Something Went Wrong")
    return rejectWithValue(error.response.data.message || "Something Went Wrong")
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState
    dispatch: Dispatch<any>
}>()

// ** Fetch One
export const fetchOneAction = createAppAsyncThunk(
    'category/fetchOne',
    async ({ id }: { id: string }, { getState, dispatch, rejectWithValue }) => {
        dispatch(CategorySlice.actions.handleStatus('pending'))
        try {
            const response = await CategoryService.getById(id);
            dispatch(CategorySlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

// ** Fetch All
export const fetchAllAction = createAppAsyncThunk(
    'category/fetchAll',
    async (params: GetParams, { getState, dispatch, rejectWithValue }) => {
        dispatch(CategorySlice.actions.handleStatus('pending'))
        try {
            dispatch(CategorySlice.actions.handleQuery(params.query))
            const query = getState().category.params.query;
            // query && (query.limit = `${params.pagination?.limit}` || "10")
            // query && (query.page = `${params.pagination?.page}` || "1")
            // dispatch(CategorySlice.actions.handleQuery({ query }))
            const response = await CategoryService.getAll({ query });
            dispatch(CategorySlice.actions.handleStatus('success'))
            return response.data
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

// ** Add
export const addAction = createAppAsyncThunk(
    'category/add',
    async ({ data }: { data: CategoryForm }, { getState, dispatch, rejectWithValue }) => {
        dispatch(CategorySlice.actions.handleStatus('pending'))
        try {
            const response = await CategoryService.add(data);
            const query = getState().category.params.query;
            dispatch(fetchAllAction({ query }))
            toast.success("Added succesfully!")
            dispatch(CategorySlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

// ** Update
export const updateAction = createAppAsyncThunk(
    'category/update',
    async ({ id, data }: { id: string, data: CategoryForm }, { getState, dispatch, rejectWithValue }) => {
        dispatch(CategorySlice.actions.handleStatus('pending'))
        try {
            const response = await CategoryService.update(id, data);
            const query = getState().category.params.query;
            dispatch(fetchAllAction({ query }))
            toast.success("updated succesfully!")
            dispatch(CategorySlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

// ** Delete
export const deleteAction = createAppAsyncThunk(
    'category/delete',
    async ({ id }: { id: string }, { getState, dispatch, rejectWithValue }) => {
        dispatch(CategorySlice.actions.handleStatus('pending'))
        try {
            const response = await CategoryService.delete(id);
            const query = getState().category.params.query;
            dispatch(fetchAllAction({ query }))
            toast.success("deleted succesfully!")
            dispatch(CategorySlice.actions.handleStatus('success'))
            return response.data
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

export const CategorySlice = createSlice({
    name: 'category',
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
            state.entity = data.category;
        })
    }
})

export default CategorySlice.reducer
