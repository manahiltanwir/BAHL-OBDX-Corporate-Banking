// ** React Imports
import { useState, ChangeEvent, Fragment, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import MuiCardContent, { CardContentProps } from '@mui/material/CardContent'

import PricingPlans from 'src/@core/components/subscription/SubsctionPlans'
import SubscriptionHeader from 'src/@core/components/subscription/SubscriptionHeader'
import Checkout from 'src/@core/components/Checkout'

// import { useSubscription } from 'src/@core/hooks/form/useSubscription'

// ** Styled Components
const CardContent = styled(MuiCardContent)<CardContentProps>(({ theme }) => ({
  padding: theme.spacing(20, 35, 35),
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(12.5, 20, 20)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(10, 5)
  },
  width: '100%'
}))

const Pricing = ({ step }: { step: number }) => {
  // const { getSubscriptions, store } = useSubscription(null)
  // const { getSubscriptions } = useSubscription(null)

  const [plan, setPlan] = useState<'PRE_DEFINED' | 'CUSTOM'>('PRE_DEFINED')
  const [subscription, setSubscription] = useState<{ [key: string]: any } | null>(null)

  useEffect(() => {
    // getSubscriptions({ query: '' })
  }, [])

  const handleChange = (e: ChangeEvent<{ checked: boolean }>) => {
    if (e.target.checked) {
      setPlan('CUSTOM')
    } else {
      setPlan('PRE_DEFINED')
    }
  }

  return (
    <Fragment key={step}>
      {subscription ? (
        // @ts-ignore
        <Checkout subscription={''} />
      ) : (
        <CardContent>
          <SubscriptionHeader plan={plan} handleChange={handleChange} />
          <PricingPlans
            // subscriptions={store.subscriptions}
            subscriptions={[]}
            onSubscriptionSelect={subscription => setSubscription(subscription)}
          />
        </CardContent>
      )}
    </Fragment>
  )
}

export default Pricing
