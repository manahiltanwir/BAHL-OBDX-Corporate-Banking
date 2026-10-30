import { useState } from 'react'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material'
import { alpha, useTheme, type SxProps, type Theme } from '@mui/material/styles'
import { Controller, useForm } from 'react-hook-form'

import SearchIcon from '@mui/icons-material/Search'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PublicIcon from '@mui/icons-material/Public'
import BusinessIcon from '@mui/icons-material/Business'
import PersonIcon from '@mui/icons-material/Person'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import CategoryIcon from '@mui/icons-material/Category'
import InventoryIcon from '@mui/icons-material/Inventory2Outlined'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ApiResponseDialog from 'src/@core/components/ApiResponseDialog'

// ======================= THEME (uses MUI theme palette: primary / secondary) =======================
const cardSx: SxProps<Theme> = { p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 2 }

// ======================= TYPES =======================
type Scope = 'GLOBAL' | 'PARTY' | 'USER' | 'ACTIVITY' | 'ACTIVITY_GROUP'
type LimitType = 'TRANSACTION' | 'CUMULATIVE'
type Frequency = 'DAILY' | 'MONTHLY'
type DialogMode = 'create' | 'edit' | 'view' | null

interface Option {
  code: string
  name: string
}

interface LimitPackage {
  scopeKey: string // e.g. "PARTY:CN421017654123", "GLOBAL:"
  limitType: LimitType
  packageCode: string
  packageDescription: string
  currency: string
  // Transaction
  minAmount?: number
  maxAmount?: number
  // Cumulative
  frequency?: Frequency
  cumulativeAmount?: number
  maxTransactions?: number
}

// amounts are strings in the form, converted to numbers on save
interface PackageFormValues {
  limitType: LimitType
  packageCode: string
  packageDescription: string
  currency: string
  minAmount: string
  maxAmount: string
  frequency: Frequency
  cumulativeAmount: string
  maxTransactions: string
}

// Adjust to whatever ApiResponseDialog expects
interface ApiResponseInfo {
  success: boolean
  message: string
}

// ======================= MOCK DATA (replace with API later) =======================
const CURRENCIES = ['PKR', 'USD', 'EUR', 'GBP', 'AED']

const MOCK_PARTIES: Option[] = [
  { code: 'CN421017654123', name: 'Alpha Traders Pvt Ltd' },
  { code: 'CN100200300', name: 'Beta Industries' }
]

const MOCK_USERS: Option[] = [
  { code: 'JDOE', name: 'John Doe' },
  { code: 'ASMITH', name: 'Anna Smith' }
]

const MOCK_ACTIVITIES: Option[] = [
  { code: 'FT01', name: 'Fund Transfer - Own Account' },
  { code: 'FT02', name: 'Fund Transfer - Within Bank' },
  { code: 'FT03', name: 'Fund Transfer - Interbank' },
  { code: 'IP01', name: 'International Single Payment' },
  { code: 'IP02', name: 'International Bulk Payment' },
  { code: 'BP01', name: 'Bill Payment' }
]

const MOCK_ACTIVITY_GROUPS: Option[] = [
  { code: 'DOMESTIC', name: 'Domestic transfers' },
  { code: 'INTL', name: 'International payments' }
]

const INITIAL_PACKAGES: LimitPackage[] = [
  { scopeKey: 'GLOBAL:', limitType: 'TRANSACTION', packageCode: 'GP01', packageDescription: 'Global transaction limit', currency: 'PKR', minAmount: 1, maxAmount: 1000 },
  { scopeKey: 'GLOBAL:', limitType: 'CUMULATIVE', packageCode: 'GC01', packageDescription: 'Global daily cumulative', currency: 'PKR', frequency: 'DAILY', cumulativeAmount: 50000, maxTransactions: 10 },
  { scopeKey: 'PARTY:CN421017654123', limitType: 'TRANSACTION', packageCode: 'PP01', packageDescription: 'Alpha per-transaction limit', currency: 'PKR', minAmount: 1, maxAmount: 100000 },
  { scopeKey: 'USER:JDOE', limitType: 'CUMULATIVE', packageCode: 'UP01', packageDescription: 'John monthly cumulative', currency: 'PKR', frequency: 'MONTHLY', cumulativeAmount: 500000, maxTransactions: 100 },
  { scopeKey: 'ACTIVITY:FT01', limitType: 'TRANSACTION', packageCode: 'AP01', packageDescription: 'Own account transfer limit', currency: 'PKR', minAmount: 1, maxAmount: 500000 },
  { scopeKey: 'ACTIVITY_GROUP:DOMESTIC', limitType: 'CUMULATIVE', packageCode: 'GG01', packageDescription: 'Domestic daily cumulative', currency: 'PKR', frequency: 'DAILY', cumulativeAmount: 250000, maxTransactions: 25 }
]

