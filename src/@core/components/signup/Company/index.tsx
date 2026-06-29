// ** React Imports
import { useState, Fragment, ChangeEvent, MouseEvent, ReactNode } from 'react'

// // ** Next Imports
import Link from 'next/link'

// ** MUI Components
import LoadingButton from '@mui/lab/LoadingButton'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// ** custom hooks
// import { useCompany } from 'src/@core/hooks/form/useCompany'
import { useAuth } from 'src/hooks/useAuth'

// ** import form support components
import { InputField } from 'src/@core/components/form'
import Map from 'src/@core/components/map'

const CompanyDetails = ({ step }: { step: number }) => {
  // ** Hooks
  // const {
  //     form: { control, handleSubmit, formState: { errors }, setValue }
  // } = useCompany()
  const auth = useAuth()

  const onSubmit = (body: any) => {
    // auth.createCompany(body)
  }

  return (
    <Fragment key={step}>
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <Grid container rowGap={5} columnSpacing={5} style={{ width: '700px' }}>
        <Grid item xs={12}>
          <InputField
            name='name'
            label='Company Name'
            placeholder='Enter Company Name'
            //  @ts-ignore
            control={control}
          />
        </Grid>

        <Grid item xs={6}>
          <InputField
            name='email'
            label='Company Email'
            placeholder='Enter Company Email'
            //  @ts-ignore
            control={control}
          />
        </Grid>

        <Grid item xs={6}>
          <InputField
            name='phone'
            label='Contact Number'
            placeholder='Enter Contact Number'
            //  @ts-ignore
            control={control}
          />
        </Grid>

        <Grid item xs={12}>
          <InputField
            name='website'
            label='Website URL'
            placeholder='Enter Website URL'
            //  @ts-ignore
            control={control}
          />
        </Grid>

        <Grid item xs={12}>
          {/* <CountrySelect
              name='country'
            //   label='Country'
              placeholder='Enter country'
              //  @ts-ignore
              control={control}
            /> */}
        </Grid>

        <Grid item xs={6}>
          <InputField
            name='state'
            label='State'
            placeholder='Enter state'
            //  @ts-ignore
            control={control}
          />
        </Grid>

        <Grid item xs={6}>
          <InputField
            name='city'
            label='City'
            placeholder='Enter city'
            //  @ts-ignore
            control={control}
          />
        </Grid>

        <Grid item xs={12}>
          <InputField
            name='zip'
            label='Zip code'
            placeholder='Enter zip'
            //  @ts-ignore
            control={control}
          />
        </Grid>

        <Grid item xs={12}>
          {/* <Map
              onSelectLocation={(e: any) => {
                setValue('longitude', `${e.lng}`)
                setValue('latitude', `${e.lat}`)
              }}
            /> */}
          {/* {(errors.latitude || errors.longitude) && (
              <FormHelperText sx={{ color: 'error.main' }} id={`validation-schema-location`}>
                Location required
              </FormHelperText>
            )} */}
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton
            fullWidth
            sx={{ mb: 7 }}
            loading={auth.status === 'pending'}
            disabled={auth.status === 'pending'}
            loadingPosition='end'
            size='large'
            variant='contained'
            type='submit'
          >
            Submit & Next
          </LoadingButton>
        </Grid>
      </Grid>
      {/* </form> */}
    </Fragment>
  )
}

export default CompanyDetails
