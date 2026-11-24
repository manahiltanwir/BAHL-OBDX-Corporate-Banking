// ** React Imports
import { ReactNode, useEffect, useRef } from 'react'

// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Store Imports
import { store } from 'src/store'
import { Provider } from 'react-redux'

// ** Loader Import
import NProgress from 'nprogress'
// import { NProgress } from 'nprogress'

// ** Emotion Imports
// @ts-ignore
import { CacheProvider } from '@emotion/react'
// @ts-ignore
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/@core/components/auth/AclGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'
import WindowWrapper from 'src/@core/components/window-wrapper'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'
import { DrawerProvider } from 'src/@core/context/DrawerContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'
import { OtpProvider } from 'src/context/OtpContext'
import { ApprovalRequiredProvider } from 'src/context/ApprovalRequiredContext'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

const CircleOnCursor = styled(Box)<BoxProps>(({ theme }) => ({
  position: 'fixed',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  border: `2px solid #eea228`,
  background: '#eea228',
  pointerEvents: 'none',
  zIndex: 9999999999,
  top: 0,
  left: 0,
  willChange: 'transform'
}))

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${themeConfig.templateName}`}</title>
          <meta name='description' content={`${themeConfig.metaDescription}`} />
          <meta name='keywords' content={`${themeConfig.metaKeywords}`} />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>
        <CircleOnCursor ref={cursorRef} />
        <AuthProvider>
          <OtpProvider>
            <ApprovalRequiredProvider>
              <DrawerProvider>
                <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
                  <SettingsConsumer>
                    {({ settings }) => {
                      return (
                        <ThemeComponent settings={settings}>
                          <WindowWrapper>
                            <Guard authGuard={authGuard} guestGuard={guestGuard}>
                              <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard}>
                                {getLayout(<Component {...pageProps} />)}
                              </AclGuard>
                            </Guard>
                          </WindowWrapper>
                          <ReactHotToast>
                            <Toaster
                              position={settings.toastPosition}
                              toastOptions={{ className: 'react-hot-toast' }}
                            />
                          </ReactHotToast>
                        </ThemeComponent>
                      )
                    }}
                  </SettingsConsumer>
                </SettingsProvider>
              </DrawerProvider>
            </ApprovalRequiredProvider>
          </OtpProvider>
        </AuthProvider>
      </CacheProvider>
    </Provider>
  )
}

export default App
