import React from 'react'

// ** MUI
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import { InputBaseProps, SxProps, Theme } from '@mui/material'

// ** React Hook Form
import { useController, UseControllerProps } from 'react-hook-form'

const styles = {
  formText: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1F2937',
    mb: 1
  },

  loginFields: {
    '& .MuiOutlinedInput-root': {
      height: 52,
      borderRadius: '12px',

      '& fieldset': {
        borderColor: '#D6DCE5'
      },

      '&:hover fieldset': {
        borderColor: '#D6DCE5'
      },

      '&.Mui-focused fieldset': {
        borderColor: '#009B63',
        borderWidth: '2px'
      }
    },

    '& input': {
      fontSize: '15px'
    },

    '& input::placeholder': {
      color: '#8A8A8A',
      opacity: 1
    }
  },

  textArea: {
    '& .MuiOutlinedInput-root': {
      minHeight: 90,
      borderRadius: '12px',
      backgroundColor: '#FFFFFF',
      alignItems: 'flex-start',

      '& fieldset': {
        borderColor: '#D6DCE5'
      },

      '&:hover fieldset': {
        borderColor: '#D6DCE5'
      },

      '&.Mui-focused fieldset': {
        borderColor: '#009B63',
        borderWidth: '2px'
      }
    },

    '& textarea': {
      fontSize: '15px',
      padding: '12px 14px',
      resize: 'none'
    },

    '& textarea::placeholder': {
      color: '#8A8A8A',
      opacity: 1
    }
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

interface IField extends UseControllerProps, InputBaseProps {
  name: string
  type?: 'text' | 'text-area' | 'number' | 'password'
  label?: string
  placeholder?: string
  control: any
  defaultValue?: string | number | readonly string[]
  labelSx?: SxProps<Theme>
  textFieldSx?: SxProps<Theme>
  isPassword?: boolean
  showPassword?: boolean
  onTogglePassword?: () => void
}

const Field = ({ control, labelSx, textFieldSx, ...props }: IField) => {
  const {
    field: { onChange, onBlur, name, value, ref },
    fieldState: { error }
  } = useController({
    ...props,
    control
  })

  return (
    <FormControl fullWidth>
      {props.label && (
        <Typography
          sx={{
            ...styles.formText,
            ...labelSx
          }}
        >
          {props.label}
        </Typography>
      )}

      {props.isPassword ? (
        <OutlinedInput
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          inputRef={ref}
          fullWidth
          placeholder={props.placeholder}
          sx={{
            ...styles.passwordField,
            ...textFieldSx
          }}
          type={props.showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton onClick={props.onTogglePassword}>
                {props.showPassword ? <EyeOutline /> : <EyeOffOutline />}
              </IconButton>
            </InputAdornment>
          }
          error={Boolean(error)}
        />
      ) : (
        <TextField
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          inputRef={ref}
          type={props.type === 'text-area' ? 'text' : props.type}
          multiline={props.type === 'text-area'}
          rows={props.type === 'text-area' ? 3 : undefined}
          fullWidth
          placeholder={props.placeholder}
          error={Boolean(error)}
          sx={{
            ...(props.type === 'text-area'
              ? styles.textArea
              : styles.loginFields),
            ...textFieldSx
          }}
        />
      )}

      {error && (
        <FormHelperText sx={{ color: 'error.main' }}>
          {error.message}
        </FormHelperText>
      )}
    </FormControl>
  )
}

export default Field