import React, { useEffect, useMemo, useState } from 'react'
import {
  Box, Grid, Card, CardContent, Typography, TextField, Button, Stepper, Step, StepLabel,
  Avatar, Divider, Checkbox, FormControlLabel, Switch, Alert, Stack, Table, TableHead,
  TableBody, TableRow, TableCell, IconButton, Chip, Snackbar, useTheme, alpha
} from '@mui/material'

import DescriptionIcon from '@mui/icons-material/Description'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ArticleIcon from '@mui/icons-material/Article'
import LinkIcon from '@mui/icons-material/Link'
import ForumIcon from '@mui/icons-material/Forum'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SendIcon from '@mui/icons-material/Send'
import SaveIcon from '@mui/icons-material/Save'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RateReviewIcon from '@mui/icons-material/RateReview'
import {
  ImportLCApplicationState, DraftRecord, GoodsRecord, ConditionRecord, CollateralAccount,
  MarginAccount, FinancialCharge, buildInitialState, calculateTotalExposure,
  calculateRequiredCollateralAmount, calculateTableTotal, validateForm, validateAndAttachFile
} from './importLcTypes'

const SUCCESS_COLOR = '#15804f'
const DRAFT_KEY = 'import-lc-draft'
const uuid = () => Math.random().toString(36).slice(2, 10)

// ----------------------------------------------------------------------
// Draft persistence (attachedFile can't be serialized, so it's dropped
// before saving and simply needs re-uploading when a draft is resumed).
// ----------------------------------------------------------------------
type SavedDraft = { state: Omit<ImportLCApplicationState, 'attachedFile'>; activeStep: number; savedAt: string }

const saveDraft = (state: ImportLCApplicationState, activeStep: number) => {
  const { attachedFile, ...rest } = state
  const draft: SavedDraft = { state: rest, activeStep, savedAt: new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' }) }
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}
const loadDraft = (): SavedDraft | null => {
  const raw = window.localStorage.getItem(DRAFT_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) } catch { window.localStorage.removeItem(DRAFT_KEY); return null }
}
const clearDraft = () => window.localStorage.removeItem(DRAFT_KEY)

// ----------------------------------------------------------------------
// Generic building blocks
// ----------------------------------------------------------------------

const Field = ({ label, value, onChange, type = 'text', select, options, gridMd = 4, multiline, rows }: {
  label: string; value: string | number; onChange: (v: string) => void; type?: string; select?: boolean
  options?: string[]; gridMd?: number; multiline?: boolean; rows?: number
}) => {
  // Native type="number" inputs show up/down spinner arrows that can swallow
  // clicks and block free typing (especially on mobile/webviews), so numeric
  // fields are rendered as text inputs with a numeric keyboard instead.
  const isNumeric = type === 'number'
  return (
    <Grid item xs={12} sm={6} md={gridMd}>
      <TextField
        fullWidth size="small" label={label} type={isNumeric ? 'text' : type} select={select} multiline={multiline} rows={rows}
        inputMode={isNumeric ? 'decimal' : undefined}
        value={value ?? ''}
        onChange={(e) => {
          const v = e.target.value
          if (!isNumeric || /^-?\d*\.?\d*$/.test(v)) onChange(v)
        }}
        InputLabelProps={type === 'date' ? { shrink: true } : undefined}
        SelectProps={select ? { native: true } : undefined}
      >
        {select && <React.Fragment><option value="" />{options?.map((o) => <option key={o} value={o}>{o}</option>)}</React.Fragment>}
      </TextField>
    </Grid>
  )
}

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
    {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
  </Box>
)

const SummaryItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
    <Typography variant="body2" fontWeight={500}>{value === '' || value == null ? '—' : value}</Typography>
  </Grid>
)

const SummaryBlock = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => {
  const theme = useTheme()
  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
        <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(theme.palette.primary.main, 0.12), color: 'primary.main' }}>
          <Icon sx={{ fontSize: 16 }} />
        </Avatar>
        <Typography variant="subtitle2" fontWeight={700}>{title}</Typography>
      </Stack>
      <Grid container spacing={2}>{children}</Grid>
      <Divider sx={{ mt: 3 }} />
    </Box>
  )
}

