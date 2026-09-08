import Box from '@mui/material/Box'


const Page = () => {
  return (
    <Box>
    <p>view advice</p>
    </Box>
  )
}

Page.acl = { action: 'itsHaveAccess', subject: 'view-advice' }

export default Page