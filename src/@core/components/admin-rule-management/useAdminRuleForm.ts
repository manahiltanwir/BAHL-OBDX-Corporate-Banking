import { useEffect, useState } from 'react'
import { SelectChangeEvent } from '@mui/material'
import { RuleType, InitiatorType, ScopeMode } from 'src/@core/data/dummy-rules'
import {
  ADMIN_DEFAULT_RULE_TYPE,
  adminApiToRuleType,
  adminRuleTypeToApi,
  adminRuleTypeToCategory,
  adminRuleTypeLabel
} from './adminRuleConstants'
import {
  useAdminRuleTransactions,
  useAdminRuleDetail,
  useAdminRuleUsers,
  useAdminRuleWorkflows
} from 'src/@core/hooks/apps/useAdminRuleManagement'
import {
  AdminRuleApiPayload,
  AdminRuleApiRecord,
  AdminRuleCriteriaPayload,
  RuleMappedTaskPayload
} from 'src/types/apps/ruleManagement'
import { AdminOption, AdminReviewSection, AdminRuleFormPayload } from './types'

export function useAdminRuleForm(id: string | string[] | undefined) {
  const isEditMode = Boolean(id)

  const { transactionOptions, fetchTransactions } = useAdminRuleTransactions()
  const { fetchRuleDetail } = useAdminRuleDetail()
  const { userOptions } = useAdminRuleUsers()
  const { workflowOptions, fetchWorkflows } = useAdminRuleWorkflows()

  const [ruleType, setRuleType] = useState<RuleType>(ADMIN_DEFAULT_RULE_TYPE)
  const [ruleId, setRuleId] = useState('')
  const [ruleDescription, setRuleDescription] = useState('')
  const [initiatorType, setInitiatorType] = useState<InitiatorType>('user')
  const [initiatorUser, setInitiatorUser] = useState('')
  const [transactionMode, setTransactionMode] = useState<ScopeMode>('all')
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [pendingTaskCodes, setPendingTaskCodes] = useState<string[] | null>(null)
  const [approvalRequired, setApprovalRequired] = useState<'yes' | 'no'>('no')
  const [selectedWorkflow, setSelectedWorkflow] = useState('')

  // ** Approval Required = Yes hote hi workflows load
  useEffect(() => {
    if (approvalRequired === 'yes') fetchWorkflows()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvalRequired])

  // Rule type badalne par transactions dobara load. Edit mein pending selection khali nahi karni.
  useEffect(() => {
    fetchTransactions(adminRuleTypeToCategory(ruleType))
    if (!pendingTaskCodes) setSelectedTransactions([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruleType])

  // Edit mode: rule load
  useEffect(() => {
    if (!id) return

    ;(async () => {
      const res: any = await fetchRuleDetail(id as string)
      const record: AdminRuleApiRecord | undefined = res?.payload

      if (!record || res?.error) return

      // pending ko setRuleType se PEHLE set karna zaroori hai
      const taskCodes = (record.mappedTasks || []).map(t => t.taskCode)

      if (taskCodes.length === 1 && taskCodes[0] === 'ALL_TRANSACTIONS') {
        setTransactionMode('all')
      } else {
        setTransactionMode('specific')
        setPendingTaskCodes(taskCodes)
      }

      setRuleType(adminApiToRuleType(record.ruleType))
      setRuleId(record.ruleCode)
      setRuleDescription(record.description)

      const criteria = record.criteriaList?.[0]

      if (criteria) {
        setInitiatorType(criteria.initiatorType === 'ROLE' ? 'userGroup' : 'user')
        // ** User ki id criteria.initiatorId mein hoti hai, contextId purane records mein null ho sakta hai
        setInitiatorUser(String(criteria.initiatorId ?? record.contextId ?? ''))
      } else if (record.contextId) {
        setInitiatorUser(String(record.contextId))
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

  const handleTransactionSelect = (e: SelectChangeEvent<string[]>) => {
    const { value } = e.target

    setSelectedTransactions(typeof value === 'string' ? value.split(',') : value)
  }

  const handleApprovalRequired = (value: 'yes' | 'no' | null) => {
    if (!value) return
    setApprovalRequired(value)
    if (value === 'no') setSelectedWorkflow('')
  }

  const resetForm = () => {
    setRuleType(ADMIN_DEFAULT_RULE_TYPE)
    setRuleId('')
    setRuleDescription('')
    setInitiatorType('user')
    setInitiatorUser('')
    setTransactionMode('all')
    setSelectedTransactions([])
    setPendingTaskCodes(null)
    setApprovalRequired('no')
    setSelectedWorkflow('')
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
    approvalRequired,
    selectedWorkflow
  })

  const buildApiPayload = (createdBy: string): AdminRuleApiPayload => {
    const mappedTasks: RuleMappedTaskPayload[] =
      transactionMode === 'all'
        ? [{ taskCode: 'ALL_TRANSACTIONS' }]
        : Array.from(new Set(selectedTransactions)).map(taskCode => ({ taskCode }))

    const criteriaList: AdminRuleCriteriaPayload[] = [
      {
        initiatorType: initiatorType === 'user' ? 'USER' : 'ROLE',
        initiatorId: initiatorUser
      }
    ]

    return {
      ...(isEditMode && id ? { id: Number(id as string) } : {}),
      isWorkflowRequired: approvalRequired === 'yes',
      ruleCode: ruleId,
      description: ruleDescription,
      createdBy, // login user ki id
      contextType: 'GLOBAL', // hardcoded
      contextId: initiatorUser, // dropdown se select kiye gaye user ki id
      ruleType: adminRuleTypeToApi(ruleType),
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
        { label: 'Rule Type', value: adminRuleTypeLabel(ruleType) },
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