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

import { transactionAspectsSchema } from 'src/@core/schema'

// ** types
import { GetParams } from 'src/services/service'
import { TransactionAspectsForm, TransactionAspectsKeys, TransactionAspectsApi, IAspect, ITransactionAspects, IAspectUpdatePayload } from 'src/types/apps/transactionAspects'

// ** import API services
import { csvDownload } from 'src/@core/helper/csv-export'

// ** Actions Imports
import {
  fetchAllAction,
  fetchOneAction,
  addAction,
  updateAction,
  deleteAction
} from 'src/store/apps/transaction-aspects'
import { setFormValues } from 'src/@core/helper/setFormValues'

const defaultValues: TransactionAspectsForm = {
  apiEndpoint: '',
    operationCode: '',
    operationName: '',
    serviceId: '',
    servicePath: '',
    taskCode: '',
    taskServiceId: 123,
}

export const useTransactionAspects = (serviceId: string | null) => {
  // ** Hook
  const { handleDrawer, handleModal } = useToggleDrawer()
  const store = useSelector((state: RootState) => state.transactionAspects)
  const dispatch = useDispatch<AppDispatch>()

  const form = useForm({
    defaultValues,
    mode: 'onChange',
    // @ts-ignore
    resolver: yupResolver(transactionAspectsSchema.update)
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

  // useMemo(() => {
  //   if ('id' in store.entity && store.entity && serviceId) {

  //     // HOF<DashboardKeys, DashboardApi>(store.entity, (key, value) => {
  //     //   form.setValue(key, value)
  //     // })

  //     setFormValues<DashboardKeys, DashboardForm>(store.entity, (key, value) => {
  //       form.setValue(key, value)
  //     })
  //     // // @ts-ignore // FIX_LATER
  //     // Object.keys(store.entity).forEach((key: DashboardKeys) => {
  //     //   `id` in store.entity && form.setValue(key, store.entity[key])
  //     // });

  //   } else {
  //     form.reset()
  //   }
  // }, [store.entity, serviceId])

  const getTransactionAspect = async (id: string) => {
    dispatch(fetchOneAction({ id }))
  }

  const getAllTransactionAspects = async (userId: string) => {
    // @ts-ignore
    dispatch(fetchAllAction('123'))
  }

  const addTransactionAspect = async (data: TransactionAspectsForm) => {
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

  const updateTransactionAspect = async (
    id: string,
    data: IAspectUpdatePayload[],
    selectedTransaction: ITransactionAspects | undefined
  ) => {
    dispatch(updateAction({ id, data, selectedTransaction })).then(({ payload }: any) => {
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

  const deleteTransactionAspect = async (id: string) => {
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

  const exportAll = async () => {
    csvDownload('transaction-aspects', store.entities)
  }

  return {
    form,
    store,
    getTransactionAspect,
    getAllTransactionAspects,
    addTransactionAspect,
    updateTransactionAspect,
    deleteTransactionAspect,
    exportAll,
  }
}
