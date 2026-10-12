import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { RootState } from 'src/store'
import toast from 'react-hot-toast'
import { BackofficeWorkflowManagement } from 'src/services'
import {
  BackofficeWorkflowUserItem,
  BackofficeWorkflowUserOption,
  BackofficeWorkflowRecordApi
} from 'src/types/apps/backofficeWorkflowManagement'

const toUserOption = (item: BackofficeWorkflowUserItem): BackofficeWorkflowUserOption => {
  const userId = item.userDTO?.userId ?? item.userProfileDTO?.userId
  const username = item.userDTO?.username ?? userId

  return { id: userId, userId, label: username }
}

const toArray = <T,>(raw: any): T[] => {
  if (Array.isArray(raw)) return raw
  if (Array.isArray(raw?.content)) return raw.content
  if (Array.isArray(raw?.data)) return raw.data
  if (raw?.data && typeof raw.data === 'object') return [raw.data]
  if (raw && typeof raw === 'object' && raw.id !== undefined) return [raw]

  return []
}

type AsyncStatus = 'idle' | 'pending' | 'success' | 'error'

interface InitialState {
  userOptions: BackofficeWorkflowUserOption[]
  usersStatus: AsyncStatus

  workflowList: BackofficeWorkflowRecordApi[]
  workflowListStatus: AsyncStatus

  editWorkflow: BackofficeWorkflowRecordApi | null
  editWorkflowStatus: AsyncStatus
}

const initialState: InitialState = {
  userOptions: [],
  usersStatus: 'idle',
  workflowList: [],
  workflowListStatus: 'idle',
  editWorkflow: null,
  editWorkflowStatus: 'idle'
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

const errorMessage = (error: any) => error?.response?.data?.message || 'Something Went Wrong'

export const fetchBackofficeUsersAction = createAppAsyncThunk(
  'backofficeWorkflowManagement/fetchBackofficeUsers',
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await BackofficeWorkflowManagement.getBackofficeUsers()

      return toArray<BackofficeWorkflowUserItem>(response.data)
    } catch (error: any) {
      toast.error(errorMessage(error))

      return rejectWithValue(errorMessage(error))
    }
  }
)

export const createBackofficeWorkflowAction = createAppAsyncThunk(
  'backofficeWorkflowManagement/createWorkflow',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await BackofficeWorkflowManagement.createWorkflow(payload)
      toast.success('Workflow created successfully')

      return response.data
    } catch (error: any) {
      toast.error(errorMessage(error))

      return rejectWithValue(errorMessage(error))
    }
  }
)

export const updateBackofficeWorkflowAction = createAppAsyncThunk(
  'backofficeWorkflowManagement/updateWorkflow',
  async ({ id, payload }: { id: string | number; payload: any }, { rejectWithValue }) => {
    try {
      const response = await BackofficeWorkflowManagement.updateWorkflow(id, payload)
      toast.success('Workflow updated successfully')

      return response.data
    } catch (error: any) {
      toast.error(errorMessage(error))

      return rejectWithValue(errorMessage(error))
    }
  }
)

export const searchBackofficeWorkflowsByCodeAction = createAppAsyncThunk(
  'backofficeWorkflowManagement/searchWorkflowsByCode',
  async ({ workflowCode }: { workflowCode?: string }, { rejectWithValue }) => {
    try {
      const code = workflowCode?.trim()

      // code likha hai to specific search, warna all records
      const response = code
        ? await BackofficeWorkflowManagement.searchWorkflowsByCode(code)
        : await BackofficeWorkflowManagement.getAllWorkflows()

      return toArray<BackofficeWorkflowRecordApi>(response.data)
    } catch (error: any) {
      toast.error(errorMessage(error))

      return rejectWithValue(errorMessage(error))
    }
  }
)

export const getBackofficeWorkflowByIdAction = createAppAsyncThunk(
  'backofficeWorkflowManagement/getWorkflowById',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await BackofficeWorkflowManagement.getWorkflowById(id)
      const raw = response.data

      // API {data: {...}} de ya seedha object, dono chalenge
      return (raw?.data ?? raw) as BackofficeWorkflowRecordApi
    } catch (error: any) {
      toast.error(errorMessage(error))

      return rejectWithValue(errorMessage(error))
    }
  }
)

export const BackofficeWorkflowManagementSlice = createSlice({
  name: 'backofficeWorkflowManagement',
  initialState,
  reducers: {
    resetBackofficeEditWorkflow: state => {
      state.editWorkflow = null
      state.editWorkflowStatus = 'idle'
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBackofficeUsersAction.pending, state => {
        state.usersStatus = 'pending'
      })
      .addCase(fetchBackofficeUsersAction.fulfilled, (state, action) => {
        const items = (action.payload || []) as BackofficeWorkflowUserItem[]

        state.userOptions = items
          .filter(item => item.userDTO?.userId || item.userProfileDTO?.userId)
          .map(toUserOption)
        state.usersStatus = 'success'
      })
      .addCase(fetchBackofficeUsersAction.rejected, state => {
        state.userOptions = []
        state.usersStatus = 'error'
      })

      .addCase(searchBackofficeWorkflowsByCodeAction.pending, state => {
        state.workflowListStatus = 'pending'
      })
      .addCase(searchBackofficeWorkflowsByCodeAction.fulfilled, (state, action) => {
        state.workflowList = action.payload
        state.workflowListStatus = 'success'
      })
      .addCase(searchBackofficeWorkflowsByCodeAction.rejected, state => {
        state.workflowList = []
        state.workflowListStatus = 'error'
      })

      .addCase(getBackofficeWorkflowByIdAction.pending, state => {
        state.editWorkflowStatus = 'pending'
      })
      .addCase(getBackofficeWorkflowByIdAction.fulfilled, (state, action) => {
        state.editWorkflow = action.payload
        state.editWorkflowStatus = 'success'
      })
      .addCase(getBackofficeWorkflowByIdAction.rejected, state => {
        state.editWorkflowStatus = 'error'
      })
  }
})

export const { resetBackofficeEditWorkflow } = BackofficeWorkflowManagementSlice.actions

export default BackofficeWorkflowManagementSlice.reducer