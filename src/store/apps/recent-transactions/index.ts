import { createSlice, createAsyncThunk, Dispatch } from '@reduxjs/toolkit'
import { RootState } from 'src/store'
import { getRecentTransactions } from 'src/services'
import { RecentTransactionItem } from 'src/types/apps/recentTransactions'

const createThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
  rejectValue: string
}>()

const getErrorMessage = (error: any) =>
  error?.response?.data?.message || error?.message || 'Unable to load recent transactions'

// Dashboard ka widget hai, is liye yahan toast nahi dikhate (khali list / error par component khud
// "No recent transactions" dikha deta hai). Message state.error me milta hai.
export const fetchRecentTransactionsAction = createThunk(
  'recentTransactions/fetch',
  async (accountId: string, { rejectWithValue }) => {
    try {
      const res = await getRecentTransactions({
        accountId,
        searchByType: 'LAST_N_TXN',
        noOfTransactions: '10'
      })
      const body = res.data

      if (String(body.code) !== '200') {
        return rejectWithValue(body.message || 'Unable to load recent transactions')
      }

      return body.data ?? []
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

interface RecentTransactionsState {
  entities: RecentTransactionItem[]
  status: 'idle' | 'pending' | 'success' | 'error'
  error: string
  currentRequestId: string | null
}

const initialState: RecentTransactionsState = {
  entities: [],
  status: 'idle',
  error: '',
  currentRequestId: null
}

const recentTransactionsSlice = createSlice({
  name: 'recentTransactions',
  initialState,
  reducers: {
    clearAll: () => initialState
  },
  extraReducers: builder => {
    builder
      .addCase(fetchRecentTransactionsAction.pending, (state, action) => {
        state.status = 'pending'
        state.error = ''
        state.entities = [] // account badalte hi purani account ki transactions hat jayein
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchRecentTransactionsAction.fulfilled, (state, action) => {
        // Account jaldi jaldi badalne par purane request ka jawab ignore hota hai
        if (state.currentRequestId !== action.meta.requestId) return

        state.status = 'success'
        state.entities = action.payload
      })
      .addCase(fetchRecentTransactionsAction.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return

        state.status = 'error'
        state.entities = []
        state.error = (action.payload as string) || 'Unable to load recent transactions'
      })
  }
})

export const { clearAll } = recentTransactionsSlice.actions
export default recentTransactionsSlice.reducer
