import React, { useState } from 'react'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
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

// ** Types
type RuleType = 'Financial' | 'NonFinancial' | 'Maintenance'
type InitiatorType = 'user' | 'userGroup'
type ScopeMode = 'all' | 'specific'

// ** Dummy Data (replace with API data)
const ruleTypeOptions: { value: RuleType; label: string }[] = [
  { value: 'Financial', label: 'Financial' },
  { value: 'NonFinancial', label: 'Non Financial' },
  { value: 'Maintenance', label: 'Maintenance' }
]

const dummyAccountUsers = [
  { id: '99999991_Maker1', label: 'Maker 1 (99999991_Maker1)' },
  { id: '99999991_Checker1', label: 'Checker 1 (99999991_Checker1)' },
  { id: '99999992_Maker1', label: 'Maker 1 (99999992_Maker1)' },
  { id: '99999992_Checker1', label: 'Checker 1 (99999992_Checker1)' }
]

const dummyTransactions = [
  'IBFT',
  'FT',
  'Raast',
  '1link',
]

const dummyAccounts = [
  { id: 'ACC-1001', label: 'Current Account - 1001' },
  { id: 'ACC-1002', label: 'Current Account - 1002' },
  { id: 'ACC-1003', label: 'Savings Account - 1003' }
]

const dummyWorkflows = ['Maker 999999-6', 'Maker 999999-3', 'maker 9999999-2']

const MENU_PROPS = {
  PaperProps: {
    style: { maxHeight: 300 }
  }
}

const RulePage = () => {
  // ** Rule Details
  const [ruleType, setRuleType] = useState<RuleType>('Financial')
  const [ruleId, setRuleId] = useState('')
  const [ruleDescription, setRuleDescription] = useState('')

  // ** Initiator
  const [initiatorType, setInitiatorType] = useState<InitiatorType>('user')
  const [initiatorUser, setInitiatorUser] = useState('')

  // ** Transactions
  const [transactionMode, setTransactionMode] = useState<ScopeMode>('all')
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])

  // ** Accounts
  const [accountMode, setAccountMode] = useState<ScopeMode>('all')
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])

  // ** Amount Range
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')

  // ** Workflow Details
  const [approvalRequired, setApprovalRequired] = useState<'yes' | 'no'>('no')
  const [selectedWorkflow, setSelectedWorkflow] = useState('')

  // ** Rule ID should only allow alphanumeric characters
  const handleRuleIdChange = (value: string) => {
    setRuleId(value.replace(/[^a-zA-Z0-9]/g, ''))
  }

  // ** Only digits allowed for amount fields
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

  const handleSave = () => {
    const payload = {
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

    console.log('Saving rule:', payload)

    // TODO: API call / dispatch action
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
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ mb: 4 }}>
          Rule Management
        </Typography>

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

          {/* Initiator */}
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
                <ToggleButton value='userGroup'>User Group</ToggleButton>
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
              >
                {dummyAccountUsers.map(user => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {/* Transactions */}
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
                    value={selectedTransactions}
                    onChange={handleTransactionSelect}
                    input={<OutlinedInput label='Select Transactions' />}
                    renderValue={selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {(selected as string[]).map(value => (
                          <Chip key={value} label={value} size='small' />
                        ))}
                      </Box>
                    )}
                    MenuProps={MENU_PROPS}
                  >
                    {dummyTransactions.map(txn => (
                      <MenuItem key={txn} value={txn}>
                        <Checkbox checked={selectedTransactions.indexOf(txn) > -1} />
                        <ListItemText primary={txn} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>

          {/* Accounts */}
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
                    value={selectedAccounts}
                    onChange={handleAccountSelect}
                    input={<OutlinedInput label='Select Accounts' />}
                    renderValue={selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {(selected as string[]).map(value => {
                          const account = dummyAccounts.find(acc => acc.id === value)

                          return <Chip key={value} label={account?.label ?? value} size='small' />
                        })}
                      </Box>
                    )}
                    MenuProps={MENU_PROPS}
                  >
                    {dummyAccounts.map(account => (
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

          {/* Amount Range */}
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

          {/* Workflow Details */}
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
                >
                  {dummyWorkflows.map(workflow => (
                    <MenuItem key={workflow} value={workflow}>
                      {workflow}
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
              Save
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

RulePage.acl = {
  action: 'itsHaveAccess',
  subject: 'add-role'
}

export default RulePage