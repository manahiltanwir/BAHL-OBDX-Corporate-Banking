import { styled } from '@mui/material/styles'
import { Card, Tab, Tabs, Typography } from '@mui/material'
import { colors } from '../Types'
export const StyledInfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  color: theme.palette.text.secondary,
  fontWeight: 700,
  textTransform: 'uppercase',
  marginBottom: theme.spacing(0.5)
}))

export const StyledTabs = styled(Tabs)(() => ({
  minHeight: 44,
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: 3,
    backgroundColor: colors.green
  }
}))

export const StyledTab = styled(Tab)(() => ({
  minHeight: 44,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  '&.Mui-selected': {
    color: colors.green
  }
}))

export const StyledStatCard = styled(Card)(({ theme }) => ({
  flex: 1,
  width: '100%',
  padding: theme.spacing(2.75),
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: theme.shadows[2],
  [theme.breakpoints.up('sm')]: {
    width: 'auto'
  }
}))

export const StyledMobileCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: theme.shadows[1],
  cursor: 'pointer'
}))