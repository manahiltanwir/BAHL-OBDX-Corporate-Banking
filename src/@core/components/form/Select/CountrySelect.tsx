import React, { useEffect, useState, useId } from 'react';

// ** MUI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** form handling lib
import { useController, UseControllerProps } from 'react-hook-form'

interface ICountry {
  id: number;
  iso2: string;
  name: string;
  phone_code: string;
}

interface IField extends UseControllerProps {
  name: string,
  control: UseControllerProps['control']
}

export default function CountrySelect({ control, ...props }: IField) {

  // ** States
  const [countries, setCountries] = useState<ICountry[] | []>([])

  // ** Hooks
  const {
    field: { onChange, onBlur, name, value, ref },
    fieldState: { invalid, isTouched, isDirty, error },
    formState: { touchedFields, dirtyFields }
  } = useController({
    ...props,
    control
  });

  const loadJson = (): Promise<any> => {
    return new Promise((res, rej) => {
      // import(`src/@fake-db/countries/countries.json`).then((data) => {
      //   res(data?.default);
      // });
    });
  };

  const loadJsonAsync = async () => {
    const messages = await loadJson();
    // onChange(messages[0].name)
    setCountries(messages);
  }

  useEffect(() => {
    loadJsonAsync();
  }, [])

  return (
    <Autocomplete
      id={`country-select-${useId()}`}
      fullWidth
      options={countries}
      autoHighlight
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.name
      }
      isOptionEqualToValue={() => true}
      value={value}
      // ts-ignore
      onChange={(event: any, newValue: { iso2: string, name: string }) => {
        newValue && onChange(newValue.name)
      }}
      renderOption={(props, option) => (
        <Box component="li" key={option.iso2} sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.iso2.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.iso2.toLowerCase()}.png 2x`}
            alt=""
          />
          {option.name} ({option.iso2})
        </Box>
      )}
      renderInput={(params) => {
        return (
          <FormControl fullWidth>
            <TextField
              {...params}
              label="Select country"
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password', // disable autocomplete and autofill
              }}
            />
            {error && (
              <FormHelperText sx={{ color: 'error.main' }} id={`validation-schema-${name}`}>
                {error.message}
              </FormHelperText>
            )}
          </FormControl>
        )
      }}
    />
  );
}