// Generic editable table — one component drives every dynamic-row table
// (drafts / goods / conditions / collaterals / margins / charges / taxes / commissions)
interface ColumnConfig<T> { key: keyof T; label: string; width?: number; type?: 'text' | 'number' | 'date'; readOnly?: boolean }

function EditableTable<T extends { id: string }>({ columns, rows, onAdd, onRemove, onUpdate, addLabel }: {
  columns: ColumnConfig<T>[]; rows: T[]; onAdd: () => void; onRemove: (id: string) => void
  onUpdate: (id: string, patch: Partial<T>) => void; addLabel: string
}) {
  return (
    <React.Fragment>
      <Table size="small">
        <TableHead>
          <TableRow>{columns.map((c) => <TableCell key={String(c.key)} width={c.width}>{c.label}</TableCell>)}<TableCell align="right" /></TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((col) => (
                <TableCell key={String(col.key)}>
                  {col.readOnly ? (
                    <Typography variant="body2" fontWeight={600}>{String(row[col.key] ?? '')}</Typography>
                  ) : (
                    <TextField
                      size="small" variant="standard" fullWidth type={col.type === 'number' ? 'text' : col.type ?? 'text'}
                      inputMode={col.type === 'number' ? 'decimal' : undefined}
                      InputLabelProps={col.type === 'date' ? { shrink: true } : undefined}
                      value={row[col.key] ?? ''}
                      onChange={(e) => {
                        const v = e.target.value
                        if (col.type === 'number' && !/^-?\d*\.?\d*$/.test(v)) return
                        onUpdate(row.id, { [col.key]: col.type === 'number' ? Number(v) : v } as Partial<T>)
                      }}
                    />
                  )}
                </TableCell>
              ))}
              <TableCell align="right"><IconButton size="small" onClick={() => onRemove(row.id)}><DeleteOutlineIcon fontSize="small" color="error" /></IconButton></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button size="small" startIcon={<AddIcon />} onClick={onAdd} sx={{ mt: 2 }}>{addLabel}</Button>
    </React.Fragment>
  )
}

// ----------------------------------------------------------------------
// Step / field / table configuration — the single source of truth for
// what renders on each step. Plain inputs go in "fields" blocks and are
// rendered generically; dynamic-row tables go in "table" blocks and are
// also rendered generically via EditableTable. Only genuinely one-off UI
// (checklists, summary cards, the review page) uses a "custom" block.
// ----------------------------------------------------------------------

type ArrayKey = 'drafts' | 'goods' | 'conditions' | 'collaterals' | 'margins' | 'charges' | 'taxes' | 'commissions'

interface FieldConfig {
  key: keyof ImportLCApplicationState
  label: string
  kind?: 'text' | 'number' | 'date' | 'select' | 'switch'
  options?: string[]
  gridMd?: number
  multiline?: boolean
  rows?: number
  visibleIf?: (s: ImportLCApplicationState) => boolean
}

interface FieldsBlock { type: 'fields'; title: string; fields: FieldConfig[] }
interface TableBlock {
  type: 'table'
  title: string
  subtitle?: string
  arrayKey: ArrayKey
  columns: ColumnConfig<any>[]
  addLabel: string
  newRow: (s: ImportLCApplicationState) => any
  transform?: (row: any) => any
  showTotal?: boolean
}
interface CustomBlock { type: 'custom'; key: string }
type Block = FieldsBlock | TableBlock | CustomBlock

