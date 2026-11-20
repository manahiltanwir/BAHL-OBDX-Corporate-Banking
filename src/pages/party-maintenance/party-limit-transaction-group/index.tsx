import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Controller, useForm } from 'react-hook-form'
import Magnify from 'mdi-material-ui/Magnify'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import PlusCircleOutline from 'mdi-material-ui/PlusCircleOutline'
import FormatListGroup from 'mdi-material-ui/FormatListGroup'
import Close from 'mdi-material-ui/Close'
import InformationOutline from 'mdi-material-ui/InformationOutline'
import toast from 'react-hot-toast'
import ResultsTable, { ResultsTableColumn } from 'src/@core/components/Resultstable'
import ConfirmActionDialog from 'src/@core/components/AlertMaintenance/ConfirmActionDialog'
import {
  useGroupDeactivate,
  useGroupSubmit,
  useGroupTransactions,
  useTransactionGroupsList
} from 'src/@core/hooks/apps/useTransactionGroups'
import { IActivityGroup, IActivityGroupPayload, ITransactionItem } from 'src/types/apps/transactionGroup'

interface SearchFormValues {
  groupCode: string
  groupName: string
}

interface GroupFormValues {
  groupId: number | null
  groupCode: string
  groupName: string
  description: string
  transactions: ITransactionItem[]
}

type DialogMode = 'create' | 'edit' | 'view' | null

const ENTERPRISE_ROLE_ID = 100003

const emptySearch: SearchFormValues = { groupCode: '', groupName: '' }
const emptyGroup: GroupFormValues = { groupId: null, groupCode: '', groupName: '', description: '', transactions: [] }

const dialogMeta = {
  create: { title: 'Create transaction group', subtitle: 'Name the group, then pick the transactions it should contain.' },
  edit: { title: 'Edit transaction group', subtitle: 'Update the details or change which transactions belong to this group.' },
  view: { title: 'Transaction group details', subtitle: 'Read-only view of this group.' }
}

