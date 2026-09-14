import { alpha } from '@mui/material/styles'
import Chip from '@mui/material/Chip'

interface CoverageChipProps {
  enabled: number
  total: number
}

export function CoverageChip({ enabled, total }: CoverageChipProps) {
  if (total === 0) {
    return <Chip size="small" label="No services" sx={{ fontSize: 11, height: 22, color: 'text.disabled' }} variant="outlined" />
  }
  if (enabled === 0) {
    return (
      <Chip
        size="small"
        label="None enabled"
        variant="outlined"
        sx={{ fontSize: 11, height: 22, borderColor: 'divider', color: 'text.secondary' }}
      />
    )
  }
  if (enabled === total) {
    return (
      <Chip
        size="small"
        label="All enabled"
        sx={{
          fontSize: 11,
          height: 22,
          fontWeight: 600,
          bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
          color: 'success.dark',
        }}
      />
    )
  }
  return (
    <Chip
      size="small"
      label={`${enabled}/${total} enabled`}
      sx={{
        fontSize: 11,
        height: 22,
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
        bgcolor: (theme) => alpha(theme.palette.warning.main, 0.14),
        color: 'warning.dark',
      }}
    />
  )
}