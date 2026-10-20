// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/GuestLayout'
import { useAuth } from 'src/hooks/useAuth'

// ** Demo Imports
// import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  marginTop: theme.spacing(15),
  marginBottom: theme.spacing(15),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  }
}))

const Error401 = () => {
  const { logout } = useAuth()

  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h1' sx={{ mb: 2.5 }}>
            401
          </Typography>
          <Typography variant='h5' sx={{ mb: 2.5, fontSize: '1.5rem !important' }}>
            You are not authorized! ??
          </Typography>
          <Typography variant='h5'>You don&prime;t have permission to access this page.</Typography>
        </BoxWrapper>
        <Img alt='error-illustration' src='/images/pages/alhabib.png' sx={{ width: '250px', height: '250px', }} />
        <Box display={'flex'} gap={5}>
          <Link passHref href='/'>
            <Button component='a' variant='contained' sx={{ px: 5.5 }}>
              Back to Home
            </Button>
          </Link>
          <Button component='a' variant='contained' onClick={() => logout()}>
            Logout
          </Button>
        </Box>
      </Box>
      {/* <FooterIllustrations image='/images/pages/misc-401-object.png' /> */}
    </Box>
  )
}

Error401.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Error401
