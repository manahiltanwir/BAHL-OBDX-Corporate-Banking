import { useEffect, useState } from 'react'
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
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
import AlertOutline from 'mdi-material-ui/AlertOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'
import ApiResponseDialog from 'src/@core/components/ApiResponseDialog'

// ======================= TYPES =======================
interface TransactionItem {
  transactionCode: string
  transactionName: string
}

interface TransactionGroup {
  groupCode: string
  groupDescription: string
  transactions: TransactionItem[]
}

interface SearchFormValues {
  groupCode: string
  groupDescription: string
}

interface GroupFormValues {
  groupCode: string
  groupDescription: string
  transactions: TransactionItem[]
}

type DialogMode = 'create' | 'edit' | 'view' | null

// Adjust to whatever ApiResponseDialog expects
interface ApiResponseInfo {
  success: boolean
  message: string
}

// ======================= MOCK DATA (replace with API later) =======================
const MOCK_TRANSACTIONS: TransactionItem[] = [
  { transactionCode: 'FT01', transactionName: 'Fund Transfer - Own Account' },
  { transactionCode: 'FT02', transactionName: 'Fund Transfer - Within Bank' },
  { transactionCode: 'FT03', transactionName: 'Fund Transfer - Interbank' },
  { transactionCode: 'IP01', transactionName: 'International Single Payment' },
  { transactionCode: 'IP02', transactionName: 'International Bulk Payment' },
  { transactionCode: 'BP01', transactionName: 'Bill Payment' }
]

const INITIAL_GROUPS: TransactionGroup[] = [
  { groupCode: 'DOMESTIC', groupDescription: 'Domestic transfers', transactions: MOCK_TRANSACTIONS.slice(0, 3) },
  { groupCode: 'INTL', groupDescription: 'International payments', transactions: MOCK_TRANSACTIONS.slice(3, 5) }
]

const emptySearch: SearchFormValues = { groupCode: '', groupDescription: '' }
const emptyGroup: GroupFormValues = { groupCode: '', groupDescription: '', transactions: [] }

const dialogMeta = {
  create: { title: 'Create transaction group', subtitle: 'Name the group, then pick the transactions it should contain.' },
  edit: { title: 'Edit transaction group', subtitle: 'Update the description or change which transactions belong to this group.' },
  view: { title: 'Transaction group details', subtitle: 'Read-only view of this group.' }
}

