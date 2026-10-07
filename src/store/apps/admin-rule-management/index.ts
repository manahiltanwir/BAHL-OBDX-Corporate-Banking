import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { RootState } from 'src/store'
import { AdminRuleManagementService } from 'src/services'
import {
  RuleTask,
  RuleTransactionOption,
  RuleTaskCategory,
  RuleApiPayload,
  RuleApiRecord
} from 'src/types/apps/ruleManagement'

type AsyncStatus = 'idle' | 'pending' | 'success' | 'error'

const toTransactionOptions = (tasks: RuleTask[]): RuleTransactionOption[] =>
  tasks.flatMap(task =>
    (task.taskServices || []).map(service => ({
      id: service.operationCode,
      label: service.operationName,
      taskCode: task.taskCode,
      taskName: task.taskName
    }))
  )

// ** Response array ho, {data: [...]} ho, ya single record, teeno handle
const normalizeList = (raw: any): RuleApiRecord[] => {
  const d = raw?.data ?? raw

  if (Array.isArray(d)) return d
  if (d && typeof d === 'object' && d.id !== undefined) return [d]

  return []
}

interface InitialState {
  transactionOptions: RuleTransactionOption[]
  transactionsStatus: AsyncStatus
  rules: RuleApiRecord[]
  rulesStatus: AsyncStatus
  searchFallback: boolean
  ruleDetail: RuleApiRecord | null
  ruleDetailStatus: AsyncStatus
  createStatus: AsyncStatus
}

const initialState: InitialState = {
  transactionOptions: [],
  transactionsStatus: 'idle',
  rules: [],
  rulesStatus: 'idle',
  searchFallback: false,
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

// ** Pehle rule code se search, na mile (ya error aaye) to get-all
export const searchAdminRulesAction = createAppAsyncThunk(
  'adminRuleManagement/searchRules',
  async (ruleCode: string, { rejectWithValue }) => {
    let list: RuleApiRecord[] = []

    try {
      const res = await AdminRuleManagementService.getRuleByCode(ruleCode)

      list = normalizeList(res.data)
    } catch (e) {
      list = []
    }

    if (list.length > 0) return { rules: list, fallback: false }

    try {
      const all = await AdminRuleManagementService.getAllRules()

      return { rules: normalizeList(all.data), fallback: true }
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Failed to fetch rules')

      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rules')
    }
  }
)

export const fetchAdminRuleByIdAction = createAppAsyncThunk(
  'adminRuleManagement/fetchRuleById',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await AdminRuleManagementService.getRuleById(id)

      return (response.data?.data ?? response.data) as RuleApiRecord
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Failed to fetch rule')

      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rule')
    }
  }
)

export const createAdminRuleAction = createAppAsyncThunk(
  'adminRuleManagement/createRule',
  async (payload: RuleApiPayload, { rejectWithValue }) => {
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
  async ({ id, payload }: { id: number; payload: RuleApiPayload }, { rejectWithValue }) => {
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
      state.searchFallback = false
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

      .addCase(searchAdminRulesAction.pending, state => {
        state.rulesStatus = 'pending'
      })
      .addCase(searchAdminRulesAction.fulfilled, (state, action) => {
        state.rules = action.payload.rules
        state.searchFallback = action.payload.fallback
        state.rulesStatus = 'success'
      })
      .addCase(searchAdminRulesAction.rejected, state => {
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