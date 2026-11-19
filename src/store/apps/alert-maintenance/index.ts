import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { AlertMaintenanceService } from 'src/services'
import {
  IAlertTemplate,
  IAlertTemplateUpdatePayload,
  IEnterpriseRole,
  ITask
} from 'src/types/apps/alertMaintenance'

type Status = 'idle' | 'pending' | 'success' | 'error'

interface InitialState {
  enterpriseRoles: IEnterpriseRole[]
  rolesStatus: Status

  tasks: ITask[]
  tasksStatus: Status
  tasksRequestId?: string

  templates: IAlertTemplate[]
  templatesStatus: Status
  templatesRequestId?: string
}

const initialState: InitialState = {
  enterpriseRoles: [],
  rolesStatus: 'idle',
  tasks: [],
  tasksStatus: 'idle',
  templates: [],
  templatesStatus: 'idle'
}

const errorMessage = (error: any): string => error?.response?.data?.message || 'Something Went Wrong'

const isPendingApprovalResponse = (res: any) => {
  const s = String(res?.status ?? res?.data?.status ?? '').toUpperCase()

  return s.includes('PENDING') || !!res?.workflowId || !!res?.data?.workflowId
}

type ThunkConfig = { rejectValue: string }

export const fetchEnterpriseRolesAction = createAsyncThunk<IEnterpriseRole[], void, ThunkConfig>(
  'alertMaintenance/fetchEnterpriseRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AlertMaintenanceService.getEnterpriseRoles()

      return response.data?.data ?? []
    } catch (error: any) {
      toast.error(errorMessage(error))

      return rejectWithValue(errorMessage(error))
    }
  }
)

export const fetchTasksAction = createAsyncThunk<ITask[], number | string, ThunkConfig>(
  'alertMaintenance/fetchTasks',
  async (enterpriseRoleId, { rejectWithValue }) => {
    try {
      const response = await AlertMaintenanceService.getTasks(enterpriseRoleId)

      return response.data?.data ?? []
    } catch (error: any) {
      toast.error(errorMessage(error))

      return rejectWithValue(errorMessage(error))
    }
  }
)

export const fetchTemplatesAction = createAsyncThunk<IAlertTemplate[], number, ThunkConfig>(
  'alertMaintenance/fetchTemplates',
  async (taskServiceId, { rejectWithValue }) => {
    try {
      const response = await AlertMaintenanceService.getTemplates(taskServiceId)

      return response.data?.data ?? []
    } catch (error: any) {
      toast.error(errorMessage(error))

      return rejectWithValue(errorMessage(error))
    }
  }
)

export const updateTemplateAction = createAsyncThunk<
  { template?: IAlertTemplate; isPending: boolean },
  { id: number; data: IAlertTemplateUpdatePayload },
  ThunkConfig
>('alertMaintenance/updateTemplate', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await AlertMaintenanceService.updateTemplate(id, data)
    const body = response.data

    if (isPendingApprovalResponse(body)) {
      toast.success(typeof body?.message === 'string' && body.message.trim() ? body.message : 'Submitted for approval.')

      return { isPending: true }
    }

    toast.success(typeof body?.message === 'string' && body.message.trim() ? body.message : 'Updated successfully.')

    return { template: body?.data as IAlertTemplate, isPending: false }
  } catch (error: any) {
    toast.error(errorMessage(error))

    return rejectWithValue(errorMessage(error))
  }
})

export const Slice = createSlice({
  name: 'alertMaintenance',
  initialState,
  reducers: {
    clearTasks: state => {
      state.tasks = []
      state.tasksStatus = 'idle'
      state.tasksRequestId = undefined
    },
    clearTemplates: state => {
      state.templates = []
      state.templatesStatus = 'idle'
      state.templatesRequestId = undefined
    },
    replaceTemplate: (state, action: PayloadAction<IAlertTemplate>) => {
      state.templates = state.templates.map(t => (t.id === action.payload.id ? action.payload : t))
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchEnterpriseRolesAction.pending, state => {
      state.rolesStatus = 'pending'
    })
    builder.addCase(fetchEnterpriseRolesAction.fulfilled, (state, action) => {
      state.enterpriseRoles = action.payload
      state.rolesStatus = 'success'
    })
    builder.addCase(fetchEnterpriseRolesAction.rejected, state => {
      state.rolesStatus = 'error'
    })

    builder.addCase(fetchTasksAction.pending, (state, action) => {
      state.tasksStatus = 'pending'
      state.tasksRequestId = action.meta.requestId
      state.tasks = []
    })
    builder.addCase(fetchTasksAction.fulfilled, (state, action) => {
      if (state.tasksRequestId !== action.meta.requestId) return
      state.tasks = action.payload
      state.tasksStatus = 'success'
    })
    builder.addCase(fetchTasksAction.rejected, (state, action) => {
      if (state.tasksRequestId !== action.meta.requestId) return
      state.tasksStatus = 'error'
    })

    builder.addCase(fetchTemplatesAction.pending, (state, action) => {
      state.templatesStatus = 'pending'
      state.templatesRequestId = action.meta.requestId
      state.templates = []
    })
    builder.addCase(fetchTemplatesAction.fulfilled, (state, action) => {
      if (state.templatesRequestId !== action.meta.requestId) return
      state.templates = action.payload
      state.templatesStatus = 'success'
    })
    builder.addCase(fetchTemplatesAction.rejected, (state, action) => {
      if (state.templatesRequestId !== action.meta.requestId) return
      state.templatesStatus = 'error'
    })

    builder.addCase(updateTemplateAction.fulfilled, (state, action) => {
      const { template, isPending } = action.payload
      if (isPending || !template) return

      state.templates = state.templates.map(t => (t.id === template.id ? { ...t, ...template } : t))
    })
  }
})

export const { clearTasks, clearTemplates, replaceTemplate } = Slice.actions

export default Slice.reducer