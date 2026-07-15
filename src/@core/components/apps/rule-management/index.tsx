import { Box, Card, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/router'

const colors = {
  green: '#15804f'
}

const rows = [
  {
    id: 1,
    ruleCode: 'Financial 1',
    maker: '99999992_Maker1',
    approvalRequired: 'Yes'
  },
  {
    id: 2,
    ruleCode: 'Financial 2',
    maker: '99999993_Maker2',
    approvalRequired: 'No'
  }
]

const gridColumns = '2fr 2fr 1.5fr'

const StyledResultsCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 1.75,
  boxShadow: theme.shadows[2],
  overflow: 'hidden'
}))

const TableHeaderRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: gridColumns,
  gap: theme.spacing(1),
  backgroundColor: colors.green,
  color: '#fff',
  padding: theme.spacing(2.5, 2.5),
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase'
}))

const TableBodyRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: gridColumns,
  gap: theme.spacing(1),
  alignItems: 'center',
  padding: theme.spacing(1.5, 2.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'background-color .2s ease',

  '&:last-of-type': {
    borderBottom: 0
  },

  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}))

const RuleTable = () => {
  const router = useRouter()

  const handleRowClick = (id: number) => {
    // router.push(`/rule-management/view-rule?id=${id}`)
  }

  return (
    <StyledResultsCard>
      <TableHeaderRow>
        <Box>Rule Code</Box>
        <Box>Maker</Box>
        <Box>Approval Required</Box>
      </TableHeaderRow>

      {rows.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color='text.secondary'>
            No Rules Found
          </Typography>
        </Box>
      ) : (
        rows.map(row => (
          <TableBodyRow
            key={row.id}
            onClick={() => handleRowClick(row.id)}
          >
            <Typography
              variant='body2'
              sx={{
                fontWeight: 600,
                color: colors.green
              }}
            >
              {row.ruleCode}
            </Typography>

            <Typography variant='body2'>
              {row.maker}
            </Typography>

            <Typography variant='body2'>
              {row.approvalRequired}
            </Typography>
          </TableBodyRow>
        ))
      )}
    </StyledResultsCard>
  )
}

export default RuleTable