import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/store'
import toast from 'react-hot-toast'
import { AdminWorkflowManagement } from 'src/services'
import {
  AdminWorkflowPartyUserItem,
  AdminWorkflowPartyInfo,
  AdminWorkflowUserOption,
  AdminWorkflowRecordApi
} from 'src/types/apps/adminWorkflowManagement'

const toUserOption = (item: AdminWorkflowPartyUserItem): AdminWorkflowUserOption => {
  const userId = item.userDTO?.userId ?? item.userProfileDTO?.userId
  const username = item.userDTO?.username ?? userId

  return { id: userId, userId, label: username }
}

const toPartyInfo = (items: AdminWorkflowPartyUserItem[]): AdminWorkflowPartyInfo | null => {
  const party = items[0]?.userParties?.[0]

  if (!party) return null

  return { partyId: party.partyId, partyName: party.partyName }
}

// API array de, {data: []} de, ya ek single object de, teeno handle hote hain
const toArray = <T,>(raw: any): T[] => {
  if (Array.isArray(raw)) return raw
  if (Array.isArray(raw?.data)) return raw.data
  if (raw?.data && typeof raw.data === 'object') return [raw.data]
  if (raw && typeof raw === 'object' && raw.id !== undefined) return [raw]

  return []
}

type AsyncStatus = 'idle' | 'pending' | 'success' | 'error'

interface InitialState {
  partyInfo: AdminWorkflowPartyInfo | null
  userOptions: AdminWorkflowUserOption[]
  status: AsyncStatus
  usersStatus: AsyncStatus

  workflowList: AdminWorkflowRecordApi[]
  workflowListStatus: AsyncStatus

  editWorkflow: AdminWorkflowRecordApi | null
  editWorkflowStatus: AsyncStatus
}

const initialState: InitialState = {
  partyInfo: null,
  userOptions: [],
  status: 'idle',
  usersStatus: 'idle',
  workflowList: [],
  workflowListStatus: 'idle',
  editWorkflow: null,
  editWorkflowStatus: 'idle'
}

const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue: (reason: string) => void) => {
  dispatch(AdminWorkflowManagementSlice.actions.handleStatus('error'))
  toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')

  return rejectWithValue(error.response?.data?.message || 'Something Went Wrong')
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

export const searchAdminWorkflowPartyUsersAction = createAppAsyncThunk(
  'adminWorkflowManagement/searchPartyUsers',
  async ({ partyId }: { partyId: string }, { dispatch, rejectWithValue }) => {
    dispatch(AdminWorkflowManagementSlice.actions.handleStatus('pending'))
    try {
      const response = await AdminWorkflowManagement.searchPartyUsers(partyId)
      dispatch(AdminWorkflowManagementSlice.actions.handleStatus('success'))

      return toArray<AdminWorkflowPartyUserItem>(response.data)
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const fetchAdminUsersAction = createAppAsyncThunk(
  'adminWorkflowManagement/fetchAdminUsers',
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await AdminWorkflowManagement.getAdminUsers()

      return toArray<AdminWorkflowPartyUserItem>(response.data)
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')

      return rejectWithValue(error.response?.data?.message || 'Something Went Wrong')
    }
  }
)

export const createAdminWorkflowAction = createAppAsyncThunk(
  'adminWorkflowManagement/createWorkflow',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await AdminWorkflowManagement.createWorkflow(payload)
      toast.success('Workflow created successfully')

      return response.data
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')

      return rejectWithValue(error.response?.data?.message || 'Something Went Wrong')
    }
  }
)

export const updateAdminWorkflowAction = createAppAsyncThunk(
  'adminWorkflowManagement/updateWorkflow',
  async ({ id, payload }: { id: string | number; payload: any }, { rejectWithValue }) => {
    try {
      const response = await AdminWorkflowManagement.updateWorkflow(id, payload)
      toast.success('Workflow updated successfully')

      return response.data
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')

      return rejectWithValue(error.response?.data?.message || 'Something Went Wrong')
    }
  }
)

export const searchAdminWorkflowsByCodeAction = createAppAsyncThunk(
  'adminWorkflowManagement/searchWorkflowsByCode',
  async ({ workflowCode }: { workflowCode: string }, { rejectWithValue }) => {
    try {
      const response = await AdminWorkflowManagement.searchWorkflowsByCode(workflowCode)

      return toArray<AdminWorkflowRecordApi>(response.data)
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')

      return rejectWithValue(error.response?.data?.message || 'Something Went Wrong')
    }
  }
)

export const getAdminWorkflowByIdAction = createAppAsyncThunk(
  'adminWorkflowManagement/getWorkflowById',
  async (id: string | number, { rejectWithValue }) => {
    try {
      debugger
      const response = await AdminWorkflowManagement.getWorkflowById(id)

      return response.data as AdminWorkflowRecordApi
    } catch (error: any) {
      debugger
      toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')

      return rejectWithValue(error.response?.data?.message || 'Something Went Wrong')
    }
  }
)

export const AdminWorkflowManagementSlice = createSlice({
  name: 'adminWorkflowManagement',
  initialState,
  reducers: {
    handleStatus: (state, action) => {
      state.status = action.payload
    },
    resetAdminWorkflowPartySearch: state => {
      state.partyInfo = null
      state.userOptions = []
      state.status = 'idle'
    },
    resetAdminEditWorkflow: state => {
      state.editWorkflow = null
      state.editWorkflowStatus = 'idle'
    }
  },
  extraReducers: builder => {
    builder
      .addCase(searchAdminWorkflowPartyUsersAction.fulfilled, (state, action) => {
        const items = (action.payload || []) as AdminWorkflowPartyUserItem[]
        state.partyInfo = toPartyInfo(items)
        state.userOptions = items.map(toUserOption)
      })

      .addCase(fetchAdminUsersAction.pending, state => {
        state.usersStatus = 'pending'
      })
      .addCase(fetchAdminUsersAction.fulfilled, (state, action) => {
        const items = (action.payload || []) as AdminWorkflowPartyUserItem[]

        state.userOptions = items
          .filter(item => item.userDTO?.userId || item.userProfileDTO?.userId)
          .map(toUserOption)
        state.usersStatus = 'success'
      })
      .addCase(fetchAdminUsersAction.rejected, state => {
        state.userOptions = []
        state.usersStatus = 'error'
      })

      .addCase(searchAdminWorkflowsByCodeAction.pending, state => {
        state.workflowListStatus = 'pending'
      })
      .addCase(searchAdminWorkflowsByCodeAction.fulfilled, (state, action) => {
        state.workflowList = action.payload
        state.workflowListStatus = 'success'
      })
      .addCase(searchAdminWorkflowsByCodeAction.rejected, state => {
        state.workflowList = []
        state.workflowListStatus = 'error'
      })

      .addCase(getAdminWorkflowByIdAction.pending, state => {
        state.editWorkflowStatus = 'pending'
      })
      .addCase(getAdminWorkflowByIdAction.fulfilled, (state, { payload }) => {
        // @ts-ignore
        state.editWorkflow = payload.data
        state.editWorkflowStatus = 'success'
      })
      .addCase(getAdminWorkflowByIdAction.rejected, state => {
        debugger
        state.editWorkflowStatus = 'error'
      })
  }
})

export const { resetAdminWorkflowPartySearch, resetAdminEditWorkflow } = AdminWorkflowManagementSlice.actions

export default AdminWorkflowManagementSlice.reducer