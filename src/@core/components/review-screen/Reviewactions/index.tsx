import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'

type Props = {
  isEditMode: boolean
  submitting: boolean
  disclaimer?: string
  confirmLabel?: string
  updateLabel?: string
  onCancel: () => void
  onSubmit: () => void
}

const ReviewActions = ({
  isEditMode,
  submitting,
  disclaimer,
  confirmLabel = 'Approve & submit',
  updateLabel = 'Confirm update',
  onCancel,
  onSubmit
}: Props) => (
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
      {disclaimer ??
        `By submitting, you confirm the details above are accurate and ready to ${isEditMode ? 'be updated' : 'go live'}.`}
    </Typography>

    <Stack direction='row' spacing={1.5} sx={{ display: 'flex', gap: 1.5 }}>
      <LoadingButton variant='outlined' loadingPosition='end' onClick={onCancel} disabled={submitting}>
        Cancel
      </LoadingButton>

      <LoadingButton variant='contained' loadingPosition='end' loading={submitting} onClick={onSubmit}>
        {isEditMode ? updateLabel : confirmLabel}
      </LoadingButton>
    </Stack>
  </Box>
)

export default ReviewActions