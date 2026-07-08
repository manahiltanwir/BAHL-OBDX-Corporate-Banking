import React from 'react'
import { Box, Grid } from '@mui/material'
import { AdminUserWidget, PartyCorporateWidget, StyledSectionSubtitle, StyledSectionTitle } from 'src/@core/components/apps/corporate-dashboard/styled-components'


const dashboard = () => {
  return (
    <React.Fragment>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <StyledSectionTitle variant='h4'>Corporate Banking Maintenance</StyledSectionTitle>
            <StyledSectionSubtitle>
              Manage corporate entities, user permissions, limits, and core system workflows.
            </StyledSectionSubtitle>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <PartyCorporateWidget />
        </Grid>

        <Grid item xs={12} md={6}>
          <AdminUserWidget />
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