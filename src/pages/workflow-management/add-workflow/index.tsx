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
  Tooltip,
  Typography
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import ApartmentIcon from '@mui/icons-material/Apartment'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import LockIcon from '@mui/icons-material/Lock'
import LoadingButton from '@mui/lab/LoadingButton'
import { dummyAccountUsers, ApprovalLevel, ApprovalFlow, LevelUserType } from 'src/@core/data/Dummyworkflows'
import { useAuth } from 'src/hooks/useAuth'
import { useWorkflowPartySearch, useWorkflowById } from 'src/@core/hooks/apps/useWorkFlowManagement'

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
  const { id } = router.query 
  const auth = useAuth()
  const isEditRoute = typeof id === 'string'

  const [editId, setEditId] = useState<string | null>(null)
  const [workflowCode, setWorkflowCode] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')

  const [preferences, setPreferences] = useState<PartyPreferences>({
    approvalFlow: 'sequential'
  })

  const [levels, setLevels] = useState<ApprovalLevel[]>(emptyLevels)
  const [originalLevelIds, setOriginalLevelIds] = useState<number[]>([])
  const [partyIdInput, setPartyIdInput] = useState('CN421017654123')
  const { partyInfo, userOptions, status: partySearchStatus, searchParty, resetPartySearch } = useWorkflowPartySearch()
  const { workflow: fetchedWorkflow, status: workflowFetchStatus, fetchWorkflow, resetWorkflow } = useWorkflowById()

  const displayedPartyInfo = partyInfo
  const displayedStatus = partySearchStatus

  useEffect(() => {
    if (!router.isReady) return

    if (isEditRoute) {
      fetchWorkflow(id as string)
    } else {
      setEditId(null)
      setOriginalLevelIds([])
      resetWorkflow()
    }
  }, [router.isReady, id])

  useEffect(() => {
    if (!fetchedWorkflow || !isEditRoute) return
    if (String(fetchedWorkflow.id) !== id) return 

    setEditId(String(fetchedWorkflow.id))
    setWorkflowCode(fetchedWorkflow.workflowCode)
    setWorkflowDescription(fetchedWorkflow.description)

    const isParallel = fetchedWorkflow.steps.length === 1 && fetchedWorkflow.steps[0]?.routingType === 'PARALLEL'
    setPreferences({ approvalFlow: isParallel ? 'parallel' : 'sequential' })

    const rebuiltLevels: ApprovalLevel[] = isParallel
      ? fetchedWorkflow.steps[0].approvers.map((approver, index) => ({
          id: index + 1,
          userType: 'user' as LevelUserType,
          selectedUser: approver.approverTargetId
        }))
      : [...fetchedWorkflow.steps]
          .sort((a, b) => a.sequenceNo - b.sequenceNo)
          .map((step, index) => ({
            id: index + 1,
            userType: 'user' as LevelUserType,
            selectedUser: step.approvers[0]?.approverTargetId ?? ''
          }))

    const finalLevels = rebuiltLevels.length ? rebuiltLevels : emptyLevels
    setLevels(finalLevels)
    setOriginalLevelIds(finalLevels.map(l => l.id))
    setPartyIdInput(fetchedWorkflow.partyId)
    searchParty(fetchedWorkflow.partyId)
  }, [fetchedWorkflow])

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
    if (isEditRoute && originalLevelIds.includes(levelId)) return 
    setLevels(prev => prev.filter(level => level.id !== levelId))
  }

  const handleUserTypeChange = (levelId: number, newType: LevelUserType | null) => {
    if (!newType) return
    setLevels(prev =>
      prev.map(level => (level.id === levelId ? { ...level, userType: newType, selectedUser: '' } : level))
    )
  }

  const handleUserSelect = (levelId: number, value: string) => {
    setLevels(prev => prev.map(level => (level.id === levelId ? { ...level, selectedUser: value } : level)))
  }

  const handlePartyIdInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPartyIdInput(event.target.value)
  }

  const handlePartySearch = async () => {
    if (!partyIdInput.trim()) return
    await searchParty(partyIdInput)
  }

  const handleChangeParty = () => {
    if (isEditRoute) return

    setPartyIdInput('')
    resetPartySearch()
    setLevels(emptyLevels) 
  }

  const buildWorkflowPayload = () => {
    if (!displayedPartyInfo) return null

    const selectedLevels = levels.filter(level => level.selectedUser)

    const steps =
      preferences.approvalFlow === 'parallel'
        ? [
            {
              sequenceNo: 1,
              routingType: 'PARALLEL',
              approvers: selectedLevels.map(level => ({
                approvalType: 'USER',
                approverTargetId: level.selectedUser
              }))
            }
          ]
        : selectedLevels.map((level, index) => ({
            sequenceNo: index + 1,
            routingType: 'SERIAL',
            approvers: [
              {
                approvalType: 'USER',
                approverTargetId: level.selectedUser
              }
            ]
          }))

    return {
      workflowCode,
      description: workflowDescription,
      partyId: displayedPartyInfo.partyId,
      status: 'A',
      createdBy: auth?.user?.username ?? auth?.user?.userId ?? '', 
      steps
    }
  }

  const handleSave = () => {
    if (!displayedPartyInfo) return

    const workflowPayload = buildWorkflowPayload()

    const reviewPayload = {
      sections: [
        {
          title: 'Party Information',
          fields: [
            { label: 'Party ID', value: displayedPartyInfo.partyId },
            { label: 'Party Name', value: displayedPartyInfo.partyName }
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

      roles: levels
        .filter(level => level.selectedUser)
        .map((level, index) => {
          const selectedOption = userOptions.find(option => option.id === level.selectedUser)
          const displayValue = selectedOption ? selectedOption.label : level.selectedUser

          return `Level ${index + 1}: ${userTypeLabels[level.userType]} — ${displayValue}`
        }),
      mode: editId ? 'edit' : 'create',
      userId: editId ?? undefined,
      apiPayload: workflowPayload 
    }

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviewPayload))
    }

    router.push(REVIEW_ROUTE)
  }

  const handleCancel = () => {
    setWorkflowCode('')
    setWorkflowDescription('')
    setPreferences({ approvalFlow: 'sequential' })
    setLevels(emptyLevels)
    setOriginalLevelIds([])
    setPartyIdInput('')
    resetPartySearch()
    router.push('/workflow-management')
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ mb: 4 }}>
          {isEditRoute ? `Edit Workflow${editId ? ` (${editId})` : ''}` : 'Workflow Management'}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <StyledFormCard>
          <StyledSectionTitle>Party</StyledSectionTitle>

          {isEditRoute && !displayedPartyInfo ? (
            <Typography variant='body2' color='text.secondary'>
              {workflowFetchStatus === 'error' ? 'Failed to load this workflow. Please go back and try again.' : 'Loading workflow…'}
            </Typography>
          ) : !displayedPartyInfo ? (
            <>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                Search the Party ID this workflow belongs to. Once found, you'll be able to configure the approval
                workflow below.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <TextField
                  fullWidth
                  label='Party ID'
                  placeholder='e.g. 6666669'
                  value={partyIdInput}
                  onChange={handlePartyIdInputChange}
                  onKeyDown={event => event.key === 'Enter' && handlePartySearch()}
                  error={displayedStatus === 'not-found' || displayedStatus === 'error'}
                  helperText={
                    displayedStatus === 'not-found'
                      ? 'No users found for this Party ID.'
                      : displayedStatus === 'error'
                        ? 'Party search failed. Please try again.'
                        : ' '
                  }
                />
                <LoadingButton
                  variant='contained'
                  loading={displayedStatus === 'searching'}
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
                  <Typography sx={{ fontWeight: 700 }}>{displayedPartyInfo.partyId}</Typography>
                </Box>
                <Divider orientation='vertical' flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Box>
                  <StyledPartyLabel>Party Name</StyledPartyLabel>
                  <Typography sx={{ fontWeight: 700 }}>{displayedPartyInfo.partyName}</Typography>
                </Box>
              </Box>

              {isEditRoute ? (
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

      {displayedPartyInfo && (
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
                  { value: 'parallel', label: 'Parallel' }
                ]}
                value={preferences.approvalFlow}
                onChange={v => updatePreference('approvalFlow', v as PartyPreferences['approvalFlow'])}
              />
            </StyledPreferenceRow>

            <Typography variant='subtitle1' sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
              Approval Details
            </Typography>

            {levels.map((level, index) => {
              const usedUserIds = levels
                .filter(l => l.id !== level.id && l.userType === 'user' && l.selectedUser)
                .map(l => l.selectedUser)

              return (
                <Box
                  key={level.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 3,
                    mb: 4,
                    pb: 4,
                    borderBottom: theme =>
                      index !== levels.length - 1 ? `1px solid ${theme.palette.divider}` : 'none'
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
                        <ToggleButton value='userGroup' disabled>
                          User Group
                        </ToggleButton>
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
                        {(level.userType === 'user'
                          ? userOptions
                              .filter(option => !usedUserIds.includes(option.id))
                              .map(option => ({ id: option.id, label: option.label }))
                          : dummyAccountUsers
                        ).map(option => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  </Box>
                  <Tooltip
                    title={
                      isEditRoute && originalLevelIds.includes(level.id)
                        ? 'Existing approval levels cannot be removed'
                        : ''
                    }
                  >
                    <span>
                      <IconButton
                        onClick={() => handleDeleteLevel(level.id)}
                        disabled={levels.length === 1 || (isEditRoute && originalLevelIds.includes(level.id))}
                        sx={{ mt: 3.5 }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              )
            })}

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
                {isEditRoute ? 'Update' : 'Save'}
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