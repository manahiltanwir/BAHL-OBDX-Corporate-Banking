import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LimitPackageService } from 'src/services'
import {
  CoverageType,
  IFinancialTask,
  ILimitPackage,
  ILimitPackagePayload,
  IMutationResult,
  IPackageActivity,
  IPackageGroup,
  Status
} from 'src/types/apps/limitPackage'

interface InitialState {
  packages: ILimitPackage[]
  packagesStatus: Status
  packagesRequestId?: string
  groups: IPackageGroup[]
  groupsStatus: Status
  groupsRequestId?: string
  activities: IPackageActivity[]
  activitiesStatus: Status
}

const initialState: InitialState = {
  packages: [],
  packagesStatus: 'idle',
  groups: [],
  groupsStatus: 'idle',
  activities: [],
  activitiesStatus: 'idle'
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

const num = (value: any) => Number(value ?? 0)

// Backend ka record UI ke shape mein (limits nested ho ya flat, dono chalenge)
const normalizePackage = (p: any): ILimitPackage => {
  const l = p?.limits ?? p ?? {}
  const groupId = p?.groupId ?? null
  const operationCode = p?.operationCode ?? null
  const rawCoverage = typeof p?.coverageType === 'string' ? p.coverageType.trim() : ''
  const coverageType = (rawCoverage || (groupId !== null ? 'ACTIVITY_GROUP' : 'ACTIVITY')) as CoverageType

  return {
    id: p?.id ?? p?.packageId ?? null,
    packageCode: p?.packageCode ?? '',
    packageName: p?.packageName ?? '',
    coverageType,
    operationCode,
    groupId: groupId !== null ? Number(groupId) : null,
    channel: p?.channel ?? '',
    currency: p?.currency ?? '',
    limits: {
      perTransactionAmount: num(l.perTransactionAmount),
      dailyCumulativeAmount: num(l.dailyCumulativeAmount),
      monthlyCumulativeAmount: num(l.monthlyCumulativeAmount),
      dailyTransactionCount: num(l.dailyTransactionCount),
      monthlyTransactionCount: num(l.monthlyTransactionCount)
    }
  }
}

// ---------------- packages ----------------
export const fetchPackagesAction = createAsyncThunk<ILimitPackage[], void, ThunkConfig>(
  'limitPackage/fetchPackages',
  async (_, { rejectWithValue }) => {
    try {
      const response = assertSuccess(await LimitPackageService.getAll())
      const raw = response.data?.data
      const list: any[] = Array.isArray(raw) ? raw : Array.isArray(raw?.content) ? raw.content : []

      return list.map(normalizePackage)
    } catch (error: any) {
      return rejectWithValue(errorMessage(error))
    }
  }
)

export const createPackageAction = createAsyncThunk<IMutationResult, ILimitPackagePayload, ThunkConfig>(
  'limitPackage/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = assertSuccess(await LimitPackageService.create(data))

      return toMutationResult(response, `Limit package ${data.packageCode} created successfully.`)
    } catch (error: any) {
      return rejectWithValue(errorMessage(error))
    }
  }
)

// ---------------- activity groups ----------------
export const fetchPackageGroupsAction = createAsyncThunk<IPackageGroup[], void, ThunkConfig>(
  'limitPackage/fetchGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = assertSuccess(await LimitPackageService.getGroups())

      return response.data?.data ?? []
    } catch (error: any) {
      return rejectWithValue(errorMessage(error))
    }
  }
)

// ---------------- activities (financial transactions) ----------------
export const fetchPackageActivitiesAction = createAsyncThunk<IPackageActivity[], number | string, ThunkConfig>(
  'limitPackage/fetchActivities',
  async (enterpriseRoleId, { rejectWithValue }) => {
    try {
      const response = assertSuccess(await LimitPackageService.getFinancialTransactions(enterpriseRoleId))
      const tasks: IFinancialTask[] = response.data?.data ?? []

      const byCode = new Map<string, IPackageActivity>()
      tasks.forEach(task =>
        (task.taskServices ?? []).forEach(service => {
          if (!byCode.has(service.operationCode)) {
            byCode.set(service.operationCode, {
              operationCode: service.operationCode,
              operationName: service.operationName
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

export const Slice = createSlice({
  name: 'limitPackage',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // packages
    builder.addCase(fetchPackagesAction.pending, (state, action) => {
      state.packagesStatus = 'pending'
      state.packagesRequestId = action.meta.requestId
    })
    builder.addCase(fetchPackagesAction.fulfilled, (state, action) => {
      if (state.packagesRequestId !== action.meta.requestId) return
      state.packages = action.payload
      state.packagesStatus = 'success'
    })
    builder.addCase(fetchPackagesAction.rejected, (state, action) => {
      if (state.packagesRequestId !== action.meta.requestId) return
      state.packagesStatus = 'error'
    })

    // groups
    builder.addCase(fetchPackageGroupsAction.pending, (state, action) => {
      state.groupsStatus = 'pending'
      state.groupsRequestId = action.meta.requestId
    })
    builder.addCase(fetchPackageGroupsAction.fulfilled, (state, action) => {
      if (state.groupsRequestId !== action.meta.requestId) return
      state.groups = action.payload
      state.groupsStatus = 'success'
    })
    builder.addCase(fetchPackageGroupsAction.rejected, (state, action) => {
      if (state.groupsRequestId !== action.meta.requestId) return
      state.groupsStatus = 'error'
    })

    // activities
    builder.addCase(fetchPackageActivitiesAction.pending, state => {
      state.activitiesStatus = 'pending'
    })
    builder.addCase(fetchPackageActivitiesAction.fulfilled, (state, action) => {
      state.activities = action.payload
      state.activitiesStatus = 'success'
    })
    builder.addCase(fetchPackageActivitiesAction.rejected, state => {
      state.activitiesStatus = 'error'
    })
  }
})

export default Slice.reducer