import React from 'react'
import { Grid, MenuItem, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { InitiatorType } from 'src/@core/data/dummy-rules'
import { MENU_PROPS } from '../Constants' 
import { Option } from '../types'

type Props = {
  initiatorType: InitiatorType
  onInitiatorTypeChange: (value: InitiatorType | null) => void
  initiatorUser: string
  onInitiatorUserChange: (value: string) => void
  userOptions: Option[]
  selectOpen: boolean
  onSelectOpen: () => void
  onSelectClose: () => void
}

/** Initiator Type toggle + Initiator user select. */
const InitiatorFields = ({
  initiatorType,
  onInitiatorTypeChange,
  initiatorUser,
  onInitiatorUserChange,
  userOptions,
  selectOpen,
  onSelectOpen,
  onSelectClose
}: Props) => (
  <>
    <Typography variant='subtitle1' sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
      Initiator
    </Typography>
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography variant='body2' sx={{ mb: 1.5 }}>
          Initiator Type
        </Typography>
        <ToggleButtonGroup
          exclusive
          color='primary'
          size='small'
          value={initiatorType}
          onChange={(e, value) => onInitiatorTypeChange(value)}
        >
          <ToggleButton value='user'>User</ToggleButton>
          <ToggleButton value='userGroup' disabled>
            User Group
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          fullWidth
          size='small'
          label='Please Select'
          value={initiatorUser}
          onChange={e => onInitiatorUserChange(e.target.value)}
          SelectProps={{ open: selectOpen, onOpen: onSelectOpen, onClose: onSelectClose, MenuProps: MENU_PROPS }}
        >
          {userOptions.map(user => (
            <MenuItem key={user.id} value={user.id}>
              {user.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  </>
)

export default InitiatorFields