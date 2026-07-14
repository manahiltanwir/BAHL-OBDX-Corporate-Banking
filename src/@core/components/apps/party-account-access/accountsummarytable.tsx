import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

export type AccountType = 'currentSavings' | 'termDeposits'

interface AccountSummaryRow {
  id: number
  key: AccountType
  accountType: string
  totalAccounts: number
  mappedAccounts: number
}

interface AccountSummaryTableProps {
  mappedCounts: Record<AccountType, number>
  onAccountTypeClick: (accountType: AccountType) => void
}

const rows: AccountSummaryRow[] = [
  {
    id: 1,
    key: 'currentSavings',
    accountType: 'Current & Savings',
    totalAccounts: 2,
    mappedAccounts: 0
  },
  {
    id: 2,
    key: 'termDeposits',
    accountType: 'Term Deposits',
    totalAccounts: 2,
    mappedAccounts: 0
  }
]

const AccountSummaryTable = ({
  mappedCounts,
  onAccountTypeClick
}: AccountSummaryTableProps) => {
  return (
    <TableContainer
      component={Paper}
      variant='outlined'
      sx={{
        width: '100%',
        maxWidth: 900,
        boxShadow: 'none',
        borderRadius: 1.5,
        overflow: 'hidden'
      }}
    >
      <Table size='small'>
        <TableHead>
          <TableRow sx={{ bgcolor: '#059669' }}>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
              Account Type
            </TableCell>

            <TableCell align='center' sx={{ color: '#fff', fontWeight: 700 }}>
              Total Number of Accounts
            </TableCell>

            <TableCell align='center' sx={{ color: '#fff', fontWeight: 700 }}>
              Number of Accounts Mapped
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id} hover>
              <TableCell>
                <Box
                  component='button'
                  type='button'
                  onClick={() => onAccountTypeClick(row.key)}
                  sx={{
                    border: 0,
                    p: 0,
                    bgcolor: 'transparent',
                    color: '#059669',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {row.accountType}
                </Box>
              </TableCell>

              <TableCell align='center'>
                <Typography sx={{ fontWeight: 600 }}>
                  {row.totalAccounts}
                </Typography>
              </TableCell>

              <TableCell align='center'>
                <Typography sx={{ fontWeight: 600 }}>
                  {mappedCounts[row.key]}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default AccountSummaryTable