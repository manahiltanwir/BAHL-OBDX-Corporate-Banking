// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import MuiCardContent, { CardContentProps } from '@mui/material/CardContent'

import stripeJs, { loadStripe, Appearance } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

// ** Demo Imports
// import PricingCTA from 'src/views/pages/pricing/PricingCTA'
// import PricingPlans from 'src/@core/components/subscription/SubsctionPlans'
// import SubscriptionHeader from 'src/@core/components/subscription/SubscriptionHeader'
import ShippingDetailsForm from 'src/@core/components/Checkout/ShippingDetailsForm'
import CheckoutForm from 'src/@core/components/Checkout/CheckoutForm'
// import PricingFooter from 'src/views/pages/pricing/PricingFooter'

import { IntentBody } from 'src/@core/components/Checkout/type'

import toast from 'react-hot-toast'
import { InvoiceService } from 'src/services'
import { ISubscription } from 'src/types/apps/subscription'
import { Skeleton } from '@mui/material'

const stripePromise = loadStripe(
  'pk_test_51MFR2TIadObZ2b5rMClrfGQqKXqrJD3ZwO7Oy3THjAVxmsNifhkcNVLkCVOZyn5hVyonASBfle6A4MDgDkJCqF0Q00TsDGn1Rg'
)
// pk_test_51MFR2TIadObZ2b5rMClrfGQqKXqrJD3ZwO7Oy3THjAVxmsNifhkcNVLkCVOZyn5hVyonASBfle6A4MDgDkJCqF0Q00TsDGn1Rg
// sk_test_51MFR2TIadObZ2b5rh7mfKwSaAbNLgR0QxgTSIWNUlzBD0M6RQYDg4YVI7RzLzZOg2pbkrqSZlJyIWP2Ye8JDWG35004dE9L9oI
interface Props {
  subscription: ISubscription
}
const Checkout: React.FC<Props> = ({ subscription }) => {
  const [paymentIntent, setPaymentIntent] = useState<stripeJs.PaymentIntent | null>(null)

  const appearance: Appearance = {
    theme: 'stripe'
  }

  const createPaymentIntent = (data: IntentBody) => {
    InvoiceService.createPaymentIntent(data)
      .then(async ({ data: response }) => {
        setPaymentIntent(response.data.payment)
      })
      .catch(error => {
        error ?? toast.error(error.response.data.message || 'Something went wrong!')
      })
  }

  async function createPaymentIntentHandler(shipping: IntentBody) {
    createPaymentIntent(shipping)
  }

  useEffect(() => {
    createPaymentIntentHandler({
      subscriptionId: subscription.id
    })

    return () => {
      setPaymentIntent(null)
    }
  }, [])

  return (
    <Fragment>
      {paymentIntent ? (
        <Elements
          options={{ appearance, clientSecret: paymentIntent.client_secret ? paymentIntent.client_secret : '' }}
          stripe={stripePromise}
        >
          <CheckoutForm paymentIntent={paymentIntent} />
        </Elements>
      ) : (
        <Skeleton variant='rectangular' width={'100%'} height={'100%'} />
      )}
    </Fragment>
  )
}

export default Checkout
