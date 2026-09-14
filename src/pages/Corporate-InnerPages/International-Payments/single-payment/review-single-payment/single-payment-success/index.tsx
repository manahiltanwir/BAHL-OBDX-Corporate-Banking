import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { Box, Button, Card, Chip, Divider, Grid, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import HomeIcon from '@mui/icons-material/Home'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'

const colors = {
  green: '#10b981',
  greenDark: '#059669',
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

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4.25),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2]
}))

const CheckBadge = styled(Box)(({ theme }) => ({
  width: 72,
  height: 72,
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${colors.green} 0%, ${colors.greenDark} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2.5),
  boxShadow: `0 8px 24px rgba(16, 185, 129, 0.35)`
}))

const SummaryRow = ({
  icon,
  label,
  value
}: {
  icon?: React.ReactNode
  label: string
  value: string
}) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.4 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {icon}
      <Typography variant='body2' color='text.secondary'>
        {label}
      </Typography>
    </Box>
    <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'right' }}>
      {value || '—'}
    </Typography>
  </Box>
)

const generateReferenceId = () => {
  const timestamp = Date.now().toString().slice(-8)
  return `TXN-${timestamp}`
}

const Page = () => {
  const router = useRouter()

  const [form, setForm] = useState<SinglePaymentForm | null>(null)
  const [referenceId] = useState(generateReferenceId())
  const [timestamp] = useState(new Date())

  useEffect(() => {
    if (!router.isReady) return

    const { data } = router.query

    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(decodeURIComponent(data)) as SinglePaymentForm
        setForm(parsed)
      } catch {
        setForm(null)
      }
    }
  }, [router.isReady, router.query])

  const handleGoHome = () => {
    router.push('/dashboard')
  }

  const handleNewTransfer = () => {
    router.push('/Corporate-InnerPages/International-Payments/single-payment')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Grid container spacing={3} justifyContent='center'>
      {/* Success Header */}
      <Grid item xs={12} md={7}>
        <StyledCard
          sx={{
            textAlign: 'center',
            background: `linear-gradient(180deg, ${colors.greenSoft} 0%, rgba(16, 185, 129, 0.01) 100%)`,
            border: `1px solid ${colors.greenBorder}`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <CheckBadge>
            <CheckIcon sx={{ color: '#fff', fontSize: 38 }} />
          </CheckBadge>

          <Typography variant='h5' sx={{ fontWeight: 700, mb: 0.75 }}>
            Transfer Successful
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ maxWidth: 360, mx: 'auto' }}>
            Your international payment has been submitted and is now being processed.
          </Typography>

          {form && (
            <>
              <Typography
                variant='h3'
                sx={{ fontWeight: 800, color: colors.greenDark, mt: 3.5, letterSpacing: '-0.5px' }}
              >
                {currencyLabels[form.currency] ?? form.currency} {form.amount}
              </Typography>
              <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 0.5 }}>
                sent to <strong>{form.beneficiaryName}</strong>
              </Typography>
            </>
          )}

          <Chip
            label={`Ref: ${referenceId}`}
            size='small'
            sx={{
              mt: 2.5,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          />
        </StyledCard>
      </Grid>

      {/* Transaction Summary */}
      {form && (
        <Grid item xs={12} md={7}>
          <StyledCard>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptLongIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Transaction Receipt</Typography>
              </Box>
              <Button
                size='small'
                startIcon={<PrintOutlinedIcon fontSize='small' />}
                onClick={handlePrint}
                sx={{ color: 'text.secondary' }}
              >
                Print
              </Button>
            </Box>

            <Divider sx={{ mb: 1 }} />

            <SummaryRow label='Reference ID' value={referenceId} />
            <Divider />
            <SummaryRow label='Date & Time' value={timestamp.toLocaleString()} />
            <Divider />
            <SummaryRow label='Status' value='Completed' />

            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography
                variant='caption'
                sx={{
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'text.secondary'
                }}
              >
                Transfer From
              </Typography>
            </Box>
            <SummaryRow
              icon={<AccountBalanceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
              label='Account'
              value={transferFromAccounts[form.transferFrom] ?? form.transferFrom}
            />

            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography
                variant='caption'
                sx={{
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'text.secondary'
                }}
              >
                Beneficiary
              </Typography>
            </Box>
            <SummaryRow
              icon={<PersonOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
              label='Name'
              value={form.beneficiaryName}
            />
            <Divider />
            <SummaryRow label='Account Number / IBAN' value={form.accountNumber} />
            <Divider />
            <SummaryRow label='Country' value={countryLabels[form.country] ?? form.country} />
            <Divider />
            <SummaryRow label='Purpose' value={purposeLabels[form.purpose] ?? form.purpose} />
            <Divider />
            <SummaryRow label='Relationship' value={form.relationship} />
          </StyledCard>
        </Grid>
      )}

      {/* Actions */}
      <Grid item xs={12} md={7}>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant='outlined'
            startIcon={<HomeIcon fontSize='small' />}
            sx={{ borderColor: 'divider', color: 'text.primary' }}
            onClick={handleGoHome}
          >
            Go to Home
          </Button>

          <Button
            variant='contained'
            startIcon={<AddCircleOutlineIcon fontSize='small' />}
            onClick={handleNewTransfer}
          >
            New Transfer
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'single-payment-success'
}

export default Page