import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { RuleReviewPayload } from 'src/@core/components/rule-management/types'
import { ApiResponseInfo } from 'src/@core/components/ApiResponseDialog'
import { AppDispatch } from 'src/store'
import { createRuleAction, updateRuleAction } from 'src/store/apps/rule-management'

const RULE_REVIEW_STORAGE_KEY = 'ruleReviewData'
const isPendingApproval = (res: ApiResponseInfo) =>
  (res?.status || '').toUpperCase().includes('PENDING') || !!res?.workflowId

export function useRuleReviewData() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [data, setData] = useState<RuleReviewPayload | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [responseInfo, setResponseInfo] = useState<ApiResponseInfo | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const raw = window.sessionStorage.getItem(RULE_REVIEW_STORAGE_KEY)

    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        const isValid = parsed && Array.isArray(parsed.sections) && parsed.rawPayload && parsed.apiPayload

        setData(isValid ? parsed : null)
      } catch (e) {
        setData(null)
      }
    }
  }, [])

  const handleCancel = () => {
    if (data?.isEditMode && data.rawPayload.id) {
      router.push(`/party-maintenance/rule-management/create-rule?id=${data.rawPayload.id}`)
    } else {
      router.push('/party-maintenance/rule-management/create-rule')
    }
  }

  const leavePage = () => {
    window.sessionStorage.removeItem(RULE_REVIEW_STORAGE_KEY)
    router.push('/party-maintenance/rule-management')
  }

  const handleSubmit = async () => {
    if (!data) return

    setSubmitting(true)

    try {
      const { isEditMode, rawPayload, apiPayload } = data

      const result: any =
        isEditMode && rawPayload.id
          ? await dispatch(updateRuleAction({ id: rawPayload.id, payload: apiPayload })).unwrap()
          : await dispatch(createRuleAction(apiPayload)).unwrap()

      if (isPendingApproval(result)) {
        setResponseInfo(result)

        return
      }

      if (result?.message) toast.success(result.message)
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

  return { data, submitting, responseInfo, handleCancel, handleSubmit, handleCloseResponse }
}