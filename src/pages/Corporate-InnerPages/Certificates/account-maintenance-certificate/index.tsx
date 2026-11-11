import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { styled, alpha, useTheme } from '@mui/material/styles'
import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DescriptionIcon from '@mui/icons-material/Description'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import LoadingButton from '@mui/lab/LoadingButton'
import { useDashboard } from 'src/@core/hooks/apps/useDashboard'
import useCertificate from 'src/@core/hooks/apps/useCertificate'
import { useAuth } from 'src/hooks/useAuth'

// Success ke baad is page par jana hai (apne dashboard ka route yahan likhein) const DASHBOARD_ROUTE = '/dashboard'

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
  marginBottom: theme.spacing(3)
}))

const DASHBOARD_ROUTE = '/corporate-dashboard'

  const getToday = () => {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return `${d.getFullYear()}-${month}-${day}`
}

// 2025-07-03 -> 20250703000000
const toSelectDate = (date: string) => `${date.replace(/-/g, '')}000000`

const Page = () => {
  const router = useRouter()
  const theme = useTheme()
  const { getAll, store } = useDashboard(null)
  const { requestMaintenanceCertificate, isLoading } = useCertificate()

  const {
    user: { userId }
  } = useAuth()

  useEffect(() => {
    getAll(userId)
  }, [])

  const [account, setAccount] = useState('')
  //const [date] = useState<string>(getToday)
  const [successOpen, setSuccessOpen] = useState(false)
  const today = useMemo(getToday, [])
  const [date, setDate] = useState<string>(today)

  const isFutureDate = date > today
  const canSubmit = Boolean(account) && Boolean(date) && !isFutureDate

  const accounts = useMemo(
      () =>
        (store.entities ?? []).filter(
          (acc, index, list) => list.findIndex(item => item?.accountNumber === acc?.accountNumber) === index
        ),
      [store.entities]
    )

  const handleBack = () => {
    router.back()
  }

  const handleSuccessClose = () => {
    setSuccessOpen(false)
    router.push(DASHBOARD_ROUTE)
  }

  const handleRequest = async () => {
    if (!canSubmit || isLoading) return

    const ibanForAccount = accounts.find(acc => acc?.accountNumber === account)?.iban
    try {
      await requestMaintenanceCertificate({
        accountNo: account,
        iban: ibanForAccount,
        selectDate: toSelectDate(date)
      })
      setSuccessOpen(true)
    } catch {
      // Error toast slice me dikh chuka hai
    }
  }

  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button startIcon={<ArrowBackIcon fontSize='small' />} onClick={handleBack} sx={{ color: 'text.secondary' }}>
            Back
          </Button>
          <Typography variant='h5' sx={{ fontWeight: 700 }}>
            Account Maintenance Certificate
          </Typography>
        </Box>
      </Grid>

      {/* Request Details */}
      <Grid item xs={12}>
        <StyledFormCard>
          <StyledSectionTitle>Certificate Details</StyledSectionTitle>

          <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
            Select the account for the certificate you'd like to request. The certificate will be generated as of
            today's date.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                size='small'
                label='Select Account'
                value={account}
                onChange={e => setAccount(e.target.value)}
              >
                {store.entities?.map(acc => (
                  <MenuItem key={acc?.accountNumber} value={acc?.accountNumber}>
                    {acc?.accountNumber}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            fullWidth
                            size='small'
                            type='date'
                            label='Select Date'
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ max: today }}
                            value={date}
                            error={isFutureDate}
                            helperText={isFutureDate ? 'Future dates are not allowed' : ''}
                            onChange={e => setDate(e.target.value)}
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
            loadingPosition='end'
            sx={{ borderColor: 'divider', color: 'text.primary' }}
            onClick={handleBack}
          >
            Cancel
          </LoadingButton>

          <LoadingButton
            variant='contained'
            loadingPosition='start'
            loading={isLoading}
            disabled={!canSubmit}
            startIcon={<DescriptionIcon fontSize='small' />}
            onClick={handleRequest}
          >
            Request
          </LoadingButton>
        </Box>
      </Grid>

      {/* Success confirmation */}
      <Dialog
        open={successOpen}
        onClose={(_event, reason) => {
          if (reason === 'backdropClick') return
          handleSuccessClose()
        }}
        maxWidth='xs'
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogContent sx={{ p: 5, display: 'flex', flexDirection:
'column', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 64, height:
64, mb: 1 }}>
            <CheckCircleIcon sx={{ fontSize: 36, color: '#f5f5f5' }} />
          </Avatar>

          <Typography variant='h6' sx={{ fontWeight: 700 }}>
            Request Submitted
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2.5,
              py: 1.25,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              color: 'primary.main'
            }}
          >
            <MarkEmailReadIcon fontSize='small' />
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Will be sent to your registered email
            </Typography>
          </Box>

          <Typography variant='body2' color='text.secondary' align='center'>
            Your Account Maintenance Certificate request for account <strong>{account}</strong> has been submitted. The
            certificate will be sent to your registered email.
          </Typography>

          <Button fullWidth variant='contained' onClick={handleSuccessClose}>
            Okay
          </Button>
        </DialogContent>
      </Dialog>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'certificates-account-maintenance-certificate-page'
}

export default Page