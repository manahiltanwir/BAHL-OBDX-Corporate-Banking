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

import { partyManagementSchema } from 'src/@core/schema'

// ** types
import { GetParams } from 'src/services/service'
import { PartyManagementForm, PartyManagementKeys, PartyManagementApi, PartyPreferences } from 'src/types/apps/partyManagement'

// ** import API services
import { csvDownload } from 'src/@core/helper/csv-export'

// ** Actions Imports
import {
  fetchAllAction,
  fetchOneAction,
  addAction,
  updateAction,
  deleteAction,
} from 'src/store/apps/party-management'
import { setFormValues } from 'src/@core/helper/setFormValues'

const defaultValues: PartyManagementForm = {
  alreadyExist: false,
  partyId: 'CN',
  partyName: '',
  statusReason: '',
  partyStatus: ''
}

// ** Grace Period Constraints
const GRACE_PERIOD_MIN = 1
const GRACE_PERIOD_MAX = 30


export const usePartyManagement = (serviceId: string | null) => {
  // ** Hook
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  const [showAccountNumber, setShowAccountNumber] = useState(true);
  const [showResults, setShowResults] = useState(false)
  const [statusEnabled, setStatusEnabled] = useState(true)
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [preferences, setPreferences] = useState<PartyPreferences>({
    channelAccess: 'enable',
    corporateAdminFacility: 'disable',
    gracePeriod: '1'

  })

  const [isEditing, setIsEditing] = useState(false)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [gracePeriodError, setGracePeriodError] = useState(false)
  const [cardAnimating, setCardAnimating] = useState(false);
  const { handleDrawer, handleModal } = useToggleDrawer()
  const store = useSelector((state: RootState) => state.partyManagement)

  const dispatch = useDispatch<AppDispatch>()

  const form = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(partyManagementSchema.add)
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
    if (store.entity && 'partyId' in store.entity && serviceId) {

      // HOF<DashboardKeys, DashboardApi>(store.entity, (key, value) => {
      //   form.setValue(key, value)
      // })

      setFormValues<PartyManagementKeys, PartyManagementForm>(store.entity, (key, value) => {
        form.setValue(key, value)
      })
      // // @ts-ignore // FIX_LATER
      // Object.keys(store.entity).forEach((key: DashboardKeys) => {
      //   `id` in store.entity && form.setValue(key, store.entity[key])
      // });

    } else {
      form.reset()
    }
  }, [store.entity, serviceId])

  const handleCancelEdit = () => {
    setIsEditing(false)
    setIsCreatingNew(false)
  }

  const handleEdit = () => {
    setIsCreatingNew(false)
    setIsEditing(true)
  }

  const handleSavePreferences = () => {

    if (statusEnabled) {
      updateParty(store.entity.partyId, { partyStatus: "ACTIVE" })
    } else {
      updateParty(store.entity?.partyId, { partyStatus: "INACTIVE" })
    }
  }

  const handleBack = () => {
    setIsEditing(false)
    setIsCreatingNew(false)
  }

  const getParty = async (id: string) => {
    dispatch(fetchOneAction({ id })).then((res: any) => {
      if (res && res.error) {
        setShowResults(false)
      } else {
        setShowResults(true)
        setStatusEnabled(store.entity.partyStatus == 'INACTIVE' ? false : true)
      }
    }).catch((err) => {

    })
  }

  const getAll = async ({ query }: GetParams) => {
    dispatch(fetchAllAction({ query }))
  }

  const addParty = async (data: PartyManagementForm) => {
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

  const updateParty = async (partyId: string, data: PartyManagementForm | any) => {
    dispatch(updateAction({ partyId, data })).then((res: any) => {
      form.reset()
      handleDrawer(null)
      const numericValue = Number(preferences.gracePeriod)
      if (
        preferences.gracePeriod.trim() === '' ||
        Number.isNaN(numericValue) ||
        numericValue < GRACE_PERIOD_MIN ||
        numericValue > GRACE_PERIOD_MAX
      ) {
        setGracePeriodError(true)
        return
      }

      setIsEditing(false)
      setIsCreatingNew(false)
    })
  }

  const deleteParty = async (id: string) => {
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
    csvDownload('party-management', store.entities)
  }

  return {
    form,
    store,
    getParty,
    getAll,
    addParty,
    updateParty,
    deleteParty,
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
    setCardAnimating,
    showResults,
    setShowResults,
    statusEnabled,
    setStatusEnabled,
    preferences,
    setPreferences,
    GRACE_PERIOD_MIN,
    GRACE_PERIOD_MAX,
    gracePeriodError,
    setGracePeriodError,
    isCreatingNew,
    setIsCreatingNew,
    isEditing,
    setIsEditing,
    handleCancelEdit,
    handleSavePreferences,
    handleBack,
    handleEdit,
    dispatch
  }
}
