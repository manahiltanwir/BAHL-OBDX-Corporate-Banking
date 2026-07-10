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
    textAlign: 'left', // Left align text
    width: '100%', // Take full width
    mb: 4,
    mt: 2,
    lineHeight: 1.6
  }
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  mobile: yup
    .string()
    .required('Phone number is required')
    .matches(/^03\d{9}$/, 'Phone number is invalid'),
  cnic: yup.string().required()
})

const defaultValues = {
  email: '',
  mobile: '',
  cnic: ''
}

interface FormData {
  email: string
  mobile: string
  cnic: string
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
  // const onSubmit = (data: FormData) => {
  //   console.log(data)
  // }
  //   const onSubmit = (data: FormData) => {
  //   const { email, mobile, cnic } = data;

  //   auth.forgotUsername(
  //     { email, mobile, cnic },
  //     error => {
  //       setError('email', {
  //         type: 'manual',
  //         message: error?.message || 'Invalid Email'
  //       });

  //       setError('mobile', {
  //         type: 'manual',
  //         message: error?.message || 'Invalid Phone Number'
  //       });

  //       setError('cnic', {
  //         type: 'manual',
  //         message: error?.message || 'Invalid CNIC Number'
  //       });

  //       toast.error(error?.message || 'Invalid credentials!');
  //     }
  //   );
  // };

  const onSubmit = (data: FormData) => {
    const { email, mobile, cnic } = data

    auth.forgotUsername({ email, mobile, cnic }, error => {
      toast.error(error?.message || 'Invalid Email, Phone Number or CNIC')
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
            Verify your identity to retrieve your User ID securely.
          </Typography>
          {/* Login Form */}
          <Box sx={styles.loginForm}>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              {/* Username */}
              <FormControl fullWidth sx={{ mb: 2.5 }}>
                <InputField name='email' control={control} label='Email Address' placeholder='email@example.com' />
              </FormControl>
              {/* mOBILE PHONE */}
              <FormControl fullWidth sx={{ mb: 2.5 }}>
                <InputField name='mobile' control={control} label='PHONE NUMBER' placeholder='+92-XXX-XXXXXXX' />
              </FormControl>

              {/* CNIC */}
              <FormControl fullWidth sx={{ mb: 2.5 }}>
                <InputField name='cnic' control={control} label='CNIC NUMBER' placeholder='XXXXX-XXXXXXX-X' />
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
                Send OTP
              </LoadingButton>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
