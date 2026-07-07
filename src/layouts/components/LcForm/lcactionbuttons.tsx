import { Box, Button } from '@mui/material'

interface Props {
  onNext?: () => void
  onSave?: () => void
  onCancel?: () => void

  nextText?: string
  saveText?: string
  cancelText?: string

  showNext?: boolean
  showSave?: boolean
  showCancel?: boolean
}

const LCActionButtons = ({
  onNext,
  onSave,
  onCancel,
  nextText = 'Next',
  saveText = 'Save As Draft',
  cancelText = 'Cancel',
  showNext = true,
  showSave = true,
  showCancel = true
}: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mt: 3,
        mb: 4,
        flexWrap: 'wrap'
      }}
    >
      {showNext && (
        <Button
          variant="contained"
          onClick={onNext}
          sx={{
            bgcolor: '#008E5A',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#006B42'
            }
          }}
        >
          {nextText}
        </Button>
      )}

      {showSave && (
        <Button
          variant="outlined"
          onClick={onSave}
          sx={{
            color: '#008E5A',
            borderColor: '#008E5A',
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          {saveText}
        </Button>
      )}

      {showCancel && (
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{
            color: '#6B7280',
            borderColor: '#D1D5DB',
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          {cancelText}
        </Button>
      )}
    </Box>
  )
}

export default LCActionButtons