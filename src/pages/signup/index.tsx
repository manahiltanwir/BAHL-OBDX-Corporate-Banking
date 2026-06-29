// ** React Imports
import { useState, ReactNode } from 'react'

// ** next
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Grid from '@mui/material/Grid'
import MuiLink from '@mui/material/Link'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// ** import form support components
import { InputField, Select, RadioField } from 'src/@core/components/form'
import InputPassword from 'src/@core/components/ControllForm/InputPassword'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/GuestLayout'

// ** Third Party Imports
import toast from 'react-hot-toast'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** types
import { RegisterParams } from 'src/context/types'

const schema = yup.object().shape({
  first_name: yup.string().min(3).max(50, 'First Name must be at most 50 characters').required(),
  last_name: yup.string().min(3).max(50, 'Last Name must be at most 50 characters').required(),
  email: yup.string().min(5).max(50, 'Email must be at most 50 characters').email('Invalid email address').required(),
  password: yup.string().min(5).max(25, 'Password must be at most 50 characters').required()
})

const defaultValues: RegisterParams = {
  first_name: '',
  last_name: '',
  password: '',
  confirm_password: '',
  email: '',
  role: 'TEACHER',
  gender: 'MALE'
}

const Signup = () => {
  const auth = useAuth()

  const {
    query: { key }
  } = useRouter()

  const {
    control,
    setError,
    handleSubmit,
    formState
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: RegisterParams) => {
    auth.register(data, key || null, error => {
      setError('password', {
        type: 'manual',
        message: error?.message || 'Invalid credentials!'
      })
      toast.error(error?.message || 'Invalid credentials!')
    })
  }
  return (
    <>
      <Grid container alignItems={'center'} sx={{ height: "80vh" }}>
        <Grid item md={6} xs={12} textAlign='center'>
          <Image src={'/images/cards/SignupImage.png'} alt='SignupImage' width={300} height={200} />
        </Grid>
        <Grid item md={6} xs={12}>
          <Box sx={{ mb: 5 }}>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Grid container>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 4, mr: 1 }}>
                    <InputField
                      name='first_name'
                      label='First Name'
                      placeholder='First Name'
                      control={control}
                      sx={{ marginRight: "10px" }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <InputField
                      name='last_name'
                      label='Last Name'
                      placeholder='Last Name'
                      control={control}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputField
                  name='email'
                  label='email'
                  placeholder='Enter Email'
                  control={control}
                />
              </FormControl>

              <Grid item xs={12} sx={{ mb: 4 }}>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                    <InputPassword
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={Boolean(error)}
                      label='Password'
                      placeholder='Enter password'
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sx={{ mb: 4 }}>
                <Controller
                  name='confirm_password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                    <InputPassword
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={Boolean(error)}
                      label='Confirm password'
                      placeholder='Enter Confirm Password'
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sx={{ mb: 4 }}>
                <Select name='role' control={control} label='Select Role'>
                  <MenuItem value='STUDENT'>Student</MenuItem>
                  <MenuItem value='TEACHER'>Teacher</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sx={{ mb: 4 }}>
                <RadioField
                  name='gender'
                  label='Gender'
                  options={[{ value: "MALE", label: "Male" }, { value: "FEMALE", label: "Female" }]}
                  control={control}
                />
              </Grid>

              <Box
                sx={{ mb: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
              >
                <Link passHref href='/forgot-password'>
                  <Typography component={MuiLink} variant='body2' sx={{ color: 'primary.main' }}>
                    Forgot Password?
                  </Typography>
                </Link>
              </Box>

              <LoadingButton
                fullWidth
                sx={{ my: 2 }}
                loading={auth.status === 'pending'}
                disabled={auth.status === 'pending'}
                loadingPosition='end'
                size='large'
                variant='contained'
                type='submit'
              >
                Signup
              </LoadingButton>

              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography sx={{ mr: 3, color: 'text.secondary' }}>Don't have an account?</Typography>
                <Typography>
                  <Link passHref href='/login'>
                    <Typography component={MuiLink} sx={{ color: 'primary.main' }}>
                      Log In
                    </Typography>
                  </Link>
                </Typography>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid >
    </>
  )
}

Signup.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Signup.guestGuard = true

export default Signup
