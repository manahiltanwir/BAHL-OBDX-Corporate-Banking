import { createAsyncThunk, createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/store'
import toast from 'react-hot-toast'
import { RoleTransactionMappingService } from 'src/services'
import {
  AllTasksResponse,
  EnterpriseRoleApi,
  RoleApi,
  TaskApi,
  TaskServiceRoleMappingResponse,
  CreateRolePayload,
  UpdateTaskServiceMappingPayload
} from 'src/types/apps/roleTransactionMapping'

interface InitialState {
  enterpriseRoles: EnterpriseRoleApi[]
  rolesByEnterpriseRoleId: Record<number, RoleApi[]>
  tasksByEnterpriseRoleId: Record<number, TaskApi[]>
  tasks: TaskApi[]
  mappingByRoleId: Record<number, TaskServiceRoleMappingResponse>
  status: 'pending' | 'error' | 'success' | 'idle'
}

const initialState: InitialState = {
  enterpriseRoles: [],
  rolesByEnterpriseRoleId: {},
  tasksByEnterpriseRoleId: {},
  tasks: [],
  mappingByRoleId: {},
  status: 'idle'
}

const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue: (reason: string) => void) => {
  dispatch(RoleTransactionMappingSlice.actions.handleStatus('error'))
  toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')
  return rejectWithValue(error.response?.data?.message || 'Something Went Wrong')
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

// ** 1. GET /role-task-service/enterprise-role
export const fetchEnterpriseRolesAction = createAppAsyncThunk(
  'roleTransactionMapping/fetchEnterpriseRoles',
  async (_: void, { dispatch, rejectWithValue }) => {
    dispatch(RoleTransactionMappingSlice.actions.handleStatus('pending'))
    try {
      const response = await RoleTransactionMappingService.getEnterpriseRoles()
      dispatch(RoleTransactionMappingSlice.actions.handleStatus('success'))
      return response.data as EnterpriseRoleApi[]
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** 2. GET /role-task-service/roles/enterprise-role/:enterpriseRoleId
export const fetchRolesByEnterpriseRoleAction = createAppAsyncThunk(
  'roleTransactionMapping/fetchRolesByEnterpriseRole',
  async ({ enterpriseRoleId }: { enterpriseRoleId: number }, { dispatch, rejectWithValue }) => {
    dispatch(RoleTransactionMappingSlice.actions.handleStatus('pending'))
    try {
      const response = await RoleTransactionMappingService.getRolesByEnterpriseRole(enterpriseRoleId)
      dispatch(RoleTransactionMappingSlice.actions.handleStatus('success'))
      return { enterpriseRoleId, roles: (response.data?.roles ?? []) as RoleApi[] }
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** 3. POST /role-task-service/roles
export const createRoleAction = createAppAsyncThunk(
  'roleTransactionMapping/createRole',
  async ({ data }: { data: CreateRolePayload }, { dispatch, rejectWithValue }) => {
    dispatch(RoleTransactionMappingSlice.actions.handleStatus('pending'))
    try {
      const response = await RoleTransactionMappingService.createRole(data)
      toast.success('Role created successfully!')
      dispatch(RoleTransactionMappingSlice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** 4. GET /role-task-service/tasks/enterprise-role/:enterpriseRoleId
// NOTE: no longer dispatched by the hook — kept only so nothing that imports it breaks.
export const fetchTasksByEnterpriseRoleAction = createAppAsyncThunk(
  'roleTransactionMapping/fetchTasksByEnterpriseRole',
  async ({ enterpriseRoleId }: { enterpriseRoleId: number }, { dispatch, rejectWithValue }) => {
    dispatch(RoleTransactionMappingSlice.actions.handleStatus('pending'))
    try {
      const response = await RoleTransactionMappingService.getTasksByEnterpriseRole(enterpriseRoleId)
      dispatch(RoleTransactionMappingSlice.actions.handleStatus('success'))
      return { enterpriseRoleId, tasks: (response.data?.tasks ?? []) as TaskApi[] }
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** 5. GET /role-task-service/task-service-role-mapping/:roleId
export const fetchTaskServiceMappingAction = createAppAsyncThunk(
  'roleTransactionMapping/fetchTaskServiceMapping',
  async ({ roleId }: { roleId: number }, { dispatch, rejectWithValue }) => {
    dispatch(RoleTransactionMappingSlice.actions.handleStatus('pending'))
    try {
      const response = await RoleTransactionMappingService.getTaskServiceMappingByRole(roleId)
      dispatch(RoleTransactionMappingSlice.actions.handleStatus('success'))
      return { roleId, mapping: response.data as TaskServiceRoleMappingResponse }
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** 6. POST /role-task-service/task-service-role-mapping
export const updateTaskServiceMappingAction = createAppAsyncThunk(
  'roleTransactionMapping/updateTaskServiceMapping',
  async ({ data }: { data: UpdateTaskServiceMappingPayload }, { dispatch, rejectWithValue }) => {
    dispatch(RoleTransactionMappingSlice.actions.handleStatus('pending'))
    try {
      const response = await RoleTransactionMappingService.updateTaskServiceMapping(data)
      const actionType = data.services[0]?.actionType
      toast.success(actionType === 'unmap' ? 'Services unmapped successfully!' : 'Services mapped successfully!')
      dispatch(RoleTransactionMappingSlice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// ** 7. GET /role-task-service/tasks  (fetched once, like enterprise roles)
export const fetchAllTasksAction = createAppAsyncThunk(
  'roleTransactionMapping/fetchAllTasks',
  async (_: void, { dispatch, rejectWithValue }) => {
    dispatch(RoleTransactionMappingSlice.actions.handleStatus('pending'))
    try {
      const response = await RoleTransactionMappingService.getAllTasks()
      dispatch(RoleTransactionMappingSlice.actions.handleStatus('success'))
      return ((response.data as AllTasksResponse)?.tasks ?? []) as TaskApi[]
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const RoleTransactionMappingSlice = createSlice({
  name: 'roleTransactionMapping',
  initialState,
  reducers: {
    handleStatus: (state, action) => {
      state.status = action.payload
    },
    clearRolesAndTasksForEnterpriseRole: (state, action: PayloadAction<number>) => {
      delete state.rolesByEnterpriseRoleId[action.payload]
      delete state.tasksByEnterpriseRoleId[action.payload]
    },
    clearMappingForRole: (state, action: PayloadAction<number>) => {
      delete state.mappingByRoleId[action.payload]
    },
    resetRoleTransactionMapping: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchEnterpriseRolesAction.fulfilled, (state, action) => {
      state.enterpriseRoles = (action.payload as EnterpriseRoleApi[]) || []
    })
    builder.addCase(fetchRolesByEnterpriseRoleAction.fulfilled, (state, action) => {
      const { enterpriseRoleId, roles } = action.payload as { enterpriseRoleId: number; roles: RoleApi[] }
      state.rolesByEnterpriseRoleId[enterpriseRoleId] = roles
    })
    builder.addCase(fetchTasksByEnterpriseRoleAction.fulfilled, (state, action) => {
      const { enterpriseRoleId, tasks } = action.payload as { enterpriseRoleId: number; tasks: TaskApi[] }
      state.tasksByEnterpriseRoleId[enterpriseRoleId] = tasks
    })
    builder.addCase(fetchTaskServiceMappingAction.fulfilled, (state, action) => {
      const { roleId, mapping } = action.payload as { roleId: number; mapping: TaskServiceRoleMappingResponse }
      state.mappingByRoleId[roleId] = mapping
    })
    builder.addCase(fetchAllTasksAction.fulfilled, (state, action) => {
      state.tasks = (action.payload as TaskApi[]) || []
    })
  }
})

export const { clearRolesAndTasksForEnterpriseRole, clearMappingForRole, resetRoleTransactionMapping } =
  RoleTransactionMappingSlice.actions

export default RoleTransactionMappingSlice.reducer