const groupColumns: ResultsTableColumn[] = [
  { key: 'groupCode', label: 'Group Code' },
  { key: 'groupName', label: 'Group Name' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
]
const groupGridColumns = '1.4fr 1.3fr 3fr 0.8fr 1fr'

const filterGroups = (source: IActivityGroup[], f: SearchFormValues) => {
  const code = f.groupCode.trim().toLowerCase()
  const text = f.groupName.trim().toLowerCase()

  return source.filter(
    g =>
      g.groupCode.toLowerCase().includes(code) &&
      `${g.groupName} ${g.description ?? ''}`.toLowerCase().includes(text)
  )
}

const toastError = (error: unknown) =>
  toast.error(typeof error === 'string' ? error : (error as any)?.message ?? 'Something Went Wrong')

// ======================= PAGE START=======================
const PartyLimitTransactionGroup = () => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const tint = (a: number) => alpha(theme.palette.primary.main, a)

  const { groups, fetchGroups } = useTransactionGroupsList()
  const {
    transactionOptions: availableTransactions,
    status: transactionsStatus,
    nameOf,
    fetchTransactions
  } = useGroupTransactions()
  const { createGroup, updateGroup } = useGroupSubmit()
  const { deactivateGroup } = useGroupDeactivate()

  const searchForm = useForm<SearchFormValues>({ defaultValues: emptySearch })
  const groupForm = useForm<GroupFormValues>({ defaultValues: emptyGroup })

  const [appliedFilters, setAppliedFilters] = useState<SearchFormValues | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [pendingSave, setPendingSave] = useState<GroupFormValues | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<IActivityGroup | null>(null)
  const [txnSearch, setTxnSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const readOnly = dialogMode === 'view'
  const hasSearched = appliedFilters !== null

  const results = useMemo(
    () => (appliedFilters ? filterGroups(groups, appliedFilters) : []),
    [groups, appliedFilters]
  )

  const lastPage = Math.max(0, Math.ceil(results.length / rowsPerPage) - 1)
  const safePage = Math.min(page, lastPage)
  const pagedRows = results.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage)

  const toItems = (codes: string[]): ITransactionItem[] =>
    (codes ?? []).map(code => ({ transactionCode: code, transactionName: nameOf(code) }))

  useEffect(() => {
    if (availableTransactions.length === 0) {
      fetchTransactions(ENTERPRISE_ROLE_ID).catch(toastError)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshGroups = async () => {
    try {
      await fetchGroups()
    } catch (error) {
      toastError(error)
    }
  }

  const onSearch = searchForm.handleSubmit(async data => {
    setLoading(true)
    try {
      await fetchGroups()
      setAppliedFilters(data)
      setPage(0)
    } catch (error) {
      toastError(error)
    } finally {
      setLoading(false)
    }
  })

  const onClear = () => searchForm.reset(emptySearch)

  const onCancel = () => {
    searchForm.reset(emptySearch)
    setAppliedFilters(null)
  }

  const openDialog = (mode: DialogMode, g?: IActivityGroup) => {
    groupForm.reset(
      g
        ? {
          groupId: g.groupId,
          groupCode: g.groupCode,
          groupName: g.groupName,
          description: g.description ?? '',
          transactions: toItems(g.operationCodes)
        }
        : emptyGroup
    )
    setTxnSearch('')
    setDialogMode(mode)
  }

  const onSave = groupForm.handleSubmit(data => setPendingSave(data))

  const confirmSave = async () => {
    if (!pendingSave) return

    const data = pendingSave
    const payload: IActivityGroupPayload = {
      groupCode: data.groupCode,
      groupName: data.groupName.trim(),
      description: data.description.trim(),
      operationCodes: data.transactions.map(t => t.transactionCode)
    }

    setSaving(true)
    try {
      const result =
        dialogMode === 'edit' && data.groupId !== null
          ? await updateGroup(data.groupId, payload)
          : await createGroup(payload)

      toast.success(result.message)
      await refreshGroups()

      if (!hasSearched) {
        searchForm.setValue('groupCode', data.groupCode)
        setAppliedFilters({ groupCode: data.groupCode, groupName: '' })
        setPage(0)
      }

      setDialogMode(null)
    } catch (error) {
      toastError(error)
    } finally {
      setPendingSave(null)
      setSaving(false)
    }
  }

  const onConfirmDelete = async () => {
    if (!deleteTarget) return

    setSaving(true)
    try {
      const result = await deactivateGroup(deleteTarget.groupId, deleteTarget.groupCode)

      toast.success(result.message)
      await refreshGroups()
    } catch (error) {
      toastError(error)
    } finally {
      setDeleteTarget(null)
      setSaving(false)
    }
  }

  const selectedCount = groupForm.watch('transactions').length

  const saveCopy = pendingSave
    ? {
      title: dialogMode === 'edit' ? 'Update transaction group?' : 'Create transaction group?',
      message: (
        <>
          You are about to {dialogMode === 'edit' ? 'update' : 'create'} the group <b>{pendingSave.groupCode}</b> with{' '}
          <b>{pendingSave.transactions.length}</b> transaction{pendingSave.transactions.length === 1 ? '' : 's'}. Are
          you sure?
        </>
      ),
      label: dialogMode === 'edit' ? 'Yes, update' : 'Yes, create'
    }
    : { title: '', message: '', label: '' }

  return (
    <Grid container spacing={6}>
      {/* ---------- Header ---------- */}
      <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: tint(0.12),
            color: 'primary.main'
          }}
        >
          <FormatListGroup />
        </Box>
        <Box>
          <Typography variant='h5' sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            Transaction Group Maintenance
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            Bundle transactions into groups so limits can be set for them together.
          </Typography>
        </Box>
      </Grid>

      {/* ---------- Search ---------- */}
      <Grid item xs={12} md={8}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
              Find a group
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary', mb: 5 }}>
              Leave both fields empty and press Search to list every group.
            </Typography>
            <form onSubmit={onSearch}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={5}>
                  <Controller
                    name='groupCode'
                    control={searchForm.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Group Code'
                        placeholder='e.g. DOMESTIC_TRANSFER_GROUP'
                        inputProps={{ maxLength: 50 }}
                        onChange={e => field.onChange(e.target.value.toUpperCase())}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Controller
                    name='groupName'
                    control={searchForm.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Group Name'
                        inputProps={{ maxLength: 100 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Magnify fontSize='small' />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Button type='submit' variant='contained' disabled={loading} startIcon={<Magnify />}>
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                  <Button variant='contained' color='warning' onClick={onCancel} disabled={loading}>
                    Cancel
                  </Button>
                  <Button variant='outlined' color='secondary' onClick={onClear} disabled={loading}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>

      {/* ---------- Create card ---------- */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', bgcolor: tint(0.05), border: `1px dashed ${tint(0.5)}`, boxShadow: 'none' }}>
          <CardContent
            sx={{
              height: '100%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.main',
                color: 'primary.contrastText'
              }}
            >
              <PlusCircleOutline sx={{ fontSize: 30 }} />
            </Box>
            <Typography variant='h6' color='primary' sx={{ fontWeight: 600 }}>
              Need a new group?
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Create a group and add as many transactions as you like. Set its limits later in Limit - Package
              Management.
            </Typography>
            <Button variant='contained' startIcon={<PlusCircleOutline />} onClick={() => openDialog('create')}>
              Create group
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* ---------- Results ---------- */}
      {hasSearched && (
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                Search results
              </Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                {results.length} group{results.length === 1 ? '' : 's'} found
              </Typography>
            </Box>
            {results.length > 0 && (
              <Button
                size='small'
                variant='outlined'
                startIcon={<PlusCircleOutline />}
                onClick={() => openDialog('create')}
              >
                New group
              </Button>
            )}
          </Box>

          <ResultsTable
            columns={groupColumns}
            gridTemplateColumns={groupGridColumns}
            rows={pagedRows}
            getRowKey={g => String(g.groupId)}
            onRowClick={g => openDialog('view', g)}
            emptyMessage='No groups match your search. You can create a new one instead.'
            headerColor={theme.palette.primary.main}
            renderRow={g => (
              <>
                {/* Group Code */}
                <Box sx={{ minWidth: 0, opacity: g.active ? 1 : 0.6 }}>
                  <Chip
                    label={g.groupCode}
                    size='small'
                    sx={{
                      maxWidth: '100%',
                      height: 'auto',
                      fontWeight: 700,
                      bgcolor: tint(0.12),
                      color: 'primary.main',
                      '& .MuiChip-label': { whiteSpace: 'normal', wordBreak: 'break-all', py: 0.5 }
                    }}
                  />
                </Box>

                {/* Group Name */}
                <Box sx={{ minWidth: 0, opacity: g.active ? 1 : 0.6, wordBreak: 'break-word' }}>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    {g.groupName}
                  </Typography>
                  {g.description && (
                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                      {g.description}
                    </Typography>
                  )}
                </Box>

                {/* Transactions - zyada hon to neechay line mein wrap */}
                <Box
                  sx={{
                    minWidth: 0,
                    display: 'flex',
                    gap: 1.5,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    opacity: g.active ? 1 : 0.6
                  }}
                >
                  {g.operationCodes.map(code => (
                    <Chip key={code} size='small' variant='outlined' label={nameOf(code)} sx={{ maxWidth: '100%' }} />
                  ))}
                  {g.operationCodes.length === 0 && (
                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                      No transactions
                    </Typography>
                  )}
                </Box>

                {/* Status */}
                <Box>
                  <Chip
                    size='small'
                    variant='outlined'
                    color={g.active ? 'success' : 'error'}
                    label={g.active ? 'Active' : 'Inactive'}
                  />
                </Box>

                {/* Actions */}
                <Box sx={{ whiteSpace: 'nowrap' }} onClick={e => e.stopPropagation()}>
                  <Tooltip title='View'>
                    <IconButton size='small' onClick={() => openDialog('view', g)}>
                      <EyeOutline fontSize='small' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Edit'>
                    <IconButton size='small' color='primary' onClick={() => openDialog('edit', g)}>
                      <PencilOutline fontSize='small' />
                    </IconButton>
                  </Tooltip>
                  {g.active && (
                    <Tooltip title='Delete'>
                      <IconButton size='small' color='error' onClick={() => setDeleteTarget(g)}>
                        <DeleteOutline fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </>
            )}
          />

          {results.length > 0 && (
            <TablePagination
              component='div'
              count={results.length}
              page={safePage}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={e => {
                setRowsPerPage(parseInt(e.target.value, 10))
                setPage(0)
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          )}
        </Grid>
      )}

      {/* ---------- Create / Edit / View modal ---------- */}
      <Dialog
        open={dialogMode !== null}
        onClose={saving ? undefined : () => setDialogMode(null)}
        fullWidth
        maxWidth='md'
        fullScreen={fullScreen}
      >
        {dialogMode && (
          <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
            {/* Modal header */}
            <Box sx={{ px: 6, py: 5, display: 'flex', alignItems: 'flex-start', gap: 3, bgcolor: tint(0.05) }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  flexShrink: 0,
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText'
                }}
              >
                <FormatListGroup />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant='h6' sx={{ fontWeight: 600, lineHeight: 1.25 }}>
                  {dialogMeta[dialogMode].title}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  {dialogMeta[dialogMode].subtitle}
                </Typography>
              </Box>
              <IconButton
                type='button'
                size='small'
                onClick={() => setDialogMode(null)}
                disabled={saving}
                aria-label='Close'
              >
                <Close />
              </IconButton>
            </Box>
            <Divider />

            <DialogContent sx={{ px: 6, py: 5 }}>
              {/* Group details */}
              <Typography variant='subtitle2' sx={{ mb: 3, fontWeight: 600 }}>
                Group details
              </Typography>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={5}>
                  <Controller
                    name='groupCode'
                    control={groupForm.control}
                    rules={{
                      required: 'Group code is required',
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
                        label='Group Code'
                        disabled={dialogMode === 'edit'}
                        InputProps={{ readOnly: dialogMode !== 'create' }}
                        inputProps={{ maxLength: 50 }}
                        onChange={e => field.onChange(e.target.value.toUpperCase())}
                        error={!!fieldState.error}
                        helperText={
                          fieldState.error?.message ??
                          (dialogMode === 'edit'
                            ? 'Code cannot be changed'
                            : dialogMode === 'create'
                              ? 'Up to 50 characters'
                              : ' ')
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Controller
                    name='groupName'
                    control={groupForm.control}
                    rules={{ required: 'Group name is required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        required={!readOnly}
                        label='Group Name'
                        InputProps={{ readOnly }}
                        inputProps={{ maxLength: 100 }}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message ?? (readOnly ? ' ' : 'A short name people will recognise')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name='description'
                    control={groupForm.control}
                    rules={{ required: 'Description is required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        minRows={2}
                        required={!readOnly}
                        label='Description'
                        InputProps={{ readOnly }}
                        inputProps={{ maxLength: 250 }}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message ?? (readOnly ? ' ' : 'What this group covers')}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 5 }} />

              {/* Transactions picker */}
              <Controller
                name='transactions'
                control={groupForm.control}
                rules={{ validate: v => v.length > 0 || 'Select at least one transaction' }}
                render={({ field, fieldState }) => {
                  const selected = new Set(field.value.map(t => t.transactionCode))
                  const filtered = availableTransactions.filter(t =>
                    `${t.transactionCode} ${t.transactionName}`.toLowerCase().includes(txnSearch.trim().toLowerCase())
                  )
                  const allFilteredSelected = filtered.length > 0 && filtered.every(t => selected.has(t.transactionCode))

                  const toggle = (t: ITransactionItem) =>
                    field.onChange(
                      selected.has(t.transactionCode)
                        ? field.value.filter(x => x.transactionCode !== t.transactionCode)
                        : [...field.value, t]
                    )

                  const toggleAllFiltered = () =>
                    field.onChange(
                      allFilteredSelected
                        ? field.value.filter(v => !filtered.some(f => f.transactionCode === v.transactionCode))
                        : [...field.value, ...filtered.filter(f => !selected.has(f.transactionCode))]
                    )

                  const emptyListText =
                    transactionsStatus === 'pending'
                      ? 'Loading transactions...'
                      : transactionsStatus === 'error'
                        ? 'Could not load transactions.'
                        : `No transactions match "${txnSearch}".`

                  const selectedPanel = (
                    <Box
                      sx={{
                        border: `1px solid ${fieldState.error ? theme.palette.error.main : theme.palette.divider}`,
                        borderRadius: 1,
                        height: '100%',
                        minHeight: 200,
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Box
                        sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                          In this group
                        </Typography>
                        <Chip size='small' color='primary' label={field.value.length} />
                      </Box>
                      <Divider />
                      <Box
                        sx={{
                          p: 3,
                          display: 'flex',
                          gap: 2,
                          flexWrap: 'wrap',
                          alignContent: 'flex-start',
                          overflowY: 'auto',
                          maxHeight: 280
                        }}
                      >
                        {field.value.length === 0 ? (
                          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                            Nothing selected yet. Tick transactions from the list.
                          </Typography>
                        ) : (
                          field.value.map(t => (
                            <Chip
                              key={t.transactionCode}
                              size='small'
                              color='primary'
                              variant='outlined'
                              label={nameOf(t.transactionCode)}
                              onDelete={readOnly ? undefined : () => toggle(t)}
                            />
                          ))
                        )}
                      </Box>
                    </Box>
                  )

                  return (
                    <>
                      <Typography variant='subtitle2' sx={{ mb: 3, fontWeight: 600 }}>
                        Transactions
                      </Typography>
                      <Grid container spacing={4}>
                        {!readOnly && (
                          <Grid item xs={12} md={7}>
                            <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                              <Box sx={{ p: 3 }}>
                                <TextField
                                  fullWidth
                                  size='small'
                                  placeholder='Search by code or name'
                                  value={txnSearch}
                                  onChange={e => setTxnSearch(e.target.value)}
                                  onKeyDown={e => {
                                    // Enter se form submit na ho
                                    if (e.key === 'Enter') e.preventDefault()
                                  }}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position='start'>
                                        <Magnify fontSize='small' />
                                      </InputAdornment>
                                    )
                                  }}
                                />
                                <Box
                                  sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                  <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                                    {filtered.length} available
                                  </Typography>
                                  <Box>
                                    <Button
                                      type='button'
                                      size='small'
                                      onClick={toggleAllFiltered}
                                      disabled={filtered.length === 0}
                                    >
                                      {allFilteredSelected ? 'Unselect all' : 'Select all'}
                                    </Button>
                                    <Button
                                      type='button'
                                      size='small'
                                      color='secondary'
                                      onClick={() => field.onChange([])}
                                      disabled={field.value.length === 0}
                                    >
                                      Clear
                                    </Button>
                                  </Box>
                                </Box>
                              </Box>
                              <Divider />
                              <List dense disablePadding sx={{ maxHeight: 240, overflowY: 'auto' }}>
                                {filtered.length === 0 && (
                                  <Typography
                                    variant='body2'
                                    sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}
                                  >
                                    {emptyListText}
                                  </Typography>
                                )}
                                {filtered.map(t => (
                                  <ListItemButton
                                    key={t.transactionCode}
                                    onClick={() => toggle(t)}
                                    selected={selected.has(t.transactionCode)}
                                  >
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                      <Checkbox
                                        edge='start'
                                        size='small'
                                        disableRipple
                                        checked={selected.has(t.transactionCode)}
                                        tabIndex={-1}
                                      />
                                    </ListItemIcon>
                                    <ListItemText primary={t.transactionName} secondary={t.transactionCode} />
                                  </ListItemButton>
                                ))}
                              </List>
                            </Box>
                          </Grid>
                        )}
                        <Grid item xs={12} md={readOnly ? 12 : 5}>
                          {selectedPanel}
                        </Grid>
                      </Grid>
                      <FormHelperText error={!!fieldState.error} sx={{ mt: 2, mx: 0 }}>
                        {fieldState.error?.message ?? ' '}
                      </FormHelperText>
                    </>
                  )
                }}
              />

              {!readOnly && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                  <InformationOutline fontSize='small' />
                  <Typography variant='caption'>Limits for this group are set in Limit - Package Management.</Typography>
                </Box>
              )}
            </DialogContent>

            <Divider />
            <DialogActions sx={{ px: 6, py: 4, justifyContent: 'space-between' }}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                {selectedCount} transaction{selectedCount === 1 ? '' : 's'} selected
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Button
                  type='button'
                  variant='outlined'
                  color='secondary'
                  onClick={() => setDialogMode(null)}
                  disabled={saving}
                >
                  {readOnly ? 'Close' : 'Cancel'}
                </Button>
                {readOnly ? (
                  <Button
                    key='edit-btn'
                    type='button'
                    variant='contained'
                    startIcon={<PencilOutline />}
                    onClick={() => setDialogMode('edit')}
                  >
                    Edit group
                  </Button>
                ) : (
                  <Button key='save-btn' type='submit' variant='contained' disabled={saving}>
                    {dialogMode === 'edit' ? 'Save changes' : 'Create group'}
                  </Button>
                )}
              </Box>
            </DialogActions>
          </form>
        )}
      </Dialog>

      <ConfirmActionDialog
        open={Boolean(pendingSave)}
        title={saveCopy.title}
        message={saveCopy.message}
        confirmLabel={saveCopy.label}
        loading={saving}
        onConfirm={confirmSave}
        onClose={() => setPendingSave(null)}
      />

      {/* ---------- Deactivate confirm ---------- */}
      <Dialog open={!!deleteTarget} onClose={saving ? undefined : () => setDeleteTarget(null)} maxWidth='xs' fullWidth>
        <DialogContent sx={{ textAlign: 'center', pt: 8 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              mx: 'auto',
              mb: 3,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(theme.palette.warning.main, 0.12),
              color: 'warning.main'
            }}
          >
            <DeleteOutline sx={{ fontSize: 30 }} />
          </Box>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Delete group {deleteTarget?.groupCode}?
          </Typography>
          <DialogContentText>
            This group will be marked <b>Inactive</b>. It will not be deleted and will stay in the list with its{' '}
            {deleteTarget?.operationCodes.length ?? 0} transaction(s). Do you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 6, pb: 6, justifyContent: 'center', gap: 3 }}>
          <Button variant='outlined' color='secondary' onClick={() => setDeleteTarget(null)} disabled={saving}>
            Keep active
          </Button>
          <Button variant='contained' color='warning' onClick={onConfirmDelete} disabled={saving}>
            {saving ? 'Deleting...' : 'Delete group'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

PartyLimitTransactionGroup.acl = {
  action: 'itsHaveAccess',
  subject: 'party-maintenance-party-limit-transaction-group-page'
}

export default PartyLimitTransactionGroup