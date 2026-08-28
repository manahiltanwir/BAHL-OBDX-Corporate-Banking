import { useState } from 'react'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'

import {
  searchWorkflowPartyUsersAction,
  resetWorkflowPartySearch,
  searchWorkflowsByPartyAction,
  getWorkflowByIdAction,
  resetEditWorkflow
} from 'src/store/apps/work-flow-management'

export type WorkflowPartySearchStatus = 'idle' | 'searching' | 'found' | 'not-found' | 'error'

export const useWorkflowPartySearch = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.workflowPartySearch)
  const [status, setStatus] = useState<WorkflowPartySearchStatus>('idle')
  const searchParty = async (rawPartyId: string) => {
    const partyId = rawPartyId.trim()
    if (!partyId) return

    setStatus('searching')

    try {
      const res: any = await dispatch(searchWorkflowPartyUsersAction({ partyId }))

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
    dispatch(resetWorkflowPartySearch())
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

export const useWorkflowSearch = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.workflowPartySearch)

  const searchWorkflows = async (rawPartyId: string) => {
    const partyId = rawPartyId.trim()
    if (!partyId) return

    await dispatch(searchWorkflowsByPartyAction({ partyId }))
  }

  return {
    results: store.workflowList,
    status: store.workflowListStatus, 
    searchWorkflows
  }
}

export const useWorkflowById = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.workflowPartySearch)

  const fetchWorkflow = async (id: string | number) => {
    await dispatch(getWorkflowByIdAction(id))
  }

  const resetWorkflow = () => {
    dispatch(resetEditWorkflow())
  }

  return {
    workflow: store.editWorkflow,
    status: store.editWorkflowStatus, 
    fetchWorkflow,
    resetWorkflow
  }
}