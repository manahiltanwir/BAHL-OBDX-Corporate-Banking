import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled, alpha } from '@mui/material/styles'
import { Box, Button, Card, Chip, Grid, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import LoadingButton from '@mui/lab/LoadingButton'

// ** Redux
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import {
  createAdminWorkflowAction,
  updateAdminWorkflowAction
} from 'src/store/apps/admin-workflow-management'

const REVIEW_STORAGE_KEY = 'adminWorkflowReviewData'
const LIST_ROUTE = '/admin-maintenance/admin-workflow-management'
const ADD_ROUTE = '/admin-maintenance/admin-workflow-management/admin-add-workflow'

type ReviewFieldData = {
  label: string
  value: string
}

type ReviewSectionData = {
  title: string
  fields: ReviewFieldData[]
}

type ReviewMode = 'create' | 'edit'

type ReviewPayload = {
  sections: ReviewSectionData[]
  roles: string[]
  mode?: ReviewMode
  userId?: string
  apiPayload?: any
}

const looksNumeric = (value: string) => /\d/.test(value) && value.replace(/[^0-9]/g, '').length / value.length > 0.3

const StyledPage = styled(Box)(({ theme }) => ({
  minHeight: '100%',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  }
}))

const LedgerCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 14,
  boxShadow: theme.shadows[1],
  padding: theme.spacing(4, 4, 3.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2.5, 2.5)
  }
}))

const SectionIndex = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: -6,
  right: 20,
  fontFamily: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '4.5rem',
  fontWeight: 700,
  color: alpha(theme.palette.text.primary, 0.05),
  lineHeight: 1,
  userSelect: 'none',
  pointerEvents: 'none'
}))

const StyledSectionTitle = styled(Typography)({
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '1.1px',
  fontWeight: 700
})

const FieldValue = styled(Typography)<{ component?: React.ElementType }>(({ theme }) => ({
  fontWeight: 600,
  wordBreak: 'break-word',
  color: theme.palette.primary.main
}))

const ReviewField = ({ label, value }: ReviewFieldData) => {
  const hasValue = value && value.trim() !== ''

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant='caption' sx={{ display: 'block', mb: 0.5, letterSpacing: '0.2px' }}>
        {label}
      </Typography>
      <FieldValue
        variant='body1'
        sx={{
          fontFamily:
            hasValue && looksNumeric(value)
              ? '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace'
              : 'inherit',
          fontSize: hasValue && looksNumeric(value) ? '0.95rem' : '1rem'
        }}
      >
        {hasValue ? value : '—'}
      </FieldValue>
    </Grid>
  )
}

