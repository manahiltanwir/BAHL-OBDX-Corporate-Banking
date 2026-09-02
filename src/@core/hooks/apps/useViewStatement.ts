import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { RootState, AppDispatch } from 'src/store'
import { viewStatementSchema } from 'src/@core/schema'
import { ViewStatementForm, ViewStatementKeys, ViewStatementApi } from 'src/types/apps/viewStatement'
import { csvDownload } from 'src/@core/helper/csv-export'
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
  id: '',
  image: '',
  createdAt: new Date()
}

export const useViewStatement = (serviceId: string | null) => {
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

  useEffect(() => {
    if (store.entity && 'id' in store.entity && serviceId) {
      setFormValues<ViewStatementKeys, ViewStatementApi>(store.entity as any, (key, value) => {
        form.setValue(key, value)
      })
    } else {
      form.reset()
    }
  }, [store.entity, serviceId])

  const getViewStatement = async (id: string) => {
    dispatch(fetchOneAction({ id }))
  }

  const getViewStatements = async (
    accountNumber: string,
    fromDate: string,
    toDate: string
  ) => {
    dispatch(
      fetchAllAction({
        accountNumber,
        fromDate,
        toDate
      })
    )
  }

  const addViewStatement = async (data: ViewStatementForm) => {
    dispatch(addAction({ data })).then(({ payload }: any) => {
      if (payload?.statusCode === '10000') {
        form.reset()
        handleDrawer(null)
      }
    })
  }

  const updateViewStatement = async (id: string, data: ViewStatementForm) => {
    dispatch(updateAction({ id, data })).then(({ payload }: any) => {
      if (payload?.statusCode === '10000') {
        form.reset()
        handleDrawer(null)
      }
    })
  }

  const deleteViewStatement = async (id: string) => {
    dispatch(deleteAction({ id })).then(({ payload }: any) => {
      if (payload?.statusCode === '10000') {
        handleModal(null)
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