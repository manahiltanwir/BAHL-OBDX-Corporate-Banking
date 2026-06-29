import { useContext, useMemo } from 'react'
import { DrawerContext } from 'src/@core/context/DrawerContext'
// ** types
import { ModalType } from 'src/types'

const useToggleDrawer = () => {
  const {
    serviceId,
    toggleDrawer, isDrawerOpen,
    toggleModal, isModalOpen, modalType,
    toggleView, view
  } = useContext(DrawerContext)

  const handleDrawer = (id: string | null) => toggleDrawer(id)

  const handleModal = (id: string | null, type?: ModalType) => toggleModal(id, type)

  // useEffect(() => {
  //   if (!isDrawerOpen) {
  //     setServiceId(null);
  //   }
  // }, [isDrawerOpen]);
  // useMemo(() => {
  // }, [serviceId, isDrawerOpen, isModalOpen])

  return {
    serviceId,
    isDrawerOpen,
    handleDrawer,
    modalType,
    isModalOpen,
    handleModal,
    view,
    toggleView
  }
}

export default useToggleDrawer
