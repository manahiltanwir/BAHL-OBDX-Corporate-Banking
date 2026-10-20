import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Checkbox,
  FormControlLabel,
  Alert,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Chip,
  RadioGroup,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  ToggleButton,
  ToggleButtonGroup
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
  BENEFICIARY_OPTIONS,
  COUNTRY_OPTIONS,
  ADVISING_BANK_OPTIONS,
  OTHERS_ADVISING_BANK_ID,
  COPY_COUNT_OPTIONS,
  STANDARD_CONDITION_OPTIONS,
  buildInitialFormState
} from './importLcTypes'
import { AccountLookup, BeneficiaryLookup, ImportLCFormState, StepKey } from 'src/types/apps/lc'
import { useLC } from 'src/@core/hooks/apps/useLc'
import { lcService } from 'src/services'
import { useForm } from 'react-hook-form'
import { useDashboard } from 'src/@core/hooks/apps/useDashboard'
import { useAuth } from 'src/hooks/useAuth'

const uuid = () => Math.random().toString(36).slice(2, 10)

const ONES = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen'
]
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

const threeDigitsToWords = (n: number): string => {
  const parts: string[] = []
  if (n >= 100) {
    parts.push(`${ONES[Math.floor(n / 100)]} Hundred`)
    n %= 100
  }
  if (n >= 20) {
    parts.push(TENS[Math.floor(n / 10)])
    n %= 10
    if (n > 0) parts.push(ONES[n])
  } else if (n > 0) {
    parts.push(ONES[n])
  }
  return parts.join(' ')
}

export const numberToWords = (value: number): string => {
  if (value === 0) return 'Zero'
  const integerPart = Math.floor(Math.abs(value))
  const decimalPart = Math.round((Math.abs(value) - integerPart) * 100)

  const SCALES: [number, string][] = [
    [1_000_000_000, 'Billion'],
    [1_000_000, 'Million'],
    [1_000, 'Thousand']
  ]

  let n = integerPart
  const words: string[] = []
  for (const [scale, label] of SCALES) {
    if (n >= scale) {
      words.push(`${threeDigitsToWords(Math.floor(n / scale))} ${label}`)
      n %= scale
    }
  }
  if (n > 0) words.push(threeDigitsToWords(n))

  let result = words.join(' ').trim() || 'Zero'
  if (decimalPart > 0) {
    result += ` And ${threeDigitsToWords(decimalPart)} Cents`
  }
  return result
}

const calculateAmountInWords = (currency: string, amount: string): string => {
  const val = parseFloat(amount)
  if (!val || Number.isNaN(val)) return ''
  return `${currency} ${numberToWords(val)} Only`
}

export const STEP_ORDER: StepKey[] = [
  'basic',
  'parties',
  'credit',
  'tenor',
  'shipment',
  'goods',
  'documents',
  'conditions',
  'attachments',
  'review'
]

const STEP_VALIDATORS: Record<StepKey, (state: ImportLCFormState) => string[]> = {
  basic: state => {
    const errors: string[] = []
    if (!state.accountNumber) errors.push('Account Number is required.')
    if (!state.expiryDate) errors.push('Date of Expiry is required.')
    if (!state.placeOfExpiry) errors.push('Place of Expiry is required.')
    return errors
  },
  parties: state => {
    const errors: string[] = []
    if (!state.beneficiaryName) errors.push("Beneficiary's Name is required.")
    if (!state.countryOfBeneficiary) errors.push('Country of Beneficiary is required.')
    if (!state.bankName) errors.push('Advising Bank Name is required.')
    if (state.advisingBankId === OTHERS_ADVISING_BANK_ID) {
      if (!state.bankName) errors.push('Advising Bank Name (manual entry) is required.')
      if (!state.bicCode) errors.push('SWIFT Code is required.')
      if (!state.bankFullAddress) errors.push('Advising Bank Full Address is required.')
    }
    return errors
  },
  credit: state => {
    const errors: string[] = []
    if (!state.lcAmount) errors.push('LC Amount is required.')
    if (state.toleranceEnabled) {
      if (!state.tolerancePositive) errors.push('Positive Tolerance (%) is required.')
      if (!state.toleranceNegative) errors.push('Negative Tolerance (%) is required.')
      if (state.tolerancePositive && state.toleranceNegative && state.tolerancePositive !== state.toleranceNegative) {
        errors.push('Positive and Negative Tolerance values must be identical.')
      }
    }
    return errors
  },
  tenor: state => {
    const errors: string[] = []
    if (!state.creditAvailableWith) errors.push('Credit is Available With is required.')
    if (!state.lcTenorBasis) errors.push('Please select At Sight or For Usance.')
    if (state.lcTenorBasis && !state.availabilityType) errors.push('Availability Type is required.')
    if (state.availabilityType === 'By Mixed Payment / UPAS' && !state.mixedPaymentDetails) {
      errors.push('Mixed Payment / UPAS Details is required.')
    }
    if (state.lcTenorBasis === 'For Usance') {
      if (!state.usanceBasis) errors.push('Tenor of Payment basis (For Usance) is required.')
      if (!state.usanceDays) errors.push('Number of days (For Usance) is required.')
    }
    return errors
  },
  shipment: state => {
    const errors: string[] = []
    if (!state.incoterm) errors.push('Incoterms Rule is required.')
    if (!state.shipmentFrom) errors.push('Shipment From is required.')
    if (!state.shipmentTo) errors.push('Shipment To is required.')
    if (!state.modeOfShipment) errors.push('Mode of Shipment is required.')
    if (state.billOfExchange === 'Yes' && !state.drawnOnBank) errors.push('Drawn On (Bill of Exchange) is required.')
    if (state.forwardCover === 'Yes' && !state.tenorForwardContract)
      errors.push('Tenor of Forward Contract is required.')
    return errors
  },
  goods: state => {
    const errors: string[] = []
    if (!state.proformaInvoiceNo) errors.push('Proforma Invoice / Contract No is required.')
    if (!state.proformaDate) errors.push('Proforma Invoice Date is required.')
    if (!state.goodsDescription) errors.push('Description of Goods / Services is required.')
    return errors
  },
  documents: () => [],
  conditions: state => {
    const errors: string[] = []
    if (state.presentationDaysToggle && !state.presentationDays) errors.push('Presentation Days is required.')
    if (state.confirmationToggle && !state.confirmationInstruction) errors.push('Confirmation Instruction is required.')
    if (state.confChargesToggle && !state.confirmationCharges)
      errors.push('Confirmation Charges allocation is required.')
    if (state.foreignChargesToggle && !state.foreignBanksCharges)
      errors.push('Foreign Banks Charges allocation is required.')
    if (state.reimbursingChargesToggle && !state.reimbursingBankCharges)
      errors.push('Reimbursing Bank Charges allocation is required.')
    if (state.discrepancyFeeToggle && !state.discrepancyFee) errors.push('Discrepancy Fee allocation is required.')
    return errors
  },
  attachments: state => {
    const errors: string[] = []
    if (!state.termsAccepted) errors.push('You must review and accept the Terms & Conditions.')
    return errors
  },
  review: () => []
}

export const validateStep = (stepKey: StepKey, state: ImportLCFormState): string[] => STEP_VALIDATORS[stepKey](state)

const validateForm = (state: ImportLCFormState): { isValid: boolean; errors: string[] } => {
  const errors = STEP_ORDER.flatMap(key => STEP_VALIDATORS[key](state))
  return { isValid: errors.length === 0, errors }
}

const SUCCESS_COLOR = '#15804f'
const MAX_ATTACHMENTS = 7
const DRAFT_STORAGE_KEY = 'importLcDraft'

const AVAILABILITY_TYPES = [
  'By Payment (Without Draft)',
  'By Negotiation (Draft / Without Draft)',
  'By Acceptance (Drafts drawn on Nominated Bank / Issuing Bank)',
  'By Deferred Payment (No Drafts required)',
  'By Mixed Payment / UPAS'
]

const USANCE_BASIS_OPTIONS = [
  { value: 'B/L Date', label: 'B/L Date' },
  { value: 'AWB Date', label: 'AWB Date' },
  { value: 'Truck Receipt Date', label: 'Truck Receipt Date' },
  { value: 'Invoice Date', label: 'Invoice Date' },
  { value: 'Days from Shipment', label: 'Days from Shipment' }
]

const INCOTERM_OPTIONS = [
  'EXW - Ex Works',
  'FCA - Free Carrier',
  'CPT - Carriage Paid To',
  'CIP - Carriage and Insurance Paid To',
  'DAP - Delivered at Place',
  'DPU - Delivered at Place Unloaded',
  'DDP - Delivered Duty Paid',
  'FAS - Free Alongside Ship',
  'FOB - Free On Board',
  'CFR - Cost and Freight',
  'CIF - Cost, Insurance and Freight'
].map(l => ({ value: l.split(' - ')[0], label: l }))

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <Box sx={{ mb: 2.5 }}>
    <Typography variant='subtitle1' fontWeight={700}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant='caption' color='text.secondary'>
        {subtitle}
      </Typography>
    )}
  </Box>
)

const T = ({
  label,
  value,
  onChange,
  required,
  readOnly,
  type = 'text',
  multiline,
  rows,
  placeholder,
  gridMd = 6,
  disabled
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  required?: boolean
  readOnly?: boolean
  type?: string
  multiline?: boolean
  rows?: number
  placeholder?: string
  gridMd?: number
  disabled?: boolean
}) => (
  <Grid item xs={12} md={gridMd}>
    <TextField
      fullWidth
      size='small'
      label={required ? `${label} *` : label}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      type={type}
      multiline={multiline}
      rows={rows}
      placeholder={placeholder}
      InputProps={{ readOnly }}
      InputLabelProps={type === 'date' ? { shrink: true } : undefined}
      disabled={disabled}
      sx={readOnly ? { '& .MuiInputBase-input': { bgcolor: 'action.hover', color: 'text.secondary' } } : undefined}
    />
  </Grid>
)

