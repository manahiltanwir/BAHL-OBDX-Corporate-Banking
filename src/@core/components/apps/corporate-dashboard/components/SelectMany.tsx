import React, { useState, useMemo, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import Checkbox from '@mui/material/Checkbox'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

// ** Actions
import { fetchAllAction } from 'src/store/apps/category'

// ** types
import { RootState, AppDispatch } from 'src/store'
import { CategoryApi } from 'src/types/apps/category'

interface MultiSelect {
  execute?: boolean
  categories: CategoryApi[]
  setCategories: (categories: CategoryApi[]) => void
}

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

export default function MultiSelect({ execute = false, categories, setCategories }: MultiSelect) {
  const [selected, setSelected] = useState<CategoryApi[] | []>(categories || [])

  const store = useSelector((state: RootState) => state.category)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    execute && dispatch(fetchAllAction({ query: {} }))
  }, [])

  useMemo(() => {
    setCategories(selected)
  }, [selected])

  return (
    <Autocomplete
      fullWidth
      multiple
      id='categories-multi-select'
      options={store.entities}
      getOptionLabel={option => option.title}
      value={selected}
      onChange={(r, e) => setSelected(e)}
      disableCloseOnSelect
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
          {option.title}
        </li>
      )}
      renderInput={params => <TextField {...params} label='Select categories' placeholder='Categories' />}
    />
  )
}
