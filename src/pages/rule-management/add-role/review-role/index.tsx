import React from 'react'
import { Button, Grid, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { StyledPage } from 'src/@core/components/review-screen/Styles'
import EmptyReviewState from 'src/@core/components/review-screen/Emptyreviewstate' 
import ReviewSectionCard from 'src/@core/components/review-screen/Reviewsectioncard' 
import ReviewActions from 'src/@core/components/review-screen/Reviewactions' 
import { useRuleReviewData } from 'src/@core/components/review-screen/Userulereviewdata' 

const ReviewPage = () => {
  const { data, submitting, handleCancel, handleSubmit } = useRuleReviewData()

  if (!data) {
    return (
      <EmptyReviewState
        message="Fill in the rule details first — they'll appear here for final review before saving."
        buttonLabel='Go to rule form'
        onBack={handleCancel}
      />
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
            <ReviewSectionCard section={section} index={idx} />
          </Grid>
        ))}

        {/* Actions */}
        <Grid item xs={12}>
          <ReviewActions
            isEditMode={data.isEditMode}
            submitting={submitting}
            disclaimer={`By submitting, you confirm the rule details above are accurate and ready to ${
              data.isEditMode ? 'be updated' : 'go live'
            }.`}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </Grid>
      </Grid>
    </StyledPage>
  )
}

ReviewPage.acl = {
  action: 'itsHaveAccess',
  subject: 'review-role'
}

export default ReviewPage