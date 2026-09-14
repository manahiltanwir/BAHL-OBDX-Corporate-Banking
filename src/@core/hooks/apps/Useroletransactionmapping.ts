import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
    fetchEnterpriseRolesAction,
    fetchRolesByEnterpriseRoleAction,
    createRoleAction,
    fetchAllTasksAction,
    fetchTaskServiceMappingAction,
    updateTaskServiceMappingAction,
    clearMappingForRole
} from 'src/store/apps/role-transaction-mapping'
import { MappedServiceItem, TaskApi, TaskCoverage } from 'src/types/apps/roleTransactionMapping'

const matchesSearch = (value: string, search: string) => value.toLowerCase().includes(search.trim().toLowerCase())

export const useRoleTransactionMapping = () => {
    const dispatch = useDispatch<AppDispatch>()
    const store = useSelector((state: RootState) => state.roleTransactionMapping)
    const [enterpriseSearch, setEnterpriseSearch] = useState('')
    const [roleSearch, setRoleSearch] = useState('')
    const [taskSearch, setTaskSearch] = useState('')
    const [serviceSearch, setServiceSearch] = useState('')
    const [selectedEnterpriseRoleId, setSelectedEnterpriseRoleId] = useState<number | null>(null)
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
    const [pendingChanges, setPendingChanges] = useState<Record<number, boolean>>({})
    const [isSavingMapping, setIsSavingMapping] = useState(false)
    const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
    const [isCreatingRole, setIsCreatingRole] = useState(false)
    useEffect(() => {
        if (store.enterpriseRoles.length === 0) {
            dispatch(fetchEnterpriseRolesAction())
        }
    }, [])

    useEffect(() => {
        if (store.tasks.length === 0) {
            dispatch(fetchAllTasksAction())
        }
    }, [])

    const filteredEnterpriseRoles = useMemo(
        () => store.enterpriseRoles.filter(role => matchesSearch(role.enterpriseRole, enterpriseSearch)),
        [store.enterpriseRoles, enterpriseSearch]
    )

    const roles = selectedEnterpriseRoleId ? store.rolesByEnterpriseRoleId[selectedEnterpriseRoleId] ?? [] : []
    const filteredRoles = useMemo(() => roles.filter(role => matchesSearch(role.roleName, roleSearch)), [roles, roleSearch])

    const tasks: TaskApi[] = useMemo(
        () =>
            selectedEnterpriseRoleId
                ? store.tasks.filter(task => task.enterpriseRoleId === selectedEnterpriseRoleId)
                : [],
        [store.tasks, selectedEnterpriseRoleId]
    )
    const filteredTasks = useMemo(() => tasks.filter(task => matchesSearch(task.taskName, taskSearch)), [tasks, taskSearch])

    const mapping = selectedRoleId ? store.mappingByRoleId[selectedRoleId] ?? null : null

    // ** Group the role's mapping services by taskId once, so both coverage counts
    // and the selected task's service list read from the SAME, confirmed-correct
    // source (the mapping API) instead of cross-referencing the master /tasks
    // catalog — which can be stale/incomplete for a given task's taskServices.
    const mappingServicesByTaskId = useMemo(() => {
        const map = new Map<number, MappedServiceItem[]>()
        mapping?.services.forEach(service => {
            const list = map.get(service.taskId) ?? []
            list.push(service)
            map.set(service.taskId, list)
        })
        return map
    }, [mapping])

    const coverageByTaskId = useMemo(() => {
        const result: Record<number, TaskCoverage> = {}
        tasks.forEach(task => {
            const services = mappingServicesByTaskId.get(task.id) ?? []
            const total = services.length
            const enabled = services.reduce((count, service) => {
                const desired = pendingChanges[service.taskServiceId] ?? service.isMapped
                return desired ? count + 1 : count
            }, 0)
            result[task.id] = { enabled, total }
        })
        return result
    }, [tasks, mappingServicesByTaskId, pendingChanges])

    const servicesForSelectedTask: MappedServiceItem[] = useMemo(() => {
        if (!selectedTaskId) return []
        const services = mappingServicesByTaskId.get(selectedTaskId) ?? []
        return services.filter(service => matchesSearch(service.operationName, serviceSearch))
    }, [mappingServicesByTaskId, selectedTaskId, serviceSearch])

    // ---------- SELECTION HANDLERS ----------
    const selectEnterpriseRole = (enterpriseRoleId: number) => {
        setSelectedEnterpriseRoleId(enterpriseRoleId)
        setSelectedRoleId(null)
        setSelectedTaskId(null)
        setPendingChanges({})
        setRoleSearch('')
        setTaskSearch('')
        setServiceSearch('')

        if (!store.rolesByEnterpriseRoleId[enterpriseRoleId]) {
            dispatch(fetchRolesByEnterpriseRoleAction({ enterpriseRoleId }))
        }
    }

    const selectRole = (roleId: number) => {
        setSelectedRoleId(roleId)
        setSelectedTaskId(null)
        setPendingChanges({})
        setServiceSearch('')

        if (!store.mappingByRoleId[roleId]) {
            dispatch(fetchTaskServiceMappingAction({ roleId }))
        }
    }

    const selectTask = (taskId: number) => {
        setSelectedTaskId(taskId)
        setServiceSearch('')
    }

    // ---------- CREATE ROLE (Step 3) ----------
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

    // ---------- SERVICE MAPPING TOGGLES ----------
    const toggleService = (taskServiceId: number, currentIsMapped: boolean) => {
        setPendingChanges(previous => {
            const desired = previous[taskServiceId] ?? currentIsMapped
            const flipped = !desired
            const next = { ...previous }

            if (flipped === currentIsMapped) {
                delete next[taskServiceId]
            } else {
                next[taskServiceId] = flipped
            }
            return next
        })
    }

    const toggleAllForTask = (checked: boolean) => {
        if (!selectedTaskId) return
        setPendingChanges(previous => {
            const next = { ...previous }
            servicesForSelectedTask.forEach(service => {
                if (checked === service.isMapped) {
                    delete next[service.taskServiceId]
                } else {
                    next[service.taskServiceId] = checked
                }
            })
            return next
        })
    }

    const hasPendingChanges = Object.keys(pendingChanges).length > 0

    // ---------- Step 6: POST /role-task-service/task-service-role-mapping ----------
    const saveMapping = async (updatedBy: string) => {
        if (!selectedRoleId || !hasPendingChanges) return

        const services = Object.entries(pendingChanges).map(([taskServiceId, isMapped]) => ({
            taskServiceId: Number(taskServiceId),
            actionType: isMapped ? ('map' as const) : ('unmap' as const)
        }))

        setIsSavingMapping(true)
        try {
            await dispatch(
                updateTaskServiceMappingAction({
                    data: { roleId: selectedRoleId, services, updatedBy }
                })
            ).unwrap()

            dispatch(clearMappingForRole(selectedRoleId))
            await dispatch(fetchTaskServiceMappingAction({ roleId: selectedRoleId })).unwrap()
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
        taskSearch,
        setTaskSearch,
        serviceSearch,
        setServiceSearch,

        filteredEnterpriseRoles,
        filteredRoles,
        filteredTasks,
        servicesForSelectedTask,
        coverageByTaskId,

        selectedEnterpriseRoleId,
        selectedRoleId,
        selectedTaskId,
        selectEnterpriseRole,
        selectRole,
        selectTask,

        isCreateRoleOpen,
        isCreatingRole,
        openCreateRole,
        closeCreateRole,
        submitCreateRole,

        pendingChanges,
        hasPendingChanges,
        isSavingMapping,
        toggleService,
        toggleAllForTask,
        saveMapping,
        discardChanges
    }
}