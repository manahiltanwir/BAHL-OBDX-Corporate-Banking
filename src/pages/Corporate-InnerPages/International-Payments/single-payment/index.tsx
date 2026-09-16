import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { styled, useTheme, alpha } from '@mui/material/styles'
import { Box, Button, Card, Divider, Grid, InputAdornment, MenuItem, Tab, Tabs, TextField, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PublicIcon from '@mui/icons-material/Public'
import CategoryIcon from '@mui/icons-material/Category'
import GroupsIcon from '@mui/icons-material/Groups'
import PaymentsIcon from '@mui/icons-material/Payments'
import LoadingButton from '@mui/lab/LoadingButton'

interface SinglePaymentForm {
  transferFrom: string
  beneficiaryMode: 'existing' | 'new'
  selectedBeneficiaryId: string
  beneficiaryBank: string
  beneficiaryAccountNumber: string
  amount: string
  currency: string
  beneficiaryName: string
  country: string
  purpose: string
  relationship: string
  // Address fields
  department: string
  subDepartment: string
  streetName: string
  buildingNumber: string
  buildingName: string
  floor: string
  postBox: string
  room: string
  postCode: string
  townName: string
  townLocationName: string
  districtName: string
  countrySubdivision: string
}

const emptyForm: SinglePaymentForm = {
  transferFrom: '',
  beneficiaryMode: 'existing',
  selectedBeneficiaryId: '',
  beneficiaryBank: '',
  beneficiaryAccountNumber: '',
  amount: '',
  currency: 'pkr',
  beneficiaryName: '',
  country: '',
  purpose: '',
  relationship: '',
  department: '',
  subDepartment: '',
  streetName: '',
  buildingNumber: '',
  buildingName: '',
  floor: '',
  postBox: '',
  room: '',
  postCode: '',
  townName: '',
  townLocationName: '',
  districtName: '',
  countrySubdivision: ''
}

const emptyBeneficiaryFields = {
  selectedBeneficiaryId: '',
  beneficiaryBank: '',
  beneficiaryAccountNumber: '',
  beneficiaryName: '',
  country: '',
  purpose: '',
  relationship: '',
  department: '',
  subDepartment: '',
  streetName: '',
  buildingNumber: '',
  buildingName: '',
  floor: '',
  postBox: '',
  room: '',
  postCode: '',
  townName: '',
  townLocationName: '',
  districtName: '',
  countrySubdivision: ''
}

const bankOptions = [
  { value: 'hbl', label: 'HBL - Habib Bank Limited' },
  { value: 'ubl', label: 'UBL - United Bank Limited' },
  { value: 'mcb', label: 'MCB Bank' },
  { value: 'abl', label: 'Allied Bank Limited' },
  { value: 'meezan', label: 'Meezan Bank' },
  { value: 'bafl', label: 'Bank Alfalah' },
  { value: 'other', label: 'Other Bank' }
]

const relationshipOptions = [
  { value: 'brother', label: 'Brother' },
  { value: 'sister', label: 'Sister' },
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'friend', label: 'Friend' },
  { value: 'business-partner', label: 'Business Partner' },
  { value: 'other', label: 'Other' }
]

const savedBeneficiaries = [
  {
    value: 'ben-001',
    name: 'Ali Raza',
    bank: 'hbl',
    accountNumber: 'PK36XXXX0000001234560001',
    country: 'ae',
    purpose: 'family-support',
    relationship: 'brother',
    department: '',
    subDepartment: '',
    streetName: 'Al Wasl Road',
    buildingNumber: '12',
    buildingName: 'Al Wasl Tower',
    floor: '4',
    postBox: '11552',
    room: '',
    postCode: '00000',
    townName: 'Dubai',
    townLocationName: '',
    districtName: 'Jumeirah',
    countrySubdivision: 'Dubai'
  },
  {
    value: 'ben-002',
    name: 'Sara Khan',
    bank: 'ubl',
    accountNumber: 'PK71XXXX0000009876540002',
    country: 'uk',
    purpose: 'education',
    relationship: 'daughter',
    department: '',
    subDepartment: '',
    streetName: 'Baker Street',
    buildingNumber: '221',
    buildingName: '',
    floor: '',
    postBox: '',
    room: '',
    postCode: 'NW1 6XE',
    townName: 'London',
    townLocationName: '',
    districtName: 'Westminster',
    countrySubdivision: 'England'
  },
  {
    value: 'ben-003',
    name: 'Ahmed Hussain',
    bank: 'meezan',
    accountNumber: 'PK14XXXX0000004567890003',
    country: 'sa',
    purpose: 'medical',
    relationship: 'father',
    department: '',
    subDepartment: '',
    streetName: 'King Fahd Road',
    buildingNumber: '55',
    buildingName: '',
    floor: '',
    postBox: '7897',
    room: '',
    postCode: '12211',
    townName: 'Riyadh',
    townLocationName: '',
    districtName: 'Al Olaya',
    countrySubdivision: 'Riyadh Province'
  }
]

