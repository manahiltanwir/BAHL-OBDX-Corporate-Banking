import React, { useEffect, useState, useId } from 'react'

// ** MUI
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
// import sss from 'src/@fake-db/countries/countries.json'

// ** form handling lib
import { useController, UseControllerProps } from 'react-hook-form'

interface ICountry {
  id: number
  iso2: string
  name: string
  phone_code: string
}

interface IField extends UseControllerProps {
  name: string
  control: UseControllerProps['control']
  selectedCountry: string
}

export default function StateSelect({ control, selectedCountry, ...props }: IField) {
  const [countries, setCountries] = useState<ICountry[] | []>([])
  // const [value, setValue] = React.useState<ICountry | null>(countries[0]);
  const [inputValue, setInputValue] = React.useState('')

  const loadJson = (): Promise<any> => {
    return new Promise((res, rej) => {
      // import(`src/@fake-db/countries/states.json`).then(data => {
      //   res(data?.default)
      // })
    })
  }
  const loadJsonAsync = async () => {
    const messages = await loadJson()
    setCountries(messages)
  }

  useEffect(() => {
    loadJsonAsync()
  }, [])

  const {
    field: { onChange, onBlur, name, value, ref },
    fieldState: { invalid, isTouched, isDirty, error },
    formState: { touchedFields, dirtyFields }
  } = useController({
    ...props,
    control
  })

  return (
    <Autocomplete
      id={`state-select-${useId()}`}
      sx={{ width: 300 }}
      options={countries}
      autoHighlight
      getOptionLabel={option => option.name}
      value={value}
      // ts-ignore
      onChange={(event: any, newValue: { state_code: string }) => {
        onChange(newValue)
      }}
      renderOption={(props, option) => (
        <Box component='li' sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          {option.name} ({option.state_code})
        </Box>
      )}
      renderInput={params => {
        return (
          <TextField
            {...params}
            label='Select state'
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password' // disable autocomplete and autofill
            }}
          />
        )
      }}
    />
  )
}
