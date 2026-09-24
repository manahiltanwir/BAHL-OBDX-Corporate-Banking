import React from 'react'
import { Grid, Typography } from '@mui/material'
import { FieldValue } from '../Styles' 
import { looksNumeric } from '../Utils' 

type Props = { label: string; value: string }

const ReviewField = ({ label, value }: Props) => {
  const hasValue = value && value.trim() !== ''

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant='caption' sx={{ display: 'block', mb: 0.5, letterSpacing: '0.2px' }}>
        {label}
      </Typography>
      <FieldValue
        variant='body1'
        sx={{
          fontFamily:
            hasValue && looksNumeric(value) ? '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace' : 'inherit',
          fontSize: hasValue && looksNumeric(value) ? '0.95rem' : '1rem',
          color: '#15804f'
        }}
      >
        {hasValue ? value : '—'}
      </FieldValue>
    </Grid>
  )
}

export default ReviewField