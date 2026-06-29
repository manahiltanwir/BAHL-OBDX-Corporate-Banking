import { useId } from 'react'

// ** MUI
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormHelperText from '@mui/material/FormHelperText'

// ** Types
import { FormControlLabelProps } from '@mui/material'

// ** form handling lib
import { useController, UseControllerProps } from 'react-hook-form'

interface IField extends UseControllerProps {
  name: string
  label: string
  control: any
  options: { value: FormControlLabelProps['value']; label: FormControlLabelProps['label'] }[]
}

export default function ControlledRadioButtonsGroup({ control, options, ...props }: IField) {
  const {
    field: { onChange, onBlur, name, value, ref },
    fieldState: { invalid, isTouched, isDirty, error },
    formState: { touchedFields, dirtyFields }
  } = useController({
    ...props,
    control
  })

  const labelId = useId()

  return (
    <FormControl fullWidth>
      <FormLabel id={labelId}>{props.label || 'Not Possiblle'}</FormLabel>
      <RadioGroup row aria-labelledby={labelId} name={name} value={value} onChange={onChange}>
        {options?.map(option => (
          <FormControlLabel key={useId()} value={option.value} control={<Radio />} label={option.label} />
        ))}
      </RadioGroup>
      {error && (
        <FormHelperText sx={{ color: 'error.main' }} id={`validation-schema-${name}`}>
          {error.message}
        </FormHelperText>
      )}
    </FormControl>
  )
}
