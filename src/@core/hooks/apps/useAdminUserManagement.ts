import { useEffect, useState } from 'react'

// ** Third Party Imports
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { RootState, AppDispatch } from 'src/store'
import { ApiResponseInfo } from 'src/@core/components/ApiResponseDialog'

// ** types
import {
  AdminUserManagementApi,
  AdminUserManagementForm,
  AdminUserManagementKeys
} from 'src/types/apps/adminUserManagement'

import { csvDownload } from 'src/@core/helper/csv-export'

// ** Actions Imports
import {
  fetchAllAction,
  fetchOneAction,
  addAction,
  updateAction,
  deleteAction,
  updateStatusAction,
  fetchOneActionForUsername,
  updateUsernameAction,
  fetchAllActionForRoles
} from 'src/store/apps/admin-user-management'
import { setFormValues } from 'src/@core/helper/setFormValues'
import { useRouter } from 'next/router'

const defaultValues: AdminUserManagementForm = {
  username: '',
  userId: '',
  mobileNumber: '',
  firstName: '',
  lastName: '',
  email: '',
  passport: ''
}

// ** Maker-checker detection (status number ho ya string, wrapper ho ya na ho, crash nahi karta)
export const isPendingApproval = (res: any) => {
  const s = String(res?.status ?? res?.data?.status ?? '').toUpperCase()

  return s.includes('PENDING') || !!res?.workflowId || !!res?.data?.workflowId
}

export type ActionOutcome = 'success' | 'pending' | 'failed'

export const useAdminUserManagement = (serviceId: string | null) => {
  const [clickedModule, setClickedModule] = useState<
    'resetPassword' | 'resetUsername' | 'InactiveUser' | 'activeUser' | ''
  >('')
  const { handleModal } = useToggleDrawer()
  const [addUserData, setAddUserData] = useState<any>(null)
  const [responseInfo, setResponseInfo] = useState<ApiResponseInfo | null>(null)
  const [redirectOnClose, setRedirectOnClose] = useState(false)
  const store = useSelector((state: RootState) => state.adminUserManagement)
  const dispatch = useDispatch<AppDispatch>()
  const { push } = useRouter()

  // Search form (koi resolver nahi, "at least one field" check page mein hota hai)
  const form = useForm<AdminUserManagementForm>({
    defaultValues,
    mode: 'onChange'
  })

  useEffect(() => {
    if (!serviceId) return

    if (store.entity && 'id' in store.entity && (store.entity as any).userDTO) {
      setFormValues<AdminUserManagementKeys, AdminUserManagementApi>(store.entity as any, (key, value) => {
        form.setValue(key, value)
      })
    }
  }, [store.entity, serviceId])

  // ** Shared helper: create / update / status / username sab yahi use karte hain.
  // pending -> sirf modal (API ka response)
  // failed  -> sirf red modal
  // success -> toast: API ka message ho to wo, warna fallbackMessage
  const runAction = async (
    action: () => Promise<any>,
    fallbackMessage: string,
    redirectIfPending = false
  ): Promise<ActionOutcome> => {
    try {
      const result: any = await action()

      if (isPendingApproval(result)) {
        // Wrapper ho to andar wali fields bahar le aao, taake modal ko status/message mile
        const pendingInfo: ApiResponseInfo =
          result?.data && typeof result.data === 'object' ? { ...result, ...result.data } : result

        setResponseInfo(pendingInfo)
        if (redirectIfPending) setRedirectOnClose(true)

        return 'pending'
      }

      const apiMessage = typeof result === 'string' ? result : result?.message

      toast.success(typeof apiMessage === 'string' && apiMessage.trim() ? apiMessage : fallbackMessage)

      return 'success'
    } catch (error: any) {
      setResponseInfo({
        status: 'FAILED',
        message: typeof error === 'string' ? error : error?.message
      })

      return 'failed'
    }
  }

  const handleCloseResponse = () => {
    setResponseInfo(null)

    if (redirectOnClose) {
      setRedirectOnClose(false)
      push('/admin-maintenance/user-management')
    }
  }

  const getUser = async (id: String) => {
    return dispatch(fetchOneAction(id as string))
  }

  const checkUsername = async (username: String) => {
    return dispatch(fetchOneActionForUsername(username as string))
  }

  const getUsers = async (data: AdminUserManagementForm) => {
    return dispatch(fetchAllAction(data))
  }

  const getRolesById = async (id: String) => {
    return dispatch(fetchAllActionForRoles(id))
  }

  const addUser = async (data: AdminUserManagementForm) => {
    const outcome = await runAction(() => dispatch(addAction({ data })).unwrap(), 'User created successfully.', true)

    if (outcome === 'success') {
      form.reset()
      push('/admin-maintenance/user-management')
    }

    return outcome
  }

  const updateUser = async (id: string, data: AdminUserManagementForm) => {
    const outcome = await runAction(
      () => dispatch(updateAction({ id, data })).unwrap(),
      'User updated successfully.',
      true
    )

    if (outcome === 'success') {
      form.reset()
      push('/admin-maintenance/user-management')
    }

    return outcome
  }

  const updateUserStatus = async (id: string, data: AdminUserManagementForm) => {
    const isLocking = (data as any)?.isLocked === 'Y'

    return runAction(
      () => dispatch(updateStatusAction({ id, data })).unwrap(),
      isLocking ? 'User locked successfully.' : 'User unlocked successfully.'
    )
  }

  const updateUsername = async (id: string) => {
    return runAction(() => dispatch(updateUsernameAction(id)).unwrap(), 'Username updated successfully.')
  }

  const deleteUser = async (id: string) => {
    const result = await dispatch(deleteAction({ id }))

    if (deleteAction.fulfilled.match(result)) {
      handleModal(null)
    }
  }

  const exportUsers = async () => {
    csvDownload('user', store.entities)
  }

  return {
    form,
    store,
    addUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    exportUsers,
    clickedModule,
    setClickedModule,
    updateUserStatus,
    checkUsername,
    updateUsername,
    setAddUserData,
    addUserData,
    getRolesById,
    responseInfo,
    setResponseInfo,
    handleCloseResponse,
    dispatch
  }
}