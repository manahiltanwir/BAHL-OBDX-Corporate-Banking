// ** React Imports
import { ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'

interface Props {
    plan: string
    handleChange: (e: ChangeEvent<{ checked: boolean }>) => void
}

const Header = (props: Props) => {
    // ** Props
    const { plan, handleChange } = props

    return (
        <Box sx={{ mb: 12, textAlign: 'center' }}>
            <Typography variant='h4'>Subscription Plans</Typography>
            <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant='body2'>
                    All plans include 40+ advanced tools and features to boost your product.
                </Typography>
                <Typography variant='body2'>Choose the best plan to fit your needs.</Typography>
            </Box>
            {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <InputLabel htmlFor='pricing-switch' sx={{ fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>
                    Plans
                </InputLabel>
                <Switch color='secondary' id='pricing-switch' onChange={handleChange} checked={plan === 'annually'} />
                <InputLabel htmlFor='pricing-switch' sx={{ fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>
                    Custom
                </InputLabel>
            </Box> */}
        </Box>
    )
}

export default Header
