import React from 'react'

// ** MUI
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'

// ** Types
import { ITransactionAspects } from 'src/types/apps/transactionAspects'

interface SelectMultipleTransactionsProps {
  options: ITransactionAspects[]
  value: ITransactionAspects[]
  onChange: (next: ITransactionAspects[]) => void
  disabled?: boolean
  loading?: boolean
  helperText?: string
}

const SelectMultipleTransactions = ({
  options,
  value,
  onChange,
  disabled = false,
  loading = false,
  helperText
}: SelectMultipleTransactionsProps) => {
  const allSelected = options.length > 0 && value.length === options.length

  return (
    <Box>
      <Autocomplete
        multiple
        fullWidth
        disableCloseOnSelect
        limitTags={2}
        options={options}
        value={value}
        disabled={disabled}
        loading={loading}
        loadingText='Loading transactions...'
        noOptionsText='No transactions available for this role'
        getOptionLabel={option => option.operationName}
        isOptionEqualToValue={(option, selected) => option.taskServiceId === selected.taskServiceId}
        onChange={(_, next) => onChange(next)}
        renderOption={(optionProps, option, { selected }) => {
          const { key, ...rest } = optionProps as React.HTMLAttributes<HTMLLIElement> & { key?: React.Key }

          return (
            <li key={key ?? option.taskServiceId} {...rest}>
              <Checkbox size='small' sx={{ mr: 1, ml: -1 }} checked={selected} />
              {option.operationName}
            </li>
          )
        }}
        renderInput={params => (
          <TextField
            {...params}
            label='Transactions'
            placeholder={value.length === 0 ? 'Search and select transactions' : ''}
            helperText={helperText}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color='inherit' size={18} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
      />

      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
        <Button size='small' disabled={disabled || options.length === 0 || allSelected} onClick={() => onChange(options)}>
          Select all ({options.length})
        </Button>
        <Button size='small' color='secondary' disabled={disabled || value.length === 0} onClick={() => onChange([])}>
          Clear
        </Button>
      </Box>
    </Box>
  )
}

export default SelectMultipleTransactions