const STEP_META: { key: string; label: string; icon: React.ElementType; blocks: Block[] }[] = [
  {
    key: 'lcDetails', label: 'LC Details', icon: DescriptionIcon,
    blocks: [
      { type: 'fields', title: 'Applicant & Accountee', fields: [
        { key: 'customerType', label: 'Customer Type', kind: 'select', options: ['Existing', 'NonCustomer'] },
        { key: 'applicantName', label: 'Applicant Name' },
        { key: 'accounteeName', label: 'Accountee Name' },
        { key: 'applicantAddress', label: 'Applicant Address', gridMd: 8, multiline: true, rows: 2 },
        { key: 'isTransferable', label: 'Transferable LC', kind: 'switch' }
      ] },
      { type: 'fields', title: 'LC Type & Product', fields: [
        { key: 'lcType', label: 'LC Type', kind: 'select', options: ['Sight', 'Usance', 'Mixed Payment'] },
        { key: 'productId', label: 'Product ID' },
        { key: 'isRevolving', label: 'Revolving LC', kind: 'switch' },
        { key: 'expiryDate', label: 'Expiry Date', kind: 'date' },
        { key: 'expiryPlace', label: 'Expiry Place' },
        { key: 'customerReferenceNumber', label: 'Customer Reference Number' }
      ] },
      { type: 'fields', title: 'Beneficiary', fields: [
        { key: 'beneficiaryType', label: 'Beneficiary Type', kind: 'select', options: ['Existing', 'New'] },
        { key: 'beneficiaryName', label: 'Beneficiary Name' },
        { key: 'beneficiaryCountry', label: 'Beneficiary Country' },
        { key: 'beneficiaryAddress', label: 'Beneficiary Address', gridMd: 12, multiline: true, rows: 2 }
      ] },
      { type: 'fields', title: 'Amount & Tolerance', fields: [
        { key: 'currency', label: 'Currency', kind: 'select', options: ['USD', 'PKR', 'EUR', 'GBP', 'AED', 'CNY'] },
        { key: 'lcAmount', label: 'LC Amount', kind: 'number' },
        { key: 'underTolerancePercent', label: 'Under Tolerance (%)', kind: 'number' },
        { key: 'aboveTolerancePercent', label: 'Above Tolerance (%)', kind: 'number' },
        { key: 'additionalAmountCovered', label: 'Additional Amount Covered' }
      ] },
      { type: 'fields', title: 'Credit Availability', fields: [
        { key: 'creditAvailableBy', label: 'Credit Available By', kind: 'select', options: ['BY ACCEPTANCE', 'BY PAYMENT', 'BY DEF PAYMENT', 'BY NEGOTIATION'] },
        { key: 'creditAvailableWith', label: 'Credit Available With' }
      ] },
      { type: 'table', title: 'Drafts', subtitle: 'Add one row per draft / tenor breakdown.', arrayKey: 'drafts', addLabel: 'Add Draft',
        newRow: () => ({ id: uuid(), tenor: '', creditDaysFrom: '', draweeBank: '', amount: 0 }),
        columns: [{ key: 'tenor', label: 'Tenor' }, { key: 'creditDaysFrom', label: 'Credit Days From' }, { key: 'draweeBank', label: 'Drawee Bank' }, { key: 'amount', label: 'Amount', type: 'number' }] }
    ]
  },
  {
    key: 'goods', label: 'Goods & Shipment', icon: LocalShippingIcon,
    blocks: [
      { type: 'fields', title: 'Shipment Terms', fields: [
        { key: 'partialShipment', label: 'Partial Shipment', kind: 'select', options: ['ALLOWED', 'DISALLOWED'] },
        { key: 'transShipment', label: 'Trans-Shipment', kind: 'select', options: ['ALLOWED', 'DISALLOWED'] },
        { key: 'placeOfTakingInCharge', label: 'Place of Taking in Charge' },
        { key: 'portOfLoading', label: 'Port of Loading' },
        { key: 'portOfDischarge', label: 'Port of Discharge' },
        { key: 'placeOfFinalDestination', label: 'Place of Final Destination' },
        { key: 'shipmentInputType', label: 'Shipment Input Type', kind: 'select', options: ['Date', 'Period'] },
        { key: 'latestShipmentDate', label: 'Latest Shipment Date', kind: 'date', visibleIf: (s) => s.shipmentInputType === 'Date' },
        { key: 'shipmentPeriod', label: 'Shipment Period', visibleIf: (s) => s.shipmentInputType === 'Period' }
      ] },
      { type: 'table', title: 'Goods', subtitle: 'List each category of goods being shipped.', arrayKey: 'goods', addLabel: 'Add Goods Line',
        newRow: () => ({ id: uuid(), category: '', description: '' }),
        columns: [{ key: 'category', label: 'Category', width: 220 }, { key: 'description', label: 'Description' }] }
    ]
  },
  {
    key: 'documents', label: 'Documents & Conditions', icon: ArticleIcon,
    blocks: [
      { type: 'custom', key: 'documents-checklist' },
      { type: 'table', title: 'Additional Conditions', arrayKey: 'conditions', addLabel: 'Add Condition',
        newRow: () => ({ id: uuid(), code: '', identifier: '', description: '' }),
        columns: [{ key: 'code', label: 'Code', width: 120 }, { key: 'identifier', label: 'Identifier', width: 160 }, { key: 'description', label: 'Description' }] },
      { type: 'fields', title: 'Presentation & Incoterms', fields: [
        { key: 'presentationDays', label: 'Presentation Days', gridMd: 6 },
        { key: 'incoterms', label: 'Incoterms', kind: 'select', options: ['CIF', 'FOB', 'CFR'] }
      ] }
    ]
  },
  {
    key: 'linkages', label: 'Linkages', icon: LinkIcon,
    blocks: [
      { type: 'custom', key: 'exposure-cards' },
      { type: 'fields', title: 'Collateral Setup', fields: [
        { key: 'collateralCurrency', label: 'Collateral Currency', kind: 'select', options: ['USD', 'PKR', 'EUR', 'GBP'] },
        { key: 'collateralPercent', label: 'Collateral (%)', kind: 'number' }
      ] },
      { type: 'table', title: 'Collateral Accounts', arrayKey: 'collaterals', addLabel: 'Add Collateral Account',
        newRow: () => ({ id: uuid(), accountNumber: '', balance: 0, contributionPercent: 0, exchangeRate: 1, calculatedAmount: 0 }),
        transform: (r) => ({ ...r, calculatedAmount: (r.balance * r.contributionPercent * r.exchangeRate) / 100 }),
        columns: [
          { key: 'accountNumber', label: 'Account Number' }, { key: 'balance', label: 'Balance', type: 'number', width: 120 },
          { key: 'contributionPercent', label: 'Contribution %', type: 'number', width: 120 }, { key: 'exchangeRate', label: 'Exchange Rate', type: 'number', width: 120 },
          { key: 'calculatedAmount', label: 'Calculated Amount', width: 140, readOnly: true }
        ] },
      { type: 'table', title: 'Margin Accounts', arrayKey: 'margins', addLabel: 'Add Margin Account',
        newRow: () => ({ id: uuid(), accountNumber: '', amount: 0, maturityDate: '' }),
        columns: [{ key: 'accountNumber', label: 'Account Number' }, { key: 'amount', label: 'Amount', type: 'number', width: 140 }, { key: 'maturityDate', label: 'Maturity Date', type: 'date', width: 160 }] }
    ]
  },
  {
    key: 'instructions', label: 'Instructions & Insurance', icon: ForumIcon,
    blocks: [
      { type: 'fields', title: 'Advising Bank', fields: [
        { key: 'advisingBankType', label: 'Advising Bank Type', kind: 'select', options: ['SWIFT', 'NameAddr'] },
        { key: 'advisingBankSwift', label: 'Advising Bank SWIFT' }
      ] },
      { type: 'fields', title: 'Special Payment Conditions', fields: [
        { key: 'specialPaymentConditionsBeneficiary', label: 'To Beneficiary', gridMd: 12, multiline: true, rows: 2 },
        { key: 'specialPaymentConditionsBank', label: 'To Bank', gridMd: 12, multiline: true, rows: 2 }
      ] },
      { type: 'fields', title: 'Confirmation', fields: [
        { key: 'confirmationInstruction', label: 'Confirmation Instruction', kind: 'select', options: ['CONFIRM', 'MAY ADD', 'WITHOUT'] },
        { key: 'requestedConfirmationParty', label: 'Requested Confirmation Party' }
      ] },
      { type: 'fields', title: 'Correspondence', fields: [
        { key: 'senderToReceiverInfo', label: 'Sender to Receiver Info', gridMd: 12, multiline: true, rows: 2 },
        { key: 'chargesDetails', label: 'Charges Details', gridMd: 12, multiline: true, rows: 2 },
        { key: 'selectedInsurancePolicyId', label: 'Insurance Policy ID' }
      ] }
    ]
  },
  {
    key: 'charges', label: 'Charges & Attachments', icon: AttachMoneyIcon,
    blocks: [
      ...(['charges', 'taxes', 'commissions'] as const).map((t): TableBlock => ({
        type: 'table', title: t[0].toUpperCase() + t.slice(1), arrayKey: t, addLabel: `Add ${t.slice(0, -1)}`, showTotal: true,
        newRow: (s: ImportLCApplicationState) => ({ id: uuid(), accountNumber: '', description: '', currency: s.currency, amount: 0 }),
        columns: [
          { key: 'accountNumber', label: 'Account Number' }, { key: 'description', label: 'Description' },
          { key: 'currency', label: 'Currency', width: 100 }, { key: 'amount', label: 'Amount', type: 'number', width: 120 }
        ]
      })),
      { type: 'custom', key: 'attachment' },
      { type: 'fields', title: 'Save as Template', fields: [
        { key: 'saveAsTemplate', label: 'Save as Template', kind: 'switch' },
        { key: 'templateName', label: 'Template Name', visibleIf: (s) => s.saveAsTemplate },
        { key: 'accessType', label: 'Access Type', kind: 'select', options: ['Public', 'Private'], visibleIf: (s) => s.saveAsTemplate }
      ] },
      { type: 'custom', key: 'terms-checkbox' }
    ]
  },
  { key: 'review', label: 'Review', icon: RateReviewIcon, blocks: [{ type: 'custom', key: 'review-summary' }] }
]

