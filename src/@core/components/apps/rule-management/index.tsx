import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
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
import { useRulesList } from 'src/@core/hooks/apps/useRuleManagement'
import { RuleApiRecord } from 'src/types/apps/ruleManagement'

const colors = {
  green: '#15804f'
}

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

interface RuleTableProps {
  partyId: string
}

const RuleTable = ({ partyId }: RuleTableProps) => {
  const router = useRouter()

  const { rulesList, status, fetchRulesByParty } = useRulesList()

  const [selectedRule, setSelectedRule] = useState<RuleApiRecord | null>(null)
  const [reviewOpen, setReviewOpen] = useState(false)

  useEffect(() => {
    if (partyId) {
      fetchRulesByParty(partyId)
    }
  }, [partyId])

  const handleRowClick = (rule: RuleApiRecord) => {
    setSelectedRule(rule)
    setReviewOpen(true)
  }

  const handleCloseReview = () => {
    setReviewOpen(false)
    setSelectedRule(null)
  }

  const handleEdit = () => {
    if (!selectedRule) return

    router.push(`/rule-management/add-role?id=${selectedRule.id}`)
  }

  const criteria = selectedRule?.criteriaList?.[0]

  const transactionLabels =
    selectedRule?.mappedTasks?.length === 1 && selectedRule.mappedTasks[0].taskCode === 'ALL_TRANSACTIONS'
      ? null
      : selectedRule?.mappedTasks?.map(t => t.taskCode) ?? []

  const accountLabels =
  criteria?.accountNumber === 'ALL_ACCOUNTS'
    ? null
    : criteria?.accountNumber
      ? criteria.accountNumber.split(',').map(acc => acc.trim()).filter(Boolean)
      : []

  return (
    <>
      <StyledResultsCard>
        <TableHeaderRow>
          <Box>Rule Code</Box>
          <Box>Initiator</Box>
          <Box>Approval Required</Box>
        </TableHeaderRow>

        {status === 'pending' ? (
          <Box sx={{ p: 5, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={28} />
          </Box>
        ) : status === 'error' ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color='error'>Failed to load rules. Please try again.</Typography>
          </Box>
        ) : rulesList.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color='text.secondary'>No Rules Found</Typography>
          </Box>
        ) : (
          rulesList.map(row => (
            <TableBodyRow key={row.id} onClick={() => handleRowClick(row)}>
              <Typography variant='body2' sx={{ fontWeight: 600, color: colors.green }}>
                {row.ruleCode}
              </Typography>

              <Typography variant='body2'>{row.criteriaList?.[0]?.initiatorId ?? '—'}</Typography>

              <Typography variant='body2'>{row.workflowId ? 'Yes' : 'No'}</Typography>
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
              <ReviewItem
                label='Rule Type'
                value={selectedRule.ruleType === 'FINANCIAL' ? 'Financial' : 'Non Financial'}
              />
              <ReviewItem label='Rule ID' value={selectedRule.ruleCode} />
              <ReviewItem label='Rule Description' value={selectedRule.description} />
              <ReviewItem
                label='Initiator Type'
                value={criteria?.initiatorType === 'ROLE' ? 'User Group' : 'User'}
              />
              <ReviewItem label='Initiator' value={criteria?.initiatorId ?? ''} />

              <ReviewItem
                label='Transactions'
                value={
                  transactionLabels === null ? (
                    'All Transactions'
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {transactionLabels.map(txn => (
                        <Chip key={txn} label={txn} size='small' />
                      ))}
                    </Box>
                  )
                }
              />

              <ReviewItem
                label='Accounts'
                value={
                  accountLabels === null ? (
                    'All Accounts'
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {accountLabels.map(acc => (
                        <Chip key={acc} label={acc} size='small' />
                      ))}
                    </Box>
                  )
                }
              />

              <ReviewItem
                label='Amount Range'
                value={
                  criteria && (criteria.fromAmount || criteria.toAmount)
                    ? `${criteria.fromAmount ?? '0'} - ${criteria.toAmount ?? '∞'} ${criteria.currency ?? ''}`
                    : 'Not Specified'
                }
              />

              <ReviewItem label='Approval Required' value={selectedRule.workflowId ? 'Yes' : 'No'} />

              {selectedRule.workflowId && <ReviewItem label='Workflow ID' value={selectedRule.workflowId} />}
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