
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';

import { InputField, Select, FileUploader } from 'src/@core/components/form'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton';
// import { AuthContext } from '../../Context/AuthContext';
// import { ShippingContext } from '../../Context/ShippingContext';
import { IntentBody, ShippingType } from 'src/@core/components/Checkout/type'

export type ShippingCallbackType = (err: { [key: string]: string }) => void


interface IShippingDetailsForm {
    onSubmitShipping: (s: IntentBody) => void
}

const ShippingDetailsForm = ({ onSubmitShipping }: IShippingDetailsForm) => {

    const {
        handleSubmit,
        control,
        reset,
    } = useForm();

    const onSubmit = async (body: any) => {
        const shipping: IntentBody = {
            name: body.name,
            email: body.email,
            subscriptionId: "0570a3f3-012f-4b0f-9957-6dce454d7b41",
            // shipping: {
            //     line1: body.address.line1,
            //     postal_code: body.address.postal_code,
            //     city: body.address.city,
            //     state: body.address.state,
            //     country: body.address.country
            // }
        }
        onSubmitShipping(shipping)
    }

    useEffect(() => {

        return () => {
            reset()
        }
    }, [])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card >
                <Grid container rowGap={5} padding={5} >
                    <Typography variant='h5' >Checkout</Typography>
                    <Grid item xs={12}>
                        <InputField
                            type="text"
                            placeholder="Full Name"
                            label="Full Name"
                            name='name'
                            // @ts-ignore
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputField
                            type="text"
                            placeholder="Enter email"
                            label="Email"
                            name='email'
                            // @ts-ignore
                            control={control}
                        />
                    </Grid>
                    {/* <Grid item xs={12}>
                        <InputField
                            type="text"
                            placeholder="Enter address line 1"
                            label="address line 1"
                            name='address.line1'
                            // @ts-ignore
                            control={control}
                        />
                    </Grid> */}
                    {/* <Grid item xs={12}>
                        <InputField
                            type="text"
                            placeholder="Enter Your Postal Code"
                            label="postal code"
                            name='address.postal_code'
                            // @ts-ignore
                            control={control}
                        />
                    </Grid> */}
                    {/* <Grid item xs={12}>
                        <InputField
                            type="text"
                            label=""
                            placeholder="City"
                            name='address.city'
                            // @ts-ignore
                            control={control}
                        />
                    </Grid> */}
                    {/* <Grid item xs={12}>
                        <InputField
                            type="text"
                            placeholder="Enter Your State"
                            label="state"
                            name='address.state'
                            // @ts-ignore
                            control={control}
                        />
                    </Grid> */}
                    {/* <Grid item xs={12}>
                        <InputField
                            type="text"
                            placeholder="Country"
                            label="country"
                            name='address.country'
                            // @ts-ignore
                            control={control}
                        />
                    </Grid> */}
                    <LoadingButton type='submit' fullWidth >Go Proceed to next</LoadingButton>
                </Grid>
            </Card>
        </form>
    )
}

export default ShippingDetailsForm
