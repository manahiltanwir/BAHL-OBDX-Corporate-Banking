import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const FooterContent = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 2
      }}
    >
      <Typography variant='body2' color='text.secondary'>
        {`BAHL Corporate © ${new Date().getFullYear()} | Powered by BAHL IT Net Banking Team`}
      </Typography>
    </Box>
  )
}

export default FooterContent