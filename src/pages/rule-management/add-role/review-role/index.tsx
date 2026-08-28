import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { styled } from '@mui/material/styles'
import { Box, Button, Card, Chip, Grid, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import LoadingButton from '@mui/lab/LoadingButton'
import { RuleReviewPayload } from '..'
import { AppDispatch } from 'src/store'
import { createRuleAction, updateRuleAction } from 'src/store/apps/rule-management'

const RULE_REVIEW_STORAGE_KEY = 'ruleReviewData'

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
  boxShadow: '0 1px 2px rgba(11, 31, 58, 0.04)',
  padding: theme.spacing(4, 4, 3.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2.5, 2.5)
  }
}))

const SectionIndex = styled(Typography)({
  position: 'absolute',
  top: -6,
  right: 20,
  fontFamily: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '4.5rem',
  fontWeight: 700,
  color: 'rgba(11, 31, 58, 0.05)',
  lineHeight: 1,
  userSelect: 'none',
  pointerEvents: 'none'
})

const StyledSectionTitle = styled(Typography)({
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '1.1px',
  fontWeight: 700
})

const FieldValue = styled(Typography)<{ component?: React.ElementType }>(() => ({
  fontWeight: 600,
  wordBreak: 'break-word'
}))

// Single label + value line, laid out like an entry on a statement.
const ReviewField = ({ label, value }: { label: string; value: string }) => {
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
            hasValue && looksNumeric(value) ? '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace' : 'inherit',
          fontSize: hasValue && looksNumeric(value) ? '0.95rem' : '1rem',
          color: '#15804f'
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
  const [data, setData] = useState<RuleReviewPayload | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const raw = window.sessionStorage.getItem(RULE_REVIEW_STORAGE_KEY)

    if (raw) {
      try {
        const parsed = JSON.parse(raw)

        const isValid = parsed && Array.isArray(parsed.sections) && parsed.rawPayload && parsed.apiPayload

        setData(isValid ? parsed : null)
      } catch (e) {
        setData(null)
      }
    }
  }, [])

  const handleCancel = () => {
    if (data?.isEditMode && data.rawPayload.id) {
      router.push(`/rule-management/add-role?id=${data.rawPayload.id}`)
    } else {
      router.push('/rule-management/add-role')
    }
  }

  const handleSubmit = async () => {
    if (!data) return

    setSubmitting(true)

    try {
      const { isEditMode, rawPayload, apiPayload } = data

      const res: any =
        isEditMode && rawPayload.id
          ? await dispatch(updateRuleAction({ id: rawPayload.id, payload: apiPayload }))
          : await dispatch(createRuleAction(apiPayload))

      // ** thunk khud hi error toast kar deta hai — fail hone par isi page pe ruk jayenge
      if (res?.error) return

      window.sessionStorage.removeItem(RULE_REVIEW_STORAGE_KEY)
      router.push('/rule-management')
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
                Fill in the rule details first — they'll appear here for final review before saving.
              </Typography>
              <Button startIcon={<ArrowBackIcon fontSize='small' />} variant='contained' onClick={handleCancel}>
                Go to rule form
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
            Rule Management · Final review
          </Typography>
          <Typography variant='h5' sx={{ fontWeight: 700, mt: 0.5 }}>
            {data.isEditMode ? 'Review changes before updating' : 'Review before creating'}
          </Typography>
        </Grid>

        {/* Sections rendered as numbered ledger entries — same order as the form */}
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

              {section.chips && (
                <Box sx={{ mt: 3.5, pt: 3, borderTop: '1px solid rgba(11, 31, 58, 0.08)' }}>
                  {section.chips.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
                      {section.chips.map(chip => (
                        <Chip
                          key={chip.label}
                          icon={<CheckCircleIcon sx={{ color: '#15804f !important', fontSize: 16 }} />}
                          label={chip.label}
                          size='small'
                          sx={{
                            color: '#15804f',
                            fontWeight: 600,
                            border: 'none',
                            '& .MuiChip-label': { px: 1 }
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Chip label='None selected' size='small' sx={{ fontWeight: 600, border: 'none' }} />
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
              By submitting, you confirm the rule details above are accurate and ready to{' '}
              {data.isEditMode ? 'be updated' : 'go live'}.
            </Typography>

            <Stack direction='row' spacing={1.5} sx={{ display: 'flex', gap: 1.5 }}>
              <LoadingButton variant='outlined' loadingPosition='end' onClick={handleCancel} disabled={submitting}>
                Cancel
              </LoadingButton>

              <LoadingButton variant='contained' loadingPosition='end' loading={submitting} onClick={handleSubmit}>
                {data.isEditMode ? 'Confirm update' : 'Approve & submit'}
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
  subject: 'review-role'
}

export default Page