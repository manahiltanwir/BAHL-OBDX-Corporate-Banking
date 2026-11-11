import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { Avatar, Box, Button, Card, Dialog, DialogContent, Grid, MenuItem, TextField, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DescriptionIcon from '@mui/icons-material/Description'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import LoadingButton from '@mui/lab/LoadingButton'
import { useDashboard } from 'src/@core/hooks/apps/useDashboard'
import useCertificate from 'src/@core/hooks/apps/useCertificate'
import { useAuth } from 'src/hooks/useAuth'
import { getToday } from 'src/@core/utils/certificate'

// Success ke baad is page par jana hai (apne dashboard ka route yahan likhein) const DASHBOARD_ROUTE = '/dashboard'

const StyledFormCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4.25),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2]
}))

const DASHBOARD_ROUTE = '/corporate-dashboard'

const Page = () => {
  const router = useRouter()
  const { getAll, store } = useDashboard(null)
  const { requestAccountStatement, isLoading } = useCertificate()

  const {
    user: { userId }
  } = useAuth()

  const today = useMemo(getToday, [])

  const [account, setAccount] = useState('')
  const [fromDate, setFromDate] = useState<string>(today)
  const [toDate, setToDate] = useState<string>(today)
  const [successOpen, setSuccessOpen] = useState(false)

  const isFutureDate = toDate > today
  const isInvalidRange = Boolean(fromDate) && Boolean(toDate) && fromDate > toDate
  const canSubmit = Boolean(account) && Boolean(fromDate) &&
Boolean(toDate) && !isFutureDate && !isInvalidRange

  useEffect(() => {
    if (userId) {
      getAll(userId)
    }
  }, [userId])

  const handleBack = () => {
    router.back()
  }

  const handleSuccessClose = () => {
    setSuccessOpen(false)
    router.push(DASHBOARD_ROUTE)
  }

  const handleRequest = async () => {
    if (!canSubmit || isLoading) return

    try {
      await requestAccountStatement({
        accountNo: account,
        startDate: fromDate,
        endDate: toDate
        // iban: getIban(account)
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
            Request Statement
          </Typography>
        </Box>
      </Grid>

      {/* Request Details */}
      <Grid item xs={12}>
        <StyledFormCard>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
            Please select the time period you're looking for your statement
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
                {store.entities?.map((acc: any) => (
                  <MenuItem key={acc.accountNumber} value={acc.accountNumber}>
                    {acc.accountNumber}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size='small'
                type='date'
                label='Select From Date'
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                // From date, To date se baad ki nahi ho sakti
                inputProps={{ max: toDate || today }}
                error={isInvalidRange}
                helperText={isInvalidRange ? 'From date cannot be after To date' : ''}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size='small'
                type='date'
                label='Select To Date'
                InputLabelProps={{ shrink: true }}
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                // To date, From date se pehle ki nahi ho sakti aur future ki bhi nahi
                inputProps={{ min: fromDate, max: today }}
                error={isFutureDate}
                helperText={isFutureDate ? 'Future dates are not allowed' : ''}
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
          <Avatar sx={{ bgcolor: '#10b981', width: 64, height: 64, mb: 1 }}>
            <CheckCircleIcon sx={{ fontSize: 36 }} />
          </Avatar>

          <Typography variant='h6' sx={{ fontWeight: 700 }}>
            Request Successful
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2.5,
              py: 1.25,
              borderRadius: 2,
              bgcolor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#059669'
            }}
          >
            <MarkEmailReadIcon fontSize='small' />
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Sent to your registered email
            </Typography>
          </Box>

          <Typography variant='body2' color='text.secondary' align='center'>
            Your request for the statement of account <strong>{account}</strong> has been submitted successfully. It
            will be sent to your registered email address.
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
  subject: 'corporate-account-statement-request-statement-page'
}

export default Page