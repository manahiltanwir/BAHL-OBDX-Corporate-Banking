import React from 'react'
import { Grid } from '@mui/material'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import PaidIcon from '@mui/icons-material/Paid'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import StatTile from '../StatTile'
import { DebitAdviceData } from '../adviceTheme'

interface AdviceStatsProps {
  data: DebitAdviceData
}

const AdviceStats = ({ data }: AdviceStatsProps) => (
  <Grid item xs={12} className='no-print'>
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatTile icon={<ReceiptLongIcon />} label='LC Number' value={data.lcNumber} sub={`${data.ccy} ${data.billAmount}`} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatTile icon={<PaidIcon />} label='Total Debit' value={`Rs. ${data.totalDebit}`} sub='Incl. FED & charges' />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatTile icon={<AccountBalanceIcon />} label='Debited Account' value={data.debitedAccount} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatTile icon={<CalendarMonthIcon />} label='Advice Date' value={data.adviceDate} sub={data.status} />
      </Grid>
    </Grid>
  </Grid>
)

export default AdviceStats