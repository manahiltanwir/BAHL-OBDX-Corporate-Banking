import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { Alert, Box, Button, Card, Divider, Grid, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
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

const transferFromAccounts: Record<string, string> = {
  'acc-001': '0110-1234567-001 (PKR Current Account)',
  'acc-002': '0110-7654321-002 (USD Current Account)'
}

const countryLabels: Record<string, string> = {
  pk: 'Pakistan',
  ae: 'United Arab Emirates',
  sa: 'Saudi Arabia',
  uk: 'United Kingdom',
  us: 'United States'
}

const purposeLabels: Record<string, string> = {
  'family-support': 'Family Maintenance / Support',
  education: 'Education',
  medical: 'Medical Treatment',
  business: 'Business Payment',
  gift: 'Gift',
  other: 'Other'
}

const currencyLabels: Record<string, string> = {
  pkr: 'PKR',
  usd: 'USD',
  aed: 'AED',
  sar: 'SAR',
  gbp: 'GBP'
}

const StyledSummaryCard = styled(Card)(({ theme }) => ({
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

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.25 }}>
    <Typography variant='body2' color='text.secondary'>
      {label}
    </Typography>
    <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'right' }}>
      {value || '—'}
    </Typography>
  </Box>
)

const Page = () => {
  const router = useRouter()

  const [form, setForm] = useState<SinglePaymentForm | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!router.isReady) return

    const { data } = router.query

    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(decodeURIComponent(data)) as SinglePaymentForm
        setForm(parsed)
      } catch {
        setError('Could not load transfer details. Please start again.')
      }
    } else {
      setError('No transfer details found. Please start again.')
    }
  }, [router.isReady, router.query])

  const handleBack = () => {
    if (form) {
      // Send user back to the form pre-filled with existing values
      router.push({
        pathname: '/Corporate-InnerPages/International-Payments/single-payment',
        query: { data: encodeURIComponent(JSON.stringify(form)) }

      })
    } else {
      router.push('/Corporate-InnerPages/International-Payments/single-payment')
    }
  }

  const handleConfirm = async () => {
    if (!form) return

    setSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1200))

      router.push({
        pathname: '/Corporate-InnerPages/International-Payments/single-payment/review-single-payment/single-payment-success',
        query: { data: encodeURIComponent(JSON.stringify(form)) }
      })
    } catch {
      setError('Something went wrong while processing the transfer. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button startIcon={<ArrowBackIcon fontSize='small' />} onClick={handleBack}>
            Back to Single Payment
          </Button>
        </Grid>
      </Grid>
    )
  }

  if (!form) {
    return null
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            startIcon={<ArrowBackIcon fontSize='small' />}
            onClick={handleBack}
            sx={{ color: 'text.secondary' }}
          >
            Back
          </Button>
          <Typography variant='h5' sx={{ fontWeight: 700 }}>
            Review & Confirm Transfer
          </Typography>
        </Box>
      </Grid>

      {/* Amount Summary */}
      <Grid item xs={12}>
        <StyledSummaryCard
          sx={{
            background: `linear-gradient(135deg, ${colors.greenSoft} 0%, rgba(16, 185, 129, 0.02) 100%)`,
            border: `1px solid ${colors.greenBorder}`,
            textAlign: 'center'
          }}
        >
          <Typography variant='caption' color='text.secondary'>
            You are sending
          </Typography>
          <Typography variant='h3' sx={{ fontWeight: 800, color: colors.green, my: 0.5 }}>
            {currencyLabels[form.currency] ?? form.currency} {form.amount}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            to <strong>{form.beneficiaryName}</strong>
          </Typography>
        </StyledSummaryCard>
      </Grid>

      {/* Transfer From */}
      <Grid item xs={12}>
        <StyledSummaryCard>
          <StyledSectionTitle>
            <AccountBalanceIcon sx={{ fontSize: 18 }} />
            Transfer From
          </StyledSectionTitle>

          <SummaryRow label='Account' value={transferFromAccounts[form.transferFrom] ?? form.transferFrom} />
          <Divider />
          <SummaryRow label='Beneficiary Account / IBAN' value={form.accountNumber} />
        </StyledSummaryCard>
      </Grid>

      {/* Beneficiary Details */}
      <Grid item xs={12}>
        <StyledSummaryCard>
          <StyledSectionTitle>
            <PersonOutlineIcon sx={{ fontSize: 18 }} />
            Beneficiary Details
          </StyledSectionTitle>

          <SummaryRow label='Beneficiary Name' value={form.beneficiaryName} />
          <Divider />
          <SummaryRow label='Country' value={countryLabels[form.country] ?? form.country} />
          <Divider />
          <SummaryRow label='Purpose' value={purposeLabels[form.purpose] ?? form.purpose} />
          <Divider />
          <SummaryRow label='Relationship with Beneficiary' value={form.relationship} />
        </StyledSummaryCard>
      </Grid>

      {/* Actions */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <LoadingButton
            variant='outlined'
            sx={{ borderColor: 'divider', color: 'text.primary' }}
            onClick={handleBack}
            disabled={submitting}
          >
            Edit Details
          </LoadingButton>

          <LoadingButton
            variant='contained'
            loadingPosition='end'
            loading={submitting}
            startIcon={<CheckCircleOutlineIcon fontSize='small' />}
            onClick={handleConfirm}
          >
            Confirm & Transfer
          </LoadingButton>
        </Box>
      </Grid>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'review-single-payment'
}

export default Page