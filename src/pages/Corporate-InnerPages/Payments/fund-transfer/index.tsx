import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { styled, useTheme, alpha } from '@mui/material/styles'
import { Box, Button, Card, Grid, InputAdornment, MenuItem, Tab, Tabs, TextField, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PaymentsIcon from '@mui/icons-material/Payments'
import LoadingButton from '@mui/lab/LoadingButton'
import useInternalFundTransfer from 'src/@core/hooks/apps/useInternalFundTransfer'
import { useAuth } from 'src/hooks/useAuth'
import { useSearchParams } from 'next/navigation'
import { useDashboard } from 'src/@core/hooks/apps/useDashboard'
import { TransferFromAccount } from 'src/types/apps/internalFundTrasnfer'
import { FundTransferForm } from 'src/types/apps/internalFundTrasnfer'
import useBeneficiary from 'src/@core/hooks/apps/useBeneficiary'



const FIXED_BANK = 'Bank AL Habib'

const emptyForm: FundTransferForm = {
  transferFrom: '',
  currency: 'usd',
  amount: '',
  beneficiaryMode: 'existing',
  selectedBeneficiaryId: '',
  beneficiaryBank: FIXED_BANK,
  beneficiaryAccountNumber: '',
  beneficiaryName: '',
  purposeCode: ''
}

const emptyBeneficiaryFields = {
  selectedBeneficiaryId: '',
  beneficiaryBank: FIXED_BANK,
  beneficiaryAccountNumber: '',
  beneficiaryName: ''
}

const currencyOptions = [
  { value: 'usd', label: 'USD' },
  { value: 'pkr', label: 'PKR' },
  { value: 'aed', label: 'AED' },
  { value: 'sar', label: 'SAR' },
  { value: 'gbp', label: 'GBP' }
]

// Existing beneficiary loaded from API has been done, so hard code values are commented

// const savedBeneficiaries = [
//   {
//     value: 'ben-001',
//     name: 'Ali Raza',
//     bank: FIXED_BANK,
//     accountNumber: 'PK27BAHL6002098102054201'
//   },
//   {
//     value: 'ben-002',
//     name: 'Sara Khan',
//     bank: FIXED_BANK,
//     accountNumber: 'PK27BAHL6002098102054208'
//   },
//   {
//     value: 'ben-003',
//     name: 'Ahmed Hussain',
//     bank: FIXED_BANK,
//     accountNumber: 'PK27BAHL6002098102054209'
//   }
// ]

// const transferFromAccounts = [
//   { value: 'acc-001', label: 'PK27BAHL6002098102054206 (USD Current Account)', balance: '3,250.00', currency: 'USD' },
//   { value: 'acc-002', label: 'PK27BAHL6002098102054207 (USD Savings Account)', balance: '9,875.40', currency: 'USD' }
// ]

const StyledFormCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4.25),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2]
}))

const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  textTransform: 'uppercase',
  letterSpacing: '0.75px',
  color: theme.palette.text.secondary,
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}))

const StyledAmountField = styled(TextField)({
  '& input[type=number]': {
    MozAppearance: 'textfield'
  },
  '& input[type=number]::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0
  },
  '& input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0
  }
})

