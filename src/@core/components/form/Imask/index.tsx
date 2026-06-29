import * as React from 'react'
import { IMaskInput } from 'react-imask'
import TextField, { BaseTextFieldProps } from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

const TextMaskCustom = React.forwardRef<HTMLElement, CustomProps>(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props
  return (
    <IMaskInput
      {...other}
      mask='##:##'
      definitions={{
        // @ts-ignore
        '#': /[0-9]/
      }}
      // @ts-ignore
      inputRef={ref}
      onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  )
})

interface IField extends BaseTextFieldProps {
  onChange: (e: string) => void
}

export default function FormattedInputs({ onChange, ...props }: IField) {
  // const [values, setValues] = React.useState<string>('00:00')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.value ,"value")
    // setValues(event.target.value)
    onChange(event.target.value)
  }

  return (
    <FormControl fullWidth>
      <TextField
        {...props}
        // value={values}
        onChange={handleChange}
        InputProps={{
          inputComponent: TextMaskCustom as any
        }}
        fullWidth
      />
    </FormControl>
  )
}
