import { useEffect, useState } from 'react'

// ** Third Party Imports
import { useForm } from 'react-hook-form'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { RootState, AppDispatch } from 'src/store'

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

export const useAdminUserManagement = (serviceId: string | null) => {
  const [clickedModule, setClickedModule] = useState<
    'resetPassword' | 'resetUsername' | 'InactiveUser' | 'activeUser' | ''
  >('')
  const { handleModal } = useToggleDrawer()
  const [addUserData, setAddUserData] = useState<any>(null)
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
    const result = await dispatch(addAction({ data }))

    if (addAction.fulfilled.match(result)) {
      form.reset()
      push('/admin-maintenance/user-management')
    }
  }

  const updateUser = async (id: string, data: AdminUserManagementForm) => {
    const result = await dispatch(updateAction({ id, data }))

    if (updateAction.fulfilled.match(result)) {
      form.reset()
      push('/admin-maintenance/user-management')
    }
  }

  const updateUserStatus = async (id: string, data: AdminUserManagementForm) => {
    return dispatch(updateStatusAction({ id, data }))
  }

  const updateUsername = async (id: string) => {
    return dispatch(updateUsernameAction(id))
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
    dispatch
  }
}