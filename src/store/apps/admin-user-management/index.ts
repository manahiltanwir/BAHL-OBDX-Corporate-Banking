// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/store'

// ** Toast
import toast from 'react-hot-toast'

// ** Service
import { AdminUserManagementService } from 'src/services'

// ** Types
import { GetParams } from 'src/types/api'
import { AdminUserManagementApi, AdminUserManagementForm } from 'src/types/apps/adminUserManagement'

interface InitialState {
  entities: AdminUserManagementApi[]
  roleEntities: any[]
  entity: Partial<AdminUserManagementApi>
  params: GetParams
  status: 'pending' | 'error' | 'success' | 'idle'
}

// Api Error
const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue: (reason: string) => void) => {
  const raw = error?.response?.data?.message || error?.message || 'Something Went Wrong'
  const message = typeof raw === 'string' ? raw : 'Something Went Wrong'

  dispatch(AdminUserManagementSlice.actions.handleStatus('error'))
  toast.error(message)

  return rejectWithValue(message)
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

// ** Fetch One (by userId)
export const fetchOneAction = createAppAsyncThunk(
  'adminUserManagement/fetchOne',
  async (id: string, { dispatch, rejectWithValue }) => {
    dispatch(AdminUserManagementSlice.actions.handleStatus('pending'))
    try {
      const response = await AdminUserManagementService.getById(id)
      dispatch(AdminUserManagementSlice.actions.handleStatus('success'))

      // Response { status, message, data } ho ya seedha entity, dono handle hain
      const body = response.data
      const unwrapped = body?.data ?? body

      return Array.isArray(unwrapped) ? unwrapped[0] : unwrapped
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** Check username availability
export const fetchOneActionForUsername = createAppAsyncThunk(
  'adminUserManagement/fetchOneForUsername',
  async (username: string, { dispatch, rejectWithValue }) => {
    dispatch(AdminUserManagementSlice.actions.handleStatus('pending'))
    try {
      const response = await AdminUserManagementService.checkUsernameAvailability(username)
      dispatch(AdminUserManagementSlice.actions.handleStatus('success'))

      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** Fetch All (search)
export const fetchAllAction = createAppAsyncThunk(
  'adminUserManagement/fetchAll',
  async (data: AdminUserManagementForm, { dispatch, rejectWithValue }) => {
    dispatch(AdminUserManagementSlice.actions.handleStatus('pending'))
    try {
      const response = await AdminUserManagementService.getUsers(data)
      dispatch(AdminUserManagementSlice.actions.handleStatus('success'))

      // API: { status, message, data: [ ... ] }  -> sirf array chahiye
      return (response.data?.data ?? []) as AdminUserManagementApi[]
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const fetchAllActionForRoles = createAppAsyncThunk(
  'adminUserManagement/fetchAllForRoles',
  async (id: String, { dispatch, rejectWithValue }) => {
    dispatch(AdminUserManagementSlice.actions.handleStatus('pending'))
    try {
      const response = await AdminUserManagementService.getRolesById(id as string)
      dispatch(AdminUserManagementSlice.actions.handleStatus('success'))

      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** Add
export const addAction = createAppAsyncThunk(
  'adminUserManagement/add',
  async ({ data }: { data: AdminUserManagementForm }, { dispatch, rejectWithValue }) => {
    dispatch(AdminUserManagementSlice.actions.handleStatus('pending'))
    try {
      const response = await AdminUserManagementService.add(data)
      toast.success('Added successfully!')
      dispatch(AdminUserManagementSlice.actions.handleStatus('success'))

      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** Update
export const updateAction = createAppAsyncThunk(
  'adminUserManagement/update',
  async ({ id, data }: { id: string; data: AdminUserManagementForm }, { dispatch, rejectWithValue }) => {
    dispatch(AdminUserManagementSlice.actions.handleStatus('pending'))
    try {
      const response = await AdminUserManagementService.update(id, data)
      toast.success('Updated successfully!')
      dispatch(AdminUserManagementSlice.actions.handleStatus('success'))

      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** Update Status (lock / unlock)
export const updateStatusAction = createAppAsyncThunk(
  'adminUserManagement/updateStatus',
  async ({ id, data }: { id: string; data: AdminUserManagementForm }, { dispatch, rejectWithValue }) => {
    dispatch(AdminUserManagementSlice.actions.handleStatus('pending'))
    try {
      const response = await AdminUserManagementService.updateStatus(id, data)
      toast.success('Updated successfully!')
      dispatch(AdminUserManagementSlice.actions.handleStatus('success'))

      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** Update User Name
export const updateUsernameAction = createAppAsyncThunk(
  'adminUserManagement/updateUsername',
  async (id: string, { dispatch, rejectWithValue }) => {
    dispatch(AdminUserManagementSlice.actions.handleStatus('pending'))
    try {
      const response = await AdminUserManagementService.updateUsername(id)
      toast.success('Updated successfully!')
      dispatch(AdminUserManagementSlice.actions.handleStatus('success'))

      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** Delete
export const deleteAction = createAppAsyncThunk(
  'adminUserManagement/delete',
  async ({ id }: { id: string }, { dispatch, rejectWithValue }) => {
    dispatch(AdminUserManagementSlice.actions.handleStatus('pending'))
    try {
      const response = await AdminUserManagementService.delete(id)
      toast.success('Deleted successfully!')
      dispatch(AdminUserManagementSlice.actions.handleStatus('success'))

      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** Clear All Data
export const clearAction = createAppAsyncThunk(
  'adminUserManagement/clear',
  async (_arg: { id: string }, { dispatch }) => {
    dispatch(AdminUserManagementSlice.actions.handleClearAll())
  }
)

export const AdminUserManagementSlice = createSlice({
  name: 'adminUserManagement',
  initialState: {
    entities: [],
    roleEntities: [],
    entity: {},
    params: {},
    status: 'idle'
  } as InitialState,
  reducers: {
    handleStatus: (state, action) => {
      state.status = action.payload
    },
    handleQuery: (state, action) => {
      const prev_query = state.params.query || {}
      state.params.query = { ...prev_query, ...action.payload }
    },
    handleClearAll: state => {
      state.entities = []
      state.entity = {}
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchAllAction.fulfilled, (state, action) => {
      state.entities = Array.isArray(action.payload) ? action.payload : []
    })
    builder.addCase(fetchAllActionForRoles.fulfilled, (state, action) => {
      const body: any = action.payload

      state.roleEntities = body?.data?.roles ?? body?.roles ?? (Array.isArray(body?.data) ? body.data : [])
    })
    builder.addCase(fetchOneAction.fulfilled, (state, action) => {
      state.entity = (action.payload as any) ?? {}
    })
    builder.addCase(updateStatusAction.fulfilled, (state, action) => {
      if (state.entity && (state.entity as any).userDTO) {
        const payload: any = action.payload
        const newValue = payload?.isLocked ?? payload?.data?.isLocked ?? action.meta.arg.data.isLocked
        ;(state.entity as any).userDTO.isLocked = newValue
      }
    })
  }
})

export default AdminUserManagementSlice.reducer