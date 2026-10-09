import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { RootState } from 'src/store'
import { AdminRuleManagementService } from 'src/services'
import {
  RuleTask,
  RuleTransactionOption,
  RuleTaskCategory,
  RuleApiPayload,
  AdminRuleApiPayload,
  AdminRuleApiRecord,
  RuleWorkflowOption
} from 'src/types/apps/ruleManagement'

type AsyncStatus = 'idle' | 'pending' | 'success' | 'error'

type AdminRulePayload = RuleApiPayload | AdminRuleApiPayload

export interface AdminUserOption {
  id: string // userDTO.userId  -> payload mein contextId
  label: string // userDTO.username -> dropdown mein dikhega
}

const toTransactionOptions = (tasks: RuleTask[]): RuleTransactionOption[] =>
  tasks.flatMap(task =>
    (task.taskServices || []).map(service => ({
      id: service.operationCode,
      label: service.operationName,
      taskCode: task.taskCode,
      taskName: task.taskName
    }))
  )

// ** userDTO null wale records skip, baqi se userId + username
const toAdminUserOptions = (items: any[]): AdminUserOption[] =>
  items
    .filter(item => item?.userDTO?.userId)
    .map(item => ({
      id: item.userDTO.userId,
      label: item.userDTO.username
    }))

// ** Response array ho, {data: [...]} ho, ya single record, teeno handle
const toList = (raw: any): any[] => {
  const d = raw?.data ?? raw

  if (Array.isArray(d)) return d
  if (d && typeof d === 'object' && d.id !== undefined) return [d]

  return []
}

// ** workflowCode na ho (response ka shape alag ho) to ruleCode / id dikha do
const toWorkflowOption = (wf: any): RuleWorkflowOption => ({
  id: String(wf.id),
  label: wf.workflowCode ?? wf.ruleCode ?? String(wf.id)
})

interface InitialState {
  transactionOptions: RuleTransactionOption[]
  transactionsStatus: AsyncStatus
  userOptions: AdminUserOption[]
  usersStatus: AsyncStatus
  workflowOptions: RuleWorkflowOption[]
  workflowsStatus: AsyncStatus
  rules: AdminRuleApiRecord[]
  rulesStatus: AsyncStatus
  ruleDetail: AdminRuleApiRecord | null
  ruleDetailStatus: AsyncStatus
  createStatus: AsyncStatus
}

const initialState: InitialState = {
  transactionOptions: [],
  transactionsStatus: 'idle',
  userOptions: [],
  usersStatus: 'idle',
  workflowOptions: [],
  workflowsStatus: 'idle',
  rules: [],
  rulesStatus: 'idle',
  ruleDetail: null,
  ruleDetailStatus: 'idle',
  createStatus: 'idle'
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

export const fetchAdminTasksByCategoryAction = createAppAsyncThunk(
  'adminRuleManagement/fetchTasksByCategory',
  async (category: RuleTaskCategory, { rejectWithValue }) => {
    try {
      const response = await AdminRuleManagementService.getTasksByCategory(category)
      const tasks: RuleTask[] = Array.isArray(response.data) ? response.data : response.data?.data ?? []

      return tasks
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Failed to fetch transactions')

      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions')
    }
  }
)

export const fetchAdminUsersAction = createAppAsyncThunk(
  'adminRuleManagement/fetchUsers',
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await AdminRuleManagementService.getAdminUsers()

      return toList(response.data)
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Failed to fetch users')

      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users')
    }
  }
)

// ** Workflows (Approval Required = Yes par)
export const fetchAdminWorkflowsAction = createAppAsyncThunk(
  'adminRuleManagement/fetchWorkflows',
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await AdminRuleManagementService.getAdminWorkflows()

      return toList(response.data)
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Failed to fetch workflows')

      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workflows')
    }
  }
)

// ** BACKOFFICE_USER context (logged-in user) + global rules, dono merge karke
export const fetchAdminRulesAction = createAppAsyncThunk(
  'adminRuleManagement/fetchRules',
  async (userId: string, { rejectWithValue }) => {
    const [byUser, global] = await Promise.allSettled([
      AdminRuleManagementService.getAdminRulesByUser(userId),
      AdminRuleManagementService.getGlobalAdminRules()
    ])

    if (byUser.status === 'rejected' && global.status === 'rejected') {
      const error: any = byUser.reason
      toast.error(error?.response ? error.response.data.message : 'Failed to fetch rules')

      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch rules')
    }

    const merged = [
      ...(byUser.status === 'fulfilled' ? (toList(byUser.value.data) as AdminRuleApiRecord[]) : []),
      ...(global.status === 'fulfilled' ? (toList(global.value.data) as AdminRuleApiRecord[]) : [])
    ]

    // ** id ke hisaab se duplicate hata do
    return merged.filter((rule, i, arr) => arr.findIndex(r => r.id === rule.id) === i)
  }
)

