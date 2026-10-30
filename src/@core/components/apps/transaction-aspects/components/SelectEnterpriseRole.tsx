import React, { useState, useMemo, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

// ** MUI
import Radio from '@mui/material/Radio'
import Autocomplete from '@mui/material/Autocomplete'
import TextField, { BaseTextFieldProps } from '@mui/material/TextField'

// ** Actions
import { fetchEnterpriseRolesAction } from 'src/store/apps/role-transaction-mapping'

import { Controller } from 'react-hook-form'

// ** types
import { RootState, AppDispatch } from 'src/store'
import { TransactionAspectsApi } from 'src/types/apps/transactionAspects'
import transactionAspects from 'src/@core/schema/transactionAspects'
import { EnterpriseRoleApi } from 'src/types/apps/roleTransactionMapping'

interface EnterpriseRoleSelect extends BaseTextFieldProps {
  execute?: boolean
  enterpriseRole: TransactionAspectsApi | {}
  setEnterpriseRole: (project: EnterpriseRoleApi) => void
}

export default function EnterpriseRoleSelect({
  execute = false,
  enterpriseRole,
  setEnterpriseRole,
  ...props
}: EnterpriseRoleSelect) {
  const [selected, setSelected] = useState<any | {}>()

  const store = useSelector((state: RootState) => state.roleTransactionMapping)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    execute && dispatch(fetchEnterpriseRolesAction())
  }, [])

  useMemo(() => {
    selected && 'id' in selected && setEnterpriseRole(selected)
  }, [selected])

  return (
    <Autocomplete
      fullWidth
      id='category-single-select'
      options={store.enterpriseRoles}
      autoHighlight
      getOptionLabel={(option: any | {}) => {
        if (option && 'enterpriseRole' in option) return option.enterpriseRole
        else return ''
      }}
      value={selected}
      disableCloseOnSelect
      // @ts-ignore
      onChange={(r, e) => setSelected(e)}
      // @ts-ignore
      renderOption={(props, option: any, { selected }) => (
        <li {...props}>
          <Radio checked={selected} />
          {option.enterpriseRole}
        </li>
      )}
      renderInput={params => (
        <TextField {...params} {...props} label='Select Enterprise Role' placeholder='Enterprise Role' />
      )}
    />
  )
}

interface EnterpriseRoleSelectWithFormProps {
  control: any
  name: string
}

export const EnterpriseRoleSelectWithForm: React.FC<EnterpriseRoleSelectWithFormProps> = ({ control, name }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <EnterpriseRoleSelect
          execute={false}
          error={Boolean(error)}
          enterpriseRole={value}
          setEnterpriseRole={category => onChange(category.id)}
        />
      )}
    />
  )
}
