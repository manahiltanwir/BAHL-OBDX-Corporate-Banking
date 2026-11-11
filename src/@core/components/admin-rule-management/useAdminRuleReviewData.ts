import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAdminRuleSubmit } from 'src/@core/hooks/apps/useAdminRuleManagement'
import { ADMIN_RULE_REVIEW_KEY, ADMIN_RULE_ROUTES, AdminRuleReviewPayload } from './types'

export const useAdminRuleReviewData = () => {
  const router = useRouter()
  const { createRule, updateRule } = useAdminRuleSubmit()
  const [data, setData] = useState<AdminRuleReviewPayload | null>(null)
  const [ready, setReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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

      if (isUpdate) {
        await updateRule(editId, data.apiPayload).unwrap()
      } else {
        await createRule(data.apiPayload).unwrap()
      }

      leavePage()
    } catch (error) {
    } finally {
      setSubmitting(false)
    }
  }

  return { data, ready, submitting, handleCancel, handleSubmit }
}