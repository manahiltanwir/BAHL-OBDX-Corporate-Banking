import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
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
import SearchIcon from '@mui/icons-material/Search'
import ApartmentIcon from '@mui/icons-material/Apartment'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import LockIcon from '@mui/icons-material/Lock'
import LoadingButton from '@mui/lab/LoadingButton'
import { dummyAccountUsers, dummyWorkflows, ApprovalLevel, ApprovalFlow, LevelUserType } from 'src/@core/data/Dummyworkflows'

const REVIEW_STORAGE_KEY = 'addUserReviewData'
const REVIEW_ROUTE = '/workflow-management/add-workflow/review-workflow'

const colors = {
  green: '#10B981',
  greenHover: '#059669'
}

const approvalFlowLabels: Record<ApprovalFlow, string> = {
  sequential: 'Sequential',
  parallel: 'Parallel',
  none: 'No Approval'
}

const userTypeLabels: Record<LevelUserType, string> = {
  user: 'User',
  userGroup: 'User Group'
}

interface PartyPreferences {
  approvalFlow: ApprovalFlow
}

const MAX_LEVELS = 7

// ---------- Party search ----------
// Same shape/behaviour as the Party search on the Add User page, so both
// screens feel consistent. Replace the mock lookup with a real API call
// when the backend is ready.
interface PartyInfo {
  partyId: string
  partyName: string
}

type PartySearchStatus = 'idle' | 'searching' | 'found' | 'not-found' | 'error'

const partyService = {
  mockDirectory: {
    'P-1001': 'Al-Falah Textiles (Pvt) Ltd',
    'P-1002': 'Zaman Trading Enterprises',
    'P-1003': 'Karachi Exports Co.',
    'P-1004': 'Indus Logistics Group'
  } as Record<string, string>,

  searchById(rawPartyId: string): Promise<PartyInfo | null> {
    const partyId = rawPartyId.trim().toUpperCase()

    if (!partyId) return Promise.resolve(null)

    // TODO: replace this whole body with a real API call, e.g.:
    // const { data } = await axios.get(`/api/parties/${partyId}`)
    // return data ? { partyId: data.id, partyName: data.name } : null
    return new Promise(resolve => {
      window.setTimeout(() => {
        const partyName = partyService.mockDirectory[partyId]

        resolve(partyName ? { partyId, partyName } : null)
      }, 500)
    })
  }
}

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

const StyledSegmentedWrapper = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  padding: 4,
  borderRadius: 999,
  backgroundColor: theme.palette.action.hover,
  border: `1px solid ${theme.palette.divider}`,
  gap: 2
}))

const StyledPreferenceLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.4
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

interface SegmentedOption {
  value: string
  label: string
}

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

const StyledFormCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4.25),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2]
}))

const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  textTransform: 'uppercase',
  letterSpacing: '0.75px',
  color: theme.palette.text.secondary,
  fontWeight: 700,
  marginBottom: theme.spacing(3)
}))

const StyledPartyLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: theme.palette.text.secondary,
  marginBottom: 2
}))

const emptyLevels: ApprovalLevel[] = [{ id: 1, userType: 'user', selectedUser: '' }]

