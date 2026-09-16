// ** React Imports
import { useState, ReactNode, MouseEvent } from 'react'

// ** MUI Components

import { keyframes, Keyframes } from '@emotion/react'
import LoadingButton from '@mui/lab/LoadingButton'

import { InputField } from 'src/@core/components/form'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { FormLabel } from '@mui/material'
import { useRouter } from 'next/router'

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }`
const styles = {
  page: {
    minHeight: '100dvh',
    boxSizing: 'border-box',
    p: { xs: 2, md: 3 },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    background: 'linear-gradient(-45deg, #0c8f54, #0d9a5b, #105f3b, #fbb048, #ffa016)',
    backgroundSize: '400% 400%',
    animation: `${gradientAnimation} 15s ease infinite`
  },
  subPage: {
    width: {
      xs: '100%',
      sm: '500px',
      md: '500px'
    },
    bgcolor: '#fff',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
    p: 3
  },

  rightPanel: {
    width: '100%',
    bgcolor: '#fff',
    px: {
      xs: 3,
      md: 5
    },
    py: {
      xs: 3,
      md: 4
    },
    display: 'flex',
    flexDirection: 'column'
  },

  rightLogo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    mt: 3,
    mb: 3
  },
  loginForm: {
    width: '100%',
    maxWidth: {
      xs: '100%',
      sm: 420
    },
    mx: 'auto'
  },

  loginButton: {
    mt: 2,
    mb: 0,
    height: 52,
    borderRadius: '12px',
    bgcolor: '#105f3b',
    '&:hover': {
      bgcolor: '#0c8f54'
    }
  },

  forgotUsernameDescription: {
    fontSize: '15px',
    color: '#6B7280',
    textAlign: 'center', // Left align text
    width: '100%', // Take full width
    mb: 4,
    mt: 2,
    lineHeight: 1.6
  }
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  cnicOrPassport: yup.string().required(''),
  partyId: yup.string().required(),
  dob: yup.string().optional().max(30),
})

// const defaultValues = {
//   email: 'lazad@mailinator.com',
//   partyId: 'NTN-9991',
//   cnicOrPassport: '123456789123',
//   dob: '1973-11-14'
// }
const defaultValues = {
  email: '',
  partyId: '',
  cnicOrPassport: '',
  dob: ''
}

interface FormData {
  email: string
  cnicOrPassport: string
  partyId: string
  dob: string
}

const LoginPage = () => {
  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const bgClasses = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const { push } = useRouter();

  const onSubmit = (data: FormData) => {
    const { email, cnicOrPassport, partyId, dob } = data

    auth.forgotUsername({ email, cnicOrPassport, partyId, dob }, error => {
      toast.error(error?.message || 'Invalid record entered')
    })
  }
  const imageSource = skin === 'bordered' ? 'bahl' : 'bahl'

  return (
    <Box sx={styles.page}>
      <Box sx={styles.subPage}>
        {/* Right Panel */}
        <Box sx={styles.rightPanel}>
          {/* Logo */}
          <Box sx={styles.rightLogo}>
            <img
              src='/images/pages/alhabib.png'
              alt='Bank AL Habib'
              style={{
                width: hidden ? 140 : 170,
                height: 'auto'
              }}
            />
          </Box>
          <Typography sx={styles.forgotUsernameDescription}>
            Verify your identity to retrieve your <b>Username</b> securely.
          </Typography>
          {/* Login Form */}
          <Box sx={styles.loginForm}>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              {/* Username */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputField name='email' control={control} label='Email Address' placeholder='email@example.com' />
              </FormControl>
              {/* mOBILE PHONE */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputField name='cnicOrPassport' type='text' control={control} label='CNIC/Passport No' placeholder='Enter CNIC Or Passport No' />
              </FormControl>

              {/* CNIC */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputField name='partyId' control={control} label='Company Registration No' placeholder='XXXXX-XXXXXXX-X' />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputField
                  name='dob'
                  label='Date Of Birth'
                  placeholder=''
                  // @ts-ignore
                  type='date'
                  control={control}
                  size='small'
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>

              {/* Login Button */}
              <LoadingButton
                fullWidth
                variant='contained'
                size='large'
                type='submit'
                loading={auth.status === 'pending'}
                disabled={auth.status === 'pending'}
                loadingPosition='end'
                sx={styles.loginButton}
              >
                Continue
              </LoadingButton>
            </form>
            <LoadingButton
              fullWidth
              variant='outlined'
              size='large'
              type='submit'
              loadingPosition='end'
              sx={{ mt: 3 }}
              onClick={() => push('/login')}
            >
              Back to login
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
