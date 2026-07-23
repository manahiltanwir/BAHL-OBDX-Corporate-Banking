import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Typography,
  Box
} from '@mui/material'
import { CasaAccount } from './CasaAccountCarousel'

interface CasaAccountsTableProps {
  accounts: CasaAccount[]
}

// Fixed brand color — sab avatars aur success/green elements isi color me
const BRAND_COLOR = '#15804f'

// Naam se initials nikalta hai — first word ka first letter + last word ka first letter
const getInitials = (name: string) => {
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

const CasaAccountsTable = ({ accounts }: CasaAccountsTableProps) => {
  const totalBalance = accounts.reduce((sum, acc) => {
    const numeric = parseFloat(acc.balance.replace(/,/g, ''))
    return sum + (isNaN(numeric) ? 0 : numeric)
  }, 0)

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: theme =>
          theme.palette.mode === 'light'
            ? '0px 4px 24px rgba(0,0,0,0.06)'
            : '0px 4px 24px rgba(0,0,0,0.4)'
      }}
    >
      <CardHeader
        title={
          <Typography variant='h6' sx={{ fontWeight: 700 }}>
            My Accounts
          </Typography>
        }
        subheader={
          <Typography variant='body2' color='text.secondary'>
            {accounts.length} account{accounts.length !== 1 ? 's' : ''} linked to your profile
          </Typography>
        }
        sx={{ pb: 2 }}
      />
      <CardContent sx={{ pt: 0 }}>
        <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme => theme.palette.action.hover }}>
                <TableCell sx={{ fontWeight: 700, border: 0, py: 3 }}>Account Holder</TableCell>
                <TableCell sx={{ fontWeight: 700, border: 0, py: 3 }}>Account Number</TableCell>
                <TableCell sx={{ fontWeight: 700, border: 0, py: 3 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700, border: 0, py: 3 }} align='right'>
                  Balance
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map(account => (
                <TableRow
                  key={account.id}
                  hover
                  sx={{
                    '&:last-of-type td, &:last-of-type th': { border: 0 },
                    transition: 'background-color 0.2s ease',
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  <TableCell sx={{ py: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Avatar
                        sx={{
                          width: 42,
                          height: 42,
                          fontSize: 15,
                          fontWeight: 700,
                          bgcolor: BRAND_COLOR
                        }}
                      >
                        {getInitials(account.holderName)}
                      </Avatar>
                      <Box>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          {account.holderName}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {account.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ py: 3 }}>
                    <Typography
                      variant='body2'
                      sx={{
                        fontFamily: 'monospace',
                        letterSpacing: 0.5,
                        color: 'text.secondary'
                      }}
                    >
                      {account.accountNumber}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 3 }}>
                    <Chip
                      label={account.label}
                      size='small'
                      variant='outlined'
                      sx={{
                        fontWeight: 600,
                        borderRadius: 1.5,
                        color: BRAND_COLOR,
                        borderColor: BRAND_COLOR
                      }}
                    />
                  </TableCell>

                  <TableCell align='right' sx={{ py: 3 }}>
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>
                      {account.currency} {account.balance}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 4,
            p: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(21, 128, 79, 0.08)'
          }}
        >
          <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 500 }}>
            Total Balance across all accounts
          </Typography>
          <Typography variant='h6' sx={{ fontWeight: 700, color: BRAND_COLOR }}>
            PKR {totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CasaAccountsTable