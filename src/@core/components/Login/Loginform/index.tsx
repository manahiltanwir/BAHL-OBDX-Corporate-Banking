import Link from 'next/link'
import MuiLink from '@mui/material/Link'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import LoadingButton from '@mui/lab/LoadingButton'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import { InputField } from 'src/@core/components/form'
import PasswordInput from '../Passwordinput'
import { getLoginStyles } from '../Login.styles'

export interface LoginFormData {
  username: string
  password: string
}

interface LoginFormProps {
  control: Control<LoginFormData>
  errors: FieldErrors<LoginFormData>
  loading: boolean
  onSubmit: (e?: React.BaseSyntheticEvent) => void
}

const LoginForm = ({ control, errors, loading, onSubmit }: LoginFormProps) => {
  const theme = useTheme()
  const styles = getLoginStyles(theme)
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box sx={styles.rightPanel}>
      <Box sx={styles.corporateRibbon}>
        <Box sx={styles.corporateText}>Corporate</Box>
      </Box>

      <Box sx={styles.rightLogo}>
        <img src='/images/pages/alhabib.png' alt='Bank AL Habib' style={{ width: hidden ? 140 : 170, height: 'auto' }} />
      </Box>

      <Box sx={styles.loginForm}>
        <form noValidate autoComplete='off' onSubmit={onSubmit}>
          <FormControl fullWidth sx={{ mb: 2.5 }}>
            <InputField name='username' control={control} label='Username' placeholder='Enter your username' />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Link href='/forgot-username' passHref>
                <MuiLink underline='always' sx={styles.textDecoration}>
                  Forgot Username?
                </MuiLink>
              </Link>
            </Box>
          </FormControl>

          <Controller
            name='password'
            control={control}
            render={({ field, fieldState }) => (
              <PasswordInput field={field} error={!!errors.password} helperText={fieldState.error?.message} />
            )}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Link href='/forgot-password' passHref>
              <MuiLink underline='always' sx={styles.textDecoration}>
                Forgot Password?
              </MuiLink>
            </Link>
          </Box>

          <LoadingButton
            fullWidth
            variant='contained'
            size='large'
            type='submit'
            loading={loading}
            disabled={loading}
            loadingPosition='end'
            sx={styles.loginButton}
          >
            Login
          </LoadingButton>
        </form>
      </Box>
    </Box>
  )
}

export default LoginForm