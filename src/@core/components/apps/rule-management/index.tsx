import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import { useRouter } from 'next/router'
import { dummyRulesData, RuleRecord } from 'src/@core/data/dummy-rules'

const colors = {
  green: '#15804f'
}

const rows: RuleRecord[] = dummyRulesData

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

// ** Small helper for the review modal's label/value rows
const ReviewItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Grid item xs={12} sm={6}>
    <Typography variant='caption' sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}
    </Typography>
    <Box sx={{ mt: 0.5 }}>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Typography variant='body2' sx={{ fontWeight: 500 }}>
          {value || '—'}
        </Typography>
      ) : (
        value
      )}
    </Box>
  </Grid>
)

const RuleTable = () => {
  const router = useRouter()

  const [selectedRule, setSelectedRule] = useState<RuleRecord | null>(null)
  const [reviewOpen, setReviewOpen] = useState(false)

  const handleRowClick = (rule: RuleRecord) => {
    setSelectedRule(rule)
    setReviewOpen(true)
  }

  const handleCloseReview = () => {
    setReviewOpen(false)
    setSelectedRule(null)
  }

  const handleEdit = () => {
    if (!selectedRule) return

    // ** Same add-role page handles both Create and Edit.
    // Passing the id tells that page to load and prefill this record.
    router.push(`/rule-management/add-role?id=${selectedRule.id}`)
  }

  return (
    <>
      <StyledResultsCard>
        <TableHeaderRow>
          <Box>Rule Code</Box>
          <Box>Maker</Box>
          <Box>Approval Required</Box>
        </TableHeaderRow>

        {rows.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color='text.secondary'>No Rules Found</Typography>
          </Box>
        ) : (
          rows.map(row => (
            <TableBodyRow key={row.id} onClick={() => handleRowClick(row)}>
              <Typography variant='body2' sx={{ fontWeight: 600, color: colors.green }}>
                {row.ruleId}
              </Typography>

              <Typography variant='body2'>{row.initiatorUser}</Typography>

              <Typography variant='body2'>{row.approvalRequired === 'yes' ? 'Yes' : 'No'}</Typography>
            </TableBodyRow>
          ))
        )}
      </StyledResultsCard>

      {/* Review Modal */}
      <Dialog open={reviewOpen} onClose={handleCloseReview} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Review Rule Details
          <IconButton size='small' onClick={handleCloseReview}>
            <CloseIcon fontSize='small' />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 4 }}>
          {selectedRule && (
            <Grid container spacing={4}>
              <ReviewItem label='Rule Type' value={selectedRule.ruleType} />
              <ReviewItem label='Rule ID' value={selectedRule.ruleId} />
              <ReviewItem label='Rule Description' value={selectedRule.ruleDescription} />
              <ReviewItem
                label='Initiator Type'
                value={selectedRule.initiatorType === 'user' ? 'User' : 'User Group'}
              />
              <ReviewItem label='Initiator' value={selectedRule.initiatorUser} />

              <ReviewItem
                label='Transactions'
                value={
                  selectedRule.transactionMode === 'all' ? (
                    'All Transactions'
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedRule.selectedTransactions.map(txn => (
                        <Chip key={txn} label={txn} size='small' />
                      ))}
                    </Box>
                  )
                }
              />

              <ReviewItem
                label='Accounts'
                value={
                  selectedRule.accountMode === 'all' ? (
                    'All Accounts'
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedRule.selectedAccounts.map(acc => (
                        <Chip key={acc} label={acc} size='small' />
                      ))}
                    </Box>
                  )
                }
              />

              <ReviewItem
                label='Amount Range'
                value={
                  selectedRule.fromAmount || selectedRule.toAmount
                    ? `${selectedRule.fromAmount || '0'} - ${selectedRule.toAmount || '∞'}`
                    : 'Not Specified'
                }
              />

              <ReviewItem label='Approval Required' value={selectedRule.approvalRequired === 'yes' ? 'Yes' : 'No'} />

              {selectedRule.approvalRequired === 'yes' && (
                <ReviewItem label='Workflow' value={selectedRule.selectedWorkflow} />
              )}
            </Grid>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3 }}>
          <Button variant='outlined' color='secondary' onClick={handleCloseReview}>
            Close
          </Button>
          <Button variant='contained' onClick={handleEdit}>
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RuleTable