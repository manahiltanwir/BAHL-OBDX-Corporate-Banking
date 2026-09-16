import React, { ReactNode, useState, Fragment } from 'react'
import { styled, useTheme, alpha, darken } from '@mui/material/styles'
import { Box, Button, Card, Chip, Divider, GlobalStyles, Grid, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import HomeIcon from '@mui/icons-material/Home'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'


export interface ReceiptRow {
  icon?: ReactNode
  label: string
  value: string
}

export interface ReceiptSection {
  title: string
  rows: ReceiptRow[]
}

export interface PaymentSuccessReceiptProps {
  headline?: string // e.g. "Transfer Successful"
  description?: string // e.g. "Your international payment has been submitted..."
  amountText?: string // e.g. "PKR 500,000.00" — already formatted, currency+amount
  amountSubtext?: ReactNode // e.g. <>sent to <strong>Ali Raza</strong></>
  referenceId?: string // agar na diya jaye to khud generate ho jayega
  sections: ReceiptSection[]
  metaRows?: ReceiptRow[] // default: Reference ID, Date & Time, Status
  homeLabel?: string
  onGoHome: () => void
  newActionLabel?: string
  onNewAction: () => void
  enablePrint?: boolean
}

const BADGE_SIZE = 64
const CARD_MAX_WIDTH_GRID = 6


const ReceiptCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2.5,
  boxShadow: theme.shadows[3],
  border: `1px solid ${theme.palette.divider}`
}))

const HeaderCard = styled(ReceiptCard)(({ theme }) => ({
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  // background:"red",
    background: `linear-gradient(10deg, ${alpha(theme.palette.primary.main, 0.5)} 0%, ${theme.palette.background.paper} 95%)`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`
}))

const CheckBadge = styled(Box)(({ theme }) => ({
  width: BADGE_SIZE,
  height: BADGE_SIZE,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${darken(theme.palette.primary.main, 0.250)} 100%)`,
  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.35)}`
}))

const ReferenceChip = styled(Chip)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontWeight: 700,
  fontFamily: 'monospace',
  letterSpacing: 0.5,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`
}))

const SectionLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(2.5),
  marginBottom: theme.spacing(0.5)
}))

const RowWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 0)
}))

const ActionsBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginTop: theme.spacing(3)
}))

// ----------------------------------------------------------------------
// Small building blocks
// ----------------------------------------------------------------------

const SummaryRow = ({ icon, label, value }: ReceiptRow) => (
  <RowWrapper>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {icon}
      <Typography variant='body2' color='text.secondary'>
        {label}
      </Typography>
    </Box>
    <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'right' }}>
      {value || '—'}
    </Typography>
  </RowWrapper>
)

const generateReferenceId = () => `TXN-${Date.now().toString().slice(-8)}`

const printStyles = {
  '@media print': {
    'body *': { visibility: 'hidden' },
    '#printable-receipt, #printable-receipt *': { visibility: 'visible' },
    '#printable-receipt': { position: 'absolute', left: 0, top: 0, width: '100%', margin: 0, boxShadow: 'none' },
    '.no-print': { display: 'none !important' }
  }
} as const

const PaymentSuccessReceipt = ({
  headline = 'Transfer Successful',
  description = 'Your payment has been submitted and is now being processed.',
  amountText,
  amountSubtext,
  referenceId,
  sections,
  metaRows,
  homeLabel = 'Go to Home',
  onGoHome,
  newActionLabel = 'New Transfer',
  onNewAction,
  enablePrint = true
}: PaymentSuccessReceiptProps) => {
  const theme = useTheme()

  const [resolvedReferenceId] = useState(referenceId ?? generateReferenceId())
  const [timestamp] = useState(new Date())

  const rowsWithDividers = (rows: ReceiptRow[]) =>
    rows.map((row, index) => (
      <Fragment key={`${row.label}-${index}`}>
        {index > 0 && <Divider />}
        <SummaryRow {...row} />
      </Fragment>
    ))

  const defaultMetaRows: ReceiptRow[] = metaRows ?? [
    { label: 'Reference ID', value: resolvedReferenceId },
    { label: 'Date & Time', value: timestamp.toLocaleString() },
    { label: 'Status', value: 'Completed' }
  ]

  return (
    <>
      <GlobalStyles styles={printStyles} />

      <Grid container spacing={2.5} justifyContent='center'>
        <Grid item xs={12} md={CARD_MAX_WIDTH_GRID}>
          <Box id='printable-receipt'>
            {/* ---------------- Success header ---------------- */}
            <HeaderCard>
              <CheckBadge>
                <CheckIcon sx={{ color: '#fff', fontSize: 30 }} />
              </CheckBadge>

              <Typography variant='h6' sx={{ fontWeight: 700, mb: 0.5 }}>
                {headline}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ maxWidth: 380, mx: 'auto' }}>
                {description}
              </Typography>

              {amountText && (
                <>
                  <Typography
                    variant='h4'
                    sx={{
                      fontWeight: 800,
                      color: darken(theme.palette.primary.main, 0.2),
                      mt: 2.5,
                      letterSpacing: '-0.5px'
                    }}
                  >
                    {amountText}
                  </Typography>
                  {amountSubtext && (
                    <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 0.5 }}>
                      {amountSubtext}
                    </Typography>
                  )}
                </>
              )}

              <ReferenceChip label={`Ref: ${resolvedReferenceId}`} size='small' />
            </HeaderCard>

            {/* ---------------- Transaction summary ---------------- */}
            <ReceiptCard sx={{ mt: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ReceiptLongIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Transaction Receipt</Typography>
                </Box>
                {enablePrint && (
                  <Button
                    size='small'
                    className='no-print'
                    startIcon={<PrintOutlinedIcon fontSize='small' />}
                    onClick={() => window.print()}
                    sx={{ color: 'text.secondary' }}
                  >
                    Print
                  </Button>
                )}
              </Box>

              <Divider sx={{ mb: 0.5 }} />

              {rowsWithDividers(defaultMetaRows)}

              {sections.map((section, sIndex) => (
                <Box key={`${section.title}-${sIndex}`}>
                  <SectionLabel variant='caption'>{section.title}</SectionLabel>
                  {rowsWithDividers(section.rows)}
                </Box>
              ))}
            </ReceiptCard>
          </Box>

          {/* ---------------- Actions (excluded from print) ---------------- */}
          <ActionsBar className='no-print'>
            <Button
              variant='outlined'
              startIcon={<HomeIcon fontSize='small' />}
              sx={{ borderColor: 'divider', color: 'text.primary' }}
              onClick={onGoHome}
            >
              {homeLabel}
            </Button>

            <Button variant='contained' disableElevation startIcon={<AddCircleOutlineIcon fontSize='small' />} onClick={onNewAction}>
              {newActionLabel}
            </Button>
          </ActionsBar>
        </Grid>
      </Grid>
    </>
  )
}

export default PaymentSuccessReceipt