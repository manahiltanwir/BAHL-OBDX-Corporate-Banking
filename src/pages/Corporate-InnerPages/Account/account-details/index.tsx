import React, { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Box,
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
  Button,
  FormControl,
  Select,
  MenuItem
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'

import AccountBalanceIcon from '@mui/icons-material/AccountBalanceOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopyOutlined'
import CheckIcon from '@mui/icons-material/Check'
import ArrowBackIcon from '@mui/icons-material/ArrowBackOutlined'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

import { useDashboard } from 'src/@core/hooks/apps/useDashboard'

const STORAGE_KEY = 'selectedAccountNumber'

const STATUS_MAP: Record<string, { label: string; color: 'primary' | 'warning' | 'error' | 'default' }> = {
  active: { label: 'Active', color: 'primary' },
  dormant: { label: 'Dormant', color: 'warning' },
  inactive: { label: 'Inactive', color: 'warning' },
  blocked: { label: 'Blocked', color: 'error' },
  closed: { label: 'Closed', color: 'error' },
  frozen: { label: 'Frozen', color: 'error' }
}

const getStatusMeta = (status?: string) => {
  if (!status) return { label: 'Unknown', color: 'default' as const }
  return STATUS_MAP[status.toLowerCase()] ?? { label: status, color: 'default' as const }
}

const maskAccountNumber = (value: string) => {
  if (!value) return '—'
  const visible = value.slice(-4)
  const masked = value.slice(0, -4).replace(/./g, '•')
  return (masked + visible).match(/.{1,4}/g)?.join(' ') ?? value
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(
    Number(amount) || 0
  )

const formatDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const Shell = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 5 }, py: { xs: 3, md: 4 } }}>{children}</Box>
)

const PageHeader = ({ onBack }: { onBack: () => void }) => (
  <Stack direction='row' alignItems='center' spacing={1.5} sx={{ mb: 3 }}>
    <IconButton size='small' onClick={onBack} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <ArrowBackIcon fontSize='small' />
    </IconButton>
    <Typography variant='h5' sx={{ fontWeight: 700 }}>
      Account Details
    </Typography>
  </Stack>
)

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <Stack direction='row' spacing={2} alignItems='flex-start' sx={{ py: 1.5 }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: '10px',
        bgcolor: 'action.hover',
        color: 'primary.main',
        flexShrink: 0
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant='caption' color='text.secondary' sx={{ display: 'block', lineHeight: 1.4 }}>
        {label}
      </Typography>
      <Typography variant='body1' sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Box>
  </Stack>
)

