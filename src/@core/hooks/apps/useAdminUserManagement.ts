import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { RootState, AppDispatch } from 'src/store'
import {
  AdminUserManagementApi,
  AdminUserManagementForm,
  AdminUserManagementKeys
} from 'src/types/apps/adminUserManagement'

import { csvDownload } from 'src/@core/helper/csv-export'
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


export type ActionOutcome = 'success' | 'pending' | 'failed'

export const useAdminUserManagement = (serviceId: string | null) => {
  const [clickedModule, setClickedModule] = useState<
    'resetPassword' | 'resetUsername' | 'InactiveUser' | 'activeUser' | ''
  >('')
  const { handleModal } = useToggleDrawer()
  // const [addUserData, setAddUserData] = useState<any>(null)

  // Custom hook file ke andar:
  const [addUserData, setAddUserDataState] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('add_user_form_data')
      return saved ? JSON.parse(saved) : null
    }
    return null
  })

  const setAddUserData = (data: any) => {
    if (typeof window !== 'undefined') {
      if (data === null) {
        sessionStorage.removeItem('add_user_form_data')
      } else {
        sessionStorage.setItem('add_user_form_data', JSON.stringify(data))
      }
    }
    setAddUserDataState(data)
  }

  
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
  const runAction = async (action: () => Promise<any>): Promise<ActionOutcome> => {
    try {
      await action()

      return 'success'
    } catch (error) {
      return 'failed'
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
    const outcome = await runAction(() => dispatch(addAction({ data })).unwrap())
    if (outcome === 'success') {
      form.reset()
      push('/admin-maintenance/user-management')
    }

    return outcome
  }

  const updateUser = async (id: string, data: AdminUserManagementForm) => {
    const outcome = await runAction(() => dispatch(updateAction({ id, data })).unwrap())

    if (outcome === 'success') {
      form.reset()
      push('/admin-maintenance/user-management')
    }

    return outcome
  }

  const updateUserStatus = async (id: string, data: AdminUserManagementForm) => {
    const outcome = await runAction(() => dispatch(updateStatusAction({ id, data })).unwrap())

    if (outcome === 'success') form.reset()

    return outcome
  }

  const updateUsername = async (id: string) => {
    return runAction(() => dispatch(updateUsernameAction(id)).unwrap())
  }
  const deleteUser = async (id: string) => {
    dispatch(deleteAction({ id })).then(({ payload }: any) => {
      if (payload?.statusCode === '10000') {
        handleModal(null)
      }
    })
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
    dispatch
  }
}