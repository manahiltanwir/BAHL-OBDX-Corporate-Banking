import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled, useTheme, alpha } from '@mui/material/styles'
import { Box, Button, Card, Divider, Grid, Skeleton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import EventIcon from '@mui/icons-material/Event'
import LoadingButton from '@mui/lab/LoadingButton'

interface FundTransferForm {
  transferFrom: string
  currency: string
  amount: string
  beneficiaryMode: 'existing' | 'new'
  selectedBeneficiaryId: string
  beneficiaryBank: string
  beneficiaryAccountNumber: string
  beneficiaryName: string
}

const transferFromAccounts = [
  { value: 'acc-001', label: 'PK27BAHL6002098102054201 (USD Current Account)' },
  { value: 'acc-002', label: 'PK27BAHL6002098102054205 (USD Savings Account)' }
]

// Mock lookup — in real app this hits an account-title-inquiry API
const accountTitleDirectory: Record<string, string> = {
  'PK27BAHL6002098102054201': 'Ali Raza',
  'PK27BAHL6002098102054207': 'Sara Khan',
  'PK27BAHL6002098102054208': 'Ahmed Hussain'
}

const fetchAccountTitle = (accountNumber: string): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(accountTitleDirectory[accountNumber] ?? 'Muhammad Bilal Ahmed')
    }, 900)
  })
}

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

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Grid item xs={12} sm={6}>
    <Typography variant='caption' color='text.secondary'>
      {label}
    </Typography>
    <Typography sx={{ fontWeight: 600, mt: 0.25 }}>{value}</Typography>
  </Grid>
)

const Page = () => {
  const router = useRouter()
  const theme = useTheme()

  const [form, setForm] = useState<FundTransferForm | null>(null)
  const [accountTitle, setAccountTitle] = useState('')
  const [titleLoading, setTitleLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [transactionDate] = useState(() => new Date())

  useEffect(() => {
    if (!router.isReady) return

    const { data } = router.query

    if (typeof data === 'string') {
      try {
        const parsed: FundTransferForm = JSON.parse(decodeURIComponent(data))
        setForm(parsed)
      } catch {
        setForm(null)
      }
    }
  }, [router.isReady, router.query])

  useEffect(() => {
    if (!form) return

    if (form.beneficiaryMode === 'existing') {
      setAccountTitle(form.beneficiaryName)
      return
    }

    setTitleLoading(true)
    fetchAccountTitle(form.beneficiaryAccountNumber)
      .then(title => setAccountTitle(title))
      .finally(() => setTitleLoading(false))
  }, [form])

  const handleBack = () => {
    router.back()
  }

  const handleConfirm = async () => {
    if (!form) return

    setSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1200))

      const payload = {
        ...form,
        beneficiaryName: accountTitle || form.beneficiaryName
      }

      router.push({
        pathname: '/Corporate-InnerPages/Payments/payment-recipt',
        query: { data: encodeURIComponent(JSON.stringify(payload)) }
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!form) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography color='text.secondary'>Loading transfer details…</Typography>
        </Grid>
      </Grid>
    )
  }

  const transferFromLabel =
    transferFromAccounts.find(option => option.value === form.transferFrom)?.label ?? form.transferFrom

  const formattedDate = transactionDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  const formattedTime = transactionDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })

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
            Review Transfer
          </Typography>
        </Box>
      </Grid>

      {/* Amount */}
      <Grid item xs={12}>
        <StyledFormCard
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
            textAlign: 'center'
          }}
        >
          <Typography variant='caption' color='text.secondary'>
            You are sending
          </Typography>
          <Typography variant='h4' sx={{ fontWeight: 700, color: 'primary.main', mt: 0.5 }}>
            {form.currency.toUpperCase()} {Number(form.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Typography>
        </StyledFormCard>
      </Grid>

      {/* Transfer From */}
      <Grid item xs={12}>
        <StyledFormCard>
          <StyledSectionTitle>
            <AccountBalanceIcon sx={{ fontSize: 18 }} />
            Transfer From
          </StyledSectionTitle>

          <Grid container spacing={3}>
            <DetailRow label='Account' value={transferFromLabel} />
          </Grid>
        </StyledFormCard>
      </Grid>

      {/* Beneficiary */}
      <Grid item xs={12}>
        <StyledFormCard>
          <StyledSectionTitle>
            <PersonOutlineIcon sx={{ fontSize: 18 }} />
            Beneficiary Details
          </StyledSectionTitle>

          <Grid container spacing={3}>
            <DetailRow label='Bank' value={form.beneficiaryBank} />
            <DetailRow
              label='Account Number'
              value={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <CreditCardIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  {form.beneficiaryAccountNumber}
                </Box>
              }
            />

            <Grid item xs={12}>
              <Divider sx={{ my: 0.5 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='caption' color='text.secondary'>
                Account Title
              </Typography>

              {titleLoading ? (
                <Skeleton variant='text' width={200} height={32} />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mt: 0.5,
                    px: 1.5,
                    py: 1,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.success.main, 0.08),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                    width: 'fit-content'
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ fontSize: 18, color: 'success.main' }} />
                  <Typography sx={{ fontWeight: 700 }}>{accountTitle}</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </StyledFormCard>
      </Grid>

      {/* Transaction Info */}
      <Grid item xs={12}>
        <StyledFormCard>
          <StyledSectionTitle>
            <EventIcon sx={{ fontSize: 18 }} />
            Transaction Info
          </StyledSectionTitle>

          <Grid container spacing={3}>
            <DetailRow label='Date' value={formattedDate} />
            <DetailRow label='Time' value={formattedTime} />
          </Grid>
        </StyledFormCard>
      </Grid>

      {/* Actions */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <LoadingButton
            variant='outlined'
            sx={{ borderColor: 'divider', color: 'text.primary' }}
            onClick={handleBack}
          >
            Edit
          </LoadingButton>

          <LoadingButton
            variant='contained'
            loadingPosition='end'
            loading={submitting}
            disabled={titleLoading}
            startIcon={<CheckCircleOutlineIcon fontSize='small' />}
            onClick={handleConfirm}
          >
            Confirm Transfer
          </LoadingButton>
        </Box>
      </Grid>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'review-fund-transfer'
}

export default Page