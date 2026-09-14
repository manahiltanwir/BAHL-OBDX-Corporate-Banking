import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { Box, Button, Card, Divider, Grid, InputAdornment, MenuItem, TextField, Typography } from '@mui/material'
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

const colors = {
  green: '#10b981',
  greenHover: '#059669',
  greenSoft: 'rgba(16, 185, 129, 0.08)',
  greenBorder: 'rgba(16, 185, 129, 0.25)'
}

interface SinglePaymentForm {
  transferFrom: string
  accountNumber: string
  amount: string
  currency: string
  beneficiaryName: string
  country: string
  purpose: string
  relationship: string
}

const emptyForm: SinglePaymentForm = {
  transferFrom: '',
  accountNumber: '',
  amount: '',
  currency: 'pkr',
  beneficiaryName: '',
  country: '',
  purpose: '',
  relationship: ''
}

const transferFromAccounts = [
  { value: 'acc-001', label: '0110-1234567-001 (PKR Current Account)' },
  { value: 'acc-002', label: '0110-7654321-002 (USD Current Account)' }
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

  const [form, setForm] = useState<SinglePaymentForm>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const handleFieldChange =
    (field: keyof SinglePaymentForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: event.target.value }))
    }

  const handleCancel = () => {
    router.push('/Corporate-InnerPages/International-Payments/single-payment')
  }

  const isFormValid = () => {
    return (
      form.transferFrom.trim() !== '' &&
      form.accountNumber.trim() !== '' &&
      form.amount.trim() !== '' &&
      Number(form.amount) > 0 &&
      form.beneficiaryName.trim() !== '' &&
      form.country.trim() !== '' &&
      form.purpose.trim() !== ''
    )
  }

  const handleReview = async () => {
    if (!isFormValid()) return

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
            background: `linear-gradient(135deg, ${colors.greenSoft} 0%, rgba(16, 185, 129, 0.02) 100%)`,
            border: `1px solid ${colors.greenBorder}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: colors.green,
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
                      <Typography sx={{ fontWeight: 700, color: colors.green }}>
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

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                size='small'
                label='Transfer From'
                value={form.transferFrom}
                onChange={handleFieldChange('transferFrom')}
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

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size='small'
                label='Account Number / IBAN'
                placeholder='e.g. PK00XXXX0000000000000000'
                value={form.accountNumber}
                onChange={handleFieldChange('accountNumber')}
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
                label='Country'
                value={form.country}
                onChange={handleFieldChange('country')}
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

            <Grid item xs={12}>
              <Divider sx={{ my: 0.5 }} />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <TextField
                select
                fullWidth
                size='small'
                label='Purpose'
                value={form.purpose}
                onChange={handleFieldChange('purpose')}
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

            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                size='small'
                label='Relationship with Beneficiary'
                value={form.relationship}
                onChange={handleFieldChange('relationship')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <GroupsIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
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
  subject: 'single-payment'
}

export default Page