import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { styled, useTheme, alpha } from '@mui/material/styles'
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PercentIcon from '@mui/icons-material/Percent'
import EventRepeatIcon from '@mui/icons-material/EventRepeat'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import LoadingButton from '@mui/lab/LoadingButton'

// ---------- Types ----------
interface TdrForm {
  sourceAccount: string
  amount: string
  tenorId: string
  maturityInstruction: string
}

// ---------- Reference / lookup data ----------
// TODO: yeh sab real account & rate-card API se replace karein
const sourceAccounts = [
  { value: 'acc-001', label: 'PK27BAHL6002098102054201 - (Abbas)', currency: 'USD', balance: 8450000.00 },
  { value: 'acc-002', label: 'PK27BAHL6002098102054201', currency: 'USD', balance: 2100000.00 }
]

const tenorOptions = [
  { value: 'tenor-1m', months: 1, rate: 11, label: '1 Month (Rate: 11%)' },
  { value: 'tenor-3m', months: 3, rate: 12.5, label: '3 Months (Rate: 12.5%)' },
  { value: 'tenor-6m', months: 6, rate: 13.5, label: '6 Months (Rate: 13.5%)' },
  { value: 'tenor-1y', months: 12, rate: 14, label: '1 Year (Rate: 14%)' }
]

const maturityInstructionOptions = [
  { value: 'credit-account', label: 'Credit Principal & Interest to Account' },
  { value: 'rollover-principal', label: 'Roll-over Principal Only' },
  { value: 'rollover-principal-interest', label: 'Roll-over Principal & Interest' }
]

const MIN_DEPOSIT_AMOUNT = 1000.00

const emptyForm: TdrForm = {
  sourceAccount: '',
  amount: '',
  tenorId: '',
  maturityInstruction: ''
}

// ---------- Styled ----------
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

const SummaryRow = ({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.1 }}>
    <Typography variant='body2' color='text.secondary'>
      {label}
    </Typography>
    <Typography
      variant='body2'
      sx={{ fontWeight: emphasize ? 800 : 600, color: emphasize ? 'primary.main' : 'text.primary' }}
    >
      {value}
    </Typography>
  </Box>
)

