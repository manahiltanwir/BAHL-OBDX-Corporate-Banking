import React from 'react'
import { styled } from '@mui/material/styles'
import { Box, Card, Typography } from '@mui/material'


export const StyledPage = styled(Box)(({ theme }) => ({
  minHeight: '100%',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  }
}))

export const LedgerCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 14,
  boxShadow: '0 1px 2px rgba(11, 31, 58, 0.04)',
  padding: theme.spacing(4, 4, 3.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2.5, 2.5)
  }
}))

export const SectionIndex = styled(Typography)({
  position: 'absolute',
  top: -6,
  right: 20,
  fontFamily: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '4.5rem',
  fontWeight: 700,
  color: 'rgba(11, 31, 58, 0.05)',
  lineHeight: 1,
  userSelect: 'none',
  pointerEvents: 'none'
})

export const StyledSectionTitle = styled(Typography)({
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '1.1px',
  fontWeight: 700
})

export const FieldValue = styled(Typography)<{ component?: React.ElementType }>(() => ({
  fontWeight: 600,
  wordBreak: 'break-word'
}))