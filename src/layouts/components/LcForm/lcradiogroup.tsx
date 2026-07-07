import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material'

import LCText from './lctext'
interface Option {
  label: string
  value: string
}

interface Props {
  label?: string
  value: string
  onChange: (value: string) => void
  options: Option[]
}

const LCRadioGroup = ({
  label,
  value,
  onChange,
  options
}: Props) => {
  return (
    <FormControl sx={{ mb: 2 }}>
      {label && (
        <LCText variant="label">
          {label}
        </LCText>
      )}

      <RadioGroup
        row
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(option => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            label={option.label}
            control={
              <Radio
                sx={{
                  color: '#9CA3AF',
                  '&.Mui-checked': {
                    color: '#008E5A'
                  }
                }}
              />
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

export default LCRadioGroup