import React from 'react'
import { Box, Grid } from '@mui/material'
import { AdminUserWidget, BackOfficeUserWidget, PartyCorporateWidget, StyledSectionSubtitle, StyledSectionTitle } from 'src/@core/components/apps/corporate-dashboard/styled-components'


const dashboard = () => {
  return (
    <React.Fragment>
      <Grid container spacing={6} className='match-height'>

        <Grid item xs={12} md={6}>
        
        {/* <Grid item xs={12}> */}
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

dashboard.acl = {
  action: 'itsHaveAccess',
  subject: 'corporate-dashboard-page'
}

export default dashboard