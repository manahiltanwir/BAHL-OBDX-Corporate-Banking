import { styled, Typography } from "@mui/material"

export const StyledInfoLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: theme.spacing(0.5),
    letterSpacing: 1
}))

export const StyledInfoValue = styled(Typography)(() => ({
    fontWeight: 600,
    letterSpacing: 1
}))
