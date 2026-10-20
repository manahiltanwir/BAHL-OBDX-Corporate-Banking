import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/store'
import toast from 'react-hot-toast'
import { ApprovalActivityService } from 'src/services'
import {
  ApprovalActionPayload,
  ApprovalActionResponse,
  ApprovalActivitiesParams,
  ApprovalActivityApi
} from 'src/types/apps/approvalActivity'

interface InitialState {
  activities: ApprovalActivityApi[]
  status: 'pending' | 'error' | 'success' | 'idle'
}

const initialState: InitialState = {
  activities: [],
  status: 'idle'
}

const ApiError = (error: any, dispatch: AppDispatch, rejectWithValue: (reason: string) => void) => {
  dispatch(ApprovalActivitySlice.actions.handleStatus('error'))
  toast.error(error?.response ? error.response.data?.message || 'Something Went Wrong' : 'Something Went Wrong')
  return rejectWithValue(error.response?.data?.message || 'Something Went Wrong')
}

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: Dispatch<any>
}>()

export const fetchApprovalActivitiesAction = createAppAsyncThunk(
  'approvalActivity/fetchApprovalActivities',
  async (params: ApprovalActivitiesParams, { dispatch, rejectWithValue }) => {
    dispatch(ApprovalActivitySlice.actions.handleStatus('pending'))
    try {
      const response = await ApprovalActivityService.getApprovalActivities(params)
      dispatch(ApprovalActivitySlice.actions.handleStatus('success'))

      const data = response.data?.data ?? response.data

      return (Array.isArray(data) ? data : []) as ApprovalActivityApi[]
    } catch (error: any) {
      return ApiError(error, dispatch, rejectWithValue)
    }
  }
)

// Approve / Reject. Yahan list ka `status` touch nahi karte (warna action fail hone par
// list "Failed to load" dikhane lag jati), sirf toast + rejectWithValue.
export const submitApprovalActionAction = createAppAsyncThunk(
  'approvalActivity/submitApprovalAction',
  async ({ data }: { data: ApprovalActionPayload }, { rejectWithValue }) => {
    try {
      const response = await ApprovalActivityService.takeApprovalAction(data)
      const result = (response.data?.data ?? response.data) as ApprovalActionResponse

      // Backend ka message dikhao, e.g. "Level approved. Moved to next workflow level."
      toast.success(
        result?.message || (data.action === 'APPROVE' ? 'Request approved successfully!' : 'Request rejected successfully!')
      )

      return result
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Something Went Wrong'
      toast.error(message)

      return rejectWithValue(message)
    }
  }
)

export const ApprovalActivitySlice = createSlice({
  name: 'approvalActivity',
  initialState,
  reducers: {
    handleStatus: (state, action) => {
      state.status = action.payload
    },
    resetApprovalActivity: state => {
      state.activities = []
      state.status = 'idle'
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchApprovalActivitiesAction.fulfilled, (state, action) => {
      state.activities = action.payload || []
    })
  }
})

export const { resetApprovalActivity } = ApprovalActivitySlice.actions

export default ApprovalActivitySlice.reducer