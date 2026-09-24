import React from 'react'
import { Box, Button } from '@mui/material'

type Props = {
  isEditMode: boolean
  onCancel: () => void
  onSave: () => void
}

const FormActions = ({ isEditMode, onCancel, onSave }: Props) => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3, mt: 8 }}>
    <Button variant='outlined' color='secondary' onClick={onCancel}>
      Cancel
    </Button>
    <Button variant='contained' onClick={onSave}>
      {isEditMode ? 'Update Rule' : 'Save'}
    </Button>
  </Box>
)

export default FormActions