const S = ({
  label,
  value,
  onChange,
  options,
  required,
  placeholder,
  gridMd = 6,
  disabled
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  required?: boolean
  placeholder?: string
  gridMd?: number
  disabled?: boolean
}) => (
  <Grid item xs={12} md={gridMd}>
    <TextField
      fullWidth
      size='small'
      select
      label={required ? `${label} *` : label}
      value={value}
      onChange={e => onChange(e.target.value)}
      SelectProps={{ native: true }}
      InputLabelProps={{ shrink: true }}
      disabled={disabled}
    >
      <option value='' disabled={!!placeholder}>
        {placeholder ?? `-- Select --`}
      </option>
      {options.map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </TextField>
  </Grid>
)

const SummaryItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Typography variant='caption' color='text.secondary' display='block'>
      {label}
    </Typography>
    <Typography variant='body2' fontWeight={500}>
      {value === '' || value == null ? '—' : value}
    </Typography>
  </Grid>
)

const SummaryBlock = ({
  icon: Icon,
  title,
  children
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) => {
  const theme = useTheme()
  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction='row' spacing={1.5} alignItems='center' sx={{ mb: 2 }}>
        <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(theme.palette.primary.main, 0.12), color: 'primary.main' }}>
          <Icon sx={{ fontSize: 16 }} />
        </Avatar>
        <Typography variant='subtitle2' fontWeight={700}>
          {title}
        </Typography>
      </Stack>
      <Grid container spacing={2}>
        {children}
      </Grid>
      <Divider sx={{ mt: 3 }} />
    </Box>
  )
}

// ----------------------------------------------------------------------
// Step configuration (for the Stepper header only — content is rendered
// per-index below, since every step's fields are quite different).
// `key` here maps 1:1 to StepKey in importLcTypes for per-step validation.
// ----------------------------------------------------------------------

const STEPS: { key: StepKey; label: string; icon: React.ElementType }[] = [
  { key: 'basic', label: 'Basic Information', icon: DescriptionIcon },
  { key: 'parties', label: 'Parties & Bank', icon: PeopleAltIcon },
  { key: 'credit', label: 'Credit Details', icon: AttachMoneyIcon },
  { key: 'tenor', label: 'Tenor & Payment', icon: ScheduleIcon },
  { key: 'shipment', label: 'Shipment Routing', icon: LocalShippingIcon },
  { key: 'goods', label: 'Goods & Services', icon: ArticleIcon },
  { key: 'documents', label: 'Documents Required', icon: FactCheckIcon },
  { key: 'conditions', label: 'Additional Conditions', icon: RuleIcon },
  { key: 'attachments', label: 'Attachments & Consent', icon: AttachFileIcon },
  { key: 'review', label: 'Review', icon: RateReviewIcon }
]

