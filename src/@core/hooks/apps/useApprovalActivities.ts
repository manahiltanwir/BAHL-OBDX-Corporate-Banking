import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  fetchApprovalActivitiesAction,
  submitApprovalActionAction,
  submitRejectActionAction
} from 'src/store/apps/approval-activity'

import { useAuth } from 'src/hooks/useAuth'
import { ApprovalActionType, ApprovalActivityApi, ApprovalApproverApi } from 'src/types/apps/approvalActivity'
import { ApprovalRequest, RequestApprover, RequestStatus } from 'src/@core/components/TransactionActivity/Types'

const CHECKER_ROLE = 'Checker User'

const toRequestStatus = (value?: string | null): RequestStatus | null => {
  const normalized = value?.toLowerCase()

  return normalized === 'pending' ||
    normalized === 'in_progress' ||
    normalized === 'approved' ||
    normalized === 'rejected'
    ? normalized
    : null
}

const formatDateTime = (value?: string | null): string | undefined => {
  if (!value) return undefined

  const date = new Date(value)
  if (isNaN(date.getTime())) return value

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const toApprovers = (list?: ApprovalApproverApi[] | null): RequestApprover[] =>
  [...(list ?? [])]
    .sort((a, b) => a.sequenceNo - b.sequenceNo)
    .map(approver => ({
      id: approver.approverTargetId,
      name: [approver.firstName, approver.lastName].filter(Boolean).join(' ').trim() || approver.approverTargetId,
      action: approver.action?.trim().toUpperCase() || undefined,
      remarks: approver.remarks?.trim() || undefined,
      sequenceNo: approver.sequenceNo
    }))

const toApprovalRequest = (item: ApprovalActivityApi): ApprovalRequest | null => {
  const status = toRequestStatus(item.activityStatus)
  if (!status) return null

  const approvers = toApprovers(item.approvers)

  const targetAction = status === 'in_progress' ? 'PENDING' : status === 'rejected' ? 'REJECTED' : undefined
  const targetApprover = targetAction ? approvers.find(approver => approver.action === targetAction) : undefined

  return {
    id: item.transactionRefNo,
    type: item.activityName?.trim() || item.operationCode,
    operationCode: item.operationCode,
    maker: item.makerFullName?.trim() || item.makerId,
    makerId: item.makerId,
    details: item.details?.trim() || undefined,
    amount: item.amount ?? undefined,
    currency: item.currency?.trim() || undefined,
    initiatedDate: formatDateTime(item.creationDate) ?? '',
    status,
    executionStatus: item.executionStatus ?? undefined,
    actionedBy: targetAction ? targetApprover?.name : item.actorFullName?.trim() || item.actorId || undefined,
    approverId: targetAction ? targetApprover?.id : item.actorId ?? undefined,
    actionedDate: formatDateTime(item.actionTimestamp),
    remarks: item.remarks?.trim() || undefined,
    serviceId: item.serviceId,
    contextId: item.contextId,
    step: item.currentStepSequence,
    workflowId: item.workflowId ?? undefined,
    approvers
  }
}

export const useApprovalActivities = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const { activities, status } = useSelector((state: RootState) => state.approvalActivity)

  const [processingId, setProcessingId] = useState<string | null>(null)

  const userId: string = (user as any)?.userId ?? ''
  const roles: string[] = (user as any)?.userProfile?.roles ?? []
  const isChecker = roles.includes(CHECKER_ROLE)

  const requests = useMemo(
    () =>
      [...activities]
        .sort((a, b) => (b.creationDate ?? '').localeCompare(a.creationDate ?? ''))
        .map(toApprovalRequest)
        .filter((request): request is ApprovalRequest => request !== null),
    [activities]
  )

  const fetchActivities = useCallback(() => {
    if (!userId) return

    return dispatch(fetchApprovalActivitiesAction({ userId, status: 'ALL' }))
  }, [dispatch, userId])

  const submitAction = useCallback(
    async (transactionRefNo: string, action: ApprovalActionType, remarks: string): Promise<boolean> => {
      if (!userId) return false

      const payload = { data: { transactionRefNo, checkerId: userId, action, remarks } }

      setProcessingId(transactionRefNo)
      try {
        if (action === 'REJECT') {
          await dispatch(submitRejectActionAction(payload)).unwrap()
        } else {
          await dispatch(submitApprovalActionAction(payload)).unwrap()
        }

        await fetchActivities()

        return true
      } catch (error) {
        return false
      } finally {
        setProcessingId(null)
      }
    },
    [dispatch, userId, fetchActivities]
  )

  return {
    requests,
    isLoading: status === 'pending',
    isError: status === 'error',
    isChecker,
    processingId,
    fetchActivities,
    submitAction
  }
}