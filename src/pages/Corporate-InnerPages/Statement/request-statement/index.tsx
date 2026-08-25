import Box, { BoxProps } from '@mui/material/Box'
const Page = () => {
  return (
    <Box className='content-center'>
        <p>Request Statement</p>
    </Box>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'request-statement'
}

export default Page