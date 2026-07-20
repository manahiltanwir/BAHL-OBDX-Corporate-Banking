import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LoadingButton from '@mui/lab/LoadingButton'
import ToggleField from 'src/@core/components/ToggleField'
import { useRouter } from 'next/router'

interface PartyRecord {
  id: string
  name: string
}

interface PartyPreferences {
  channelAccess: 'enable' | 'disable'
  corporateAdminFacility: 'enable' | 'disable'
  gracePeriod: string

}

// ** Grace Period Constraints
const GRACE_PERIOD_MIN = 1
const GRACE_PERIOD_MAX = 30

// ** Styled Components
const StyledModuleIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: theme.shape.borderRadius * 1.5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
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
  fontFamily: 'monospace'
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
const StyledPreferenceRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '200px 1fr',
  columnGap: theme.spacing(3),
  alignItems: 'center',
  justifyItems: 'start',
  padding: theme.spacing(1.5, 0),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    rowGap: theme.spacing(1)
  }
}))

const StyledPreferenceLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.4
}))
const StyledAlertBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f2d9b0',
  border: `1px solid ${'#f0a528'}`,
  borderRadius: theme.shape.borderRadius * 1.25,
  padding: theme.spacing(1.75),
  display: 'flex',
  gap: theme.spacing(1.5),
  alignItems: 'flex-start'
}))

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: `${theme.shape.borderRadius}px !important`,
  '&:before': { display: 'none' },
  '&.Mui-expanded': { margin: 0 }
}))

// ** Disabled / read-only TextField (faded look)
const StyledReadOnlyField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root.Mui-disabled': {
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius
  },
  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: theme.palette.text.secondary,
    fontWeight: 500,
    opacity: 0.85
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider
  }
}))

