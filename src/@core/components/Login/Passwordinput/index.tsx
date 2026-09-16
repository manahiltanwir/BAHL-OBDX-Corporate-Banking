import { useState } from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import FormHelperText from '@mui/material/FormHelperText'
import { useTheme } from '@mui/material/styles'
import { EyeOffOutline, EyeOutline } from 'mdi-material-ui'
import { getLoginStyles } from '../Login.styles'

interface PasswordInputProps {
  field: any
  placeholder?: string
  error?: boolean
  helperText?: string
}

const PasswordInput = ({ field, placeholder = 'Password', error, helperText }: PasswordInputProps) => {
  const [show, setShow] = useState(false)
  const theme = useTheme()
  const styles = getLoginStyles(theme)

  return (
    <FormControl fullWidth error={error} variant='outlined'>
      <InputLabel htmlFor='auth-password'>Password</InputLabel>
      <OutlinedInput
        {...field}
        fullWidth
        label='Password'
        error={error}
        placeholder={placeholder}
        type={show ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton onClick={() => setShow(!show)}>{show ? <EyeOutline /> : <EyeOffOutline />}</IconButton>
          </InputAdornment>
        }
        sx={styles.passwordField}
      />
      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default PasswordInput