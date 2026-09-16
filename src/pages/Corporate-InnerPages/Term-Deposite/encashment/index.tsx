import React, { useState } from 'react'
import { styled, useTheme, alpha } from '@mui/material/styles'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded'
import PriceCheckRoundedIcon from '@mui/icons-material/PriceCheckRounded'
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded'

// ---------- Types ----------
interface TdrRecord {
  id: string
  tdrNumber: string
  principalAmount: number
  accruedProfit: number
  maturityDate: string
  penaltyRate: number // % deducted from accrued profit on premature encashment
  settlementAccount: string
}

// TODO: yeh mock data real API se replace karein
const activeTdrs: TdrRecord[] = [
  {
    id: '1',
    tdrNumber: 'TDR-882104',
    principalAmount: 5000000,
    accruedProfit: 312500,
    maturityDate: '2026-12-15',
    penaltyRate: 30,
    settlementAccount: '0102-983726-001 (Operational)'
  },
  {
    id: '2',
    tdrNumber: 'TDR-771920',
    principalAmount: 10000000,
    accruedProfit: 700000,
    maturityDate: '2026-10-01',
    penaltyRate: 30,
    settlementAccount: '0102-983726-002 (Collection)'
  }
]

const MIN_REASON_LENGTH = 10
const MAX_REASON_LENGTH = 240

const formatPkr = (value: number) => `USD ${value.toLocaleString('en-US')}`

// ---------- Styled ----------
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  overflow: 'hidden'
}))

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-root': {
    backgroundColor: (theme.palette.primary.main),
    color:'#f5f5f5',
    fontWeight: 700,
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5)
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'background-color 0.2s ease',
  '&:last-of-type .MuiTableCell-root': { borderBottom: 'none' },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.09)
  },
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const DetailRow = ({
  icon,
  label,
  value,
  valueColor,
  emphasize
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueColor?: string
  emphasize?: boolean
}) => (
  <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ py: 1.15 }}>
    <Stack direction='row' alignItems='center' gap={1.1}>
      <Box sx={{ color: 'text.disabled', display: 'flex' }}>{icon}</Box>
      <Typography variant='body2' color='text.secondary'>
        {label}
      </Typography>
    </Stack>
    <Typography
      variant={emphasize ? 'subtitle1' : 'body2'}
      sx={{
        fontWeight: emphasize ? 800 : 600,
        color: valueColor ?? (emphasize ? 'primary.main' : 'text.primary'),
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: emphasize ? '-0.01em' : 0
      }}
    >
      {value}
    </Typography>
  </Stack>
)

