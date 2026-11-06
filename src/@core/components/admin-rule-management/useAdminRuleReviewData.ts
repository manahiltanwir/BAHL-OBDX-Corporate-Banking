import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { ApiResponseInfo } from 'src/@core/components/ApiResponseDialog'
import { useAdminRuleSubmit } from 'src/@core/hooks/apps/useAdminRuleManagement'
import { ADMIN_RULE_REVIEW_KEY, ADMIN_RULE_ROUTES, AdminRuleReviewPayload } from './types'

const isPendingApproval = (res: any) => {
  const s = String(res?.status ?? res?.data?.status ?? '').toUpperCase()

  return s.includes('PENDING') || !!res?.workflowId || !!res?.data?.workflowId
}

export const useAdminRuleReviewData = () => {
  const router = useRouter()
  const { createRule, updateRule } = useAdminRuleSubmit()

  const [data, setData] = useState<AdminRuleReviewPayload | null>(null)
  const [ready, setReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [responseInfo, setResponseInfo] = useState<ApiResponseInfo | null>(null)

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(ADMIN_RULE_REVIEW_KEY)

      setData(raw ? (JSON.parse(raw) as AdminRuleReviewPayload) : null)
    } catch (e) {
      setData(null)
    }

    setReady(true)
  }, [])

  const handleCancel = () => {
    const editId = data?.rawPayload?.id

    router.push(editId ? `${ADMIN_RULE_ROUTES.create}?id=${editId}` : ADMIN_RULE_ROUTES.create)
  }

  const leavePage = () => {
    window.sessionStorage.removeItem(ADMIN_RULE_REVIEW_KEY)
    router.push(ADMIN_RULE_ROUTES.list)
  }

  const handleSubmit = async () => {
    if (!data || submitting) return

    setSubmitting(true)

    try {
      const editId = data.rawPayload?.id ?? data.apiPayload?.id
      const isUpdate = !!(data.isEditMode && editId)

      const result: any = isUpdate
        ? await updateRule(editId, data.apiPayload).unwrap()
        : await createRule(data.apiPayload).unwrap()

      if (isPendingApproval(result)) {
        setResponseInfo(result?.data && typeof result.data === 'object' ? { ...result, ...result.data } : result)

        return
      }

      const apiMessage = typeof result === 'string' ? result : result?.message

      toast.success(
        typeof apiMessage === 'string' && apiMessage.trim()
          ? apiMessage
          : isUpdate
          ? 'Rule updated successfully.'
          : 'Rule created successfully.'
      )
      leavePage()
    } catch (error: any) {
      setResponseInfo({
        status: 'FAILED',
        message: typeof error === 'string' ? error : error?.message
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseResponse = () => {
    const wasPending = responseInfo ? isPendingApproval(responseInfo) : false

    setResponseInfo(null)
    if (wasPending) leavePage()
  }

  return { data, ready, submitting, responseInfo, handleCancel, handleSubmit, handleCloseResponse }
}