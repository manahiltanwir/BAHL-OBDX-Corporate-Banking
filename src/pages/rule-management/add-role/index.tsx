import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import ApartmentIcon from '@mui/icons-material/Apartment'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import LockIcon from '@mui/icons-material/Lock'
import SearchIcon from '@mui/icons-material/Search'
import LoadingButton from '@mui/lab/LoadingButton'
import { RuleType, InitiatorType, ScopeMode } from 'src/@core/data/dummy-rules'
import {
  useRulePartySearch,
  useRulePartyAccounts,
  useRuleTransactions,
  useRuleWorkflows,
  useRuleDetail
} from 'src/@core/hooks/apps/useRuleManagement'
import {
  RuleTaskCategory,
  RuleApiPayload,
  RuleApiRecord,
  RuleMappedTaskPayload,
  RuleCriteriaPayload
} from 'src/types/apps/ruleManagement'

const RULE_REVIEW_STORAGE_KEY = 'ruleReviewData'
const colors = {
  green: '#15804f',
  greenHover: '#309a6a'
}

export type ReviewFieldData = { label: string; value: string }
export type ReviewChipData = { label: string }
export type ReviewSectionData = {
  title: string
  fields: ReviewFieldData[]
  chips?: ReviewChipData[]
}

export type RuleFormPayload = {
  id?: number
  partyId: string 
  ruleType: RuleType
  ruleId: string
  ruleDescription: string
  initiatorType: InitiatorType
  initiatorUser: string
  transactionMode: ScopeMode
  selectedTransactions: string[]
  accountMode: ScopeMode
  selectedAccounts: string[]
  fromAmount: string
  toAmount: string
  approvalRequired: 'yes' | 'no'
  selectedWorkflow: string
}

export type RuleReviewPayload = {
  isEditMode: boolean
  rawPayload: RuleFormPayload
  apiPayload: RuleApiPayload 
  sections: ReviewSectionData[]
}

const ruleTypeOptions: { value: RuleType; label: string }[] = [
  { value: 'Financial', label: 'Financial' },
  { value: 'NonFinancial', label: 'Non Financial' }
]
const ruleTypeToCategory = (type: RuleType): RuleTaskCategory => (type === 'Financial' ? 'financial' : 'non-financial')
// CURRENCY KO FILED MEIN LENA HAI AMOUNT KE SATH 
const CURRENCY = 'PKR'

const MENU_PROPS = {
  disablePortal: true,
  PaperProps: {
    style: { maxHeight: 300 }
  }
}

