import { useEffect, useMemo, useState } from 'react'

// ** Third Party Imports
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Import Custom hooks
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'

// ** import custom hooks
import { RootState, AppDispatch } from 'src/store'

import { userManagementSchema } from 'src/@core/schema'

// ** types
import { GetParams } from 'src/services/service'
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
} from 'src/store/apps/userManagement'
import { setFormValues } from 'src/@core/helper/setFormValues'

const defaultValues: UserManagementForm = {
  partyId: '',
  username: "batman9099",
  userId: "",
  mobileNumber: '',
  firstName: "",
  lastName: '',
  email: '',
  passport: '',
}

export const useUserManagement = (serviceId: string | null) => {
  // ** Hook
  const [clickedModule, setClickedModule] = useState<"resetPassword" | "resetUsername" | "InactiveUser" | "activeUser" | ''>('')
  const { handleDrawer, handleModal } = useToggleDrawer()
  const [addUserData, setAddUserData] = useState<any>(null)
  const store = useSelector((state: RootState) => state.userManagement)
  const dispatch = useDispatch<AppDispatch>()

  const form = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(userManagementSchema.add)
  })

  useEffect(() => {
    // serviceId && dispatch(fetchOneAction({ id: serviceId }))
  }, [serviceId])

  // const HOF = <ObjKeys, ObjApi>(entity: ObjApi, setValue: (key: ObjKeys, value: string) => void) => { // {[key: string]: string}
  //   // @ts-ignore
  //   Object.keys(entity).forEach((key) => {
  //     // @ts-ignore
  //     setValue(key, value)
  //   })
  // }

  useMemo(() => {
    console.log('In Memo');

    if ('id' in store.entity && store.entity.userDTO && serviceId) {

      // HOF<CategoryKeys, CategoryApi>(store.entity, (key, value) => {
      //   form.setValue(key, value)
      // })



      setFormValues<UserManagementKeys, UserManagementApi>(store.entity, (key, value) => {
        form.setValue(key, value)
      })
      // // @ts-ignore // FIX_LATER
      // Object.keys(store.entity).forEach((key: CategoryKeys) => {
      //   `id` in store.entity && form.setValue(key, store.entity[key])
      // });

    } else {
      form.reset()
    }
  }, [store.entity, serviceId])

  const getUser = async (id: String) => {
    dispatch(fetchOneAction(id as string))
  }

  const checkUsername = async (username: String) => {
    return dispatch(fetchOneActionForUsername(username as string))
  }

  const getUsers = async (data: UserManagementForm) => {
    dispatch(fetchAllAction(data))
  }

  const addUser = async (data: UserManagementForm) => {
    dispatch(addAction({ data })).then(({ payload }: any) => {
      if (payload?.statusCode === '10000') {
        form.reset()
        handleDrawer(null)
      } else {
        // console.log('============API_ERROR===============')
        // console.log(payload)
        // console.log('====================================')
      }
    })
  }

  const updateUser = async (id: string, data: UserManagementForm) => {
    dispatch(updateAction({ id, data })).then(({ payload }: any) => {
      debugger
      if (payload?.statusCode === '10000') {
        form.reset()
        handleDrawer(null)
      } else {
        // console.log('============API_ERROR===============')
        // console.log(payload)
        // console.log('====================================')
      }
    })
  }

  const updateUserStatus = async (id: string, data: UserManagementForm) => {
    dispatch(updateStatusAction({ id, data })).then(({ payload }: any) => {
      console.log(payload + ' in hook');

      if (payload?.statusCode === '10000') {
        form.reset()
        handleDrawer(null)
      } else {
        // console.log('============API_ERROR===============')
        // console.log(payload)
        // console.log('====================================')
      }
    })
  }

  const updateUsername = async (id: string) => {
    dispatch(updateUsernameAction(id)).then(({ payload }: any) => {
      console.log(payload + ' in hook');

      // if (payload?.statusCode === '10000') {
      //   form.reset()
      //   handleDrawer(null)
      // } else {
      //   // console.log('============API_ERROR===============')
      //   // console.log(payload)
      //   // console.log('====================================')
      // }
    })
  }

  const deleteUser = async (id: string) => {
    dispatch(deleteAction({ id })).then(({ payload }: any) => {
      if (payload?.statusCode === '10000') {
        handleModal(null)
      } else {
        // console.log('============API_ERROR===============')
        // console.log(payload)
        // console.log('====================================')
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
    addUserData
  }
}
