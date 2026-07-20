import React from 'react'
import {  Typography, } from '@mui/material'




const Page = () => {

  return (
    <React.Fragment>
      <Typography>
        View LC 
      </Typography>
    </React.Fragment>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'view-lc'
}

export default Page