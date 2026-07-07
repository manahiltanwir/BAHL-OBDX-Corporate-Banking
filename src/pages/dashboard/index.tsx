import React, { useEffect, useState } from 'react'

import CustomChip from 'src/@core/components/mui/chip'
import DashboardTable from 'src/@core/components/apps/dashboard/components/Table'
import TableHeader from 'src/@core/components/apps/dashboard/components/TableHeader'
import ExampleDrawer from 'src/@core/components/apps/dashboard/components/Drawer'
import SelectOne from 'src/@core/components/apps/dashboard/components/SelectOne'
import SelectMany from 'src/@core/components/apps/dashboard/components/SelectMany'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import DeleteAlert from 'src/@core/components/common/deleteAlert'
import { ModalType } from 'src/types'
import { useDashboard } from 'src/@core/hooks/apps/useDashboard'
import MultipleInput from 'src/@core/components/common/MultipleInput'
import { Avatar, Box, Card, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material'
import { ChevronUp, DotsVertical } from 'mdi-material-ui'
import LoadingButton from '@mui/lab/LoadingButton'
import BalanceCard from 'src/@core/components/apps/dashboard/components/BalanceCard'
import DashboardCard from 'src/@core/components/apps/dashboard/components/DashboardCard'

const Page = () => {

  const [fieldArray, setFieldArray] = useState<string[]>([]);

  const { store, getDashboard, deleteDashboard, getAll } = useDashboard(null)

  useEffect(() => {
    // getAll({ query: {} })
  }, [])

  const handleDeleteChannel = () => {
    // serviceId && deleteDashboard(serviceId)
  }

  return (
    <React.Fragment>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12} md={6}>
          <BalanceCard CASAAccountAmount='2,450,000.00' CASAAccountCurrency='PKR' TDAccountAmount='**** 6969' TDAccountCurrency='Account' btnLabel='View Details' label='CORPORATE' title='CASA Account' />
        </Grid>
        <Grid item xs={12} md={6}>
          <BalanceCard CASAAccountAmount='5,000,000.00' CASAAccountCurrency='PKR' TDAccountAmount='14.5%' TDAccountCurrency='Profit Rate:' btnLabel='Certificates' label='FIXED' title='TD Account' />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard image='/images/cards/3d-illustration.png' label='' title='Monthly Spending' />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard image='/images/cards/finance-app-design.png' label='' title='Pending Approval' />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard image='/images/cards/4-square.png' label='' title='Drafts' />
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
