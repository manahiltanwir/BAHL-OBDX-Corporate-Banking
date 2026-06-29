import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

export const DrawerHeader = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3, 4),
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.default
}))