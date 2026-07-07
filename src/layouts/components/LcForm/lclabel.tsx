import Typography from '@mui/material/Typography'
import { ReactNode } from 'react'

const LCLabel = ({ children }: { children: ReactNode }) => {
  return (
    <Typography
      sx={{
        fontSize: '14px',
        fontWeight: 600,
        color: '#1F2937',
        mb: 1
      }}
    >
      {children}
    </Typography>
  )
}

export default LCLabel