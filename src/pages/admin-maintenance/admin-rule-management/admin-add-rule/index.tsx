import React from 'react'
import { useRouter } from 'next/router'
import { Card, Grid, Typography } from '@mui/material'

import { useSelectDropdowns } from 'src/@core/components/rule-management/Useselectdropdowns'
import RuleDetailsFields from 'src/@core/components/rule-management/Ruledetailsfields'
import InitiatorFields from 'src/@core/components/rule-management/Initiatorfields'
import ScopeSelector from 'src/@core/components/rule-management/Scopeselector'
import AmountRangeFields from 'src/@core/components/rule-management/Amountrangefields'
import WorkflowFields from 'src/@core/components/rule-management/Workflowfields'
import FormActions from 'src/@core/components/rule-management/Formactions'

import { useAdminRuleForm } from 'src/@core/components/admin-rule-management/useAdminRuleForm'
import {
  ADMIN_RULE_REVIEW_KEY,
  ADMIN_RULE_ROUTES,
  AdminRuleReviewPayload
} from 'src/@core/components/admin-rule-management/types'
import { useAuth } from 'src/hooks/useAuth'
type DropdownKey = 'ruleType' | 'initiator' | 'transactions' | 'accounts' | 'workflow'

const RulePage = () => {
  const router = useRouter()
  const { id } = router.query
  const auth = useAuth()
  const form = useAdminRuleForm(id)
  const { getProps } = useSelectDropdowns<DropdownKey>(['ruleType', 'initiator', 'transactions', 'accounts', 'workflow'])

  const handleSave = () => {
    const reviewPayload: AdminRuleReviewPayload = {
      isEditMode: form.isEditMode,
      rawPayload: form.buildRawPayload(),
      apiPayload: form.buildApiPayload(auth?.user?.userId ?? ''),
      sections: form.buildSections()
    }

    window.sessionStorage.setItem(ADMIN_RULE_REVIEW_KEY, JSON.stringify(reviewPayload))
    router.push(ADMIN_RULE_ROUTES.review)
  }
  const handleCancel = () => {
    form.resetForm()
    router.push(ADMIN_RULE_ROUTES.list)
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
          {form.isEditMode ? 'Edit Rule' : 'Rule Management'}
        </Typography>

        <Card sx={{ p: 5 }}>
          <RuleDetailsFields
            ruleType={form.ruleType}
            onRuleTypeChange={form.setRuleType}
            ruleId={form.ruleId}
            onRuleIdChange={form.handleRuleIdChange}
            ruleDescription={form.ruleDescription}
            onRuleDescriptionChange={form.setRuleDescription}
            selectOpen={ruleTypeSelect.open}
            onSelectOpen={ruleTypeSelect.onOpen}
            onSelectClose={ruleTypeSelect.onClose}
          />

          <InitiatorFields
            initiatorType={form.initiatorType}
            onInitiatorTypeChange={form.handleInitiatorTypeChange}
            initiatorUser={form.initiatorUser}
            onInitiatorUserChange={form.setInitiatorUser}
            userOptions={form.userOptions}
            selectOpen={initiatorSelect.open}
            onSelectOpen={initiatorSelect.onOpen}
            onSelectClose={initiatorSelect.onClose}
          />

          <ScopeSelector
            sectionTitle='Transactions'
            allLabel='All Transactions'
            specificLabel='Specific Transactions'
            selectLabel='Select Transactions'
            mode={form.transactionMode}
            onModeChange={form.handleTransactionMode}
            selected={form.selectedTransactions}
            onSelectedChange={form.handleTransactionSelect}
            options={form.transactionOptions}
            selectOpen={transactionsSelect.open}
            onSelectOpen={transactionsSelect.onOpen}
            onSelectClose={transactionsSelect.onClose}
          />

          <ScopeSelector
            sectionTitle='Accounts'
            allLabel='All Accounts'
            specificLabel='Specific Accounts'
            selectLabel='Select Accounts'
            mode={form.accountMode}
            onModeChange={form.handleAccountMode}
            selected={form.selectedAccounts}
            onSelectedChange={form.handleAccountSelect}
            options={form.accountOptions}
            selectOpen={accountsSelect.open}
            onSelectOpen={accountsSelect.onOpen}
            onSelectClose={accountsSelect.onClose}
          />

          <AmountRangeFields
            fromAmount={form.fromAmount}
            toAmount={form.toAmount}
            onFromAmountChange={form.handleFromAmountChange}
            onToAmountChange={form.handleToAmountChange}
          />

          <WorkflowFields
            approvalRequired={form.approvalRequired}
            onApprovalRequiredChange={form.handleApprovalRequired}
            selectedWorkflow={form.selectedWorkflow}
            onSelectedWorkflowChange={form.setSelectedWorkflow}
            workflowOptions={form.workflowOptions}
            selectOpen={workflowSelect.open}
            onSelectOpen={workflowSelect.onOpen}
            onSelectClose={workflowSelect.onClose}
          />

          <FormActions isEditMode={form.isEditMode} onCancel={handleCancel} onSave={handleSave} />
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