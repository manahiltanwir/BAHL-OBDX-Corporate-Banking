// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import MuiLink from '@mui/material/Link'
import Box, { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'

// ** Custom commponents
import InputPassword from 'src/@core/components/ControllForm/InputPassword'

// ** Icons Imports
import ChevronLeft from 'mdi-material-ui/ChevronLeft'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import GuestLayout from 'src/@core/layouts/GuestLayout'

// ** Context
import { AuthContext } from 'src/context/AuthContext'

// ** Demo Imports
import { Controller, useForm } from 'react-hook-form'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

// ** Types
import { ResetPasswordParams } from 'src/context/types'

// Styled Components
const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
    fontWeight: 600,
    letterSpacing: '0.18px',
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const schema = {
    resetPassword: yup.object().shape({
        password: yup.string().min(8).max(22).required(),
        confirm_password: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
    }),
}

const Page = () => {

    // ** Hooks
    const { query } = useRouter()
    const { status, resetPassword } = useContext(AuthContext)
    const { control, handleSubmit } = useForm({
        defaultValues: { password: "", confirm_password: "" },
        mode: 'onChange',
        resolver: yupResolver(schema.resetPassword),
    })

    // ** vars
    const token = query.token as string

    const onSubmit = (params: any) => {
        resetPassword(params, token)
    }

    return (
        <>
            <Box sx={{ mb: 6 }}>
                <TypographyStyled variant='h5'>Reset Password 🔒</TypographyStyled>
                <Typography variant='body2'>
                    Your new password must be different from previously used passwords
                </Typography>
            </Box>
            <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ mb: 4 }}>
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
                </Box>

                <Box sx={{ mb: 4 }}>

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
                </Box>
                <LoadingButton
                    fullWidth
                    sx={{ mb: 5.25 }}
                    loading={status === 'pending'}
                    disabled={status === 'pending'}
                    loadingPosition="end"
                    size='large'
                    variant="contained"
                    type='submit'
                >
                    Set New Password
                </LoadingButton>
                <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Link passHref href='/login'>
                        <Typography
                            component={MuiLink}
                            sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', justifyContent: 'center' }}
                        >
                            <ChevronLeft sx={{ mr: 1.5, fontSize: '2rem' }} />
                            <span>Back to login</span>
                        </Typography>
                    </Link>
                </Typography>
            </form>
        </>
    )
}

Page.guestGuard = true
Page.getLayout = (page: ReactNode) => (
    <BlankLayout>
        <GuestLayout>
            {page}
        </GuestLayout>
    </BlankLayout>
)

export default Page
