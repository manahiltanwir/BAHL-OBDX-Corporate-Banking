import React, { useState, useMemo, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

// ** MUI
import Radio from '@mui/material/Radio'
import Autocomplete from '@mui/material/Autocomplete'
import TextField, { BaseTextFieldProps } from '@mui/material/TextField'

// ** Actions
import { fetchAllAction } from 'src/store/apps/transaction-aspects'

import { Controller } from 'react-hook-form'

// ** types
import { RootState, AppDispatch } from 'src/store'
import { TransactionAspectsApi } from 'src/types/apps/transactionAspects'
import transactionAspects from 'src/@core/schema/transactionAspects'

interface TransactionAspectsSelect extends BaseTextFieldProps {
  execute?: boolean
  transactionAspects: TransactionAspectsApi | {}
  setTransactionAspects: (project: TransactionAspectsApi) => void
  selectedEnterpriseRoleId: string | number | undefined
}

export default function TransactionAspectsSelect({
  execute = false,
  transactionAspects,
  setTransactionAspects,
  selectedEnterpriseRoleId,
  ...props
}: TransactionAspectsSelect) {
  const [selected, setSelected] = useState<TransactionAspectsApi | {}>()

  const store = useSelector((state: RootState) => state.transactionAspects)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (selectedEnterpriseRoleId) {
      dispatch(fetchAllAction(selectedEnterpriseRoleId))
    }
  }, [selectedEnterpriseRoleId])

  useMemo(() => {
    selected && 'taskServiceId' in selected && setTransactionAspects(selected)
  }, [selected])

  return (
    <Autocomplete
      fullWidth
      id='category-single-select'
      options={store.entities}
      autoHighlight
      getOptionLabel={(option: any | {}) => {
        if (option && 'taskServiceId' in option) return option.operationName
        else return ''
      }}
      disabled={selectedEnterpriseRoleId ? false : true}
      value={selected}
      disableCloseOnSelect
      // @ts-ignore
      onChange={(r, e) => setSelected(e)}
      // @ts-ignore
      renderOption={(props, option: any, { selected }) => (
        <li {...props}>
          <Radio checked={selected} />
          {option.operationName}
        </li>
      )}
      renderInput={params => (
        <TextField {...params} {...props} label='Select Transaction Name' placeholder='Transaction Name' />
      )}
    />
  )
}

interface TransactionAspectsSelectWithFormProps {
  control: any
  name: string
}

export const TransactionAspectsSelectWithForm: React.FC<TransactionAspectsSelectWithFormProps> = ({
  control,
  name
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <TransactionAspectsSelect
          execute={false}
          error={Boolean(error)}
          transactionAspects={value}
          setTransactionAspects={(transactionAspects: TransactionAspectsApi) =>
            onChange(transactionAspects.taskServiceId)
          }
          selectedEnterpriseRoleId=''
        />
      )}
    />
  )
}
