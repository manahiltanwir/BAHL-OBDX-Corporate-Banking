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
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

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
    sm: '500px',
    md: '500px'
  },
  bgcolor: '#fff',
  borderRadius: '24px',
  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
  p: 5
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
    mt: 2,
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
    forgotUsernameDescription: {
    fontSize: '15px',
    color: '#6B7280',
    textAlign: 'left',      // Left align text
    width: '100%',          // Take full width
    mb: 4,
    mt: 2,
    lineHeight: 1.6
  }
}

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const LoginIllustration = styled('img')(({ theme }) => ({
  maxWidth: '40rem',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '30rem'
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '24rem'
  }
}))

const LeftWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 650
  }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  fontcolor: '#000008',
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required()
})

const defaultValues = {
  password: 'password',
  email: 'manahil.dev@gmail.com'
}

interface FormData {
  email: string
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
    const { email, password } = data
    auth.login({ email, password }, error => {
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
                 <InputField
    name="email"
    control={control}
    label="Email Address"
    placeholder="email@example.com"
  />
                
              </FormControl>
              {/* mOBILE PHONE */}
 <FormControl fullWidth sx={{ mb: 2.5 }}>
                 <InputField
    name="MOBILE"
    control={control}
    label="PHONE NUMBER"
    placeholder="+92-XXX-XXXXXXX"
  />
                </FormControl>

{/* CNIC */}
 <FormControl fullWidth sx={{ mb: 2.5 }}>
                 <InputField
    name="CNIC"
    control={control}
    label="CNIC NUMBER"
    placeholder="XXXXX-XXXXXXX-X"
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
