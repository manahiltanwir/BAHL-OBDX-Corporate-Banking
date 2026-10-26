import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState, } from 'src/store'
import toast from 'react-hot-toast'
import { UserManagementService } from 'src/services'
import { GetParams } from 'src/types/api'
import { UserManagementForm, UserManagementApi, IUserManagement, IUserProfileDTO, IUserDTO, IUserParty, IUserRole } from 'src/types/apps/userManagement'

// ** Party (user management ke andar search hoti hai)
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

const ApiError = (
    error: any,
    dispatch: AppDispatch,
    rejectWithValue: (reason: string) => void,
    showToast: boolean = true
) => {
    const raw = error?.response?.data?.message || error?.message || 'Something Went Wrong'
    const message = typeof raw === 'string' ? raw : 'Something Went Wrong'

    dispatch(UserManagementSlice.actions.handleStatus('error'))
    if (showToast) {
        toast.error(message)
    }

    return rejectWithValue(message)
}

const isPendingApprovalResponse = (res: any) => {
    const s = String(res?.status ?? res?.data?.status ?? '').toUpperCase()

    return s.includes('PENDING') || !!res?.workflowId || !!res?.data?.workflowId
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState
    dispatch: Dispatch<any>
}>()

// ** Search Party (GET /party-service/api/:partyId)
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

// ** Fetch One
export const fetchOneAction = createAppAsyncThunk(
    'userManagement/fetchOne',
    async (id: string, { getState, dispatch, rejectWithValue }) => {
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
    async (username: string, { getState, dispatch, rejectWithValue }) => {
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
    async (data: UserManagementForm, { getState, dispatch, rejectWithValue }) => {
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
    async (id: String, { getState, dispatch, rejectWithValue }) => {
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
            dispatch(UserManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue, false)
        }
    }
)

export const updateAction = createAppAsyncThunk(
    'userManagement/update',
    async ({ id, data }: { id: string, data: UserManagementForm }, { dispatch, rejectWithValue }) => {
        dispatch(UserManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await UserManagementService.update(id, data);
            dispatch(UserManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue, false)
        }
    }
)

export const updateStatusAction = createAppAsyncThunk(
    'userManagement/updateStatus',
    async ({ id, data }: { id: string, data: UserManagementForm }, { dispatch, rejectWithValue }) => {
        dispatch(UserManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await UserManagementService.updateStatus(id, data);
            dispatch(UserManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue, false)
        }
    }
)

export const updateUsernameAction = createAppAsyncThunk(
    'userManagement/updateUsername',
    async (id: string, { dispatch, rejectWithValue }) => {
        dispatch(UserManagementSlice.actions.handleStatus('pending'))
        try {
            const response = await UserManagementService.updateUsername(id);
            dispatch(UserManagementSlice.actions.handleStatus('success'))
            return response.data;
        } catch (error: any) {
            return ApiError(error, dispatch, rejectWithValue, false)
        }
    }
)

export const deleteAction = createAppAsyncThunk(
    'userManagement/delete',
    async ({ id }: { id: string }, { getState, dispatch, rejectWithValue }) => {
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
    async ({ id }: { id: string }, { getState, dispatch, rejectWithValue }) => {
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
            if (isPendingApprovalResponse(action.payload)) return

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