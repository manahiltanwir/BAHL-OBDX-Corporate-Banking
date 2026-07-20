import React from 'react'
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
  useTheme,
  alpha
} from '@mui/material'

import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ScheduleIcon from '@mui/icons-material/Schedule'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'


type TxStatus = 'Success' | 'Pending' | 'Failed'

export interface Transaction {
  name: string
  amount: number
  status: TxStatus
  time: string
}

interface RecentTransactionsProps {
  transactions?: Transaction[]
  loading?: boolean
  onViewAll?: () => void
}

const defaultTransactions: Transaction[] = [
  { name: 'Vendor Payment', amount: 500000, status: 'Success', time: 'Today, 11:42 AM' },
  { name: 'Salary Transfer', amount: 250000, status: 'Pending', time: 'Today, 9:15 AM' },
  { name: 'Utility Bill Payment', amount: 75000, status: 'Success', time: 'Yesterday, 6:03 PM' },
  { name: 'Bulk Payment Processing', amount: 850000, status: 'Success', time: 'Yesterday, 3:45 PM' },
  { name: 'Tax Payment', amount: 180000, status: 'Pending', time: 'Monday, 12:10 PM' }
]

const formatPKR = (value: number) =>
  new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(value)

const SUCCESS_COLOR = '#15804f'

const RecentTransactions = ({
  transactions = defaultTransactions,
  loading = false,
  onViewAll
}: RecentTransactionsProps) => {
  const theme = useTheme()

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

      <Box sx={{ px: 4, py: 2 }}>
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
            <Typography color="text.secondary">No transactions yet today.</Typography>
          </Box>
        )}

        {!loading &&
          transactions.map((item, index) => (
            <React.Fragment key={item.name + index}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ py: 1.75 }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: alpha(statusMeta[item.status].hex, 0.12),
                      color: statusMeta[item.status].hex,
                      width: 40,
                      height: 40
                    }}
                  >
                    <SwapHorizIcon fontSize="small" />
                  </Avatar>

                  <Box>
                    <Typography fontWeight={600} variant="body2">
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.time}
                    </Typography>
                  </Box>
                </Stack>

                <Stack alignItems="flex-end" spacing={0.5}>
                  <Typography fontWeight={700} variant="body2">
                    PKR {formatPKR(item.amount)}
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
          ))}
      </Box>
    </Card>
  )
}

export default RecentTransactions