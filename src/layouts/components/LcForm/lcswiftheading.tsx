import Typography from '@mui/material/Typography'

const LCSwiftHeading = ({ code }: { code: string }) => {
  return (
    <Typography
      sx={{
        fontSize: '18px',
        fontWeight: 700,
        color: '#1F2937',
        mt: 4,
        mb: 2
      }}
    >
      {code}
    </Typography>
  )
}

export default LCSwiftHeading