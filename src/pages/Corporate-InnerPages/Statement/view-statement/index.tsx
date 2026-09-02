import React, { useEffect, useState } from 'react'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Divider,
  Button,
  ButtonGroup,
  MenuItem,
  TextField
} from '@mui/material'

import { useSearchParams } from 'next/navigation'

import { useViewStatement } from 'src/@core/hooks/apps/useViewStatement'
import { useDashboard } from 'src/@core/hooks/apps/useDashboard'
import { useAuth } from 'src/hooks/useAuth'

import { CasaAccount } from 'src/@core/components/apps/dashboard/components/CasaAccountCarousel'

// Fixed brand color
const BRAND_COLOR = '#15804f'

const Page = () => {

  const {
    user: { userId }
  } = useAuth()

  const searchParams = useSearchParams()

  const accountNumberFromUrl = searchParams.get('accountNumber')

  const { getAll, store: accountStore } = useDashboard(null)

  const { getViewStatements, store } = useViewStatement(null)

  const [selectedAccount, setSelectedAccount] = useState(accountNumberFromUrl || '')

  const [filter, setFilter] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL')

  const [fromDate, setFromDate] = useState<string>(() => {
    const date = new Date()

    // Default: last 1 month
    date.setMonth(date.getMonth() - 1)

    return date.toISOString().slice(0, 10)
  })

  const [toDate, setToDate] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10)
  })

  useEffect(() => {
    if (!accountNumberFromUrl && userId) {
      getAll(userId)
    }
  }, [accountNumberFromUrl, userId])

  useEffect(() => {
    if (accountNumberFromUrl) {
      setSelectedAccount(accountNumberFromUrl)

      getViewStatements(accountNumberFromUrl, fromDate, toDate)
    }
  }, [accountNumberFromUrl, fromDate, toDate])

  const handleAccountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const accountNumber = event.target.value

    setSelectedAccount(accountNumber)

    // Account change hone par filter ALL kar do
    setFilter('ALL')

    if (accountNumber) {
      getViewStatements(accountNumber, fromDate, toDate)
    }
  }

  const todayDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  const filteredStatements = store.entities.filter(item => {
    const amount = parseFloat(String(item.amount))

    if (filter === 'ALL') {
      return true
    }

    if (filter === 'CREDIT') {
      return amount > 0
    }

    if (filter === 'DEBIT') {
      return amount < 0
    }

    return true
  })

  // =========================================================
  // TOTAL BALANCE
  // =========================================================

  const totalBalanceCalculated = store.entities.reduce((sum, item) => {
    const balance = parseFloat(String(item.remainingBalance))

    return sum + (isNaN(balance) ? 0 : balance)
  }, 0)

  return (
    <Container
      maxWidth='lg'
      sx={{
        mt: 4,
        mb: 4
      }}
    >
      <Grid container spacing={3}>
        {/* =====================================================
            HEADER
        ===================================================== */}

        <Grid item xs={12}>
          <Box sx={{ mb: 1 }}>
            <Typography variant='h5' sx={{ fontWeight: 700 }}>
              Account Statements
            </Typography>

            <Typography variant='body2' color='text.secondary'>
              Reviewing recent transaction activity logs for your active account
            </Typography>

            {/* =================================================
                ACCOUNT LOV
                Only show when page is opened from Hamburger Menu
                ================================================= */}

            {!accountNumberFromUrl && (
              <Box sx={{ mt: 3, maxWidth: 400 }}>
                <TextField
                  select
                  fullWidth
                  size='small'
                  label='Select Account'
                  value={selectedAccount}
                  onChange={handleAccountChange}
                >
                  {accountStore.entities.map(account => {
                    /*
                     * DashboardApi currently doesn't expose
                     * accountNumber in its TypeScript type.
                     *
                     * We know the actual account structure is
                     * CasaAccount, so cast it here.
                     */

                    const acc = account as unknown as CasaAccount

                    return (
                      <MenuItem key={acc.accountNumber} value={acc.accountNumber}>
                        {acc.accountNumber}
                      </MenuItem>
                    )
                  })}
                </TextField>
              </Box>
            )}

            {/* =================================================
                SELECTED ACCOUNT
                ================================================= */}

            {selectedAccount && (
              <Typography
                variant='body2'
                sx={{
                  mt: 2,
                  fontWeight: 600,
                  fontFamily: 'monospace'
                }}
              >
                Account Number: {selectedAccount}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />
        </Grid>

        {/* =====================================================
            TOTAL BALANCE
        ===================================================== */}

        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              backgroundColor: 'rgba(21, 128, 79, 0.06)',
              border: '1px solid rgba(21, 128, 79, 0.15)',
              boxShadow: 'none',
              p: 1
            }}
          >
            <CardContent>
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}
              >
                Total Balance as of today ({todayDate})
              </Typography>

              <Typography
                variant='h4'
                sx={{
                  fontWeight: 800,
                  color: BRAND_COLOR,
                  mt: 0.5
                }}
              >
                PKR{' '}
                {totalBalanceCalculated.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* =====================================================
            FILTER BUTTONS
        ===================================================== */}

        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              mt: 1
            }}
          >
            <ButtonGroup variant='outlined' aria-label='transaction filter button group'>
              {/* ALL */}

              <Button
                onClick={() => setFilter('ALL')}
                sx={{
                  fontWeight: 600,
                  backgroundColor: filter === 'ALL' ? BRAND_COLOR : 'transparent',
                  color: filter === 'ALL' ? '#fff' : BRAND_COLOR,
                  borderColor: BRAND_COLOR,
                  '&:hover': {
                    backgroundColor: filter === 'ALL' ? BRAND_COLOR : 'rgba(21, 128, 79, 0.08)',
                    borderColor: BRAND_COLOR
                  }
                }}
              >
                All Transactions
              </Button>

              {/* CREDIT */}

              <Button
                onClick={() => setFilter('CREDIT')}
                sx={{
                  fontWeight: 600,
                  backgroundColor: filter === 'CREDIT' ? BRAND_COLOR : 'transparent',
                  color: filter === 'CREDIT' ? '#fff' : BRAND_COLOR,
                  borderColor: BRAND_COLOR,
                  '&:hover': {
                    backgroundColor: filter === 'CREDIT' ? BRAND_COLOR : 'rgba(21, 128, 79, 0.08)',
                    borderColor: BRAND_COLOR
                  }
                }}
              >
                Credits (+)
              </Button>

              {/* DEBIT */}

              <Button
                onClick={() => setFilter('DEBIT')}
                sx={{
                  fontWeight: 600,
                  backgroundColor: filter === 'DEBIT' ? BRAND_COLOR : 'transparent',
                  color: filter === 'DEBIT' ? '#fff' : BRAND_COLOR,
                  borderColor: BRAND_COLOR,
                  '&:hover': {
                    backgroundColor: filter === 'DEBIT' ? BRAND_COLOR : 'rgba(21, 128, 79, 0.08)',
                    borderColor: BRAND_COLOR
                  }
                }}
              >
                Debits (-)
              </Button>
            </ButtonGroup>
          </Box>
        </Grid>

        {/* =====================================================
            TRANSACTION TABLE
        ===================================================== */}

        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: theme =>
                theme.palette.mode === 'light' ? '0px 4px 24px rgba(0,0,0,0.06)' : '0px 4px 24px rgba(0,0,0,0.4)'
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: theme => theme.palette.action.hover
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          border: 0,
                          py: 2.5
                        }}
                      >
                        Value Date
                      </TableCell>

                      <TableCell
                        sx={{
                          fontWeight: 700,
                          border: 0,
                          py: 2.5
                        }}
                      >
                        Remaining Balance
                      </TableCell>

                      <TableCell
                        sx={{
                          fontWeight: 700,
                          border: 0,
                          py: 2.5
                        }}
                      >
                        Account Number
                      </TableCell>

                      <TableCell
                        sx={{
                          fontWeight: 700,
                          border: 0,
                          py: 2.5
                        }}
                        align='right'
                      >
                        Amount
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {/* =================================================
                        NO DATA
                    ================================================= */}

                    {filteredStatements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align='center' sx={{ py: 5 }}>
                          <Typography variant='body2' color='text.secondary'>
                            {selectedAccount
                              ? `No recent ${filter.toLowerCase()} logs found.`
                              : 'Please select an account to view statements.'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      /* =================================================
                         DATA
                      ================================================= */

                      filteredStatements.map(row => {
                        const amount = parseFloat(String(row.amount))

                        const isCredit = amount > 0

                        return (
                          <TableRow
                            key={row.id}
                            hover
                            sx={{
                              '&:last-of-type td': {
                                border: 0
                              },
                              transition: 'background-color 0.2s ease'
                            }}
                          >
                            {/* VALUE DATE */}

                            <TableCell sx={{ py: 2.5 }}>
                              <Typography variant='body2' color='text.secondary'>
                                {row.valueDate || row.txnDate}
                              </Typography>
                            </TableCell>

                            {/* REMAINING BALANCE */}

                            <TableCell sx={{ py: 2.5 }}>
                              <Typography
                                variant='body2'
                                sx={{
                                  fontWeight: 600
                                }}
                              >
                                {row.remainingBalance}
                              </Typography>
                            </TableCell>

                            {/* ACCOUNT NUMBER */}

                            <TableCell sx={{ py: 2.5 }}>
                              <Typography
                                variant='body2'
                                sx={{
                                  fontFamily: 'monospace',
                                  letterSpacing: 0.5,
                                  color: 'text.secondary'
                                }}
                              >
                                {row.accountNo}
                              </Typography>
                            </TableCell>

                            {/* AMOUNT */}

                            <TableCell align='right' sx={{ py: 2.5 }}>
                              <Typography
                                variant='body2'
                                sx={{
                                  fontWeight: 700,
                                  color: isCredit ? BRAND_COLOR : '#d32f2f'
                                }}
                              >
                                {isCredit ? '+' : '-'} PKR{' '}
                                {Math.abs(amount).toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'view-statement'
}

export default Page