const Page = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [data, setData] = useState<ReviewPayload | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const raw = window.sessionStorage.getItem(REVIEW_STORAGE_KEY)

    if (raw) {
      try {
        const parsed = JSON.parse(raw)

        const isValid = parsed && Array.isArray(parsed.sections) && Array.isArray(parsed.roles)

        setData(isValid ? parsed : null)
      } catch (e) {
        setData(null)
      }
    }
  }, [])

  const isEditMode = data?.mode === 'edit'

  const handleCancel = () => {
    if (isEditMode && data?.userId) {
      router.push(`${ADD_ROUTE}?id=${data.userId}`)
    } else {
      router.push(ADD_ROUTE)
    }
  }

  const handleSubmit = async () => {
    if (!data || !data.apiPayload) return

    setSubmitting(true)

    try {
      let res: any

      if (isEditMode && data.userId) {
        res = await dispatch(updateAdminWorkflowAction({ id: data.userId, payload: data.apiPayload }))
      } else {
        res = await dispatch(createAdminWorkflowAction(data.apiPayload))
      }

      if (res?.error) return

      window.sessionStorage.removeItem(REVIEW_STORAGE_KEY)
      router.push(LIST_ROUTE)
    } finally {
      setSubmitting(false)
    }
  }

  if (!data) {
    return (
      <StyledPage>
        <Grid container spacing={6} justifyContent='center'>
          <Grid item xs={12} md={6}>
            <LedgerCard sx={{ textAlign: 'center', py: 6 }}>
              <ShieldOutlinedIcon sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>
                Nothing to review yet
              </Typography>
              <Typography variant='body2' sx={{ mb: 3 }}>
                Complete the workflow form first — the details will appear here for final review.
              </Typography>
              <Button
                startIcon={<ArrowBackIcon fontSize='small' />}
                variant='contained'
                onClick={() => router.push(ADD_ROUTE)}
              >
                Go to workflow form
              </Button>
            </LedgerCard>
          </Grid>
        </Grid>
      </StyledPage>
    )
  }

  return (
    <StyledPage>
      <Grid container spacing={4}>
        {/* Header */}
        <Grid item xs={12}>
          <Button
            startIcon={<ArrowBackIcon fontSize='small' />}
            onClick={handleCancel}
            sx={{ pl: 0, mb: 1, '&:hover': { bgcolor: 'transparent' } }}
          >
            Back to form
          </Button>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.1px', textTransform: 'uppercase' }}>
            {isEditMode
              ? `Workflow Update · Final review${data.userId ? ` (${data.userId})` : ''}`
              : 'Workflow · Final review'}
          </Typography>
          <Typography variant='h5' sx={{ fontWeight: 700, mt: 0.5 }}>
            {isEditMode ? 'Review before saving changes' : 'Review before creating workflow'}
          </Typography>
        </Grid>

        {data.sections.map((section, idx) => (
          <Grid item xs={12} key={section.title}>
            <LedgerCard>
              <SectionIndex>{String(idx + 1).padStart(2, '0')}</SectionIndex>

              <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 3 }}>
                <StyledSectionTitle>{section.title}</StyledSectionTitle>
              </Stack>

              <Grid container spacing={3}>
                {section.fields.map(field => (
                  <ReviewField key={field.label} label={field.label} value={field.value} />
                ))}
              </Grid>

              {section.title === 'Limits & Roles' && (
                <Box sx={{ mt: 3.5, pt: 3, borderTop: theme => `1px solid ${theme.palette.divider}` }}>
                  <Typography variant='body2' sx={{ fontWeight: 700, mb: 1.5 }}>
                    Approvers
                  </Typography>

                  {data.roles.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
                      {data.roles.map(roleLabel => (
                        <Chip
                          key={roleLabel}
                          icon={<CheckCircleIcon sx={{ color: 'primary.main !important', fontSize: 16 }} />}
                          label={roleLabel}
                          size='small'
                          sx={{
                            color: 'primary.main',
                            fontWeight: 600,
                            border: 'none',
                            '& .MuiChip-label': { px: 1 }
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Chip label='No approvers selected' size='small' sx={{ fontWeight: 600, border: 'none' }} />
                  )}
                </Box>
              )}
            </LedgerCard>
          </Grid>
        ))}

        {/* Actions */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column-reverse', sm: 'row' },
              alignItems: { sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              pt: 1
            }}
          >
            <Typography variant='caption' sx={{ maxWidth: 420 }}>
              {isEditMode
                ? 'By submitting, you confirm the updated details above are accurate.'
                : 'By submitting, you confirm the workflow details above are accurate.'}
            </Typography>

            <Stack direction='row' spacing={1.5} sx={{ display: 'flex', gap: 1.5 }}>
              <LoadingButton variant='outlined' onClick={handleCancel} disabled={submitting}>
                Cancel
              </LoadingButton>

              <LoadingButton
                variant='contained'
                loadingPosition='end'
                loading={submitting}
                onClick={handleSubmit}
              >
                {isEditMode ? 'Update & submit' : 'Approve & submit'}
              </LoadingButton>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </StyledPage>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'admin-maintenance-review-workflow-page'
}

export default Page