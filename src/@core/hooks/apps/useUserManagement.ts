import { useEffect, useMemo, useState } from 'react'

// ** Third Party Imports
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Import Custom hooks
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'

// ** import custom hooks
import { RootState, AppDispatch } from 'src/store'

import { userManagementSchema } from 'src/@core/schema'
import { ApiResponseInfo } from 'src/@core/components/ApiResponseDialog'

// ** types
import { UserManagementApi, UserManagementForm, UserManagementKeys } from 'src/types/apps/userManagement'

// ** import API services
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
  fetchAllActionForRoles,
  searchPartyAction,
  clearParty
} from 'src/store/apps/userManagement'
import { setFormValues } from 'src/@core/helper/setFormValues'
import { useRouter } from 'next/router'

const defaultValues: UserManagementForm = {
  partyId: '',
  username: '',
  userId: '',
  mobileNumber: '',
  firstName: '',
  lastName: '',
  email: '',
  passport: ''
}

// ** Party search form (sirf partyId)
const partySearchSchema = yup.object().shape({
  partyId: yup.string().required('Party ID is required')
})

export const isPendingApproval = (res: any) => {
  const s = String(res?.status ?? res?.data?.status ?? '').toUpperCase()

  return s.includes('PENDING') || !!res?.workflowId || !!res?.data?.workflowId
}
export type ActionOutcome = 'success' | 'pending' | 'failed'

export const useUserManagement = (serviceId: string | null) => {
  // ** Hook
  const [clickedModule, setClickedModule] = useState<
    'resetPassword' | 'resetUsername' | 'InactiveUser' | 'activeUser' | ''
  >('')
  const { handleModal } = useToggleDrawer()
  const [addUserData, setAddUserData] = useState<any>(null)
  const [responseInfo, setResponseInfo] = useState<ApiResponseInfo | null>(null)
  const [redirectOnClose, setRedirectOnClose] = useState(false)
  const store = useSelector((state: RootState) => state.userManagement)
  const dispatch = useDispatch<AppDispatch>()
  const { push } = useRouter()

  const form = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(userManagementSchema.add)
  })

  const partyForm = useForm({
    defaultValues: { partyId: '' },
    mode: 'onSubmit',
    resolver: yupResolver(partySearchSchema)
  })

  useEffect(() => {
    // serviceId && dispatch(fetchOneAction({ id: serviceId }))
  }, [serviceId])

  useMemo(() => {
    if (
      store.entity &&
      typeof store.entity === 'object' &&
      'id' in store.entity &&
      (store.entity as any).userDTO &&
      serviceId
    ) {
      setFormValues<UserManagementKeys, UserManagementApi>(store.entity, (key, value) => {
        form.setValue(key, value)
      })
    } else {
      form.reset()
    }
  }, [store.entity, serviceId])

  const runAction = async (action: () => Promise<any>, redirectIfPending = false): Promise<ActionOutcome> => {
    try {
      const result: any = await action()

      if (isPendingApproval(result)) {
        const pendingInfo: ApiResponseInfo =
          result?.data && typeof result.data === 'object' ? { ...result, ...result.data } : result

        setResponseInfo(pendingInfo)
        if (redirectIfPending) setRedirectOnClose(true)

        return 'pending'
      }

      const message = typeof result === 'string' ? result : result?.message
      if (message) toast.success(message)

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
      dispatch(clearParty())
      push('/party-maintenance/user-management')
    }
  }

  // ** Party search: GET /party-service/api/:partyId
  const searchParty = async (partyId: string) => {
    const id = partyId.trim()

    if (!id) return null

    try {
      const party: any = await dispatch(searchPartyAction(id)).unwrap()

      // Party maujood nahi to form na khule
      if (!party?.alreadyExist) {
        dispatch(clearParty())
        toast.error('Party not found')

        return null
      }

      return party
    } catch (error) {
      // Error toast slice (ApiError) pehle hi dikha chuka hai
      return null
    }
  }

  const resetParty = () => {
    dispatch(clearParty())
    partyForm.reset()
  }

  const getUser = async (id: String) => {
    dispatch(fetchOneAction(id as string))
  }

  const checkUsername = async (username: String) => {
    return dispatch(fetchOneActionForUsername(username as string))
  }

  const getUsers = async (data: UserManagementForm) => {
    return dispatch(fetchAllAction(data))
  }

  const getRolesById = async (id: String) => {
    dispatch(fetchAllActionForRoles(id))
  }

  const addUser = async (data: UserManagementForm) => {
    const outcome = await runAction(() => dispatch(addAction({ data })).unwrap(), true)

    if (outcome === 'success') {
      form.reset()
      dispatch(clearParty())
      push('/party-maintenance/user-management')
    }

    return outcome
  }

  const updateUser = async (id: string, data: UserManagementForm) => {
    const outcome = await runAction(() => dispatch(updateAction({ id, data })).unwrap(), true)

    if (outcome === 'success') {
      form.reset()
      push('/party-maintenance/user-management')
    }

    return outcome
  }

  const updateUserStatus = async (id: string, data: UserManagementForm) => {
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
    partyForm,
    party: store.party,
    searchParty,
    resetParty,
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