const Page = () => {
  const router = useRouter()
  const theme = useTheme()

  const [form, setForm] = useState<TdrForm>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleFieldChange =
    (field: keyof TdrForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: event.target.value }))
      setSubmitted(false)
    }

  const selectedAccount = sourceAccounts.find(acc => acc.value === form.sourceAccount)
  const selectedTenor = tenorOptions.find(t => t.value === form.tenorId)

  const numericAmount = Number(form.amount)
  const amountIsValid = form.amount.trim() !== '' && !Number.isNaN(numericAmount) && numericAmount >= MIN_DEPOSIT_AMOUNT

  const isFormValid =
    form.sourceAccount.trim() !== '' && amountIsValid && form.tenorId.trim() !== '' && form.maturityInstruction.trim() !== ''

  const exceedsBalance = !!selectedAccount && amountIsValid && numericAmount > selectedAccount.balance

  // Live projection — simple interest for the selected tenor
  const projection = useMemo(() => {
    if (!selectedTenor || !amountIsValid) return null

    const interest = numericAmount * (selectedTenor.rate / 100) * (selectedTenor.months / 12)
    const maturityValue = numericAmount + interest

    return { interest, maturityValue }
  }, [selectedTenor, amountIsValid, numericAmount])

  const formatPkr = (value: number) => `USD ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  
  const handleSubmit = async () => {
    if (!isFormValid || exceedsBalance) return

    setSubmitting(true)

    try {
      // TODO: real API call, e.g. await axios.post('/api/tdr', form)
      await new Promise(resolve => setTimeout(resolve, 900))
      setSubmitted(true)
      setForm(emptyForm)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant='h5' sx={{ fontWeight: 700 }}>
            Place New Term Deposit
          </Typography>
        </Box>
      </Grid>

      {submitted && (
        <Grid item xs={12}>
          <Alert severity='success' sx={{ borderRadius: 2 }} onClose={() => setSubmitted(false)}>
            Your Term Deposit request has been submitted for authorization.
          </Alert>
        </Grid>
      )}

      {/* Form */}
      <Grid item xs={12} md={8}>
        <StyledFormCard
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(
              theme.palette.primary.main,
              0.01
            )} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <WorkspacePremiumIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700 }}>Term Deposit Details</Typography>
              <Typography variant='caption' color='text.secondary'>
                Choose your source account, deposit amount, tenor and maturity instructions
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label='Source Current Account'
                value={form.sourceAccount}
                onChange={handleFieldChange('sourceAccount')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountBalanceIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  )
                }}
              >
                {sourceAccounts.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {selectedAccount && (
                <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 0.75, ml: 0.5 }}>
                  Available Balance: <strong>{formatPkr(selectedAccount.balance)}</strong>
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='number'
                label='Deposit Amount (USD)'
                placeholder={`Enter amount (Min: ${MIN_DEPOSIT_AMOUNT.toLocaleString('en-US')})`}
                value={form.amount}
                onChange={handleFieldChange('amount')}
                error={form.amount.trim() !== '' && (!amountIsValid || exceedsBalance)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>USD</Typography>
                    </InputAdornment>
                  )
                }}
              />
              {form.amount.trim() !== '' && !amountIsValid && (
                <Typography variant='caption' color='error' sx={{ display: 'block', mt: 0.75, ml: 0.5 }}>
                  Minimum deposit amount is {formatPkr(MIN_DEPOSIT_AMOUNT)}.
                </Typography>
              )}
              {exceedsBalance && amountIsValid && (
                <Typography variant='caption' color='error' sx={{ display: 'block', mt: 0.75, ml: 0.5 }}>
                  Amount exceeds available balance in the selected account.
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label='Tenor & Rate'
                value={form.tenorId}
                onChange={handleFieldChange('tenorId')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PercentIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  )
                }}
              >
                {tenorOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label='Maturity Instruction'
                value={form.maturityInstruction}
                onChange={handleFieldChange('maturityInstruction')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <EventRepeatIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  )
                }}
              >
                {maturityInstructionOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <LoadingButton
                variant='contained'
                loadingPosition='end'
                loading={submitting}
                disabled={!isFormValid || exceedsBalance}
                startIcon={<SendIcon fontSize='small' />}
                onClick={handleSubmit}
              >
                Submit for Authorization
              </LoadingButton>
            </Grid>
          </Grid>
        </StyledFormCard>
      </Grid>

      {/* Live projection summary — helps the customer see what they'll get before submitting */}
      <Grid item xs={12} md={4}>
        <StyledFormCard sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
          <StyledSectionTitle>
            <TrendingUpIcon sx={{ fontSize: 18 }} />
            Projected Returns
          </StyledSectionTitle>

          {projection && selectedTenor ? (
            <>
              <SummaryRow label='Deposit Amount' value={formatPkr(numericAmount)} />
              <Divider />
              <SummaryRow label='Tenor' value={`${selectedTenor.months} Month${selectedTenor.months > 1 ? 's' : ''}`} />
              <Divider />
              <SummaryRow label='Profit Rate' value={`${selectedTenor.rate}% p.a.`} />
              <Divider />
              <SummaryRow label='Estimated Profit' value={formatPkr(projection.interest)} />
              <Divider />
              <SummaryRow label='Maturity Value' value={formatPkr(projection.maturityValue)} emphasize />

              <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 2 }}>
                Estimate only — actual profit may vary based on bank's applicable profit calculation policy.
              </Typography>
            </>
          ) : (
            <Typography variant='body2' color='text.secondary'>
              Enter a deposit amount and select a tenor to see your projected maturity value here.
            </Typography>
          )}
        </StyledFormCard>
      </Grid>
    </Grid>
  )
}

Page.acl = { action: 'itsHaveAccess', subject: 'create-TDR' }

export default Page