// ** React Imports
import { Fragment } from 'react'

// ** MUI
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'

// ** custom hooks
// import { usePersnolInfo } from 'src/@core/hooks/form/usePersnolInfo'
import { useAuth } from 'src/hooks/useAuth'

// ** import form support components
import { InputField, RadioField } from 'src/@core/components/form'

const PersnolDetails = ({ step }: { step: number }) => {
  // ** Hooks
  // const {
  //     form: { control, handleSubmit, formState: { errors } }
  // } = usePersnolInfo()
  const auth = useAuth()

  const onSubmit = (body: any) => {
    // auth.createAccount(body)
  }

  return (
    <Fragment key={step}>
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <Grid container rowGap={5} columnSpacing={5} style={{ width: '700px' }}>
        <Grid item xs={6}>
          <InputField
            name='first_name'
            label='First Name'
            placeholder='Enter First Name'
            //  @ts-ignore
            control={control}
          />
        </Grid>
        <Grid item xs={6}>
          <InputField
            name='last_name'
            label='Last Name'
            placeholder='Enter Last Name'
            //  @ts-ignore
            control={control}
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            name='email'
            label='Email'
            placeholder='Enter Email'
            //  @ts-ignore
            control={control}
          />
        </Grid>
        <Grid item xs={6}>
          <InputField
            name='password'
            label='Password'
            placeholder='Enter Password'
            //  @ts-ignore
            control={control}
          />
        </Grid>
        <Grid item xs={6}>
          <InputField
            name='confirm_password'
            label='Confirm Password'
            placeholder='Enter Confirm Password'
            //  @ts-ignore
            control={control}
          />
        </Grid>
        <Grid item xs={12}>
          <RadioField
            name='gender'
            label='Gender'
            options={[
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' }
            ]}
            //  @ts-ignore
            control={control}
          />
        </Grid>

        <Grid item xs={12}>
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

export default PersnolDetails
