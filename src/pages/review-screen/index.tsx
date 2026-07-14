import React from 'react'
import { Box, Grid, Typography } from '@mui/material'


const page = () => {
  return (
    <React.Fragment>
     <Typography>
        review sceen
     </Typography>
    </React.Fragment>
  )
}

page.acl = {
  action: 'itsHaveAccess',
  subject: 'review-screen'
}

export default page