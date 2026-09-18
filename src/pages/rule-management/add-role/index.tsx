import React from 'react'
import { useRouter } from 'next/router'
import { Card, Grid, Typography } from '@mui/material'

import { RuleFormPayload ,RuleReviewPayload } from 'src/@core/components/rule-management/types'
import { RULE_REVIEW_STORAGE_KEY } from 'src/@core/components/rule-management/Constants' 
import { useRuleForm } from 'src/@core/components/rule-management/Useruleform' 
import { useSelectDropdowns } from 'src/@core/components/rule-management/Useselectdropdowns' 
import { buildApiPayload ,buildReviewSections, BuildParams } from 'src/@core/components/rule-management/Buildreviewpayload'

import PartySearchCard from 'src/@core/components/rule-management/Partysearchcard'
import RuleDetailsFields from 'src/@core/components/rule-management/Ruledetailsfields' 
import InitiatorFields from 'src/@core/components/rule-management/Initiatorfields' 
import ScopeSelector from 'src/@core/components/rule-management/Scopeselector' 
import AmountRangeFields from 'src/@core/components/rule-management/Amountrangefields' 
import WorkflowFields from 'src/@core/components/rule-management/Workflowfields' 
import FormActions from 'src/@core/components/rule-management/Formactions' 

type DropdownKey = 'ruleType' | 'initiator' | 'transactions' | 'accounts' | 'workflow'

const RulePage = () => {
  const router = useRouter()
  const { id } = router.query
  const isEditMode = Boolean(id)

  const form = useRuleForm(id, isEditMode)
  const { getProps } = useSelectDropdowns<DropdownKey>(['ruleType', 'initiator', 'transactions', 'accounts', 'workflow'])

  const handleSave = () => {
    if (!form.partyInfo) return

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
      approvalRequired: form.approvalRequired,
      selectedWorkflow: form.selectedWorkflow
    }

    const buildParams: BuildParams = {
      isEditMode,
      id,
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
      window.sessionStorage.setItem(RULE_REVIEW_STORAGE_KEY, JSON.stringify(reviewPayload))
    }

    router.push('/rule-management/add-role/review-role')
  }

  const handleCancel = () => {
    form.resetForm()
    router.push('/rule-management')
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

            <FormActions isEditMode={isEditMode} onCancel={handleCancel} onSave={handleSave} />
          </Card>
        )}
      </Grid>
    </Grid>
  )
}

RulePage.acl = {
  action: 'itsHaveAccess',
  subject: 'add-role'
}

export default RulePage