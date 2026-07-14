import React, { useState } from 'react'
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'

// ** Types
type LevelUserType = 'user' | 'userGroup'

interface ApprovalLevel {
  id: number
  userType: LevelUserType
  selectedUser: string
}

const dummyAccountUsers = [
  { id: '99999991_Maker1', label: 'Maker 1 (99999991_Maker1)' },
  { id: '99999991_Checker1', label: 'Checker 1 (99999991_Checker1)' },
  { id: '99999992_Maker1', label: 'Maker 1 (99999992_Maker1)' },
  { id: '99999992_Checker1', label: 'Checker 1 (99999992_Checker1)' },
  { id: '99999993_Maker1', label: 'Maker 1 (99999993_Maker1)' },
  { id: '99999993_Checker1', label: 'Checker 1 (99999993_Checker1)' }
]

const MAX_LEVELS = 7

const Page = () => {
  const [workflowCode, setWorkflowCode] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')
  const [partyId, setPartyId] = useState('')

  const [levels, setLevels] = useState<ApprovalLevel[]>([
    { id: 1, userType: 'user', selectedUser: '' }
  ])

  const handleAddLevel = () => {
    if (levels.length >= MAX_LEVELS) return

    setLevels(prev => [
      ...prev,
      { id: prev.length ? prev[prev.length - 1].id + 1 : 1, userType: 'user', selectedUser: '' }
    ])
  }

  const handleDeleteLevel = (id: number) => {
    if (levels.length === 1) return
    setLevels(prev => prev.filter(level => level.id !== id))
  }

  // ** User / User Group toggle change
  const handleUserTypeChange = (id: number, newType: LevelUserType | null) => {
    if (!newType) return
    setLevels(prev =>
      prev.map(level => (level.id === id ? { ...level, userType: newType, selectedUser: '' } : level))
    )
  }

  // ** Dropdown se user select karna
  const handleUserSelect = (id: number, value: string) => {
    setLevels(prev => prev.map(level => (level.id === id ? { ...level, selectedUser: value } : level)))
  }

  // ** Save button
  const handleSave = () => {
    const payload = {
      workflowCode,
      workflowDescription,
      levels
    }

    console.log('Saving workflow:', payload)

    // TODO: yahan API call / dispatch action lagana
  }

  // ** Cancel button - form ko reset kar deta hai
  const handleCancel = () => {
    setWorkflowCode('')
    setWorkflowDescription('')
    setLevels([{ id: 1, userType: 'user', selectedUser: '' }])
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ mb: 4 }}>
          Workflow Management
        </Typography>

        <Card sx={{ p: 5 }}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label='Workflow Code'
                value={workflowCode}
                onChange={e => setWorkflowCode(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label='Workflow Description'
                value={workflowDescription}
                onChange={e => setWorkflowDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label='Party ID'
                value={partyId}
                onChange={e => setPartyId(e.target.value)}
              />
            </Grid>
          </Grid>

          <Typography variant='subtitle1' sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
            Approval Details
          </Typography>

          {levels.map((level, index) => (
            <Box
              key={level.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 3,
                mb: 4,
                pb: 4,
                borderBottom: theme => (index !== levels.length - 1 ? `1px solid ${theme.palette.divider}` : 'none')
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant='body2' sx={{ mb: 1.5 }}>
                  {`Level ${index + 1}`}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <ToggleButtonGroup
                    exclusive
                    color='primary'
                    size='small'
                    value={level.userType}
                    onChange={(e, value) => handleUserTypeChange(level.id, value)}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    <ToggleButton value='user'>User</ToggleButton>
                    <ToggleButton value='userGroup'>User Group</ToggleButton>
                  </ToggleButtonGroup>

                  <TextField
                    select
                    fullWidth
                    size='small'
                    label='Please Select'
                    value={level.selectedUser}
                    onChange={e => handleUserSelect(level.id, e.target.value)}
                    sx={{ maxWidth: 320 }}
                  >
                    {dummyAccountUsers.map(user => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Box>
              <IconButton
                onClick={() => handleDeleteLevel(level.id)}
                disabled={levels.length === 1}
                sx={{ mt: 3.5 }}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            variant='outlined'
            startIcon={<AddIcon />}
            onClick={handleAddLevel}
            disabled={levels.length >= MAX_LEVELS}
          >
            Add
          </Button>

          {levels.length >= MAX_LEVELS && (
            <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 1 }}>
              Maximum {MAX_LEVELS} approval levels allowed.
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3, mt: 8 }}>
            <Button variant='outlined' color='secondary' onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant='contained' onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'add-workflow'
}

export default Page