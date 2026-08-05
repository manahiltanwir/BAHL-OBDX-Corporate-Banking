// ** React Imports
import { useState, ReactNode, MouseEvent } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import MuiLink from '@mui/material/Link'
import { keyframes, Keyframes } from '@emotion/react'
import LoadingButton from '@mui/lab/LoadingButton'
import Checkbox from '@mui/material/Checkbox'
import { InputField } from 'src/@core/components/form'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icons Imports

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { IconButton, InputAdornment, OutlinedInput } from '@mui/material'
import { EyeOffOutline, EyeOutline } from 'mdi-material-ui'

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
    p: { xs: 2, md: 6 },
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(-45deg, #0c8f54, #0d9a5b, #105f3b, #fbb048, #ffa016)',
    backgroundSize: '400% 400%',
    animation: `${gradientAnimation} 15s ease infinite`
  },
  subPage: {
    width: {
      xs: '100%',
      sm: '95%',
      md: '950px'
    },
    minHeight: {
      xs: 'auto',
      md: 600
    },
    display: 'flex',
    flexDirection: {
      xs: 'column',
      md: 'row'
    },
    bgcolor: '#fff',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)'
  },
  leftPanel: {
    display: {
      xs: 'none',
      md: 'flex'
    },
    width: '42%',
    backgroundColor: '#105f3b',
    color: '#fff',
    p: 6,
    flexDirection: 'column'
  },
  logo: {
    backgroundColor: '#fff',
    display: 'inline-block',
    padding: '15px',
    borderRadius: '12px',
    mb: 6
  },
  heading: {
    color: '#fff',
    fontSize: {
      xs: 28,
      md: 35
    },
    fontWeight: 500,
    lineHeight: 1.2,
    mt: 2,
    mb: 4
  },
  description: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '16px',
    lineHeight: 1.6,
    maxWidth: '300px'
  },
  footer: {
    mt: 'auto',
    pt: 5,
    color: 'rgba(255,255,255,0.8)',
    fontSize: '13px'
  },
  rightPanel: {
    width: {
      xs: '100%',
      md: '58%'
    },
    bgcolor: '#fff',
    position: 'relative',
    px: {
      xs: 3,
      md: 6
    },
    py: {
      xs: 3,
      md: 4
    },
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  corporateRibbon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 120,
    height: 120,
    overflow: 'hidden'
  },
  corporateText: {
    position: 'absolute',
    top: 24,
    right: -38,
    width: 170,
    bgcolor: '#0c8f54',
    color: '#fff',
    textAlign: 'center',
    py: 1,
    fontSize: '11px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    transform: 'rotate(45deg)'
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
  formText: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1f2937',
    mb: 1
  },
  loginFields: {},
  textDecoration: {
    color: '#009B63',
    fontSize: '13px',
    fontWeight: 500,
    textDecorationColor: '#009B63'
  },
  remeberDeviceText: {
    mb: 5,
    ml: 0,
    '& .MuiFormControlLabel-label': {
      fontSize: '14px',
      color: '#6B7280'
    }
  },
  loginButton: {
    mt: 0,
    mb: 3,
    height: 52,
    borderRadius: '12px',
    bgcolor: '#105f3b',
    '&:hover': {
      bgcolor: '#0c8f54'
    }
  },
  createAccount: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    mt: 5,
    pb: 2
  },
  createAccountText: {
    color: '#009B63',
    fontWeight: 'bold',
    textDecoration: 'underline'
  },
  passwordField: {
    height: 52,

    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#D6DCE5'
    },

    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#D6DCE5'
    },

    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#009B63',
      borderWidth: '2px'
    },

    '& input': {
      fontSize: '15px'
    },

    '& input::placeholder': {
      color: '#8A8A8A',
      opacity: 1
    }
  }
}

// ** Styled Components
const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;

const schema = yup.object().shape({
  username: yup.string().matches(usernameRegex, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  password: yup.string().min(5).required()
})

const defaultValues = {
  password: 'xyz1234', // Corporate User => Maker
  username: 'jane'
}

// Administrator Credentials username: jane => password: xyz1234

interface FormData {
  username: string
  password: string
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

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

  const onSubmit = (data: FormData) => {
    const { username, password } = data
    auth.login({ username, password }, error => {
      setError('password', {
        type: 'manual',
        message: error?.message || 'Invalid credentials!'
      })
      toast.error(error?.message || 'Invalid credentials!')
    })
  }

  const imageSource = skin === 'bordered' ? 'bahl' : 'bahl'

  return (
    <Box sx={styles.page}>
      <Box sx={styles.subPage}>
        {/* Left Panel */}
        <Box sx={styles.leftPanel}>
          {/* Top Content */}
          <Box sx={{ flexGrow: 1 }}>
            {/* Logo */}
            <Box sx={styles.logo}>
              <img
                src='/images/pages/alhabib.png'
                alt='Bank AL Habib'
                style={{
                  height: '50px'
                }}
              />
            </Box>

            {/* Heading */}
            <Typography sx={styles.heading}>
              Welcome to
              <br />
              Bank AL Habib
            </Typography>

            {/* Description */}
            <Typography sx={styles.description}>
              Experience the next generation of secure digital banking. Your assets, protected by world-class
              encryption.
            </Typography>
          </Box>

          {/* Footer */}
          <Typography sx={styles.footer}>© 2026 Bank AL Habib. All rights reserved.</Typography>
        </Box>

        {/* Right Panel */}
        <Box sx={styles.rightPanel}>
          {/* Corporate Ribbon */}
          <Box sx={styles.corporateRibbon}>
            <Box sx={styles.corporateText}>Corporate</Box>
          </Box>

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

          {/* Login Form */}
          <Box sx={styles.loginForm}>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              {/* Username */}
              <FormControl fullWidth sx={{ mb: 2.5 }}>
                <InputField
                  name="username"
                  control={control}
                  label="Employee / Customer ID"
                  placeholder="Enter your ID"
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Link href='/forgot-username' passHref>
                    <MuiLink underline='always' sx={styles.textDecoration}>
                      Forgot Username?
                    </MuiLink>
                  </Link>
                </Box>
              </FormControl>

              {/* Password */}
              {/* <FormControl fullWidth sx={{ mb: 2.5 }}>
                <InputField
                  name="password"
                  control={control}
                  label="Password"
                  placeholder="••••••••"
                // isPassword
                // showPassword={showPassword}
                // onTogglePassword={() => setShowPassword(!showPassword)}
                /> */}
              {/* <Typography sx={styles.formText}>Password</Typography> */}

              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    fullWidth
                    placeholder='••••••••'
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    }
                    sx={{
                      ...styles.passwordField,
                    }}

                  />
                )}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Link href='/forgot-password' passHref>
                  <MuiLink underline='always' sx={styles.textDecoration}>
                    Forgot Password?
                  </MuiLink>
                </Link>
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    size='small'
                    sx={{
                      color: '#C4C4C4',
                      '&.Mui-checked': {
                        color: '#009B63'
                      }
                    }}
                  />
                }
                label='Remember device'
                sx={styles.remeberDeviceText}
              />

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
                Login
              </LoadingButton>

              {/* Create Account */}
              {/* <Box sx={styles.createAccount}>
                <Typography sx={{ mr: 1, color: 'text.secondary' }}>New on our platform?</Typography>

                <Link passHref href='/signup'>
                  <Typography component={MuiLink} sx={styles.createAccountText}>
                    Create an account
                  </Typography>
                </Link>
              </Box> */}
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
