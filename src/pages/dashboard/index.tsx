import React from 'react'
import { Box, Grid } from '@mui/material'
import { AdminUserWidget, BackOfficeUserWidget, PartyCorporateWidget, StyledSectionSubtitle, StyledSectionTitle } from 'src/@core/components/apps/dashboard/styled-components'


const Page = () => {
  return (
    <React.Fragment>
      <Grid container spacing={6} className='match-height'>

        <Grid item xs={12} md={6}>
          <PartyCorporateWidget />
        </Grid>

        <Grid item xs={12} md={6}>
          <AdminUserWidget />
        </Grid>
        <Grid item xs={12} md={6}>
          <BackOfficeUserWidget />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'dashboard-page'
}

export default Page

