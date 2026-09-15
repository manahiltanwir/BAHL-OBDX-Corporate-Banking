import { keyframes } from '@emotion/react'
import { Theme } from '@mui/material/styles'

export const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

export const getLoginStyles = (theme: Theme) =>
    ({
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
            width: { xs: '100%', sm: '95%', md: '950px' },
            minHeight: { xs: 'auto', md: 600 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            bgcolor: '#fff',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)'
        },
        leftPanel: {
            display: { xs: 'none', md: 'flex' },
            width: '42%',
            backgroundColor: '#105f3b',
            color: '#fff',
            p: 6,
            flexDirection: 'column'
        },
        heading: { color: '#fff', fontSize: { xs: 28, md: 35 }, fontWeight: 500, lineHeight: 1.2, mt: 2, mb: 4, textAlign: 'center' },
        description: { color: 'rgba(255,255,255,0.9)', fontSize: '16px', lineHeight: 1.6, textAlign: 'center' },
        footer: { mt: 'auto', pt: 5, color: 'rgba(255,255,255,0.8)', fontSize: '13px', textAlign: 'center' },
        rightPanel: {
            width: { xs: '100%', md: '58%' },
            bgcolor: '#fff',
            position: 'relative',
            px: { xs: 3, md: 6 },
            py: { xs: 3, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        },
        corporateRibbon: { position: 'absolute', top: 0, right: 0, width: 120, height: 120, overflow: 'hidden' },
        corporateText: {
            position: 'absolute',
            top: 24,
            right: -38,
            width: 170,
            bgcolor: theme.palette.primary.main,
            color: '#fff',
            textAlign: 'center',
            py: 1,
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            transform: 'rotate(45deg)'
        },
        rightLogo: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', mt: 3, mb: 3 },
        loginForm: { width: '100%', maxWidth: { xs: '100%', sm: 420 }, mx: 'auto' },
        textDecoration: {
            color: theme.palette.primary.main,
            fontSize: '13px',
            fontWeight: 500,
            textDecorationColor: theme.palette.primary.main,
            '&:hover': {
                color: theme.palette.primary.dark,
                textDecorationColor: theme.palette.primary.dark
            }
        }, loginButton: {
            height: 52,
            mt: 3
        },
        passwordField: {
            height: 52,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#D6DCE5' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D6DCE5' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main, borderWidth: '2px' },
            '& input': { fontSize: '15px' },
            '& input::placeholder': { color: '#8A8A8A', opacity: 1 }
        }
    }) as const

export const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/