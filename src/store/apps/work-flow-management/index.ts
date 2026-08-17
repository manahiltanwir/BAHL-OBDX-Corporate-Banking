import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/store'
import toast from 'react-hot-toast'
import { Workflowmangement } from 'src/services'
import {
  WorkflowPartyUserItem,
  WorkflowPartyInfo,
  WorkflowUserOption,
  WorkflowRecordApi
} from 'src/types/apps/workFlowManagement'


const toUserOption = (item: WorkflowPartyUserItem): WorkflowUserOption => {
  const { userDTO, userProfileDTO, userRoles, userParties } = item
  const userId = userDTO?.userId ?? userProfileDTO.userId
  const fullName = [userProfileDTO.firstName, userProfileDTO.lastName].filter(Boolean).join(' ')
  const roleLabel = userRoles && userRoles.length > 0 ? userRoles.map(role => role.roleName).join(', ') : 'No Role'

  return {
    id: userId,
    userId,
    partyId: userParties?.[0]?.partyId ?? '',
    label: `${fullName} — ${roleLabel}`
  }
}

const toPartyInfo = (items: WorkflowPartyUserItem[]): WorkflowPartyInfo | null => {
  const party = items[0]?.userParties?.[0]

  if (!party) return null

  return { partyId: party.partyId, partyName: party.partyName }
}

type AsyncStatus = 'idle' | 'pending' | 'success' | 'error'

interface InitialState {
  partyInfo: WorkflowPartyInfo | null
  userOptions: WorkflowUserOption[]
  status: 'pending' | 'error' | 'success' | 'idle'

  workflowList: WorkflowRecordApi[]
  workflowListStatus: AsyncStatus

  editWorkflow: WorkflowRecordApi | null
  editWorkflowStatus: AsyncStatus
}

const initialState: InitialState = {
  partyInfo: null,
  userOptions: [],
  status: 'idle',
  workflowList: [],
  workflowListStatus: 'idle',
  editWorkflow: null,
  editWorkflowStatus: 'idle'
}

const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue: (reason: string) => void) => {
  dispatch(WorkflowPartySearchSlice.actions.handleStatus('error'))
  toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')
  return rejectWithValue(error.response?.data?.message || 'Something Went Wrong')
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

export const searchWorkflowPartyUsersAction = createAppAsyncThunk(
  'workflowPartySearch/searchPartyUsers',
  async ({ partyId }: { partyId: string }, { dispatch, rejectWithValue }) => {
    dispatch(WorkflowPartySearchSlice.actions.handleStatus('pending'))
    try {
      const response = await Workflowmangement.searchPartyUsers(partyId)
      dispatch(WorkflowPartySearchSlice.actions.handleStatus('success'))

      const raw = response.data
      return Array.isArray(raw) ? raw : raw?.data ?? []
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)
export const createWorkflowAction = createAppAsyncThunk(
  'workflowPartySearch/createWorkflow',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await Workflowmangement.createWorkflow(payload)
      toast.success('Workflow created successfully')
      return response.data
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')
      return rejectWithValue(error.response?.data?.message || 'Something Went Wrong')
    }
  }
)

export const updateWorkflowAction = createAppAsyncThunk(
  'workflowPartySearch/updateWorkflow',
  async ({ id, payload }: { id: string | number; payload: any }, { rejectWithValue }) => {
    try {
      const response = await Workflowmangement.updateWorkflow(id, payload)
      toast.success('Workflow updated successfully')
      return response.data
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')
      return rejectWithValue(error.response?.data?.message || 'Something Went Wrong')
    }
  }
)

export const searchWorkflowsByPartyAction = createAppAsyncThunk(
  'workflowPartySearch/searchWorkflowsByParty',
  async ({ partyId }: { partyId: string }, { rejectWithValue }) => {
    try {
      const response = await Workflowmangement.searchWorkflowsByParty(partyId)
      const raw = response.data

      return (Array.isArray(raw) ? raw : raw?.data ?? []) as WorkflowRecordApi[]
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')
      return rejectWithValue(error.response?.data?.message || 'Something Went Wrong')
    }
  }
)

export const getWorkflowByIdAction = createAppAsyncThunk(
  'workflowPartySearch/getWorkflowById',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await Workflowmangement.getWorkflowById(id)

      return response.data as WorkflowRecordApi
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')
      return rejectWithValue(error.response?.data?.message || 'Something Went Wrong')
    }
  }
)

export const WorkflowPartySearchSlice = createSlice({
  name: 'workflowPartySearch',
  initialState,
  reducers: {
    handleStatus: (state, action) => {
      state.status = action.payload
    },
    resetWorkflowPartySearch: state => {
      state.partyInfo = null
      state.userOptions = []
      state.status = 'idle'
    },
    resetEditWorkflow: state => {
      state.editWorkflow = null
      state.editWorkflowStatus = 'idle'
    }
  },
  extraReducers: builder => {
    builder
      .addCase(searchWorkflowPartyUsersAction.fulfilled, (state, action) => {
        const items = (action.payload || []) as WorkflowPartyUserItem[]
        state.partyInfo = toPartyInfo(items)
        state.userOptions = items.map(toUserOption)
      })

      .addCase(searchWorkflowsByPartyAction.pending, state => {
        state.workflowListStatus = 'pending'
      })
      .addCase(searchWorkflowsByPartyAction.fulfilled, (state, action) => {
        state.workflowList = action.payload
        state.workflowListStatus = 'success'
      })
      .addCase(searchWorkflowsByPartyAction.rejected, state => {
        state.workflowList = []
        state.workflowListStatus = 'error'
      })

      .addCase(getWorkflowByIdAction.pending, state => {
        state.editWorkflowStatus = 'pending'
      })
      .addCase(getWorkflowByIdAction.fulfilled, (state, action) => {
        state.editWorkflow = action.payload
        state.editWorkflowStatus = 'success'
      })
      .addCase(getWorkflowByIdAction.rejected, state => {
        state.editWorkflowStatus = 'error'
      })
  }
})

export const { resetWorkflowPartySearch, resetEditWorkflow } = WorkflowPartySearchSlice.actions

export default WorkflowPartySearchSlice.reducer