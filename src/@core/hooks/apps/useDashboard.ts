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

import { dashboardSchema } from 'src/@core/schema'

// ** types
import { GetParams } from 'src/services/service'
import { DashboardForm, DashboardKeys, DashboardApi } from 'src/types/apps/dashboard'

// ** import API services
import { csvDownload } from 'src/@core/helper/csv-export'

// ** Actions Imports
import {
  fetchAllAction,
  fetchOneAction,
  addAction,
  updateAction,
  deleteAction,
} from 'src/store/apps/dashboard'
import { setFormValues } from 'src/@core/helper/setFormValues'

const defaultValues: DashboardForm = {
  name: "",
  order: 1,
  title: "",
  status: "PUBLIC",
  id: "",
  image: "",
}

export const useDashboard = (serviceId: string | null) => {
  // ** Hook
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  const [showAccountNumber, setShowAccountNumber] = useState(true);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [cardAnimating, setCardAnimating] = useState(false);
  const { handleDrawer, handleModal } = useToggleDrawer()
  const store = useSelector((state: RootState) => state.dashboard)
  const dispatch = useDispatch<AppDispatch>()

  const form = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(dashboardSchema.add)
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

  const getDashboard = async (id: string) => {
    dispatch(fetchOneAction({ id }))
  }

  const getAll = async (userId: string) => {
    dispatch(fetchAllAction(userId))
  }

  const addDashboard = async (data: DashboardForm) => {
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

  const updateDashboard = async (id: string, data: DashboardForm) => {
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

  const deleteDashboard = async (id: string) => {
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
    csvDownload('dashboard', store.entities)
  }

  return {
    form,
    store,
    getDashboard,
    getAll,
    addDashboard,
    updateDashboard,
    deleteDashboard,
    exportAll,
    activeIndex,
    setActiveIndex,
    showBalance,
    setShowBalance,
    showAccountNumber,
    setShowAccountNumber,
    direction,
    setDirection,
    cardAnimating,
    setCardAnimating
  }
}
