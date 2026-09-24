import React from 'react'
import { Grid, TextField, Typography } from '@mui/material'

type Props = {
  fromAmount: string
  toAmount: string
  onFromAmountChange: (value: string) => void
  onToAmountChange: (value: string) => void
}

const AmountRangeFields = ({ fromAmount, toAmount, onFromAmountChange, onToAmountChange }: Props) => (
  <>
    <Typography variant='subtitle1' sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
      Amount Range
    </Typography>
    <Grid container spacing={5}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          size='small'
          label='From Amount'
          value={fromAmount}
          onChange={e => onFromAmountChange(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth size='small' label='To Amount' value={toAmount} onChange={e => onToAmountChange(e.target.value)} />
      </Grid>
    </Grid>
  </>
)

export default AmountRangeFields