const RulePage = () => {
  const router = useRouter()
  const { id } = router.query
  const isEditMode = Boolean(id)

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
    if (partyInfo?.partyId) {
      fetchAccounts(partyInfo.partyId)
    }
  }, [partyInfo])

  useEffect(() => {
    if (partyInfo?.partyId) {
      fetchWorkflows(partyInfo.partyId)
    }
  }, [partyInfo])

  useEffect(() => {
    fetchTransactions(ruleTypeToCategory(ruleType))
    setSelectedTransactions([])
  }, [ruleType])

  useEffect(() => {
    if (!id) return

      ; (async () => {
        const res: any = await fetchRuleDetail(id as string)
        const record: RuleApiRecord | undefined = res?.payload

        if (!record) return

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

        const taskCodes = (record.mappedTasks || []).map(t => t.taskCode)

        if (taskCodes.length === 1 && taskCodes[0] === 'ALL_TRANSACTIONS') {
          setTransactionMode('all')
        } else {
          setTransactionMode('specific')
          setPendingTaskCodes(taskCodes)
        }

        if (record.workflowId) {
          setApprovalRequired('yes')
          setSelectedWorkflow(String(record.workflowId))
        }

        if (record.partyId) {
          setPartyIdInput(record.partyId)
          searchParty(record.partyId)
        }
      })()
  }, [id])

  useEffect(() => {
    if (!pendingTaskCodes || transactionOptions.length === 0) return

    const resolved = transactionOptions.filter(opt => pendingTaskCodes.includes(opt.taskCode)).map(opt => opt.id)

    setSelectedTransactions(resolved)
    setPendingTaskCodes(null)
  }, [pendingTaskCodes, transactionOptions])

  const [ruleTypeOpen, setRuleTypeOpen] = useState(false)
  const [initiatorSelectOpen, setInitiatorSelectOpen] = useState(false)
  const [transactionsSelectOpen, setTransactionsSelectOpen] = useState(false)
  const [accountsSelectOpen, setAccountsSelectOpen] = useState(false)
  const [workflowOpen, setWorkflowOpen] = useState(false)

  useEffect(() => {
    const closeAllDropdowns = (event: Event) => {
      const target = event.target as HTMLElement
      if (target?.closest?.('.MuiMenu-paper, .MuiPopover-paper, .MuiMenu-list, .MuiList-root')) {
        return
      }

      setRuleTypeOpen(false)
      setInitiatorSelectOpen(false)
      setTransactionsSelectOpen(false)
      setAccountsSelectOpen(false)
      setWorkflowOpen(false)
    }

    window.addEventListener('scroll', closeAllDropdowns, true)

    return () => window.removeEventListener('scroll', closeAllDropdowns, true)
  }, [])

  const handleRuleIdChange = (value: string) => {
    setRuleId(value.replace(/[^a-zA-Z0-9]/g, ''))
  }

  const handleAmountChange = (value: string, setter: (val: string) => void) => {
    setter(value.replace(/[^0-9.]/g, ''))
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

  const handleTransactionSelect = (event: SelectChangeEvent<typeof selectedTransactions>) => {
    const { value } = event.target
    setSelectedTransactions(typeof value === 'string' ? value.split(',') : value)
  }

  const handleAccountSelect = (event: SelectChangeEvent<typeof selectedAccounts>) => {
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

  const buildReviewSections = (): ReviewSectionData[] => [
    {
      title: 'Party Information',
      fields: [
        { label: 'Party ID', value: partyInfo?.partyId ?? '' },
        { label: 'Party Name', value: partyInfo?.partyName ?? '' }
      ]
    },
    {
      title: 'Rule Details',
      fields: [
        { label: 'Rule Type', value: ruleTypeOptions.find(opt => opt.value === ruleType)?.label ?? ruleType },
        { label: 'Rule ID', value: ruleId },
        { label: 'Rule Description', value: ruleDescription }
      ]
    },
    {
      title: 'Initiator',
      fields: [
        { label: 'Initiator Type', value: initiatorType === 'user' ? 'User' : 'User Group' },
        {
          label: 'Initiator',
          value: userOptions.find(user => user.id === initiatorUser)?.label ?? initiatorUser
        }
      ]
    },
    {
      title: 'Transactions',
      fields: [{ label: 'Scope', value: transactionMode === 'all' ? 'All Transactions' : 'Specific Transactions' }],
      chips:
        transactionMode === 'specific'
          ? selectedTransactions.map(txnId => ({
            label: transactionOptions.find(t => t.id === txnId)?.label ?? txnId
          }))
          : undefined
    },
    {
      title: 'Accounts',
      fields: [{ label: 'Scope', value: accountMode === 'all' ? 'All Accounts' : 'Specific Accounts' }],
      chips:
        accountMode === 'specific'
          ? selectedAccounts.map(accId => ({
            label: accountOptions.find(acc => acc.id === accId)?.label ?? accId
          }))
          : undefined
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
          ? [{ label: 'Workflow', value: workflowOptions.find(wf => wf.id === selectedWorkflow)?.label ?? selectedWorkflow }]
          : [])
      ]
    }
  ]

  const buildApiPayload = (): RuleApiPayload => {
    const mappedTasks: RuleMappedTaskPayload[] =
      transactionMode === 'all'
        ? [{ taskCode: 'ALL_TRANSACTIONS' }]
        : Array.from(
          new Set(
            selectedTransactions
              .map(txnId => transactionOptions.find(t => t.id === txnId)?.taskCode)
              .filter(Boolean) as string[]
          )
        ).map(taskCode => ({ taskCode }))

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
      ...(isEditMode && id ? { id: Number(id) } : {}),
      ruleCode: ruleId,
      description: ruleDescription,
      partyId: partyInfo!.partyId,
      ruleType: ruleType === 'Financial' ? 'FINANCIAL' : 'NON_FINANCIAL',
      ...(approvalRequired === 'yes' && selectedWorkflow ? { workflowId: Number(selectedWorkflow) } : {}),
      mappedTasks,
      criteriaList
    }
  }

  const handleSave = () => {
    if (!partyInfo) return

    const rawPayload: RuleFormPayload = {
      id: isEditMode ? Number(id) : undefined,
      partyId: partyInfo.partyId,
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
    }

    const reviewPayload: RuleReviewPayload = {
      isEditMode,
      rawPayload,
      apiPayload: buildApiPayload(),
      sections: buildReviewSections()
    }

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(RULE_REVIEW_STORAGE_KEY, JSON.stringify(reviewPayload))
    }

    router.push('/rule-management/add-role/review-role')
  }

  const handleCancel = () => {
    setRuleType('Financial')
    setRuleId('')
    setRuleDescription('')
    setInitiatorType('user')
    setInitiatorUser('')
    setTransactionMode('all')
    setSelectedTransactions([])
    setAccountMode('all')
    setSelectedAccounts([])
    setFromAmount('')
    setToAmount('')
    setApprovalRequired('no')
    setSelectedWorkflow('')
    setPartyIdInput('')
    resetPartySearch()
    router.push('/rule-management')
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ mb: 4 }}>
          {isEditMode ? 'Edit Rule' : 'Rule Management'}
        </Typography>

        <Card sx={{ p: 5, mb: 6 }}>
          <Typography
            variant='caption'
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.75px',
              color: 'text.secondary',
              mb: 3,
              display: 'block'
            }}
          >
            Party
          </Typography>

          {!partyInfo ? (
            <>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                Search the Party ID this rule belongs to. Once found, you'll be able to configure the rule below.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <TextField
                  fullWidth
                  label='Party ID'
                  placeholder='e.g. PRT-9921'
                  value={partyIdInput}
                  onChange={handlePartyIdInputChange}
                  onKeyDown={event => event.key === 'Enter' && handlePartySearch()}
                  error={partyStatus === 'not-found' || partyStatus === 'error'}
                  helperText={
                    partyStatus === 'not-found'
                      ? 'No users found for this Party ID.'
                      : partyStatus === 'error'
                        ? 'Party search failed. Please try again.'
                        : ' '
                  }
                />
                <LoadingButton
                  variant='contained'
                  loading={partyStatus === 'searching'}
                  startIcon={<SearchIcon fontSize='small' />}
                  onClick={handlePartySearch}
                >
                  Search Party
                </LoadingButton>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
                p: 2.5,
                borderRadius: 2,
                bgcolor: 'rgba(21, 128, 79, 0.08)',
                border: '1px solid rgba(21, 128, 79, 0.3)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
                <Avatar sx={{ bgcolor: colors.green, width: 44, height: 44 }}>
                  <ApartmentIcon />
                </Avatar>
                <Box>
                  <Typography variant='caption' sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
                    Party ID
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>{partyInfo.partyId}</Typography>
                </Box>
                <Divider orientation='vertical' flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Box>
                  <Typography variant='caption' sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
                    Party Name
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>{partyInfo.partyName}</Typography>
                </Box>
              </Box>

              {isEditMode ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
                  <LockIcon fontSize='small' />
                  <Typography variant='caption' sx={{ fontWeight: 600 }}>
                    Party locked — cannot be changed
                  </Typography>
                </Box>
              ) : (
                <Button
                  size='small'
                  variant='outlined'
                  startIcon={<ChangeCircleIcon fontSize='small' />}
                  onClick={handleChangeParty}
                  sx={{ color: colors.green, borderColor: colors.green, '&:hover': { borderColor: colors.greenHover } }}
                >
                  Change Party
                </Button>
              )}
            </Box>
          )}
        </Card>

        {partyInfo && (
          <Card sx={{ p: 5 }}>
            {/* Rule Details */}
            <Grid container spacing={5}>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  required
                  label='Rule Type'
                  value={ruleType}
                  onChange={e => setRuleType(e.target.value as RuleType)}
                  SelectProps={{
                    open: ruleTypeOpen,
                    onOpen: () => setRuleTypeOpen(true),
                    onClose: () => setRuleTypeOpen(false),
                    MenuProps: MENU_PROPS
                  }}
                >
                  {ruleTypeOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label='Rule ID'
                  placeholder='e.g. RULE001'
                  value={ruleId}
                  onChange={e => handleRuleIdChange(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label='Rule Description'
                  value={ruleDescription}
                  onChange={e => setRuleDescription(e.target.value)}
                />
              </Grid>
            </Grid>

            <Typography variant='subtitle1' sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
              Initiator
            </Typography>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ mb: 1.5 }}>
                  Initiator Type
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  color='primary'
                  size='small'
                  value={initiatorType}
                  onChange={(e, value) => {
                    if (value) {
                      setInitiatorType(value)
                      setInitiatorUser('')
                    }
                  }}
                >
                  <ToggleButton value='user'>User</ToggleButton>
                  <ToggleButton value='userGroup' disabled>
                    User Group
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  size='small'
                  label='Please Select'
                  value={initiatorUser}
                  onChange={e => setInitiatorUser(e.target.value)}
                  SelectProps={{
                    open: initiatorSelectOpen,
                    onOpen: () => setInitiatorSelectOpen(true),
                    onClose: () => setInitiatorSelectOpen(false),
                    MenuProps: MENU_PROPS
                  }}
                >
                  {userOptions.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Typography variant='subtitle1' sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
              Transactions
            </Typography>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <ToggleButtonGroup
                  exclusive
                  color='primary'
                  size='small'
                  value={transactionMode}
                  onChange={(e, value) => handleTransactionMode(value)}
                >
                  <ToggleButton value='all'>All Transactions</ToggleButton>
                  <ToggleButton value='specific'>Specific Transactions</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              {transactionMode === 'specific' && (
                <Grid item xs={12} sm={8}>
                  <FormControl fullWidth size='small'>
                    <InputLabel id='transactions-label'>Select Transactions</InputLabel>
                    <Select
                      labelId='transactions-label'
                      multiple
                      open={transactionsSelectOpen}
                      onOpen={() => setTransactionsSelectOpen(true)}
                      onClose={() => setTransactionsSelectOpen(false)}
                      value={selectedTransactions}
                      onChange={handleTransactionSelect}
                      input={<OutlinedInput label='Select Transactions' />}
                      renderValue={selected => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {(selected as string[]).map(value => (
                            <Chip
                              key={value}
                              label={transactionOptions.find(t => t.id === value)?.label ?? value}
                              size='small'
                            />
                          ))}
                        </Box>
                      )}
                      MenuProps={MENU_PROPS}
                    >
                      {transactionOptions.map(txn => (
                        <MenuItem key={txn.id} value={txn.id}>
                          <Checkbox checked={selectedTransactions.indexOf(txn.id) > -1} />
                          <ListItemText primary={txn.label} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>

            <Typography variant='subtitle1' sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
              Accounts
            </Typography>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <ToggleButtonGroup
                  exclusive
                  color='primary'
                  size='small'
                  value={accountMode}
                  onChange={(e, value) => handleAccountMode(value)}
                >
                  <ToggleButton value='all'>All Accounts</ToggleButton>
                  <ToggleButton value='specific'>Specific Accounts</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              {accountMode === 'specific' && (
                <Grid item xs={12} sm={8}>
                  <FormControl fullWidth size='small'>
                    <InputLabel id='accounts-label'>Select Accounts</InputLabel>
                    <Select
                      labelId='accounts-label'
                      multiple
                      open={accountsSelectOpen}
                      onOpen={() => setAccountsSelectOpen(true)}
                      onClose={() => setAccountsSelectOpen(false)}
                      value={selectedAccounts}
                      onChange={handleAccountSelect}
                      input={<OutlinedInput label='Select Accounts' />}
                      renderValue={selected => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {(selected as string[]).map(value => {
                            const account = accountOptions.find(acc => acc.id === value)

                            return <Chip key={value} label={account?.label ?? value} size='small' />
                          })}
                        </Box>
                      )}
                      MenuProps={MENU_PROPS}
                    >
                      {accountOptions.map(account => (
                        <MenuItem key={account.id} value={account.id}>
                          <Checkbox checked={selectedAccounts.indexOf(account.id) > -1} />
                          <ListItemText primary={account.label} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>

            <Typography variant='subtitle1' sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
              Amount Range
            </Typography>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size='small'
                  label='From Amount'
                  value={fromAmount}
                  onChange={e => handleAmountChange(e.target.value, setFromAmount)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size='small'
                  label='To Amount'
                  value={toAmount}
                  onChange={e => handleAmountChange(e.target.value, setToAmount)}
                />
              </Grid>
            </Grid>

            <Typography variant='subtitle1' sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
              Workflow Details
            </Typography>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ mb: 1.5 }}>
                  Approval Required
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  color='primary'
                  size='small'
                  value={approvalRequired}
                  onChange={(e, value) => handleApprovalRequired(value)}
                >
                  <ToggleButton value='yes'>Yes</ToggleButton>
                  <ToggleButton value='no'>No</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              {approvalRequired === 'yes' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    size='small'
                    label='Select Workflow'
                    value={selectedWorkflow}
                    onChange={e => setSelectedWorkflow(e.target.value)}
                    SelectProps={{
                      open: workflowOpen,
                      onOpen: () => setWorkflowOpen(true),
                      onClose: () => setWorkflowOpen(false),
                      MenuProps: MENU_PROPS
                    }}
                  >
                    {workflowOptions.map(workflow => (
                      <MenuItem key={workflow.id} value={workflow.id}>
                        {workflow.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}
            </Grid>

            {/* Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3, mt: 8 }}>
              <Button variant='outlined' color='secondary' onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant='contained' onClick={handleSave}>
                {isEditMode ? 'Update Rule' : 'Save'}
              </Button>
            </Box>
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