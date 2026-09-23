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
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'

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
  const key = status.toLowerCase()

  return STATUS_MAP[key] ?? { label: status, color: 'default' as const }
  // Note: 'active' now maps to the 'primary' chip color instead of 'success'
}

// NOTE: previously this function computed a masked+grouped value but then
// returned the raw `value` by mistake, so the account number was NEVER
// actually masked. Fixed below — it now returns the grouped, masked string.
const maskAccountNumber = (value: string) => {
  if (!value) return '—'
  const visible = value.slice(-4)
  const masked = value.slice(0, -4).replace(/./g, '•')
  const grouped = (masked + visible).match(/.{1,4}/g)?.join(' ') ?? value

  return grouped
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

const Page = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 'view=details' is a plain UI-mode marker — never the account number
  // itself — so it's safe to keep in the URL. It's what lets Back
  // navigation behave correctly for both entry points:
  //  - Drawer → picker (no marker) → select → details (marker added) →
  //    Back removes the marker and returns to the picker.
  //  - Dashboard/carousel → details directly (marker added in the same
  //    navigation) → Back goes straight back to the dashboard.
  const isDetailsView = searchParams.get('view') === 'details'

  // The actual account number is only ever passed via sessionStorage, never
  // the URL — an account number in the URL would leak into browser history,
  // server access logs, and any referrer headers, which is a real exposure
  // for sensitive account data.
  const STORAGE_KEY = 'selectedAccountNumber'

  // Existing dashboard redux store
  const { store } = useDashboard(null)

  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [numberRevealed, setNumberRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isDetailsView) {
      // Picker mode — nothing to load.
      setAccount(null)
      setLoading(false)
      return
    }

    let stored: string | null = null
    try {
      stored = sessionStorage.getItem(STORAGE_KEY)
    } catch {
      // sessionStorage can be unavailable (e.g. strict privacy mode)
      stored = null
    }

    if (!stored) {
      setAccount(null)
      setLoading(false)
      return
    }

    if (!store.entities || store.entities.length === 0) {
      return
    }

    const selectedAccount = store.entities.find((item: any) => item.accountNumber === stored)

    setAccount(selectedAccount || null)
    setLoading(false)
  }, [isDetailsView, store.entities])

  const statusMeta = useMemo(() => getStatusMeta(account?.accountStatus), [account])

  const handleSelectAccount = (event: SelectChangeEvent<string>) => {
    const value = event.target.value
    if (!value) return
    try {
      sessionStorage.setItem(STORAGE_KEY, value)
    } catch {
      // sessionStorage can be unavailable — the effect above will just find nothing on next read
    }

    // Push a new history entry so Back returns to the picker, not straight
    // past it to whatever page came before the drawer click.
    router.push(`${pathname}?view=details`)
  }

  const handleCopy = async () => {
    if (!account) return
    try {
      await navigator.clipboard.writeText(account.accountNumber)
      setCopied(true)
    } catch {
      // Clipboard access can fail (e.g. unsupported browser) — fail silently
    }
  }

  // ---------- Page shell: always full width, consistent padding ----------
  const Shell = ({ children }: { children: React.ReactNode }) => (
    <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 5 }, py: { xs: 3, md: 4 } }}>{children}</Box>
  )

  // ---------- Loading state ----------
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

  // ---------- No account selected yet (e.g. opened from the drawer, not the dashboard) ----------
  // Show a picker so the user can choose which account to view, instead of a dead-end error.
  if (!isDetailsView) {
    const availableAccounts: any[] = store.entities || []

    return (
      <Shell>
        <Stack direction='row' alignItems='center' spacing={1.5} sx={{ mb: 3 }}>
          <IconButton size='small' onClick={() => router.back()} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <ArrowBackIcon fontSize='small' />
          </IconButton>
          <Typography variant='h5' sx={{ fontWeight: 700 }}>
            Account Details
          </Typography>
        </Stack>

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

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant='caption' color='text.secondary'>
                  Account
                </Typography>
                <FormControl fullWidth size='medium' sx={{ mt: 0.5 }} disabled={availableAccounts.length === 0}>
                  <Select
                    displayEmpty
                    value=''
                    onChange={handleSelectAccount}
                    sx={{
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      '& .MuiSelect-select': { py: 1.5 }
                    }}
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
                    {availableAccounts.map((acc: any) => (
                      <MenuItem key={acc.accountNumber} value={acc.accountNumber} sx={{ fontSize: '1.05rem', fontWeight: 600 }}>
                        {acc.accountTitle} — {maskAccountNumber(acc.accountNumber)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Shell>
    )
  }

  // ---------- Not found state (accountNumber given but no match) ----------
  if (!account) {
    return (
      <Shell>
        <Box sx={{ maxWidth: 480, mx: 'auto', mt: { xs: 4, md: 8 } }}>
          <Card variant='outlined' sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 6, px: 4 }}>
              <ErrorOutlineIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant='h6' sx={{ mb: 1, fontWeight: 700 }}>
                Account not found
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                We couldn't find that account. It may have been moved, or the link is out of date.
              </Typography>
              <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={() => router.back()}>
                Back to dashboard
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Shell>
    )
  }

  // ---------- Main content ----------
  return (
    <Shell>
      <Stack direction='row' alignItems='center' spacing={1.5} sx={{ mb: 3 }}>
        <IconButton size='small' onClick={() => router.back()} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <ArrowBackIcon fontSize='small' />
        </IconButton>
        <Typography variant='h5' sx={{ fontWeight: 700 }}>
          Account Details
        </Typography>
      </Stack>

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

          {/* Account number + balance */}
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
                    {numberRevealed ? (
                      <VisibilityOffOutlinedIcon fontSize='small' />
                    ) : (
                      <VisibilityOutlinedIcon fontSize='small' />
                    )}
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

          {/* Detail rows */}
          <Typography variant='subtitle2' color='text.secondary' sx={{ mb: 1, fontWeight: 700 }}>
            Account details
          </Typography>
          <Grid container rowSpacing={0} columnSpacing={4}>
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
              <InfoRow
                icon={<EventOutlinedIcon fontSize='small' />}
                label='Account opened'
                value={formatDate(account.createdDate)}
              />
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