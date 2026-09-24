import React from 'react'
import { Grid, MenuItem, TextField } from '@mui/material'
import { RuleType } from 'src/@core/data/dummy-rules'
import { ruleTypeOptions,MENU_PROPS } from '../Constants'

type Props = {
  ruleType: RuleType
  onRuleTypeChange: (value: RuleType) => void
  ruleId: string
  onRuleIdChange: (value: string) => void
  ruleDescription: string
  onRuleDescriptionChange: (value: string) => void
  selectOpen: boolean
  onSelectOpen: () => void
  onSelectClose: () => void
}

/** Rule Type / Rule ID / Rule Description row. */
const RuleDetailsFields = ({
  ruleType,
  onRuleTypeChange,
  ruleId,
  onRuleIdChange,
  ruleDescription,
  onRuleDescriptionChange,
  selectOpen,
  onSelectOpen,
  onSelectClose
}: Props) => (
  <Grid container spacing={5}>
    <Grid item xs={12} sm={4}>
      <TextField
        select
        fullWidth
        required
        label='Rule Type'
        value={ruleType}
        onChange={e => onRuleTypeChange(e.target.value as RuleType)}
        SelectProps={{ open: selectOpen, onOpen: onSelectOpen, onClose: onSelectClose, MenuProps: MENU_PROPS }}
      >
        {ruleTypeOptions.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
    <Grid item xs={12} sm={4}>
      <TextField
        fullWidth
        required
        label='Rule ID'
        placeholder='e.g. RULE001'
        value={ruleId}
        onChange={e => onRuleIdChange(e.target.value)}
      />
    </Grid>
    <Grid item xs={12} sm={4}>
      <TextField
        fullWidth
        required
        label='Rule Description'
        value={ruleDescription}
        onChange={e => onRuleDescriptionChange(e.target.value)}
      />
    </Grid>
  </Grid>
)

export default RuleDetailsFields