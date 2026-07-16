import React from 'react'
import { Box, Grid, Typography } from '@mui/material'


const page = () => {
  return (
    <React.Fragment>
     <Typography>
        add party here 
     </Typography>
    </React.Fragment>
  )
}

page.acl = {
  action: 'itsHaveAccess',
  subject: 'add-party'
}

export default page