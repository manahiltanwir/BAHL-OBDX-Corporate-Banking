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
import { alpha } from '@mui/material/styles'
import { useSearchParams } from 'next/navigation'
import { useViewStatement } from 'src/@core/hooks/apps/useViewStatement'
import { useDashboard } from 'src/@core/hooks/apps/useDashboard'
import { useAuth } from 'src/hooks/useAuth'
import { CasaAccount } from 'src/@core/components/apps/dashboard/components/CasaAccountCarousel'

const BRAND_COLOR = '#15804f'

interface StatementEntry {
  id: string | number
  valueDate?: string
  txnDate?: string
  remainingBalance: number | string
  accountNo: string
  amount: number | string
}

const Page = () => {
  const {
    user: { userId }
  } = useAuth()
  const searchParams = useSearchParams()
  const accountNumberFromUrl = searchParams.get('accountNumber')
  const { getAll, store: accountStore } = useDashboard(null)
  const { getViewStatements, store } = useViewStatement(null)
  const entities = store.entities as unknown as StatementEntry[]
  const [selectedAccount, setSelectedAccount] = useState(accountNumberFromUrl || '')
  const [filter, setFilter] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL')
  const [fromDate, setFromDate] = useState<string>(() => {

    const date = new Date()
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

  const filteredStatements = entities.filter(item => {
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


  const totalBalanceCalculated = entities.length
    ? parseFloat(String(entities[0].remainingBalance)) || 0
    : 0

  return (
    <Container
      maxWidth='lg'
      sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: 1 }}>
            <Typography variant='h5' sx={{ fontWeight: 700 }}>
              Account Statements
            </Typography>

            <Typography variant='body2' color='text.secondary'>
              Reviewing recent transaction activity logs for your active account
            </Typography>

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

            {selectedAccount && (
              <Typography
                variant='body2'
                sx={{ mt: 2, fontWeight: 600, fontFamily: 'monospace' }}>
                Account Number: {selectedAccount}
              </Typography>
            )}
          </Box>
          <Divider sx={{ my: 2 }} />
        </Grid>

       <Grid item xs={12}>
  <Card
    sx={{
      borderRadius: 3,
      backgroundColor: alpha(BRAND_COLOR, 0.06),
      border: `1px solid ${alpha(BRAND_COLOR, 0.15)}`,
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

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
            <ButtonGroup variant='outlined' aria-label='transaction filter button group'>
              {(['ALL', 'CREDIT', 'DEBIT'] as const).map(type => (
                <Button
                  key={type}
                  onClick={() => setFilter(type)}
                >
                  {type === 'ALL' ? 'All Transactions' : type === 'CREDIT' ? 'Credits (+)' : 'Debits (-)'}
                </Button>
              ))}
            </ButtonGroup>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {['Value Date', 'Remaining Balance', 'Account Number'].map(label => (
                        <TableCell key={label} sx={{ fontWeight: 700, border: 0, py: 2.5 }}>
                          {label}
                        </TableCell>
                      ))}
                      <TableCell sx={{ fontWeight: 700, border: 0, py: 2.5 }} align='right'>
                        Amount
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
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
                      filteredStatements.map(row => {
                        const amount = parseFloat(String(row.amount))
                        const isCredit = amount > 0

                        return (
                          <TableRow
                            key={row.id}
                            hover
                            sx={{
                              '&:last-of-type td': { border: 0 },
                              transition: 'background-color 0.2s ease'
                            }}
                          >
                            <TableCell sx={{ py: 2.5 }}>
                              <Typography variant='body2' color='text.secondary'>
                                {row.valueDate || row.txnDate}
                              </Typography>
                            </TableCell>

                            <TableCell sx={{ py: 2.5 }}>
                              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                {row.remainingBalance}
                              </Typography>
                            </TableCell>

                            <TableCell sx={{ py: 2.5 }}>
                              <Typography
                                variant='body2'
                                sx={{ fontFamily: 'monospace', letterSpacing: 0.5, color: 'text.secondary' }}
                              >
                                {row.accountNo}
                              </Typography>
                            </TableCell>

                            <TableCell align='right' sx={{ py: 2.5 }}>
                              <Typography
                                variant='body2'
                                sx={{ fontWeight: 700, color: isCredit ? BRAND_COLOR : '#d32f2f' }}
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