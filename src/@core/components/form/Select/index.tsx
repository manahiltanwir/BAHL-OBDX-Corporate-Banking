import React from 'react'

// ** MUI
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'

// ** React Hook Form
import { useController, UseControllerProps } from 'react-hook-form'

const styles = {
  formText: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1F2937',
    mb: 1
  },

  selectField: {
    borderRadius: '12px',

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

    '& .MuiSelect-select': {
      fontSize: '15px',
      padding: '14px 16px'
    }
  },

  placeholder: {
    color: '#8A8A8A'
  }
}

interface IField extends UseControllerProps {
  name: string
  control: any
  label: string
  placeholder?: string
  options: {
    label: string
    value: string
  }[]
}

const SelectField: React.FC<IField> = ({ control, ...props }) => {
  const {
    field: { onChange, value },
    fieldState: { error }
  } = useController({
    ...props,
    control
  })

  return (
    <Box>
      <FormControl fullWidth error={Boolean(error)}>
        <Typography sx={styles.formText}>
          {props.label}
        </Typography>

        <Select
          value={value ?? ''}
          onChange={onChange}
          displayEmpty
          sx={styles.selectField}
          renderValue={selected => {
            if (!selected) {
              return (
                <Typography sx={styles.placeholder}>
                  {props.placeholder || `Select ${props.label}`}
                </Typography>
              )
            }

            return props.options.find(option => option.value === selected)?.label
          }}
        >
          {props.options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>

        {error && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {error.message}
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  )
}

export default SelectField