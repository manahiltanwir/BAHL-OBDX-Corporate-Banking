import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  fetchEnterpriseRolesAction,
  fetchRolesByEnterpriseRoleAction,
  createRoleAction,
  fetchComponentMappingAction,
  updateComponentMappingAction,
  clearComponentMappingForRole
} from 'src/store/apps/role-transaction-mapping'
import { ComponentNode } from 'src/types/apps/roleTransactionMapping'

const matchesSearch = (value: string, search: string) => value.toLowerCase().includes(search.trim().toLowerCase())



const collectLeaves = (node: ComponentNode): ComponentNode[] => {
  if (!node.components || node.components.length === 0) return node.component ? [node] : []
  return node.components.flatMap(collectLeaves)
}

const filterTree = (nodes: ComponentNode[], search: string): ComponentNode[] => {
  if (!search.trim()) return nodes
  return nodes.reduce<ComponentNode[]>((acc, node) => {
    if (matchesSearch(node.name, search)) {
      acc.push(node)
      return acc
    }
    const children = filterTree(node.components ?? [], search)
    if (children.length > 0) acc.push({ ...node, components: children })
    return acc
  }, [])
}

export const useRoleTransactionComponentMapping = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.roleTransactionMapping)

  const [enterpriseSearch, setEnterpriseSearch] = useState('')
  const [roleSearch, setRoleSearch] = useState('')
  const [componentSearch, setComponentSearch] = useState('')
  const [selectedEnterpriseRoleId, setSelectedEnterpriseRoleId] = useState<number | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
  const [pendingChanges, setPendingChanges] = useState<Record<number, boolean>>({})
  const [isSavingMapping, setIsSavingMapping] = useState(false)
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
  const [isCreatingRole, setIsCreatingRole] = useState(false)

  useEffect(() => {
    if (store.enterpriseRoles.length === 0) {
      dispatch(fetchEnterpriseRolesAction())
    }
  }, [])

  const filteredEnterpriseRoles = useMemo(
    () => store.enterpriseRoles.filter(role => matchesSearch(role.enterpriseRole, enterpriseSearch)),
    [store.enterpriseRoles, enterpriseSearch]
  )

  const roles = selectedEnterpriseRoleId ? store.rolesByEnterpriseRoleId[selectedEnterpriseRoleId] ?? [] : []
  const filteredRoles = useMemo(() => roles.filter(role => matchesSearch(role.roleName, roleSearch)), [roles, roleSearch])

  const tree: ComponentNode[] = selectedRoleId ? store.componentMappingByRoleId[selectedRoleId] ?? [] : []
  const filteredTree = useMemo(() => filterTree(tree, componentSearch), [tree, componentSearch])

  const originalById = useMemo(() => {
    const map: Record<number, boolean> = {}
    tree.forEach(node => collectLeaves(node).forEach(leaf => (map[leaf.id] = leaf.mapped)))
    return map
  }, [tree])

  const parentById = useMemo(() => {
    const map: Record<number, number | null> = {}
    const walk = (node: ComponentNode) => {
      map[node.id] = node.parentId
      node.components?.forEach(walk)
    }
    tree.forEach(walk)
    return map
  }, [tree])

  const nodeById = useMemo(() => {
    const map: Record<number, ComponentNode> = {}
    const walk = (node: ComponentNode) => {
      map[node.id] = node
      node.components?.forEach(walk)
    }
    tree.forEach(walk)
    return map
  }, [tree])

  const isLeafChecked = (id: number) => pendingChanges[id] ?? originalById[id] ?? false

  const getNodeState = (node: ComponentNode) => {
    const leaves = collectLeaves(node)
    const total = leaves.length
    const checkedCount = leaves.filter(leaf => isLeafChecked(leaf.id)).length
    return {
      total,
      checkedCount,
      checked: total > 0 && checkedCount === total,
      indeterminate: checkedCount > 0 && checkedCount < total,
      disabled: total === 0
    }
  }

  const toggleNode = (node: ComponentNode) => {
    const leaves = collectLeaves(node)
    if (leaves.length === 0) return
    const target = !leaves.every(leaf => isLeafChecked(leaf.id))

    setPendingChanges(previous => {
      const next = { ...previous }
      leaves.forEach(leaf => {
        if (target === (originalById[leaf.id] ?? false)) {
          delete next[leaf.id]
        } else {
          next[leaf.id] = target
        }
      })
      return next
    })
  }

  const hasPendingChanges = Object.keys(pendingChanges).length > 0

  const selectEnterpriseRole = (enterpriseRoleId: number) => {
    setSelectedEnterpriseRoleId(enterpriseRoleId)
    setSelectedRoleId(null)
    setPendingChanges({})
    setRoleSearch('')
    setComponentSearch('')

    if (!store.rolesByEnterpriseRoleId[enterpriseRoleId]) {
      dispatch(fetchRolesByEnterpriseRoleAction({ enterpriseRoleId }))
    }
  }

  const selectRole = (roleId: number) => {
    setSelectedRoleId(roleId)
    setPendingChanges({})
    setComponentSearch('')

    if (selectedEnterpriseRoleId && !store.componentMappingByRoleId[roleId]) {
      dispatch(fetchComponentMappingAction({ roleId, enterpriseRoleId: selectedEnterpriseRoleId }))
    }
  }

  const openCreateRole = () => setIsCreateRoleOpen(true)
  const closeCreateRole = () => setIsCreateRoleOpen(false)

  const submitCreateRole = async (roleName: string, createdBy: string) => {
    const trimmedName = roleName.trim()
    if (!trimmedName || !selectedEnterpriseRoleId) return

    setIsCreatingRole(true)

    try {
      await dispatch(
        createRoleAction({
          data: {
            roles: [
              {
                enterpriseRoleId: String(selectedEnterpriseRoleId),
                roleName: trimmedName,
                createdBy
              }
            ]
          }
        })
      ).unwrap()
    } catch (error) {
      setIsCreatingRole(false)

      return
    }

    try {
      await dispatch(fetchRolesByEnterpriseRoleAction({ enterpriseRoleId: selectedEnterpriseRoleId })).unwrap()
    } catch (e) { }

    setIsCreateRoleOpen(false)
    setIsCreatingRole(false)
  }

  const saveMapping = async (updatedBy: string) => {
    if (!selectedRoleId || !selectedEnterpriseRoleId || !hasPendingChanges) return

    const changesMap = new Map<number, 'MAP' | 'UNMAP'>()

    Object.entries(pendingChanges).forEach(([componentId, isMapped]) => {
      changesMap.set(Number(componentId), isMapped ? 'MAP' : 'UNMAP')
    })

    Object.entries(pendingChanges).forEach(([componentId, isMapped]) => {
      if (!isMapped) return
      let currentParentId = parentById[Number(componentId)] ?? null
      while (currentParentId !== null && currentParentId !== undefined) {
        changesMap.set(currentParentId, 'MAP')
        currentParentId = parentById[currentParentId] ?? null
      }
    })

    const hasAnyMappedLeaf = (node: ComponentNode): boolean => {
      const leaves = collectLeaves(node)

      return leaves.some(leaf => {
        if (changesMap.has(leaf.id)) return changesMap.get(leaf.id) === 'MAP'

        return originalById[leaf.id] ?? false
      })
    }

    Object.entries(pendingChanges).forEach(([componentId, isMapped]) => {
      if (isMapped) return
      let currentParentId = parentById[Number(componentId)] ?? null
      while (currentParentId !== null && currentParentId !== undefined) {
        const parentNode = nodeById[currentParentId]
        if (parentNode && !hasAnyMappedLeaf(parentNode)) {
          changesMap.set(currentParentId, 'UNMAP')
          currentParentId = parentById[currentParentId] ?? null
        } else {
          break
        }
      }
    })

    const components = Array.from(changesMap.entries()).map(([componentId, actionType]) => ({
      componentId,
      actionType
    }))

    setIsSavingMapping(true)

    try {
      await dispatch(
        updateComponentMappingAction({ data: { roleId: selectedRoleId, components, updatedBy } })
      ).unwrap()
    } catch (error) {
      setIsSavingMapping(false)

      return
    }

    try {
      dispatch(clearComponentMappingForRole(selectedRoleId))
      await dispatch(
        fetchComponentMappingAction({ roleId: selectedRoleId, enterpriseRoleId: selectedEnterpriseRoleId })
      ).unwrap()
    } catch (e) { }

    setPendingChanges({})
    setIsSavingMapping(false)
  }

  const discardChanges = () => setPendingChanges({})


  return {
    store,

    enterpriseSearch,
    setEnterpriseSearch,
    roleSearch,
    setRoleSearch,
    componentSearch,
    setComponentSearch,

    filteredEnterpriseRoles,
    filteredRoles,
    filteredTree,

    selectedEnterpriseRoleId,
    selectedRoleId,
    selectEnterpriseRole,
    selectRole,

    isCreateRoleOpen,
    isCreatingRole,
    openCreateRole,
    closeCreateRole,
    submitCreateRole,

    getNodeState,
    toggleNode,
    hasPendingChanges,
    isSavingMapping,
    saveMapping,
    discardChanges,
  }
}