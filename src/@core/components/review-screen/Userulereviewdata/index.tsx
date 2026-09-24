import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { RuleReviewPayload } from 'src/@core/components/rule-management/types'
import { AppDispatch } from 'src/store'
import { createRuleAction, updateRuleAction } from 'src/store/apps/rule-management'

const RULE_REVIEW_STORAGE_KEY = 'ruleReviewData'

export function useRuleReviewData() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [data, setData] = useState<RuleReviewPayload | null>(null)
  const [submitting, setSubmitting] = useState(false)

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
      router.push(`/rule-management/add-role?id=${data.rawPayload.id}`)
    } else {
      router.push('/rule-management/add-role')
    }
  }

  const handleSubmit = async () => {
    if (!data) return

    setSubmitting(true)

    try {
      const { isEditMode, rawPayload, apiPayload } = data

      const res: any =
        isEditMode && rawPayload.id
          ? await dispatch(updateRuleAction({ id: rawPayload.id, payload: apiPayload }))
          : await dispatch(createRuleAction(apiPayload))
      if (res?.error) return

      window.sessionStorage.removeItem(RULE_REVIEW_STORAGE_KEY)
      router.push('/rule-management')
    } finally {
      setSubmitting(false)
    }
  }

  return { data, submitting, handleCancel, handleSubmit }
}