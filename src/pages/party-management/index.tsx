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

interface PartyRecord {
  id: string
  name: string
}

interface PartyPreferences {
  fileEncryptionKey: string
  approvalFlow: 'sequential' | 'parallel' | 'none'
  gracePeriod: string
  channelAccess: 'enable' | 'disable'
  forexDealCreation: 'enable' | 'disable'
  corporateAdminFacility: 'enable' | 'disable'
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

const StyledAlertBox = styled(Box)(({ theme }) => ({
  backgroundColor: colors.yellowLight,
  border: `1px solid ${colors.yellowBorder}`,
  borderRadius: theme.shape.borderRadius * 1.25,
  padding: theme.spacing(1.75),
  display: 'flex',
  gap: theme.spacing(1.5),
  alignItems: 'flex-start'
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


interface SegmentedOption {
  value: string
  label: string
}

const StyledSegmentedWrapper = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  padding: 4,
  borderRadius: 999,
  backgroundColor: theme.palette.action.hover,
  border: `1px solid ${theme.palette.divider}`,
  gap: 2
}))

interface SegmentedButtonProps {
  active?: boolean
}

const StyledSegmentedButton = styled(Box, {
  shouldForwardProp: prop => prop !== 'active'
})<SegmentedButtonProps>(({ theme, active }) => ({
  padding: theme.spacing(0.75, 2),
  borderRadius: 999,
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  transition: 'all 0.2s ease',
  color: active ? '#ffffff' : theme.palette.text.secondary,
  backgroundColor: active ? colors.green : 'transparent',
  boxShadow: active ? '0 2px 6px rgba(16, 185, 129, 0.35)' : 'none',
  '&:hover': {
    backgroundColor: active ? colors.greenHover : theme.palette.action.selected,
    color: active ? '#ffffff' : theme.palette.text.primary
  }
}))

interface SegmentedControlProps {
  options: SegmentedOption[]
  value: string
  onChange: (value: string) => void
}

const SegmentedControl = ({ options, value, onChange }: SegmentedControlProps) => (
  <StyledSegmentedWrapper>
    {options.map(opt => (
      <StyledSegmentedButton key={opt.value} active={opt.value === value} onClick={() => onChange(opt.value)}>
        {opt.label}
      </StyledSegmentedButton>
    ))}
  </StyledSegmentedWrapper>
)

const PartyManagement = () => {
  const [partyIdInput, setPartyIdInput] = useState('')
  const [searchError, setSearchError] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [statusEnabled, setStatusEnabled] = useState(true)
  const [party, setParty] = useState<PartyRecord>({
    id: 'PRT-9921',
    name: 'Apex Logistics Solutions Ltd.'
  })

  // ** Edit / Create mode
  const [isEditing, setIsEditing] = useState(false)
  const [isCreatingNew, setIsCreatingNew] = useState(false)

  // ** Party Preferences form state
  const [preferences, setPreferences] = useState<PartyPreferences>({
    fileEncryptionKey: '',
    approvalFlow: 'parallel',
    gracePeriod: '1',
    channelAccess: 'enable',
    forexDealCreation: 'disable',
    corporateAdminFacility: 'disable'
  })

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
    setParty({ id: '', name: '' })
    setIsCreatingNew(true)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setIsCreatingNew(false)
  }

  const handleSavePreferences = () => {
    setIsEditing(false)
    setIsCreatingNew(false)
    // TODO: commit party + preferences to database
  }

  const handleBack = () => {
    setIsEditing(false)
    setIsCreatingNew(false)
  }

  const handleSave = () => {
    // TODO: commit changes to database (status toggle waghera)
  }

