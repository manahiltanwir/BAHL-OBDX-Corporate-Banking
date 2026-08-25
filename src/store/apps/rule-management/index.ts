import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/store'
import toast from 'react-hot-toast'
import { RuleManagementService } from 'src/services'
import {
  RulePartyUserItem,
  RulePartyInfo,
  RulePartyUserOption,
  RuleAccountRecord,
  RuleAccountOption,
  RuleTask,
  RuleTransactionOption,
  RuleTaskCategory,
  RuleWorkflowRecord,
  RuleWorkflowOption,
  RuleApiPayload,
  RuleApiRecord
} from 'src/types/apps/ruleManagement'

const toUserOption = (item: RulePartyUserItem): RulePartyUserOption => {
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

const toPartyInfo = (items: RulePartyUserItem[]): RulePartyInfo | null => {
  const party = items[0]?.userParties?.[0]
  if (!party) return null
  return { partyId: party.partyId, partyName: party.partyName }
}

const toAccountOption = (acc: RuleAccountRecord): RuleAccountOption => ({
  id: acc.accountNumber,
  label: `${acc.accountTitle} — ${acc.accountNumber}`
})

const toTransactionOptions = (tasks: RuleTask[]): RuleTransactionOption[] =>
  tasks.flatMap(task =>
    (task.taskServices || []).map(service => ({
      id: service.operationCode,
      label: service.operationName,
      taskCode: task.taskCode,
      taskName: task.taskName
    }))
  )

const toWorkflowOption = (wf: RuleWorkflowRecord): RuleWorkflowOption => ({
  id: String(wf.id),
  label: wf.workflowCode
})

type AsyncStatus = 'idle' | 'pending' | 'success' | 'error'

interface InitialState {
  partyInfo: RulePartyInfo | null
  userOptions: RulePartyUserOption[]
  status: AsyncStatus

  accountOptions: RuleAccountOption[]
  accountsStatus: AsyncStatus

  transactionOptions: RuleTransactionOption[]
  transactionsStatus: AsyncStatus

  workflowOptions: RuleWorkflowOption[]
  workflowsStatus: AsyncStatus

  // ** Rule create/update
  createStatus: AsyncStatus

  // ** Single rule fetch (edit mode)
  ruleDetail: RuleApiRecord | null
  ruleDetailStatus: AsyncStatus

  // ** Rules list for a party
  rulesList: RuleApiRecord[]
  rulesListStatus: AsyncStatus
}

const initialState: InitialState = {
  partyInfo: null,
  userOptions: [],
  status: 'idle',

  accountOptions: [],
  accountsStatus: 'idle',

  transactionOptions: [],
  transactionsStatus: 'idle',

  workflowOptions: [],
  workflowsStatus: 'idle',

  createStatus: 'idle',

  ruleDetail: null,
  ruleDetailStatus: 'idle',

  rulesList: [],
  rulesListStatus: 'idle'
}

const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue: (reason: string) => void) => {
  dispatch(RulePartySearchSlice.actions.handleStatus('error'))
  toast.error(error?.response ? error.response.data.message : 'Something Went Wrong')
  return rejectWithValue(error.response?.data?.message || 'Something Went Wrong')
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

export const searchRulePartyUsersAction = createAppAsyncThunk(
  'rulePartySearch/searchPartyUsers',
  async ({ partyId }: { partyId: string }, { dispatch, rejectWithValue }) => {
    dispatch(RulePartySearchSlice.actions.handleStatus('pending'))
    try {
      const response = await RuleManagementService.searchPartyUsers(partyId)
      dispatch(RulePartySearchSlice.actions.handleStatus('success'))
      const raw = response.data
      return Array.isArray(raw) ? raw : raw?.data ?? []
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

export const fetchRulePartyAccountsAction = createAppAsyncThunk(
  'rulePartySearch/fetchPartyAccounts',
  async (partyId: string, { rejectWithValue }) => {
    try {
      const response = await RuleManagementService.getPartyAccounts(partyId)
      const totalAccounts: RuleAccountRecord[] = response.data?.data?.totalAccounts ?? []
      return totalAccounts
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Failed to fetch accounts')
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch accounts')
    }
  }
)

export const fetchRuleTasksByCategoryAction = createAppAsyncThunk(
  'rulePartySearch/fetchTasksByCategory',
  async (category: RuleTaskCategory, { rejectWithValue }) => {
    try {
      const response = await RuleManagementService.getTasksByCategory(category)
      const tasks: RuleTask[] = Array.isArray(response.data) ? response.data : response.data?.data ?? []
      return tasks
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Failed to fetch transactions')
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions')
    }
  }
)

export const searchRuleWorkflowsByPartyAction = createAppAsyncThunk(
  'rulePartySearch/searchWorkflowsByParty',
  async (partyId: string, { rejectWithValue }) => {
    try {
      const response = await RuleManagementService.searchWorkflowsByParty(partyId)
      const raw = response.data
      return (Array.isArray(raw) ? raw : raw?.data ?? []) as RuleWorkflowRecord[]
    } catch (error: any) {
      toast.error(error?.response ? error.response.data.message : 'Failed to fetch workflows')
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workflows')
    }
  }
)

// ** Create rule — POST /api/v1/corporate/rules
export const createRuleAction = createAppAsyncThunk(
  'rulePartySearch/createRule',
  async (payload: RuleApiPayload, { dispatch, rejectWithValue }) => {
    dispatch(RulePartySearchSlice.actions.handleCreateStatus('pending'))
    try {
      const response = await RuleManagementService.createRule(payload)
      dispatch(RulePartySearchSlice.actions.handleCreateStatus('success'))
      toast.success('Rule created successfully')
      return response.data?.data ?? response.data
    } catch (error: any) {
      dispatch(RulePartySearchSlice.actions.handleCreateStatus('error'))
      toast.error(error?.response ? error.response.data.message : 'Failed to create rule')
      return rejectWithValue(error.response?.data?.message || 'Failed to create rule')
    }
  }
)

// ** Update rule — PUT /api/v1/corporate/rules/{id}
export const updateRuleAction = createAppAsyncThunk(
  'rulePartySearch/updateRule',
  async ({ id, payload }: { id: number; payload: RuleApiPayload }, { dispatch, rejectWithValue }) => {
    dispatch(RulePartySearchSlice.actions.handleCreateStatus('pending'))
    try {
      const response = await RuleManagementService.updateRule(id, payload)
      dispatch(RulePartySearchSlice.actions.handleCreateStatus('success'))
      toast.success('Rule updated successfully')
      return response.data?.data ?? response.data
    } catch (error: any) {
      dispatch(RulePartySearchSlice.actions.handleCreateStatus('error'))
      toast.error(error?.response ? error.response.data.message : 'Failed to update rule')
      return rejectWithValue(error.response?.data?.message || 'Failed to update rule')
    }
  }
)

// ** Single rule by id — GET /api/v1/corporate/rules/{id} (edit mode ke liye)
export const fetchRuleByIdAction = createAppAsyncThunk(
  'rulePartySearch/fetchRuleById',
  async (id: string | number, { dispatch, rejectWithValue }) => {
    dispatch(RulePartySearchSlice.actions.handleRuleDetailStatus('pending'))
    try {
      const response = await RuleManagementService.getRuleById(id)
      const record = (response.data?.data ?? response.data) as RuleApiRecord
      dispatch(RulePartySearchSlice.actions.handleRuleDetailStatus('success'))
      return record
    } catch (error: any) {
      dispatch(RulePartySearchSlice.actions.handleRuleDetailStatus('error'))
      toast.error(error?.response ? error.response.data.message : 'Failed to fetch rule')
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rule')
    }
  }
)

// ** Rules list by party — GET /api/v1/corporate/rules/party/{partyId} (listing table ke liye)
export const fetchRulesByPartyAction = createAppAsyncThunk(
  'rulePartySearch/fetchRulesByParty',
  async (partyId: string, { dispatch, rejectWithValue }) => {
    dispatch(RulePartySearchSlice.actions.handleRulesListStatus('pending'))
    try {
      const response = await RuleManagementService.getRulesByParty(partyId)
      const raw = response.data
      const list = (Array.isArray(raw) ? raw : raw?.data ?? []) as RuleApiRecord[]
      dispatch(RulePartySearchSlice.actions.handleRulesListStatus('success'))
      return list
    } catch (error: any) {
      dispatch(RulePartySearchSlice.actions.handleRulesListStatus('error'))
      toast.error(error?.response ? error.response.data.message : 'Failed to fetch rules')
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rules')
    }
  }
)

export const RulePartySearchSlice = createSlice({
  name: 'rulePartySearch',
  initialState,
  reducers: {
    handleStatus: (state, action) => {
      state.status = action.payload
    },
    handleCreateStatus: (state, action) => {
      state.createStatus = action.payload
    },
    handleRuleDetailStatus: (state, action) => {
      state.ruleDetailStatus = action.payload
    },
    handleRulesListStatus: (state, action) => {
      state.rulesListStatus = action.payload
    },
    resetRulePartySearch: state => {
      state.partyInfo = null
      state.userOptions = []
      state.status = 'idle'
      state.accountOptions = []
      state.accountsStatus = 'idle'
      state.transactionOptions = []
      state.transactionsStatus = 'idle'
      state.workflowOptions = []
      state.workflowsStatus = 'idle'
      state.createStatus = 'idle'
      state.ruleDetail = null
      state.ruleDetailStatus = 'idle'
    }
  },
  extraReducers: builder => {
    builder
      .addCase(searchRulePartyUsersAction.fulfilled, (state, action) => {
        const items = (action.payload || []) as RulePartyUserItem[]
        state.partyInfo = toPartyInfo(items)
        state.userOptions = items.map(toUserOption)
      })

      .addCase(fetchRulePartyAccountsAction.pending, state => {
        state.accountsStatus = 'pending'
      })
      .addCase(fetchRulePartyAccountsAction.fulfilled, (state, action) => {
        state.accountOptions = action.payload.map(toAccountOption)
        state.accountsStatus = 'success'
      })
      .addCase(fetchRulePartyAccountsAction.rejected, state => {
        state.accountOptions = []
        state.accountsStatus = 'error'
      })

      .addCase(fetchRuleTasksByCategoryAction.pending, state => {
        state.transactionsStatus = 'pending'
      })
      .addCase(fetchRuleTasksByCategoryAction.fulfilled, (state, action) => {
        state.transactionOptions = toTransactionOptions(action.payload)
        state.transactionsStatus = 'success'
      })
      .addCase(fetchRuleTasksByCategoryAction.rejected, state => {
        state.transactionOptions = []
        state.transactionsStatus = 'error'
      })

      .addCase(searchRuleWorkflowsByPartyAction.pending, state => {
        state.workflowsStatus = 'pending'
      })
      .addCase(searchRuleWorkflowsByPartyAction.fulfilled, (state, action) => {
        state.workflowOptions = action.payload.map(toWorkflowOption)
        state.workflowsStatus = 'success'
      })
      .addCase(searchRuleWorkflowsByPartyAction.rejected, state => {
        state.workflowOptions = []
        state.workflowsStatus = 'error'
      })

      .addCase(fetchRuleByIdAction.fulfilled, (state, action) => {
        state.ruleDetail = action.payload
      })

      .addCase(fetchRulesByPartyAction.fulfilled, (state, action) => {
        state.rulesList = action.payload
      })
  }
})

export const { resetRulePartySearch } = RulePartySearchSlice.actions

export default RulePartySearchSlice.reducer