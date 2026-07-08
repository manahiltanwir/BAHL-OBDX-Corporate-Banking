import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  InputAdornment,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import LoadingButton from '@mui/lab/LoadingButton'

interface PartyRecord {
  id: string
  name: string
}

const colors = {
  green: '#10b981',
  greenHover: '#059669',
  greenLight: '#ecfdf5',
  yellow: '#f59e0b',
  yellowHover: '#d97706',
  yellowLight: '#fef3c7',
  yellowBorder: '#fde68a',
  yellowText: '#92400e'
}

// ** Styled Components
const StyledModuleIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: theme.shape.borderRadius * 1.5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledSearchCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 1.75,
  boxShadow: theme.shadows[2]
}))

const StyledPanelCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 1.75,
  boxShadow: theme.shadows[2],
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%'
}))

const StyledPanelHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2.5),
  paddingBottom: theme.spacing(1.75),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const StyledInfoValue = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  color: theme.palette.text.primary
}))

const StyledHighlightValue = styled(Typography)(() => ({
  fontSize: '1.125rem',
  fontWeight: 700,
  fontFamily: 'monospace',
  // color: colors.green
}))

const StyledControlRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: theme.palette.action.hover,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 1.5,
  border: `1px dashed ${theme.palette.divider}`,
  marginBottom: theme.spacing(2.5)
}))

const StyledAlertBox = styled(Box)(({ theme }) => ({
  backgroundColor: colors.yellowLight,
  border: `1px solid ${colors.yellowBorder}`,
  borderRadius: theme.shape.borderRadius * 1.25,
  padding: theme.spacing(1.75),
  display: 'flex',
  gap: theme.spacing(1.5),
  alignItems: 'flex-start'
}))

const StyledEditFormBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  marginTop: theme.spacing(2.5),
  paddingTop: theme.spacing(2.5),
  borderTop: `1px dashed ${theme.palette.divider}`
}))


