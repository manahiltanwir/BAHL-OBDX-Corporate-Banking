import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Divider,
  Stack,
  Skeleton,
  MenuItem,
  TextField,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material'

import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ScheduleIcon from '@mui/icons-material/Schedule'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'

type TxStatus = 'Success' | 'Pending' | 'Failed'

export interface Transaction {
  id?: string
  name: string
  remarks?: string // transaction ki narration (poori detail)
  amount: number
  currency?: string
  status: TxStatus
  type?: 'credit' | 'debit' // credit ya debit; amount par +/- aur rang isi se aata hai
  dateTime?: string // date aur time ek hi field me, maslan '24-Nov-2026, 11:42 AM' ya '24-Nov-2026'
}

export interface AccountOption {
  value: string
  label: string
}

interface RecentTransactionsProps {
  transactions?: Transaction[]
  loading?: boolean
  onViewAll?: () => void
  accounts?: AccountOption[]
  selectedAccount?: string
  onAccountChange?: (value: string) => void
}

const formatPKR = (value: number) =>
  new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(value)

const SUCCESS_COLOR = '#15804f'

// List ki zyada se zyada height. Isse zyada transactions hon to list scroll hogi
const LIST_MAX_HEIGHT = 360

const RecentTransactions = ({
  transactions = [],
  loading = false,
  onViewAll,
  accounts = [],
  selectedAccount,
  onAccountChange
}: RecentTransactionsProps) => {
  const theme = useTheme()

  // Mouse wali device par hover se expand hota hai, touch device par tap se
  const canHover = useMediaQuery('(hover: hover)')
  const [expandedKey, setExpandedKey] = useState<string | null>(null)

  // Parent selectedAccount na de to LOV apni state se chalega
  const [localAccount, setLocalAccount] = useState(accounts[0]?.value ?? '')
  const currentAccount = selectedAccount ?? localAccount

  const handleAccountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setLocalAccount(value)
    setExpandedKey(null)
    onAccountChange?.(value)
  }

  const statusMeta: Record<TxStatus, { hex: string; icon: React.ReactElement }> = {
    Success: { hex: SUCCESS_COLOR, icon: <CheckCircleIcon fontSize="small" /> },
    Pending: { hex: theme.palette.warning.main, icon: <ScheduleIcon fontSize="small" /> },
    Failed: { hex: theme.palette.error.main, icon: <ScheduleIcon fontSize="small" /> }
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid transparent',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.18)}`,
          borderColor: theme.palette.primary.main
        }
      }}
    >
      <CardHeader
        title="Recent Transactions"
        titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
        action={
          <Button size="small" endIcon={<ArrowForwardIcon />} onClick={onViewAll}>
            View all
          </Button>
        }
      />

      <Divider />

      {accounts.length > 0 && (
        <Box sx={{ px: 4, pt: 3, pb: 1 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Select Account"
            value={currentAccount}
            onChange={handleAccountChange}
          >
            {accounts.map(account => (
              <MenuItem key={account.value} value={account.value}>
                {account.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}

      {/* Header aur account LOV fixed rehte hain, sirf yeh list scroll hoti hai */}
      <Box
        sx={{
          px: 4,
          py: 2,
          flex: 1,
          minHeight: 0,
          maxHeight: LIST_MAX_HEIGHT,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          // Scrollbar hamesha nazar aaye (Mac par overlay scrollbar hide ho jata hai)
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: 8 },
          '&::-webkit-scrollbar-track': { backgroundColor: alpha(theme.palette.text.primary, 0.05) },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.text.primary, 0.3),
            borderRadius: 4
          }
        }}
      >
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Stack key={i} direction="row" spacing={2} alignItems="center" sx={{ py: 1.5 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="50%" />
                <Skeleton width="30%" />
              </Box>
            </Stack>
          ))}

        {!loading && transactions.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <ReceiptLongIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">No recent transactions.</Typography>
          </Box>
        )}

        {!loading &&
          transactions.map((item, index) => {
            const key = item.id ?? `${item.name}-${index}`
            const hasRemarks = Boolean(item.remarks)
            const isExpanded = expandedKey === key

            return (
              <React.Fragment key={key}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  onMouseEnter={canHover && hasRemarks ? () => setExpandedKey(key) : undefined}
                  onMouseLeave={canHover ? () => setExpandedKey(prev => (prev === key ? null : prev)) : undefined}
                  onClick={!canHover && hasRemarks ? () => setExpandedKey(isExpanded ? null : key) : undefined}
                  sx={{
                    py: 1.75,
                    px: 1,
                    mx: -1,
                    borderRadius: 2,
                    cursor: hasRemarks ? 'pointer' : 'default',
                    transition: 'background-color 0.2s ease',
                    bgcolor: isExpanded ? alpha(theme.palette.primary.main, 0.05) : 'transparent'
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(statusMeta[item.status].hex, 0.12),
                        color: statusMeta[item.status].hex,
                        width: 40,
                        height: 40,
                        flexShrink: 0
                      }}
                    >
                      <SwapHorizIcon fontSize="small" />
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight={600} variant="body2">
                        {item.name}
                      </Typography>
                      {item.dateTime && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {item.dateTime}
                        </Typography>
                      )}
                      {hasRemarks && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: isExpanded ? 'block' : '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: isExpanded ? 'unset' : 1,
                            overflow: 'hidden',
                            wordBreak: 'break-word',
                            mt: 0.25
                          }}
                        >
                          {item.remarks}
                        </Typography>
                      )}
                    </Box>
                  </Stack>

                  <Stack alignItems="flex-end" spacing={0.5} sx={{ flexShrink: 0, ml: 2 }}>
                    <Typography
                      fontWeight={700}
                      variant="body2"
                      sx={{
                        color: item.type === 'debit' ? 'error.main' : item.type === 'credit' ? SUCCESS_COLOR : 'text.primary'
                      }}
                    >
                      {item.type === 'debit' ? '- ' : item.type === 'credit' ? '+ ' : ''}
                      {item.currency ?? 'USD'} {item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Typography>
                    <Chip
                      icon={statusMeta[item.status].icon}
                      label={item.status}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 22,
                        color: statusMeta[item.status].hex,
                        borderColor: alpha(statusMeta[item.status].hex, 0.5),
                        '& .MuiChip-icon': { fontSize: 14, color: statusMeta[item.status].hex }
                      }}
                    />
                  </Stack>
                </Stack>

                {index < transactions.length - 1 && <Divider />}
              </React.Fragment>
            )
          })}
      </Box>
    </Card>
  )
}

export default RecentTransactions