const SCOPES: { value: Scope; label: string; hint: string; icon: JSX.Element }[] = [
  { value: 'ACTIVITY', label: 'Activity', hint: 'One transaction', icon: <SwapHorizIcon /> },
  { value: 'GLOBAL', label: 'Global', hint: 'Applies to everyone', icon: <PublicIcon /> },
  { value: 'PARTY', label: 'Party', hint: 'One corporate party', icon: <BusinessIcon /> },
  { value: 'USER', label: 'User', hint: 'One user', icon: <PersonIcon /> },
  { value: 'ACTIVITY_GROUP', label: 'Activity Group', hint: 'One transaction group', icon: <CategoryIcon /> }
]

const emptyForm: PackageFormValues = {
  limitType: 'TRANSACTION',
  packageCode: '',
  packageDescription: '',
  currency: 'PKR',
  minAmount: '',
  maxAmount: '',
  frequency: 'DAILY',
  cumulativeAmount: '',
  maxTransactions: ''
}

// ======================= HELPERS =======================
const typeLabel: Record<LimitType, string> = { TRANSACTION: 'Transactional', CUMULATIVE: 'Cumulative' }

const fmt = (currency: string, n: number) =>
  `${currency} ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const per = (f?: Frequency) => (f === 'MONTHLY' ? 'month' : 'day')

const describeLimit = (p: LimitPackage) =>
  p.limitType === 'TRANSACTION'
    ? `${fmt(p.currency, p.minAmount ?? 0)} to ${fmt(p.currency, p.maxAmount ?? 0)} per transaction`
    : `${fmt(p.currency, p.cumulativeAmount ?? 0)}, max ${p.maxTransactions} txn(s) per ${per(p.frequency)}`

const optionLabel = (o: Option) => `${o.code} - ${o.name}`

const toForm = (p: LimitPackage): PackageFormValues => ({
  limitType: p.limitType,
  packageCode: p.packageCode,
  packageDescription: p.packageDescription,
  currency: p.currency,
  minAmount: p.minAmount?.toString() ?? '',
  maxAmount: p.maxAmount?.toString() ?? '',
  frequency: p.frequency ?? 'DAILY',
  cumulativeAmount: p.cumulativeAmount?.toString() ?? '',
  maxTransactions: p.maxTransactions?.toString() ?? ''
})

const fromForm = (v: PackageFormValues, scopeKey: string): LimitPackage =>
  v.limitType === 'TRANSACTION'
    ? {
        scopeKey,
        limitType: v.limitType,
        packageCode: v.packageCode,
        packageDescription: v.packageDescription,
        currency: v.currency,
        minAmount: Number(v.minAmount),
        maxAmount: Number(v.maxAmount)
      }
    : {
        scopeKey,
        limitType: v.limitType,
        packageCode: v.packageCode,
        packageDescription: v.packageDescription,
        currency: v.currency,
        frequency: v.frequency,
        cumulativeAmount: Number(v.cumulativeAmount),
        maxTransactions: Number(v.maxTransactions)
      }

// ======================= PAGE =======================
const Page = () => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // soft tint of the theme primary colour
  const tint = (a: number) => alpha(theme.palette.primary.main, a)

  const iconBox = (filled: boolean) => ({
    width: 40,
    height: 40,
    flexShrink: 0,
    borderRadius: 1.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: filled ? theme.palette.primary.main : tint(0.12),
    color: filled ? theme.palette.primary.contrastText : theme.palette.primary.main
  })

  const form = useForm<PackageFormValues>({ defaultValues: emptyForm })
  const formType = form.watch('limitType')
  const formCurrency = form.watch('currency')
  const v = form.watch()

  // ---- step 1: scope + target ----
  const [scope, setScope] = useState<Scope | null>(null)
  const [searchValue, setSearchValue] = useState('') // party id / user id typed by the user
  const [target, setTarget] = useState<Option | null>(null) // found party / user
  const [searchError, setSearchError] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [activity, setActivity] = useState<Option | null>(null)
  const [activityGroup, setActivityGroup] = useState<Option | null>(null)

  // ---- step 2: packages ----
  // "database" lives in state for now; swap for API calls later
  const [allPackages, setAllPackages] = useState<LimitPackage[]>(INITIAL_PACKAGES)
  const [tab, setTab] = useState<LimitType>('TRANSACTION')
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [deleteTarget, setDeleteTarget] = useState<LimitPackage | null>(null)
  const [saving, setSaving] = useState(false)
  const [responseInfo, setResponseInfo] = useState<ApiResponseInfo | null>(null)

  const isSearchScope = scope === 'PARTY' || scope === 'USER'
  const readOnly = dialogMode === 'view'

  const selectedTarget: Option | null =
    scope === 'PARTY' || scope === 'USER' ? target : scope === 'ACTIVITY' ? activity : scope === 'ACTIVITY_GROUP' ? activityGroup : null

  const scopeReady = scope === 'GLOBAL' || (scope !== null && selectedTarget !== null)
  const scopeKey = scope ? `${scope}:${selectedTarget?.code ?? ''}` : ''
  const scopeLabel = SCOPES.find(s => s.value === scope)?.label ?? ''
  const scopeSummary =
    scope === 'GLOBAL' ? 'Global (all parties, users and activities)' : selectedTarget ? `${scopeLabel}: ${optionLabel(selectedTarget)}` : ''

  // TODO: API - get packages for this scope + target
  const scopePackages = scopeReady ? allPackages.filter(p => p.scopeKey === scopeKey) : []
  const tabPackages = scopePackages.filter(p => p.limitType === tab)
  const count = (t: LimitType) => scopePackages.filter(p => p.limitType === t).length

  const chooseScope = (next: Scope) => {
    setScope(next)
    setSearchValue('')
    setTarget(null)
    setSearchError('')
    setActivity(null)
    setActivityGroup(null)
    setTab('TRANSACTION')
  }

  const changeSelection = () => {
    setSearchValue('')
    setTarget(null)
    setSearchError('')
    setActivity(null)
    setActivityGroup(null)
  }

  // TODO: API - search party / user
  const handleSearch = async () => {
    const value = searchValue.trim().toLowerCase()
    if (!value) {
      setSearchError(`Please enter a ${scope === 'PARTY' ? 'Party ID' : 'User ID'}`)

      return
    }
    setIsSearching(true)
    setSearchError('')
    setTarget(null)
    await new Promise(r => setTimeout(r, 400))
    const found = (scope === 'PARTY' ? MOCK_PARTIES : MOCK_USERS).find(o => o.code.toLowerCase() === value)
    if (found) setTarget(found)
    else setSearchError(`No ${scope === 'PARTY' ? 'party' : 'user'} found with ID "${searchValue.trim()}"`)
    setIsSearching(false)
  }

  const openDialog = (mode: DialogMode, p?: LimitPackage) => {
    form.reset(p ? toForm(p) : { ...emptyForm, limitType: tab })
    setDialogMode(mode)
  }

  // TODO: API - create / update package
  const onSave = form.handleSubmit(async data => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 300))
    const pkg = fromForm(data, scopeKey)

    if (dialogMode === 'edit') {
      setAllPackages(prev => prev.map(p => (p.packageCode === pkg.packageCode ? pkg : p)))
      setResponseInfo({ success: true, message: `Limit package ${pkg.packageCode} updated successfully.` })
    } else {
      if (allPackages.some(p => p.packageCode === pkg.packageCode)) {
        setResponseInfo({ success: false, message: `Limit package code ${pkg.packageCode} already exists.` })
        setSaving(false)

        return
      }
      setAllPackages(prev => [...prev, pkg])
      setResponseInfo({ success: true, message: `Limit package ${pkg.packageCode} created for ${scopeSummary}.` })
    }

    setTab(pkg.limitType)
    setDialogMode(null)
    setSaving(false)
  })

  // TODO: API - delete package
  const onConfirmDelete = async () => {
    if (!deleteTarget) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 300))
    setAllPackages(prev => prev.filter(p => p.packageCode !== deleteTarget.packageCode))
    setResponseInfo({ success: true, message: `Limit package ${deleteTarget.packageCode} deleted successfully.` })
    setDeleteTarget(null)
    setSaving(false)
  }

  // live sentence shown at the bottom of the modal
  const preview =
    formType === 'TRANSACTION'
      ? v.minAmount && v.maxAmount
        ? `Each transaction must be between ${fmt(formCurrency, Number(v.minAmount))} and ${fmt(formCurrency, Number(v.maxAmount))}.`
        : ''
      : v.cumulativeAmount && v.maxTransactions
        ? `Up to ${fmt(formCurrency, Number(v.cumulativeAmount))} across at most ${v.maxTransactions} transaction(s) per ${per(v.frequency)}.`
        : ''

  const amountField = (
    name: 'minAmount' | 'maxAmount' | 'cumulativeAmount',
    label: string,
    helper: string,
    extraRule?: (value: string) => true | string
  ) => (
    <Controller
      name={name}
      control={form.control}
      rules={{
        required: `${label} is required`,
        validate: value => (Number(value) > 0 ? (extraRule ? extraRule(value) : true) : 'Enter an amount greater than 0')
      }}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          fullWidth
          required={!readOnly}
          type='number'
          label={label}
          InputProps={{ readOnly, startAdornment: <InputAdornment position='start'>{formCurrency}</InputAdornment> }}
          inputProps={{ min: 0, step: '0.01' }}
          error={!!fieldState.error}
          helperText={fieldState.error?.message ?? helper}
        />
      )}
    />
  )

  const dialogTitle =
    dialogMode === 'create' ? 'Create limit package' : dialogMode === 'edit' ? 'Edit limit package' : 'Limit package details'

  return (
    <Grid container spacing={3} sx={{ pb: 6 }}>
      {/* ---------- Header ---------- */}
      <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={iconBox(false)}>
          <InventoryIcon />
        </Box>
        <Box>
          <Typography variant='h5' sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Limit Package Management
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Pick where the limits apply, then view, create, edit or delete the packages for it.
          </Typography>
        </Box>
      </Grid>

      {/* ---------- Step 1: scope ---------- */}
      <Grid item xs={12}>
        <Card sx={cardSx}>
          <Typography variant='overline' sx={{ color: 'primary.main', fontWeight: 700 }}>
            Step 1 · What do you want to manage limits for?
          </Typography>

          <Box
            sx={{
              mt: 1,
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }
            }}
          >
            {SCOPES.map(s => {
              const active = scope === s.value

              return (
                <Box
                  key={s.value}
                  role='button'
                  tabIndex={0}
                  onClick={() => chooseScope(s.value)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && chooseScope(s.value)}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    border: `1.5px solid ${active ? theme.palette.primary.main : 'transparent'}`,
                    outline: active ? 'none' : '1px solid',
                    outlineColor: 'divider',
                    bgcolor: active ? tint(0.06) : 'transparent',
                    '&:hover': { bgcolor: tint(0.06) }
                  }}
                >
                  <Box sx={iconBox(active)}>{s.icon}</Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 14, color: active ? 'primary.main' : 'text.primary' }}>
                      {s.label}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {s.hint}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>

          {/* Party / User: search must succeed first */}
          {isSearchScope && (
            <Box sx={{ mt: 3 }}>
              <Typography variant='overline' sx={{ color: 'primary.main', fontWeight: 700 }}>
                Search {scope === 'PARTY' ? 'Party ID' : 'User ID'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5, flexWrap: 'wrap' }}>
                <TextField
                  placeholder={scope === 'PARTY' ? 'Enter Party ID (e.g., CN421017654123)' : 'Enter User ID (e.g., JDOE)'}
                  value={searchValue}
                  onChange={e => {
                    setSearchValue(e.target.value)
                    setTarget(null)
                    setSearchError('')
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
                  sx={{ flex: 1, minWidth: 260, maxWidth: 520 }}
                />
                <Button
                  variant='contained'
                  startIcon={isSearching ? <CircularProgress size={16} color='inherit' /> : <SearchIcon />}
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </Box>
              {searchError && (
                <Typography variant='body2' sx={{ mt: 1.5, color: 'error.main' }}>
                  {searchError}
                </Typography>
              )}
            </Box>
          )}

          {scope === 'ACTIVITY' && (
            <Autocomplete
              sx={{ mt: 3, maxWidth: 520 }}
              options={MOCK_ACTIVITIES}
              value={activity}
              onChange={(_, val) => setActivity(val)}
              getOptionLabel={optionLabel}
              isOptionEqualToValue={(o, val) => o.code === val.code}
              renderInput={params => <TextField {...params} label='Select activity (transaction)' />}
            />
          )}

          {scope === 'ACTIVITY_GROUP' && (
            <Autocomplete
              sx={{ mt: 3, maxWidth: 520 }}
              options={MOCK_ACTIVITY_GROUPS}
              value={activityGroup}
              onChange={(_, val) => setActivityGroup(val)}
              getOptionLabel={optionLabel}
              isOptionEqualToValue={(o, val) => o.code === val.code}
              renderInput={params => <TextField {...params} label='Select activity group' />}
            />
          )}
        </Card>
      </Grid>

      {!scopeReady && (
        <Grid item xs={12}>
          <Alert
            severity='info'
            sx={{
              color: '#f0a528',
              bgcolor: alpha('#f0a528', 0.1),
              '& .MuiAlert-icon': { color: '#f0a528' }
            }}
          >
            {scope === null
              ? 'Choose one of the options above to continue.'
              : isSearchScope
                ? `Search and find a ${scope === 'PARTY' ? 'party' : 'user'} to continue.`
                : `Select ${scope === 'ACTIVITY' ? 'an activity' : 'an activity group'} to continue.`}
          </Alert>
        </Grid>
      )}

      {/* ---------- Step 2: packages ---------- */}
      {scopeReady && (
        <Grid item xs={12}>
          <Card sx={{ ...cardSx, p: 0 }}>
            <Box
              sx={{
                px: 3,
                py: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap'
              }}
            >
              <Box>
                <Typography variant='overline' sx={{ color: 'primary.main', fontWeight: 700 }}>
                  Step 2 · Limit packages
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                  <CheckCircleIcon fontSize='small' />
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    {scopeSummary}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {scope !== 'GLOBAL' && (
                  <Button variant='outlined' color='secondary' startIcon={<ArrowBackIcon />} onClick={changeSelection}>
                    Change {scopeLabel.toLowerCase()}
                  </Button>
                )}
                <Button variant='contained' startIcon={<AddCircleOutlineIcon />} onClick={() => openDialog('create')}>
                  Create package
                </Button>
              </Box>
            </Box>

            <Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}>
              {(['TRANSACTION', 'CUMULATIVE'] as LimitType[]).map(t => (
                <Tab
                  key={t}
                  value={t}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {typeLabel[t]}
                      <Chip
                        size='small'
                        label={count(t)}
                        sx={{
                          height: 20,
                          bgcolor: count(t) ? 'primary.main' : 'action.disabledBackground',
                          color: count(t) ? 'primary.contrastText' : 'text.secondary'
                        }}
                      />
                    </Box>
                  }
                />
              ))}
            </Tabs>

            {tabPackages.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
                <Box sx={{ ...iconBox(false), width: 56, height: 56, borderRadius: '50%', mx: 'auto', mb: 2 }}>
                  <InventoryIcon sx={{ fontSize: 30 }} />
                </Box>
                <Typography variant='h6' sx={{ mb: 0.5 }}>
                  No {typeLabel[tab].toLowerCase()} packages yet
                </Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                  Create the first {typeLabel[tab].toLowerCase()} limit package for this selection.
                </Typography>
                <Button variant='contained' startIcon={<AddCircleOutlineIcon />} onClick={() => openDialog('create')}>
                  Create {typeLabel[tab].toLowerCase()} package
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Package</TableCell>
                      <TableCell>Currency</TableCell>
                      {tab === 'CUMULATIVE' && <TableCell>Frequency</TableCell>}
                      <TableCell>Limit</TableCell>
                      <TableCell align='right'>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tabPackages.map(p => (
                      <TableRow key={p.packageCode} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Chip
                              size='small'
                              label={p.packageCode}
                              sx={{ fontWeight: 700, bgcolor: tint(0.12), color: 'primary.main' }}
                            />
                            <Typography variant='body2'>{p.packageDescription}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{p.currency}</TableCell>
                        {tab === 'CUMULATIVE' && (
                          <TableCell>{p.frequency === 'MONTHLY' ? 'Monthly' : 'Daily'}</TableCell>
                        )}
                        <TableCell>{describeLimit(p)}</TableCell>
                        <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>
                          <Tooltip title='View'>
                            <IconButton size='small' onClick={() => openDialog('view', p)}>
                              <VisibilityOutlinedIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Edit'>
                            <IconButton size='small' color='primary' onClick={() => openDialog('edit', p)}>
                              <EditOutlinedIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Delete'>
                            <IconButton size='small' color='error' onClick={() => setDeleteTarget(p)}>
                              <DeleteOutlineIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Grid>
      )}

      {/* ---------- Create / Edit / View modal ---------- */}
      <Dialog
        open={dialogMode !== null}
        onClose={saving ? undefined : () => setDialogMode(null)}
        fullWidth
        maxWidth='sm'
        fullScreen={fullScreen}
      >
        {dialogMode && (
          <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
            <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'flex-start', gap: 1.5, bgcolor: tint(0.06) }}>
              <Box sx={iconBox(true)}>
                <InventoryIcon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                  {dialogTitle}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Applies to: {scopeSummary}
                </Typography>
              </Box>
              <IconButton size='small' onClick={() => setDialogMode(null)} disabled={saving} aria-label='Close'>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Transactional / Cumulative */}
            <Controller
              name='limitType'
              control={form.control}
              render={({ field }) => (
                <Tabs
                  value={field.value}
                  onChange={(_, val) => field.onChange(val)}
                  variant='fullWidth'
                  sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                  <Tab value='TRANSACTION' label='Transactional' disabled={dialogMode !== 'create'} />
                  <Tab value='CUMULATIVE' label='Cumulative' disabled={dialogMode !== 'create'} />
                </Tabs>
              )}
            />

            <DialogContent sx={{ px: 3, py: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='packageCode'
                    control={form.control}
                    rules={{
                      required: 'Package code is required',
                      pattern: { value: /^[A-Z0-9_]+$/, message: 'Capital letters, numbers or underscore only' }
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        required={!readOnly}
                        label='Limit Package Code'
                        disabled={dialogMode === 'edit'}
                        InputProps={{ readOnly }}
                        inputProps={{ maxLength: 10 }}
                        onChange={e => field.onChange(e.target.value.toUpperCase())}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message ?? (dialogMode === 'edit' ? 'Cannot be changed' : ' ')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Controller
                    name='packageDescription'
                    control={form.control}
                    rules={{ required: 'Package description is required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        required={!readOnly}
                        label='Limit Package Description'
                        InputProps={{ readOnly }}
                        inputProps={{ maxLength: 100 }}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message ?? ' '}
                      />
                    )}
                  />
                </Grid>

                {formType === 'CUMULATIVE' && (
                  <Grid item xs={12}>
                    <Typography variant='caption' color='text.secondary'>
                      Frequency
                    </Typography>
                    <Controller
                      name='frequency'
                      control={form.control}
                      render={({ field }) => (
                        <RadioGroup row {...field}>
                          <FormControlLabel value='DAILY' control={<Radio disabled={readOnly} />} label='Daily' />
                          <FormControlLabel value='MONTHLY' control={<Radio disabled={readOnly} />} label='Monthly' />
                        </RadioGroup>
                      )}
                    />
                  </Grid>
                )}

                <Grid item xs={12} sm={4}>
                  <Controller
                    name='currency'
                    control={form.control}
                    render={({ field }) => (
                      <TextField {...field} select fullWidth label='Currency' InputProps={{ readOnly }}>
                        {CURRENCIES.map(c => (
                          <MenuItem key={c} value={c}>
                            {c}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                {formType === 'TRANSACTION' ? (
                  <>
                    <Grid item xs={12} sm={4}>
                      {amountField('minAmount', 'Minimum Amount', 'Smallest allowed')}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      {amountField('maxAmount', 'Maximum Amount', 'Largest allowed', value =>
                        Number(value) >= Number(form.getValues('minAmount')) ? true : 'Must be at least the minimum'
                      )}
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} sm={8}>
                      {amountField('cumulativeAmount', 'Cumulative Transaction Amount', `Total allowed per ${per(v.frequency)}`)}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='maxTransactions'
                        control={form.control}
                        rules={{
                          required: 'Required',
                          pattern: { value: /^[1-9]\d*$/, message: 'Whole number, 1 or more' }
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            fullWidth
                            required={!readOnly}
                            type='number'
                            label='Maximum Transactions'
                            InputProps={{ readOnly }}
                            inputProps={{ min: 1, step: 1 }}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message ?? `Per ${per(v.frequency)}`}
                          />
                        )}
                      />
                    </Grid>
                  </>
                )}

                {preview && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 1.5, borderRadius: 1.5, display: 'flex', gap: 1, bgcolor: tint(0.06), color: 'primary.main' }}>
                      <InfoOutlinedIcon fontSize='small' />
                      <Typography variant='body2'>{preview}</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>

            <Divider />
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button variant='outlined' color='secondary' onClick={() => setDialogMode(null)} disabled={saving}>
                {readOnly ? 'Close' : 'Cancel'}
              </Button>
              {readOnly ? (
                <Button variant='contained' startIcon={<EditOutlinedIcon />} onClick={() => setDialogMode('edit')}>
                  Edit package
                </Button>
              ) : (
                <Button type='submit' variant='contained' disabled={saving}>
                  {saving ? 'Saving...' : dialogMode === 'edit' ? 'Save changes' : 'Save'}
                </Button>
              )}
            </DialogActions>
          </form>
        )}
      </Dialog>

      {/* ---------- Delete confirmation ---------- */}
      <Dialog open={!!deleteTarget} onClose={saving ? undefined : () => setDeleteTarget(null)} maxWidth='xs' fullWidth>
        <DialogContent sx={{ textAlign: 'center', pt: 4 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              mx: 'auto',
              mb: 2,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(theme.palette.error.main, 0.12),
              color: 'error.main'
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography variant='h6' sx={{ mb: 1 }}>
            Delete package {deleteTarget?.packageCode}?
          </Typography>
          <DialogContentText>
            The limits in this package will no longer apply to {scopeSummary}. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center', gap: 1.5 }}>
          <Button variant='outlined' color='secondary' onClick={() => setDeleteTarget(null)} disabled={saving}>
            Keep package
          </Button>
          <Button variant='contained' color='error' onClick={onConfirmDelete} disabled={saving}>
            {saving ? 'Deleting...' : 'Delete package'}
          </Button>
        </DialogActions>
      </Dialog>

      <ApiResponseDialog open={responseInfo !== null} response={responseInfo} onClose={() => setResponseInfo(null)} />
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'party-maintenance-party-limit-package-management-page'
}

export default Page