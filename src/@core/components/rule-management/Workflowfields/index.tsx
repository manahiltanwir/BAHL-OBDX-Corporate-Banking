import React from 'react'
import { Grid, MenuItem, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { MENU_PROPS } from '../Constants' 
import { Option } from '../types'

type Props = {
  approvalRequired: 'yes' | 'no'
  onApprovalRequiredChange: (value: 'yes' | 'no' | null) => void
  selectedWorkflow: string
  onSelectedWorkflowChange: (value: string) => void
  workflowOptions: Option[]
  selectOpen: boolean
  onSelectOpen: () => void
  onSelectClose: () => void
}

/** Approval Required toggle + workflow select (shown only when approval is required). */
const WorkflowFields = ({
  approvalRequired,
  onApprovalRequiredChange,
  selectedWorkflow,
  onSelectedWorkflowChange,
  workflowOptions,
  selectOpen,
  onSelectOpen,
  onSelectClose
}: Props) => (
  <>
    <Typography variant='subtitle1' sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
      Workflow Details
    </Typography>
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography variant='body2' sx={{ mb: 1.5 }}>
          Approval Required
        </Typography>
        <ToggleButtonGroup
          exclusive
          color='primary'
          size='small'
          value={approvalRequired}
          onChange={(e, value) => onApprovalRequiredChange(value)}
        >
          <ToggleButton value='yes'>Yes</ToggleButton>
          <ToggleButton value='no'>No</ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      {approvalRequired === 'yes' && (
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            size='small'
            label='Select Workflow'
            value={selectedWorkflow}
            onChange={e => onSelectedWorkflowChange(e.target.value)}
            SelectProps={{ open: selectOpen, onOpen: onSelectOpen, onClose: onSelectClose, MenuProps: MENU_PROPS }}
          >
            {workflowOptions.map(workflow => (
              <MenuItem key={workflow.id} value={workflow.id}>
                {workflow.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      )}
    </Grid>
  </>
)

export default WorkflowFields