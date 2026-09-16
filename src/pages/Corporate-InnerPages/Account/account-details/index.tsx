import React, { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  Avatar,
  Stack,
  Snackbar,
  Button
} from '@mui/material'

// ** Icons
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopyOutlined'
import CheckIcon from '@mui/icons-material/Check'
import ArrowBackIcon from '@mui/icons-material/ArrowBackOutlined'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined'
import TagOutlinedIcon from '@mui/icons-material/TagOutlined'

import { useDashboard } from 'src/@core/hooks/apps/useDashboard'

interface Account {
  accountNumber: string
  accountStatus: string
  accountTitle: string
  accountType: string
  balance: number
  createdDate: string
  partyId: string
}

// Maps backend status strings to a chip color + readable label.
// Extend this if new statuses are introduced on the backend.
const STATUS_MAP: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'default' }> = {
  active: { label: 'Active', color: 'success' },
  dormant: { label: 'Dormant', color: 'warning' },
  inactive: { label: 'Inactive', color: 'warning' },
  blocked: { label: 'Blocked', color: 'error' },
  closed: { label: 'Closed', color: 'error' },
  frozen: { label: 'Frozen', color: 'error' }
}

const getStatusMeta = (status?: string) => {
  if (!status) return { label: 'Unknown', color: 'default' as const }
  const key = status.toLowerCase()

  return STATUS_MAP[key] ?? { label: status, color: 'default' as const }
}

const maskAccountNumber = (value: string) => {
  const visible = value.slice(-4)
  const masked = value.slice(0, -4).replace(/./g, '•')
  const grouped = (masked + visible).match(/.{1,4}/g)?.join(' ') ?? value

  return value
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(Number(amount) || 0)

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

interface InfoRowProps {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <Stack direction='row' spacing={2} alignItems='flex-start' sx={{ py: 1.5 }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 38,
        height: 38,
        borderRadius: '10px',
        bgcolor: 'action.hover',
        color: 'text.secondary',
        flexShrink: 0
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant='caption' color='text.secondary' sx={{ display: 'block', lineHeight: 1.4 }}>
        {label}
      </Typography>
      <Typography variant='body1' sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Box>
  </Stack>
)

const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Account number selected from the dashboard
  const accountNumber = searchParams.get('accountNumber')

  // Existing dashboard redux store
  const { store } = useDashboard(null)

  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [numberRevealed, setNumberRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!accountNumber) {
      setLoading(false)
      return
    }

    if (!store.entities || store.entities.length === 0) {
      return
    }

    const selectedAccount = store.entities.find((item: any) => item.accountNumber === accountNumber)

    setAccount(selectedAccount || null)
    setLoading(false)
  }, [accountNumber, store.entities])

  const statusMeta = useMemo(() => getStatusMeta(account?.accountStatus), [account])

  const handleCopy = async () => {
    if (!account) return
    try {
      await navigator.clipboard.writeText(account.accountNumber)
      setCopied(true)
    } catch {
      // Clipboard access can fail (e.g. unsupported browser) — fail silently
    }
  }

  // ---------- Loading state ----------
  if (loading) {
    return (
      <Container maxWidth='md' sx={{ mt: 4, mb: 4 }}>
        <Skeleton variant='text' width={140} height={32} sx={{ mb: 2 }} />
        <Card>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Skeleton variant='circular' width={48} height={48} />
            <Skeleton variant='text' width='40%' height={36} sx={{ mt: 2 }} />
            <Skeleton variant='text' width='25%' />
            <Divider sx={{ my: 3 }} />
            <Grid container spacing={3}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Skeleton variant='text' width='60%' />
                  <Skeleton variant='text' width='80%' height={28} />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    )
  }

  // ---------- Not found state ----------
  if (!account) {
    return (
      <Container maxWidth='sm' sx={{ mt: 8, mb: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6, px: 4 }}>
            <ErrorOutlineIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant='h6' sx={{ mb: 1 }}>
              Account not found
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              {accountNumber
                ? `We couldn't find an account matching ${accountNumber}. It may have been moved or the link is out of date.`
                : 'No account was selected. Go back to the dashboard and choose an account to view.'}
            </Typography>
            <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={() => router.back()}>
              Back to dashboard
            </Button>
          </CardContent>
        </Card>
      </Container>
    )
  }

  // ---------- Main content ----------
  return (
    <Container>
        <Grid item xs={12}>
          <Typography variant='h5' sx={{ fontWeight: 700 }}>
            Account Details
          </Typography>
      </Grid>
      <Card variant='outlined'>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent='space-between'
          >
            <Stack direction='row' spacing={2} alignItems='center'>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48,color:'#f5f5f5' }}>
                <AccountBalanceIcon />
              </Avatar>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                  {account.accountTitle}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {account.accountType} account
                </Typography>
              </Box>
            </Stack>
            <Chip label={statusMeta.label} color={statusMeta.color} size='small' sx={{ fontWeight: 500 }} />
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Account number + balance */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={7}>
              <Typography variant='caption' color='text.secondary'>
                Account number
              </Typography>
              <Stack direction='row' spacing={0.5} alignItems='center'>
                <Typography variant='h6' sx={{ fontFamily: 'monospace', letterSpacing: 0.5 }}>
                  {numberRevealed ? account.accountNumber : maskAccountNumber(account.accountNumber)}
                </Typography>
              
                <Tooltip title='Copy account number'>
                  <IconButton size='small' onClick={handleCopy}>
                    {copied ? <CheckIcon fontSize='small' color='success' /> : <ContentCopyIcon fontSize='small' />}
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={5}>
              <Typography variant='caption' color='text.secondary'>
                Available balance
              </Typography>
              <Typography variant='h5' sx={{ fontWeight: 700, color: 'primary.main' }}>
                {formatCurrency(account.balance)}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Detail rows */}
          <Typography variant='subtitle2' color='text.secondary' sx={{ mb: 1, fontWeight: 700 }}>
            Account details
          </Typography>
          <Grid container spacing={{ xs: 0, sm: 2 }}>
            <Grid item xs={12} sm={6}>
              <InfoRow icon={<CategoryOutlinedIcon fontSize='small' />} label='Account type' value={account.accountType} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow
                icon={<BadgeOutlinedIcon fontSize='small' />}
                label='Account status'
                value={statusMeta.label}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow icon={<PersonOutlineIcon fontSize='small' />} label='Party ID' value={account.partyId} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow
                icon={<EventOutlinedIcon fontSize='small' />}
                label='Account opened'
                value={formatDate(account.createdDate)}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <InfoRow
                icon={<TagOutlinedIcon fontSize='small' />}
                label='Full account number'
                value={account.accountNumber}
              />
            </Grid> */}
          </Grid>
        </CardContent>
      </Card>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message='Account number copied'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'account-details'
}

export default Page