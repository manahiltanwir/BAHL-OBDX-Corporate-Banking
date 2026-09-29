import React, { useState, useMemo, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

// ** MUI
import Radio from '@mui/material/Radio'
import Autocomplete from '@mui/material/Autocomplete'
import TextField, { BaseTextFieldProps } from '@mui/material/TextField'

// ** Actions
import { fetchAllAction } from 'src/store/apps/category'

import { Controller } from 'react-hook-form'

// ** types
import { RootState, AppDispatch } from 'src/store'
import { CategoryApi } from 'src/types/apps/category'

interface CategorySelect extends BaseTextFieldProps {
  execute?: boolean
  category: CategoryApi | {}
  setCategory: (project: CategoryApi) => void
}

export default function CategorySelect({ execute = false, category, setCategory, ...props }: CategorySelect) {
  const [selected, setSelected] = useState<CategoryApi | {}>(category)

  const store = useSelector((state: RootState) => state.category)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    execute && dispatch(fetchAllAction({ query: {} }))
  }, [])

  useMemo(() => {
    selected && 'id' in selected && setCategory(selected)
  }, [selected])

  return (
    <Autocomplete
      fullWidth
      id='category-single-select'
      options={store.entities}
      autoHighlight
      getOptionLabel={(option: CategoryApi | {}) => {
        if (option && 'title' in option) return option.title
        else return ''
      }}
      value={selected}
      disableCloseOnSelect
      // @ts-ignore
      onChange={(r, e) => setSelected(e)}
      // @ts-ignore
      renderOption={(props, option: CategoryApi, { selected }) => (
        <li {...props}>
          <Radio checked={selected} />
          {option.title}
        </li>
      )}
      renderInput={params => <TextField {...params} {...props} label='Select category' placeholder='Category' />}
    />
  )
}

interface CategorySelectWithFormProps {
  control: any
  name: string
}

export const CategorySelectWithForm: React.FC<CategorySelectWithFormProps> = ({ control, name }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <CategorySelect
          execute={false}
          error={Boolean(error)}
          category={value}
          setCategory={category => onChange(category.id)}
        />
      )}
    />
  )
}
