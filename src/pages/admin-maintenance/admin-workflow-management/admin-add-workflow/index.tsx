import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled, alpha } from '@mui/material/styles'
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
  Tooltip,
  Typography
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'
import { ApprovalLevel, ApprovalFlow, LevelUserType } from 'src/@core/data/Dummyworkflows'
import { useAdminWorkflowById, useAdminWorkflowUsers } from 'src/@core/hooks/apps/useAdminWorkflowManagement'
import { useAuth } from 'src/hooks/useAuth'

const REVIEW_STORAGE_KEY = 'adminWorkflowReviewData'
const REVIEW_ROUTE = '/admin-maintenance/admin-workflow-management/admin-add-workflow/admin-review-workflow'
const LIST_ROUTE = '/admin-maintenance/admin-workflow-management'

const approvalFlowLabels: Record<ApprovalFlow, string> = {
  sequential: 'Sequential',
  parallel: 'Parallel',
  none: 'No Approval'
}

const userTypeLabels: Record<LevelUserType, string> = {
  user: 'User',
  userGroup: 'User Group'
}

interface WorkflowPreferences {
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
  color: active ? theme.palette.primary.contrastText : theme.palette.text.secondary,
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  boxShadow: active ? `0 2px 6px ${alpha(theme.palette.primary.main, 0.35)}` : 'none',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.action.selected,
    color: active ? theme.palette.primary.contrastText : theme.palette.text.primary
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

const emptyLevels: ApprovalLevel[] = [{ id: 1, userType: 'user', selectedUser: '' }]

const Page = () => {
  const router = useRouter()
  const { id } = router.query
  const auth = useAuth()
  const isEditRoute = typeof id === 'string'

  const [editId, setEditId] = useState<string | null>(null)
  const [workflowCode, setWorkflowCode] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')
  const [preferences, setPreferences] = useState<WorkflowPreferences>({ approvalFlow: 'sequential' })
  const [levels, setLevels] = useState<ApprovalLevel[]>(emptyLevels)
  const [originalLevelIds, setOriginalLevelIds] = useState<number[]>([])

  const { workflow: fetchedWorkflow, status: workflowFetchStatus, fetchWorkflow, resetWorkflow } = useAdminWorkflowById()
  const { userOptions, status: usersStatus } = useAdminWorkflowUsers()

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

  console.clear();
  console.log('====================================');
  console.log(fetchedWorkflow,'this is the workflow data');
  console.log('====================================');

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
  }, [fetchedWorkflow])

  const updatePreference = <K extends keyof WorkflowPreferences>(key: K, value: WorkflowPreferences[K]) => {
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

  const selectedLevels = levels.filter(level => level.selectedUser)

  const isFormValid = workflowCode.trim() !== '' && workflowDescription.trim() !== '' && selectedLevels.length > 0

  const buildWorkflowPayload = () => {
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
            approvers: [{ approvalType: 'USER', approverTargetId: level.selectedUser }]
          }))

    return {
      workflowCode: workflowCode.trim(),
      description: workflowDescription.trim(),
      status: 'A',
      createdBy: auth?.user?.userId ?? '',
      steps
    }
  }

  const handleSave = () => {
    if (!isFormValid) return

    const reviewPayload = {
      sections: [
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
      roles: selectedLevels.map((level, index) => {
        const selectedOption = userOptions.find(option => option.id === level.selectedUser)
        const displayValue = selectedOption ? selectedOption.label : level.selectedUser

        return `Level ${index + 1}: ${userTypeLabels[level.userType]} — ${displayValue}`
      }),
      mode: editId ? 'edit' : 'create',
      userId: editId ?? undefined,
      apiPayload: buildWorkflowPayload()
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
    router.push(LIST_ROUTE)
  }

  const isLoadingEdit = isEditRoute && (!editId || usersStatus === 'pending')

  console.log('====================================');
  console.log(workflowFetchStatus+ '------------------');
  console.log('====================================');

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ mb: 4 }}>
          {isEditRoute ? `Edit Workflow${editId ? ` (${editId})` : ''}` : 'Workflow Management'}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ p: 5 }}>
          {isLoadingEdit ? (
            <Typography variant='body2' color='text.secondary'>
              {workflowFetchStatus === 'error'
                ? 'Failed to load this workflow. Please go back and try again.'
                : 'Loading workflow…'}
            </Typography>
          ) : (
            <>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label='Workflow Code'
                    value={workflowCode}
                    onChange={e => setWorkflowCode(e.target.value)}
                    disabled={isEditRoute}
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
                  onChange={v => updatePreference('approvalFlow', v as WorkflowPreferences['approvalFlow'])}
                />
              </StyledPreferenceRow>

              <Typography variant='subtitle1' sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
                Approval Details
              </Typography>

              {levels.map((level, index) => {
                const usedUserIds = levels
                  .filter(l => l.id !== level.id && l.userType === 'user' && l.selectedUser)
                  .map(l => l.selectedUser)

                const isLockedLevel = isEditRoute && originalLevelIds.includes(level.id)

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
                          {userOptions
                            .filter(option => !usedUserIds.includes(option.id))
                            .map(option => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.label}
                              </MenuItem>
                            ))}
                        </TextField>
                      </Box>
                    </Box>
                    <Tooltip title={isLockedLevel ? 'Existing approval levels cannot be removed' : ''}>
                      <span>
                        <IconButton
                          onClick={() => handleDeleteLevel(level.id)}
                          disabled={levels.length === 1 || isLockedLevel}
                          sx={{ mt: 3.5 }}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                )
              })}

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
                <Button variant='contained' onClick={handleSave} disabled={!isFormValid}>
                  {isEditRoute ? 'Update' : 'Save'}
                </Button>
              </Box>
            </>
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'admin-maintenance-add-workflow-page'
}

export default Page