import { useEffect, useState } from 'react'

export function useSelectDropdowns<TKey extends string>(keys: TKey[]) {
  const initial = keys.reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<TKey, boolean>)
  const [openMap, setOpenMap] = useState<Record<TKey, boolean>>(initial)

  const openSelect = (key: TKey) => setOpenMap(prev => ({ ...prev, [key]: true }))
  const closeSelect = (key: TKey) => setOpenMap(prev => ({ ...prev, [key]: false }))
  const closeAll = () => setOpenMap(initial)

  useEffect(() => {
    const closeAllDropdowns = (event: Event) => {
      const target = event.target as HTMLElement
      if (target?.closest?.('.MuiMenu-paper, .MuiPopover-paper, .MuiMenu-list, .MuiList-root')) {
        return
      }
      closeAll()
    }

    window.addEventListener('scroll', closeAllDropdowns, true)

    return () => window.removeEventListener('scroll', closeAllDropdowns, true)
  }, [])

  const getProps = (key: TKey) => ({
    open: openMap[key],
    onOpen: () => openSelect(key),
    onClose: () => closeSelect(key)
  })

  return { getProps, openSelect, closeSelect, closeAll }
}