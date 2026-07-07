import Box from '@mui/material/Box'
import { ReactNode } from 'react'

const LCFieldWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        width: {
          xs: '100%',
          sm: 420,
          md: 430
        },
        mb: 2
      }}
    >
      {children}
    </Box>
  )
}

export default LCFieldWrapper