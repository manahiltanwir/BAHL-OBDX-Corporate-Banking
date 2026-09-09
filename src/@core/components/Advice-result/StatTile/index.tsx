import React from 'react'
import { Avatar, Box, Card, Typography } from '@mui/material'
import { colors } from '../adviceTheme'

interface StatTileProps {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
}

const StatTile = ({ icon, label, value, sub }: StatTileProps) => (
  <Card
    variant='outlined'
    sx={{
      p: 3,
      height: '100%',
      borderRadius: 3,
      borderColor: 'divider',
      display: 'flex',
      alignItems: 'center',
      gap: 2.5,
      transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      '&:hover': {
        boxShadow: '0 6px 18px rgba(21, 128, 79, 0.08)',
        transform: 'translateY(-2px)'
      }
    }}
  >
    <Avatar sx={{ bgcolor: colors.greenSoft, color: colors.green, width: 46, height: 46 }}>{icon}</Avatar>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant='caption' sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {label}
      </Typography>
      <Typography variant='subtitle1' sx={{ fontWeight: 700, lineHeight: 1.3, wordBreak: 'break-word' }}>
        {value}
      </Typography>
      {sub && (
        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
          {sub}
        </Typography>
      )}
    </Box>
  </Card>
)

export default StatTile