// ======================= PAGE =======================
const PartyLimitTransactionGroup = () => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const tint = (a: number) => alpha(theme.palette.primary.main, a)

  const searchForm = useForm<SearchFormValues>({ defaultValues: emptySearch })
  const groupForm = useForm<GroupFormValues>({ defaultValues: emptyGroup })

  // "database" lives in state for now; swap these for API calls later
  const [allGroups, setAllGroups] = useState<TransactionGroup[]>(INITIAL_GROUPS)
  const [availableTransactions, setAvailableTransactions] = useState<TransactionItem[]>([])

  const [results, setResults] = useState<TransactionGroup[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [deleteTarget, setDeleteTarget] = useState<TransactionGroup | null>(null)
  const [responseInfo, setResponseInfo] = useState<ApiResponseInfo | null>(null)
  const [txnSearch, setTxnSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const readOnly = dialogMode === 'view'
  const pagedRows = results.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // TODO: API - load transactions list
  useEffect(() => {
    setAvailableTransactions(MOCK_TRANSACTIONS)
  }, [])

  const filterGroups = (source: TransactionGroup[], f: SearchFormValues) => {
    const code = f.groupCode.trim().toLowerCase()
    const desc = f.groupDescription.trim().toLowerCase()

    return source.filter(
      g => g.groupCode.toLowerCase().includes(code) && g.groupDescription.toLowerCase().includes(desc)
    )
  }

  // TODO: API - search groups
  const onSearch = searchForm.handleSubmit(async data => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 300))
    setResults(filterGroups(allGroups, data))
    setHasSearched(true)
    setPage(0)
    setLoading(false)
  })

  const onClear = () => searchForm.reset(emptySearch)

  const onCancel = () => {
    searchForm.reset(emptySearch)
    setResults([])
    setHasSearched(false)
  }

  const openDialog = (mode: DialogMode, g?: TransactionGroup) => {
    groupForm.reset(g ?? emptyGroup)
    setTxnSearch('')
    setDialogMode(mode)
  }

  // TODO: API - create / update group
  const onSave = groupForm.handleSubmit(async data => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 300))

    let next: TransactionGroup[]
    if (dialogMode === 'edit') {
      next = allGroups.map(g => (g.groupCode === data.groupCode ? data : g))
      setResponseInfo({ success: true, message: `Group ${data.groupCode} updated successfully.` })
    } else {
      if (allGroups.some(g => g.groupCode === data.groupCode)) {
        setResponseInfo({ success: false, message: `Group code ${data.groupCode} already exists.` })
        setSaving(false)

        return
      }
      next = [...allGroups, data]
      setResponseInfo({ success: true, message: `Group ${data.groupCode} created successfully.` })
    }

    setAllGroups(next)
    // refresh visible list: use current search filters, or show the new group if no search yet
    const filters = hasSearched ? searchForm.getValues() : { groupCode: data.groupCode, groupDescription: '' }
    if (!hasSearched) searchForm.setValue('groupCode', data.groupCode)
    setResults(filterGroups(next, filters))
    setHasSearched(true)
    setDialogMode(null)
    setSaving(false)
  })

  // TODO: API - delete group
  const onConfirmDelete = async () => {
    if (!deleteTarget) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 300))
    const next = allGroups.filter(g => g.groupCode !== deleteTarget.groupCode)
    setAllGroups(next)
    setResults(filterGroups(next, searchForm.getValues()))
    setResponseInfo({ success: true, message: `Group ${deleteTarget.groupCode} deleted successfully.` })
    setDeleteTarget(null)
    setSaving(false)
  }

  const selectedCount = groupForm.watch('transactions').length

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
                        placeholder='e.g. DOMESTIC'
                        inputProps={{ maxLength: 10 }}
                        onChange={e => field.onChange(e.target.value.toUpperCase())}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Controller
                    name='groupDescription'
                    control={searchForm.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Group Description'
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
          <Card>
            <Box sx={{ px: 5, py: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                  Search results
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  {results.length} group{results.length === 1 ? '' : 's'} found
                </Typography>
              </Box>
              {results.length > 0 && (
                <Button size='small' variant='outlined' startIcon={<PlusCircleOutline />} onClick={() => openDialog('create')}>
                  New group
                </Button>
              )}
            </Box>
            <Divider />
            {results.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 12, px: 4 }}>
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
                    bgcolor: tint(0.1),
                    color: 'primary.main'
                  }}
                >
                  <Magnify sx={{ fontSize: 30 }} />
                </Box>
                <Typography variant='h6' sx={{ mb: 1 }}>
                  No groups match your search
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary', mb: 4 }}>
                  Try a different code or description, or create a new group.
                </Typography>
                <Button variant='contained' startIcon={<PlusCircleOutline />} onClick={() => openDialog('create')}>
                  Create new group
                </Button>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Group</TableCell>
                        <TableCell>Transactions</TableCell>
                        <TableCell align='right'>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pagedRows.map(g => (
                        <TableRow key={g.groupCode} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Chip
                                label={g.groupCode}
                                size='small'
                                sx={{ fontWeight: 700, bgcolor: tint(0.12), color: 'primary.main' }}
                              />
                              <Typography variant='body2'>{g.groupDescription}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                              {g.transactions.slice(0, 2).map(t => (
                                <Chip key={t.transactionCode} size='small' variant='outlined' label={t.transactionName} />
                              ))}
                              {g.transactions.length > 2 && (
                                <Tooltip
                                  arrow
                                  title={g.transactions
                                    .slice(2)
                                    .map(t => t.transactionName)
                                    .join(', ')}
                                >
                                  <Chip size='small' color='primary' label={`+${g.transactions.length - 2} more`} />
                                </Tooltip>
                              )}
                              {g.transactions.length === 0 && (
                                <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                                  No transactions
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>
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
                            <Tooltip title='Delete'>
                              <IconButton size='small' color='error' onClick={() => setDeleteTarget(g)}>
                                <DeleteOutline fontSize='small' />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component='div'
                  count={results.length}
                  page={page}
                  onPageChange={(_, p) => setPage(p)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={e => {
                    setRowsPerPage(parseInt(e.target.value, 10))
                    setPage(0)
                  }}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              </>
            )}
          </Card>
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
              <IconButton size='small' onClick={() => setDialogMode(null)} disabled={saving} aria-label='Close'>
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
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='groupCode'
                    control={groupForm.control}
                    rules={{
                      required: 'Group code is required',
                      pattern: { value: /^[A-Z0-9_]+$/, message: 'Use capital letters, numbers or underscore only' }
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        required={!readOnly}
                        label='Group Code'
                        disabled={dialogMode === 'edit'}
                        InputProps={{ readOnly }}
                        inputProps={{ maxLength: 10 }}
                        onChange={e => field.onChange(e.target.value.toUpperCase())}
                        error={!!fieldState.error}
                        helperText={
                          fieldState.error?.message ??
                          (dialogMode === 'edit' ? 'Code cannot be changed' : dialogMode === 'create' ? 'Up to 10 characters' : ' ')
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Controller
                    name='groupDescription'
                    control={groupForm.control}
                    rules={{ required: 'Group description is required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        required={!readOnly}
                        label='Group Description'
                        InputProps={{ readOnly }}
                        inputProps={{ maxLength: 100 }}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message ?? (readOnly ? ' ' : 'A short name people will recognise')}
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

                  const toggle = (t: TransactionItem) =>
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
                      <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                          In this group
                        </Typography>
                        <Chip size='small' color='primary' label={field.value.length} />
                      </Box>
                      <Divider />
                      <Box sx={{ p: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignContent: 'flex-start', overflowY: 'auto', maxHeight: 280 }}>
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
                              label={`${t.transactionCode} - ${t.transactionName}`}
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
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position='start'>
                                        <Magnify fontSize='small' />
                                      </InputAdornment>
                                    )
                                  }}
                                />
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                                    {filtered.length} available
                                  </Typography>
                                  <Box>
                                    <Button size='small' onClick={toggleAllFiltered} disabled={filtered.length === 0}>
                                      {allFilteredSelected ? 'Unselect all' : 'Select all'}
                                    </Button>
                                    <Button
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
                                  <Typography variant='body2' sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                                    No transactions match "{txnSearch}".
                                  </Typography>
                                )}
                                {filtered.map(t => (
                                  <ListItemButton key={t.transactionCode} onClick={() => toggle(t)} selected={selected.has(t.transactionCode)}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                      <Checkbox edge='start' size='small' disableRipple checked={selected.has(t.transactionCode)} tabIndex={-1} />
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
                <Button variant='outlined' color='secondary' onClick={() => setDialogMode(null)} disabled={saving}>
                  {readOnly ? 'Close' : 'Cancel'}
                </Button>
                {readOnly ? (
                  <Button variant='contained' startIcon={<PencilOutline />} onClick={() => setDialogMode('edit')}>
                    Edit group
                  </Button>
                ) : (
                  <Button type='submit' variant='contained' disabled={saving}>
                    {saving ? 'Saving...' : dialogMode === 'edit' ? 'Save changes' : 'Create group'}
                  </Button>
                )}
              </Box>
            </DialogActions>
          </form>
        )}
      </Dialog>

      {/* ---------- Delete confirmation ---------- */}
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
              bgcolor: alpha(theme.palette.error.main, 0.12),
              color: 'error.main'
            }}
          >
            <AlertOutline sx={{ fontSize: 30 }} />
          </Box>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Delete group {deleteTarget?.groupCode}?
          </Typography>
          <DialogContentText>
            This removes the group and its {deleteTarget?.transactions.length ?? 0} transaction mapping(s). This cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 6, pb: 6, justifyContent: 'center', gap: 3 }}>
          <Button variant='outlined' color='secondary' onClick={() => setDeleteTarget(null)} disabled={saving}>
            Keep group
          </Button>
          <Button variant='contained' color='error' onClick={onConfirmDelete} disabled={saving}>
            {saving ? 'Deleting...' : 'Delete group'}
          </Button>
        </DialogActions>
      </Dialog>

      <ApiResponseDialog open={responseInfo !== null} response={responseInfo} onClose={() => setResponseInfo(null)} />
    </Grid>
  )
}

PartyLimitTransactionGroup.acl = {
  action: 'itsHaveAccess',
  subject: 'party-maintenance-party-limit-transaction-group-page'
}

export default PartyLimitTransactionGroup