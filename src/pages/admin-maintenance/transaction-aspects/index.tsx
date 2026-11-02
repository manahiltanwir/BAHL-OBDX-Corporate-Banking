import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import SelectEnterpriseRole from 'src/@core/components/apps/transaction-aspects/components/SelectEnterpriseRole'
import SelectMultipleTransactions from 'src/@core/components/TransactionAspects/Selectmultipletransactions'
import TransactionAspectsPanel, {
  EmptyState
} from 'src/@core/components/TransactionAspects/TransactionAspectsPanel'
import { useRoleTransactionComponentMapping } from 'src/@core/hooks/apps/Useroletransactioncomponentmapping'
import { AppDispatch, RootState } from 'src/store'
import { fetchAllAction } from 'src/store/apps/transaction-aspects'
import { ITransactionAspects } from 'src/types/apps/transactionAspects'

type Id = number | string

const Page = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const store = useSelector((state: RootState) => state.transactionAspects)
  const { store: roleTransactionMappingStore } = useRoleTransactionComponentMapping()

  const [selectedEnterpriseRole, setSelectedEnterpriseRole] = useState<Id | undefined>()
  const [loadedEnterpriseRole, setLoadedEnterpriseRole] = useState<Id | undefined>()
  const [selectedIds, setSelectedIds] = useState<Id[]>([])

  useEffect(() => {
    if (!selectedEnterpriseRole) return undefined

    let isCurrent = true
    setLoadedEnterpriseRole(undefined)

    dispatch(fetchAllAction(selectedEnterpriseRole))
      .unwrap()
      .then(() => {
        if (isCurrent) setLoadedEnterpriseRole(selectedEnterpriseRole)
      })
      .catch(() => {
      })

    return () => {
      isCurrent = false
    }
  }, [selectedEnterpriseRole, dispatch])

  const isLoading =
    Boolean(selectedEnterpriseRole) && loadedEnterpriseRole !== selectedEnterpriseRole && store.status !== 'error'

  const options = (
    selectedEnterpriseRole && loadedEnterpriseRole === selectedEnterpriseRole ? store.entities : []
  ) as ITransactionAspects[]

  const selectedTransactions = options.filter(option => selectedIds.includes(option.taskServiceId))

  const handleRoleChange = (enterpriseRoleId: Id | undefined) => {
    setSelectedEnterpriseRole(enterpriseRoleId)
    setSelectedIds([])
  }

  const transactionsHelperText = !selectedEnterpriseRole
    ? 'Select an enterprise role first'
    : isLoading
    ? 'Loading transactions...'
    : `${options.length} transaction${options.length === 1 ? '' : 's'} available`

  return (
    <>
      <Box>
        <Card sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2, boxShadow: 2 }}>
          <Typography sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>Transaction Aspects</Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
            Select an Enterprise Role, choose one or more of its transactions, then switch operational security aspects
            like 2FA, auditing, and alerts on or off. All changes are saved together.
          </Typography>

          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 500, mb: 1.5 }}>
                Enterprise Role
              </Typography>
              <SelectEnterpriseRole
                execute={false}
                enterpriseRole={roleTransactionMappingStore.enterpriseRoles}
                setEnterpriseRole={e => handleRoleChange(e?.id)}
              />
            </Box>

            <Box>
              <Typography variant='h6' sx={{ fontWeight: 500, mb: 1.5 }}>
                Transactions
              </Typography>
              <SelectMultipleTransactions
                options={options}
                value={selectedTransactions}
                onChange={next => setSelectedIds(next.map(transaction => transaction.taskServiceId))}
                disabled={!selectedEnterpriseRole || isLoading}
                loading={isLoading}
                helperText={transactionsHelperText}
              />
            </Box>
          </Box>
        </Card>
      </Box>

      {!selectedEnterpriseRole ? (
        <EmptyState
          title='No enterprise role selected'
          description='Pick an enterprise role above to load its transactions.'
        />
      ) : (
        <TransactionAspectsPanel
          key={selectedEnterpriseRole}
          transactions={selectedTransactions}
          enterpriseRoleId={selectedEnterpriseRole}
          isLoading={isLoading}
          onBack={() => router.back()}
        />
      )}
    </>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'admin-maintenance-transaction-aspects-page'
}

export default Page
