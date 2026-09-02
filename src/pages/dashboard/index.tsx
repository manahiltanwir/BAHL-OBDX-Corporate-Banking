import React, { useEffect, useState } from 'react'
import { useDashboard } from 'src/@core/hooks/apps/useDashboard'
import { Grid } from '@mui/material'
import DashboardCard from 'src/@core/components/apps/dashboard/components/DashboardCard'
import CasaAccountCarousel, { CasaAccount } from 'src/@core/components/apps/dashboard/components/CasaAccountCarousel'
import RecentTransactions, { Transaction } from 'src/@core/components/apps/dashboard/components/RecentTransactions'
import CasaAccountsTable from 'src/@core/components/apps/dashboard/components/CasaAccountsTable'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'


// const casaAccounts: CasaAccount[] = [
//   { id: 'CASA-1', label: 'CORPORATE', accountNumber: '0110-2345-6789-01', balance: '2,450,000.00', currency: 'PKR', holderName: 'Ahmed Raza Testing' },
//   { id: 'CASA-2', label: 'CORPORATE', accountNumber: '0110-9988-1122-04', balance: '875,320.50', currency: 'PKR', holderName: 'Fatima Khan Testing' },
//   { id: 'CASA-3', label: 'CORPORATE', accountNumber: '0110-5567-3344-09', balance: '12,980,000.00', currency: 'PKR', holderName: 'Bilal Ahmed Testing' }
// ]
const myData: Transaction[] = [
  { name: 'Vendor Payment', amount: 500000, status: 'Success', time: 'Today, 11:42 AM' },
  { name: 'Salary Transfer', amount: 250000, status: 'Pending', time: 'Today, 9:15 AM' },
  { name: 'Utility Bill Payment', amount: 75000, status: 'Success', time: 'Yesterday, 6:03 PM' },
  { name: 'Bulk Payment Processing', amount: 850000, status: 'Success', time: 'Yesterday, 3:45 PM' },
  { name: 'Tax Payment', amount: 180000, status: 'Pending', time: 'Monday, 12:10 PM' }
]

const Page = () => {

  const { getAll, store } = useDashboard(null)

  const { push } = useRouter()

  const { user:{userId} } = useAuth()

  console.log(store.entities);
  

  // const { user:{ userProfile:{ cnic } } } = useAuth()  

  useEffect(() => {
    getAll(userId)
  }, [])

  const handleDeleteChannel = () => {
    // serviceId && deleteDashboard(serviceId)
  }

  return (
    <React.Fragment>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12}>
          <CasaAccountCarousel 
          accounts={store.entities as any} 
          btnLabel='View Details'
          onViewDetails={(account) => push(
        `/Corporate-InnerPages/Statement/view-statement?accountNumber=${encodeURIComponent(account.accountNumber)}`)}
          />
        </Grid>
        <Grid item xs={12}>
  <CasaAccountsTable accounts={store.entities as any} />
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
        <Grid item xs={12}>
          <RecentTransactions transactions={myData}
          />
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