  const updatePreference = <K extends keyof PartyPreferences>(key: K, value: PartyPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
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
                      <Button variant='outlined' color='inherit' onClick={handleCreateNew}>
                        Create New Entry
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    {/* ---------------- Party Preferences ---------------- */}
                    <Box>
                      <Typography
                        variant='subtitle1'
                        sx={{ fontWeight: 700, color: colors.green, mb: 1.5, pb: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}
                      >
                        Details
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 1 }}>
                        <StyledReadOnlyField
                          fullWidth
                          label='Party ID'
                          size='small'
                          value={party.id}
                          disabled
                        />
                        <StyledReadOnlyField
                          fullWidth
                          label='Party Name'
                          size='small'
                          value={party.name}
                          disabled
                        />
                      </Box>

                      <StyledPreferenceRow>
                        <StyledPreferenceLabel>File Encryption Key</StyledPreferenceLabel>
                        <TextField
                          variant='standard'
                          size='small'
                          value={preferences.fileEncryptionKey}
                          onChange={e => updatePreference('fileEncryptionKey', e.target.value)}
                          sx={{ width: 160 }}
                        />
                      </StyledPreferenceRow>

                      <StyledPreferenceRow>
                        <StyledPreferenceLabel>Approval Flow</StyledPreferenceLabel>
                        <SegmentedControl
                          options={[
                            { value: 'sequential', label: 'Sequential' },
                            { value: 'parallel', label: 'Parallel' },
                            { value: 'none', label: 'No Approval' }
                          ]}
                          value={preferences.approvalFlow}
                          onChange={v => updatePreference('approvalFlow', v as PartyPreferences['approvalFlow'])}
                        />
                      </StyledPreferenceRow>

                      <StyledPreferenceRow>
                        <StyledPreferenceLabel>Grace Period</StyledPreferenceLabel>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <TextField
                              variant='standard'
                              size='small'
                              type='number'
                              value={preferences.gracePeriod}
                              onChange={e => updatePreference('gracePeriod', e.target.value)}
                              sx={{ width: 60 }}
                            />
                            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Days</Typography>
                          </Box>
                          <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                            Maximum Allowed
                          </Typography>
                        </Box>
                      </StyledPreferenceRow>

                      <StyledPreferenceRow>
                        <StyledPreferenceLabel>Channel Access</StyledPreferenceLabel>
                        <SegmentedControl
                          options={[
                            { value: 'enable', label: 'Enable' },
                            { value: 'disable', label: 'Disable' }
                          ]}
                          value={preferences.channelAccess}
                          onChange={v => updatePreference('channelAccess', v as 'enable' | 'disable')}
                        />
                      </StyledPreferenceRow>

                      <StyledPreferenceRow>
                        <StyledPreferenceLabel>Forex Deal Creation</StyledPreferenceLabel>
                        <SegmentedControl
                          options={[
                            { value: 'enable', label: 'Enable' },
                            { value: 'disable', label: 'Disable' }
                          ]}
                          value={preferences.forexDealCreation}
                          onChange={v => updatePreference('forexDealCreation', v as 'enable' | 'disable')}
                        />
                      </StyledPreferenceRow>

                      <StyledPreferenceRow>
                        <StyledPreferenceLabel>Corporate Administrator Facility</StyledPreferenceLabel>
                        <SegmentedControl
                          options={[
                            { value: 'enable', label: 'Enable' },
                            { value: 'disable', label: 'Disable' }
                          ]}
                          value={preferences.corporateAdminFacility}
                          onChange={v => updatePreference('corporateAdminFacility', v as 'enable' | 'disable')}
                        />
                      </StyledPreferenceRow>

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

                        <StyledAccordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>User Limits</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                              User-level limit configuration goes here.
                            </Typography>
                          </AccordionDetails>
                        </StyledAccordion>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                      <Button
                        variant='contained'
                        onClick={handleSavePreferences}
                        sx={{ bgcolor: colors.green, '&:hover': { bgcolor: colors.greenHover } }}
                      >
                        Save
                      </Button>
                      <Button
                        variant='contained'
                        onClick={handleCancelEdit}
                        sx={{ bgcolor: colors.yellow, color: '#fff', '&:hover': { bgcolor: colors.yellowHover } }}
                      >
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