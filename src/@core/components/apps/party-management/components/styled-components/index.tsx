import { styled } from '@mui/material/styles'
import { Box, Card, Typography, Accordion, TextField } from '@mui/material'

// ** Styled Components
export const StyledModuleIcon = styled(Box)(({ theme }) => ({
    width: 48,
    height: 48,
    borderRadius: theme.shape.borderRadius * 1.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}))

export const StyledSearchCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 1.75,
    boxShadow: theme.shadows[2]
}))

export const StyledPanelCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 1.75,
    boxShadow: theme.shadows[2],
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
}))

export const StyledPanelHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2.5),
    paddingBottom: theme.spacing(1.75),
    borderBottom: `1px solid ${theme.palette.divider}`
}))

export const StyledInfoValue = styled(Typography)(({ theme }) => ({
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.palette.text.primary
}))

export const StyledHighlightValue = styled(Typography)(() => ({
    fontSize: '1.125rem',
    fontWeight: 700,
    fontFamily: 'monospace'
}))

export const StyledControlRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.action.hover,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 1.5,
    border: `1px dashed ${theme.palette.divider}`,
    marginBottom: theme.spacing(2.5)
}))

export const StyledAlertBox = styled(Box)(({ theme }) => ({
    backgroundColor: '#f2d9b0',
    border: `1px solid ${'#f0a528'}`,
    borderRadius: theme.shape.borderRadius * 1.25,
    padding: theme.spacing(1.75),
    display: 'flex',
    gap: theme.spacing(1.5),
    alignItems: 'flex-start'
}))

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
    boxShadow: 'none',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: `${theme.shape.borderRadius}px !important`,
    '&:before': { display: 'none' },
    '&.Mui-expanded': { margin: 0 }
}))

// ** Disabled / read-only TextField (faded look)
export const StyledReadOnlyField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root.Mui-disabled': {
        backgroundColor: theme.palette.action.hover,
        borderRadius: theme.shape.borderRadius
    },
    '& .MuiInputBase-input.Mui-disabled': {
        WebkitTextFillColor: theme.palette.text.secondary,
        fontWeight: 500,
        opacity: 0.85
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.divider
    }
}))