const Page = () => {
  const theme = useTheme()
  const [selectedTdr, setSelectedTdr] = useState<TdrRecord | null>(null)
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleOpenModal = (record: TdrRecord) => {
    setSelectedTdr(record)
    setReason('')
  }

  const handleCloseModal = () => {
    if (submitting) return
    setSelectedTdr(null)
    setReason('')
  }

  const penaltyDeduction = selectedTdr ? Math.round((selectedTdr.accruedProfit * selectedTdr.penaltyRate) / 100) : 0
  const netPayable = selectedTdr ? selectedTdr.principalAmount + selectedTdr.accruedProfit - penaltyDeduction : 0
  const reasonIsValid = reason.trim().length >= MIN_REASON_LENGTH

  const handleConfirmEncashment = async () => {
    if (!reasonIsValid || !selectedTdr) return

    setSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 900))
      handleCloseModal()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5' sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Encashment
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
          Select an active deposit to initiate premature or maturity encashment.
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <StyledCard>
          <TableContainer>
            <Table>
              <StyledTableHead>
                <TableRow>
                  <TableCell>TDR Number</TableCell>
                  <TableCell>Principal Amount</TableCell>
                  <TableCell>Accrued Profit</TableCell>
                  <TableCell>Maturity Date</TableCell>
                  <TableCell align='right'>Action</TableCell>
                </TableRow>
              </StyledTableHead>

              <TableBody>
                {activeTdrs.map(record => (
                  <StyledTableRow key={record.id}>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 700 }}>
                        {record.tdrNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                        {formatPkr(record.principalAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant='body2'
                        sx={{ fontWeight: 700, color: theme.palette.primary.main, fontVariantNumeric: 'tabular-nums' }}
                      >
                        {formatPkr(record.accruedProfit)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' color='text.secondary'>
                        {record.maturityDate}
                      </Typography>
                    </TableCell>
                    <TableCell align='right'>
                      <Button
                        variant='outlined'
                        color='error'
                        size='small'
                        onClick={() => handleOpenModal(record)}
                      >
                        Encash
                      </Button>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {activeTdrs.length === 0 && (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography variant='body2' color='text.secondary'>
                No active Term Deposits available for encashment.
              </Typography>
            </Box>
          )}
        </StyledCard>
      </Grid>

      {/* Confirm Encashment Modal */}
      <Dialog
        open={!!selectedTdr}
        onClose={handleCloseModal}
        maxWidth='xs'
        fullWidth
        PaperProps={{
          elevation: 0,
          sx: {
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden'
          }
        }}
      >
        {selectedTdr && (
          <>
            <Box
              sx={{
                px: 3,
                py: 2.5,
                background:theme.palette.primary.main,
                color: theme.palette.error.contrastText
              }}
            >
              <Stack direction='row' alignItems='center' justifyContent='space-between'>
                <Stack direction='row' alignItems='center' gap={1.5}>
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: alpha('#fff', 0.16),
                      color: 'inherit'
                    }}
                  >
                    <SavingsRoundedIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.01em' ,color:'#f5f5f5'}}>
                      Confirm TDR Encashment
                    </Typography>
                    <Typography variant='caption' sx={{ opacity: 0.85,color:'#f5f5f5' }}>
                      {selectedTdr.tdrNumber}
                    </Typography>
                  </Box>
                </Stack>
                <IconButton size='small' onClick={handleCloseModal} sx={{ color: 'inherit' }}>
                  <CloseIcon fontSize='small' />
                </IconButton>
              </Stack>
            </Box>

            <DialogContent sx={{ p: 3 }}>
              <Alert
                severity='warning'
                variant='outlined'
                icon={<WarningAmberRoundedIcon fontSize='small' />}
                sx={{ borderRadius: 2, mb: 2.5, alignItems: 'flex-start', bgcolor: alpha(theme.palette.warning.main, 0.06) }}
              >
                <Typography variant='body2'>
                  Premature encashment before maturity date will incur charges deductions on accrued
                  profit.
                </Typography>
              </Alert>

              <Stack
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  px: 2,
                }}
                divider={<Divider />}
              >
                <DetailRow
                  icon={<AccountBalanceRoundedIcon sx={{ fontSize: 18 }} />}
                  label='Principal Amount'
                  value={formatPkr(selectedTdr.principalAmount)}
                />
                <DetailRow
                  icon={<TrendingUpRoundedIcon sx={{ fontSize: 18 }} />}
                  label='Accrued Profit'
                  value={formatPkr(selectedTdr.accruedProfit)}
                  valueColor={theme.palette.success.main}
                />
                <DetailRow
                  icon={<EventBusyRoundedIcon sx={{ fontSize: 18 }} />}
                  label={`Charges (${selectedTdr.penaltyRate}%)`}
                  value={`– ${formatPkr(penaltyDeduction)}`}
                  valueColor={theme.palette.error.main}
                />
                <DetailRow
                  icon={<PriceCheckRoundedIcon sx={{ fontSize: 18 }} />}
                  label='Net Payable (Est.)'
                  value={formatPkr(netPayable)}
                  emphasize
                />
              </Stack>

              <Box sx={{ mt: 2.5 }}>
                <Typography variant='caption' sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  SETTLEMENT ACCOUNT
                </Typography>
                <Stack
                  direction='row'
                  alignItems='center'
                  gap={1}
                  sx={{
                    mt: 0.75,
                    px: 1.5,
                    py: 1.15,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: alpha(theme.palette.primary.main, 0.03)
                  }}
                >
                  <AccountBalanceRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    {selectedTdr.settlementAccount}
                  </Typography>
                </Stack>
              </Box>

              <TextField
                fullWidth
                required
                multiline
                minRows={2}
                label='Reason for Encashment'
                placeholder='e.g. Urgent business liquidity requirement'
                value={reason}
                onChange={e => setReason(e.target.value.slice(0, MAX_REASON_LENGTH))}
                error={reason.trim().length > 0 && !reasonIsValid}
                helperText={
                  reason.trim().length > 0 && !reasonIsValid
                    ? `Minimum ${MIN_REASON_LENGTH} characters required.`
                    : `${reason.length}/${MAX_REASON_LENGTH}`
                }
                InputProps={{
                  startAdornment: (
                    <EditNoteRoundedIcon sx={{ fontSize: 18, color: 'text.disabled', mr: 1, mt: '2px', alignSelf: 'flex-start' }} />
                  )
                }}
                FormHelperTextProps={{ sx: { ml: 0, textAlign: 'right' } }}
                sx={{ mt: 3 }}
              />
            </DialogContent>

            <Divider />
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button variant='text' color='inherit' onClick={handleCloseModal} sx={{ fontWeight: 600 }}>
                Cancel
              </Button>
              <Button
                variant='contained'
                color='error'
                disabled={!reasonIsValid || submitting}
                onClick={handleConfirmEncashment}
              >
                {submitting ? 'Processing…' : 'Confirm Encashment'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Grid>
  )
}

Page.acl = { action: 'itsHaveAccess', subject: 'encashment' }

export default Page