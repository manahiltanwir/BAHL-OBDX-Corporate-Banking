// ** MUI Imports
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icons Imports
import CircleOutline from 'mdi-material-ui/CircleOutline'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'


// ** Styled Component for the wrapper of whole component
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    position: 'relative',
    padding: theme.spacing(12, 6, 6),
    borderRadius: theme.shape.borderRadius
}))

// ** Styled Component for the wrapper of all the features of a plan
const BoxFeature = styled(Box)<BoxProps>(({ theme }) => ({
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    '& > :not(:first-of-type)': {
        marginTop: theme.spacing(4)
    }
}))

interface PricingPlanProps {
    subscription: any,
    onSubscriptionSelect: (subscriptions: any) => void
}

// {
//     title: "string",
//     imgSrc: "https://pixinvent.com/demo/materialize-mui-react-nextjs-admin-template/demo-4/images/pages/pricing-illustration-2.png",
//     imgWidth: 100,
//     imgHeight: 100,
//     subtitle: "string",
//     currentPlan: "boolean",
//     popularPlan: "boolean",
//     monthlyPrice: "1",
//     planBenefits: ["string", "string"],
//     yearlyPlan: {
//         perMonth: "1",
//         totalAnnual: "1",
//     }
// },

const PlanDetails = (props: PricingPlanProps) => {
    // ** Props
    const { subscription } = props

    const renderFeatures = () => {
        return subscription?.planBenefits.map((item: string, index: number) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                <CircleOutline sx={{ mr: 2.5, fontSize: '0.875rem', color: 'text.secondary' }} />
                <Typography variant='body2'>{item}</Typography>
            </Box>
        ))
    }

    return (
        <BoxWrapper
            sx={{
                border: theme =>
                    !subscription?.popularPlan
                        ? `1px solid ${theme.palette.divider}`
                        : `1px solid ${hexToRGBA(theme.palette.primary.main, 0.5)}`
            }}
        >
            {subscription?.popularPlan ? (
                <CustomChip
                    skin='light'
                    size='small'
                    label='Popular'
                    color='primary'
                    sx={{
                        top: 16,
                        right: 24,
                        position: 'absolute',
                        '& .MuiChip-label': {
                            px: 2.5,
                            fontSize: '0.8125rem'
                        }
                    }}
                />
            ) : null}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img
                    src={"https://pixinvent.com/demo/materialize-mui-react-nextjs-admin-template/demo-4/images/pages/pricing-illustration-2.png"}
                    alt={`${subscription?.title.toLowerCase()}-subscription`}
                />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 1.5 }}>
                    {subscription?.title}
                </Typography>
                <Typography variant='body2'>{subscription?.subtitle}</Typography>
                <Box sx={{ mt: 5, mb: 10, position: 'relative' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography variant='body2' sx={{ mt: 1.6, alignSelf: 'flex-start' }}>
                            $
                        </Typography>
                        <Typography variant='h3' sx={{ fontWeight: 500, color: 'primary.main', lineHeight: 1.17 }}>
                            {subscription?.price}
                        </Typography>
                        <Typography variant='body2' sx={{ mb: 1.6, alignSelf: 'flex-end' }}>
                            /{" "}
                            {subscription?.expireYears >= 1 && `${subscription?.expireYears} Years`}
                            {" "}
                            {subscription?.expireMonths >= 1 && `${subscription?.expireMonths} Month`}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            {/* <BoxFeature>{renderFeatures()}</BoxFeature> */}
            <Button
                fullWidth
                // color={subscription?.currentPlan ? 'success' : 'primary'}
                // variant={subscription?.popularPlan ? 'contained' : 'outlined'}
                onClick={() => props.onSubscriptionSelect(subscription)}
            >
                Subscribe
            </Button>
        </BoxWrapper>
    )
}

export default PlanDetails
