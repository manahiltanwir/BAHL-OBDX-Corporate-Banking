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
import { ruleTypeToCategory, DEFAULT_CURRENCY } from '../Constants'


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
  const [currency, setCurrency] = useState<string>(DEFAULT_CURRENCY)
  const [approvalRequired, setApprovalRequired] = useState<'yes' | 'no'>('no')
  const [selectedWorkflow, setSelectedWorkflow] = useState('')

  useEffect(() => {
    if (partyInfo?.partyId) fetchAccounts(partyInfo.partyId)
  }, [partyInfo])

  useEffect(() => {
    if (partyInfo?.partyId) fetchWorkflows(partyInfo.partyId)
  }, [partyInfo])

  useEffect(() => {
    fetchTransactions(ruleTypeToCategory(ruleType))
    if (!pendingTaskCodes) setSelectedTransactions([])
  }, [ruleType])

  useEffect(() => {
    if (!id) return

      ; (async () => {
        const res: any = await fetchRuleDetail(id as string)
        const record: RuleApiRecord | undefined = res?.payload

        if (!record) return
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
          setCurrency(criteria.currency || DEFAULT_CURRENCY)

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

        const recordPartyId = record.contextId ?? (record as any).partyId

        if (recordPartyId) {
          setPartyIdInput(recordPartyId)
          searchParty(recordPartyId)
        }
      })()
  }, [id])

  useEffect(() => {
    if (!pendingTaskCodes || transactionOptions.length === 0) return

    const resolved = transactionOptions
      .filter(
        opt =>
          pendingTaskCodes.includes(opt.id) ||
          (opt.taskCode ? pendingTaskCodes.includes(opt.taskCode) : false)
      )
      .map(opt => opt.id)

    if (resolved.length === 0) return

    setSelectedTransactions(resolved)
    setPendingTaskCodes(null)
  }, [pendingTaskCodes, transactionOptions])

const handleRuleTypeChange = (value: RuleType) => {
  setRuleType(value)

  if (value !== 'Financial') {
    setFromAmount('')
    setToAmount('')
    setCurrency(DEFAULT_CURRENCY)
  }
}

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
    setCurrency(DEFAULT_CURRENCY)
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
    handleRuleTypeChange,
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
    currency,
    setCurrency,
    approvalRequired,
    handleApprovalRequired,
    selectedWorkflow,
    setSelectedWorkflow,
    resetForm
  }
}