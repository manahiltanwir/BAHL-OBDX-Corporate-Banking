import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'

import {
  searchBackofficeWorkflowsByCodeAction,
  getBackofficeWorkflowByIdAction,
  resetBackofficeEditWorkflow,
  fetchBackofficeUsersAction
} from 'src/store/apps/backoffice-workflow-management'

export const useBackofficeWorkflowUsers = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.backofficeWorkflowManagement)

  useEffect(() => {
    dispatch(fetchBackofficeUsersAction())
  }, [dispatch])

  return {
    userOptions: store.userOptions,
    status: store.usersStatus
  }
}

export const useBackofficeWorkflowSearch = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.backofficeWorkflowManagement)

  const searchWorkflows = async (rawWorkflowCode: string = '') => {
    await dispatch(searchBackofficeWorkflowsByCodeAction({ workflowCode: rawWorkflowCode.trim() }))
  }

  return {
    results: store.workflowList,
    status: store.workflowListStatus,
    searchWorkflows
  }
}

export const useBackofficeWorkflowById = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.backofficeWorkflowManagement)

  const fetchWorkflow = async (id: string | number) => {
    await dispatch(getBackofficeWorkflowByIdAction(id))
  }

  const resetWorkflow = () => {
    dispatch(resetBackofficeEditWorkflow())
  }

  return {
    workflow: store.editWorkflow,
    status: store.editWorkflowStatus,
    fetchWorkflow,
    resetWorkflow
  }
}