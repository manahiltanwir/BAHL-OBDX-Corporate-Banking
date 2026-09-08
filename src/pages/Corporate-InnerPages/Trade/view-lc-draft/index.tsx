import Box from '@mui/material/Box'


const Page = () => {
  return (
    <Box>
    <p>view LC Draft</p>
    </Box>
  )
}

Page.acl = { action: 'itsHaveAccess', subject: 'view-lc-draft' }

export default Page