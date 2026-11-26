import React from 'react'
import { Box, Typography } from '@mui/material'
import { colors } from '../Types'
import { StyledInfoLabel, StyledStatCard } from '../Styled'

interface StatCardsProps {
  pending: number
  inProgress: number
  approved: number
  rejected: number
}

const StatCards = ({ pending, inProgress, approved, rejected }: StatCardsProps) => (
  <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, flexWrap: 'wrap', flexDirection: { xs: 'column', sm: 'row' } }}>
    {[
      { label: 'Pending', value: pending, color: colors.yellow },
      { label: 'In Progress', value: inProgress, color: colors.blue },
      { label: 'Approved', value: approved, color: colors.green },
      { label: 'Rejected', value: rejected, color: colors.danger }
    ].map(stat => (
      <StyledStatCard key={stat.label} sx={{ borderLeft: `6px solid ${stat.color}` }}>
        <StyledInfoLabel>{stat.label}</StyledInfoLabel>
        <Typography variant='h5' sx={{ fontWeight: 700 }}>
          {stat.value}
        </Typography>
      </StyledStatCard>
    ))}
  </Box>
)

export default StatCards