import React, { useState, useMemo, createContext } from 'react'
import { ModalType } from 'src/types'

export interface DrawerContextValue {
  serviceId: string | null

  isDrawerOpen: boolean
  toggleDrawer: (id: string | null) => void
  closeDrawer: () => void

  modalType: ModalType
  isModalOpen: boolean
  toggleModal: (id: string | null, type?: ModalType) => void
  closeModal: () => void

  view: 'TABLE' | 'CARD'
  toggleView: () => void
}

// create context
// @ts-ignore
export const DrawerContext = createContext<DrawerContextValue>({})

export const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalType, setModalType] = useState<DrawerContextValue['modalType']>(ModalType.DEFAULT)
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [view, setView] = useState<DrawerContextValue['view']>('TABLE')

  const closeDrawer: DrawerContextValue['closeDrawer'] = () => {
    setServiceId(null)
    setIsDrawerOpen(false)
  }
  const toggleDrawer: DrawerContextValue['toggleDrawer'] = id => {
    setServiceId(id)
    setIsDrawerOpen(drawer => !drawer)
  }

  const closeModal: DrawerContextValue['closeModal'] = () => {
    setServiceId(null)
    setModalType(ModalType.DEFAULT)
    setIsModalOpen(false)
  }
  const toggleModal: DrawerContextValue['toggleModal'] = (id, type) => {
    setServiceId(id)
    setModalType(type || ModalType.DEFAULT)
    setIsModalOpen(modal => !modal)
  }

  const toggleView: DrawerContextValue['toggleView'] = () => {
    setView(view => (view === 'TABLE' ? 'CARD' : 'TABLE'))
  }

  const value = useMemo(
    () => ({
      serviceId,

      isDrawerOpen,
      toggleDrawer,
      closeDrawer,

      modalType,
      isModalOpen,
      toggleModal,
      closeModal,

      view,
      toggleView
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDrawerOpen, isModalOpen, view]
  )

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
}
