import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  fetchApprovalActivitiesAction,
  submitApprovalActionAction,
  submitRejectActionAction
} from 'src/store/apps/approval-activity'

import { useAuth } from 'src/hooks/useAuth'
import { ApprovalActionType, ApprovalActivityApi } from 'src/types/apps/approvalActivity'
import { ApprovalRequest, RequestStatus } from 'src/@core/components/TransactionActivity/Types'

const CHECKER_ROLE = 'Checker User'

const toRequestStatus = (value?: string | null): RequestStatus | null => {
  const normalized = value?.toLowerCase()

  return normalized === 'pending' || normalized === 'approved' || normalized === 'rejected' ? normalized : null
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

const toApprovalRequest = (item: ApprovalActivityApi): ApprovalRequest | null => {
  const status = toRequestStatus(item.activityStatus)
  if (!status) return null

  return {
    id: item.transactionRefNo,
    type: item.operationCode,
    operationCode: item.operationCode,
    maker: item.makerFullName?.trim() || item.makerId,
    makerId: item.makerId,
    details: item.details?.trim() || undefined,
    amount: item.amount ?? undefined,
    currency: item.currency?.trim() || undefined,
    initiatedDate: formatDateTime(item.creationDate) ?? '',
    status,
    executionStatus: item.executionStatus ?? undefined,
    actionedBy: item.actorFullName?.trim() || item.actorId || undefined,
    approverId: item.actorId ?? undefined,
    actionedDate: formatDateTime(item.actionTimestamp),
    remarks: item.remarks?.trim() || undefined,
    serviceId: item.serviceId,
    contextId: item.contextId,
    step: item.currentStepSequence
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