const Page = () => {
  const router = useRouter()
  const { id } = router.query // present when coming from table row click (edit mode)

  const [editId, setEditId] = useState<string | null>(null)
  const [workflowCode, setWorkflowCode] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')

  const [preferences, setPreferences] = useState<PartyPreferences>({
    approvalFlow: 'sequential'
  })

  const [levels, setLevels] = useState<ApprovalLevel[]>(emptyLevels)

  // ---------- Party search state ----------
  const [partyIdInput, setPartyIdInput] = useState('')
  const [partySearchStatus, setPartySearchStatus] = useState<PartySearchStatus>('idle')
  const [partyInfo, setPartyInfo] = useState<PartyInfo | null>(null)

  useEffect(() => {
    if (!router.isReady) return

    if (typeof id === 'string') {
      const record = dummyWorkflows.find(wf => wf.id === id)

      if (record) {
        setEditId(record.id)
        setWorkflowCode(record.workflowCode)
        setWorkflowDescription(record.workflowDescription)
        setPreferences({ approvalFlow: record.approvalFlow })
        setLevels(record.levels.map(l => ({ ...l })))

        // Edit mode: workflow is already linked to its Party, so the Party
        // card opens directly in "found" (locked) state - same as Edit User.
        // No need to search again, and it can't be changed from here.
        setPartyIdInput(record.partyId)
        setPartyInfo({
          partyId: record.partyId,
          partyName: partyService.mockDirectory[record.partyId] ?? record.partyId
        })
        setPartySearchStatus('found')

        return
      }
    }

    setEditId(null)
  }, [router.isReady, id])

  const updatePreference = <K extends keyof PartyPreferences>(key: K, value: PartyPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const handleAddLevel = () => {
    if (levels.length >= MAX_LEVELS) return

    setLevels(prev => [
      ...prev,
      { id: prev.length ? prev[prev.length - 1].id + 1 : 1, userType: 'user', selectedUser: '' }
    ])
  }

  const handleDeleteLevel = (levelId: number) => {
    if (levels.length === 1) return
    setLevels(prev => prev.filter(level => level.id !== levelId))
  }

  // ** User / User Group toggle change
  const handleUserTypeChange = (levelId: number, newType: LevelUserType | null) => {
    if (!newType) return
    setLevels(prev =>
      prev.map(level => (level.id === levelId ? { ...level, userType: newType, selectedUser: '' } : level))
    )
  }

  // ** Dropdown se user select karna
  const handleUserSelect = (levelId: number, value: string) => {
    setLevels(prev => prev.map(level => (level.id === levelId ? { ...level, selectedUser: value } : level)))
  }

  // ---------- Party search handlers ----------
  const handlePartyIdInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPartyIdInput(event.target.value)

    if (partySearchStatus === 'not-found') {
      setPartySearchStatus('idle')
    }
  }

  const handlePartySearch = async () => {
    if (!partyIdInput.trim()) return

    setPartySearchStatus('searching')

    try {
      const result = await partyService.searchById(partyIdInput)

      if (result) {
        setPartyInfo(result)
        setPartySearchStatus('found')
      } else {
        setPartyInfo(null)
        setPartySearchStatus('not-found')
      }
    } catch {
      setPartyInfo(null)
      setPartySearchStatus('error')
    }
  }

  const handleChangeParty = () => {
    if (editId) return // Party ek dafa workflow se link hone ke baad edit mode mein change nahi ho sakti

    setPartyInfo(null)
    setPartyIdInput('')
    setPartySearchStatus('idle')
  }

  // ** Save button - builds the review payload, stores it, then navigates
  // to the review screen (create ya edit dono is se guzrenge)
  const handleSave = () => {
    if (!partyInfo) return

    const reviewPayload = {
      sections: [
        {
          title: 'Party Information',
          fields: [
            { label: 'Party ID', value: partyInfo.partyId },
            { label: 'Party Name', value: partyInfo.partyName }
          ]
        },
        {
          title: 'Workflow Details',
          fields: [
            { label: 'Workflow Code', value: workflowCode },
            { label: 'Workflow Description', value: workflowDescription }
          ]
        },
        {
          title: 'Limits & Roles',
          fields: [{ label: 'Approval Flow', value: approvalFlowLabels[preferences.approvalFlow] }]
        }
      ],
      // Review screen renders these as chips under "Limits & Roles"
      roles: levels
        .filter(level => level.selectedUser)
        .map((level, index) => `Level ${index + 1}: ${userTypeLabels[level.userType]} — ${level.selectedUser}`),
      mode: editId ? 'edit' : 'create',
      userId: editId ?? undefined
    }

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviewPayload))
    }

    router.push(REVIEW_ROUTE)
  }

  // ** Cancel button - form ko reset kar deta hai
  const handleCancel = () => {
    setWorkflowCode('')
    setWorkflowDescription('')
    setPreferences({ approvalFlow: 'sequential' })
    setLevels(emptyLevels)
    setPartyIdInput('')
    setPartyInfo(null)
    setPartySearchStatus('idle')
    router.push('/workflow-management')
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ mb: 4 }}>
          {editId ? `Edit Workflow (${editId})` : 'Workflow Management'}
        </Typography>
      </Grid>

      {/* Party Search / Party Card - same pattern as Add User */}
      <Grid item xs={12}>
        <StyledFormCard>
          <StyledSectionTitle>Party</StyledSectionTitle>

          {!partyInfo ? (
            <>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                Search the Party ID this workflow belongs to. Once found, you'll be able to configure the approval
                workflow below.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <TextField
                  fullWidth
                  label='Party ID'
                  placeholder='e.g. P-1001'
                  value={partyIdInput}
                  onChange={handlePartyIdInputChange}
                  onKeyDown={event => event.key === 'Enter' && handlePartySearch()}
                  error={partySearchStatus === 'not-found' || partySearchStatus === 'error'}
                  helperText={
                    partySearchStatus === 'not-found'
                      ? 'No party found with this ID.'
                      : partySearchStatus === 'error'
                        ? 'Party search failed. Please try again.'
                        : ' '
                  }
                />
                <LoadingButton
                  variant='contained'
                  loading={partySearchStatus === 'searching'}
                  startIcon={<SearchIcon fontSize='small' />}
                  onClick={handlePartySearch}
                >
                  Search Party
                </LoadingButton>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
                p: 2.5,
                borderRadius: 2,
                bgcolor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
                <Avatar sx={{ bgcolor: colors.green, width: 44, height: 44 }}>
                  <ApartmentIcon />
                </Avatar>
                <Box>
                  <StyledPartyLabel>Party ID</StyledPartyLabel>
                  <Typography sx={{ fontWeight: 700 }}>{partyInfo.partyId}</Typography>
                </Box>
                <Divider orientation='vertical' flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Box>
                  <StyledPartyLabel>Party Name</StyledPartyLabel>
                  <Typography sx={{ fontWeight: 700 }}>{partyInfo.partyName}</Typography>
                </Box>
              </Box>

              {editId ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
                  <LockIcon fontSize='small' />
                  <Typography variant='caption' sx={{ fontWeight: 600 }}>
                    Party locked — cannot be changed
                  </Typography>
                </Box>
              ) : (
                <Button
                  size='small'
                  variant='outlined'
                  startIcon={<ChangeCircleIcon fontSize='small' />}
                  onClick={handleChangeParty}
                  sx={{
                    color: colors.green,
                    borderColor: colors.green,
                    '&:hover': { borderColor: colors.greenHover }
                  }}
                >
                  Change Party
                </Button>
              )}
            </Box>
          )}
        </StyledFormCard>
      </Grid>

      {/* Rest of the workflow form opens only after the Party is found */}
      {partyInfo && (
        <Grid item xs={12}>
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
            </Grid>

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
                <IconButton onClick={() => handleDeleteLevel(level.id)} disabled={levels.length === 1} sx={{ mt: 3.5 }}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
            ))}

            <Button variant='outlined' startIcon={<AddIcon />} onClick={handleAddLevel} disabled={levels.length >= MAX_LEVELS}>
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
                {editId ? 'Update' : 'Save'}
              </Button>
            </Box>
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'add-workflow'
}

export default Page