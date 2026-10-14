import { useEffect, useState } from 'react'
import { SelectChangeEvent } from '@mui/material'
import { RuleType, InitiatorType, ScopeMode } from 'src/@core/data/dummy-rules'
import {
  useRulePartySearch,
  useRulePartyAccounts,
  useRuleTransactions,
  useRuleWorkflows,
  useRuleDetail
} from 'src/@core/hooks/apps/useRuleManagement'
import { RuleApiRecord } from 'src/types/apps/ruleManagement'
import { ruleTypeToCategory } from '../Constants'

export function useRuleForm(id: string | string[] | undefined, isEditMode: boolean) {
  const [partyIdInput, setPartyIdInput] = useState('')
  const { partyInfo, userOptions, status: partyStatus, searchParty, resetPartySearch } = useRulePartySearch()
  const { accountOptions, fetchAccounts } = useRulePartyAccounts()
  const { transactionOptions, fetchTransactions } = useRuleTransactions()
  const { workflowOptions, fetchWorkflows } = useRuleWorkflows()
  const { fetchRuleDetail } = useRuleDetail()

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

  useEffect(() => {
    if (partyInfo?.partyId) fetchAccounts(partyInfo.partyId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partyInfo])

  useEffect(() => {
    if (partyInfo?.partyId) fetchWorkflows(partyInfo.partyId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partyInfo])

  // Rule type change -> reload transaction options.
  // In edit mode, saved selections are still waiting to be resolved, so don't wipe them.
  useEffect(() => {
    fetchTransactions(ruleTypeToCategory(ruleType))
    if (!pendingTaskCodes) setSelectedTransactions([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruleType])

  // Load an existing rule when editing
  useEffect(() => {
    if (!id) return

    ;(async () => {
      const res: any = await fetchRuleDetail(id as string)
      const record: RuleApiRecord | undefined = res?.payload

      if (!record) return

      // Saved values can be operation codes (new format) or task codes (old records).
      // Must be set BEFORE setRuleType so the ruleType effect doesn't clear the selection.
      const taskCodes = (record.mappedTasks || []).map(t => t.taskCode)
      const isAllTransactions = taskCodes.length === 1 && taskCodes[0] === 'ALL_TRANSACTIONS'

      if (isAllTransactions) {
        setTransactionMode('all')
      } else {
        setTransactionMode('specific')
        setPendingTaskCodes(taskCodes)
      }

      setRuleType(record.ruleType === 'FINANCIAL' ? 'Financial' : 'NonFinancial')
      setRuleId(record.ruleCode)
      setRuleDescription(record.description)

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

      // Backend now sends contextId (partyId kept as fallback for old responses)
      const recordPartyId = record.contextId ?? (record as any).partyId

      if (recordPartyId) {
        setPartyIdInput(recordPartyId)
        searchParty(recordPartyId)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Resolve saved codes -> option ids once the matching transaction options have loaded.
  // Pending stays set until at least one option matches, so stale options from the
  // previous category (e.g. Financial before Non-Financial arrives) don't swallow it.
  useEffect(() => {
    if (!pendingTaskCodes || transactionOptions.length === 0) return

    const resolved = transactionOptions
      .filter(
        opt =>
          // new format: operationCode saved (opt.id is the operationCode)
          pendingTaskCodes.includes(opt.id) ||
          // old format: task code saved (e.g. "US", "RTM")
          (opt.taskCode ? pendingTaskCodes.includes(opt.taskCode) : false)
      )
      .map(opt => opt.id)

    if (resolved.length === 0) return

    setSelectedTransactions(resolved)
    setPendingTaskCodes(null)
  }, [pendingTaskCodes, transactionOptions])

  const handleRuleIdChange = (value: string) => setRuleId(value.replace(/[^a-zA-Z0-9]/g, ''))

  const handleAmountChange = (value: string, setter: (val: string) => void) =>
    setter(value.replace(/[^0-9.]/g, ''))

  const handleFromAmountChange = (value: string) => handleAmountChange(value, setFromAmount)
  const handleToAmountChange = (value: string) => handleAmountChange(value, setToAmount)

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

  const handleTransactionSelect = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target
    setSelectedTransactions(typeof value === 'string' ? value.split(',') : value)
  }

  const handleAccountSelect = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target
    setSelectedAccounts(typeof value === 'string' ? value.split(',') : value)
  }

  const handleApprovalRequired = (value: 'yes' | 'no' | null) => {
    if (!value) return
    setApprovalRequired(value)
    if (value === 'no') setSelectedWorkflow('')
  }

  const handlePartyIdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setPartyIdInput(e.target.value)

  const handlePartySearch = async () => {
    if (!partyIdInput.trim()) return
    await searchParty(partyIdInput)
  }

  const handleChangeParty = () => {
    if (isEditMode) return
    setPartyIdInput('')
    resetPartySearch()
    setInitiatorUser('')
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
    setPartyIdInput('')
    resetPartySearch()
  }

  return {
    partyIdInput,
    partyInfo,
    userOptions,
    partyStatus,
    handlePartyIdInputChange,
    handlePartySearch,
    handleChangeParty,
    accountOptions,
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
    accountMode,
    handleAccountMode,
    selectedAccounts,
    handleAccountSelect,
    fromAmount,
    handleFromAmountChange,
    toAmount,
    handleToAmountChange,
    approvalRequired,
    handleApprovalRequired,
    selectedWorkflow,
    setSelectedWorkflow,
    resetForm
  }
}