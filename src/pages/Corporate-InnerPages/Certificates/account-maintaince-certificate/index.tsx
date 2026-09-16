import React, { useState } from 'react'
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

const ACCOUNTS = ['10360112008665011', '10360112008665029', '10360112008665037']

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

const Page = () => {
  const router = useRouter()
  const theme = useTheme()

  const [account, setAccount] = useState('')
  const [date] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [submitting, setSubmitting] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  const canSubmit = Boolean(account) && Boolean(date)

  const handleBack = () => {
    router.back()
  }

  const handleRequest = () => {
    if (!canSubmit) return

    setSubmitting(true)

    // TODO: replace with the real request-certificate API call
    window.setTimeout(() => {
      setSubmitting(false)
      setSuccessOpen(true)
    }, 1200)
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
                {ACCOUNTS.map(acc => (
                  <MenuItem key={acc} value={acc}>
                    {acc}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size='small'
                type='date'
                label='Date'
                disabled
                InputLabelProps={{ shrink: true }}
                value={date}
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
            loading={submitting}
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
          setSuccessOpen(false)
        }}
        maxWidth='xs'
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogContent sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mb: 1 }}>
            <CheckCircleIcon sx={{ fontSize: 36,color:"#f5f5f5" }} />
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
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              color: 'primary.main'
            }}
          >
            <MarkEmailReadIcon fontSize='small' />
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Sent to your registered email
            </Typography>
          </Box>

          <Typography variant='body2' color='text.secondary' align='center'>
            Your Account Maintenance Certificate for account <strong>{account}</strong> has been generated and
            emailed to you.
          </Typography>

          <Button
            fullWidth
            variant='contained'
            onClick={() => setSuccessOpen(false)}
          >
            Okay
          </Button>
        </DialogContent>
      </Dialog>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'account-maintaince-certificate'
}

export default Page