export const fetchAdminRuleByIdAction = createAppAsyncThunk(
  'adminRuleManagement/fetchRuleById',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await AdminRuleManagementService.getRuleById(id)

      return (response.data?.data ?? response.data) as AdminRuleApiRecord
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Failed to fetch rule')

      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rule')
    }
  }
)

export const createAdminRuleAction = createAppAsyncThunk(
  'adminRuleManagement/createRule',
  async (payload: AdminRulePayload, { rejectWithValue }) => {
    try {
      const response = await AdminRuleManagementService.createRule(payload)

      toast.success('Rule created successfully')

      return response.data?.data ?? response.data
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Failed to create rule')

      return rejectWithValue(error.response?.data?.message || 'Failed to create rule')
    }
  }
)

export const updateAdminRuleAction = createAppAsyncThunk(
  'adminRuleManagement/updateRule',
  async ({ id, payload }: { id: number; payload: AdminRulePayload }, { rejectWithValue }) => {
    try {
      const response = await AdminRuleManagementService.updateRule(id, payload)

      toast.success('Rule updated successfully')

      return response.data?.data ?? response.data
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Failed to update rule')

      return rejectWithValue(error.response?.data?.message || 'Failed to update rule')
    }
  }
)

export const AdminRuleManagementSlice = createSlice({
  name: 'adminRuleManagement',
  initialState,
  reducers: {
    resetAdminRuleSearch: state => {
      state.rules = []
      state.rulesStatus = 'idle'
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAdminTasksByCategoryAction.pending, state => {
        state.transactionsStatus = 'pending'
      })
      .addCase(fetchAdminTasksByCategoryAction.fulfilled, (state, action) => {
        state.transactionOptions = toTransactionOptions(action.payload)
        state.transactionsStatus = 'success'
      })
      .addCase(fetchAdminTasksByCategoryAction.rejected, state => {
        state.transactionOptions = []
        state.transactionsStatus = 'error'
      })

      .addCase(fetchAdminUsersAction.pending, state => {
        state.usersStatus = 'pending'
      })
      .addCase(fetchAdminUsersAction.fulfilled, (state, action) => {
        state.userOptions = toAdminUserOptions(action.payload)
        state.usersStatus = 'success'
      })
      .addCase(fetchAdminUsersAction.rejected, state => {
        state.userOptions = []
        state.usersStatus = 'error'
      })

      .addCase(fetchAdminWorkflowsAction.pending, state => {
        state.workflowsStatus = 'pending'
      })
      .addCase(fetchAdminWorkflowsAction.fulfilled, (state, action) => {
        state.workflowOptions = action.payload.map(toWorkflowOption)
        state.workflowsStatus = 'success'
      })
      .addCase(fetchAdminWorkflowsAction.rejected, state => {
        state.workflowOptions = []
        state.workflowsStatus = 'error'
      })

      .addCase(fetchAdminRulesAction.pending, state => {
        state.rulesStatus = 'pending'
      })
      .addCase(fetchAdminRulesAction.fulfilled, (state, action) => {
        state.rules = action.payload
        state.rulesStatus = 'success'
      })
      .addCase(fetchAdminRulesAction.rejected, state => {
        state.rules = []
        state.rulesStatus = 'error'
      })

      .addCase(fetchAdminRuleByIdAction.pending, state => {
        state.ruleDetailStatus = 'pending'
      })
      .addCase(fetchAdminRuleByIdAction.fulfilled, (state, action) => {
        state.ruleDetail = action.payload
        state.ruleDetailStatus = 'success'
      })
      .addCase(fetchAdminRuleByIdAction.rejected, state => {
        state.ruleDetailStatus = 'error'
      })

      .addCase(createAdminRuleAction.pending, state => {
        state.createStatus = 'pending'
      })
      .addCase(createAdminRuleAction.fulfilled, state => {
        state.createStatus = 'success'
      })
      .addCase(createAdminRuleAction.rejected, state => {
        state.createStatus = 'error'
      })

      .addCase(updateAdminRuleAction.pending, state => {
        state.createStatus = 'pending'
      })
      .addCase(updateAdminRuleAction.fulfilled, state => {
        state.createStatus = 'success'
      })
      .addCase(updateAdminRuleAction.rejected, state => {
        state.createStatus = 'error'
      })
  }
})

export const { resetAdminRuleSearch } = AdminRuleManagementSlice.actions

export default AdminRuleManagementSlice.reducer