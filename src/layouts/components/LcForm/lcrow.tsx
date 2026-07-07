import Box from '@mui/material/Box'
import { ReactNode } from 'react'

const LCRow = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'nowrap',
        width: {
          xs: '100%',
          md: 430
        },
        mb: 3
      }}
    >
      {children}
    </Box>
  )
}

export const LCRowItem = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0
      }}
    >
      {children}
    </Box>
  )
}

export default LCRow