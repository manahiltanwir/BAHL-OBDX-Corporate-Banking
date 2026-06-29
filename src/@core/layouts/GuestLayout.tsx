
// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Types
import { GuestLayoutProps } from './types'

// Styled component for Blank Layout component
const IllustrationTopRightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  // padding: theme.spacing(10),
  // paddingRight: '0 !important',
  // [theme.breakpoints.down('lg')]: {
  //   padding: theme.spacing(10)
  // },
}))

const IllustrationBottomLeftWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0
}))

const Illustration = styled('img')(({ theme }) => ({
  maxWidth: '40rem',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '30rem'
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '24rem'
  }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const MainWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  position: 'absolute',
  width: '70%',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
}))

const ModalWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: '20px',
  width: '100%',
  height: '80vh',
  borderRadius: 20,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  boxShadow: '0px 0px 56px -36px #000000, inset 0px 7px 11px -4px rgb(176 176 176 / 20%), inset 0px -82px 68px -64px rgb(176 176 176 / 17%), inset 0px 98px 100px -48px rgb(176 176 176 / 14%), inset 0px 4px 50px rgb(176 176 176 / 30%), inset 0px 1px 0px #b0b0b0',
  backdropFilter: 'blur(50px)',
  borderEndEndRadius: 24,
  border: '1px double transparent',
  // backgroundImage: 'linear-gradient(#000, #000), radial-gradient(circle at left top, #000 , #FFA900)',
  backgroundOrigin: 'border-box',
  backgroundClip: 'padding-box, border-box',
  margin: '0 auto',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    maxWidth: '80vw'
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: '70vw'
  },
}))

const GuestLayout = ({ children }: GuestLayoutProps) => {

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const imageSource = skin === 'bordered' ? 'bordered' : 'mask'

  return (
    <>
      {!hidden ? (
        <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <IllustrationTopRightWrapper>
            <Illustration
              alt='illustration'
              src={`/images/pages/guest/v1-${imageSource}-${theme.palette.mode}.png`}
            />
          </IllustrationTopRightWrapper>
          <IllustrationBottomLeftWrapper>
            <Illustration
              alt='illustration'
              src={`/images/pages/guest/v1-${imageSource}-${theme.palette.mode}.png`}
            />
          </IllustrationBottomLeftWrapper>
        </Box>
      ) : null}
      <MainWrapper>
        <ModalWrapper>
          <Box>
            <BoxWrapper>
              {children}
            </BoxWrapper>
          </Box>
        </ModalWrapper>
      </MainWrapper>
    </>
  )
}

export default GuestLayout
