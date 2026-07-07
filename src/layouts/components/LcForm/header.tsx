import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const Header = () => {
  return (
    <Box
  sx={{
    height: {
      xs: 40,
      md: 48
    },
    width: '100%',
    bgcolor: '#008E5A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: {
      xs: 2,
      md: 3
    },
    color: '#fff'
  }}
>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color:'white',
          fontSize: {
            xs: '16px',
            md: '18px'
          }
        }}
      >
        Initiate Letter of Credit
      </Typography>

      <Box />
    </Box>
  )
}

export default Header