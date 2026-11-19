
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Card, Grid, Typography } from '@mui/material'

import { useSelectDropdowns } from 'src/@core/components/rule-management/Useselectdropdowns'
import RuleDetailsFields from 'src/@core/components/rule-management/Ruledetailsfields'
import InitiatorFields from 'src/@core/components/rule-management/Initiatorfields'
import ScopeSelector from 'src/@core/components/rule-management/Scopeselector'
import WorkflowFields from 'src/@core/components/rule-management/Workflowfields'
import FormActions from 'src/@core/components/rule-management/Formactions'

import { adminRuleTypeOptions } from 'src/@core/components/admin-rule-management/adminRuleConstants'
import { useAdminRuleForm } from 'src/@core/components/admin-rule-management/useAdminRuleForm'

import {
  ADMIN_RULE_REVIEW_KEY,
  ADMIN_RULE_ROUTES,
  AdminRuleReviewPayload
} from 'src/@core/components/admin-rule-management/types'

import { useAuth } from 'src/hooks/useAuth'

type DropdownKey = 'ruleType' | 'initiator' | 'transactions' | 'workflow'

type ValidationErrors = {
  ruleType?: string
  ruleId?: string
  ruleDescription?: string
  initiatorUser?: string
  transactions?: string
  approvalRequired?: string
  selectedWorkflow?: string
}

const RulePage = () => {
  const router = useRouter()
  const { id } = router.query
  const auth = useAuth()

  const form = useAdminRuleForm(id)

  const { getProps } = useSelectDropdowns<DropdownKey>([
    'ruleType',
    'initiator',
    'transactions',
    'workflow'
  ])

  const [errors, setErrors] = useState<ValidationErrors>({})

  // Clear individual field error
  const clearError = (field: keyof ValidationErrors) => {
    setErrors(prev => {
      if (!prev[field]) return prev

      const updated = { ...prev }
      delete updated[field]

      return updated
    })
  }

  // Form validation
  const validateForm = () => {
    const newErrors: ValidationErrors = {}

    if (!form.ruleType) {
      newErrors.ruleType = 'Please select Rule Type'
    }

    if (!form.ruleId.trim()) {
      newErrors.ruleId = 'Rule ID is required'
    }

    if (!form.ruleDescription.trim()) {
      newErrors.ruleDescription = 'Rule Description is required'
    }

    if (!form.initiatorUser.trim()) {
      newErrors.initiatorUser = 'Please select Initiator User'
    }

    if (
      form.transactionMode === 'specific' &&
      form.selectedTransactions.length === 0
    ) {
      newErrors.transactions = 'Please select at least one Transaction'
    }

    if (
      form.approvalRequired !== 'yes' &&
      form.approvalRequired !== 'no'
    ) {
      newErrors.approvalRequired = 'Please select Approval Required'
    }

    if (
      form.approvalRequired === 'yes' &&
      !form.selectedWorkflow.trim()
    ) {
      newErrors.selectedWorkflow = 'Please select Approval Workflow'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    const reviewPayload: AdminRuleReviewPayload = {
      isEditMode: form.isEditMode,
      rawPayload: form.buildRawPayload(),
      apiPayload: form.buildApiPayload(auth?.user?.userId ?? ''),
      sections: form.buildSections()
    }

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        ADMIN_RULE_REVIEW_KEY,
        JSON.stringify(reviewPayload)
      )
    }

    router.push(ADMIN_RULE_ROUTES.review)
  }

  // Cancel
  const handleCancel = () => {
    form.resetForm()
    setErrors({})
    router.push(ADMIN_RULE_ROUTES.list)
  }

  const ruleTypeSelect = getProps('ruleType')
  const initiatorSelect = getProps('initiator')
  const transactionsSelect = getProps('transactions')
  const workflowSelect = getProps('workflow')

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ mb: 4 }}>
          {form.isEditMode ? 'Edit Rule' : 'Rule Management'}
        </Typography>

        <Card sx={{ p: 5 }}>

          {/* Rule Details */}
          <RuleDetailsFields
            ruleTypeOptions={adminRuleTypeOptions}
            ruleType={form.ruleType}
            onRuleTypeChange={value => {
              form.setRuleType(value)
              clearError('ruleType')
              clearError('transactions')
            }}
            ruleId={form.ruleId}
            onRuleIdChange={value => {
              form.onRuleIdChange(value)
              clearError('ruleId')
            }}
            ruleIdDisabled={form.isEditMode}   
            ruleDescription={form.ruleDescription}
            onRuleDescriptionChange={value => {
              form.setRuleDescription(value)
              clearError('ruleDescription')
            }}
            selectOpen={ruleTypeSelect.open}
            onSelectOpen={ruleTypeSelect.onOpen}
            onSelectClose={ruleTypeSelect.onClose}
            errors={errors}
          />

          {/* Initiator */}
          <InitiatorFields
            initiatorType={form.initiatorType}
            onInitiatorTypeChange={form.handleInitiatorTypeChange}
            initiatorUser={form.initiatorUser}
            onInitiatorUserChange={value => {
              form.setInitiatorUser(value)
              clearError('initiatorUser')
            }}
            userOptions={form.userOptions}
            selectOpen={initiatorSelect.open}
            onSelectOpen={initiatorSelect.onOpen}
            onSelectClose={initiatorSelect.onClose}
            safeValue
            errors={errors}
          />

          {/* Transactions */}
          <ScopeSelector
            sectionTitle='Transactions'
            allLabel='All Transactions'
            specificLabel='Specific Transactions'
            selectLabel='Select Transactions'
            mode={form.transactionMode}
            onModeChange={value => {
              form.handleTransactionMode(value)
              clearError('transactions')
            }}
            selected={form.selectedTransactions}
            onSelectedChange={event => {
              form.handleTransactionSelect(event)
              clearError('transactions')
            }}
            options={form.transactionOptions}
            selectOpen={transactionsSelect.open}
            onSelectOpen={transactionsSelect.onOpen}
            onSelectClose={transactionsSelect.onClose}
            error={errors.transactions}
          />

          {/* Workflow */}
          <WorkflowFields
            approvalRequired={form.approvalRequired}
            onApprovalRequiredChange={value => {
              form.handleApprovalRequired(value)
              clearError('approvalRequired')

              if (value === 'no') {
                clearError('selectedWorkflow')
              }
            }}
            selectedWorkflow={form.selectedWorkflow}
            onSelectedWorkflowChange={value => {
              form.setSelectedWorkflow(value)
              clearError('selectedWorkflow')
            }}
            workflowOptions={form.workflowOptions}
            selectOpen={workflowSelect.open}
            onSelectOpen={workflowSelect.onOpen}
            onSelectClose={workflowSelect.onClose}
            errors={errors}
          />

          {/* Actions */}
          <FormActions
            isEditMode={form.isEditMode}
            onCancel={handleCancel}
            onSave={handleSave}
          />

        </Card>
      </Grid>
    </Grid>
  )
}

RulePage.acl = {
  action: 'itsHaveAccess',
  subject: 'admin-maintenance-add-rule-page'
}

export default RulePage