const Page = () => {
  // const {
  //   user: { userId }
  // } = useAuth()

  const {
  user: {
    userId
    // userProfile: { cnic }  // Jb beneficiary cnic/partyId k against fetch krna ho to userId wala comment kr k ise open krde
  }
} = useAuth()

  const searchParams = useSearchParams()
  const accountNumberFromUrl = searchParams.get('accountNumber')
  const { getAll, store: accountStore } = useDashboard(null)

  //const { fetchTitle } = useInternalFundTransfer()
  const { beneficiaries, 
    isLoading: isBeneficiariesLoading, 
    fetchBeneficiaries,
    //fetchBeneficiariesByPartyId      // Jb beneficiary cnic/partyId k against fetch krna ho to userId wala comment kr k ise open krde 
 } = useBeneficiary() 
  const { fetchTitle } = useInternalFundTransfer()

  useEffect(() => {
    if (!accountNumberFromUrl && userId) {
      getAll(userId)
    }
  }, [accountNumberFromUrl, userId])

  // Jb beneficiary cnic/partyId k against fetch krna ho to userId wala comment kr k ise open krde 
  // useEffect(() => {
  //   if (cnic) fetchBeneficiariesByPartyId(cnic)
  // }, [cnic])
  // Jb beneficiary cnic/partyId k against fetch krna ho to userId wala comment kr k ise open krde

  useEffect(() => {
    if (userId) fetchBeneficiaries(userId)
  }, [userId])


  const transferFromAccounts = useMemo(() => {
    const list = (accountStore?.entities ?? []) as TransferFromAccount[]

    return list.filter(account => account)
  }, [accountStore?.entities])

  const isAccountsLoading = accountStore?.status === 'pending'

  const router = useRouter()
  const theme = useTheme()

  const [form, setForm] = useState<FundTransferForm>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState<{ beneficiaryAccountNumber?: boolean }>({})

  const handleFieldChange = (field: keyof FundTransferForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleFieldBlur = (field: 'beneficiaryAccountNumber') => () => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  // Formats the amount to 2 decimal places once the user leaves the field
  // e.g. "500" -> "500.00", "12.5" -> "12.50"
  const handleAmountBlur = () => {
    setForm(prev => {
      if (prev.amount.trim() === '' || Number.isNaN(Number(prev.amount))) {
        return prev
      }

      return { ...prev, amount: Number(prev.amount).toFixed(2) }
    })
  }

  const handleBeneficiaryModeChange = (_event: React.SyntheticEvent, newMode: 'existing' | 'new') => {
    setForm(prev => ({
      ...prev,
      beneficiaryMode: newMode,
      ...emptyBeneficiaryFields
    }))
    setTouched({})
  }

  const purposeOptions = [
  { value: '015', label: 'Internal Transfer' }
  // baqi purposes yahan aayenge
  ]

  const handleSavedBeneficiaryChange = (event:
React.ChangeEvent<HTMLInputElement>) => {
  const id = event.target.value
  const beneficiary = beneficiaries.find(item => String(item.id) === id)

  setForm(prev => ({
    ...prev,
    selectedBeneficiaryId: id,
    beneficiaryBank: FIXED_BANK,
    beneficiaryAccountNumber: beneficiary?.accountInfo ?? '',
    beneficiaryName: beneficiary?.beneficiaryName ?? ''
  }))
}

  const handleCancel = () => {
    router.push('/corporate-dashboard')
  }

  const isFormValid = () => {
    const beneficiaryOk =
      form.beneficiaryMode === 'existing'
        ? form.selectedBeneficiaryId.trim() !== ''
        : form.beneficiaryAccountNumber.trim() !== ''

    return form.transferFrom.trim() !== '' && form.amount.trim() !== '' && Number(form.amount) > 0 && beneficiaryOk
  }

  const handleReview = async () => {
  if (!isFormValid()) {
    setTouched({ beneficiaryAccountNumber: true })
    return
  }

  setSubmitting(true)

  try {
    const purpose = purposeOptions.find(p => p.value === form.purposeCode)

    await fetchTitle({
      fromAccount: form.transferFrom,
      toAccount: form.beneficiaryAccountNumber,
      currency: form.currency.toUpperCase(),
      amount: Number(form.amount),
      isBeneExists: form.beneficiaryMode === 'existing' ? 'Y' : 'N',
      purpose: purpose?.label ?? '',
      purposeCode: form.purposeCode,
      createdBy: userId
    })

    await router.push('/Corporate-InnerPages/Payments/review-fund-transfer')
  } catch (error) {
    // toast ApiError me dikh chuka hai, user isi page par rahega
  } finally {
    setSubmitting(false)
  }
}

  const selectedCurrency = currencyOptions.find(option => option.value === form.currency)?.label ?? ''
  const selectedTransferFromAccount = transferFromAccounts.find(account => account.accountNumber === form.transferFrom)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            startIcon={<ArrowBackIcon fontSize='small' />}
            onClick={handleCancel}
            sx={{ color: 'text.secondary' }}
          >
            Back
          </Button>
          <Typography variant='h5' sx={{ fontWeight: 700 }}>
            Fund Transfer
          </Typography>
        </Box>
      </Grid>

      {/* Currency + Amount */}
      <Grid item xs={12}>
        <StyledFormCard
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(
              theme.palette.primary.main,
              0.02
            )} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PaymentsIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700 }}>How much are you sending?</Typography>
              <Typography variant='caption' color='text.secondary'>
                Select the currency and enter the amount
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3} alignItems='center'>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label='Currency'
                value={form.currency}
                onChange={handleFieldChange('currency')}
              >
                {currencyOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={8}>
              <StyledAmountField
                fullWidth
                type='number'
                label='Amount'
                placeholder='0.00'
                value={form.amount}
                onChange={handleFieldChange('amount')}
                onBlur={handleAmountBlur}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>{selectedCurrency}</Typography>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiInputBase-input': { fontSize: '1.5rem', fontWeight: 700 }
                }}
              />
            </Grid>
          </Grid>
        </StyledFormCard>
      </Grid>

      {/* Transfer From */}
      <Grid item xs={12}>
        <StyledFormCard>
          <StyledSectionTitle>
            <AccountBalanceIcon sx={{ fontSize: 18 }} />
            Transfer From
          </StyledSectionTitle>

          <Grid container spacing={3} alignItems='center'>
            <Grid item xs={12} sm={8}>
              <TextField
                select
                fullWidth
                size='small'
                label='Transfer From'
                value={form.transferFrom}
                onChange={handleFieldChange('transferFrom')}
                disabled={isAccountsLoading}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountBalanceIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  )
                }}
              >
                {transferFromAccounts.length === 0 ? (
                  <MenuItem disabled value=''>
                    {isAccountsLoading ? 'Loading accounts...' : 'No accounts found'}
                  </MenuItem>
                ) : (
                  transferFromAccounts.map(account => (
                    <MenuItem key={account.accountNumber} value={account.accountNumber}>
                      {account.accountNumber} ({account.accountTitle} - {account.accountType})
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  height: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  px: 1.5,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`
                }}
              >
                <Typography variant='caption' color='text.secondary' sx={{ lineHeight: 1.2 }}>
                  Available Balance
                </Typography>
                <Typography sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.2 }}>
                  {selectedTransferFromAccount
                    ? `${selectedTransferFromAccount.currency ?? 'USD'} ${selectedTransferFromAccount.balance}`
                    : '—'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </StyledFormCard>
      </Grid>

      {/* Transfer To */}
      <Grid item xs={12}>
        <StyledFormCard>
          <StyledSectionTitle>
            <CreditCardIcon sx={{ fontSize: 18 }} />
            Transfer To
          </StyledSectionTitle>

          <Tabs
            value={form.beneficiaryMode}
            onChange={handleBeneficiaryModeChange}
            sx={{ mb: 3, minHeight: 36, '& .MuiTab-root': { minHeight: 36, textTransform: 'none', fontWeight: 600 } }}
          >
            <Tab value='existing' label='Existing Beneficiary' />
            <Tab value='new' label='New Beneficiary' />
          </Tabs>

          <Grid container spacing={3}>
            {form.beneficiaryMode === 'existing' && (
              <Grid item xs={12}>
                <TextField
  select
  fullWidth
  size='small'
  label='Select Beneficiary'
  value={form.selectedBeneficiaryId}
  onChange={handleSavedBeneficiaryChange}
  disabled={isBeneficiariesLoading}
  InputLabelProps={{ shrink: true }}
  InputProps={{
    startAdornment: (
      <InputAdornment position='start'>
        <PersonOutlineIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
      </InputAdornment>
    )
  }}
>
  {beneficiaries.length === 0 ? (
    <MenuItem disabled value=''>
      {isBeneficiariesLoading ? 'Loading beneficiaries...' : 'No beneficiaries found'}
    </MenuItem>
  ) : (
    beneficiaries.map(option => (
      <MenuItem key={option.id} value={String(option.id)}>
        {option.beneficiaryName} — {option.accountInfo}
      </MenuItem>
    ))
  )}
</TextField>
              </Grid>
            )}

            {/* Bank is always Bank AL Habib and never editable, even for a new beneficiary */}
            <Grid item xs={12} sm={form.beneficiaryMode === 'existing' ? 6 : 5}>
              <TextField
                fullWidth
                size='small'
                label='Bank'
                value={FIXED_BANK}
                disabled
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountBalanceIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={form.beneficiaryMode === 'existing' ? 6 : 7}>
              <TextField
                fullWidth
                size='small'
                label='Account Number'
                placeholder='e.g. 0110-0000000-000'
                value={form.beneficiaryAccountNumber}
                onChange={handleFieldChange('beneficiaryAccountNumber')}
                onBlur={handleFieldBlur('beneficiaryAccountNumber')}
                disabled={form.beneficiaryMode === 'existing'}
                InputLabelProps={{ shrink: true }}
                error={
                  touched.beneficiaryAccountNumber &&
                  form.beneficiaryMode === 'new' &&
                  form.beneficiaryAccountNumber.trim() === ''
                }
                helperText={
                  touched.beneficiaryAccountNumber &&
                  form.beneficiaryMode === 'new' &&
                  form.beneficiaryAccountNumber.trim() === ''
                    ? 'Account Number is required'
                    : ' '
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <CreditCardIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
        </StyledFormCard>
      </Grid>

      {/* Actions */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <LoadingButton
            variant='outlined'
            sx={{ borderColor: 'divider', color: 'text.primary' }}
            onClick={handleCancel}
          >
            Cancel
          </LoadingButton>

          <LoadingButton
            variant='contained'
            loadingPosition='end'
            loading={submitting}
            disabled={!isFormValid()}
            startIcon={<SendIcon fontSize='small' />}
            onClick={handleReview}
          >
            Review Transfer
          </LoadingButton>
        </Box>
      </Grid>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'domestic-payments-funds-transfer-page'
}

export default Page
