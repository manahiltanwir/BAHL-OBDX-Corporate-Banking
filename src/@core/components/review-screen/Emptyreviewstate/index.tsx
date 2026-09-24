import React from 'react'
import { Button, Grid, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import { StyledPage, LedgerCard } from '../Styles'

type Props = {
  message?: string
  buttonLabel?: string
  onBack: () => void
}

const EmptyReviewState = ({
  message = "Fill in the details first — they'll appear here for final review before saving.",
  buttonLabel = 'Go to form',
  onBack
}: Props) => (
  <StyledPage>
    <Grid container spacing={6} justifyContent='center'>
      <Grid item xs={12} md={6}>
        <LedgerCard sx={{ textAlign: 'center', py: 6 }}>
          <ShieldOutlinedIcon sx={{ fontSize: 40, mb: 2 }} />
          <Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>
            Nothing to review yet
          </Typography>
          <Typography variant='body2' sx={{ mb: 3 }}>
            {message}
          </Typography>
          <Button startIcon={<ArrowBackIcon fontSize='small' />} variant='contained' onClick={onBack}>
            {buttonLabel}
          </Button>
        </LedgerCard>
      </Grid>
    </Grid>
  </StyledPage>
)

export default EmptyReviewState