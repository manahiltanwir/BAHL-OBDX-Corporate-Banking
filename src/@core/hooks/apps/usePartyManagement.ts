import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { RootState, AppDispatch } from 'src/store'
import { partyManagementSchema } from 'src/@core/schema'
import { GetParams } from 'src/services/service'
import { PartyManagementForm, PartyManagementKeys, PartyPreferences } from 'src/types/apps/partyManagement'
import { csvDownload } from 'src/@core/helper/csv-export'
import {
  fetchAllAction,
  fetchOneAction,
  addAction,
  updateAction,
  deleteAction
} from 'src/store/apps/party-management'
import { setFormValues } from 'src/@core/helper/setFormValues'
import { ApiResponseInfo } from 'src/@core/components/ApiResponseDialog'

const defaultValues: PartyManagementForm = {
  alreadyExist: false,
  partyId: '',
  partyName: '',
  statusReason: '',
  partyStatus: ''
}

const GRACE_PERIOD_MIN = 1
const GRACE_PERIOD_MAX = 30

const isPendingApproval = (res: any) => {
  const s = String(res?.status ?? res?.data?.status ?? '').toUpperCase()

  return s.includes('PENDING') || !!res?.workflowId || !!res?.data?.workflowId
}

export const usePartyManagement = (serviceId: string | null) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showBalance, setShowBalance] = useState(true)
  const [showAccountNumber, setShowAccountNumber] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [statusEnabled, setStatusEnabled] = useState(true)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [preferences, setPreferences] = useState<PartyPreferences>({
    channelAccess: 'enable',
    corporateAdminFacility: 'disable',
    gracePeriod: '1'
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [gracePeriodError, setGracePeriodError] = useState(false)
  const [cardAnimating, setCardAnimating] = useState(false)
  const [responseInfo, setResponseInfo] = useState<ApiResponseInfo | null>(null)
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

  useMemo(() => {
    if (store.entity && 'partyId' in store.entity && serviceId) {
      setFormValues<PartyManagementKeys, PartyManagementForm>(store.entity, (key, value) => {
        form.setValue(key, value)
      })
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

  const handleBack = () => {
    setIsEditing(false)
    setIsCreatingNew(false)
  }

  const updateParty = async (
    partyId: string,
    data: PartyManagementForm | any,
    method: 'put' | 'post' = 'put'
  ) => {
    try {
      const result: any = await dispatch(updateAction({ partyId, data, method })).unwrap()

      if (isPendingApproval(result)) {
        // Maker-checker: sirf modal, toast nahi.
        // Change abhi apply nahi hua, isliye switch ko purani (store wali) value par wapas karo.
        setResponseInfo(result)
        const entity: any = store.entity
        setStatusEnabled(entity?.partyStatus !== 'INACTIVE')
      } else if (result?.message) {
        // Rule nahi laga: sirf API ka message toast mein
        toast.success(result.message)
      }

      handleDrawer(null)
      setIsEditing(false)
      setIsCreatingNew(false)
    } catch (error: any) {
      // Fail: sirf modal, edit mode mein hi rahega taake dobara try kar sake
      setResponseInfo({
        status: 'FAILED',
        message: typeof error === 'string' ? error : error?.message
      })
    }
  }

  const handleCloseResponse = () => {
    setResponseInfo(null)
  }

  const handleSavePreferences = () => {
    const entity: any = store.entity
    const partyId = entity?.partyId
    if (!partyId) return

    const partyStatus = statusEnabled ? 'ACTIVE' : 'INACTIVE'

    if (entity?.alreadyExist) {
      updateParty(
        partyId,
        {
          partyId,
          partyName: entity.partyName,
          partyStatus,
          statusReason: entity?.partyId
        },
        'put'
      )
    } else {
      updateParty(
        partyId,
        {
          partyId,
          partyName: entity.partyName,
          partyStatus
        },
        'post'
      )
    }
  }

  const getParty = async (id: string) => {
    dispatch(fetchOneAction({ id }))
      .then((res: any) => {
        if (res?.error) {
          setShowResults(false)
        } else {
          setShowResults(true)
          setStatusEnabled(res.payload?.partyStatus !== 'INACTIVE')
        }
      })
      .catch(() => {})
  }

  const getAll = async ({ query }: GetParams) => {
    dispatch(fetchAllAction({ query }))
  }

  const addParty = async (data: PartyManagementForm) => {
    dispatch(addAction({ data })).then(({ payload }: any) => {
      if (payload?.statusCode === '10000') {
        form.reset()
        handleDrawer(null)
      }
    })
  }

  const deleteParty = async (id: string) => {
    dispatch(deleteAction({ id })).then(({ payload }: any) => {
      if (payload?.statusCode === '10000') {
        handleModal(null)
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
    responseInfo,
    handleCloseResponse,
    dispatch
  }
}