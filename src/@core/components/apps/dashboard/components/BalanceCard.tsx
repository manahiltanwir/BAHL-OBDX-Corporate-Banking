// ** MUI Imports
import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import Box from '@mui/material/Box'
import LoadingButton from '@mui/lab/LoadingButton'


interface BalanceCardProps {
    title: string
    label: string
    CASAAccountCurrency: string
    CASAAccountAmount: string
    TDAccountCurrency: string
    TDAccountAmount: string
    btnLabel: string
}

const BalanceCard = (props: BalanceCardProps) => {
    // ** Props
    const { CASAAccountAmount, CASAAccountCurrency, TDAccountAmount, TDAccountCurrency, btnLabel, label, title } = props


    return (
        <Card>
            <CardHeader
                sx={{ pb: 3.25 }}
                title={title}
                titleTypographyProps={{ variant: 'h6' }}
                action={
                    <CustomChip
                        skin='light'
                        size='small'
                        label={label}
                        color={'success'}
                        sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
                    />
                }
                subheader={
                    <Box sx={{ display: 'flex', mt: 5 }}>
                        <Typography variant='h6' sx={{ mr: 1.5 }}>
                            {CASAAccountCurrency}
                        </Typography>
                        <Typography variant='h6' sx={{ color: 'success.main' }}>
                            {CASAAccountAmount}
                        </Typography>
                    </Box>
                }
            />
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pt: 2 }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography variant='h6' sx={{ mr: 1.5 }}>
                            {TDAccountCurrency}
                        </Typography>
                        <Typography variant='h6' sx={{ color: 'success.main', }}>
                            {TDAccountAmount}
                        </Typography>
                    </Box>
                    <Box sx={{ marginLeft: "auto" }}>
                        <LoadingButton
                            fullWidth
                            // loading={auth.status === 'pending'}
                            // disabled={auth.status === 'pending'}
                            loadingPosition="end"
                            size='small'
                            variant="contained"
                            type='submit'
                        >
                            {btnLabel}
                        </LoadingButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}

export default BalanceCard
