import React, { useMemo } from 'react'
import { Grid, Typography } from '@mui/material'
import {
  AdminUserWidget,
  BackOfficeUserWidget,
  PartyCorporateWidget
} from 'src/@core/components/apps/dashboard/styled-components'
import { useAuth } from 'src/hooks/useAuth'

type WidgetKey = 'party' | 'admin' | 'backoffice'

const Page = () => {
  const { user } = useAuth()

  const visible = useMemo<WidgetKey[]>(() => {
    const components: any[] = user?.userProfile?.authorizedUIComponents ?? []
    const has = (name: string) => components.some((ele: any) => ele.component === name)
    const keys: WidgetKey[] = []
    if (has('party-maintenance')) keys.push('party')
    if (has('admin-maintenance')) keys.push('admin')
    if (has('backoffice-maintenance')) keys.push('backoffice')

    return keys
  }, [user])

  const count = visible.length
  const md = count === 1 ? 12 : 6

  const renderWidget = (key: WidgetKey) => {
    switch (key) {
      case 'party':
        return <PartyCorporateWidget cardMd={md} />
      case 'admin':
        return <AdminUserWidget cardMd={md} />
      case 'backoffice':
        return <BackOfficeUserWidget cardMd={md} />
    }
  }

  if (count === 0) {
    return <Typography>No access to any dashboard section.</Typography>
  }

  return (
    <Grid container spacing={6} className='match-height'>
      {visible.map(key => (
        <Grid item key={key} xs={12} md={md}>
          {renderWidget(key)}
        </Grid>
      ))}
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'dashboard-page'
}

export default Page