import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled, useTheme, alpha } from '@mui/material/styles'
import { Box, Button, Card, Divider, Grid, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import EventIcon from '@mui/icons-material/Event'
import LoadingButton from '@mui/lab/LoadingButton'
import useInternalFundTransfer from
'src/@core/hooks/apps/useInternalFundTransfer'

const FIXED_BANK = 'Bank AL Habib'

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

const DetailRow = ({ label, value }: { label: string; value:
React.ReactNode }) => (
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

  const { review, confirmTransfer } = useInternalFundTransfer()

  const [submitting, setSubmitting] = useState(false)
  const [transactionDate] = useState(() => new Date())

  // Review data store me nahi hai (refresh ya direct URL), to form par wapas
  useEffect(() => {
    if (!review) {
      router.replace('/Corporate-InnerPages/Payments/fund-transfer')
    }
  }, [review, router])

  const handleBack = () => {
    router.back()
  }

  const handleConfirm = async () => {
    if (!review || submitting) return

    setSubmitting(true)

    try {
      await confirmTransfer(review)

      // Receipt page store ke review + confirmation se data parhe
      await router.push('/Corporate-InnerPages/Payments/payment-recipt')
    } catch (error) {
      // Toast ApiError me dikh chuka hai, user isi page par rahega
    } finally {
      setSubmitting(false)
    }
  }

  if (!review) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography color='text.secondary'>Loading transfer details…</Typography>
        </Grid>
      </Grid>
    )
  }

  const { draft, toAccountName } = review

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
          <Typography variant='h4' sx={{ fontWeight: 700, color:
'primary.main', mt: 0.5 }}>
            {draft.currency.toUpperCase()}{' '}
            {Number(draft.amount).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
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
            <DetailRow label='Account' value={draft.fromAccount} />
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
            <DetailRow label='Bank' value={FIXED_BANK} />
            <DetailRow
              label='Account Number'
              value={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <CreditCardIcon sx={{ fontSize: 16, color:
'text.secondary' }} />
                  {draft.toAccount}
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
                <CheckCircleOutlineIcon sx={{ fontSize: 18, color:
'success.main' }} />
                <Typography sx={{ fontWeight: 700 }}>{toAccountName}</Typography>
              </Box>
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
            <DetailRow label='Purpose' value={draft.purpose} />
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
            disabled={submitting}
            onClick={handleBack}
          >
            Edit
          </LoadingButton>

          <LoadingButton
            variant='contained'
            loadingPosition='end'
            loading={submitting}
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
  subject: 'domestic-payments-funds-transfer-review-page'
}

export default Page
