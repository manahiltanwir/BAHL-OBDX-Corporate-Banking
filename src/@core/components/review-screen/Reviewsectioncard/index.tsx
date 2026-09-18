import React from 'react'
import { Box, Chip, Grid, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { LedgerCard, SectionIndex, StyledSectionTitle }  from '../Styles'
import { ReviewSectionData } from '../Types'
import ReviewField from '../Reviewfield' 

type Props = {
  section: ReviewSectionData
  index: number
}

const ReviewSectionCard = ({ section, index }: Props) => (
  <LedgerCard>
    <SectionIndex>{String(index + 1).padStart(2, '0')}</SectionIndex>

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
                sx={{ color: '#15804f', fontWeight: 600, border: 'none', '& .MuiChip-label': { px: 1 } }}
              />
            ))}
          </Box>
        ) : (
          <Chip label='None selected' size='small' sx={{ fontWeight: 600, border: 'none' }} />
        )}
      </Box>
    )}
  </LedgerCard>
)

export default ReviewSectionCard