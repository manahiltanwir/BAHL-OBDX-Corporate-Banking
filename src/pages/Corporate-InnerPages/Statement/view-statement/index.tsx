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
  ButtonGroup
} from '@mui/material'
import { useViewStatement } from 'src/@core/hooks/apps/useViewStatement'

// Fixed brand color
const BRAND_COLOR = '#15804f'

// Mock Hardcoded Transactions Dataset
const MOCK_STATEMENTS = [
  {
    id: 'TXN-10023',
    date: '15 Aug 2026',
    description: 'Online Transfer via 1LINK',
    referenceNo: 'FT262278910245',
    type: 'CREDIT',
    amount: '120000.00'
  },
  {
    id: 'TXN-10024',
    date: '14 Aug 2026',
    description: 'ATM Cash Withdrawal - Clifton Branch',
    referenceNo: 'WD262261109432',
    type: 'CREDIT',
    amount: '25000.00'
  },
  {
    id: 'TXN-10025',
    date: '12 Aug 2026',
    description: 'Netflix Subscription Premium',
    referenceNo: 'MS262240091873',
    type: 'DEBIT',
    amount: '1720.12'
  },
  {
    id: 'TXN-10026',
    date: '10 Aug 2026',
    description: 'Monthly Salary Credit',
    referenceNo: 'SL262227710924',
    type: 'CREDIT',
    amount: '345000.00'
  },
  {
    id: 'TXN-10027',
    date: '08 Aug 2026',
    description: 'K-Electric Bill Payment',
    referenceNo: 'BP262205561029',
    type: 'DEBIT',
    amount: '42350.50'
  }
]

const Page = () => {

  // 1. Filter State Setup ('ALL', 'CREDIT', 'DEBIT')
  const [filter, setFilter] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL')

    const { getViewStatements,store } = useViewStatement(null)

  useEffect(() => {
    getViewStatements('1234')
  },[])

  console.log(store);
  

  // 2. Formatting Current Date dynamically
  const todayDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  // 3. Filter Logic implementation
  const filteredStatements = store.entities.filter(item => {
    if (filter === 'ALL') return true
    return item.type === filter
  })

  //Sum of All transactions
  const totalBalanceCalculated = store.entities.reduce((sum, item) => {
    if(item.type === 'CREDIT'){
      return sum + parseFloat(item.amount);
    }
    return sum;
  }, 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        
        {/* Header Section */}
        <Grid item xs={12}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Account Statements New Page
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reviewing recent transaction activity logs for your active account
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {/* Total Balance Summary Card Component */}
        <Grid item xs={12}>
          <Card 
            sx={{ 
              borderRadius: 3, 
              backgroundColor: 'rgba(21, 128, 79, 0.06)',
              border: `1px solid rgba(21, 128, 79, 0.15)`,
              boxShadow: 'none',
              p: 1
            }}
          >
            <CardContent>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Total Balance as of today ({todayDate})
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: BRAND_COLOR, mt: 0.5 }}>
                PKR {totalBalanceCalculated.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Filter Buttons Layout */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
            <ButtonGroup variant="outlined" aria-label="transaction filter button group">
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

        {/* Transaction History Table */}
        <Grid item xs={12}>
          <Card 
            sx={{ 
              borderRadius: 3, 
              boxShadow: theme =>
                theme.palette.mode === 'light'
                  ? '0px 4px 24px rgba(0,0,0,0.06)'
                  : '0px 4px 24px rgba(0,0,0,0.4)'
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme => theme.palette.action.hover }}>
                      <TableCell sx={{ fontWeight: 700, border: 0, py: 2.5 }}>Value Date</TableCell>
                      <TableCell sx={{ fontWeight: 700, border: 0, py: 2.5 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 700, border: 0, py: 2.5 }}>Reference No</TableCell>
                      <TableCell sx={{ fontWeight: 700, border: 0, py: 2.5 }} align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStatements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                          <Typography variant="body2" color="text.secondary">
                            No recent {filter.toLowerCase()} logs found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStatements.map((row) => {
                        const isCredit = row.type === 'CREDIT';
                        
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
                              <Typography variant="body2" color="text.secondary">
                                {row.txnDate}
                              </Typography>
                            </TableCell>

                            <TableCell sx={{ py: 2.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {row.description || 'this is static'}
                              </Typography>
                            </TableCell>

                            <TableCell sx={{ py: 2.5 }}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontFamily: 'monospace', 
                                  letterSpacing: 0.5, 
                                  color: 'text.secondary' 
                                }}
                              >
                                {row.accountNo}
                              </Typography>
                            </TableCell>

                            <TableCell align="right" sx={{ py: 2.5 }}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 700,
                                  color: isCredit ? BRAND_COLOR : '#d32f2f'
                                }}
                              >
                                {isCredit ? '+' : '-'} PKR {row.amount}
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
  subject: 'view-statements-page'
}

export default Page