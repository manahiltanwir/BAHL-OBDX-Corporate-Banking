import { useState } from 'react'
import { Day } from 'date-fns'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

import { useController, UseControllerProps } from 'react-hook-form'

interface WrappDateTimePicker extends UseControllerProps {
  name: string
  label: string
  control: UseControllerProps['control']
}

export default function WrappDateTimePicker({ control, label, ...props }: WrappDateTimePicker) {
  const {
    field: { onChange, onBlur, name, value },
    fieldState: { invalid, isTouched, isDirty, error },
    formState: { touchedFields, dirtyFields }
  } = useController({
    ...props,
    control
  })

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3}>
        <DateTimePicker
          label={label || 'Date & Time picker'}
          value={value}
          onChange={onChange}
          renderInput={params => <TextField name={name} {...params} />}
        />
      </Stack>
      {isTouched && error && (
        <FormHelperText sx={{ color: 'error.main' }} id={`validation-schema-${name}`}>
          {error.message}
        </FormHelperText>
      )}
    </LocalizationProvider>
  )
}
