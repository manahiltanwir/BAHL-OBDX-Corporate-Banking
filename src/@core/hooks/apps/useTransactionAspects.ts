import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { RootState, AppDispatch } from 'src/store'
import { transactionAspectsSchema } from 'src/@core/schema'
import { ApiResponseInfo } from 'src/@core/components/ApiResponseDialog'
import { TransactionAspectsForm, ITransactionAspects, IAspectUpdatePayload } from 'src/types/apps/transactionAspects'
import { csvDownload } from 'src/@core/helper/csv-export'
import {
  fetchAllAction,
  fetchOneAction,
  addAction,
  updateAction,
  deleteAction
} from 'src/store/apps/transaction-aspects'

const defaultValues: TransactionAspectsForm = {
  apiEndpoint: '',
  operationCode: '',
  operationName: '',
  serviceId: '',
  servicePath: '',
  taskCode: '',
  taskServiceId: 123
}

export const isPendingApproval = (res: any) => {
  const s = String(res?.status ?? res?.data?.status ?? '').toUpperCase()

  return s.includes('PENDING') || !!res?.workflowId || !!res?.data?.workflowId
}

export type ActionOutcome = 'success' | 'pending' | 'failed'

export const useTransactionAspects = (serviceId: string | null) => {
  // ** Hook
  const { handleDrawer, handleModal } = useToggleDrawer()
  const store = useSelector((state: RootState) => state.transactionAspects)
  const dispatch = useDispatch<AppDispatch>()
  const [responseInfo, setResponseInfo] = useState<ApiResponseInfo | null>(null)

  const form = useForm({
    defaultValues,
    mode: 'onChange',
    // @ts-ignore
    resolver: yupResolver(transactionAspectsSchema.update)
  })

  useEffect(() => {
    serviceId && dispatch(fetchOneAction({ id: serviceId }))
  }, [serviceId])

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
    }
  })
}

  const updateTransactionAspect = async (
    id: string,
    data: IAspectUpdatePayload[],
    selectedTransaction: ITransactionAspects | undefined
  ): Promise<ActionOutcome> => {
    let result: any

    try {
      result = await dispatch(updateAction({ id, data, selectedTransaction })).unwrap()
    } catch (error: any) {
      setResponseInfo({
        status: 'FAILED',
        message: typeof error === 'string' ? error : error?.message
      })

      return 'failed'
    }

    if (isPendingApproval(result)) {
      setResponseInfo(result?.data && typeof result.data === 'object' ? { ...result, ...result.data } : result)

      return 'pending'
    }

    const apiMessage = typeof result === 'string' ? result : result?.message
    toast.success(typeof apiMessage === 'string' && apiMessage.trim() ? apiMessage : 'Updated successfully.')

    try {
      form.reset()
      handleDrawer(null)
    } catch (e) {
      // ignore
    }

    return 'success'
  }

  const handleCloseResponse = () => setResponseInfo(null)

  const deleteTransactionAspect = async (id: string) => {
    dispatch(deleteAction({ id })).then(({ payload }: any) => {
      if (payload?.statusCode === '10000') {
        handleModal(null)
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
    responseInfo,
    handleCloseResponse
  }
}