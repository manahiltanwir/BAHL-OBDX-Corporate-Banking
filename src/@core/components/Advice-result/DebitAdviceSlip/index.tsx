import React, { forwardRef } from 'react'
import { Box, Card, Divider, Grid, Typography } from '@mui/material'
import { colors, DebitAdviceData } from '../adviceTheme'

interface DebitAdviceSlipProps {
  data: DebitAdviceData
}


const DebitAdviceSlip = forwardRef<HTMLDivElement, DebitAdviceSlipProps>(({ data }, ref) => (
  <Card
    id='debit-advice-printable'
    ref={ref}
    sx={{
      border: `1px solid ${colors.border}`,
      borderRadius: 0,
      boxShadow: 'none',
      fontFamily: '"Courier New", monospace',
      overflow: 'hidden'
    }}
  >
    {/* Title Bar — logo centered above the title */}
    <Box
      sx={{
        backgroundColor: colors.headerBg,
        textAlign: 'center',
        py: 2,
        px: 2,
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5
      }}
    >
      <img src='/images/pages/alhabib.png' alt='Bank AL Habib' style={{ height: '36px', display: 'block' }} />
      <Typography sx={{ fontFamily: '"Courier New", monospace', fontWeight: 700, letterSpacing: 1, color: '#000' }}>
        Debit Advice
      </Typography>
    </Box>

    <Box sx={{ px: 4, py: 3 }}>
      {/* Account Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box>
          <Typography sx={{ fontFamily: 'inherit', fontSize: 14 }}>Account Title: {data.accountTitle}</Typography>
          <Typography sx={{ fontFamily: 'inherit', fontSize: 14 }}>Address: {data.address}</Typography>
        </Box>
        <Typography sx={{ fontFamily: 'inherit', fontSize: 14 }}>{data.adviceDate}</Typography>
      </Box>

      <Typography sx={{ fontFamily: 'inherit', fontSize: 14, mt: 1 }}>DETAILS ARE AS FOLLOWS:</Typography>

      {/* LC Details Table */}
      <Box sx={{ mt: 2 }}>
        <Grid container sx={{ fontSize: 14, fontWeight: 700, pl: 2 }}>
          <Grid item xs={3}>
            L/C No
          </Grid>
          <Grid item xs={2}>
            CCY
          </Grid>
          <Grid item xs={2.5}>
            Bill Amount
          </Grid>
          <Grid item xs={2}>
            Rate
          </Grid>
          <Grid item xs={2.5}>
            Bill Loc Eqv.
          </Grid>
        </Grid>
        <Divider sx={{ borderColor: colors.border, my: 0.5 }} />
        <Grid container sx={{ fontSize: 14, pl: 2 }}>
          <Grid item xs={3}>
            {data.lcNumber}
          </Grid>
          <Grid item xs={2}>
            {data.ccy}
          </Grid>
          <Grid item xs={2.5}>
            {data.billAmount}
          </Grid>
          <Grid item xs={2}>
            {data.rate}
          </Grid>
          <Grid item xs={2.5}>
            {data.billLocEqv}
          </Grid>
        </Grid>
        <Divider sx={{ borderColor: colors.border, mt: 0.5 }} />
      </Box>

      {/* Charges Breakdown */}
      <Box sx={{ mt: 3, pl: 2 }}>
        <Grid container sx={{ fontSize: 14, mb: 0.5 }}>
          <Grid item xs={8}>
            LC COMM CR
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', pr: 4 }}>
            {data.lcCommCr}
          </Grid>
        </Grid>
        <Grid container sx={{ fontSize: 14, mb: 0.5 }}>
          <Grid item xs={8}>
            FI CHARGES
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', pr: 4 }}>
            {data.fiCharges}
          </Grid>
        </Grid>
        <Grid container sx={{ fontSize: 14, mb: 0.5 }}>
          <Grid item xs={8}>
            SWIFT
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', pr: 4 }}>
            {data.swift}
          </Grid>
        </Grid>
        <Grid container sx={{ fontSize: 14, mb: 0.5 }}>
          <Grid item xs={5}>
            L/C MARGIN
          </Grid>
          <Grid item xs={3} sx={{ textAlign: 'right' }}>
            {data.lcMarginPercent}
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', pr: 4 }}>
            {data.lcMarginAmount}
          </Grid>
        </Grid>

        <Box sx={{ width: '33%', ml: 'auto', mr: 4 }}>
          <Divider sx={{ borderColor: colors.border, my: 0.5 }} />
          <Typography sx={{ fontFamily: 'inherit', fontSize: 14, textAlign: 'right' }}>{data.subTotal}</Typography>
        </Box>

        <Grid container sx={{ fontSize: 14, mt: 1 }}>
          <Grid item xs={8}>
            FED
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', pr: 4 }}>
            {data.fed}
          </Grid>
        </Grid>

        <Box sx={{ width: '33%', ml: 'auto', mr: 4, mt: 1 }}>
          <Divider sx={{ borderColor: colors.border, my: 0.5 }} />
        </Box>

        <Grid container sx={{ fontSize: 14, fontWeight: 700, mt: 2 }}>
          <Grid item xs={6}>
            TOTAL DEBIT
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right', pr: 4 }}>
            {data.totalDebit}
          </Grid>
        </Grid>
        <Box sx={{ width: '33%', ml: 'auto', mr: 4 }}>
          <Divider sx={{ borderColor: colors.border, mt: 0.5 }} />
        </Box>
      </Box>

      {/* Statement Text */}
      <Typography sx={{ fontFamily: 'inherit', fontSize: 14, mt: 4, lineHeight: 1.8 }}>
        WE HAVE DEBITED {data.debitedAccount} WITH RS. {data.debitedAmount} AGAINST LETTER OF CREDIT NUMBER{' '}
        {data.lcNumber}
      </Typography>

      {/* Authorized Signature */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 8 }}>
        <Box sx={{ width: 260, textAlign: 'center' }}>
          <Divider sx={{ borderColor: colors.border, mb: 1 }} />
          <Typography sx={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 700 }}>AUTHORIZED SIGNATURE</Typography>
        </Box>
      </Box>
    </Box>
  </Card>
))

DebitAdviceSlip.displayName = 'DebitAdviceSlip'

export default DebitAdviceSlip