import React from 'react'
import { Box, Grid } from '@mui/material'
import { AdminUserWidget, BackOfficeUserWidget, PartyCorporateWidget, StyledSectionSubtitle, StyledSectionTitle } from 'src/@core/components/apps/dashboard/styled-components'
import { useAuth } from 'src/hooks/useAuth'


const Page = () => {

  const { user } = useAuth()

  console.clear()
  console.log(user.userProfile.authorizedUIComponents);

  return (
    <React.Fragment>
      <Grid container spacing={6} className='match-height'>
        {
          user?.userProfile?.authorizedUIComponents?.length && user?.userProfile?.authorizedUIComponents?.map((ele: any) => {
            if (ele.component === 'party-maintenance') {
              return (
                <Grid item xs={12} md={6}>
                  <PartyCorporateWidget />
                </Grid>
              )
            }
          })
        }

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

