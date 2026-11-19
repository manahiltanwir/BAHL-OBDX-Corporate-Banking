
import React from 'react'
import { Grid, MenuItem, TextField, Typography } from '@mui/material'
import { currencyOptions, MENU_PROPS } from 'src/@core/components/rule-management/Constants'

type Props = {
  fromAmount: string
  toAmount: string
  currency: string
  onFromAmountChange: (value: string) => void
  onToAmountChange: (value: string) => void
  onCurrencyChange: (value: string) => void
  errors?: {
    currency?: string
    fromAmount?: string
    toAmount?: string
  }
}

const AmountRangeFields = ({
  fromAmount,
  toAmount,
  currency,
  onFromAmountChange,
  onToAmountChange,
  onCurrencyChange,
  errors = {}
}: Props) => (
  <>
    <Typography variant='subtitle1' sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
      Amount Range
    </Typography>

    <Grid container spacing={5}>
      <Grid item xs={12} sm={4}>
        <TextField
          select
          fullWidth
          required
          size='small'
          label='Currency'
          value={currency}
          error={!!errors.currency}
          helperText={errors.currency}
          onChange={e => onCurrencyChange(e.target.value)}
          SelectProps={{ MenuProps: MENU_PROPS }}
        >
          {currencyOptions.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          required
          size='small'
          label='From Amount'
          value={fromAmount}
          error={!!errors.fromAmount}
          helperText={errors.fromAmount}
          onChange={e => onFromAmountChange(e.target.value)}
          inputProps={{ inputMode: 'decimal' }}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          required
          size='small'
          label='To Amount'
          value={toAmount}
          error={!!errors.toAmount}
          helperText={errors.toAmount}
          onChange={e => onToAmountChange(e.target.value)}
          inputProps={{ inputMode: 'decimal' }}
        />
      </Grid>
    </Grid>
  </>
)

export default AmountRangeFields
