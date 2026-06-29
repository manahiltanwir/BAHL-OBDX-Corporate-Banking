import React, { useState } from 'react'

import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  InputBaseProps
} from '@mui/material'

import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

interface InputPasswordProps extends InputBaseProps {
  label: string
}

const InputPassword = ({ error, value, onChange, ...props }: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor='input-secret-text' error={Boolean(error)}>
        {props.label}
      </InputLabel>
      <OutlinedInput
        fullWidth
        value={value}
        onChange={onChange}
        id='input-secret-text'
        error={Boolean(error)}
        {...props}
        type={showPassword ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton edge='end' onMouseDown={e => e.preventDefault()} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOutline /> : <EyeOffOutline />}
            </IconButton>
          </InputAdornment>
        }
      />
      {error && (
        <FormHelperText sx={{ color: 'error.main' }} id=''>
          {error}
        </FormHelperText>
      )}
    </FormControl>
  )
}

export default InputPassword
