import { useCallback, useMemo } from 'react'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { fetchApprovalActivitiesAction } from 'src/store/apps/approval-activity'

import { ApprovalActivityApi } from 'src/types/apps/approvalActivity'
import { ApprovalRequest,RequestStatus } from 'src/@core/components/TransactionActivity/Types'

// TODO: logged-in checker ki userId auth/session se lein
const CHECKER_USER_ID = 'H7U0W12'

const OPERATION_LABELS: Record<string, string> = {
  UM_CREATE_USER: 'Create User'
  // TODO: baaqi operation codes yahan add karein
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
  const { activities, status } = useSelector((state: RootState) => state.approvalActivity)

  // Newest pehle
  const requests = useMemo(
    () =>
      [...activities]
        .sort((a, b) => (b.creationDate ?? '').localeCompare(a.creationDate ?? ''))
        .map(toApprovalRequest)
        .filter((request): request is ApprovalRequest => request !== null),
    [activities]
  )

  const fetchActivities = useCallback(
    () => dispatch(fetchApprovalActivitiesAction({ userId: CHECKER_USER_ID, actorType: 'CHECKER', status: 'ALL' })),
    [dispatch]
  )

  return {
    requests,
    isLoading: status === 'pending',
    isError: status === 'error',
    fetchActivities
  }
}