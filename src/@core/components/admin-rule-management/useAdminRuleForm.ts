import { useEffect, useState } from 'react'
import { SelectChangeEvent } from '@mui/material'
import { RuleType, InitiatorType, ScopeMode } from 'src/@core/data/dummy-rules'
import { ruleTypeToCategory, CURRENCY } from 'src/@core/components/rule-management/Constants'
import { useAdminRuleTransactions, useAdminRuleDetail } from 'src/@core/hooks/apps/useAdminRuleManagement'
import { RuleApiPayload, RuleApiRecord, RuleCriteriaPayload, RuleMappedTaskPayload } from 'src/types/apps/ruleManagement'
import { ADMIN_CONTEXT_ID, AdminOption, AdminReviewSection, AdminRuleFormPayload } from './types'

export function useAdminRuleForm(id: string | string[] | undefined) {
  const isEditMode = Boolean(id)

  const { transactionOptions, fetchTransactions } = useAdminRuleTransactions()
  const { fetchRuleDetail } = useAdminRuleDetail()

  const [ruleType, setRuleType] = useState<RuleType>('Financial')
  const [ruleId, setRuleId] = useState('')
  const [ruleDescription, setRuleDescription] = useState('')
  const [initiatorType, setInitiatorType] = useState<InitiatorType>('user')
  const [initiatorUser, setInitiatorUser] = useState('')
  const [transactionMode, setTransactionMode] = useState<ScopeMode>('all')
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [pendingTaskCodes, setPendingTaskCodes] = useState<string[] | null>(null)
  const [accountMode, setAccountMode] = useState<ScopeMode>('all')
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [approvalRequired, setApprovalRequired] = useState<'yes' | 'no'>('no')
  const [selectedWorkflow, setSelectedWorkflow] = useState('')

  // ** Edit mein record ka apna context wapas jata hai, create mein ADMIN
  const [contextType, setContextType] = useState<'PARTY' | 'ADMIN'>('ADMIN')
  const [contextId, setContextId] = useState(ADMIN_CONTEXT_ID)

  // ** TODO: in 3 ki admin-side API abhi nahi mili (users, accounts, workflows)
  const userOptions: AdminOption[] = []
  const accountOptions: AdminOption[] = []
  const workflowOptions: AdminOption[] = []

  // Rule type badalne par transactions dobara load. Edit mein pending selection khali nahi karni.
  useEffect(() => {
    fetchTransactions(ruleTypeToCategory(ruleType))
    if (!pendingTaskCodes) setSelectedTransactions([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruleType])

  // Edit mode: rule load
  useEffect(() => {
    if (!id) return

    ;(async () => {
      const res: any = await fetchRuleDetail(id as string)
      const record: RuleApiRecord | undefined = res?.payload

      if (!record || res?.error) return

      // pending ko setRuleType se PEHLE set karna zaroori hai
      const taskCodes = (record.mappedTasks || []).map(t => t.taskCode)

      if (taskCodes.length === 1 && taskCodes[0] === 'ALL_TRANSACTIONS') {
        setTransactionMode('all')
      } else {
        setTransactionMode('specific')
        setPendingTaskCodes(taskCodes)
      }

      setRuleType(record.ruleType === 'FINANCIAL' ? 'Financial' : 'NonFinancial')
      setRuleId(record.ruleCode)
      setRuleDescription(record.description)
      setContextType(record.contextType ?? 'ADMIN')
      setContextId(record.contextId ?? ADMIN_CONTEXT_ID)

      const criteria = record.criteriaList?.[0]

      if (criteria) {
        setInitiatorType(criteria.initiatorType === 'ROLE' ? 'userGroup' : 'user')
        setInitiatorUser(criteria.initiatorId)
        setFromAmount(String(criteria.fromAmount ?? ''))
        setToAmount(String(criteria.toAmount ?? ''))

        if (criteria.accountNumber === 'ALL_ACCOUNTS') {
          setAccountMode('all')
        } else {
          setAccountMode('specific')
          setSelectedAccounts(
            criteria.accountNumber
              .split(',')
              .map(acc => acc.trim())
              .filter(Boolean)
          )
        }
      }

      if (record.isWorkflowRequired) {
        setApprovalRequired('yes')
        setSelectedWorkflow(record.workflowId ? String(record.workflowId) : '')
      } else {
        setApprovalRequired('no')
        setSelectedWorkflow('')
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Saved codes -> option ids (options load hone ke baad)
  useEffect(() => {
    if (!pendingTaskCodes || transactionOptions.length === 0) return

    const resolved = transactionOptions
      .filter(
        opt =>
          pendingTaskCodes.includes(opt.id) || (opt.taskCode ? pendingTaskCodes.includes(opt.taskCode) : false)
      )
      .map(opt => opt.id)

    if (resolved.length === 0) return

    setSelectedTransactions(resolved)
    setPendingTaskCodes(null)
  }, [pendingTaskCodes, transactionOptions])

  const handleRuleIdChange = (value: string) => setRuleId(value.replace(/[^a-zA-Z0-9]/g, ''))
  const handleAmount = (value: string, setter: (v: string) => void) => setter(value.replace(/[^0-9.]/g, ''))

  const handleInitiatorTypeChange = (value: InitiatorType | null) => {
    if (!value) return
    setInitiatorType(value)
    setInitiatorUser('')
  }

  const handleTransactionMode = (value: ScopeMode | null) => {
    if (!value) return
    setTransactionMode(value)
    if (value === 'all') setSelectedTransactions([])
  }

  const handleAccountMode = (value: ScopeMode | null) => {
    if (!value) return
    setAccountMode(value)
    if (value === 'all') setSelectedAccounts([])
  }

  const handleTransactionSelect = (e: SelectChangeEvent<string[]>) => {
    const { value } = e.target

    setSelectedTransactions(typeof value === 'string' ? value.split(',') : value)
  }

  const handleAccountSelect = (e: SelectChangeEvent<string[]>) => {
    const { value } = e.target

    setSelectedAccounts(typeof value === 'string' ? value.split(',') : value)
  }

  const handleApprovalRequired = (value: 'yes' | 'no' | null) => {
    if (!value) return
    setApprovalRequired(value)
    if (value === 'no') setSelectedWorkflow('')
  }

  const resetForm = () => {
    setRuleType('Financial')
    setRuleId('')
    setRuleDescription('')
    setInitiatorType('user')
    setInitiatorUser('')
    setTransactionMode('all')
    setSelectedTransactions([])
    setPendingTaskCodes(null)
    setAccountMode('all')
    setSelectedAccounts([])
    setFromAmount('')
    setToAmount('')
    setApprovalRequired('no')
    setSelectedWorkflow('')
    setContextType('ADMIN')
    setContextId(ADMIN_CONTEXT_ID)
  }

  const buildRawPayload = (): AdminRuleFormPayload => ({
    id: isEditMode ? Number(id) : undefined,
    ruleType,
    ruleId,
    ruleDescription,
    initiatorType,
    initiatorUser,
    transactionMode,
    selectedTransactions,
    accountMode,
    selectedAccounts,
    fromAmount,
    toAmount,
    approvalRequired,
    selectedWorkflow
  })

  const buildApiPayload = (createdBy: string): RuleApiPayload => {
    const mappedTasks: RuleMappedTaskPayload[] =
      transactionMode === 'all'
        ? [{ taskCode: 'ALL_TRANSACTIONS' }]
        : Array.from(new Set(selectedTransactions)).map(taskCode => ({ taskCode }))

    const criteriaList: RuleCriteriaPayload[] = [
      {
        fromAmount: Number(fromAmount) || 0,
        toAmount: Number(toAmount) || 0,
        currency: CURRENCY,
        accountNumber: accountMode === 'all' ? 'ALL_ACCOUNTS' : selectedAccounts.join(', '),
        initiatorType: initiatorType === 'user' ? 'USER' : 'ROLE',
        initiatorId: initiatorUser
      }
    ]

    return {
      ...(isEditMode && id ? { id: Number(id as string) } : {}),
      isWorkflowRequired: approvalRequired === 'yes',
      ruleCode: ruleId,
      description: ruleDescription,
      createdBy,
      contextType,
      contextId,
      ruleType: ruleType === 'Financial' ? 'FINANCIAL' : 'NON_FINANCIAL',
      workflowId: approvalRequired === 'yes' && selectedWorkflow ? Number(selectedWorkflow) : null,
      mappedTasks,
      criteriaList
    }
  }

  const label = (opts: AdminOption[], v: string) => opts.find(o => o.id === v)?.label ?? v

  const buildSections = (): AdminReviewSection[] => [
    {
      title: 'Rule Details',
      fields: [
        { label: 'Rule Type', value: ruleType === 'NonFinancial' ? 'Non Financial' : ruleType },
        { label: 'Rule ID', value: ruleId },
        { label: 'Rule Description', value: ruleDescription }
      ]
    },
    {
      title: 'Initiator',
      fields: [
        { label: 'Initiator Type', value: initiatorType === 'user' ? 'User' : 'User Group' },
        { label: 'Initiator', value: label(userOptions, initiatorUser) }
      ]
    },
    {
      title: 'Transactions',
      fields: [{ label: 'Scope', value: transactionMode === 'all' ? 'All Transactions' : 'Specific Transactions' }],
      chips:
        transactionMode === 'specific'
          ? selectedTransactions.map(t => ({ label: label(transactionOptions, t) }))
          : undefined
    },
    {
      title: 'Accounts',
      fields: [{ label: 'Scope', value: accountMode === 'all' ? 'All Accounts' : 'Specific Accounts' }],
      chips:
        accountMode === 'specific' ? selectedAccounts.map(a => ({ label: label(accountOptions, a) })) : undefined
    },
    {
      title: 'Amount Range',
      fields: [
        { label: 'From Amount', value: fromAmount },
        { label: 'To Amount', value: toAmount }
      ]
    },
    {
      title: 'Workflow Details',
      fields: [
        { label: 'Approval Required', value: approvalRequired === 'yes' ? 'Yes' : 'No' },
        ...(approvalRequired === 'yes'
          ? [{ label: 'Workflow', value: label(workflowOptions, selectedWorkflow) }]
          : [])
      ]
    }
  ]

  return {
    isEditMode,
    userOptions,
    transactionOptions,
    accountOptions,
    workflowOptions,
    ruleType,
    setRuleType,
    ruleId,
    handleRuleIdChange,
    ruleDescription,
    setRuleDescription,
    initiatorType,
    handleInitiatorTypeChange,
    initiatorUser,
    setInitiatorUser,
    transactionMode,
    handleTransactionMode,
    selectedTransactions,
    handleTransactionSelect,
    accountMode,
    handleAccountMode,
    selectedAccounts,
    handleAccountSelect,
    fromAmount,
    handleFromAmountChange: (v: string) => handleAmount(v, setFromAmount),
    toAmount,
    handleToAmountChange: (v: string) => handleAmount(v, setToAmount),
    approvalRequired,
    handleApprovalRequired,
    selectedWorkflow,
    setSelectedWorkflow,
    resetForm,
    buildRawPayload,
    buildApiPayload,
    buildSections
  }
}