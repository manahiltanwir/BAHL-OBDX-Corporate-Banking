import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface ColumnHeaderProps {
  label: string
  count: number
}

export function ColumnHeader({ label, count }: ColumnHeaderProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1.75, pb: 1 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>{label}</Typography>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>{count}</Typography>
    </Box>
  )
}