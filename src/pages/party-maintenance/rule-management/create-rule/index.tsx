
import React from 'react'
import { useRouter } from 'next/router'
import { Card, Grid, Typography } from '@mui/material'

import { RuleFormPayload, RuleReviewPayload } from 'src/@core/components/rule-management/types'
import { RULE_REVIEW_STORAGE_KEY } from 'src/@core/components/rule-management/Constants'
import { useRuleForm } from 'src/@core/components/rule-management/Useruleform'
import { useSelectDropdowns } from 'src/@core/components/rule-management/Useselectdropdowns'
import { buildApiPayload, buildReviewSections, BuildParams } from 'src/@core/components/rule-management/Buildreviewpayload'

import PartySearchCard from 'src/@core/components/rule-management/Partysearchcard'
import RuleDetailsFields from 'src/@core/components/rule-management/Ruledetailsfields'
import InitiatorFields from 'src/@core/components/rule-management/Initiatorfields'
import ScopeSelector from 'src/@core/components/rule-management/Scopeselector'
import AmountRangeFields from 'src/@core/components/rule-management/Amountrangefields'
import WorkflowFields from 'src/@core/components/rule-management/Workflowfields'
import FormActions from 'src/@core/components/rule-management/Formactions'
import { useAuth } from 'src/hooks/useAuth'

type DropdownKey = 'ruleType' | 'initiator' | 'transactions' | 'accounts' | 'workflow'

type ValidationErrors = {
  ruleType?: string
  ruleId?: string
  ruleDescription?: string
  initiatorUser?: string
  transactions?: string
  currency?: string
  accounts?: string
  fromAmount?: string
  toAmount?: string
  selectedWorkflow?: string
  approvalRequired?: string
}

