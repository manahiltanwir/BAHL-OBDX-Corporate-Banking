import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { TransactionGroupService } from 'src/services'
import {
  IActivityGroup,
  IActivityGroupPayload,
  IFinancialTask,
  IMutationResult,
  ITransactionItem
} from 'src/types/apps/transactionGroup'

type Status = 'idle' | 'pending' | 'success' | 'error'

interface InitialState {
  groups: IActivityGroup[]
  groupsStatus: Status
  groupsRequestId?: string
  transactions: ITransactionItem[]
  transactionsStatus: Status
}

const initialState: InitialState = {
  groups: [],
  groupsStatus: 'idle',
  transactions: [],
  transactionsStatus: 'idle'
}

type ThunkConfig = { rejectValue: string }

const errorMessage = (error: any): string => {
  const data = error?.response?.data
  const apiError = data?.error

  return (
    (typeof apiError === 'string' && apiError.trim() ? apiError : '') ||
    (typeof apiError?.message === 'string' && apiError.message.trim() ? apiError.message : '') ||
    (typeof data?.message === 'string' && data.message.trim() ? data.message : '') ||
    'Something Went Wrong'
  )
}

// 200 ke saath { success: false } aaye to bhi error samjho
const assertSuccess = (response: any) => {
  if (response?.data?.success === false) throw { response: { data: response.data } }

  return response
}

const toMutationResult = (response: any, fallbackMessage: string): IMutationResult => {
  const message =
    typeof response?.data?.message === 'string' && response.data.message.trim() ? response.data.message : fallbackMessage

  return { message }
}

export const fetchGroupsAction = createAsyncThunk<IActivityGroup[], void, ThunkConfig>(
  'transactionGroup/fetchGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = assertSuccess(await TransactionGroupService.getAll())

      return response.data?.data ?? []
    } catch (error: any) {
      return rejectWithValue(errorMessage(error))
    }
  }
)

export const fetchTransactionsAction = createAsyncThunk<ITransactionItem[], number | string, ThunkConfig>(
  'transactionGroup/fetchTransactions',
  async (enterpriseRoleId, { rejectWithValue }) => {
    try {
      const response = assertSuccess(await TransactionGroupService.getFinancialTransactions(enterpriseRoleId))
      const tasks: IFinancialTask[] = response.data?.data ?? []

      const byCode = new Map<string, ITransactionItem>()
      tasks.forEach(task =>
        (task.taskServices ?? []).forEach(service => {
          if (!byCode.has(service.operationCode)) {
            byCode.set(service.operationCode, {
              transactionCode: service.operationCode,
              transactionName: service.operationName
            })
          }
        })
      )

      return Array.from(byCode.values())
    } catch (error: any) {
      return rejectWithValue(errorMessage(error))
    }
  }
)

export const createGroupAction = createAsyncThunk<IMutationResult, IActivityGroupPayload, ThunkConfig>(
  'transactionGroup/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = assertSuccess(await TransactionGroupService.create(data))

      return toMutationResult(response, `Group ${data.groupCode} created successfully.`)
    } catch (error: any) {
      return rejectWithValue(errorMessage(error))
    }
  }
)

export const updateGroupAction = createAsyncThunk<
  IMutationResult,
  { id: number | string; data: IActivityGroupPayload },
  ThunkConfig
>('transactionGroup/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = assertSuccess(await TransactionGroupService.update(id, data))

    return toMutationResult(response, `Group ${data.groupCode} updated successfully.`)
  } catch (error: any) {
    return rejectWithValue(errorMessage(error))
  }
})

export const deactivateGroupAction = createAsyncThunk<
  IMutationResult,
  { id: number | string; groupCode: string },
  ThunkConfig
>('transactionGroup/deactivate', async ({ id, groupCode }, { rejectWithValue }) => {
  try {
    const response = assertSuccess(await TransactionGroupService.deactivate(id))

    return toMutationResult(response, `Group ${groupCode} deactivated successfully.`)
  } catch (error: any) {
    return rejectWithValue(errorMessage(error))
  }
})

export const Slice = createSlice({
  name: 'transactionGroup',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchGroupsAction.pending, (state, action) => {
      state.groupsStatus = 'pending'
      state.groupsRequestId = action.meta.requestId
    })
    builder.addCase(fetchGroupsAction.fulfilled, (state, action) => {
      if (state.groupsRequestId !== action.meta.requestId) return
      state.groups = action.payload
      state.groupsStatus = 'success'
    })
    builder.addCase(fetchGroupsAction.rejected, (state, action) => {
      if (state.groupsRequestId !== action.meta.requestId) return
      state.groupsStatus = 'error'
    })

    builder.addCase(fetchTransactionsAction.pending, state => {
      state.transactionsStatus = 'pending'
    })
    builder.addCase(fetchTransactionsAction.fulfilled, (state, action) => {
      state.transactions = action.payload
      state.transactionsStatus = 'success'
    })
    builder.addCase(fetchTransactionsAction.rejected, state => {
      state.transactionsStatus = 'error'
    })
  }
})

export default Slice.reducer