const CustomStepIcon = (props: { active?: boolean; completed?: boolean; stepIndex: number }) => {
  const theme = useTheme()
  const Icon = STEP_META[props.stepIndex].icon
  const on = props.completed || props.active
  return (
    <Avatar sx={{
      width: 34, height: 34, bgcolor: on ? theme.palette.primary.main : alpha(theme.palette.text.disabled, 0.15),
      color: on ? '#fff' : theme.palette.text.disabled, transition: 'all 0.25s ease', transform: props.active ? 'scale(1.08)' : 'scale(1)'
    }}>
      {props.completed ? <CheckCircleIcon fontSize="small" /> : <Icon fontSize="small" />}
    </Avatar>
  )
}

// ----------------------------------------------------------------------
// Page
// ----------------------------------------------------------------------

const Page = () => {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [state, setState] = useState<ImportLCApplicationState>(() => buildInitialState(uuid))
  const [draft, setDraft] = useState<SavedDraft | null>(null)
  const [draftToast, setDraftToast] = useState(false)

  useEffect(() => { setDraft(loadDraft()) }, [])

  const set = <K extends keyof ImportLCApplicationState>(key: K, value: ImportLCApplicationState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }))

  const totalExposure = useMemo(() => calculateTotalExposure(state), [state.lcAmount, state.aboveTolerancePercent])
  const requiredCollateral = useMemo(() => calculateRequiredCollateralAmount(state), [state.lcAmount, state.aboveTolerancePercent, state.collateralPercent])

  const handleNext = () => setActiveStep((p) => Math.min(p + 1, STEP_META.length - 1))
  const handleBack = () => setActiveStep((p) => Math.max(p - 1, 0))

  const handleSubmit = () => {
    const result = validateForm(state)
    if (!result.isValid) return setErrors(result.errors)
    setErrors([])
    clearDraft()
    setSubmitted(true)
  }
  const handleSaveDraft = () => { saveDraft(state, activeStep); setDraftToast(true) }
  const handleResumeDraft = () => { if (!draft) return; setState((p) => ({ ...p, ...draft.state })); setActiveStep(draft.activeStep); setDraft(null) }
  const handleDiscardDraft = () => { clearDraft(); setDraft(null) }

  const handleFile = (file: File | null) => {
    if (!file) return
    const check = validateAndAttachFile(file)
    if (!check.success) return setFileError(check.message ?? 'Invalid file.')
    setFileError(null)
    set('attachedFile', file)
  }

  // ---- generic row helpers, shared by every "table" block ----
  const addRow = (key: ArrayKey, factory: (s: ImportLCApplicationState) => any) =>
    set(key as any, [...(state as any)[key], factory(state)])
  const removeRow = (key: ArrayKey, id: string) =>
    set(key as any, (state as any)[key].filter((r: any) => r.id !== id))
  const updateRow = (key: ArrayKey, id: string, patch: any, transform?: (r: any) => any) =>
    set(key as any, (state as any)[key].map((r: any) => (r.id === id ? (transform ? transform({ ...r, ...patch }) : { ...r, ...patch }) : r)))

  const toggleDocument = (id: string) => set('documents', state.documents.map((d) => (d.id === id ? { ...d, selected: !d.selected } : d)))
  const updateDocument = (id: string, patch: { originals?: number; copies?: number }) =>
    set('documents', state.documents.map((d) => (d.id === id ? { ...d, ...patch } : d)))

  // ---- renders a "fields" block ----
  const renderFieldsBlock = (block: FieldsBlock) => (
    <React.Fragment>
      <SectionTitle title={block.title} />
      <Grid container spacing={3}>
        {block.fields.filter((f) => !f.visibleIf || f.visibleIf(state)).map((f) =>
          f.kind === 'switch' ? (
            <Grid item xs={12} md={f.gridMd ?? 4} key={String(f.key)}>
              <FormControlLabel control={<Switch checked={!!state[f.key]} onChange={(e) => set(f.key, e.target.checked as any)} />} label={f.label} />
            </Grid>
          ) : (
            <Field
              key={String(f.key)} label={f.label} value={state[f.key] as any}
              onChange={(v) => set(f.key, (f.kind === 'number' ? Number(v) : v) as any)}
              type={f.kind === 'select' ? 'text' : f.kind ?? 'text'} select={f.kind === 'select'}
              options={f.options} gridMd={f.gridMd} multiline={f.multiline} rows={f.rows}
            />
          )
        )}
      </Grid>
    </React.Fragment>
  )

  // ---- renders a "table" block ----
  const renderTableBlock = (block: TableBlock) => (
    <React.Fragment>
      {block.showTotal ? (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={700}>{block.title}</Typography>
          <Chip size="small" label={`Total: ${calculateTableTotal((state as any)[block.arrayKey]).toLocaleString()}`}
            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 700 }} />
        </Stack>
      ) : (
        <SectionTitle title={block.title} subtitle={block.subtitle} />
      )}
      <EditableTable
        rows={(state as any)[block.arrayKey]}
        onAdd={() => addRow(block.arrayKey, block.newRow)}
        onRemove={(id) => removeRow(block.arrayKey, id)}
        onUpdate={(id, patch) => updateRow(block.arrayKey, id, patch, block.transform)}
        addLabel={block.addLabel}
        columns={block.columns}
      />
    </React.Fragment>
  )

  // ---- one-off blocks that don't fit the generic patterns above ----
  const customBlocks: Record<string, React.ReactNode> = {
    'documents-checklist': (
      <React.Fragment>
        <SectionTitle title="Documents Required" subtitle="Select applicable documents and specify counts." />
        <Table size="small">
          <TableHead>
            <TableRow><TableCell padding="checkbox" /><TableCell>Document</TableCell><TableCell width={110}>Originals</TableCell><TableCell width={110}>Copies</TableCell></TableRow>
          </TableHead>
          <TableBody>
            {state.documents.map((doc) => (
              <TableRow key={doc.id} hover>
                <TableCell padding="checkbox"><Checkbox size="small" checked={doc.selected} onChange={() => toggleDocument(doc.id)} /></TableCell>
                <TableCell>{doc.name}</TableCell>
                <TableCell><TextField size="small" variant="standard" type="number" disabled={!doc.selected} value={doc.originals} onChange={(e) => updateDocument(doc.id, { originals: Number(e.target.value) })} /></TableCell>
                <TableCell><TextField size="small" variant="standard" type="number" disabled={!doc.selected} value={doc.copies} onChange={(e) => updateDocument(doc.id, { copies: Number(e.target.value) })} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </React.Fragment>
    ),
    'exposure-cards': (
      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <Typography variant="caption" color="text.secondary">Total Exposure</Typography>
            <Typography variant="h6" fontWeight={700}>{state.currency} {totalExposure.toLocaleString()}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.08) }}>
            <Typography variant="caption" color="text.secondary">Required Collateral</Typography>
            <Typography variant="h6" fontWeight={700}>{state.collateralCurrency} {requiredCollateral.toLocaleString()}</Typography>
          </Card>
        </Grid>
      </Grid>
    ),
    attachment: (
      <React.Fragment>
        <SectionTitle title="Attachment" subtitle="JPG/JPEG only, max 500KB." />
        <Button component="label" variant="outlined" startIcon={<UploadFileIcon />}>
          {state.attachedFile ? state.attachedFile.name : 'Upload File'}
          <input hidden type="file" accept=".jpg,.jpeg" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
        </Button>
        {fileError && <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>{fileError}</Typography>}
      </React.Fragment>
    ),
    'terms-checkbox': (
      <FormControlLabel control={<Checkbox checked={state.termsAccepted} onChange={(e) => set('termsAccepted', e.target.checked)} />} label="I confirm the above details are accurate and accept the Terms & Conditions." />
    ),
    'review-summary': (
      <React.Fragment>
        <SectionTitle title="Review Application" subtitle="Please check every section carefully before submitting." />
        <SummaryBlock icon={DescriptionIcon} title="LC Details">
          <SummaryItem label="Applicant Name" value={state.applicantName} />
          <SummaryItem label="Accountee Name" value={state.accounteeName} />
          <SummaryItem label="Beneficiary Name" value={state.beneficiaryName} />
          <SummaryItem label="Beneficiary Country" value={state.beneficiaryCountry} />
          <SummaryItem label="LC Type" value={state.lcType} />
          <SummaryItem label="Expiry Date" value={state.expiryDate} />
          <SummaryItem label="Currency" value={state.currency} />
          <SummaryItem label="LC Amount" value={state.lcAmount?.toLocaleString()} />
          <SummaryItem label="Credit Available By" value={state.creditAvailableBy} />
          <SummaryItem label="Drafts" value={state.drafts.length ? `${state.drafts.length} row(s)` : '—'} />
        </SummaryBlock>
        <SummaryBlock icon={LocalShippingIcon} title="Goods & Shipment">
          <SummaryItem label="Partial Shipment" value={state.partialShipment} />
          <SummaryItem label="Trans-Shipment" value={state.transShipment} />
          <SummaryItem label="Port of Loading" value={state.portOfLoading} />
          <SummaryItem label="Port of Discharge" value={state.portOfDischarge} />
          <SummaryItem label={state.shipmentInputType === 'Date' ? 'Latest Shipment Date' : 'Shipment Period'} value={state.shipmentInputType === 'Date' ? state.latestShipmentDate : state.shipmentPeriod} />
          <SummaryItem label="Goods Lines" value={state.goods.length ? `${state.goods.length} item(s)` : '—'} />
        </SummaryBlock>
        <SummaryBlock icon={ArticleIcon} title="Documents & Conditions">
          <SummaryItem label="Documents Selected" value={state.documents.filter((d) => d.selected).length ? state.documents.filter((d) => d.selected).map((d) => d.name).join(', ') : '—'} />
          <SummaryItem label="Additional Conditions" value={state.conditions.length ? `${state.conditions.length} condition(s)` : '—'} />
          <SummaryItem label="Incoterms" value={state.incoterms} />
          <SummaryItem label="Presentation Days" value={state.presentationDays} />
        </SummaryBlock>
        <SummaryBlock icon={LinkIcon} title="Linkages">
          <SummaryItem label="Total Exposure" value={`${state.currency} ${totalExposure.toLocaleString()}`} />
          <SummaryItem label="Required Collateral" value={`${state.collateralCurrency} ${requiredCollateral.toLocaleString()}`} />
          <SummaryItem label="Collateral Accounts" value={state.collaterals.length ? `${state.collaterals.length} account(s)` : '—'} />
          <SummaryItem label="Margin Accounts" value={state.margins.length ? `${state.margins.length} account(s)` : '—'} />
        </SummaryBlock>
        <SummaryBlock icon={ForumIcon} title="Instructions & Insurance">
          <SummaryItem label="Advising Bank SWIFT" value={state.advisingBankSwift} />
          <SummaryItem label="Confirmation Instruction" value={state.confirmationInstruction} />
          <SummaryItem label="Insurance Policy ID" value={state.selectedInsurancePolicyId} />
        </SummaryBlock>
        <SummaryBlock icon={AttachMoneyIcon} title="Charges & Attachments">
          <SummaryItem label="Charges Total" value={calculateTableTotal(state.charges).toLocaleString()} />
          <SummaryItem label="Taxes Total" value={calculateTableTotal(state.taxes).toLocaleString()} />
          <SummaryItem label="Commissions Total" value={calculateTableTotal(state.commissions).toLocaleString()} />
          <SummaryItem label="Attached File" value={state.attachedFile?.name} />
          <SummaryItem label="Save as Template" value={state.saveAsTemplate ? state.templateName || 'Yes' : 'No'} />
          <SummaryItem label="Terms Accepted" value={state.termsAccepted ? 'Yes' : 'No'} />
        </SummaryBlock>
      </React.Fragment>
    )
  }

  if (submitted) {
    return (
      <Card sx={{ borderRadius: 3, textAlign: 'center', py: 10, px: 4 }}>
        <Avatar sx={{ width: 72, height: 72, bgcolor: alpha(SUCCESS_COLOR, 0.12), color: SUCCESS_COLOR, mx: 'auto', mb: 3 }}><CheckCircleIcon fontSize="large" /></Avatar>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>Import LC Application Submitted</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>Reference: {state.customerReferenceNumber || 'Auto-generated on save'}</Typography>
        <Button variant="outlined" onClick={() => { setSubmitted(false); setActiveStep(0); setState(buildInitialState(uuid)) }}>Create Another LC</Button>
      </Card>
    )
  }

  const currentStep = STEP_META[activeStep]

  return (
    <Box>
      {draft && (
        <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }} action={
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={handleResumeDraft}>Resume</Button>
            <Button size="small" color="inherit" onClick={handleDiscardDraft}>Discard</Button>
          </Stack>
        }>
          You have a saved draft from {draft.savedAt}. Resume where you left off?
        </Alert>
      )}

      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" fontWeight={700}>Import Letter of Credit</Typography>
        <Typography variant="body2" color="text.secondary">Step {activeStep + 1} of {STEP_META.length} — {currentStep.label}</Typography>
      </Box>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6, flexWrap: 'wrap', rowGap: 3 }}>
        {STEP_META.map((step, index) => (
          <Step key={step.key}>
            <StepLabel StepIconComponent={(p) => <CustomStepIcon active={p.active} completed={p.completed} stepIndex={index} />}>
              <Typography variant="caption" sx={{ fontWeight: activeStep === index ? 700 : 500 }}>{step.label}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }} onClose={() => setErrors([])}>
          <Stack spacing={0.5}>{errors.map((e) => <Typography variant="body2" key={e}>{e}</Typography>)}</Stack>
        </Alert>
      )}

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          {currentStep.blocks.map((block, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider sx={{ my: 4 }} />}
              {block.type === 'fields' ? renderFieldsBlock(block) : block.type === 'table' ? renderTableBlock(block) : customBlocks[block.key]}
            </React.Fragment>
          ))}

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 5 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack} disabled={activeStep === 0}>Back</Button>
            <Stack direction="row" spacing={2}>
              <Button variant="text" startIcon={<SaveIcon />} onClick={handleSaveDraft}>Save as Draft</Button>
              {activeStep < STEP_META.length - 1 ? (
                <Button variant="contained" disableElevation endIcon={<ArrowForwardIcon />} onClick={handleNext}>Next</Button>
              ) : (
                <Button variant="contained" disableElevation endIcon={<SendIcon />} onClick={handleSubmit} sx={{ bgcolor: SUCCESS_COLOR, '&:hover': { bgcolor: SUCCESS_COLOR, filter: 'brightness(0.92)' } }}>
                  Submit LC Application
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar open={draftToast} autoHideDuration={2500} onClose={() => setDraftToast(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setDraftToast(false)} sx={{ borderRadius: 2 }}>Draft saved — you can safely close this page and resume later.</Alert>
      </Snackbar>
    </Box>
  )
}

Page.acl = { action: 'itsHaveAccess', subject: 'create-lc' }

export default Page