const CustomStepIcon = (props: { active?: boolean; completed?: boolean; stepIndex: number }) => {
  const theme = useTheme()
  const Icon = STEPS[props.stepIndex].icon
  const on = props.completed || props.active
  return (
    <Avatar
      sx={{
        width: 34,
        height: 34,
        bgcolor: on ? theme.palette.primary.main : alpha(theme.palette.text.disabled, 0.15),
        color: on ? '#fff' : theme.palette.text.disabled,
        transition: 'all 0.25s ease',
        transform: props.active ? 'scale(1.08)' : 'scale(1)'
      }}
    >
      {props.completed ? <CheckCircleIcon fontSize='small' /> : <Icon fontSize='small' />}
    </Avatar>
  )
}

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

  const { register, setValue } = useForm({
    defaultValues: buildInitialFormState()
  })

  const { getAll: getAllAccounts, store } = useDashboard(null)

  const {
    user: {
      userId,
      partyId,
      userProfile: { enterpriseRole }
    }
  } = useAuth()

  const { getBeneficiariesForLC, getAdvisoryBanksForLC, addLC, store: LCStore } = useLC(null)

  const generateLCRefNo = () => {
    lcService.getLCReferenceNo().then(res => {
      setState(prevState => ({
        ...prevState,
        lcRefSeq: res.data
      }))
    })
  }

  useEffect(() => {
    getAllAccounts(userId)
    getBeneficiariesForLC(partyId)
    getAdvisoryBanksForLC(partyId)
    generateLCRefNo()
  }, [])

  const set = <K extends keyof ImportLCFormState>(key: K, value: ImportLCFormState[K]) =>
    setState(prev => {
      const next = { ...prev, [key]: value }

      if (key === 'accountNumber') {
        const acc = (store.entities as AccountLookup[]).find(a => a.accountNumber === (value as unknown as string))

        next.accountTitle = acc?.accountTitle ?? ''

        next.applicantName = acc?.accountTitle ?? ''
        next.applicantAddress = ''
        next.applicantPhone = ''
        next.applicantEmail = ''
      }

      if (key === 'beneficiaryId') {
        const selectedId = Number(value)
        const b = (LCStore.beneficiaryDetails as BeneficiaryLookup[]).find(x => x.id === selectedId)

        // const apiCountryName = b?.countryOfBeneficiary ?? ''

        // debugger

        // const matchedCountryOption = COUNTRY_OPTIONS.find(
        //   opt => opt.label.replace(/"/g, '').trim().toLowerCase() === apiCountryName.trim().toLowerCase()
        // )

        // FIX: If matched, set the short code (e.g., 'AED'). If not matched, set to empty string ''
        // so the dropdown resets cleanly instead of passing an unrecognized string.
        next.beneficiaryName = b?.beneficiaryName ?? ''
        next.countryOfBeneficiary = b?.countryOfBeneficiary ?? ''
        next.beneficiaryFullAddress = b?.beneficiaryFullAddress ?? ''
        next.telephoneNumber = b?.telephoneNumber ?? ''
        next.emailAddress = b?.emailAddress ?? ''

        // --- Suggested Advising Bank Autofill Handling ---
        const suggestedBank = ADVISING_BANK_OPTIONS.find(bank => bank.id === (b as any)?.suggestedAdvisingBankId)
        if (suggestedBank) {
          next.advisingBankId = suggestedBank.id ?? ''
          next.bankName = suggestedBank.name ?? ''
          next.bicCode = suggestedBank.bicCode ?? ''
          next.swiftCode = suggestedBank.swiftBic ?? ''
          next.bankFullAddress = suggestedBank.address ?? ''
          next.bankTelephoneNumber = suggestedBank.phone ?? ''
          next.bankEmailAddress = suggestedBank.email ?? ''
        }
      }

      // if (key === 'beneficiaryId') {
      //   const b = BENEFICIARY_OPTIONS.find(x => x.id === (value as unknown as string))
      //   next.countryOfBeneficiary = b?.country ?? ''
      //   next.beneficiaryFullAddress = b?.address ?? ''
      //   next.telephoneNumber = b?.phone ?? ''
      //   next.emailAddress = b?.email ?? ''

      //   const suggestedBank = ADVISING_BANK_OPTIONS.find(bank => bank.id === b?.suggestedAdvisingBankId)
      //   next.advisingBankId = suggestedBank?.id ?? ''
      //   next.bankName = suggestedBank?.name ?? ''
      //   next.bicCode = suggestedBank?.bicCode ?? ''
      //   next.advisingBankBicCode = suggestedBank?.bicCode ?? ''
      //   next.advisingBankAddress = suggestedBank?.address ?? ''
      //   next.bankTelephoneNumber = suggestedBank?.phone ?? ''
      //   next.bankEmailAddress = suggestedBank?.email ?? ''
      // }

      // bankFullAddress: 'HBL Tower, I.I. Chundrigar Road, Karachi'
      // bankName: 'Habib Bank Limited'
      // bicCode: 'HABBPKKAXXX'
      // createdBy: 'admin'
      // creationDate: '2026-10-12T12:23:51.371397'
      // emailAddress: 'contact@hbl.com'
      // id: 7
      // partyId: 'NTN-9999'
      // scope: 'USER'
      // swiftCode: 'HABBPKKA'
      // telephoneNumber: '+922132456789'
      // updatedBy: null
      // updatedDate: null
      // userId: 'F4G7W00'

      if (key === 'advisingBankId') {
        // 1. If the user selected the "Others" option string wrapper
        if (value === OTHERS_ADVISING_BANK_ID) {
          next.bankName = ''
          next.swiftCode = ''
          next.bicCode = ''
          next.bankFullAddress = ''
          next.bankTelephoneNumber = ''
          next.bankEmailAddress = ''
        } else {
          // 2. Safe numeric conversion to match item IDs from the API payload (e.g., 7, 8, 9)
          const targetBankId = Number(value)

          // 3. Scan the genuine dynamic context repository array
          const bank = LCStore.advisoryBankDetails.find((b: any) => b.id === targetBankId)

          // 4. Map the exact string keys returned by your new API response schema
          next.bankName = bank?.bankName ?? ''
          next.swiftCode = bank?.swiftCode ?? ''
          next.bicCode = bank?.bicCode ?? ''
          next.bankFullAddress = bank?.bankFullAddress ?? ''
          next.bankTelephoneNumber = bank?.telephoneNumber ?? ''
          next.bankEmailAddress = bank?.emailAddress ?? ''
        }
      }

      if (key === 'lcAmount' || key === 'lcCurrency') {
        next.amountInWords = calculateAmountInWords(next.lcCurrency, next.lcAmount)
      }

      if (key === 'toleranceEnabled' && !value) {
        next.tolerancePositive = ''
        next.toleranceNegative = ''
      }

      if (key === 'lcTenorBasis') {
        next.availabilityType = ''
        next.mixedPaymentDetails = ''
        next.usanceBasis = ''
        next.usanceDays = ''
      }
      if (key === 'availabilityType' && value !== 'By Mixed Payment / UPAS') next.mixedPaymentDetails = ''

      return next
    })

  // const set = <K extends keyof ImportLCFormState>(key: K, value: ImportLCFormState[K]) =>
  //   setState(prev => {
  //     const next = { ...prev, [key]: value }

  //     if (key === 'accountNumber') {
  //       const acc = ACCOUNT_OPTIONS.find(a => a.accountNumber === (value as unknown as string))
  //       next.accountTitle = acc?.accountTitle ?? ''
  //       next.applicantName = acc?.applicantName ?? ''
  //       next.applicantAddress = acc?.applicantAddress ?? ''
  //       next.applicantPhone = acc?.applicantPhone ?? ''
  //       next.applicantEmail = acc?.applicantEmail ?? ''
  //     }

  //     if (key === 'beneficiaryId') {
  //       const b = BENEFICIARY_OPTIONS.find(x => x.id === (value as unknown as string))
  //       next.countryOfBeneficiary = b?.country ?? ''
  //       next.beneficiaryFullAddress = b?.address ?? ''
  //       next.telephoneNumber = b?.phone ?? ''
  //       next.emailAddress = b?.email ?? ''

  //       const suggestedBank = ADVISING_BANK_OPTIONS.find(bank => bank.id === b?.suggestedAdvisingBankId)
  //       next.advisingBankId = suggestedBank?.id ?? ''
  //       next.bankName = suggestedBank?.name ?? ''
  //       next.bicCode = suggestedBank?.bicCode ?? ''
  //       next.advisingBankBicCode = suggestedBank?.bicCode ?? ''
  //       next.advisingBankAddress = suggestedBank?.address ?? ''
  //       next.bankTelephoneNumber = suggestedBank?.phone ?? ''
  //       next.bankEmailAddress = suggestedBank?.email ?? ''
  //     }

  //     if (key === 'advisingBankId') {
  //       const bankId = value as unknown as string
  //       if (bankId === OTHERS_ADVISING_BANK_ID) {
  //         next.bankName = ''
  //         next.bicCode = ''
  //         next.advisingBankBicCode = ''
  //         next.advisingBankAddress = ''
  //         next.bankTelephoneNumber = ''
  //         next.bankEmailAddress = ''
  //       } else {
  //         const bank = ADVISING_BANK_OPTIONS.find(b => b.id === bankId)
  //         next.bankName = bank?.name ?? ''
  //         next.bicCode = bank?.bicCode ?? ''
  //         next.advisingBankBicCode = bank?.bicCode ?? ''
  //         next.advisingBankAddress = bank?.address ?? ''
  //         next.bankTelephoneNumber = bank?.phone ?? ''
  //         next.bankEmailAddress = bank?.email ?? ''
  //       }
  //     }

  //     if (key === 'lcAmount' || key === 'lcCurrency') {
  //       next.amountInWords = calculateAmountInWords(next.lcCurrency, next.lcAmount)
  //     }

  //     if (key === 'toleranceEnabled' && !value) {
  //       next.tolerancePositive = ''
  //       next.toleranceNegative = ''
  //     }

  //     if (key === 'lcTenorBasis') {
  //       next.availabilityType = ''
  //       next.mixedPaymentDetails = ''
  //       next.usanceBasis = ''
  //       next.usanceDays = ''
  //     }
  //     if (key === 'availabilityType' && value !== 'By Mixed Payment / UPAS') next.mixedPaymentDetails = ''

  //     return next
  //   })

  const toggleStandardCondition = (value: string) =>
    set(
      'standardConditions',
      state.standardConditions.includes(value)
        ? state.standardConditions.filter(c => c !== value)
        : [...state.standardConditions, value]
    )

  const handleAttach = () => {
    debugger
    if (!attachFile) return
    if (state?.attachments && state.attachments?.length >= MAX_ATTACHMENTS) return
    set('attachments', [
      // @ts-ignore
      ...state?.attachments,
      {
        id: uuid(),
        docType: attachDocType,
        fileName: attachFile.name,
        fileSize: `${(attachFile.size / 1024).toFixed(1)} KB`,
        file: attachFile
      }
    ])
    setAttachFile(null)
  }
  const removeAttachment = (id: string) =>
    set(
      'attachments',
      state.attachments?.filter(a => a.id !== id)
    )

  const acceptTerms = () => {
    set('termsAccepted', true)
    setTcModalOpen(false)
  }

  const handleSaveDraft = () => {
    state.isDraft = 'Y';
    state.status = 'DRAFT'
    debugger
    try {
      const { attachments, ...rest } = state
      const draftPayload = {
        ...rest,
        attachments: attachments && attachments.map(({ file, ...meta }) => meta),
        savedAt: new Date().toISOString()
      }
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftPayload))
      setDraftSaved(true)
      setTimeout(() => setDraftSaved(false), 3000)
    } catch (e) {
      console.error('Failed to save draft', e)
    }
    addLC(state, setSubmitted)
  }

  const handleNext = () => {
    const stepErrors = validateStep(STEPS[activeStep].key, state)
    if (stepErrors.length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors([])
    setActiveStep(p => Math.min(p + 1, STEPS.length - 1))
  }

  const handleResetAll = () => {
    setSubmitted(false)
    setState(buildInitialFormState())
    setErrors([])
    setActiveStep(0)
    generateLCRefNo()
  }

  const handleBack = () => {
    setErrors([])
    setActiveStep(p => Math.max(p - 1, 0))
  }

  const handleSubmit = async () => {
    delete state.advisingBankId
    delete state.attachments
    delete state.beneficiaryId
    state.createdBy = enterpriseRole
    state.updatedBy = enterpriseRole
    state.partyId = partyId
    state.userId = userId
    debugger
    for (let i = 0; i < STEPS.length; i++) {
      const stepErrors = validateStep(STEPS[i].key, state)
      if (stepErrors.length > 0) {
        setActiveStep(i)
        setErrors(stepErrors)
        return
      }
    }
    const result = validateForm(state)
    if (!result.isValid) {
      setErrors(result.errors)
      return
    }
    setErrors([])
    addLC(state, setSubmitted)
  }

  const beneficiaryLabel = BENEFICIARY_OPTIONS.find((b: BeneficiaryLookup) => b.id === state.beneficiaryId)?.label ?? ''
  const countryLabel = COUNTRY_OPTIONS.find(c => c.value === state.countryOfBeneficiary)?.label ?? ''
  const advisingBankIsOthers = state.advisingBankId === OTHERS_ADVISING_BANK_ID
  const incotermLabel = INCOTERM_OPTIONS.find(o => o.value === state.incoterm)?.label ?? state.incoterm

  if (submitted) {
    return (
      <Card sx={{ borderRadius: 3, textAlign: 'center', py: 10, px: 4 }}>
        <Avatar
          sx={{ width: 72, height: 72, bgcolor: alpha(SUCCESS_COLOR, 0.12), color: SUCCESS_COLOR, mx: 'auto', mb: 3 }}
        >
          <CheckCircleIcon fontSize='large' />
        </Avatar>
        <Typography variant='h5' fontWeight={700} sx={{ mb: 1 }}>
          LC Application {state.isDraft === 'N' ? 'Submitted' : 'Drafted'} Successfully
        </Typography>
        <Typography color='text.secondary' sx={{ mb: 4 }}>
          Your Corporate Letter of Credit application has been validated and submitted.
        </Typography>
        <Button variant='outlined' onClick={() => handleResetAll()}>
          Create Another Application
        </Button>
      </Card>
    )
  }  

  return (
    <Box>
      {/* ---------------- Header (plain, no color block) ---------------- */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h5' fontWeight={700}>
          Corporate Letter of Credit (LC) Application
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Application for Irrevocable Documentary Credit — Step {activeStep + 1} of {STEPS.length}:{' '}
          {STEPS[activeStep].label}
        </Typography>
      </Box>

      {/* ---------------- Stepper ---------------- */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5, flexWrap: 'wrap', rowGap: 3 }}>
        {STEPS.map((step, index) => (
          <Step key={step.key}>
            <StepLabel
              StepIconComponent={p => <CustomStepIcon active={p.active} completed={p.completed} stepIndex={index} />}
            >
              <Typography variant='caption' sx={{ fontWeight: activeStep === index ? 700 : 500 }}>
                {step.label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {errors.length > 0 && (
        <Alert severity='error' sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrors([])}>
          <Typography variant='body2' fontWeight={700} sx={{ mb: 0.5 }}>
            Please fix the following on this step before continuing:
          </Typography>
          <Stack spacing={0.5}>
            {errors.map(e => (
              <Typography variant='body2' key={e}>
                {e}
              </Typography>
            ))}
          </Stack>
        </Alert>
      )}

      {draftSaved && (
        <Alert severity='success' sx={{ mb: 3, borderRadius: 2 }} onClose={() => setDraftSaved(false)}>
          Draft saved successfully.
        </Alert>
      )}

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 5 } }}>
          {/* ================= STEP 0: Basic Information ================= */}
          {activeStep === 0 && (
            <React.Fragment>
              <SectionTitle title='Basic Information' />
              <Grid container spacing={2.5}>
                <T label='Branch' value={state.branch} readOnly required gridMd={4} />
                <T
                  label='LC Reference Number'
                  value={state.lcRefSeq}
                  readOnly
                  placeholder='Auto-generated on posting'
                  gridMd={4}
                  disabled={true}
                />
                <T label='Date of Application' value={state.applicationDate} readOnly required type='date' gridMd={4} />

                <S
                  label='Account Number'
                  value={state.accountNumber}
                  onChange={v => set('accountNumber', v)}
                  required
                  gridMd={4}
                  placeholder='Select Account'
                  options={(store.entities as AccountLookup[]).map(a => ({
                    value: a.accountNumber,
                    label: a.accountNumber
                  }))}
                  disabled={false}
                />
                <T
                  label='Title of Account'
                  value={state.accountTitle}
                  readOnly
                  placeholder='Autofills from Account'
                  gridMd={4}
                />
                <T
                  label='Date of Expiry'
                  value={state.expiryDate}
                  onChange={v => set('expiryDate', v)}
                  required
                  type='date'
                  gridMd={4}
                />

                <T
                  label='Place of Expiry (Negotiation in Beneficiary Country)'
                  value={state.placeOfExpiry}
                  onChange={v => set('placeOfExpiry', v)}
                  required
                  placeholder='e.g. Shanghai, China'
                  gridMd={12}
                />
              </Grid>
            </React.Fragment>
          )}

          {/* ================= STEP 1: Applicant, Beneficiary & Advising Bank ================= */}
          {(() => {
            // 1. Locate the active account item from state selection
            const selectedAcc = (store.entities as any[]).find((a: any) => a.accountNumber === state.accountNumber)
            const selectedBene =
              LCStore?.beneficiaryDetails &&
              LCStore?.beneficiaryDetails?.length &&
              LCStore?.beneficiaryDetails?.find((ele: any) => ele.id == state.beneficiaryId)

            // 2. Explicitly RETURN the JSX conditional statement block
            return activeStep === 1 ? (
              <React.Fragment>
                <SectionTitle title='Applicant, Beneficiary & Advising Bank Information' />

                <Typography variant='subtitle2' fontWeight={700} color='primary' sx={{ mb: 1.5 }}>
                  Applicant Details
                </Typography>
                <Grid container spacing={2.5} sx={{ mb: 3 }}>
                  <T
                    label="Applicant's Name"
                    value={state.applicantName}
                    onChange={v => set('applicantName', v)} // FIX: Added handler to update state
                    readOnly={!!selectedAcc?.accountTitle} // FIX: Read-only only if value exists in API record
                    required
                    placeholder='Fetched from Account Title'
                  />
                  <T
                    label='Full Address'
                    value={state.applicantAddress}
                    onChange={v => set('applicantAddress', v)} // FIX: Added handler to update state
                    readOnly={!!selectedAcc?.address} // Writable if address field is missing in API data
                    required
                    placeholder='Fetched from Account Master'
                  />
                  <T
                    label='Telephone Number'
                    value={state.applicantPhone}
                    onChange={v => set('applicantPhone', v)} // FIX: Added handler to update state
                    readOnly={!!selectedAcc?.telephoneNumber} // Writable if telephone field is missing in API data
                    required
                    placeholder='+92-21-35550199'
                  />
                  <T
                    label='Email Address'
                    value={state.applicantEmail}
                    onChange={v => set('applicantEmail', v)} // FIX: Added handler to update state
                    readOnly={!!selectedAcc?.emailAddress} // Writable if email field is missing in API data
                    required
                    placeholder='trade@alphatrading.com'
                  />
                </Grid>

                <Divider sx={{ mb: 3 }} />
                <Typography variant='subtitle2' fontWeight={700} color='primary' sx={{ mb: 1.5 }}>
                  Beneficiary Details
                </Typography>
                <Grid container spacing={2.5} sx={{ mb: 3 }}>
                  <S
                    label="Beneficiary's Name"
                    value={state.beneficiaryId as string}
                    onChange={v => set('beneficiaryId', v)}
                    required
                    placeholder='Select Beneficiary'
                    options={LCStore.beneficiaryDetails.map((b: any) => ({ value: b.id, label: b.beneficiaryName }))}
                  />
                  <T
                    label='Country of Beneficiary'
                    value={state.countryOfBeneficiary}
                    onChange={v => set('countryOfBeneficiary', v)}
                    // FIX: Conditional readOnly if data is present from API master records
                    readOnly={!!selectedBene?.countryOfBeneficiary && selectedBene.countryOfBeneficiary.trim() !== ''}
                    required
                    // multiline
                    // rows={2}
                    placeholder='Select Country'
                    // gridMd={12}
                  />

                  {/* 
                  <S
                    label='Country of Beneficiary'
                    value={state.countryOfBeneficiary}
                    onChange={v => set('countryOfBeneficiary', v)}
                    required
                    placeholder='Select Country'
                    // options={}
                    // FIX: Disables dropdown selection if countryOfBeneficiary exists and is not an empty string
                    disabled={!!state.countryOfBeneficiary && state.countryOfBeneficiary.trim() !== ''}
                  /> */}

                  <T
                    label='Beneficiary Full Address'
                    value={state.beneficiaryFullAddress}
                    onChange={v => set('beneficiaryFullAddress', v)}
                    // FIX: Conditional readOnly if data is present from API master records
                    readOnly={
                      !!selectedBene?.beneficiaryFullAddress && selectedBene.beneficiaryFullAddress.trim() !== ''
                    }
                    required
                    multiline
                    rows={2}
                    placeholder='Auto-fills or enter manually'
                    gridMd={12}
                  />

                  <T
                    label='Telephone Number'
                    value={state.telephoneNumber}
                    onChange={v => set('telephoneNumber', v)}
                    readOnly={!!selectedBene?.telephoneNumber && selectedBene.telephoneNumber.trim() !== ''}
                    required
                    placeholder='Auto-fills or enter manually'
                  />

                  <T
                    label='Email Address'
                    value={state.emailAddress}
                    onChange={v => set('emailAddress', v)}
                    readOnly={!!selectedBene?.emailAddress && selectedBene.emailAddress.trim() !== ''}
                    required
                    placeholder='Auto-fills or enter manually'
                  />
                </Grid>

                <Divider sx={{ mb: 3 }} />
                <Typography variant='subtitle2' fontWeight={700} color='primary' sx={{ mb: 1.5 }}>
                  Advising Bank Details
                </Typography>
                <Grid container spacing={2.5}>
                  {/* <S
                    label='Advising Bank Name'
                    value={state.advisingBankId}
                    onChange={v => set('advisingBankId', v)}
                    required
                    gridMd={4}
                    placeholder='-- Select Advising Bank (LOV) --'
                    // options={ADVISING_BANK_OPTIONS.map(b => ({ value: b.id, label: b.name }))}
                    options={LCStore.advisoryBankDetails.map(b => ({ value: b.id, label: b.bankName }))}
                  /> */}
                  <S
                    label='Advising Bank Name'
                    value={state.advisingBankId as string}
                    onChange={v => set('advisingBankId', v)}
                    required
                    gridMd={4}
                    placeholder='-- Select Advising Bank (LOV) --'
                    options={[
                      ...LCStore.advisoryBankDetails.map((b: BeneficiaryLookup) => ({
                        value: b.id,
                        label: b.bankName
                      })),
                      { value: OTHERS_ADVISING_BANK_ID, label: 'Others' } // Appends "Others" choice to the dropdown list
                    ]}
                  />

                  <T
                    label='SWIFT Code'
                    value={state.swiftCode}
                    onChange={v => set('swiftCode', v)}
                    readOnly={!advisingBankIsOthers}
                    required
                    placeholder='Bank SWIFT Identifier'
                    gridMd={4}
                  />
                  <T
                    label='Advising Bank BIC Code'
                    value={state.bicCode}
                    onChange={v => set('bicCode', v)}
                    readOnly={!advisingBankIsOthers}
                    placeholder='Enter or autofill BIC Code'
                    gridMd={4}
                  />
                  <T
                    label='Advising Bank Full Address'
                    value={state.bankFullAddress}
                    onChange={v => set('bankFullAddress', v)}
                    readOnly={!advisingBankIsOthers}
                    required
                    multiline
                    rows={2}
                    placeholder='Auto-fills from selected bank'
                    gridMd={12}
                  />
                  <T
                    label='Telephone Number'
                    value={state.bankTelephoneNumber}
                    onChange={v => set('bankTelephoneNumber', v)}
                    readOnly={!advisingBankIsOthers}
                    placeholder='Auto-fills from selected bank'
                  />
                  <T
                    label='Email Address'
                    value={state.bankEmailAddress}
                    onChange={v => set('bankEmailAddress', v)}
                    readOnly={!advisingBankIsOthers}
                    placeholder='Auto-fills from selected bank'
                  />
                </Grid>
                {advisingBankIsOthers && (
                  <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 1 }}>
                    "Others" selected — please enter the Advising Bank's details manually above.
                  </Typography>
                )}
              </React.Fragment>
            ) : null // Fallback representation if step doesn't match
          })()}

          {/* ================= STEP 2: Documentary Credit Details ================= */}
          {activeStep === 2 && (
            <React.Fragment>
              <SectionTitle title='Documentary Credit Details' />
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <Stack direction='row' spacing={1}>
                    <TextField
                      select
                      size='small'
                      label='Currency *'
                      value={state.lcCurrency}
                      onChange={e => set('lcCurrency', e.target.value)}
                      SelectProps={{ native: true }}
                      sx={{ width: 130 }}
                    >
                      <option value='USD'>USD</option>
                      <option value='EUR'>EUR</option>
                      <option value='PKR'>PKR</option>
                    </TextField>
                    <TextField
                      fullWidth
                      size='small'
                      label='Amount *'
                      placeholder='0.00'
                      value={state.lcAmount}
                      onChange={e => {
                        const v = e.target.value
                        if (/^-?\d*\.?\d*$/.test(v)) set('lcAmount', v)
                      }}
                    />
                  </Stack>
                </Grid>
                <T
                  label='Amount in Words'
                  value={state.amountInWords}
                  readOnly
                  placeholder='Auto-converted from Figures'
                />

                <Grid item xs={12}>
                  <Divider sx={{ my: 1.5 }} />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.toleranceEnabled}
                        onChange={e => set('toleranceEnabled', e.target.checked)}
                      />
                    }
                    label={<Typography fontWeight={600}>Tolerance Allowed</Typography>}
                  />
                </Grid>

                {state.toleranceEnabled && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        borderLeft: `3px solid ${theme.palette.primary.main}`,
                        borderRadius: 1,
                        p: 2
                      }}
                    >
                      <Grid container spacing={2}>
                        <T
                          label='Positive Tolerance (%)'
                          value={state.tolerancePositive}
                          onChange={v => set('tolerancePositive', v)}
                          required
                          placeholder='e.g. 5'
                          gridMd={6}
                          type='number'
                        />
                        <T
                          label='Negative Tolerance (%)'
                          value={state.toleranceNegative}
                          onChange={v => set('toleranceNegative', v)}
                          required
                          placeholder='e.g. 5'
                          gridMd={6}
                          type='number'
                        />
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
              <SectionTitle title='Credit Tenor, Payment & Financial Instrumentation' />
              <Grid container spacing={2.5} sx={{ mb: 1 }}>
                <S
                  label='Credit is Available With'
                  value={state.creditAvailableWith}
                  onChange={v => set('creditAvailableWith', v)}
                  required
                  placeholder='-- Select Available With --'
                  gridMd={12}
                  options={[
                    { value: 'Advising Bank', label: 'Advising Bank' },
                    { value: 'Issuing Bank', label: 'Issuing Bank' },
                    { value: 'Nominated Bank', label: 'Nominated Bank' },
                    { value: 'Any Bank', label: 'Any Bank' }
                  ]}
                />
              </Grid>

              {/* At Sight / For Usance selector */}
              <Box sx={{ mt: 2 }}>
                <Typography variant='body2' fontWeight={600} sx={{ mb: 1 }}>
                  Credit Tenor *
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  value={state.lcTenorBasis || null}
                  onChange={(_, v) => v && set('lcTenorBasis', v)}
                  sx={{
                    '& .MuiToggleButton-root': {
                      px: 4,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 2,
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: '#fff',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }
                    }
                  }}
                >
                  <ToggleButton value='At Sight'>At Sight</ToggleButton>
                  <ToggleButton value='For Usance'>For Usance</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Availability Type — shown once At Sight or For Usance is picked */}
              {state.lcTenorBasis && (
                <Box
                  sx={{
                    mt: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    borderRadius: 2,
                    p: 2.5
                  }}
                >
                  <Typography variant='body2' fontWeight={600} sx={{ mb: 1.5 }}>
                    Availability Type *
                  </Typography>
                  <RadioGroup value={state.availabilityType} onChange={e => set('availabilityType', e.target.value)}>
                    <Stack spacing={1}>
                      {AVAILABILITY_TYPES.map(label => (
                        <FormControlLabel key={label} value={label} control={<Radio size='small' />} label={label} />
                      ))}
                    </Stack>
                  </RadioGroup>

                  {state.availabilityType === 'By Mixed Payment / UPAS' && (
                    <Box
                      sx={{
                        mt: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderLeft: `3px solid ${theme.palette.primary.main}`,
                        borderRadius: 1,
                        p: 2
                      }}
                    >
                      <TextField
                        fullWidth
                        size='small'
                        multiline
                        rows={3}
                        label='Mixed Payment / UPAS Details *'
                        placeholder='Enter terms for mixed payment structure or UPAS details...'
                        value={state.mixedPaymentDetails}
                        onChange={e => set('mixedPaymentDetails', e.target.value)}
                      />
                    </Box>
                  )}
                </Box>
              )}

              {/* Tenor of Payment — only relevant for Usance. Always a required
                  basis dropdown + a required "days after/from" number, no
                  radio-button choice. */}
              {state.lcTenorBasis === 'For Usance' && (
                <Box
                  sx={{
                    mt: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    borderRadius: 2,
                    p: 2.5
                  }}
                >
                  <Typography variant='body2' fontWeight={600} sx={{ mb: 1.5 }}>
                    Tenor of Payment (For Usance) *
                  </Typography>
                  <Grid container spacing={2} alignItems='center'>
                    <S
                      label='Basis Date'
                      value={state.usanceBasis}
                      onChange={v => set('usanceBasis', v as any)}
                      required
                      placeholder='-- Select Basis Date --'
                      gridMd={6}
                      options={USANCE_BASIS_OPTIONS}
                    />
                    <Grid item xs={12} md={6}>
                      <Stack direction='row' spacing={1.5} alignItems='center'>
                        <Typography variant='body2'>At</Typography>
                        <TextField
                          size='small'
                          placeholder='Days'
                          sx={{ width: 100 }}
                          value={state.usanceDays}
                          onChange={e => set('usanceDays', e.target.value)}
                          label='Days *'
                          InputLabelProps={{ shrink: true }}
                        />
                        <Typography variant='body2'>days after / from selected basis</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </React.Fragment>
          )}

          {/* ================= STEP 4: Incoterms & Shipment Routing ================= */}
          {activeStep === 4 && (
            <React.Fragment>
              <SectionTitle title='Incoterms & Shipment Routing (2020) ' />
              <Grid container spacing={2.5}>
                <S
                  label='Incoterms Rule'
                  value={state.incoterm}
                  onChange={v => set('incoterm', v)}
                  required
                  placeholder='-- Select Incoterms Rule (LOV) --'
                  options={INCOTERM_OPTIONS}
                  gridMd={12}
                />

                <T
                  label='Shipment From'
                  value={state.shipmentFrom}
                  onChange={v => set('shipmentFrom', v)}
                  required
                  placeholder='e.g. Port of Karachi, Pakistan'
                />
                <T
                  label='Shipment To'
                  value={state.shipmentTo}
                  onChange={v => set('shipmentTo', v)}
                  required
                  placeholder='e.g. Port of Shanghai, China'
                />

                <S
                  label='Mode of Shipment'
                  value={state.modeOfShipment}
                  onChange={v => set('modeOfShipment', v)}
                  required
                  placeholder='-- Select Mode --'
                  gridMd={4}
                  options={[
                    { value: 'Sea', label: 'Sea' },
                    { value: 'Air', label: 'Air' },
                    { value: 'Road', label: 'Road' }
                  ]}
                />

                <Grid item xs={12} md={4}>
                  <Typography variant='body2' fontWeight={600} sx={{ mb: 0.5 }}>
                    Partial Shipment *
                  </Typography>
                  <RadioGroup
                    row
                    value={state.partialShipment}
                    onChange={e => set('partialShipment', e.target.value as any)}
                  >
                    <FormControlLabel value='Allowed' control={<Radio size='small' />} label='Allowed' />
                    <FormControlLabel value='Not Allowed' control={<Radio size='small' />} label='Not Allowed' />
                  </RadioGroup>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant='body2' fontWeight={600} sx={{ mb: 0.5 }}>
                    Transshipment *
                  </Typography>
                  <RadioGroup
                    row
                    value={state.transshipment}
                    onChange={e => set('transshipment', e.target.value as any)}
                  >
                    <FormControlLabel value='Allowed' control={<Radio size='small' />} label='Allowed' />
                    <FormControlLabel value='Not Allowed' control={<Radio size='small' />} label='Not Allowed' />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant='body2' fontWeight={600} sx={{ mb: 0.5 }}>
                    Bill of Exchange Required *
                  </Typography>
                  <RadioGroup
                    row
                    value={state.billOfExchange}
                    onChange={e => set('billOfExchange', e.target.value as any)}
                  >
                    <FormControlLabel value='No' control={<Radio size='small' />} label='No' />
                    <FormControlLabel value='Yes' control={<Radio size='small' />} label='Yes' />
                  </RadioGroup>
                  {state.billOfExchange === 'Yes' && (
                    <Box
                      sx={{
                        mt: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        borderLeft: `3px solid ${theme.palette.primary.main}`,
                        borderRadius: 1,
                        p: 2
                      }}
                    >
                      <TextField
                        fullWidth
                        size='small'
                        select
                        label='Drawn On (LOV) *'
                        value={state.drawnOnBank}
                        onChange={e => set('drawnOnBank', e.target.value)}
                        SelectProps={{ native: true }}
                        InputLabelProps={{ shrink: true }}
                      >
                        <option value=''>-- Select Bank --</option>
                        {['Issuing Bank', 'Confirming Bank', 'Reimbursing Bank', 'Nominated Bank'].map(o => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </TextField>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant='body2' fontWeight={600} sx={{ mb: 0.5 }}>
                    Forward Exchange Cover *
                  </Typography>
                  <RadioGroup row value={state.forwardCover} onChange={e => set('forwardCover', e.target.value as any)}>
                    <FormControlLabel value='No' control={<Radio size='small' />} label='No' />
                    <FormControlLabel value='Yes' control={<Radio size='small' />} label='Yes' />
                  </RadioGroup>
                  {state.forwardCover === 'Yes' && (
                    <Box
                      sx={{
                        mt: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        borderLeft: `3px solid ${theme.palette.primary.main}`,
                        borderRadius: 1,
                        p: 2
                      }}
                    >
                      <TextField
                        fullWidth
                        size='small'
                        label='Tenor of Forward Contract (Optional &/or Fixed Period Details) *'
                        placeholder='Enter details of optional or fixed period'
                        value={state.tenorForwardContract}
                        onChange={e => set('tenorForwardContract', e.target.value)}
                      />
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='subtitle2' fontWeight={700} color='primary' sx={{ mb: 1.5 }}>
                    In case of multimodal transport document only
                  </Typography>
                </Grid>
                <T
                  label='Place of Taking in Charge of Goods'
                  value={state.placeOfTakingInCharge}
                  onChange={v => set('placeOfTakingInCharge', v)}
                  placeholder='Enter place of taking in charge'
                />
                <T
                  label='Port of Loading'
                  value={state.portOfLoading}
                  onChange={v => set('portOfLoading', v)}
                  placeholder='Enter port of loading'
                />
                <T
                  label='Port of Discharge'
                  value={state.portOfDischarge}
                  onChange={v => set('portOfDischarge', v)}
                  placeholder='Enter port of discharge'
                />
                <T
                  label='Place of Final Destination'
                  value={state.placeOfFinalDestination}
                  onChange={v => set('placeOfFinalDestination', v)}
                  placeholder='Enter place of final destination'
                />
              </Grid>
            </React.Fragment>
          )}

          {/* ================= STEP 5: Description of Goods and/or Services ================= */}
          {activeStep === 5 && (
            <React.Fragment>
              <SectionTitle title='Description of Goods and/or Services' />
              <Grid container spacing={2.5}>
                {/* <T label="HS Code (Harmonized System)" value={state.hsCode} onChange={(v) => set('hsCode', v)} required placeholder="e.g. 8471.3000" gridMd={4} /> */}
                <T
                  label='Proforma Invoice / Contract No'
                  value={state.proformaInvoiceNo}
                  onChange={v => set('proformaInvoiceNo', v)}
                  required
                  placeholder='e.g. PFI-2026-8891'
                  gridMd={4}
                />
                <T
                  label='Proforma Invoice Date'
                  value={state.proformaDate}
                  onChange={v => set('proformaDate', v)}
                  required
                  type='date'
                  gridMd={4}
                />
                <T
                  label='Description of Goods / Services'
                  value={state.goodsDescription}
                  onChange={v => set('goodsDescription', v)}
                  required
                  multiline
                  rows={5}
                  placeholder='Provide complete specifications, quantities, unit prices, and descriptions of goods or services...'
                  gridMd={12}
                />
                <Grid item xs={12}>
                  <Typography variant='caption' color='text.secondary'>
                    Must strictly match the trade agreement without conflicting conditions.
                  </Typography>
                </Grid>
              </Grid>
            </React.Fragment>
          )}

          {/* ================= STEP 6: Documents Required & Transport Details ================= */}
          {activeStep === 6 && (
            <React.Fragment>
              <SectionTitle title='Documents Required & Transport Details' />
              <Stack spacing={2.5}>
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.docInvoiceToggle}
                        onChange={e => set('docInvoiceToggle', e.target.checked)}
                      />
                    }
                    label='Signed Commercial Invoice'
                  />
                  {state.docInvoiceToggle && (
                    <Stack direction='row' spacing={2} flexWrap='wrap' sx={{ pl: 4, mt: 1 }}>
                      <TextField
                        select
                        size='small'
                        label='In Original'
                        placeholder='3'
                        sx={{ width: 140 }}
                        value={state.invoiceOriginals}
                        onChange={e => set('invoiceOriginals', e.target.value)}
                        SelectProps={{ native: true }}
                        InputLabelProps={{ shrink: true }}
                      >
                        <option value=''>-- Select --</option>
                        {COPY_COUNT_OPTIONS.map(n => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </TextField>
                      <TextField
                        select
                        size='small'
                        label='And Copies'
                        placeholder='3'
                        sx={{ width: 140 }}
                        value={state.invoiceCopies}
                        onChange={e => set('invoiceCopies', e.target.value)}
                        SelectProps={{ native: true }}
                        InputLabelProps={{ shrink: true }}
                      >
                        <option value=''>-- Select --</option>
                        {COPY_COUNT_OPTIONS.map(n => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </TextField>
                      <TextField
                        select
                        size='small'
                        label='ORIGIN'
                        placeholder='e.g. China'
                        sx={{ width: 200 }}
                        value={state.invoiceOrigin}
                        onChange={e => set('invoiceOrigin', e.target.value)}
                        SelectProps={{ native: true }}
                        InputLabelProps={{ shrink: true }}
                      >
                        <option value=''>-- Select --</option>
                        {COUNTRY_OPTIONS.map(c => (
                          <option key={c.value} value={c.label}>
                            {c.label}
                          </option>
                        ))}
                      </TextField>
                    </Stack>
                  )}
                </Box>

                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.docInsuranceToggle}
                        onChange={e => set('docInsuranceToggle', e.target.checked)}
                      />
                    }
                    label='Insurance Policy / Certificate'
                  />
                  {state.docInsuranceToggle && (
                    <Typography variant='caption' color='text.secondary' sx={{ pl: 4, display: 'block' }}>
                      Covering All Risks for 110% of Invoice Value
                    </Typography>
                  )}
                </Box>

                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.docOriginToggle}
                        onChange={e => set('docOriginToggle', e.target.checked)}
                      />
                    }
                    label='Certificate of Origin'
                  />
                  {state.docOriginToggle && (
                    <Stack direction='row' spacing={2} sx={{ pl: 4, mt: 1 }}>
                      <TextField
                        size='small'
                        label='Issued by'
                        placeholder='Chamber of Commerce'
                        sx={{ width: 260 }}
                        value={state.originIssuer}
                        onChange={e => set('originIssuer', e.target.value)}
                      />
                    </Stack>
                  )}
                </Box>

                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.docPackingToggle}
                        onChange={e => set('docPackingToggle', e.target.checked)}
                      />
                    }
                    label='Packing List'
                  />
                  {state.docPackingToggle && (
                    <Stack direction='row' spacing={1.5} alignItems='center' flexWrap='wrap' sx={{ pl: 4, mt: 1 }}>
                      <Typography variant='body2'>Packing list in</Typography>
                      <TextField
                        size='small'
                        type='number'
                        placeholder='3'
                        sx={{ width: 90 }}
                        value={state.packingOriginals}
                        onChange={e => set('packingOriginals', e.target.value)}
                      />
                      <Typography variant='body2'>original and</Typography>
                      <TextField
                        size='small'
                        type='number'
                        placeholder='3'
                        sx={{ width: 90 }}
                        value={state.packingCopies}
                        onChange={e => set('packingCopies', e.target.value)}
                      />
                      <Typography variant='body2'>copies</Typography>
                    </Stack>
                  )}
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox checked={state.docBolToggle} onChange={e => set('docBolToggle', e.target.checked)} />
                  }
                  label={
                    <Typography variant='body2'>
                      Full set of clean &ldquo;shipped on board&rdquo; original Marine/Ocean Bill(s) of Lading
                      drawn/made out or endorsed to the order of Bank Al Habib Ltd. Blank Endorsed marked freight
                      prepaid/freight collect i.e. payable at destination (inclusive of all costs) and notify applicant
                      and issuing bank. Full set of clean &ldquo;on board&rdquo; original Multimodal/Combined transport
                      document drawn/made out or endorsed to the order of Bank Al Habib Ltd. Blank Endorsed marked
                      freight prepaid/freight collect i.e. payable at destination (inclusive of all costs) and notify
                      applicant and issuing bank.
                    </Typography>
                  }
                />

                <FormControlLabel
                  control={
                    <Checkbox checked={state.docAwbToggle} onChange={e => set('docAwbToggle', e.target.checked)} />
                  }
                  label={
                    <Typography variant='body2'>
                      Original Airway Bill (for consignor/shipper) bearing this Credit number, showing Flight number,
                      dispatch date, marked Freight prepaid/freight collect and evidencing goods consigned or endorsed
                      to the order of Bank Al Habib Ltd. Blank Endorsed marked and notify applicant and the airport of
                      departure and the airport of destination.
                    </Typography>
                  }
                />

                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.docTruckReceiptToggle}
                        onChange={e => set('docTruckReceiptToggle', e.target.checked)}
                      />
                    }
                    label={
                      <Typography variant='body2' component='span'>
                        Original Truck Receipt/Consignment Note Rail Way Receipt/Post Parcel Receipt showing goods
                        consigned to Bank AL Habib Ltd. Blank Endorsed Others{' '}
                        <TextField
                          size='small'
                          variant='standard'
                          placeholder='Specify other receipt type'
                          sx={{ width: 200, verticalAlign: 'middle', mx: 1 }}
                          value={state.docOthersInput}
                          onChange={e => set('docOthersInput', e.target.value)}
                          onClick={e => e.stopPropagation()}
                        />{' '}
                        marked freight prepaid/freight collect i.e. payable at destination and notify applicant and
                        issuing bank evidencing that goods have been received for shipment/dispatch/carriage.
                      </Typography>
                    }
                  />
                </Box>
              </Stack>
            </React.Fragment>
          )}

          {/* ================= STEP 7: Additional Conditions & Specifications ================= */}
          {activeStep === 7 && (
            <React.Fragment>
              <SectionTitle title='Additional Conditions & Specifications' />
              <Typography variant='body2' fontWeight={600} sx={{ mb: 1 }}>
                Standard LC Conditions & Clauses
              </Typography>
              <Stack spacing={1.5} sx={{ mb: 1 }}>
                {STANDARD_CONDITION_OPTIONS.map(c => (
                  <FormControlLabel
                    key={c.value}
                    control={
                      <Checkbox
                        checked={state.standardConditions.includes(c.value)}
                        onChange={() => toggleStandardCondition(c.value)}
                      />
                    }
                    label={<Typography variant='body2'>{c.text}</Typography>}
                  />
                ))}

                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.presentationDaysToggle}
                        onChange={e => set('presentationDaysToggle', e.target.checked)}
                      />
                    }
                    label={
                      <Typography variant='body2'>
                        6. Documents to be presented within the validity of the credit (LC) but not later than
                      </Typography>
                    }
                  />
                  {state.presentationDaysToggle && (
                    <Stack direction='row' spacing={1.5} alignItems='center' sx={{ pl: 4, mt: 1 }}>
                      <TextField
                        size='small'
                        type='number'
                        placeholder='Days'
                        sx={{ width: 100 }}
                        value={state.presentationDays}
                        onChange={e => set('presentationDays', e.target.value)}
                      />
                      <Typography variant='body2'>days after the date of shipment.</Typography>
                    </Stack>
                  )}
                </Box>

                <Box sx={{ pt: 1.5, borderTop: '1px dashed', borderColor: 'divider' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.confirmationToggle}
                        onChange={e => set('confirmationToggle', e.target.checked)}
                      />
                    }
                    label={
                      <Typography variant='body2' fontWeight={600}>
                        7. Confirmation:
                      </Typography>
                    }
                  />
                  {state.confirmationToggle && (
                    <RadioGroup
                      row
                      sx={{ pl: 4, mt: 1 }}
                      value={state.confirmationInstruction}
                      onChange={e => set('confirmationInstruction', e.target.value as any)}
                    >
                      <FormControlLabel value='Without' control={<Radio size='small' />} label='Without' />
                      <FormControlLabel value='Confirm' control={<Radio size='small' />} label='Confirm' />
                      <FormControlLabel value='May Add' control={<Radio size='small' />} label='May Add' />
                    </RadioGroup>
                  )}
                </Box>

                <Box sx={{ pt: 1.5, borderTop: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant='body2' fontWeight={600} sx={{ mb: 1 }}>
                    Bank Charges & Fees Allocation (For Account of):
                  </Typography>

                  <Box sx={{ mb: 1.5 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.confChargesToggle}
                          onChange={e => set('confChargesToggle', e.target.checked)}
                        />
                      }
                      label='Confirmation and Confirmation Charges'
                    />
                    {state.confChargesToggle && (
                      <RadioGroup
                        row
                        sx={{ pl: 4 }}
                        value={state.confirmationCharges}
                        onChange={e => set('confirmationCharges', e.target.value as any)}
                      >
                        <FormControlLabel value='applicant' control={<Radio size='small' />} label='Applicant' />
                        <FormControlLabel value='beneficiary' control={<Radio size='small' />} label='Beneficiary' />
                      </RadioGroup>
                    )}
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.foreignChargesToggle}
                          onChange={e => set('foreignChargesToggle', e.target.checked)}
                        />
                      }
                      label='Foreign Banks Charges'
                    />
                    {state.foreignChargesToggle && (
                      <RadioGroup
                        row
                        sx={{ pl: 4 }}
                        value={state.foreignBanksCharges}
                        onChange={e => set('foreignBanksCharges', e.target.value as any)}
                      >
                        <FormControlLabel value='applicant' control={<Radio size='small' />} label='Applicant' />
                        <FormControlLabel value='beneficiary' control={<Radio size='small' />} label='Beneficiary' />
                      </RadioGroup>
                    )}
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.reimbursingChargesToggle}
                          onChange={e => set('reimbursingChargesToggle', e.target.checked)}
                        />
                      }
                      label='Reimbursing Bank Charges'
                    />
                    {state.reimbursingChargesToggle && (
                      <RadioGroup
                        row
                        sx={{ pl: 4 }}
                        value={state.reimbursingBankCharges}
                        onChange={e => set('reimbursingBankCharges', e.target.value as any)}
                      >
                        <FormControlLabel value='applicant' control={<Radio size='small' />} label='Applicant' />
                        <FormControlLabel value='beneficiary' control={<Radio size='small' />} label='Beneficiary' />
                      </RadioGroup>
                    )}
                  </Box>

                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.discrepancyFeeToggle}
                          onChange={e => set('discrepancyFeeToggle', e.target.checked)}
                        />
                      }
                      label='Discrepancy fee'
                    />
                    {state.discrepancyFeeToggle && (
                      <RadioGroup
                        row
                        sx={{ pl: 4 }}
                        value={state.discrepancyFee}
                        onChange={e => set('discrepancyFee', e.target.value as any)}
                      >
                        <FormControlLabel value='applicant' control={<Radio size='small' />} label='Applicant' />
                        <FormControlLabel value='beneficiary' control={<Radio size='small' />} label='Beneficiary' />
                      </RadioGroup>
                    )}
                  </Box>
                </Box>
              </Stack>

              <Grid container spacing={2.5} sx={{ mt: 1 }}>
                <T
                  label='Other (Specify) [Text Box]'
                  value={state.otherSpecify}
                  onChange={v => set('otherSpecify', v)}
                  multiline
                  rows={3}
                  placeholder='Enter any additional specifications or special instructions...'
                  gridMd={12}
                />
                <T
                  label='Special Instructions / LC Conditions'
                  value={state.additionalConditions}
                  onChange={v => set('additionalConditions', v)}
                  multiline
                  rows={3}
                  placeholder='e.g. All banking charges outside issuing bank are for beneficiary account.'
                  gridMd={12}
                />
              </Grid>
            </React.Fragment>
          )}

          {/* ================= STEP 8: Attachments & Consent ================= */}
          {activeStep === 8 && (
            <React.Fragment>
              <SectionTitle title='Supporting Document Attachments' />
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ sm: 'flex-end' }}
                sx={{
                  mb: 1,
                  p: 2,
                  bgcolor: alpha(theme.palette.text.primary, 0.03),
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: 'divider'
                }}
              >
                <TextField
                  select
                  size='small'
                  label='Document Type'
                  value={attachDocType}
                  onChange={e => setAttachDocType(e.target.value)}
                  sx={{ minWidth: 200 }}
                  SelectProps={{ native: true }}
                >
                  {[
                    'Invoice',
                    'Bill of Payment',
                    'Bill of Lading',
                    'Insurance Certificate',
                    'Packing List',
                    'Other'
                  ].map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </TextField>
                <Button
                  component='label'
                  variant='outlined'
                  startIcon={<UploadFileIcon />}
                  disabled={state.attachments && state.attachments?.length >= MAX_ATTACHMENTS}
                >
                  {attachFile ? attachFile.name : 'Select File'}
                  <input
                    hidden
                    type='file'
                    onChange={e => setAttachFile(e.target.files?.[0] ?? null)}
                    disabled={state.attachments && state.attachments?.length >= MAX_ATTACHMENTS}
                  />
                </Button>
                <Button
                  variant='contained'
                  disableElevation
                  onClick={handleAttach}
                  disabled={!attachFile || (state?.attachments && state.attachments?.length >= MAX_ATTACHMENTS)}
                >
                  + Attach Document
                </Button>
              </Stack>

              <Typography
                variant='caption'
                color={state?.attachments && state.attachments?.length >= MAX_ATTACHMENTS ? 'error' : 'text.secondary'}
                sx={{ display: 'block', mb: 2 }}
              >
                {state?.attachments && state.attachments?.length} / {MAX_ATTACHMENTS} documents attached
                {state?.attachments && state.attachments?.length >= MAX_ATTACHMENTS
                  ? ' — maximum reached, remove a document to add another.'
                  : ''}
              </Typography>

              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell width={40}>#</TableCell>
                    <TableCell>Document Type</TableCell>
                    <TableCell>File Name</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell align='right'>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.attachments?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align='center'>
                        <Typography variant='body2' color='text.secondary' sx={{ py: 2 }}>
                          No documents attached yet. Use the upload bar above to attach files.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {state.attachments?.map((a, i) => (
                    <TableRow key={a.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        <Chip size='small' label={a.docType} />
                      </TableCell>
                      <TableCell>{a.fileName}</TableCell>
                      <TableCell>{a.fileSize}</TableCell>
                      <TableCell align='right'>
                        <IconButton size='small' onClick={() => removeAttachment(a.id)}>
                          <DeleteOutlineIcon fontSize='small' color='error' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Divider sx={{ my: 4 }} />

              <Box
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderRadius: 2,
                  p: 2.5,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { sm: 'center' },
                  justifyContent: 'space-between',
                  gap: 2
                }}
              >
                <FormControlLabel
                  control={<Checkbox checked={state.termsAccepted} disabled onChange={() => {}} />}
                  label={
                    <Typography variant='body2'>
                      I / We have read, understood, and accept the standard{' '}
                      <Button
                        size='small'
                        onClick={() => setTcModalOpen(true)}
                        sx={{ p: 0, minWidth: 0, verticalAlign: 'baseline', textDecoration: 'underline' }}
                      >
                        Terms & Conditions
                      </Button>{' '}
                      for Letter of Credit issuance.
                    </Typography>
                  }
                />
                {!state.termsAccepted && (
                  <Typography variant='caption' color='error' fontWeight={600}>
                    (Must review T&Cs to accept)
                  </Typography>
                )}
              </Box>
            </React.Fragment>
          )}

          {/* ================= STEP 9: Review ================= */}
          {activeStep === 9 && (
            <React.Fragment>
              <SectionTitle
                title='Review Application'
                subtitle='Please check every section carefully before submitting.'
              />

              <SummaryBlock icon={DescriptionIcon} title='Basic Information'>
                <SummaryItem label='Branch' value={state.branch} />
                <SummaryItem label='LC Number' value={state.lcRefSeq} />
                <SummaryItem label='Date of Application' value={state.applicationDate} />
                <SummaryItem label='Account Number' value={state.accountNumber} />
                <SummaryItem label='Title of Account' value={state.accountTitle} />
                <SummaryItem label='Date of Expiry' value={state.expiryDate} />
                <SummaryItem label='Place of Expiry' value={state.placeOfExpiry} />
              </SummaryBlock>

              <SummaryBlock icon={PeopleAltIcon} title='Parties & Bank'>
                <SummaryItem label="Applicant's Name" value={state.applicantName} />
                <SummaryItem label='Applicant Address' value={state.applicantAddress} />
                <SummaryItem label='Applicant Phone' value={state.applicantPhone} />
                <SummaryItem label='Applicant Email' value={state.applicantEmail} />
                <SummaryItem label="Beneficiary's Name" value={beneficiaryLabel} />
                <SummaryItem label='Country of Beneficiary' value={countryLabel} />
                <SummaryItem label='Beneficiary Address' value={state.beneficiaryFullAddress} />
                <SummaryItem label='Beneficiary Phone' value={state.telephoneNumber} />
                <SummaryItem label='Beneficiary Email' value={state.emailAddress} />
                <SummaryItem label='Advising Bank Name' value={state.bankName} />
                <SummaryItem label='SWIFT / BIC Code' value={state.bicCode || state.bicCode} />
                <SummaryItem label='Advising Bank Address' value={state.bankFullAddress} />
              </SummaryBlock>

              <SummaryBlock icon={AttachMoneyIcon} title='Documentary Credit Details'>
                <SummaryItem label='Currency' value={state.lcCurrency} />
                <SummaryItem label='LC Amount' value={state.lcAmount} />
                <SummaryItem label='Amount in Words' value={state.amountInWords} />
                <SummaryItem
                  label='Tolerance'
                  value={
                    state.toleranceEnabled
                      ? `+${state.tolerancePositive || '—'}% / -${state.toleranceNegative || '—'}%`
                      : 'Not specified'
                  }
                />
              </SummaryBlock>

              <SummaryBlock icon={ScheduleIcon} title='Credit Tenor, Payment & Financial Instrumentation'>
                <SummaryItem label='Credit Available With' value={state.creditAvailableWith} />
                <SummaryItem label='Credit Tenor' value={state.lcTenorBasis} />
                <SummaryItem label='Availability Type' value={state.availabilityType} />
                {state.availabilityType === 'By Mixed Payment / UPAS' && (
                  <SummaryItem label='Mixed Payment / UPAS Details' value={state.mixedPaymentDetails} />
                )}
                {state.lcTenorBasis === 'For Usance' && (
                  <SummaryItem
                    label='Tenor of Payment'
                    value={`At ${state.usanceDays || '—'} days after/from ${state.usanceBasis || '—'}`}
                  />
                )}
              </SummaryBlock>

              <SummaryBlock icon={LocalShippingIcon} title='Incoterms & Shipment Routing'>
                <SummaryItem label='Incoterms' value={incotermLabel} />
                <SummaryItem label='Shipment From' value={state.shipmentFrom} />
                <SummaryItem label='Shipment To' value={state.shipmentTo} />
                <SummaryItem label='Mode of Shipment' value={state.modeOfShipment} />
                <SummaryItem label='Partial Shipment' value={state.partialShipment} />
                <SummaryItem label='Transshipment' value={state.transshipment} />
                <SummaryItem label='Bill of Exchange' value={state.billOfExchange} />
                {state.billOfExchange === 'Yes' && <SummaryItem label='Drawn On' value={state.drawnOnBank} />}
                <SummaryItem label='Forward Exchange Cover' value={state.forwardCover} />
                {state.forwardCover === 'Yes' && (
                  <SummaryItem label='Tenor of Forward Contract' value={state.tenorForwardContract} />
                )}
              </SummaryBlock>

              <SummaryBlock icon={ArticleIcon} title='Description of Goods and/or Services'>
                {/* <SummaryItem label="HS Code" value={state.hsCode} /> */}
                <SummaryItem label='Proforma Invoice No' value={state.proformaInvoiceNo} />
                <SummaryItem label='Proforma Invoice Date' value={state.proformaDate} />
                <SummaryItem label='Goods Description' value={state.goodsDescription} />
              </SummaryBlock>

              <SummaryBlock icon={FactCheckIcon} title='Documents Required & Transport Details'>
                <SummaryItem
                  label='Documents Selected'
                  value={
                    [
                      state.docInvoiceToggle && 'Signed Commercial Invoice',
                      state.docInsuranceToggle && 'Insurance Policy / Certificate',
                      state.docOriginToggle && 'Certificate of Origin',
                      state.docPackingToggle && 'Packing List',
                      state.docBolToggle && 'Bill of Lading',
                      state.docAwbToggle && 'Airway Bill',
                      state.docTruckReceiptToggle && 'Truck Receipt / Consignment Note'
                    ]
                      .filter(Boolean)
                      .join(', ') || '—'
                  }
                />
              </SummaryBlock>

              <SummaryBlock icon={RuleIcon} title='Additional Conditions & Specifications'>
                <SummaryItem
                  label='Standard Conditions Accepted'
                  value={`${state.standardConditions.length} of ${STANDARD_CONDITION_OPTIONS.length}`}
                />
                <SummaryItem
                  label='Presentation Days'
                  value={state.presentationDaysToggle ? `${state.presentationDays} days` : '—'}
                />
                <SummaryItem
                  label='Confirmation'
                  value={state.confirmationToggle ? state.confirmationInstruction : '—'}
                />
                <SummaryItem
                  label='Confirmation Charges'
                  value={state.confChargesToggle ? state.confirmationCharges : '—'}
                />
                <SummaryItem
                  label='Foreign Banks Charges'
                  value={state.foreignChargesToggle ? state.foreignBanksCharges : '—'}
                />
                <SummaryItem
                  label='Reimbursing Bank Charges'
                  value={state.reimbursingChargesToggle ? state.reimbursingBankCharges : '—'}
                />
                <SummaryItem label='Discrepancy Fee' value={state.discrepancyFeeToggle ? state.discrepancyFee : '—'} />
                <SummaryItem label='Other (Specify)' value={state.otherSpecify} />
                <SummaryItem label='Special Instructions' value={state.additionalConditions} />
              </SummaryBlock>

              <SummaryBlock icon={AttachFileIcon} title='Attachments & Consent'>
                <SummaryItem
                  label='Files Attached'
                  value={state.attachments?.length ? `${state.attachments?.length} file(s)` : '—'}
                />
                <SummaryItem label='Terms Accepted' value={state.termsAccepted ? 'Yes' : 'No'} />
              </SummaryBlock>
            </React.Fragment>
          )}

          {/* ---------------- Navigation ---------------- */}
          <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mt: 5 }}>
            <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={handleBack} disabled={activeStep === 0}>
              Back
            </Button>
            <Stack direction='row' spacing={2}>
              {activeStep === 0 ? null : (
              <Button variant='text' color='inherit' onClick={handleSaveDraft}>
                Save as Draft
              </Button>
              )}
              {activeStep < STEPS.length - 1 ? (
                <Button variant='contained' disableElevation endIcon={<ArrowForwardIcon />} onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button
                  variant='contained'
                  disableElevation
                  endIcon={<SendIcon />}
                  disabled={!state.termsAccepted}
                  onClick={handleSubmit}
                  sx={{ bgcolor: SUCCESS_COLOR, '&:hover': { bgcolor: SUCCESS_COLOR, filter: 'brightness(0.92)' } }}
                >
                  Submit LC Application
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={tcModalOpen} onClose={() => setTcModalOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle
          sx={{ bgcolor: theme.palette.primary.main, color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <GavelIcon fontSize='small' /> Trade Finance Terms & Conditions
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <Typography variant='body2' fontWeight={700} sx={{ mb: 1.5 }}>
            General Agreement for Documentary Credits:
          </Typography>
          <Stack component='ol' spacing={1.5} sx={{ pl: 2.5, m: 0 }}>
            <li>
              <Typography variant='body2'>
                <b>Governing Rules:</b> This Letter of Credit Application and any credit issued pursuant hereto are
                subject to international UCP guidelines and local trade regulations.
              </Typography>
            </li>
            <li>
              <Typography variant='body2'>
                <b>Reimbursement & Indemnity:</b> The Applicant unconditionally agrees to reimburse the Issuing Bank on
                demand for all payments made against documents presented under this Credit that appear on their face to
                comply with terms.
              </Typography>
            </li>
            <li>
              <Typography variant='body2'>
                <b>Document Inspection:</b> The Issuing Bank shall examine all documents with reasonable care. The bank
                assumes no liability for the form, sufficiency, accuracy, or genuineness of any document presented.
              </Typography>
            </li>
            <li>
              <Typography variant='body2'>
                <b>Foreign Exchange Risk:</b> All exchange risks, currency fluctuations, and foreign charges associated
                with this credit are entirely for the account of the Applicant.
              </Typography>
            </li>
            <li>
              <Typography variant='body2'>
                <b>Force Majeure:</b> The Bank assumes no liability or responsibility for consequences arising out of
                the interruption of its business by Acts of God, riots, civil commotions, or acts of terrorism.
              </Typography>
            </li>
          </Stack>
          <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 2 }}>
            Please scroll through and click "Accept & Agree" below to acknowledge these regulatory terms.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button color='inherit' onClick={() => setTcModalOpen(false)}>
            Decline
          </Button>
          <Button variant='contained' disableElevation onClick={acceptTerms}>
            Accept & Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

Page.acl = { action: 'itsHaveAccess', subject: 'trade-create-lc-page' }

export default Page
