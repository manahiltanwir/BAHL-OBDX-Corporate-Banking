import React, { useEffect, useMemo, useState } from 'react'
import { useDashboard } from 'src/@core/hooks/apps/useDashboard'
import { Grid } from '@mui/material'
import CasaAccountCarousel from 'src/@core/components/apps/corporate-dashboard/components/CasaAccountCarousel'
import RecentTransactions, { Transaction } from 'src/@core/components/apps/corporate-dashboard/components/RecentTransactions'
import CasaAccountsTable from 'src/@core/components/apps/corporate-dashboard/components/CasaAccountsTable'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import ApprovalRequests from 'src/@core/components/TransactionActivity/ApprovalRequests'
import { useRecentTransactions } from 'src/@core/hooks/apps/useRecentTransactions'

// const myData: Transaction[] = [
//   { name: 'Vendor Payment', amount: 500000, status: 'Success', time: 'Today, 11:42 AM' },
//   { name: 'Salary Transfer', amount: 250000, status: 'Pending', time: 'Today, 9:15 AM' },
//   { name: 'Utility Bill Payment', amount: 75000, status: 'Success', time: 'Yesterday, 6:03 PM' },
//   { name: 'Bulk Payment Processing', amount: 850000, status: 'Success', time: 'Yesterday, 3:45 PM' },
//   { name: 'Vendor Payment', amount: 500000, status: 'Success', time: 'Today, 11:42 AM' },
//   { name: 'Salary Transfer', amount: 250000, status: 'Pending', time: 'Today, 9:15 AM' },
//   { name: 'Utility Bill Payment', amount: 75000, status: 'Success', time: 'Yesterday, 6:03 PM' },
//   { name: 'Bulk Payment Processing', amount: 850000, status: 'Success', time: 'Yesterday, 3:45 PM' },
//   { name: 'Tax Payment', amount: 180000, status: 'Pending', time: 'Monday, 12:10 PM' }
// ]

const Page = () => {
  const { getAll, store } = useDashboard(null)

  const { push } = useRouter()
  const { transactions, isLoading, status, error, fetchRecentTransactions } = useRecentTransactions()

  const { user } = useAuth()
  const userId = user?.userId

  const hasApprovalAccess =
    Array.isArray(user?.userProfile?.authorizedUIComponents) &&
    user.userProfile.authorizedUIComponents.some((ele: any) => ele?.component === 'approval-screen-page')

  useEffect(() => {
    if (userId) getAll(userId)
  }, [userId])

  // User ke accounts (duplicate hata kar). `store` wahi hai jo useDashboard se mil raha hai
const accountOptions = useMemo(() => {
  const seen = new Set<string>()

  return ((store?.entities ?? []) as any[])
    .filter(acc => {
      if (!acc || seen.has(acc.accountNumber)) return false
      seen.add(acc.accountNumber)

      return true
    })
    .map(acc => ({
      value: acc.accountNumber as string,
      label: acc.accountTitle ? `${acc.accountNumber} - ${acc.accountTitle}` : String(acc.accountNumber)
    }))
}, [store?.entities])

const [selectedAccount, setSelectedAccount] = useState('')

// Accounts aate hi pehla account select ho jaye
useEffect(() => {
  if (selectedAccount) fetchRecentTransactions(selectedAccount).catch(() => undefined)
}, [selectedAccount])

  return (
    <React.Fragment>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12}>
          <CasaAccountCarousel
            accounts={store.entities as any}
            btnLabel='View Details'
            onViewDetails={account => {
              try {
                sessionStorage.setItem('selectedAccountNumber', account.accountNumber)
              } catch {}
              push('/Corporate-InnerPages/Account/account-details?view=details')
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <CasaAccountsTable accounts={store.entities as any} />
        </Grid>

        {hasApprovalAccess && (
          <Grid item xs={12}>
            <ApprovalRequests />
          </Grid>
        )}

        <Grid item xs={12}>
          <RecentTransactions
          accounts={accountOptions}
          loading={isLoading}
          selectedAccount={selectedAccount}
          onAccountChange={setSelectedAccount}
          transactions={transactions}
          onViewAll={() => push(`/Corporate-InnerPages/Statement/view-statement`)}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'corporate-dashboard-page'
}

export default Page