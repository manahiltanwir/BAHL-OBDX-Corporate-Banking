import { useEffect, useMemo, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TablePagination,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import SearchIcon from '@mui/icons-material/Search'
import InventoryIcon from '@mui/icons-material/Inventory2Outlined'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import CloseIcon from '@mui/icons-material/Close'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import ResultsTable, { ResultsTableColumn } from 'src/@core/components/Resultstable'
import { useLimitPackages, usePackageActivities, usePackageGroups } from 'src/@core/hooks/apps/useLimitPackages'
import { CoverageType, ILimitPackage, ILimitPackagePayload, IPackageActivity, IPackageGroup } from 'src/types/apps/limitPackage'

// ======================= CONSTANTS =======================
const ENTERPRISE_ROLE_ID = 100003
const CURRENCIES = ['PKR', 'USD', 'EUR', 'GBP', 'AED']

const packageColumns: ResultsTableColumn[] = [
  { key: 'package', label: 'Package' },
  { key: 'appliesTo', label: 'Applies To' },
  { key: 'perTxn', label: 'Per Transaction' },
  { key: 'daily', label: 'Daily' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'actions', label: 'Actions' }
]
const packageGridColumns = '1.8fr 2fr 1.2fr 1.3fr 1.3fr 0.6fr'

// ======================= TYPES =======================
type DialogMode = 'create' | 'view' | null

interface AppliesTo {
  kind: 'Activity' | 'Activity Group'
  name: string
  code: string
}

// form mein amounts strings hain, save par numbers mein badal jate hain
interface PackageFormValues {
  coverageType: CoverageType
  activity: IPackageActivity | null
  group: IPackageGroup | null
  packageCode: string
  packageName: string
  currency: string
  perTransactionAmount: string
  dailyCumulativeAmount: string
  monthlyCumulativeAmount: string
  dailyTransactionCount: string
  monthlyTransactionCount: string
}

const emptyForm: PackageFormValues = {
  coverageType: 'ACTIVITY',
  activity: null,
  group: null,
  packageCode: '',
  packageName: '',
  currency: 'PKR',
  perTransactionAmount: '',
  dailyCumulativeAmount: '',
  monthlyCumulativeAmount: '',
  dailyTransactionCount: '',
  monthlyTransactionCount: ''
}

// ======================= HELPERS =======================
const toastError = (error: unknown) =>
  toast.error(typeof error === 'string' ? error : (error as any)?.message ?? 'Something Went Wrong')

const fmt = (currency: string, n: number) =>
  `${currency} ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const activityLabel = (a: IPackageActivity) => `${a.operationName} (${a.operationCode})`
const groupLabel = (g: IPackageGroup) => `${g.groupName} (${g.groupCode})`
const appliesToLabel = (a: AppliesTo) => `${a.kind}: ${a.name}${a.code && a.code !== a.name ? ` (${a.code})` : ''}`

const toForm = (p: ILimitPackage): PackageFormValues => ({
  ...emptyForm,
  coverageType: p.coverageType,
  packageCode: p.packageCode,
  packageName: p.packageName,
  currency: p.currency,
  perTransactionAmount: String(p.limits.perTransactionAmount),
  dailyCumulativeAmount: String(p.limits.dailyCumulativeAmount),
  monthlyCumulativeAmount: String(p.limits.monthlyCumulativeAmount),
  dailyTransactionCount: String(p.limits.dailyTransactionCount),
  monthlyTransactionCount: String(p.limits.monthlyTransactionCount)
})

// ======================= PAGE =======================
const Page = () => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
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

  // ---- data: sab limit-package ke apne hooks se ----
  const { packages, status: packagesStatus, fetchPackages, createPackage } = useLimitPackages()
  const { groups, status: groupsStatus, fetchGroups } = usePackageGroups()
  const { activities, status: activitiesStatus, fetchActivities } = usePackageActivities()

  const form = useForm<PackageFormValues>({ defaultValues: emptyForm })
  const v = form.watch()

  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [viewing, setViewing] = useState<ILimitPackage | null>(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const readOnly = dialogMode === 'view'
  const activeGroups = useMemo(() => groups.filter(g => g.active), [groups])

  useEffect(() => {
    if (activities.length === 0) fetchActivities(ENTERPRISE_ROLE_ID).catch(toastError)
    fetchGroups().catch(toastError)
    fetchPackages().catch(toastError)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // code se naam nikalne ke liye
  const activityNames = useMemo(() => {
    const map: Record<string, string> = {}
    activities.forEach(a => (map[a.operationCode] = a.operationName))

    return map
  }, [activities])

  const groupById = useMemo(() => {
    const map: Record<number, IPackageGroup> = {}
    groups.forEach(g => (map[g.groupId] = g))

    return map
  }, [groups])

  // ye package kis activity / group ke against hai
  const appliesTo = (p: ILimitPackage): AppliesTo => {
    if (p.coverageType === 'ACTIVITY_GROUP') {
      const g = groupById[Number(p.groupId)]

      return { kind: 'Activity Group', name: g?.groupName ?? `Group #${p.groupId}`, code: g?.groupCode ?? '' }
    }
    const code = p.operationCode ?? ''

    return { kind: 'Activity', name: activityNames[code] ?? (code || '-'), code }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return packages

    return packages.filter(p => {
      const a = appliesTo(p)

      return `${p.packageCode} ${p.packageName} ${a.kind} ${a.name} ${a.code}`.toLowerCase().includes(q)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packages, search, activityNames, groupById])

  const lastPage = Math.max(0, Math.ceil(filtered.length / rowsPerPage) - 1)
  const safePage = Math.min(page, lastPage)
  const pagedRows = filtered.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage)

  const openDialog = (mode: DialogMode, p?: ILimitPackage) => {
    form.reset(p ? toForm(p) : emptyForm)
    setViewing(p ?? null)
    setDialogMode(mode)
  }

  const buildPayload = (data: PackageFormValues): ILimitPackagePayload => ({
    packageCode: data.packageCode.trim(),
    packageName: data.packageName.trim(),
    coverageType: data.coverageType,
    operationCode: data.coverageType === 'ACTIVITY' ? data.activity?.operationCode ?? null : null,
    groupId: data.coverageType === 'ACTIVITY_GROUP' ? data.group?.groupId ?? null : null,
    channel: 'WEB', // hardcoded
    currency: data.currency,
    limits: {
      perTransactionAmount: Number(data.perTransactionAmount),
      dailyCumulativeAmount: Number(data.dailyCumulativeAmount),
      monthlyCumulativeAmount: Number(data.monthlyCumulativeAmount),
      dailyTransactionCount: Number(data.dailyTransactionCount),
      monthlyTransactionCount: Number(data.monthlyTransactionCount)
    }
  })

  const onSave = form.handleSubmit(async data => {
    setSaving(true)
    try {
      const result = await createPackage(buildPayload(data))

      toast.success(result.message)
      try {
        await fetchPackages()
      } catch (error) {
        toastError(error)
      }
      setDialogMode(null)
    } catch (error) {
      toastError(error)
    } finally {
      setSaving(false)
    }
  })

  // live sentence modal ke neeche
  const preview =
    v.perTransactionAmount &&
    v.dailyCumulativeAmount &&
    v.monthlyCumulativeAmount &&
    v.dailyTransactionCount &&
    v.monthlyTransactionCount
      ? `Each transaction up to ${fmt(v.currency, Number(v.perTransactionAmount))}. Per day: up to ${fmt(
          v.currency,
          Number(v.dailyCumulativeAmount)
        )} in at most ${v.dailyTransactionCount} transaction(s). Per month: up to ${fmt(
          v.currency,
          Number(v.monthlyCumulativeAmount)
        )} in at most ${v.monthlyTransactionCount} transaction(s).`
      : ''

  const amountField = (
    name: 'perTransactionAmount' | 'dailyCumulativeAmount' | 'monthlyCumulativeAmount',
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
          InputProps={{ readOnly, startAdornment: <InputAdornment position='start'>{v.currency}</InputAdornment> }}
          inputProps={{ min: 0, step: '0.01' }}
          error={!!fieldState.error}
          helperText={fieldState.error?.message ?? helper}
        />
      )}
    />
  )

  const countField = (
    name: 'dailyTransactionCount' | 'monthlyTransactionCount',
    label: string,
    helper: string,
    extraRule?: (value: string) => true | string
  ) => (
    <Controller
      name={name}
      control={form.control}
      rules={{
        required: `${label} is required`,
        pattern: { value: /^[1-9]\d*$/, message: 'Whole number, 1 or more' },
        validate: value => (extraRule ? extraRule(value) : true)
      }}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          fullWidth
          required={!readOnly}
          type='number'
          label={label}
          InputProps={{ readOnly }}
          inputProps={{ min: 1, step: 1 }}
          error={!!fieldState.error}
          helperText={fieldState.error?.message ?? helper}
        />
      )}
    />
  )

  return (
    <Grid container spacing={4} sx={{ pb: 6 }}>
      {/* ---------- Header ---------- */}
      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={iconBox(false)}>
              <InventoryIcon />
            </Box>
            <Box>
              <Typography variant='h5' sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                Limit Package Management
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                All limit packages, with the activity or activity group each one applies to.
              </Typography>
            </Box>
          </Box>
          <Button variant='contained' startIcon={<AddCircleOutlineIcon />} onClick={() => openDialog('create')}>
            Create package
          </Button>
        </Box>
      </Grid>

      {/* ---------- List ---------- */}
      <Grid item xs={12}>
        {packagesStatus === 'pending' && packages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <CircularProgress size={28} />
          </Box>
        ) : packages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, px: 3 }}>
            <Box sx={{ ...iconBox(false), width: 56, height: 56, borderRadius: '50%', mx: 'auto', mb: 2 }}>
              <InventoryIcon sx={{ fontSize: 30 }} />
            </Box>
            <Typography variant='h6' sx={{ mb: 0.5 }}>
              No limit packages yet
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              Create your first limit package.
            </Typography>
            <Button variant='contained' startIcon={<AddCircleOutlineIcon />} onClick={() => openDialog('create')}>
              Create package
            </Button>
          </Box>
        ) : (
          <>
            <TextField
              size='small'
              placeholder='Search by package, activity or group'
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setPage(0)
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon fontSize='small' />
                  </InputAdornment>
                )
              }}
              sx={{ width: { xs: '100%', sm: 380 } }}
            />

            <ResultsTable
              columns={packageColumns}
              gridTemplateColumns={packageGridColumns}
              rows={pagedRows}
              getRowKey={p => p.packageCode}
              onRowClick={p => openDialog('view', p)}
              emptyMessage='No packages match your search.'
              headerColor={theme.palette.primary.main}
              renderRow={p => {
                const a = appliesTo(p)

                return (
                  <>
                    {/* Package */}
                    <Box sx={{ minWidth: 0 }}>
                      <Chip
                        size='small'
                        label={p.packageCode}
                        sx={{
                          maxWidth: '100%',
                          height: 'auto',
                          fontWeight: 700,
                          bgcolor: tint(0.12),
                          color: 'primary.main',
                          '& .MuiChip-label': { whiteSpace: 'normal', wordBreak: 'break-all', py: 0.5 }
                        }}
                      />
                      <Typography variant='body2' sx={{ mt: 0.5, wordBreak: 'break-word' }}>
                        {p.packageName}
                      </Typography>
                    </Box>

                    {/* Applies To: activity ya activity group */}
                    <Box sx={{ minWidth: 0 }}>
                      <Chip
                        size='small'
                        variant='outlined'
                        color={a.kind === 'Activity' ? 'primary' : 'secondary'}
                        label={a.kind}
                      />
                      <Typography variant='body2' sx={{ mt: 0.5, fontWeight: 600, wordBreak: 'break-word' }}>
                        {a.name}
                      </Typography>
                      {a.code && a.code !== a.name && (
                        <Typography variant='caption' sx={{ color: 'text.secondary', wordBreak: 'break-all' }}>
                          {a.code}
                        </Typography>
                      )}
                    </Box>

                    {/* Per transaction */}
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      {fmt(p.currency, p.limits.perTransactionAmount)}
                    </Typography>

                    {/* Daily */}
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        {fmt(p.currency, p.limits.dailyCumulativeAmount)}
                      </Typography>
                      <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                        max {p.limits.dailyTransactionCount} txn(s)
                      </Typography>
                    </Box>

                    {/* Monthly */}
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        {fmt(p.currency, p.limits.monthlyCumulativeAmount)}
                      </Typography>
                      <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                        max {p.limits.monthlyTransactionCount} txn(s)
                      </Typography>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ whiteSpace: 'nowrap' }} onClick={e => e.stopPropagation()}>
                      <Tooltip title='View'>
                        <IconButton size='small' onClick={() => openDialog('view', p)}>
                          <VisibilityOutlinedIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </>
                )
              }}
            />

            {filtered.length > 0 && (
              <TablePagination
                component='div'
                count={filtered.length}
                page={safePage}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={e => {
                  setRowsPerPage(parseInt(e.target.value, 10))
                  setPage(0)
                }}
                rowsPerPageOptions={[10, 25, 50]}
              />
            )}
          </>
        )}
      </Grid>

      {/* ---------- Create / View modal ---------- */}
      <Dialog
        open={dialogMode !== null}
        onClose={saving ? undefined : () => setDialogMode(null)}
        fullWidth
        maxWidth='md'
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
                  {readOnly ? 'Limit package details' : 'Create limit package'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {readOnly
                    ? 'Read-only view of this package.'
                    : 'Choose what the limit is for, then set the amounts.'}
                </Typography>
              </Box>
              <IconButton
                type='button'
                size='small'
                onClick={() => setDialogMode(null)}
                disabled={saving}
                aria-label='Close'
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <DialogContent sx={{ px: 3, py: 3 }}>
              {/* ---- Applies to ---- */}
              <Typography variant='subtitle2' sx={{ mb: 2, fontWeight: 700 }}>
                What is this limit for?
              </Typography>

              {readOnly ? (
                <TextField
                  fullWidth
                  label='Applies to'
                  value={viewing ? appliesToLabel(appliesTo(viewing)) : ''}
                  InputProps={{ readOnly: true }}
                />
              ) : (
                <>
                  <Controller
                    name='coverageType'
                    control={form.control}
                    render={({ field }) => (
                      <ToggleButtonGroup
                        exclusive
                        fullWidth
                        color='primary'
                        size='small'
                        value={field.value}
                        onChange={(_, val: CoverageType | null) => {
                          if (!val) return
                          field.onChange(val)
                          form.setValue('activity', null)
                          form.setValue('group', null)
                          form.clearErrors(['activity', 'group'])
                        }}
                      >
                        <ToggleButton value='ACTIVITY'>One Activity</ToggleButton>
                        <ToggleButton value='ACTIVITY_GROUP'>An Activity Group</ToggleButton>
                      </ToggleButtonGroup>
                    )}
                  />

                  <Box sx={{ mt: 3 }}>
                    {v.coverageType === 'ACTIVITY' ? (
                      <Controller
                        name='activity'
                        control={form.control}
                        rules={{
                          validate: val =>
                            form.getValues('coverageType') !== 'ACTIVITY' || !!val || 'Select an activity'
                        }}
                        render={({ field, fieldState }) => (
                          <Autocomplete
                            options={activities}
                            value={field.value}
                            loading={activitiesStatus === 'pending'}
                            onChange={(_, val) => field.onChange(val)}
                            getOptionLabel={activityLabel}
                            isOptionEqualToValue={(o, val) => o.operationCode === val.operationCode}
                            renderInput={params => (
                              <TextField
                                {...params}
                                required
                                label='Select activity (transaction)'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message ?? 'The limit will apply to this one transaction'}
                              />
                            )}
                          />
                        )}
                      />
                    ) : (
                      <Controller
                        name='group'
                        control={form.control}
                        rules={{
                          validate: val =>
                            form.getValues('coverageType') !== 'ACTIVITY_GROUP' || !!val || 'Select an activity group'
                        }}
                        render={({ field, fieldState }) => (
                          <Autocomplete
                            options={activeGroups}
                            value={field.value}
                            loading={groupsStatus === 'pending'}
                            onChange={(_, val) => field.onChange(val)}
                            getOptionLabel={groupLabel}
                            isOptionEqualToValue={(o, val) => o.groupId === val.groupId}
                            renderInput={params => (
                              <TextField
                                {...params}
                                required
                                label='Select activity group'
                                error={!!fieldState.error}
                                helperText={
                                  fieldState.error?.message ?? 'The limit will be shared by all transactions in this group'
                                }
                              />
                            )}
                          />
                        )}
                      />
                    )}
                  </Box>
                </>
              )}

              <Divider sx={{ my: 4 }} />

              {/* ---- Package details ---- */}
              <Typography variant='subtitle2' sx={{ mb: 2, fontWeight: 700 }}>
                Package details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='packageCode'
                    control={form.control}
                    rules={{
                      required: 'Package code is required',
                      pattern: {
                        value: /^[A-Za-z0-9_-]+$/,
                        message: 'Use letters, numbers, hyphen (-) or underscore (_) only'
                      }
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        required={!readOnly}
                        label='Package Code'
                        InputProps={{ readOnly }}
                        inputProps={{ maxLength: 50 }}
                        onChange={e => field.onChange(e.target.value.toUpperCase())}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message ?? (readOnly ? ' ' : 'Up to 50 characters')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='packageName'
                    control={form.control}
                    rules={{ required: 'Package name is required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        required={!readOnly}
                        label='Package Name'
                        InputProps={{ readOnly }}
                        inputProps={{ maxLength: 100 }}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message ?? (readOnly ? ' ' : 'A short name people will recognise')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='currency'
                    control={form.control}
                    rules={{ required: 'Currency is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label='Currency'
                        InputProps={{ readOnly }}
                        helperText={readOnly ? ' ' : 'All amounts use this currency'}
                      >
                        {CURRENCIES.map(c => (
                          <MenuItem key={c} value={c}>
                            {c}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              {/* ---- Transactional limit ---- */}
              <Typography variant='subtitle2' sx={{ mb: 0.5, fontWeight: 700 }}>
                Transactional limit
              </Typography>
              <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 2 }}>
                The most a single transaction can be.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  {amountField('perTransactionAmount', 'Per Transaction Amount', 'Largest single transaction')}
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              {/* ---- Cumulative limits ---- */}
              <Typography variant='subtitle2' sx={{ mb: 0.5, fontWeight: 700 }}>
                Cumulative limits
              </Typography>
              <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 2 }}>
                Total amount and number of transactions allowed per day and per month.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  {amountField('dailyCumulativeAmount', 'Daily Cumulative Amount', 'Total allowed per day', value =>
                    Number(value) >= Number(form.getValues('perTransactionAmount'))
                      ? true
                      : 'Must be at least the per transaction amount'
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {countField('dailyTransactionCount', 'Daily Transaction Count', 'Max transactions per day')}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {amountField('monthlyCumulativeAmount', 'Monthly Cumulative Amount', 'Total allowed per month', value =>
                    Number(value) >= Number(form.getValues('dailyCumulativeAmount'))
                      ? true
                      : 'Must be at least the daily amount'
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {countField('monthlyTransactionCount', 'Monthly Transaction Count', 'Max transactions per month', value =>
                    Number(value) >= Number(form.getValues('dailyTransactionCount'))
                      ? true
                      : 'Must be at least the daily count'
                  )}
                </Grid>

                {preview && (
                  <Grid item xs={12}>
                    <Box
                      sx={{ p: 1.5, borderRadius: 1.5, display: 'flex', gap: 1, bgcolor: tint(0.06), color: 'primary.main' }}
                    >
                      <InfoOutlinedIcon fontSize='small' />
                      <Typography variant='body2'>{preview}</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>

            <Divider />
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button
                type='button'
                variant='outlined'
                color='secondary'
                onClick={() => setDialogMode(null)}
                disabled={saving}
              >
                {readOnly ? 'Close' : 'Cancel'}
              </Button>
              {!readOnly && (
                <Button type='submit' variant='contained' disabled={saving}>
                  {saving ? 'Saving...' : 'Create package'}
                </Button>
              )}
            </DialogActions>
          </form>
        )}
      </Dialog>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'party-maintenance-party-limit-package-management-page'
}

export default Page