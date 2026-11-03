import { useEffect, useMemo, useState } from 'react'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'

import { useDispatch, useSelector } from 'react-redux'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { RootState, AppDispatch } from 'src/store'
import { userManagementSchema } from 'src/@core/schema'
import { UserManagementApi, UserManagementForm, UserManagementKeys } from 'src/types/apps/userManagement'
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

const partySearchSchema = yup.object().shape({
  partyId: yup.string().required('Party ID is required')
})

export type ActionOutcome = 'success' | 'failed'

export const useUserManagement = (serviceId: string | null) => {
  const [clickedModule, setClickedModule] = useState<
    'resetPassword' | 'resetUsername' | 'InactiveUser' | 'activeUser' | ''
  >('')
  const { handleModal } = useToggleDrawer()
  const [addUserData, setAddUserData] = useState<any>(null)
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

  // Toast slice dikhati hai (success par API ka message, fail par error). Yahan sirf outcome.
  const runAction = async (action: () => Promise<any>): Promise<ActionOutcome> => {
    try {
      await action()

      return 'success'
    } catch (error) {
      return 'failed'
    }
  }

  const searchParty = async (partyId: string) => {
    const id = partyId.trim()

    if (!id) return null

    try {
      const party: any = await dispatch(searchPartyAction(id)).unwrap()

      if (!party?.alreadyExist) {
        dispatch(clearParty())
        toast.error('Party not found')

        return null
      }

      return party
    } catch (error) {
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
    const outcome = await runAction(() => dispatch(addAction({ data })).unwrap())

    if (outcome === 'success') {
      form.reset()
      dispatch(clearParty())
      push('/party-maintenance/user-management')
    }

    return outcome
  }

  const updateUser = async (id: string, data: UserManagementForm) => {
    const outcome = await runAction(() => dispatch(updateAction({ id, data })).unwrap())

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
    dispatch
  }
}