const PartyManagement = () => {
  const [partyIdInput, setPartyIdInput] = useState('')
  const [searchError, setSearchError] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [statusEnabled, setStatusEnabled] = useState(true)
  const [party, setParty] = useState<PartyRecord>({
    id: 'PRT-9921',
    name: 'Apex Logistics Solutions Ltd.'
  })

  // ** Edit / Create form state
  const [isEditing, setIsEditing] = useState(false)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [formValues, setFormValues] = useState<PartyRecord>({ id: '', name: '' })

  const handleSearch = () => {
    const value = partyIdInput.trim()

    if (value === '') {
      setSearchError(true)
      setShowResults(false)
      return
    }

    setSearchError(false)
    setParty(prev => ({ ...prev, id: value }))
    setShowResults(true)
    setIsEditing(false)
    setIsCreatingNew(false)
  }

  const handleEdit = () => {
    setFormValues({ id: party.id, name: party.name })
    setIsCreatingNew(false)
    setIsEditing(true)
  }

  const handleCreateNew = () => {
    setFormValues({ id: '', name: '' })
    setIsCreatingNew(true)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setIsCreatingNew(false)
  }

  const handleSaveEdit = () => {
    setParty({ id: formValues.id, name: formValues.name })
    setIsEditing(false)
    setIsCreatingNew(false)
    // TODO: commit changes to database (create-new ya update, isCreatingNew flag se differentiate karein)
  }

  const handleSave = () => {
    // TODO: commit changes to database (status toggle waghera)
  }

  return (
    <Grid container spacing={6}>
      {/* Module Header */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <StyledModuleIcon>
            <PeopleAltOutlinedIcon />
          </StyledModuleIcon>
          <Box>
            <Typography variant='h5' sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
              Party Management
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary', mt: 0.25 }}>
              Search, audit, and modify registered business party records.
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Search Bar */}
      <Grid item xs={12}>
        <StyledSearchCard>
          <Typography
            variant='caption'
            sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}
          >
            Search Registration ID
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 1, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <TextField
              fullWidth
              placeholder='Enter Party ID (e.g., PRT-9921)...'
              value={partyIdInput}
              onChange={e => setPartyIdInput(e.target.value)}
              error={searchError}
              helperText={searchError ? 'Please provide a valid Party ID to look up.' : ' '}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon fontSize='small' />
                  </InputAdornment>
                )
              }}
            />


            <LoadingButton
              variant='contained'
              size='large'
              // loading={loading}
              loadingPosition='end'
              onClick={handleSearch}
              sx={{
                height: 52,
                minWidth: 160,
                fontSize: 12,
              }}
            >
              Search Record
            </LoadingButton>
          </Box>
        </StyledSearchCard>
      </Grid>

      {/* Results Workspace */}
      {showResults && (
        <Grid item xs={12}>
          <Grid container spacing={6}>
            {/* Details Panel */}
            <Grid item xs={12} md={7}>
              <StyledPanelCard>
                <Box>
                  <StyledPanelHeader>
                    <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                      Party Specifications
                    </Typography>
                    <Chip
                      label={isCreatingNew ? 'New Record' : 'Verified Record'}
                      size='small'
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.6875rem',
                        textTransform: 'uppercase'
                      }}
                    />
                  </StyledPanelHeader>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25, mb: isEditing ? 0 : 3 }}>
                    <Box>
                      <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                        Party Identification Number
                      </Typography>
                      <StyledHighlightValue>{party.id}</StyledHighlightValue>
                    </Box>
                    <Box>
                      <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                        Registered Legal Name
                      </Typography>
                      <StyledInfoValue>{party.name}</StyledInfoValue>
                    </Box>
                  </Box>

                  {/* Editable fields — Modify Details / Create New Entry click hone par khulti hain */}
                  {isEditing && (
                    <StyledEditFormBox>
                      <TextField
                        fullWidth
                        label='Party Identification Number'
                        size='small'
                        value={formValues.id}
                        onChange={e => setFormValues(prev => ({ ...prev, id: e.target.value }))}
                        placeholder='e.g., PRT-9921'
                      />
                      <TextField
                        fullWidth
                        label='Registered Legal Name'
                        size='small'
                        value={formValues.name}
                        onChange={e => setFormValues(prev => ({ ...prev, name: e.target.value }))}
                        placeholder='e.g., Apex Logistics Solutions Ltd.'
                      />
                    </StyledEditFormBox>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, mt: isEditing ? 2.5 : 'auto' }}>
                  {!isEditing ? (
                    <>
                      <LoadingButton
                        variant='contained'
                        loadingPosition='end'
                        startIcon={<EditOutlinedIcon />}
                        onClick={handleEdit}
                        sx={{
                          height: 52,
                          minWidth: 160,
                          fontSize: 12,
                        }}
                      >
                        Modify Details
                      </LoadingButton>
                      <Button variant='outlined' color='inherit' onClick={handleCreateNew}>
                        Create New Entry
                      </Button>
                    </>
                  ) : (
                    <>
                      <LoadingButton
                        variant='contained'
                        loadingPosition='end'
                        startIcon={<SaveOutlinedIcon />}
                        onClick={handleSaveEdit}
                      >
                        Modify Details
                      </LoadingButton>
                      <Button variant='outlined' color='inherit' onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </>
                  )}
                </Box>
              </StyledPanelCard>
            </Grid>

            {/* Control Panel */}
            <Grid item xs={12} md={5}>
              <StyledPanelCard>
                <Box>
                  <StyledPanelHeader>
                    <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                      System Configuration
                    </Typography>
                  </StyledPanelHeader>

                  <StyledControlRow>
                    <Box sx={{ maxWidth: 180 }}>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        Operational Status
                      </Typography>
                      <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                        Toggle to suspend or authorize party actions instantly.
                      </Typography>
                    </Box>
                    <Switch
                      checked={statusEnabled}
                      onChange={e => setStatusEnabled(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: colors.green },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: colors.green }
                      }}
                    />
                  </StyledControlRow>

                  <StyledAlertBox>
                    <WarningAmberOutlinedIcon fontSize='small' sx={{ color: colors.yellow, mt: 0.25 }} />
                    <Typography variant='caption' sx={{ color: colors.yellowText, lineHeight: 1.5 }}>
                      Changes will affect system validation rules immediately upon saving.
                    </Typography>
                  </StyledAlertBox>
                </Box>
              </StyledPanelCard>
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* Global Submit Bar */}
      {showResults && (
        <Grid item xs={12}>
          <Box
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              pt: 2.5,
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <LoadingButton
              variant='contained'
              loadingPosition='end'
              onClick={handleSave}
            >
              Commit Changes to Database
            </LoadingButton>
          </Box>
        </Grid>
      )}
    </Grid>
  )
}

PartyManagement.acl = {
  action: 'itsHaveAccess',
  subject: 'party-management-page'
}

export default PartyManagement