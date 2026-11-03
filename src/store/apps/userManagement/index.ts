import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState, } from 'src/store'
import toast from 'react-hot-toast'
import { UserManagementService } from 'src/services'
import { GetParams } from 'src/types/api'
import { UserManagementForm, UserManagementApi, IUserProfileDTO, IUserDTO, IUserParty, IUserRole } from 'src/types/apps/userManagement'

export interface UserPartyInfo {
    alreadyExist: boolean
    partyId: string
    partyName: string
    partyStatus: string
    statusReason: string
}

interface InitialState {
    entities: UserManagementApi[] | [];
    roleEntities: UserManagementApi[] | [];
    entity: UserManagementApi | {
        userProfileDTO: IUserProfileDTO
        userDTO: IUserDTO
        userParties: [IUserParty]
        userRoles: [IUserRole]
    };
    party: UserPartyInfo | null;
    params: GetParams;
    status: 'pending' | 'error' | 'success' | 'idle';
}

const unwrapList = (payload: any) =>
    Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []

const unwrapEntity = (payload: any) =>
    payload && !payload.userDTO && payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)
        ? payload.data
        : payload

const unwrapParty = (payload: any) =>
    payload && payload.partyId === undefined && payload.data && typeof payload.data === 'object'
        ? payload.data
        : payload

// API ka message ho to wo, warna fallback
const apiMessage = (res: any, fallback: string): string => {
    const m = typeof res === 'string' ? res : res?.message

    return typeof m === 'string' && m.trim() ? m : fallback
}

const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue: (reason: string) => void) => {
    const raw = error?.response?.data?.message || error?.message || 'Something Went Wrong'
    const message = typeof raw === 'string' ? raw : 'Something Went Wrong'

    dispatch(UserManagementSlice.actions.handleStatus('error'))
    toast.error(message)

    return rejectWithValue(message)
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState
    dispatch: Dispatch<any>
}>()

export const searchPartyAction = createAppAsyncThunk(
    'userManagement/searchParty',
    async (partyId: string, { dispatch, rejectWithValue }) => {
        dispatch(UserManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await UserManagementService.searchParty(partyId);
            dispatch(UserManagementSlice.actions.handleStatus('success'))
            return unwrapParty(response.data) as UserPartyInfo;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

export const fetchOneAction = createAppAsyncThunk(
    'userManagement/fetchOne',
    async (id: string, { dispatch, rejectWithValue }) => {
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

export const fetchOneActionForUsername = createAppAsyncThunk(
    'userManagement/fetchOneForUsername',
    async (username: string, { dispatch, rejectWithValue }) => {
        dispatch(UserManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await UserManagementService.checkUsernameAvailability(username);
            dispatch(UserManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

export const fetchAllAction = createAppAsyncThunk(
    'userManagement/fetchAll',
    async (data: UserManagementForm, { dispatch, rejectWithValue }) => {
        dispatch(UserManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await UserManagementService.getUsers(data);
            dispatch(UserManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

export const fetchAllActionForRoles = createAppAsyncThunk(
    'userManagement/fetchAllForRoles',
    async (id: String, { dispatch, rejectWithValue }) => {
        dispatch(UserManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await UserManagementService.getRolesById(id as string);
            dispatch(UserManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

export const addAction = createAppAsyncThunk(
    'userManagement/add',
    async ({ data }: { data: UserManagementForm }, { dispatch, rejectWithValue }) => {
        dispatch(UserManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await UserManagementService.add(data);
            toast.success(apiMessage(response.data, 'User created successfully.'))
            dispatch(UserManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

export const updateAction = createAppAsyncThunk(
    'userManagement/update',
    async ({ id, data }: { id: string, data: UserManagementForm }, { dispatch, rejectWithValue }) => {
        dispatch(UserManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await UserManagementService.update(id, data);
            toast.success(apiMessage(response.data, 'User updated successfully.'))
            dispatch(UserManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

export const updateStatusAction = createAppAsyncThunk(
    'userManagement/updateStatus',
    async ({ id, data }: { id: string, data: UserManagementForm }, { dispatch, rejectWithValue }) => {
        dispatch(UserManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await UserManagementService.updateStatus(id, data);
            toast.success(apiMessage(response.data, 'Updated successfully.'))
            dispatch(UserManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

export const updateUsernameAction = createAppAsyncThunk(
    'userManagement/updateUsername',
    async (id: string, { dispatch, rejectWithValue }) => {
        dispatch(UserManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await UserManagementService.updateUsername(id);
            toast.success(apiMessage(response.data, 'Username updated successfully.'))
            dispatch(UserManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

export const deleteAction = createAppAsyncThunk(
    'userManagement/delete',
    async ({ id }: { id: string }, { dispatch, rejectWithValue }) => {
        dispatch(UserManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await UserManagementService.delete(id);
            toast.success("deleted succesfully!")
            dispatch(UserManagementSlice.actions.handleStatus('success'))
            return response.data
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue)
        }
    }
)

export const clearAction = createAppAsyncThunk(
    'userManagement/clear',
    async ({ id }: { id: string }, { dispatch }) => {
        dispatch(UserManagementSlice.actions.handleClearAll('success'))
    }
)

export const UserManagementSlice = createSlice({
    name: 'userManagement',
    initialState: {
        entities: [],
        roleEntities: [],
        entity: {},
        party: null,
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
        handleClearAll: (state, action) => {
            // party yahan clear nahi hoti: add-user se review-user par jaate waqt chahiye
            state.entities = [];
            state.entity = {} as any;
        },
        clearParty: state => {
            state.party = null;
        }
    },
    extraReducers: builder => {
        builder.addCase(searchPartyAction.fulfilled, (state, action) => {
            state.party = (action.payload as UserPartyInfo) ?? null;
        })
        builder.addCase(fetchAllAction.fulfilled, (state, action) => {
            state.entities = unwrapList(action.payload);
        })
        builder.addCase(fetchAllActionForRoles.fulfilled, (state, action) => {
            const { data } = action.payload
            state.roleEntities = data.roles;
        })
        builder.addCase(fetchOneAction.fulfilled, (state, action) => {
            state.entity = unwrapEntity(action?.payload);
        })
        builder.addCase(updateStatusAction.fulfilled, (state, action) => {
            if (state.entity && (state.entity as any).userDTO) {
                const newValue =
                    action.payload?.isLocked ??
                    action.payload?.data?.isLocked ??
                    action.meta.arg.data.isLocked

                    ; (state.entity as any).userDTO.isLocked = newValue
            }
        })
    }
})

export const { clearParty } = UserManagementSlice.actions

export default UserManagementSlice.reducer