const RulePage = () => {
  const router = useRouter()
  const auth = useAuth()
  const { id } = router.query
  const isEditMode = Boolean(id)

  const form = useRuleForm(id, isEditMode)

  const { getProps } = useSelectDropdowns<DropdownKey>([
    'ruleType',
    'initiator',
    'transactions',
    'accounts',
    'workflow'
  ])

  const [errors, setErrors] = React.useState<ValidationErrors>({})

  // Clear individual field error
  const clearError = (field: keyof ValidationErrors) => {
    setErrors(prev => {
      if (!prev[field]) return prev

      const updated = { ...prev }
      delete updated[field]

      return updated
    })
  }

  //  validation
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
      form.accountMode === 'specific' &&
      form.selectedAccounts.length === 0
    ) {
      newErrors.accounts = 'Please select at least one Account'
    }

    if (form.ruleType === 'Financial') {
      if (!form.currency.trim()) {
        newErrors.currency = 'Please select Currency'
      }

      if (
        form.fromAmount === '' ||
        !Number.isFinite(Number(form.fromAmount))
      ) {
        newErrors.fromAmount = 'From Amount is required'
      }

      if (
        form.toAmount === '' ||
        !Number.isFinite(Number(form.toAmount))
      ) {
        newErrors.toAmount = 'To Amount is required'
      }

      if (
        form.fromAmount !== '' &&
        form.toAmount !== '' &&
        Number.isFinite(Number(form.fromAmount)) &&
        Number.isFinite(Number(form.toAmount)) &&
        Number(form.toAmount) < Number(form.fromAmount)
      ) {
        newErrors.toAmount =
          'To Amount must be greater than or equal to From Amount'
      }
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
    if (!form.partyInfo) return

    if (!validateForm()) return

    const rawPayload: RuleFormPayload = {
      id: isEditMode ? Number(id) : undefined,
      partyId: form.partyInfo.partyId,
      ruleType: form.ruleType,
      ruleId: form.ruleId,
      ruleDescription: form.ruleDescription,
      initiatorType: form.initiatorType,
      initiatorUser: form.initiatorUser,
      transactionMode: form.transactionMode,
      selectedTransactions: form.selectedTransactions,
      accountMode: form.accountMode,
      selectedAccounts: form.selectedAccounts,
      fromAmount: form.fromAmount,
      toAmount: form.toAmount,
      currency: form.currency,
      approvalRequired: form.approvalRequired,
      selectedWorkflow: form.selectedWorkflow
    }

    const buildParams: BuildParams = {
      isEditMode,
      id,
      createdBy: auth?.user?.userId ?? '',
      partyInfo: form.partyInfo,
      userOptions: form.userOptions,
      ruleType: form.ruleType,
      ruleId: form.ruleId,
      ruleDescription: form.ruleDescription,
      initiatorType: form.initiatorType,
      initiatorUser: form.initiatorUser,
      transactionMode: form.transactionMode,
      selectedTransactions: form.selectedTransactions,
      transactionOptions: form.transactionOptions,
      accountMode: form.accountMode,
      selectedAccounts: form.selectedAccounts,
      accountOptions: form.accountOptions,
      fromAmount: form.fromAmount,
      toAmount: form.toAmount,
      currency: form.currency,
      approvalRequired: form.approvalRequired,
      selectedWorkflow: form.selectedWorkflow,
      workflowOptions: form.workflowOptions
    }

    const reviewPayload: RuleReviewPayload = {
      isEditMode,
      rawPayload,
      apiPayload: buildApiPayload(buildParams),
      sections: buildReviewSections(buildParams)
    }

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        RULE_REVIEW_STORAGE_KEY,
        JSON.stringify(reviewPayload)
      )
    }

    router.push('/party-maintenance/rule-management/create-rule/review-rule')
  }

  const handleCancel = () => {
    form.resetForm()
    setErrors({})
    router.push('/party-maintenance/rule-management')
  }

  const ruleTypeSelect = getProps('ruleType')
  const initiatorSelect = getProps('initiator')
  const transactionsSelect = getProps('transactions')
  const accountsSelect = getProps('accounts')
  const workflowSelect = getProps('workflow')

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ mb: 4 }}>
          {isEditMode ? 'Edit Rule' : 'Rule Management'}
        </Typography>

        <PartySearchCard
          isEditMode={isEditMode}
          partyInfo={form.partyInfo}
          partyIdInput={form.partyIdInput}
          partyStatus={form.partyStatus}
          onPartyIdInputChange={form.handlePartyIdInputChange}
          onSearch={form.handlePartySearch}
          onChangeParty={form.handleChangeParty}
        />

        {form.partyInfo && (
          <Card sx={{ p: 5 }}>
            <RuleDetailsFields
              ruleType={form.ruleType}
              onRuleTypeChange={value => {
                form.handleRuleTypeChange(value)
                clearError('ruleType')
              }}
              ruleId={form.ruleId}
              onRuleIdChange={value => {
                form.handleRuleIdChange(value)
                clearError('ruleId')
              }}
              ruleIdDisabled={isEditMode}
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
              errors={errors}
            />

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


            <ScopeSelector
              sectionTitle='Accounts'
              allLabel='All Accounts'
              specificLabel='Specific Accounts'
              selectLabel='Select Accounts'
              mode={form.accountMode}
              onModeChange={value => {
                form.handleAccountMode(value)
                clearError('accounts')
              }}
              selected={form.selectedAccounts}
              onSelectedChange={event => {
                form.handleAccountSelect(event)
                clearError('accounts')
              }}
              options={form.accountOptions}
              selectOpen={accountsSelect.open}
              onSelectOpen={accountsSelect.onOpen}
              onSelectClose={accountsSelect.onClose}
              error={errors.accounts}
            />


            {form.ruleType === 'Financial' && (
              <AmountRangeFields
                fromAmount={form.fromAmount}
                toAmount={form.toAmount}
                currency={form.currency}
                onFromAmountChange={value => {
                  form.handleFromAmountChange(value)
                  clearError('fromAmount')
                  if (
                    form.toAmount !== '' &&
                    Number(form.toAmount) >= Number(value)
                  ) {
                    clearError('toAmount')
                  }
                }}
                onToAmountChange={value => {
                  form.handleToAmountChange(value)
                  clearError('toAmount')
                }}
                onCurrencyChange={value => {
                  form.setCurrency(value)
                  clearError('currency')
                }}
                errors={errors}
              />
            )}

            <WorkflowFields
              approvalRequired={form.approvalRequired}
              onApprovalRequiredChange={value => {
                form.handleApprovalRequired(value)
                clearError('approvalRequired')
                if (value === 'no') clearError('selectedWorkflow')
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

            <FormActions
              isEditMode={isEditMode}
              onCancel={handleCancel}
              onSave={handleSave}
            />
          </Card>
        )}
      </Grid>
    </Grid>
  )
}

RulePage.acl = {
  action: 'itsHaveAccess',
  subject: 'party-maintenance-rule-management-create-rule-page'
}

export default RulePage