const StateCard = ({
  icon,
  title,
  description,
  action
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}) => (
  <Box sx={{ maxWidth: 480, mx: 'auto', mt: { xs: 4, md: 8 } }}>
    <Card variant='outlined' sx={{ borderRadius: 3 }}>
      <CardContent sx={{ textAlign: 'center', py: 6, px: 4 }}>
        {icon}
        <Typography variant='h6' sx={{ mt: 2, mb: 1, fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          {description}
        </Typography>
        {action}
      </CardContent>
    </Card>
  </Box>
)

const Page = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isDetailsView = searchParams.get('view') === 'details'
  const { store } = useDashboard(null)
  const availableAccounts: any[] = store.entities || []
  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [numberRevealed, setNumberRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isDetailsView) {
      setAccount(null)
      setLoading(false)
      return
    }

    let stored: string | null = null
    try {
      stored = sessionStorage.getItem(STORAGE_KEY)
    } catch {
      stored = null
    }

    if (!stored) {
      setAccount(null)
      setLoading(false)
      return
    }

    if (!availableAccounts.length) {
      return // wait for entities to load
    }

    setAccount(availableAccounts.find(a => a.accountNumber === stored) || null)
    setLoading(false)
  }, [isDetailsView, availableAccounts])

  const statusMeta = useMemo(() => getStatusMeta(account?.accountStatus), [account])

  const handleSelectAccount = (event: SelectChangeEvent<string>) => {
    const value = event.target.value
    if (!value) return
    try {
      sessionStorage.setItem(STORAGE_KEY, value)
    } catch {
      // sessionStorage unavailable — the effect above will just find nothing
    }
    router.push(`${pathname}?view=details`)
  }

  const handleCopy = async () => {
    if (!account) return
    try {
      await navigator.clipboard.writeText(account.accountNumber)
      setCopied(true)
    } catch {
      // clipboard access can fail — fail silently
    }
  }

  if (loading) {
    return (
      <Shell>
        <Skeleton variant='text' width={180} height={36} sx={{ mb: 3 }} />
        <Card variant='outlined' sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction='row' spacing={2} alignItems='center'>
              <Skeleton variant='circular' width={48} height={48} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant='text' width='30%' height={32} />
                <Skeleton variant='text' width='18%' />
              </Box>
            </Stack>
            <Divider sx={{ my: 3 }} />
            <Grid container spacing={3}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Skeleton variant='text' width='40%' />
                  <Skeleton variant='text' width='70%' height={28} />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Shell>
    )
  }

  // No account chosen yet (opened from the drawer) — let the user pick one
  if (!isDetailsView) {
    return (
      <Shell>
        <PageHeader onBack={() => router.back()} />
        <Card variant='outlined' sx={{ borderRadius: 3, width: '100%' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction='row' spacing={2} alignItems='center'>
              <Avatar sx={{ bgcolor: 'primary.main', width: 52, height: 52, color: '#f5f5f5' }}>
                <AccountBalanceWalletOutlinedIcon />
              </Avatar>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                  Select an account
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Choose an account below to view its details
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant='caption' color='text.secondary'>
              Account
            </Typography>
            <FormControl fullWidth sx={{ mt: 0.5 }} disabled={availableAccounts.length === 0}>
              <Select
                displayEmpty
                value=''
                onChange={handleSelectAccount}
                sx={{ fontSize: '1.05rem', fontWeight: 600, '& .MuiSelect-select': { py: 1.5 } }}
                MenuProps={{ PaperProps: { style: { maxHeight: 320 } } }}
                renderValue={() => (
                  <Typography component='span' sx={{ fontSize: '1.05rem', fontWeight: 600, color: 'text.disabled' }}>
                    Choose an account
                  </Typography>
                )}
              >
                {availableAccounts.length === 0 && (
                  <MenuItem value='' disabled sx={{ fontSize: '1.05rem' }}>
                    No accounts available
                  </MenuItem>
                )}
                {availableAccounts.map(acc => (
                  <MenuItem key={acc.accountNumber} value={acc.accountNumber} sx={{ fontSize: '1.05rem', fontWeight: 600 }}>
                    {acc.accountTitle} — {maskAccountNumber(acc.accountNumber)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Shell>
    )
  }

  if (!account) {
    return (
      <Shell>
        <StateCard
          icon={<ErrorOutlineIcon sx={{ fontSize: 48, color: 'text.disabled' }} />}
          title='Account not found'
          description="We couldn't find that account. It may have been moved, or the link is out of date."
          action={
            <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={() => router.back()}>
              Back to dashboard
            </Button>
          }
        />
      </Shell>
    )
  }

  return (
    <Shell>
      <PageHeader onBack={() => router.back()} />

      <Card variant='outlined' sx={{ borderRadius: 3, width: '100%' }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent='space-between'
          >
            <Stack direction='row' spacing={2} alignItems='center'>
              <Avatar sx={{ bgcolor: 'primary.main', width: 52, height: 52, color: '#f5f5f5' }}>
                <AccountBalanceIcon />
              </Avatar>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                  {account.accountTitle}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {account.accountType} account
                </Typography>
              </Box>
            </Stack>
            <Chip label={statusMeta.label} color={statusMeta.color} size='small' sx={{ fontWeight: 600, px: 0.5 }} />
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={7}>
              <Typography variant='caption' color='text.secondary'>
                Account number
              </Typography>
              <Stack direction='row' spacing={0.5} alignItems='center' sx={{ mt: 0.5 }}>
                <Typography variant='h6' sx={{ fontFamily: 'monospace', letterSpacing: 0.5 }}>
                  {numberRevealed ? account.accountNumber : maskAccountNumber(account.accountNumber)}
                </Typography>
                <Tooltip title={numberRevealed ? 'Hide account number' : 'Show account number'}>
                  <IconButton size='small' onClick={() => setNumberRevealed(prev => !prev)}>
                    {numberRevealed ? <VisibilityOffOutlinedIcon fontSize='small' /> : <VisibilityOutlinedIcon fontSize='small' />}
                  </IconButton>
                </Tooltip>
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
              <Typography variant='h5' sx={{ fontWeight: 700, color: 'primary.main', mt: 0.5 }}>
                {formatCurrency(account.balance)}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant='subtitle2' color='text.secondary' sx={{ mb: 1, fontWeight: 700 }}>
            Account details
          </Typography>
          <Grid container columnSpacing={4}>
            <Grid item xs={12} sm={6}>
              <InfoRow icon={<CategoryOutlinedIcon fontSize='small' />} label='Account type' value={account.accountType} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow icon={<BadgeOutlinedIcon fontSize='small' />} label='Account status' value={statusMeta.label} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow icon={<PersonOutlineIcon fontSize='small' />} label='Party ID' value={account.partyId} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow icon={<EventOutlinedIcon fontSize='small' />} label='Account opened' value={formatDate(account.createdDate)} />
            </Grid>
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
    </Shell>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'account-details'
}

export default Page