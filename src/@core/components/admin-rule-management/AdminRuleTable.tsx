import { useState } from 'react'
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
import { AdminRuleApiRecord } from 'src/types/apps/ruleManagement'

const colors = { green: '#15804f' }
const gridColumns = '2fr 1.5fr 1.5fr 1.5fr'

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
  padding: theme.spacing(2.5),
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
  '&:last-of-type': { borderBottom: 0 },
  '&:hover': { backgroundColor: theme.palette.action.hover }
}))

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

// ** contextType ke hisaab se "Rule Related To" ka text
const getRuleRelatedTo = (rule: AdminRuleApiRecord): string => {
  if (rule.contextType === 'PARTY') return `Party: ${rule.contextId}`
  if (rule.contextType === 'BACKOFFICE_USER') return `User: ${rule.contextId}`

  return 'Admin'
}

const getRuleTypeLabel = (ruleType: string): string => {
  if (ruleType === 'MAINTENANCE') return 'Maintenance'
  if (ruleType === 'FINANCIAL') return 'Financial'

  return 'Non Financial'
}

const getInitiatorTypeLabel = (rule: AdminRuleApiRecord): string =>
  rule.criteriaList?.[0]?.initiatorType === 'ROLE' ? 'User Group' : 'User'

// ** criteriaList khali ho to initiator contextId se
const getInitiator = (rule: AdminRuleApiRecord): string =>
  rule.criteriaList?.[0]?.initiatorId ?? String(rule.contextId ?? '')

interface AdminRuleTableProps {
  rules: AdminRuleApiRecord[]
  loading?: boolean
  error?: boolean
  editRoute: string
}

const AdminRuleTable = ({ rules, loading = false, error = false, editRoute }: AdminRuleTableProps) => {
  const router = useRouter()

  const [selectedRule, setSelectedRule] = useState<AdminRuleApiRecord | null>(null)
  const [reviewOpen, setReviewOpen] = useState(false)

  const handleRowClick = (rule: AdminRuleApiRecord) => {
    setSelectedRule(rule)
    setReviewOpen(true)
  }

  const handleCloseReview = () => {
    setReviewOpen(false)
    setSelectedRule(null)
  }

  const handleEdit = () => {
    if (!selectedRule) return
    router.push(`${editRoute}?id=${selectedRule.id}`)
  }

  const transactionLabels =
    selectedRule?.mappedTasks?.length === 1 && selectedRule.mappedTasks[0].taskCode === 'ALL_TRANSACTIONS'
      ? null
      : selectedRule?.mappedTasks?.map(t => t.taskCode) ?? []

  return (
    <>
      <StyledResultsCard>
        <TableHeaderRow>
          <Box>Rule Code</Box>
          <Box>Rule Type</Box>
          <Box>Initiator Type</Box>
          <Box>Approval Required</Box>
        </TableHeaderRow>

        {loading ? (
          <Box sx={{ p: 5, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={28} />
          </Box>
        ) : error ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color='error'>Failed to load rules. Please try again.</Typography>
          </Box>
        ) : rules.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color='text.secondary'>No Rules Found</Typography>
          </Box>
        ) : (
          rules.map(row => (
            <TableBodyRow key={row.id} onClick={() => handleRowClick(row)}>
              <Typography variant='body2' sx={{ fontWeight: 600, color: colors.green }}>
                {row.ruleCode}
              </Typography>
              <Typography variant='body2'>{getRuleTypeLabel(row.ruleType)}</Typography>
              <Typography variant='body2'>{getInitiatorTypeLabel(row)}</Typography>
              <Typography variant='body2'>{row.isWorkflowRequired ? 'Yes' : 'No'}</Typography>
            </TableBodyRow>
          ))
        )}
      </StyledResultsCard>

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
              <ReviewItem label='Rule Related To' value={getRuleRelatedTo(selectedRule)} />
              <ReviewItem label='Rule Type' value={getRuleTypeLabel(selectedRule.ruleType)} />
              <ReviewItem label='Rule ID' value={selectedRule.ruleCode} />
              <ReviewItem label='Rule Description' value={selectedRule.description} />
              <ReviewItem label='Initiator Type' value={getInitiatorTypeLabel(selectedRule)} />
              <ReviewItem label='Initiator' value={getInitiator(selectedRule)} />

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

              <ReviewItem label='Approval Required' value={selectedRule.isWorkflowRequired ? 'Yes' : 'No'} />

              {selectedRule.isWorkflowRequired && selectedRule.workflowId && (
                <ReviewItem label='Workflow ID' value={selectedRule.workflowId} />
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

export default AdminRuleTable