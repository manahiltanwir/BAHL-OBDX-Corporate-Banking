import Box from '@mui/material/Box'


const Page = () => {
  return (
    <Box fontWeight={'bold'}>
    <p >View Swift Draft</p>
    </Box>
  )
}

Page.acl = { action: 'itsHaveAccess', subject: 'view-swift-draft' }

export default Page