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

// Sirf leaf nodes (jin ke children nahi aur component value hai) map hote hain
const collectLeaves = (node: ComponentNode): ComponentNode[] => {
  if (!node.components || node.components.length === 0) return node.component ? [node] : []
  return node.components.flatMap(collectLeaves)
}

// Search: agar node ka naam match kare to poora node, warna sirf matching children
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

  // ---------- COMPONENT TREE ----------
  const tree: ComponentNode[] = selectedRoleId ? store.componentMappingByRoleId[selectedRoleId] ?? [] : []
  const filteredTree = useMemo(() => filterTree(tree, componentSearch), [tree, componentSearch])

  // Server se aayi hui original mapped state (leaf id -> mapped)
  const originalById = useMemo(() => {
    const map: Record<number, boolean> = {}
    tree.forEach(node => collectLeaves(node).forEach(leaf => (map[leaf.id] = leaf.mapped)))
    return map
  }, [tree])

  const isLeafChecked = (id: number) => pendingChanges[id] ?? originalById[id] ?? false

  // Har node (leaf ya parent) ka checkbox state
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

  // Node toggle: agar saare leaves checked hain to sab uncheck, warna sab check
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

  // ---------- SELECTION HANDLERS ----------
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

    if (!store.componentMappingByRoleId[roleId]) {
      dispatch(fetchComponentMappingAction({ roleId }))
    }
  }

  // ---------- CREATE ROLE ----------
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

      await dispatch(fetchRolesByEnterpriseRoleAction({ enterpriseRoleId: selectedEnterpriseRoleId })).unwrap()
      setIsCreateRoleOpen(false)
    } catch (error) {
    } finally {
      setIsCreatingRole(false)
    }
  }

  // ---------- POST /role-task-service/component-role-mapping ----------
  const saveMapping = async (updatedBy: string) => {
    if (!selectedRoleId || !hasPendingChanges) return

    const components = Object.entries(pendingChanges).map(([componentId, isMapped]) => ({
      componentId: Number(componentId),
      actionType: isMapped ? ('MAP' as const) : ('UNMAP' as const)
    }))

    setIsSavingMapping(true)
    try {
      await dispatch(
        updateComponentMappingAction({ data: { roleId: selectedRoleId, components, updatedBy } })
      ).unwrap()

      dispatch(clearComponentMappingForRole(selectedRoleId))
      await dispatch(fetchComponentMappingAction({ roleId: selectedRoleId })).unwrap()
      setPendingChanges({})
    } catch (error) {
    } finally {
      setIsSavingMapping(false)
    }
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
    discardChanges
  }
}