// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import SubscriptionDetail from 'src/@core/components/subscription/SubscriptionDetail'

interface Props {
  subscriptions: any[],
  onSubscriptionSelect: (subscriptions: any) => void
}

const PricingPlans = (props: Props) => {

  // ** Props
  const { subscriptions } = props

  const renderPlan = () => {
    return (subscriptions && subscriptions.length) && subscriptions.map((subscription) => {
      return (
        <Grid item xs={12} md={4} key={subscription.title.toLowerCase()}>
          <SubscriptionDetail
            subscription={subscription}
            onSubscriptionSelect={(subscription) => props.onSubscriptionSelect(subscription)}
          />
        </Grid>
      )
    })
  }

  return (
    <Grid container spacing={6}>
      {renderPlan()}
    </Grid>
  )
}

export default PricingPlans
