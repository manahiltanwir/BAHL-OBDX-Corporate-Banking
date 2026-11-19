
import React from 'react'
import { Grid, MenuItem, TextField } from '@mui/material'
import { RuleType } from 'src/@core/data/dummy-rules'
import { ruleTypeOptions as defaultRuleTypeOptions, MENU_PROPS } from '../Constants'

type Props = {
  ruleType: RuleType
  onRuleTypeChange: (value: RuleType) => void
  ruleId: string
  onRuleIdChange: (value: string) => void
  ruleIdDisabled?: boolean
  ruleDescription: string
  onRuleDescriptionChange: (value: string) => void
  selectOpen: boolean
  onSelectOpen: () => void
  onSelectClose: () => void
  ruleTypeOptions?: { value: RuleType; label: string }[]
  errors?: {
    ruleType?: string
    ruleId?: string
    ruleDescription?: string
  }
}

const RuleDetailsFields = ({
  ruleType,
  onRuleTypeChange,
  ruleId,
  onRuleIdChange,
  ruleIdDisabled = false,
  ruleDescription,
  onRuleDescriptionChange,
  selectOpen,
  onSelectOpen,
  onSelectClose,
  ruleTypeOptions = defaultRuleTypeOptions,
  errors = {}
}: Props) => (
  <Grid container spacing={5}>
    <Grid item xs={12} sm={4}>
      <TextField
        select
        fullWidth
        required
        label='Rule Type'
        value={ruleType}
        error={!!errors.ruleType}
        helperText={errors.ruleType}
        onChange={e => onRuleTypeChange(e.target.value as RuleType)}
        SelectProps={{
          open: selectOpen,
          onOpen: onSelectOpen,
          onClose: onSelectClose,
          MenuProps: MENU_PROPS
        }}
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
        error={!!errors.ruleId}
        helperText={errors.ruleId}
        onChange={e => onRuleIdChange(e.target.value)}
        disabled={ruleIdDisabled}
      />
    </Grid>

    <Grid item xs={12} sm={4}>
      <TextField
        fullWidth
        required
        label='Rule Description'
        value={ruleDescription}
        error={!!errors.ruleDescription}
        helperText={errors.ruleDescription}
        onChange={e => onRuleDescriptionChange(e.target.value)}
      />
    </Grid>
  </Grid>
)

export default RuleDetailsFields