const transferFromAccounts = [
  { value: 'acc-001', label: '0110-1234567-001 (PKR Current Account)', balance: '245,600.00', currency: 'PKR' },
  { value: 'acc-002', label: '0110-7654321-002 (USD Current Account)', balance: '3,250.00', currency: 'USD' }
]

const currencyOptions = [
  { value: 'pkr', label: 'PKR' },
  { value: 'usd', label: 'USD' },
  { value: 'aed', label: 'AED' },
  { value: 'sar', label: 'SAR' },
  { value: 'gbp', label: 'GBP' }
]

const countryOptions = [
  { value: 'pk', label: 'Pakistan' },
  { value: 'ae', label: 'United Arab Emirates' },
  { value: 'sa', label: 'Saudi Arabia' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'us', label: 'United States' }
]

const purposeOptions = [
  { value: 'family-support', label: 'Family Maintenance / Support' },
  { value: 'education', label: 'Education' },
  { value: 'medical', label: 'Medical Treatment' },
  { value: 'business', label: 'Business Payment' },
  { value: 'gift', label: 'Gift' },
  { value: 'other', label: 'Other' }
]

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
  const router = useRouter()
  const theme = useTheme()

  const [form, setForm] = useState<SinglePaymentForm>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState<{ townName?: boolean; country?: boolean }>({})

  const handleFieldChange =
    (field: keyof SinglePaymentForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: event.target.value }))
    }

  const handleFieldBlur = (field: 'townName' | 'country') => () => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleBeneficiaryModeChange = (_event: React.SyntheticEvent, newMode: 'existing' | 'new') => {
    setForm(prev => ({
      ...prev,
      beneficiaryMode: newMode,
      ...emptyBeneficiaryFields
    }))
    setTouched({})
  }

  const handleSavedBeneficiaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.value
    const beneficiary = savedBeneficiaries.find(item => item.value === id)

    setForm(prev => ({
      ...prev,
      selectedBeneficiaryId: id,
      beneficiaryBank: beneficiary?.bank ?? '',
      beneficiaryAccountNumber: beneficiary?.accountNumber ?? '',
      beneficiaryName: beneficiary?.name ?? '',
      country: beneficiary?.country ?? '',
      purpose: beneficiary?.purpose ?? '',
      relationship: beneficiary?.relationship ?? '',
      department: beneficiary?.department ?? '',
      subDepartment: beneficiary?.subDepartment ?? '',
      streetName: beneficiary?.streetName ?? '',
      buildingNumber: beneficiary?.buildingNumber ?? '',
      buildingName: beneficiary?.buildingName ?? '',
      floor: beneficiary?.floor ?? '',
      postBox: beneficiary?.postBox ?? '',
      room: beneficiary?.room ?? '',
      postCode: beneficiary?.postCode ?? '',
      townName: beneficiary?.townName ?? '',
      townLocationName: beneficiary?.townLocationName ?? '',
      districtName: beneficiary?.districtName ?? '',
      countrySubdivision: beneficiary?.countrySubdivision ?? ''
    }))
  }

  const handleCancel = () => {
    router.push('/Corporate-InnerPages/International-Payments/single-payment')
  }

  const isFormValid = () => {
    const beneficiaryOk =
      form.beneficiaryMode === 'existing'
        ? form.selectedBeneficiaryId.trim() !== ''
        : form.beneficiaryBank.trim() !== '' &&
          form.beneficiaryAccountNumber.trim() !== '' &&
          form.beneficiaryName.trim() !== '' &&
          form.country.trim() !== '' &&
          form.country.trim().length <= 2 &&
          form.purpose.trim() !== '' &&
          form.townName.trim() !== '' &&
          form.townName.trim().length <= 35

    return (
      form.transferFrom.trim() !== '' &&
      form.amount.trim() !== '' &&
      Number(form.amount) > 0 &&
      beneficiaryOk
    )
  }

  const handleReview = async () => {
    if (!isFormValid()) {
      setTouched({ townName: true, country: true })
      return
    }

    setSubmitting(true)

    try {
      await router.push({
        pathname: '/Corporate-InnerPages/International-Payments/single-payment/review-single-payment',
        query: { data: encodeURIComponent(JSON.stringify(form)) }
      })
    } finally {
      setSubmitting(false)
    }
  }

  const selectedCurrency = currencyOptions.find(option => option.value === form.currency)?.label ?? ''

  const selectedTransferFromAccount = transferFromAccounts.find(option => option.value === form.transferFrom)

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
            Single Payment
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <StyledFormCard
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
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
                Enter the amount and select the currency for this transfer
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {selectedCurrency}
                      </Typography>
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

      {/* Transfer Details */}
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
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountBalanceIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  )
                }}
              >
                {transferFromAccounts.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
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
                    ? `${selectedTransferFromAccount.currency} ${selectedTransferFromAccount.balance}`
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
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <PersonOutlineIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                >
                  {savedBeneficiaries.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.name} — {option.accountNumber}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              {form.beneficiaryMode === 'existing' ? (
                <TextField
                  fullWidth
                  size='small'
                  label='Bank'
                  value={bankOptions.find(option => option.value === form.beneficiaryBank)?.label ?? form.beneficiaryBank}
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
              ) : (
                <TextField
                  fullWidth
                  size='small'
                  label='Bank'
                  placeholder='e.g. Habib Bank Limited'
                  value={form.beneficiaryBank}
                  onChange={handleFieldChange('beneficiaryBank')}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <AccountBalanceIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size='small'
                label='Account Number / IBAN'
                placeholder='e.g. PK00XXXX0000000000000000'
                value={form.beneficiaryAccountNumber}
                onChange={handleFieldChange('beneficiaryAccountNumber')}
                disabled={form.beneficiaryMode === 'existing'}
                InputLabelProps={{ shrink: true }}
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

      {/* Beneficiary Details */}
      <Grid item xs={12}>
        <StyledFormCard>
          <StyledSectionTitle>
            <PersonOutlineIcon sx={{ fontSize: 18 }} />
            Beneficiary Details
          </StyledSectionTitle>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                size='small'
                label='Beneficiary Name'
                value={form.beneficiaryName}
                onChange={handleFieldChange('beneficiaryName')}
                disabled={form.beneficiaryMode === 'existing'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PersonOutlineIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <TextField
                select
                fullWidth
                size='small'
                label='Purpose'
                value={form.purpose}
                onChange={handleFieldChange('purpose')}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <CategoryIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  )
                }}
              >
                {purposeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 0.5 }} />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <TextField
                select
                fullWidth
                size='small'
                label='Relationship with Beneficiary'
                value={form.relationship}
                onChange={handleFieldChange('relationship')}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <GroupsIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  )
                }}
              >
                {relationshipOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </StyledFormCard>
      </Grid>

      {/* Address Details */}
      <Grid item xs={12}>
        <StyledFormCard>
          <StyledSectionTitle>
            <PublicIcon sx={{ fontSize: 18 }} />
            Beneficiary Address
          </StyledSectionTitle>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size='small'
                label='Department'
                value={form.department}
                onChange={handleFieldChange('department')}
                disabled={form.beneficiaryMode === 'existing'}
                InputLabelProps={{ shrink: Boolean(form.department) }}
                inputProps={{ maxLength: 70 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size='small'
                label='Sub-Department'
                value={form.subDepartment}
                onChange={handleFieldChange('subDepartment')}
                disabled={form.beneficiaryMode === 'existing'}
                InputLabelProps={{ shrink: Boolean(form.subDepartment) }}
                inputProps={{ maxLength: 70 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size='small'
                label='Street Name'
                value={form.streetName}
                onChange={handleFieldChange('streetName')}
                disabled={form.beneficiaryMode === 'existing'}
                InputLabelProps={{ shrink: Boolean(form.streetName) }}
                inputProps={{ maxLength: 70 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size='small'
                label='Building Number'
                value={form.buildingNumber}
                onChange={handleFieldChange('buildingNumber')}
                disabled={form.beneficiaryMode === 'existing'}
                InputLabelProps={{ shrink: Boolean(form.buildingNumber) }}
                inputProps={{ maxLength: 16 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size='small'
                label='Building Name'
                value={form.buildingName}
                onChange={handleFieldChange('buildingName')}
                disabled={form.beneficiaryMode === 'existing'}
                InputLabelProps={{ shrink: Boolean(form.buildingName) }}
                inputProps={{ maxLength: 35 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size='small'
                label='Floor'
                value={form.floor}
                onChange={handleFieldChange('floor')}
                disabled={form.beneficiaryMode === 'existing'}
                InputLabelProps={{ shrink: Boolean(form.floor) }}
                inputProps={{ maxLength: 70 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size='small'
                label='Post Box'
                value={form.postBox}
                onChange={handleFieldChange('postBox')}
                disabled={form.beneficiaryMode === 'existing'}
                InputLabelProps={{ shrink: Boolean(form.postBox) }}
                inputProps={{ maxLength: 16 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size='small'
                label='Room'
                value={form.room}
                onChange={handleFieldChange('room')}
                disabled={form.beneficiaryMode === 'existing'}
                InputLabelProps={{ shrink: Boolean(form.room) }}
                inputProps={{ maxLength: 70 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size='small'
                label='Post Code'
                value={form.postCode}
                onChange={handleFieldChange('postCode')}
                disabled={form.beneficiaryMode === 'existing'}
                InputLabelProps={{ shrink: Boolean(form.postCode) }}
                inputProps={{ maxLength: 16 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 0.5 }} />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                size='small'
                label='Town Name'
                value={form.townName}
                onChange={handleFieldChange('townName')}
                onBlur={handleFieldBlur('townName')}
                disabled={form.beneficiaryMode === 'existing'}
                InputLabelProps={{ shrink: Boolean(form.townName) }}
                inputProps={{ maxLength: 35 }}
                error={touched.townName && form.beneficiaryMode === 'new' && form.townName.trim() === ''}
                helperText={touched.townName && form.beneficiaryMode === 'new' && form.townName.trim() === '' ? 'Town Name is required' : ' '}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size='small'
                label='Town Location Name'
                value={form.townLocationName}
                onChange={handleFieldChange('townLocationName')}
                disabled={form.beneficiaryMode === 'existing'}
                InputLabelProps={{ shrink: Boolean(form.townLocationName) }}
                inputProps={{ maxLength: 35 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size='small'
                label='District Name'
                value={form.districtName}
                onChange={handleFieldChange('districtName')}
                disabled={form.beneficiaryMode === 'existing'}
                InputLabelProps={{ shrink: Boolean(form.districtName) }}
                inputProps={{ maxLength: 35 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                size='small'
                label='Country Subdivision'
                value={form.countrySubdivision}
                onChange={handleFieldChange('countrySubdivision')}
                disabled={form.beneficiaryMode === 'existing'}
                InputLabelProps={{ shrink: Boolean(form.countrySubdivision) }}
                inputProps={{ maxLength: 35 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <TextField
                select
                required
                fullWidth
                size='small'
                label='Country'
                value={form.country}
                onChange={handleFieldChange('country')}
                onBlur={handleFieldBlur('country')}
                disabled={form.beneficiaryMode === 'existing'}
                InputLabelProps={{ shrink: true }}
                error={touched.country && form.beneficiaryMode === 'new' && form.country.trim() === ''}
                helperText={touched.country && form.beneficiaryMode === 'new' && form.country.trim() === '' ? 'Country is required' : ' '}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PublicIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  )
                }}
              >
                {countryOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
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
  subject: 'single-payment'
}

export default Page