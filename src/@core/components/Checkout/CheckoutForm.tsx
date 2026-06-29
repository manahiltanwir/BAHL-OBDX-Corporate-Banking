import React, { useEffect, useState, useContext } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import stripeJs from '@stripe/stripe-js'
import LoadingButton from '@mui/lab/LoadingButton'
import Typography from '@mui/material/Typography'
import { AuthContext } from 'src/context/AuthContext'

export default function CheckoutForm({ paymentIntent }: { paymentIntent: stripeJs.PaymentIntent }) {
  const { handleNext } = useContext(AuthContext)

  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!stripe) {
      return
    }

    if (!paymentIntent || paymentIntent.client_secret) {
      return
    }

    if (paymentIntent && paymentIntent.client_secret) {
      stripe.retrievePaymentIntent(paymentIntent.client_secret).then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case 'succeeded':
            setMessage('Payment succeeded!')
            break
          case 'processing':
            setMessage('Your payment is processing.')
            break
          case 'requires_payment_method':
            setMessage('Your payment was not successful, please try again.')
            break
          default:
            setMessage('Something went wrong.')
            break
        }
      })
    }
  }, [stripe])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `http://54.145.247.199/api/v1/invoice/payment_intents/confirm/${paymentIntent.id}` // live
        // return_url: `http://192.168.0.136:8002/api/v1/invoice/payment_intents/confirm/${paymentIntent.id}` // local
      }
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(`${error.message}`)
    } else {
      setMessage('An unexpected error occurred.')
    }

    if (!error) {
      handleNext()
    }
    setIsLoading(false)
  }

  return (
    <>
      <form id='payment-form' onSubmit={handleSubmit}>
        <PaymentElement id='payment-element' options={{ layout: 'tabs' }} />
        <LoadingButton
          disabled={isLoading || !stripe || !elements}
          style={{ marginTop: 20 }}
          type='submit'
          id='submit'
          variant='contained'
          fullWidth
          sx={{
            color: 'white',
            background: 'linear-gradient(360deg, #EFD9AE -73.58%, #B4772C 97.53%)'
          }}
        >
          Pay Now
        </LoadingButton>
        {message && <Typography id='payment-message'>{message}</Typography>}
      </form>
    </>
  )
}
