import { useCallback, useMemo, useState } from 'react'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { fetchApprovalActivitiesAction, submitApprovalActionAction } from 'src/store/apps/approval-activity'

import { useAuth } from 'src/hooks/useAuth'
import { ApprovalActionType, ApprovalActivityApi } from 'src/types/apps/approvalActivity'
import { ApprovalRequest, RequestStatus } from 'src/@core/components/TransactionActivity/Types'

const CHECKER_ROLE = 'Checker User'
const OPERATION_LABELS: Record<string, string> = {
  UM_CREATE_USER: 'Create User'
}

const toOperationLabel = (code: string) => OPERATION_LABELS[code] ?? code

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
    type: toOperationLabel(item.operationCode),
    maker: item.makerId,
    details: item.details?.trim() || undefined,
    amount: item.amount ?? undefined,
    currency: item.currency?.trim() || undefined,
    initiatedDate: formatDateTime(item.creationDate) ?? '',
    status,
    actionedBy: item.actorId ?? undefined,
    actionedDate: formatDateTime(item.actionTimestamp),
    remarks: item.remarks?.trim() || undefined
  }
}

export const useApprovalActivities = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const { activities, status } = useSelector((state: RootState) => state.approvalActivity)

  const [processingId, setProcessingId] = useState<string | null>(null)

  // ** Logged-in user (login ke waqt userData mein save hota hai)
  const userId: string = (user as any)?.userId ?? ''
  const roles: string[] = (user as any)?.userProfile?.roles ?? []
  const isChecker = roles.includes(CHECKER_ROLE)

  // Newest pehle
  const requests = useMemo(
    () =>
      [...activities]
        .sort((a, b) => (b.creationDate ?? '').localeCompare(a.creationDate ?? ''))
        .map(toApprovalRequest)
        .filter((request): request is ApprovalRequest => request !== null),
    [activities]
  )

  // GET /approvals/activities?userId=<logged-in userId>&status=ALL
  const fetchActivities = useCallback(() => {
    if (!userId) return

    return dispatch(fetchApprovalActivitiesAction({ userId, status: 'ALL' }))
  }, [dispatch, userId])

  // POST /approvals/action  -> success par list dobara fetch hoti hai
  const submitAction = useCallback(
    async (transactionRefNo: string, action: ApprovalActionType, remarks: string): Promise<boolean> => {
      if (!userId) return false

      setProcessingId(transactionRefNo)
      try {
        await dispatch(
          submitApprovalActionAction({ data: { transactionRefNo, checkerId: userId, action, remarks } })
        ).unwrap()
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