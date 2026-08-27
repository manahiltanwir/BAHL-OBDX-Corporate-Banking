import { useEffect, useMemo } from 'react'

// ** Third Party Imports
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Import Custom hooks
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'

// ** import custom hooks
import { RootState, AppDispatch } from 'src/store'

import { viewStatementSchema } from 'src/@core/schema'

// ** types
import { GetParams } from 'src/services/service'
import { ViewStatementForm, ViewStatementKeys, ViewStatementApi } from 'src/types/apps/viewStatement'

// ** import API services
import { csvDownload } from 'src/@core/helper/csv-export'

// ** Actions Imports
import {
  fetchAllAction,
  fetchOneAction,
  addAction,
  updateAction,
  deleteAction,
} from 'src/store/apps/view-statement'
import { setFormValues } from 'src/@core/helper/setFormValues'

const defaultValues: ViewStatementForm = {
  accountNumber: "",
  id:'',
  image:'',
  createdAt: new Date()
}

export const useViewStatement = (serviceId: string | null) => {
  // ** Hook
  const { handleDrawer, handleModal } = useToggleDrawer()
  const store = useSelector((state: RootState) => state.viewStatement)
  const dispatch = useDispatch<AppDispatch>()

  const form = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(viewStatementSchema.add)
  })

  useEffect(() => {
    serviceId && dispatch(fetchOneAction({ id: serviceId }))
  }, [serviceId])

  // const HOF = <ObjKeys, ObjApi>(entity: ObjApi, setValue: (key: ObjKeys, value: string) => void) => { // {[key: string]: string}
  //   // @ts-ignore
  //   Object.keys(entity).forEach((key) => {
  //     // @ts-ignore
  //     setValue(key, value)
  //   })
  // }

  useMemo(() => {
    if ('id' in store.entity && store.entity && serviceId) {

      // HOF<ViewStatementKeys, ViewStatementApi>(store.entity, (key, value) => {
      //   form.setValue(key, value)
      // })

      setFormValues<ViewStatementKeys, ViewStatementApi>(store.entity as any, (key, value) => {
        form.setValue(key, value)
      })
      // // @ts-ignore // FIX_LATER
      // Object.keys(store.entity).forEach((key: ViewStatementKeys) => {
      //   `id` in store.entity && form.setValue(key, store.entity[key])
      // });

    } else {
      form.reset()
    }
  }, [store.entity, serviceId])

  const getViewStatement = async (id: string) => {
    dispatch(fetchOneAction({ id }))
  }

  const getViewStatements = async (id: string) => {
    dispatch(fetchAllAction(id))
  }

  const addViewStatement = async (data: ViewStatementForm) => {
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

  const updateViewStatement = async (id: string, data: ViewStatementForm) => {
    dispatch(updateAction({ id, data })).then(({ payload }: any) => {
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

  const deleteViewStatement = async (id: string) => {
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

  const exportViewStatement = async () => {
    csvDownload('view-statement', store.entities)
  }

  return {
    form,
    store,
    getViewStatement,
    getViewStatements,
    addViewStatement,
    updateViewStatement,
    deleteViewStatement,
    exportViewStatement,
  }
}
