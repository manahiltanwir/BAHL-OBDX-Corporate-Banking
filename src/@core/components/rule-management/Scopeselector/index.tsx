import React, { useMemo, useState } from 'react'
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  ListItemText,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import { ScopeMode } from 'src/@core/data/dummy-rules'
import { MENU_PROPS } from '../Constants'
import { Option } from '../types'

type Props = {
  sectionTitle: string
  allLabel: string
  specificLabel: string
  selectLabel: string
  mode: ScopeMode
  onModeChange: (value: ScopeMode | null) => void
  selected: string[]
  onSelectedChange: (event: SelectChangeEvent<string[]>) => void
  options: Option[]
  selectOpen: boolean
  onSelectOpen: () => void
  onSelectClose: () => void
}

const ScopeSelector = ({
  sectionTitle,
  allLabel,
  specificLabel,
  selectLabel,
  mode,
  onModeChange,
  selected,
  onSelectedChange,
  options,
  selectOpen,
  onSelectOpen,
  onSelectClose
}: Props) => {
  const labelId = `${sectionTitle.replace(/\s+/g, '-').toLowerCase()}-select-label`
  const [searchText, setSearchText] = useState('')

  const filteredOptions = useMemo(() => {
    const q = searchText.trim().toLowerCase()
    if (!q) return options

    return options.filter(o => o.label.toLowerCase().includes(q))
  }, [options, searchText])

  const handleClose = () => {
    setSearchText('')
    onSelectClose()
  }

  return (
    <>
      <Typography variant='subtitle1' sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
        {sectionTitle}
      </Typography>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <ToggleButtonGroup exclusive color='primary' size='small' value={mode} onChange={(e, value) => onModeChange(value)}>
            <ToggleButton value='all'>{allLabel}</ToggleButton>
            <ToggleButton value='specific'>{specificLabel}</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        {mode === 'specific' && (
          <Grid item xs={12} sm={8}>
            <FormControl fullWidth size='small'>
              <InputLabel id={labelId}>{selectLabel}</InputLabel>
              <Select
                labelId={labelId}
                multiple
                open={selectOpen}
                onOpen={onSelectOpen}
                onClose={handleClose}
                value={selected}
                onChange={onSelectedChange}
                input={<OutlinedInput label={selectLabel} />}
                renderValue={sel => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {(sel as string[]).map(value => (
                      <Chip key={value} label={options.find(o => o.id === value)?.label ?? value} size='small' />
                    ))}
                  </Box>
                )}
                MenuProps={{ ...MENU_PROPS, autoFocus: false }}
              >
                <ListSubheader sx={{ py: 2, lineHeight: 'normal' }}>
                  <TextField
                    autoFocus
                    fullWidth
                    size='small'
                    placeholder='Search...'
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position='start'>🔍</InputAdornment>
                    }}
                    onKeyDown={e => {
                      if (e.key !== 'Escape') e.stopPropagation()
                    }}
                  />
                </ListSubheader>

                {filteredOptions.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    <Checkbox checked={selected.indexOf(option.id) > -1} />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}

                {filteredOptions.length === 0 && (
                  <MenuItem disabled>
                    <ListItemText primary='No results found' />
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </>
  )
}

export default ScopeSelector