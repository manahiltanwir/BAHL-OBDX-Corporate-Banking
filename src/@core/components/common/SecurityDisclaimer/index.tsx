import { Alert, AlertColor, AlertTitle, Grid } from '@mui/material'

interface ISecurityDisclaimerProps {
    alertTitle: string
    alertMessage: string
    severity: AlertColor
    variant: "standard" | "filled" | "outlined"
}

const SecurityDisclaimer = ({ alertMessage, alertTitle, severity, variant }: ISecurityDisclaimerProps) => {
    return (
        <Grid item xs={12}>
            <Alert
                severity={severity}
                variant={variant}
                sx={{
                    alignItems: 'flex-start',
                    borderRadius: 2,
                    bgcolor: 'warning.lighter',
                    '& .MuiAlert-icon': { mt: 0.25 }
                }}
            >
                <AlertTitle sx={{ fontWeight: 700, mb: 0.5 }}>{alertTitle}</AlertTitle>
                {alertMessage}
            </Alert>
        </Grid>
    )
}

export default SecurityDisclaimer