
import React from 'react'
import { Box, Button } from '@mui/material'

type Props = {
  isEditMode: boolean
  onCancel: () => void
  onSave: () => void
  disabled?: boolean
}

const FormActions = ({
  isEditMode,
  onCancel,
  onSave,
  disabled = false
}: Props) => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3, mt: 8 }}>
    <Button
      variant='outlined'
      color='secondary'
      onClick={onCancel}
    >
      Cancel
    </Button>

    <Button
      variant='contained'
      onClick={onSave}
      disabled={disabled}
    >
      {isEditMode ? 'Update Rule' : 'Save'}
    </Button>
  </Box>
)

export default FormActions