const PartyManagement = () => {
  const router = useRouter()

  const [partyIdInput, setPartyIdInput] = useState('')
  const [searchError, setSearchError] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [statusEnabled, setStatusEnabled] = useState(true)
  const [party, setParty] = useState<PartyRecord>({
    id: 'PRT-9921',
    name: 'Apex Logistics Solutions Ltd.'
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [preferences, setPreferences] = useState<PartyPreferences>({
    channelAccess: 'enable',
    corporateAdminFacility: 'disable',
    gracePeriod: '1'

  })
  const [gracePeriodError, setGracePeriodError] = useState(false)

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
    setIsCreatingNew(false)
    setIsEditing(true)
  }

  const handleCreateNew = () => {
    router.push('/party-management/add-party')
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setIsCreatingNew(false)
  }

  const handleSavePreferences = () => {
    // block save if grace period is invalid
    const numericValue = Number(preferences.gracePeriod)
    if (
      preferences.gracePeriod.trim() === '' ||
      Number.isNaN(numericValue) ||
      numericValue < GRACE_PERIOD_MIN ||
      numericValue > GRACE_PERIOD_MAX
    ) {
      setGracePeriodError(true)
      return
    }

    setIsEditing(false)
    setIsCreatingNew(false)
  }

  const handleBack = () => {
    setIsEditing(false)
    setIsCreatingNew(false)
  }

  const handleSave = () => {
    alert('saved')
  }

  const updatePreference = <K extends keyof PartyPreferences>(key: K, value: PartyPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  // ** Grace Period handlers: no negative sign allowed, digits only while typing
  const handleGracePeriodChange = (rawValue: string) => {
    // strip any minus sign / non-digit characters so "mein" (negative) can never be entered
    const sanitized = rawValue.replace(/[^0-9]/g, '')

    updatePreference('gracePeriod', sanitized)

    if (sanitized === '') {
      setGracePeriodError(false)
      return
    }

    const numericValue = Number(sanitized)
    setGracePeriodError(numericValue < GRACE_PERIOD_MIN || numericValue > GRACE_PERIOD_MAX)
  }

  // ** On blur, clamp the value into the allowed [1, 30] range
  const handleGracePeriodBlur = (rawValue: string) => {
    const sanitized = rawValue.replace(/[^0-9]/g, '')

    if (sanitized === '') {
      updatePreference('gracePeriod', String(GRACE_PERIOD_MIN))
      setGracePeriodError(false)
      return
    }

    const numericValue = Number(sanitized)
    const clamped = Math.min(GRACE_PERIOD_MAX, Math.max(GRACE_PERIOD_MIN, numericValue))

    updatePreference('gracePeriod', String(clamped))
    setGracePeriodError(false)
  }

  return (
    <Grid container spacing={6}>
      {/* Module Header */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
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
{/* 
          <Button variant='contained' onClick={handleCreateNew}>
            Create New Entry
          </Button> */}
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
              loadingPosition='end'
              onClick={handleSearch}
              sx={{ height: 52, minWidth: 160, fontSize: 12 }}
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
            <Grid item xs={12} md={7}>
              <StyledPanelCard>
                {!isEditing ? (
                  <>
                    <Box>
                      <StyledPanelHeader>
                        <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                          Party Specifications
                        </Typography>
                        <Chip
                          label={isCreatingNew ? 'New Record' : 'Verified Record'}
                          size='small'
                          sx={{ fontWeight: 700, fontSize: '0.6875rem', textTransform: 'uppercase' }}
                        />
                      </StyledPanelHeader>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25, mb: 3 }}>
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
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto' }}>
                      <LoadingButton
                        variant='contained'
                        loadingPosition='end'
                        startIcon={<EditOutlinedIcon />}
                        onClick={handleEdit}
                        sx={{ height: 52, minWidth: 160, fontSize: 12 }}
                      >
                        Modify Details
                      </LoadingButton>
                    </Box>
                  </>
                ) : (
                  <>
                    {/* ---------------- Party Preferences ---------------- */}
                    <Box>
                      <Typography
                        variant='subtitle1'
                        sx={{ fontWeight: 700, mb: 1.5, pb: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}
                      >
                        Details
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 1 }}>
                        <StyledReadOnlyField fullWidth label='Party ID' size='small' value={party.id} disabled />
                        <StyledReadOnlyField fullWidth label='Party Name' size='small' value={party.name} disabled />
                      </Box>

                      {/* use toggle filed as a componet  */}
                      {/* <ToggleField
                        label='Channel Access'
                        value={preferences.channelAccess}
                        onChange={v => updatePreference('channelAccess', v as 'enable' | 'disable')}
                      />

                      <ToggleField
                        label='Corporate Administrator Facility'
                        value={preferences.corporateAdminFacility}
                        onChange={v => updatePreference('corporateAdminFacility', v as 'enable' | 'disable')}
                      />

                      <StyledPreferenceRow>
                        <StyledPreferenceLabel>Grace Period</StyledPreferenceLabel>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <TextField
                              variant='standard'
                              size='small'
                              type='number'
                              value={preferences.gracePeriod}
                              onChange={e => handleGracePeriodChange(e.target.value)}
                              onBlur={e => handleGracePeriodBlur(e.target.value)}
                              error={gracePeriodError}
                              inputProps={{ min: GRACE_PERIOD_MIN, max: GRACE_PERIOD_MAX, step: 1 }}
                              sx={{ width: 60 }}
                            />
                            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Days</Typography>
                          </Box>
                          <Typography
                            variant='caption'
                            sx={{ color: gracePeriodError ? 'error.main' : 'text.secondary' }}
                          >
                            {gracePeriodError
                              ? `Value must be between ${GRACE_PERIOD_MIN} and ${GRACE_PERIOD_MAX}`
                              : `Allowed range: ${GRACE_PERIOD_MIN}-${GRACE_PERIOD_MAX} days`}
                          </Typography>
                        </Box>
                      </StyledPreferenceRow> */}

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                        <StyledAccordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>Cumulative Limits</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                              Cumulative limit configuration goes here.
                            </Typography>
                          </AccordionDetails>
                        </StyledAccordion>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                      <Button variant='contained' onClick={handleSavePreferences}>
                        Save
                      </Button>
                      <Button variant='contained' onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                      <Button variant='outlined' color='inherit' onClick={handleBack}>
                        Back
                      </Button>
                    </Box>
                  </>
                )}
              </StyledPanelCard>
            </Grid>

            {/* Control Panel */}
            <Grid item xs={12} md={5}>
              <StyledPanelCard>
                <Box>
                  <StyledPanelHeader>
                    <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                      Party Enable / Disable
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
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#15804f' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#15804f' }
                      }}
                    />
                  </StyledControlRow>

                  <StyledAlertBox>
                    <WarningAmberOutlinedIcon fontSize='small' sx={{ color: '#f0a528', mt: 0.25 }} />
                    <Typography variant='caption' sx={{ color: '#f0a528', lineHeight: 1.5 }}>
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
      {showResults && !isEditing && (
        <Grid item xs={12}>
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2.5, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton variant='contained' loadingPosition='end' onClick={handleSave}>
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