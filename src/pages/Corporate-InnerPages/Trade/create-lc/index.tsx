import React, { useMemo, useState } from 'react'
import {
  Box, Grid, Card, CardContent, Typography, TextField, Button, Divider, Checkbox,
  FormControlLabel, Alert, Stack, Table, TableHead, TableBody, TableRow, TableCell,
  IconButton, Chip, RadioGroup, Radio, Dialog, DialogTitle, DialogContent, DialogActions,
  useTheme, alpha, Stepper, Step, StepLabel, Avatar, ToggleButton, ToggleButtonGroup
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import GavelIcon from '@mui/icons-material/Gavel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DescriptionIcon from '@mui/icons-material/Description'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ScheduleIcon from '@mui/icons-material/Schedule'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ArticleIcon from '@mui/icons-material/Article'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import RuleIcon from '@mui/icons-material/Rule'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import RateReviewIcon from '@mui/icons-material/RateReview'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SendIcon from '@mui/icons-material/Send'
import {
  ImportLCFormState, ACCOUNT_OPTIONS, BENEFICIARY_OPTIONS, COUNTRY_OPTIONS,
  STANDARD_CONDITION_OPTIONS, buildInitialFormState, getToleranceLabels,
  calculateAmountInWords, validateForm
} from './importLcTypes'

const uuid = () => Math.random().toString(36).slice(2, 10)
const SUCCESS_COLOR = '#15804f'
const MAX_ATTACHMENTS = 7
const DRAFT_STORAGE_KEY = 'importLcDraft'

const AVAILABILITY_TYPES = [
  'By Payment (Without Draft)',
  'By Negotiation (Draft / Without Draft)',
  'By Acceptance (Drafts drawn on Nominated Bank / Issuing Bank)',
  'By Deferred Payment (No Drafts required)',
  'By Mixed Payment / UPAS',
]


const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <Box sx={{ mb: 2.5 }}>
    <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
    {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
  </Box>
)

const T = ({ label, value, onChange, required, readOnly, type = 'text', multiline, rows, placeholder, gridMd = 6 }: {
  label: string; value: string; onChange?: (v: string) => void; required?: boolean; readOnly?: boolean
  type?: string; multiline?: boolean; rows?: number; placeholder?: string; gridMd?: number
}) => (
  <Grid item xs={12} md={gridMd}>
    <TextField
      fullWidth size="small" label={required ? `${label} *` : label} value={value}
      onChange={(e) => onChange?.(e.target.value)}
      type={type} multiline={multiline} rows={rows} placeholder={placeholder}
      InputProps={{ readOnly }}
      InputLabelProps={type === 'date' ? { shrink: true } : undefined}
      sx={readOnly ? { '& .MuiInputBase-input': { bgcolor: 'action.hover', color: 'text.secondary' } } : undefined}
    />
  </Grid>
)

const S = ({ label, value, onChange, options, required, placeholder, gridMd = 6 }: {
  label: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]; required?: boolean; placeholder?: string; gridMd?: number
}) => (
  <Grid item xs={12} md={gridMd}>
    <TextField
      fullWidth size="small" select label={required ? `${label} *` : label} value={value}
      onChange={(e) => onChange(e.target.value)}
      SelectProps={{ native: true }} InputLabelProps={{ shrink: true }}
    >
      <option value="" disabled={!!placeholder}>{placeholder ?? `-- Select --`}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </TextField>
  </Grid>
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

// ----------------------------------------------------------------------
// Step configuration (for the Stepper header only — content is rendered
// per-index below, since every step's fields are quite different).
// ----------------------------------------------------------------------

const STEPS = [
  { key: 'basic', label: 'Basic Information', icon: DescriptionIcon },
  { key: 'parties', label: 'Parties & Bank', icon: PeopleAltIcon },
  { key: 'credit', label: 'Credit Details', icon: AttachMoneyIcon },
  { key: 'tenor', label: 'Tenor & Payment', icon: ScheduleIcon },
  { key: 'shipment', label: 'Shipment Routing', icon: LocalShippingIcon },
  { key: 'goods', label: 'Goods & Services', icon: ArticleIcon },
  { key: 'documents', label: 'Documents Required', icon: FactCheckIcon },
  { key: 'conditions', label: 'Additional Conditions', icon: RuleIcon },
  { key: 'attachments', label: 'Attachments & Consent', icon: AttachFileIcon },
  { key: 'review', label: 'Review', icon: RateReviewIcon },
]

const CustomStepIcon = (props: { active?: boolean; completed?: boolean; stepIndex: number }) => {
  const theme = useTheme()
  const Icon = STEPS[props.stepIndex].icon
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
  const [state, setState] = useState<ImportLCFormState>(buildInitialFormState)
  const [errors, setErrors] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [tcModalOpen, setTcModalOpen] = useState(false)
  const [attachDocType, setAttachDocType] = useState('Invoice')
  const [attachFile, setAttachFile] = useState<File | null>(null)
  const [draftSaved, setDraftSaved] = useState(false)

  const set = <K extends keyof ImportLCFormState>(key: K, value: ImportLCFormState[K]) =>
    setState((prev) => {
      const next = { ...prev, [key]: value }

      // Account No -> Applicant auto-fill (mirrors HTML's accountNo change handler)
      if (key === 'accountNumber') {
        const acc = ACCOUNT_OPTIONS.find((a) => a.accountNumber === (value as unknown as string))
        next.accountTitle = acc?.accountTitle ?? ''
        next.applicantName = acc?.applicantName ?? ''
        next.applicantAddress = acc?.applicantAddress ?? ''
        next.applicantPhone = acc?.applicantPhone ?? ''
        next.applicantEmail = acc?.applicantEmail ?? ''
      }

      // Beneficiary select -> Beneficiary + Advising Bank auto-fill
      if (key === 'beneficiaryId') {
        const b = BENEFICIARY_OPTIONS.find((x) => x.id === (value as unknown as string))
        next.beneficiaryCountry = b?.country ?? ''
        next.beneficiaryAddress = b?.address ?? ''
        next.beneficiaryPhone = b?.phone ?? ''
        next.beneficiaryEmail = b?.email ?? ''
        next.advisingBankName = b?.advisingBankName ?? ''
        next.swiftBic = b?.swiftBic ?? ''
        next.advisingBankBicCode = b?.advisingBankBicCode ?? ''
        next.advisingBankAddress = b?.advisingBankAddress ?? ''
        next.advisingBankPhone = b?.advisingBankPhone ?? ''
        next.advisingBankEmail = b?.advisingBankEmail ?? ''
      }

      // LC Amount / Currency -> Amount in Words (live, mirrors HTML's input handler)
      if (key === 'lcAmount' || key === 'lcCurrency') {
        next.amountInWords = calculateAmountInWords(next.lcCurrency, next.lcAmount)
      }

      // Tolerance checkbox off -> clear dependent fields
      if (key === 'toleranceEnabled' && !value) {
        next.toleranceBasis = ''
        next.toleranceInput1 = ''
        next.toleranceInput2 = ''
      }
      if (key === 'toleranceBasis') {
        next.toleranceInput1 = ''
        next.toleranceInput2 = ''
      }

      // At Sight / For Usance toggle -> reset dependent fields when switched
      if (key === 'lcTenorBasis') {
        next.availabilityType = ''
        next.mixedPaymentDetails = ''
        next.usanceOption = ''
        next.usanceUserInputDays = ''
        next.usanceCustomDays = ''
        next.usanceCustomDate = ''
      }
      if (key === 'availabilityType' && value !== 'By Mixed Payment / UPAS') next.mixedPaymentDetails = ''

      return next
    })

  const toleranceLabels = useMemo(() => getToleranceLabels(state.toleranceBasis), [state.toleranceBasis])

  const toggleStandardCondition = (value: string) =>
    set('standardConditions', state.standardConditions.includes(value)
      ? state.standardConditions.filter((c) => c !== value)
      : [...state.standardConditions, value])

  const handleAttach = () => {
    if (!attachFile) return
    if (state.attachments.length >= MAX_ATTACHMENTS) return
    set('attachments', [...state.attachments, {
      id: uuid(), docType: attachDocType, fileName: attachFile.name,
      fileSize: `${(attachFile.size / 1024).toFixed(1)} KB`, file: attachFile
    }])
    setAttachFile(null)
  }
  const removeAttachment = (id: string) => set('attachments', state.attachments.filter((a) => a.id !== id))

  const acceptTerms = () => { set('termsAccepted', true); setTcModalOpen(false) }

  const handleSaveDraft = () => {
    try {
      // NOTE: replace with an actual "save draft" API call once the backend
      // endpoint is available — attachments (File objects) are stripped
      // out here since they can't be serialized to JSON/localStorage.
      const { attachments, ...rest } = state
      const draftPayload = {
        ...rest,
        attachments: attachments.map(({ file, ...meta }) => meta),
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftPayload))
      setDraftSaved(true)
      setTimeout(() => setDraftSaved(false), 3000)
    } catch (e) {
      console.error('Failed to save draft', e)
    }
  }

  const handleNext = () => setActiveStep((p) => Math.min(p + 1, STEPS.length - 1))
  const handleBack = () => setActiveStep((p) => Math.max(p - 1, 0))

  const handleSubmit = () => {
    const result = validateForm(state)
    if (!result.isValid) { setErrors(result.errors); return }
    setErrors([])
    setSubmitted(true)
  }

  const beneficiaryLabel = BENEFICIARY_OPTIONS.find((b) => b.id === state.beneficiaryId)?.label ?? ''
  const countryLabel = COUNTRY_OPTIONS.find((c) => c.value === state.beneficiaryCountry)?.label ?? ''

  if (submitted) {
    return (
      <Card sx={{ borderRadius: 3, textAlign: 'center', py: 10, px: 4 }}>
        <Avatar sx={{ width: 72, height: 72, bgcolor: alpha(SUCCESS_COLOR, 0.12), color: SUCCESS_COLOR, mx: 'auto', mb: 3 }}>
          <CheckCircleIcon fontSize="large" />
        </Avatar>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>LC Application Submitted Successfully</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>Your Corporate Letter of Credit application has been validated and submitted.</Typography>
        <Button variant="outlined" onClick={() => { setSubmitted(false); setState(buildInitialFormState()); setErrors([]); setActiveStep(0) }}>Create Another Application</Button>
      </Card>
    )
  }

  return (
    <Box>
      {/* ---------------- Header (plain, no color block) ---------------- */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>Corporate Letter of Credit (LC) Application</Typography>
        <Typography variant="body2" color="text.secondary">
          Application for Irrevocable Documentary Credit — Step {activeStep + 1} of {STEPS.length}: {STEPS[activeStep].label}
        </Typography>
      </Box>

      {/* ---------------- Stepper ---------------- */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5, flexWrap: 'wrap', rowGap: 3 }}>
        {STEPS.map((step, index) => (
          <Step key={step.key}>
            <StepLabel StepIconComponent={(p) => <CustomStepIcon active={p.active} completed={p.completed} stepIndex={index} />}>
              <Typography variant="caption" sx={{ fontWeight: activeStep === index ? 700 : 500 }}>{step.label}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrors([])}>
          <Stack spacing={0.5}>{errors.map((e) => <Typography variant="body2" key={e}>{e}</Typography>)}</Stack>
        </Alert>
      )}

      {draftSaved && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setDraftSaved(false)}>
          Draft saved successfully.
        </Alert>
      )}

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 5 } }}>

          {/* ================= STEP 0: Basic Information ================= */}
          {activeStep === 0 && (
            <React.Fragment>
              <SectionTitle title="Basic Information" />
              <Grid container spacing={2.5}>
                <T label="Branch" value={state.branch} readOnly required gridMd={4} />
                <T label="LC Number" value={state.lcNumber} readOnly placeholder="Auto-generated on posting" gridMd={4} />
                <T label="Date of Application" value={state.applicationDate} readOnly required type="date" gridMd={4} />

                <S label="Account Number" value={state.accountNumber} onChange={(v) => set('accountNumber', v)} required gridMd={4}
                  placeholder="-- Select Account (LOV) --"
                  options={ACCOUNT_OPTIONS.map((a) => ({ value: a.accountNumber, label: a.label }))} />
                <T label="Title of Account" value={state.accountTitle} readOnly placeholder="Autofills from Account" gridMd={4} />
                <T label="Date of Expiry" value={state.expiryDate} onChange={(v) => set('expiryDate', v)} required type="date" gridMd={4} />

                <T label="Place of Expiry (Negotiation in Beneficiary Country)" value={state.placeOfExpiry}
                  onChange={(v) => set('placeOfExpiry', v)} required placeholder="e.g. Shanghai, China" gridMd={12} />
              </Grid>
            </React.Fragment>
          )}

          {/* ================= STEP 1: Applicant, Beneficiary & Advising Bank ================= */}
          {activeStep === 1 && (
            <React.Fragment>
              <SectionTitle title="Applicant, Beneficiary & Advising Bank Information" />

              <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mb: 1.5 }}>Applicant Details</Typography>
              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <T label="Applicant's Name" value={state.applicantName} readOnly required placeholder="Fetched from Account Title" />
                <T label="Full Address" value={state.applicantAddress} readOnly required placeholder="Fetched from Account Master" />
                <T label="Telephone Number" value={state.applicantPhone} readOnly required placeholder="+92-21-35550199" />
                <T label="Email Address" value={state.applicantEmail} readOnly required placeholder="trade@alphatrading.com" />
              </Grid>

              <Divider sx={{ mb: 3 }} />
              <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mb: 1.5 }}>Beneficiary Details</Typography>
              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <S label="Beneficiary's Name" value={state.beneficiaryId} onChange={(v) => set('beneficiaryId', v)} required
                  placeholder="-- Select Beneficiary (LOV) --"
                  options={BENEFICIARY_OPTIONS.map((b) => ({ value: b.id, label: b.label }))} />
                <S label="Country of Beneficiary" value={state.beneficiaryCountry} onChange={(v) => set('beneficiaryCountry', v)} required
                  placeholder="-- Select Country (LOV) --" options={COUNTRY_OPTIONS} />
                <T label="Beneficiary Full Address" value={state.beneficiaryAddress} readOnly required multiline rows={2}
                  placeholder="Auto-fills from Beneficiary Setup" gridMd={12} />
                <T label="Telephone Number" value={state.beneficiaryPhone} readOnly required placeholder="Auto-fills from Beneficiary Setup" />
                <T label="Email Address" value={state.beneficiaryEmail} readOnly required placeholder="Auto-fills from Beneficiary Setup" />
              </Grid>

              <Divider sx={{ mb: 3 }} />
              <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mb: 1.5 }}>Advising Bank Details</Typography>
              <Grid container spacing={2.5}>
                <T label="Advising Bank Name" value={state.advisingBankName} readOnly required placeholder="Auto-fills from Beneficiary Setup" gridMd={4} />
                <T label="SWIFT Code" value={state.swiftBic} readOnly required placeholder="Bank SWIFT Identifier" gridMd={4} />
                <T label="Advising Bank BIC Code" value={state.advisingBankBicCode} readOnly required placeholder="Enter or autofill BIC Code" gridMd={4} />
                <T label="Advising Bank Full Address" value={state.advisingBankAddress} readOnly required multiline rows={2}
                  placeholder="Auto-fills from Beneficiary Setup" gridMd={12} />
                <T label="Telephone Number" value={state.advisingBankPhone} readOnly placeholder="Auto-fills from Beneficiary Setup" />
                <T label="Email Address" value={state.advisingBankEmail} readOnly placeholder="Auto-fills from Beneficiary Setup" />
              </Grid>
            </React.Fragment>
          )}

          {/* ================= STEP 2: Documentary Credit Details ================= */}
          {activeStep === 2 && (
            <React.Fragment>
              <SectionTitle title="Documentary Credit Details" />
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <Stack direction="row" spacing={1}>
                    <TextField select size="small" label="Currency *" value={state.lcCurrency} onChange={(e) => set('lcCurrency', e.target.value)}
                      SelectProps={{ native: true }} sx={{ width: 130 }}>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="PKR">PKR</option>
                    </TextField>
                    <TextField fullWidth size="small" label="Amount *" placeholder="0.00" value={state.lcAmount}
                      onChange={(e) => { const v = e.target.value; if (/^-?\d*\.?\d*$/.test(v)) set('lcAmount', v) }} />
                  </Stack>
                </Grid>
                <T label="Amount in Words" value={state.amountInWords} readOnly placeholder="Auto-converted from Figures" />

                <Grid item xs={12}>
                  <Divider sx={{ my: 1.5 }} />
                  <FormControlLabel
                    control={<Checkbox checked={state.toleranceEnabled} onChange={(e) => set('toleranceEnabled', e.target.checked)} />}
                    label={<Typography fontWeight={600}>Tolerance Allowed</Typography>}
                  />
                </Grid>

                {state.toleranceEnabled && (
                  <Grid item xs={12}>
                    <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), borderLeft: `3px solid ${theme.palette.primary.main}`, borderRadius: 1, p: 2 }}>
                      <Grid container spacing={2}>
                        <S label="Tolerance Basis" value={state.toleranceBasis} onChange={(v) => set('toleranceBasis', v as any)} required
                          placeholder="-- Select Option --" gridMd={12}
                          options={[
                            { value: 'lc_amount', label: '1) LC Amount' },
                            { value: 'quantity_goods', label: '2) Quantity of Goods' },
                            { value: 'unit_price', label: '3) Unit Price' },
                            { value: 'not_exceeding', label: '4) Not Exceeding' },
                          ]} />
                        <T label={toleranceLabels.label1} value={state.toleranceInput1} onChange={(v) => set('toleranceInput1', v)}
                          required placeholder="Enter value" gridMd={6} />
                        {toleranceLabels.showInput2 && (
                          <T label={toleranceLabels.label2} value={state.toleranceInput2} onChange={(v) => set('toleranceInput2', v)}
                            required placeholder="Enter value" gridMd={6} />
                        )}
                      </Grid>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </React.Fragment>
          )}

          {/* ================= STEP 3: Credit Tenor, Payment & Financial Instrumentation ================= */}
          {activeStep === 3 && (
            <React.Fragment>
              <SectionTitle title="Credit Tenor, Payment & Financial Instrumentation" />
              <Grid container spacing={2.5} sx={{ mb: 1 }}>
                <S label="Credit is Available With" value={state.creditAvailableWith} onChange={(v) => set('creditAvailableWith', v)} required
                  placeholder="-- Select Available With --" gridMd={12}
                  options={[
                    { value: 'Advising Bank', label: 'Advising Bank' },
                    { value: 'Issuing Bank', label: 'Issuing Bank' },
                    { value: 'Nominated Bank', label: 'Nominated Bank' },
                    { value: 'Any Bank', label: 'Any Bank' },
                  ]} />
              </Grid>

              {/* At Sight / For Usance selector */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Credit Tenor *</Typography>
                <ToggleButtonGroup
                  exclusive value={state.lcTenorBasis || null}
                  onChange={(_, v) => v && set('lcTenorBasis', v)}
                  sx={{
                    '& .MuiToggleButton-root': {
                      px: 4, py: 1, textTransform: 'none', fontWeight: 600, borderRadius: 2,
                      '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }
                    }
                  }}
                >
                  <ToggleButton value="At Sight">At Sight</ToggleButton>
                  <ToggleButton value="For Usance">For Usance</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Availability Type — shown once At Sight or For Usance is picked */}
              {state.lcTenorBasis && (
                <Box sx={{ mt: 3, bgcolor: alpha(theme.palette.primary.main, 0.03), border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`, borderRadius: 2, p: 2.5 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>Availability Type *</Typography>
                  <RadioGroup value={state.availabilityType} onChange={(e) => set('availabilityType', e.target.value)}>
                    <Stack spacing={1}>
                      {AVAILABILITY_TYPES.map((label) => (
                        <FormControlLabel key={label} value={label} control={<Radio size="small" />} label={label} />
                      ))}
                    </Stack>
                  </RadioGroup>

                  {state.availabilityType === 'By Mixed Payment / UPAS' && (
                    <Box sx={{ mt: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderLeft: `3px solid ${theme.palette.primary.main}`, borderRadius: 1, p: 2 }}>
                      <TextField fullWidth size="small" multiline rows={3} label="Mixed Payment / UPAS Details *"
                        placeholder="Enter terms for mixed payment structure or UPAS details..."
                        value={state.mixedPaymentDetails} onChange={(e) => set('mixedPaymentDetails', e.target.value)} />
                    </Box>
                  )}
                </Box>
              )}

              {/* Tenor of Payment — only relevant for Usance */}
              {state.lcTenorBasis === 'For Usance' && (
                <Box sx={{ mt: 3, bgcolor: alpha(theme.palette.primary.main, 0.03), border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`, borderRadius: 2, p: 2.5 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>Tenor of Payment (For Usance) *</Typography>
                  <RadioGroup value={state.usanceOption} onChange={(e) => set('usanceOption', e.target.value)}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <FormControlLabel value="Days From User Input" control={<Radio size="small" />} label="Days From" />
                        <TextField size="small" placeholder="Days" sx={{ width: 100 }} value={state.usanceUserInputDays}
                          onChange={(e) => set('usanceUserInputDays', e.target.value)} />
                      </Stack>
                      <FormControlLabel value="B/L Date" control={<Radio size="small" />} label="B/L Date" />
                      <FormControlLabel value="AWB Date" control={<Radio size="small" />} label="AWB Date" />
                      <FormControlLabel value="Truck Receipt Date" control={<Radio size="small" />} label="Truck Receipt Date" />
                      <FormControlLabel value="Invoice Date" control={<Radio size="small" />} label="Invoice Date" />
                      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                        <FormControlLabel value="Custom Date Period" control={<Radio size="small" />} label="At" />
                        <TextField size="small" placeholder="Days" sx={{ width: 90 }} value={state.usanceCustomDays}
                          onChange={(e) => set('usanceCustomDays', e.target.value)} />
                        <Typography variant="body2">days after / from</Typography>
                        <TextField size="small" type="date" InputLabelProps={{ shrink: true }} sx={{ width: 170 }}
                          value={state.usanceCustomDate} onChange={(e) => set('usanceCustomDate', e.target.value)} />
                      </Stack>
                    </Stack>
                  </RadioGroup>
                </Box>
              )}
            </React.Fragment>
          )}

          {/* ================= STEP 4: Incoterms & Shipment Routing ================= */}
          {activeStep === 4 && (
            <React.Fragment>
              <SectionTitle title="Incoterms & Shipment Routing (2020) " />
              <Grid container spacing={2.5}>
                <S label="For Any Mode(s) of Transport" value={state.incotermsAnyMode}
                  onChange={(v) => set('incotermsAnyMode', v)} placeholder="-- Select Any Mode Rule (LOV) --"
                  options={['EXW - Ex Works', 'FCA - Free Carrier', 'CPT - Carriage Paid To', 'CIP - Carriage and Insurance Paid To', 'DAP - Delivered at Place', 'DPU - Delivered at Place Unloaded', 'DDP - Delivered Duty Paid']
                    .map((l) => ({ value: l.split(' - ')[0], label: l }))} />
                <S label="For Sea / Inland Waterway Transport" value={state.incotermsSeaMode}
                  onChange={(v) => set('incotermsSeaMode', v)} placeholder="-- Select Sea / Waterway Rule (LOV) --"
                  options={['FAS - Free Alongside Ship', 'FOB - Free On Board', 'CFR - Cost and Freight', 'CIF - Cost, Insurance and Freight']
                    .map((l) => ({ value: l.split(' - ')[0], label: l }))} />

                <T label="Shipment From" value={state.shipmentFrom} onChange={(v) => set('shipmentFrom', v)} required placeholder="e.g. Port of Karachi, Pakistan" />
                <T label="Shipment To" value={state.shipmentTo} onChange={(v) => set('shipmentTo', v)} required placeholder="e.g. Port of Shanghai, China" />

                <S label="Mode of Shipment" value={state.modeOfShipment} onChange={(v) => set('modeOfShipment', v)} required
                  placeholder="-- Select Mode --" gridMd={4}
                  options={[{ value: 'Sea', label: 'Sea' }, { value: 'Air', label: 'Air' }, { value: 'Road', label: 'Road' }]} />

                <Grid item xs={12} md={4}>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>Partial Shipment *</Typography>
                  <RadioGroup row value={state.partialShipment} onChange={(e) => set('partialShipment', e.target.value as any)}>
                    <FormControlLabel value="Allowed" control={<Radio size="small" />} label="Allowed" />
                    <FormControlLabel value="Not Allowed" control={<Radio size="small" />} label="Not Allowed" />
                  </RadioGroup>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>Transshipment *</Typography>
                  <RadioGroup row value={state.transshipment} onChange={(e) => set('transshipment', e.target.value as any)}>
                    <FormControlLabel value="Allowed" control={<Radio size="small" />} label="Allowed" />
                    <FormControlLabel value="Not Allowed" control={<Radio size="small" />} label="Not Allowed" />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>Bill of Exchange Required *</Typography>
                  <RadioGroup row value={state.billOfExchange} onChange={(e) => set('billOfExchange', e.target.value as any)}>
                    <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
                    <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                  </RadioGroup>
                  {state.billOfExchange === 'Yes' && (
                    <Box sx={{ mt: 1, bgcolor: alpha(theme.palette.primary.main, 0.04), borderLeft: `3px solid ${theme.palette.primary.main}`, borderRadius: 1, p: 2 }}>
                      <TextField fullWidth size="small" select label="Drawn On (LOV) *" value={state.drawnOnBank}
                        onChange={(e) => set('drawnOnBank', e.target.value)} SelectProps={{ native: true }}
                        InputLabelProps={{ shrink: true }}>
                        <option value="">-- Select Bank --</option>
                        {['Issuing Bank', 'Confirming Bank', 'Reimbursing Bank', 'Nominated Bank'].map((o) => <option key={o} value={o}>{o}</option>)}
                      </TextField>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>Forward Exchange Cover *</Typography>
                  <RadioGroup row value={state.forwardCover} onChange={(e) => set('forwardCover', e.target.value as any)}>
                    <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
                    <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                  </RadioGroup>
                  {state.forwardCover === 'Yes' && (
                    <Box sx={{ mt: 1, bgcolor: alpha(theme.palette.primary.main, 0.04), borderLeft: `3px solid ${theme.palette.primary.main}`, borderRadius: 1, p: 2 }}>
                      <TextField fullWidth size="small" label="Tenor of Forward Contract (Optional &/or Fixed Period Details) *"
                        placeholder="Enter details of optional or fixed period" value={state.tenorForwardContract}
                        onChange={(e) => set('tenorForwardContract', e.target.value)} />
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mb: 1.5 }}>In case of multimodal transport document only</Typography>
                </Grid>
                <T label="Place of Taking in Charge of Goods" value={state.placeOfTakingInCharge} onChange={(v) => set('placeOfTakingInCharge', v)} placeholder="Enter place of taking in charge" />
                <T label="Port of Loading" value={state.portOfLoading} onChange={(v) => set('portOfLoading', v)} placeholder="Enter port of loading" />
                <T label="Port of Discharge" value={state.portOfDischarge} onChange={(v) => set('portOfDischarge', v)} placeholder="Enter port of discharge" />
                <T label="Place of Final Destination" value={state.placeOfFinalDestination} onChange={(v) => set('placeOfFinalDestination', v)} placeholder="Enter place of final destination" />
              </Grid>
            </React.Fragment>
          )}

          {/* ================= STEP 5: Description of Goods and/or Services ================= */}
          {activeStep === 5 && (
            <React.Fragment>
              <SectionTitle title="Description of Goods and/or Services" />
              <Grid container spacing={2.5}>
                {/* <T label="HS Code (Harmonized System)" value={state.hsCode} onChange={(v) => set('hsCode', v)} required placeholder="e.g. 8471.3000" gridMd={4} /> */}
                <T label="Proforma Invoice / Contract No" value={state.proformaInvoiceNo} onChange={(v) => set('proformaInvoiceNo', v)} required placeholder="e.g. PFI-2026-8891" gridMd={4} />
                <T label="Proforma Invoice Date" value={state.proformaDate} onChange={(v) => set('proformaDate', v)} required type="date" gridMd={4} />
                <T label="Description of Goods / Services" value={state.goodsDescription} onChange={(v) => set('goodsDescription', v)} required
                  multiline rows={5} placeholder="Provide complete specifications, quantities, unit prices, and descriptions of goods or services..." gridMd={12} />
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Must strictly match the trade agreement without conflicting conditions.</Typography>
                </Grid>
              </Grid>
            </React.Fragment>
          )}

          {/* ================= STEP 6: Documents Required & Transport Details ================= */}
          {activeStep === 6 && (
            <React.Fragment>
              <SectionTitle title="Documents Required & Transport Details" />
              <Stack spacing={2.5}>
                <Box>
                  <FormControlLabel control={<Checkbox checked={state.docInvoiceToggle} onChange={(e) => set('docInvoiceToggle', e.target.checked)} />} label="Signed Commercial Invoice" />
                  {state.docInvoiceToggle && (
                    <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ pl: 4, mt: 1 }}>
                      <TextField size="small" type="number" label="In Original" placeholder="3" sx={{ width: 120 }} value={state.invoiceOriginals} onChange={(e) => set('invoiceOriginals', e.target.value)} />
                      <TextField size="small" type="number" label="And Copies" placeholder="3" sx={{ width: 120 }} value={state.invoiceCopies} onChange={(e) => set('invoiceCopies', e.target.value)} />
                      <TextField size="small" label="ORIGIN" placeholder="e.g. China" sx={{ width: 180 }} value={state.invoiceOrigin} onChange={(e) => set('invoiceOrigin', e.target.value)} />
                    </Stack>
                  )}
                </Box>

                <Box>
                  <FormControlLabel control={<Checkbox checked={state.docInsuranceToggle} onChange={(e) => set('docInsuranceToggle', e.target.checked)} />} label="Insurance Policy / Certificate" />
                  {state.docInsuranceToggle && (
                    <Typography variant="caption" color="text.secondary" sx={{ pl: 4, display: 'block' }}>Covering All Risks for 110% of Invoice Value</Typography>
                  )}
                </Box>

                <Box>
                  <FormControlLabel control={<Checkbox checked={state.docOriginToggle} onChange={(e) => set('docOriginToggle', e.target.checked)} />} label="Certificate of Origin" />
                  {state.docOriginToggle && (
                    <Stack direction="row" spacing={2} sx={{ pl: 4, mt: 1 }}>
                      <TextField size="small" label="Issued by" placeholder="Chamber of Commerce" sx={{ width: 260 }} value={state.originIssuer} onChange={(e) => set('originIssuer', e.target.value)} />
                    </Stack>
                  )}
                </Box>

                <Box>
                  <FormControlLabel control={<Checkbox checked={state.docPackingToggle} onChange={(e) => set('docPackingToggle', e.target.checked)} />} label="Packing List" />
                  {state.docPackingToggle && (
                    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ pl: 4, mt: 1 }}>
                      <Typography variant="body2">Packing list in</Typography>
                      <TextField size="small" type="number" placeholder="3" sx={{ width: 90 }} value={state.packingOriginals} onChange={(e) => set('packingOriginals', e.target.value)} />
                      <Typography variant="body2">original and</Typography>
                      <TextField size="small" type="number" placeholder="3" sx={{ width: 90 }} value={state.packingCopies} onChange={(e) => set('packingCopies', e.target.value)} />
                      <Typography variant="body2">copies</Typography>
                    </Stack>
                  )}
                </Box>

                <FormControlLabel
                  control={<Checkbox checked={state.docBolToggle} onChange={(e) => set('docBolToggle', e.target.checked)} />}
                  label={<Typography variant="body2">
                    Full set of clean &ldquo;shipped on board&rdquo; original Marine/Ocean Bill(s) of Lading drawn/made out or endorsed to the order of Bank Al Habib Ltd. Blank Endorsed marked freight prepaid/freight collect i.e. payable at destination (inclusive of all costs) and notify applicant and issuing bank. Full set of clean &ldquo;on board&rdquo; original Multimodal/Combined transport document drawn/made out or endorsed to the order of Bank Al Habib Ltd. Blank Endorsed marked freight prepaid/freight collect i.e. payable at destination (inclusive of all costs) and notify applicant and issuing bank.
                  </Typography>}
                />

                <FormControlLabel
                  control={<Checkbox checked={state.docAwbToggle} onChange={(e) => set('docAwbToggle', e.target.checked)} />}
                  label={<Typography variant="body2">
                    Original Airway Bill (for consignor/shipper) bearing this Credit number, showing Flight number, dispatch date, marked Freight prepaid/freight collect and evidencing goods consigned or endorsed to the order of Bank Al Habib Ltd. Blank Endorsed marked and notify applicant and the airport of departure and the airport of destination.
                  </Typography>}
                />

                <Box>
                  <FormControlLabel
                    control={<Checkbox checked={state.docTruckReceiptToggle} onChange={(e) => set('docTruckReceiptToggle', e.target.checked)} />}
                    label={<Typography variant="body2" component="span">
                      Original Truck Receipt/Consignment Note Rail Way Receipt/Post Parcel Receipt showing goods consigned to Bank AL Habib Ltd. Blank Endorsed Others{' '}
                      <TextField size="small" variant="standard" placeholder="Specify other receipt type" sx={{ width: 200, verticalAlign: 'middle', mx: 1 }}
                        value={state.docOthersInput} onChange={(e) => set('docOthersInput', e.target.value)} onClick={(e) => e.stopPropagation()} />
                      {' '}marked freight prepaid/freight collect i.e. payable at destination and notify applicant and issuing bank evidencing that goods have been received for shipment/dispatch/carriage.
                    </Typography>}
                  />
                </Box>
              </Stack>
            </React.Fragment>
          )}

          {/* ================= STEP 7: Additional Conditions & Specifications ================= */}
          {activeStep === 7 && (
            <React.Fragment>
              <SectionTitle title="Additional Conditions & Specifications" />
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Standard LC Conditions & Clauses</Typography>
              <Stack spacing={1.5} sx={{ mb: 1 }}>
                {STANDARD_CONDITION_OPTIONS.map((c) => (
                  <FormControlLabel key={c.value}
                    control={<Checkbox checked={state.standardConditions.includes(c.value)} onChange={() => toggleStandardCondition(c.value)} />}
                    label={<Typography variant="body2">{c.text}</Typography>} />
                ))}

                <Box>
                  <FormControlLabel
                    control={<Checkbox checked={state.presentationDaysToggle} onChange={(e) => set('presentationDaysToggle', e.target.checked)} />}
                    label={<Typography variant="body2">6. Documents to be presented within the validity of the credit (LC) but not later than</Typography>} />
                  {state.presentationDaysToggle && (
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ pl: 4, mt: 1 }}>
                      <TextField size="small" type="number" placeholder="Days" sx={{ width: 100 }} value={state.presentationDays} onChange={(e) => set('presentationDays', e.target.value)} />
                      <Typography variant="body2">days after the date of shipment.</Typography>
                    </Stack>
                  )}
                </Box>

                <Box sx={{ pt: 1.5, borderTop: '1px dashed', borderColor: 'divider' }}>
                  <FormControlLabel
                    control={<Checkbox checked={state.confirmationToggle} onChange={(e) => set('confirmationToggle', e.target.checked)} />}
                    label={<Typography variant="body2" fontWeight={600}>7. Confirmation:</Typography>} />
                  {state.confirmationToggle && (
                    <RadioGroup row sx={{ pl: 4, mt: 1 }} value={state.confirmationInstruction} onChange={(e) => set('confirmationInstruction', e.target.value as any)}>
                      <FormControlLabel value="Without" control={<Radio size="small" />} label="Without" />
                      <FormControlLabel value="Confirm" control={<Radio size="small" />} label="Confirm" />
                      <FormControlLabel value="May Add" control={<Radio size="small" />} label="May Add" />
                    </RadioGroup>
                  )}
                </Box>

                <Box sx={{ pt: 1.5, borderTop: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Bank Charges & Fees Allocation (For Account of):</Typography>

                  <Box sx={{ mb: 1.5 }}>
                    <FormControlLabel control={<Checkbox checked={state.confChargesToggle} onChange={(e) => set('confChargesToggle', e.target.checked)} />} label="Confirmation and Confirmation Charges" />
                    {state.confChargesToggle && (
                      <RadioGroup row sx={{ pl: 4 }} value={state.confirmationCharges} onChange={(e) => set('confirmationCharges', e.target.value as any)}>
                        <FormControlLabel value="applicant" control={<Radio size="small" />} label="Applicant" />
                        <FormControlLabel value="beneficiary" control={<Radio size="small" />} label="Beneficiary" />
                      </RadioGroup>
                    )}
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <FormControlLabel control={<Checkbox checked={state.foreignChargesToggle} onChange={(e) => set('foreignChargesToggle', e.target.checked)} />} label="Foreign Banks Charges" />
                    {state.foreignChargesToggle && (
                      <RadioGroup row sx={{ pl: 4 }} value={state.foreignBanksCharges} onChange={(e) => set('foreignBanksCharges', e.target.value as any)}>
                        <FormControlLabel value="applicant" control={<Radio size="small" />} label="Applicant" />
                        <FormControlLabel value="beneficiary" control={<Radio size="small" />} label="Beneficiary" />
                      </RadioGroup>
                    )}
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <FormControlLabel control={<Checkbox checked={state.reimbursingChargesToggle} onChange={(e) => set('reimbursingChargesToggle', e.target.checked)} />} label="Reimbursing Bank Charges" />
                    {state.reimbursingChargesToggle && (
                      <RadioGroup row sx={{ pl: 4 }} value={state.reimbursingBankCharges} onChange={(e) => set('reimbursingBankCharges', e.target.value as any)}>
                        <FormControlLabel value="applicant" control={<Radio size="small" />} label="Applicant" />
                        <FormControlLabel value="beneficiary" control={<Radio size="small" />} label="Beneficiary" />
                      </RadioGroup>
                    )}
                  </Box>

                  <Box>
                    <FormControlLabel control={<Checkbox checked={state.discrepancyFeeToggle} onChange={(e) => set('discrepancyFeeToggle', e.target.checked)} />} label="Discrepancy fee" />
                    {state.discrepancyFeeToggle && (
                      <RadioGroup row sx={{ pl: 4 }} value={state.discrepancyFee} onChange={(e) => set('discrepancyFee', e.target.value as any)}>
                        <FormControlLabel value="applicant" control={<Radio size="small" />} label="Applicant" />
                        <FormControlLabel value="beneficiary" control={<Radio size="small" />} label="Beneficiary" />
                      </RadioGroup>
                    )}
                  </Box>
                </Box>
              </Stack>

              <Grid container spacing={2.5} sx={{ mt: 1 }}>
                <T label="Other (Specify) [Text Box]" value={state.otherSpecify} onChange={(v) => set('otherSpecify', v)}
                  multiline rows={3} placeholder="Enter any additional specifications or special instructions..." gridMd={12} />
                <T label="Special Instructions / LC Conditions" value={state.additionalConditions} onChange={(v) => set('additionalConditions', v)}
                  multiline rows={3} placeholder="e.g. All banking charges outside issuing bank are for beneficiary account." gridMd={12} />
              </Grid>
            </React.Fragment>
          )}

          {/* ================= STEP 8: Attachments & Consent ================= */}
          {activeStep === 8 && (
            <React.Fragment>
              <SectionTitle title="Supporting Document Attachments" />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'flex-end' }}
                sx={{ mb: 1, p: 2, bgcolor: alpha(theme.palette.text.primary, 0.03), borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
                <TextField select size="small" label="Document Type" value={attachDocType} onChange={(e) => setAttachDocType(e.target.value)} sx={{ minWidth: 200 }} SelectProps={{ native: true }}>
                  {['Invoice', 'Bill of Payment', 'Bill of Lading', 'Insurance Certificate', 'Packing List', 'Other'].map((o) => <option key={o} value={o}>{o}</option>)}
                </TextField>
                <Button component="label" variant="outlined" startIcon={<UploadFileIcon />} disabled={state.attachments.length >= MAX_ATTACHMENTS}>
                  {attachFile ? attachFile.name : 'Select File'}
                  <input hidden type="file" onChange={(e) => setAttachFile(e.target.files?.[0] ?? null)} disabled={state.attachments.length >= MAX_ATTACHMENTS} />
                </Button>
                <Button variant="contained" disableElevation onClick={handleAttach} disabled={!attachFile || state.attachments.length >= MAX_ATTACHMENTS}>+ Attach Document</Button>
              </Stack>

              <Typography variant="caption" color={state.attachments.length >= MAX_ATTACHMENTS ? 'error' : 'text.secondary'} sx={{ display: 'block', mb: 2 }}>
                {state.attachments.length} / {MAX_ATTACHMENTS} documents attached
                {state.attachments.length >= MAX_ATTACHMENTS ? ' — maximum reached, remove a document to add another.' : ''}
              </Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={40}>#</TableCell><TableCell>Document Type</TableCell><TableCell>File Name</TableCell>
                    <TableCell>Size</TableCell><TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.attachments.length === 0 && (
                    <TableRow><TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>No documents attached yet. Use the upload bar above to attach files.</Typography>
                    </TableCell></TableRow>
                  )}
                  {state.attachments.map((a, i) => (
                    <TableRow key={a.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell><Chip size="small" label={a.docType} /></TableCell>
                      <TableCell>{a.fileName}</TableCell>
                      <TableCell>{a.fileSize}</TableCell>
                      <TableCell align="right"><IconButton size="small" onClick={() => removeAttachment(a.id)}><DeleteOutlineIcon fontSize="small" color="error" /></IconButton></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Divider sx={{ my: 4 }} />

              <Box sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.06), border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 2, p: 2.5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2
              }}>
                <FormControlLabel
                  control={<Checkbox checked={state.termsAccepted} disabled onChange={() => { }} />}
                  label={<Typography variant="body2">
                    I / We have read, understood, and accept the standard{' '}
                    <Button size="small" onClick={() => setTcModalOpen(true)} sx={{ p: 0, minWidth: 0, verticalAlign: 'baseline', textDecoration: 'underline' }}>Terms & Conditions</Button>
                    {' '}for Letter of Credit issuance.
                  </Typography>}
                />
                {!state.termsAccepted && <Typography variant="caption" color="error" fontWeight={600}>(Must review T&Cs to accept)</Typography>}
              </Box>
            </React.Fragment>
          )}

          {/* ================= STEP 9: Review ================= */}
          {activeStep === 9 && (
            <React.Fragment>
              <SectionTitle title="Review Application" subtitle="Please check every section carefully before submitting." />

              <SummaryBlock icon={DescriptionIcon} title="Basic Information">
                <SummaryItem label="Branch" value={state.branch} />
                <SummaryItem label="LC Number" value={state.lcNumber} />
                <SummaryItem label="Date of Application" value={state.applicationDate} />
                <SummaryItem label="Account Number" value={state.accountNumber} />
                <SummaryItem label="Title of Account" value={state.accountTitle} />
                <SummaryItem label="Date of Expiry" value={state.expiryDate} />
                <SummaryItem label="Place of Expiry" value={state.placeOfExpiry} />
              </SummaryBlock>

              <SummaryBlock icon={PeopleAltIcon} title="Parties & Bank">
                <SummaryItem label="Applicant's Name" value={state.applicantName} />
                <SummaryItem label="Applicant Address" value={state.applicantAddress} />
                <SummaryItem label="Applicant Phone" value={state.applicantPhone} />
                <SummaryItem label="Applicant Email" value={state.applicantEmail} />
                <SummaryItem label="Beneficiary's Name" value={beneficiaryLabel} />
                <SummaryItem label="Country of Beneficiary" value={countryLabel} />
                <SummaryItem label="Beneficiary Address" value={state.beneficiaryAddress} />
                <SummaryItem label="Beneficiary Phone" value={state.beneficiaryPhone} />
                <SummaryItem label="Beneficiary Email" value={state.beneficiaryEmail} />
                <SummaryItem label="Advising Bank Name" value={state.advisingBankName} />
                <SummaryItem label="SWIFT / BIC Code" value={state.swiftBic || state.advisingBankBicCode} />
                <SummaryItem label="Advising Bank Address" value={state.advisingBankAddress} />
              </SummaryBlock>

              <SummaryBlock icon={AttachMoneyIcon} title="Documentary Credit Details">
                <SummaryItem label="Currency" value={state.lcCurrency} />
                <SummaryItem label="LC Amount" value={state.lcAmount} />
                <SummaryItem label="Amount in Words" value={state.amountInWords} />
                <SummaryItem label="Tolerance" value={state.toleranceEnabled ? `${state.toleranceBasis || '—'} (${state.toleranceInput1 || '—'}${state.toleranceInput2 ? ' / ' + state.toleranceInput2 : ''})` : 'Not specified'} />
              </SummaryBlock>

              <SummaryBlock icon={ScheduleIcon} title="Credit Tenor, Payment & Financial Instrumentation">
                <SummaryItem label="Credit Available With" value={state.creditAvailableWith} />
                <SummaryItem label="Credit Tenor" value={state.lcTenorBasis} />
                <SummaryItem label="Availability Type" value={state.availabilityType} />
                {state.availabilityType === 'By Mixed Payment / UPAS' && <SummaryItem label="Mixed Payment / UPAS Details" value={state.mixedPaymentDetails} />}
                {state.lcTenorBasis === 'For Usance' && (
                  <SummaryItem label="Tenor of Payment" value={
                    state.usanceOption === 'Days From User Input' ? `${state.usanceUserInputDays || '—'} days from`
                      : state.usanceOption === 'Custom Date Period' ? `At ${state.usanceCustomDays || '—'} days after/from ${state.usanceCustomDate || '—'}`
                        : state.usanceOption
                  } />
                )}
              </SummaryBlock>

              <SummaryBlock icon={LocalShippingIcon} title="Incoterms & Shipment Routing">
                <SummaryItem label="Incoterms" value={state.incotermsAnyMode || state.incotermsSeaMode} />
                <SummaryItem label="Shipment From" value={state.shipmentFrom} />
                <SummaryItem label="Shipment To" value={state.shipmentTo} />
                <SummaryItem label="Mode of Shipment" value={state.modeOfShipment} />
                <SummaryItem label="Partial Shipment" value={state.partialShipment} />
                <SummaryItem label="Transshipment" value={state.transshipment} />
                <SummaryItem label="Bill of Exchange" value={state.billOfExchange} />
                {state.billOfExchange === 'Yes' && <SummaryItem label="Drawn On" value={state.drawnOnBank} />}
                <SummaryItem label="Forward Exchange Cover" value={state.forwardCover} />
                {state.forwardCover === 'Yes' && <SummaryItem label="Tenor of Forward Contract" value={state.tenorForwardContract} />}
              </SummaryBlock>

              <SummaryBlock icon={ArticleIcon} title="Description of Goods and/or Services">
                {/* <SummaryItem label="HS Code" value={state.hsCode} /> */}
                <SummaryItem label="Proforma Invoice No" value={state.proformaInvoiceNo} />
                <SummaryItem label="Proforma Invoice Date" value={state.proformaDate} />
                <SummaryItem label="Goods Description" value={state.goodsDescription} />
              </SummaryBlock>

              <SummaryBlock icon={FactCheckIcon} title="Documents Required & Transport Details">
                <SummaryItem label="Documents Selected" value={
                  [
                    state.docInvoiceToggle && 'Signed Commercial Invoice',
                    state.docInsuranceToggle && 'Insurance Policy / Certificate',
                    state.docOriginToggle && 'Certificate of Origin',
                    state.docPackingToggle && 'Packing List',
                    state.docBolToggle && 'Bill of Lading',
                    state.docAwbToggle && 'Airway Bill',
                    state.docTruckReceiptToggle && 'Truck Receipt / Consignment Note',
                  ].filter(Boolean).join(', ') || '—'
                } />
              </SummaryBlock>

              <SummaryBlock icon={RuleIcon} title="Additional Conditions & Specifications">
                <SummaryItem label="Standard Conditions Accepted" value={`${state.standardConditions.length} of ${STANDARD_CONDITION_OPTIONS.length}`} />
                <SummaryItem label="Presentation Days" value={state.presentationDaysToggle ? `${state.presentationDays} days` : '—'} />
                <SummaryItem label="Confirmation" value={state.confirmationToggle ? state.confirmationInstruction : '—'} />
                <SummaryItem label="Confirmation Charges" value={state.confChargesToggle ? state.confirmationCharges : '—'} />
                <SummaryItem label="Foreign Banks Charges" value={state.foreignChargesToggle ? state.foreignBanksCharges : '—'} />
                <SummaryItem label="Reimbursing Bank Charges" value={state.reimbursingChargesToggle ? state.reimbursingBankCharges : '—'} />
                <SummaryItem label="Discrepancy Fee" value={state.discrepancyFeeToggle ? state.discrepancyFee : '—'} />
                <SummaryItem label="Other (Specify)" value={state.otherSpecify} />
                <SummaryItem label="Special Instructions" value={state.additionalConditions} />
              </SummaryBlock>

              <SummaryBlock icon={AttachFileIcon} title="Attachments & Consent">
                <SummaryItem label="Files Attached" value={state.attachments.length ? `${state.attachments.length} file(s)` : '—'} />
                <SummaryItem label="Terms Accepted" value={state.termsAccepted ? 'Yes' : 'No'} />
              </SummaryBlock>
            </React.Fragment>
          )}

          {/* ---------------- Navigation ---------------- */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 5 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack} disabled={activeStep === 0}>Back</Button>
            <Stack direction="row" spacing={2}>
              <Button variant="text" color="inherit" onClick={handleSaveDraft}>Save as Draft</Button>
              {activeStep < STEPS.length - 1 ? (
                <Button variant="contained" disableElevation endIcon={<ArrowForwardIcon />} onClick={handleNext}>Next</Button>
              ) : (
                <Button variant="contained" disableElevation endIcon={<SendIcon />} disabled={!state.termsAccepted} onClick={handleSubmit}
                  sx={{ bgcolor: SUCCESS_COLOR, '&:hover': { bgcolor: SUCCESS_COLOR, filter: 'brightness(0.92)' } }}>
                  Submit LC Application
                </Button>
              )}
            </Stack>
          </Stack>

        </CardContent>
      </Card>

      <Dialog open={tcModalOpen} onClose={() => setTcModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
          <GavelIcon fontSize="small" /> Trade Finance Terms & Conditions
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <Typography variant="body2" fontWeight={700} sx={{ mb: 1.5 }}>General Agreement for Documentary Credits:</Typography>
          <Stack component="ol" spacing={1.5} sx={{ pl: 2.5, m: 0 }}>
            <li><Typography variant="body2"><b>Governing Rules:</b> This Letter of Credit Application and any credit issued pursuant hereto are subject to international UCP guidelines and local trade regulations.</Typography></li>
            <li><Typography variant="body2"><b>Reimbursement & Indemnity:</b> The Applicant unconditionally agrees to reimburse the Issuing Bank on demand for all payments made against documents presented under this Credit that appear on their face to comply with terms.</Typography></li>
            <li><Typography variant="body2"><b>Document Inspection:</b> The Issuing Bank shall examine all documents with reasonable care. The bank assumes no liability for the form, sufficiency, accuracy, or genuineness of any document presented.</Typography></li>
            <li><Typography variant="body2"><b>Foreign Exchange Risk:</b> All exchange risks, currency fluctuations, and foreign charges associated with this credit are entirely for the account of the Applicant.</Typography></li>
            <li><Typography variant="body2"><b>Force Majeure:</b> The Bank assumes no liability or responsibility for consequences arising out of the interruption of its business by Acts of God, riots, civil commotions, or acts of terrorism.</Typography></li>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Please scroll through and click "Accept & Agree" below to acknowledge these regulatory terms.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => setTcModalOpen(false)}>Decline</Button>
          <Button variant="contained" disableElevation onClick={acceptTerms}>Accept & Agree</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

Page.acl = { action: 'itsHaveAccess', subject: 'create-lc' }

export default Page