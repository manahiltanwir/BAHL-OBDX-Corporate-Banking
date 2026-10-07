import { useState } from 'react'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'

import {
  searchAdminWorkflowPartyUsersAction,
  resetAdminWorkflowPartySearch,
  searchAdminWorkflowsByCodeAction,
  getAdminWorkflowByIdAction,
  resetAdminEditWorkflow
} from 'src/store/apps/admin-workflow-management'

export type AdminWorkflowPartySearchStatus = 'idle' | 'searching' | 'found' | 'not-found' | 'error'

export const useAdminWorkflowPartySearch = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.adminWorkflowManagement)
  const [status, setStatus] = useState<AdminWorkflowPartySearchStatus>('idle')

  const searchParty = async (rawPartyId: string) => {
    const partyId = rawPartyId.trim()
    if (!partyId) return

    setStatus('searching')

    try {
      const res: any = await dispatch(searchAdminWorkflowPartyUsersAction({ partyId }))

      if (res?.error) {
        setStatus('error')

        return
      }

      if (!res.payload || res.payload.length === 0) {
        setStatus('not-found')

        return
      }

      setStatus('found')
    } catch (error) {
      setStatus('error')
    }
  }

  const resetPartySearch = () => {
    dispatch(resetAdminWorkflowPartySearch())
    setStatus('idle')
  }

  return {
    partyInfo: store.partyInfo,
    userOptions: store.userOptions,
    status,
    searchParty,
    resetPartySearch
  }
}

export const useAdminWorkflowSearch = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.adminWorkflowManagement)

  const searchWorkflows = async (rawWorkflowCode: string) => {
    const workflowCode = rawWorkflowCode.trim()
    if (!workflowCode) return

    await dispatch(searchAdminWorkflowsByCodeAction({ workflowCode }))
  }

  return {
    results: store.workflowList,
    status: store.workflowListStatus,
    searchWorkflows
  }
}

export const useAdminWorkflowById = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.adminWorkflowManagement)

  const fetchWorkflow = async (id: string | number) => {
    await dispatch(getAdminWorkflowByIdAction(id))
  }

  const resetWorkflow = () => {
    dispatch(resetAdminEditWorkflow())
  }

  return {
    workflow: store.editWorkflow,
    status: store.editWorkflowStatus,
    fetchWorkflow,
    resetWorkflow
  }
}