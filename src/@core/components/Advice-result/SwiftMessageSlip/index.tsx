import React, { forwardRef } from 'react'
import { Box, Card, Chip, Divider, Grid, Stack, Typography } from '@mui/material'
import { colors } from '../adviceTheme'
import { SwiftMessageData } from '../swiftMessageData'

interface SwiftMessageSlipProps {
  data: SwiftMessageData
}

const FieldRow = ({ label, value }: { label: string; value: string }) => (
  <Box data-avoid-break sx={{ mb: 1.5 }}>
    <Typography variant='caption' sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {label}
    </Typography>
    <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{value || '—'}</Typography>
  </Box>
)

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography
    sx={{
      fontWeight: 700,
      fontSize: 13,
      textTransform: 'uppercase',
      letterSpacing: 0.75,
      color: 'primary.main',
      mb: 2
    }}
  >
    {children}
  </Typography>
)

const NumberedList = ({ items }: { items: string[] }) => (
  <Stack spacing={1.25}>
    {items.map((item, index) => (
      <Box data-avoid-break key={index} sx={{ display: 'flex', gap: 1.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: 'primary.main', minWidth: 20 }}>
          {index + 1}.
        </Typography>
        <Typography sx={{ fontSize: 13.5, lineHeight: 1.6 }}>{item}</Typography>
      </Box>
    ))}
  </Stack>
)

const SwiftMessageSlip = forwardRef<HTMLDivElement, SwiftMessageSlipProps>(({ data }, ref) => (
  <Card
    id='advice-printable'
    ref={ref}
    sx={{ border: `1px solid ${colors.border}`, borderRadius: 2, boxShadow: 'none', overflow: 'hidden' }}
  >
    {/* Letterhead */}
    <Box data-avoid-break sx={{ px: 4, pt: 3, pb: 2 }}>
      <Grid container alignItems='flex-start'>
        <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <img src='/images/pages/alhabib.png' alt='Bank AL Habib' style={{ height: 38, display: 'block' }} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>BANK AL HABIB LIMITED</Typography>
            <Typography sx={{ fontSize: 12, mt: 0.3 }}>{data.branch}</Typography>
          </Box>
        </Grid>

        <Grid item xs={4} sx={{ textAlign: 'center', pt: 0.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>SWIFT DRAFT</Typography>
          <Chip label={data.messageType} size='small' color='primary' sx={{ mt: 0.5, fontWeight: 700 }} />
        </Grid>

        <Grid item xs={4} sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Customer No: {data.customerNo}</Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Produced: {data.producedOn}</Typography>
        </Grid>
      </Grid>
    </Box>

    <Divider sx={{ borderColor: colors.border }} />

    {/* Key highlights strip */}
    <Box data-avoid-break sx={{ px: 4, py: 3, bgcolor: 'action.hover' }}>
      <Grid container spacing={3}>
        <Grid item xs={6} sm={3}>
          <FieldRow label='LC Number' value={data.lcNumber} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <FieldRow label='Amount' value={`${data.currency} ${data.amount}`} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <FieldRow label='Date of Issue' value={data.dateOfIssue} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <FieldRow label='Expiry' value={`${data.dateOfExpiry} at ${data.placeOfExpiry}`} />
        </Grid>
      </Grid>
    </Box>

    <Divider sx={{ borderColor: colors.border }} />

    <Box sx={{ px: 4, py: 3 }}>
      {/* Parties */}
      <SectionTitle>Parties Involved</SectionTitle>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Box data-avoid-break>
            <FieldRow label='Applicant' value={data.applicantName} />
            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{data.applicantAddress}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box data-avoid-break>
            <FieldRow label='Beneficiary' value={data.beneficiaryName} />
            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{data.beneficiaryAddress}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box data-avoid-break>
            <FieldRow label='Receiver Bank' value={`${data.receiverBankName} (${data.receiverBic})`} />
            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{data.receiverBankAddress}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 4 }} />

      {/* Credit Terms */}
      <Box data-avoid-break sx={{ mb: 4 }}>
        <SectionTitle>Credit Terms</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <FieldRow label='Form of Credit' value={data.formOfCredit} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FieldRow label='Applicable Rules' value={data.applicableRules} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FieldRow label='Tolerance' value={data.tolerance} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FieldRow label='Drafts At' value={data.draftsAt} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldRow label='Available With / By' value={`${data.availableWith} — ${data.availableBy}`} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldRow label='Drawee' value={data.drawee} />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Shipment */}
      <Box data-avoid-break sx={{ mb: 4 }}>
        <SectionTitle>Shipment Details</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <FieldRow label='Partial Shipments' value={data.partialShipments} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FieldRow label='Transhipment' value={data.transhipment} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FieldRow label='Port of Loading' value={data.portOfLoading} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FieldRow label='Port of Discharge' value={data.portOfDischarge} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FieldRow label='Latest Shipment Date' value={data.latestShipmentDate} />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Goods */}
      <SectionTitle>Description of Goods</SectionTitle>
      <Stack spacing={1} sx={{ mb: 4 }}>
        {data.goodsDescription.map((line, i) => (
          <Typography key={i} data-avoid-break sx={{ fontSize: 13.5, lineHeight: 1.7 }}>
            {line}
          </Typography>
        ))}
      </Stack>

      <Divider sx={{ mb: 4 }} />

      {/* Documents Required */}
      <SectionTitle>Documents Required</SectionTitle>
      <Box sx={{ mb: 4 }}>
        <NumberedList items={data.documentsRequired} />
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Additional Conditions */}
      <SectionTitle>Additional Conditions</SectionTitle>
      <Box sx={{ mb: 4 }}>
        <NumberedList items={data.additionalConditions} />
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Charges & Presentation */}
      <Box data-avoid-break sx={{ mb: 4 }}>
        <SectionTitle>Charges &amp; Presentation</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FieldRow label='Charges' value={data.charges} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FieldRow label='Presentation Period' value={data.presentationPeriod} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FieldRow label='Confirmation' value={data.confirmationInstructions} />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Instructions */}
      <SectionTitle>Instructions to Bank</SectionTitle>
      <Typography sx={{ fontSize: 13.5, lineHeight: 1.7, mb: 4 }}>{data.instructionsToBank}</Typography>

      <Divider sx={{ mb: 4 }} />

      {/* Sender to Receiver Info */}
      <Box data-avoid-break>
        <SectionTitle>Sender to Receiver Information</SectionTitle>
        <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
          {data.senderToReceiverInfo.map((tag, i) => (
            <Chip key={i} label={tag} size='small' variant='outlined' sx={{ mb: 1 }} />
          ))}
        </Stack>
      </Box>
    </Box>
  </Card>
))

SwiftMessageSlip.displayName = 'SwiftMessageSlip'

export default SwiftMessageSlip