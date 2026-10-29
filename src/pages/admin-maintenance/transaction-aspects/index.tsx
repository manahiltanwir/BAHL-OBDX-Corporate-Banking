import Box from '@mui/material/Box'
import SelectEnterpriseRole from 'src/@core/components/apps/transaction-aspects/components/SelectEnterpriseRole'
import { useTransactionAspects } from 'src/@core/hooks/apps/useTransactionAspects'
import { useEffect, useState } from 'react'
import { fetchEnterpriseRolesAction } from 'src/store/apps/role-transaction-mapping'
import { useRoleTransactionComponentMapping } from 'src/@core/hooks/apps/Useroletransactioncomponentmapping'
import TransactionAspectsSelect from 'src/@core/components/apps/transaction-aspects/components/SelectTransactionAspects'
import { ITransactionAspects } from 'src/types/apps/transactionAspects'
import AspectsCard from 'src/@core/components/apps/transaction-aspects/components/AspectCard'
import { useRouter } from 'next/router'
import { Card, Typography } from '@mui/material'

const Page = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const { store } = useTransactionAspects(null)

  const router = useRouter()

  const { store: roleTransactionMappingStore } = useRoleTransactionComponentMapping()

  const [selectedTransaction, setSelectedTransaction] = useState<ITransactionAspects | undefined>()

  const [selectedEnterpriseRole, setSelectedEnterpriseRole] = useState<number | string | undefined>()

  useEffect(() => {
    fetchEnterpriseRolesAction()
  }, [])

  return (
    <>
      <Box>
        <Card sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2, boxShadow: 2 }}>
          <Typography sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>Transaction Aspects</Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2.5 }}>
            Select an Enterprise Role to load its transactions, then configure operational security aspects like 2FA,
            auditing, and alerts.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'flex-start' }}>
            <SelectEnterpriseRole
              execute={false}
              enterpriseRole={roleTransactionMappingStore.enterpriseRoles}
              setEnterpriseRole={e => setSelectedEnterpriseRole(e.id)}
            />
            <TransactionAspectsSelect
              execute={false}
              transactionAspects={store.entities}
              setTransactionAspects={e => setSelectedTransaction(e)}
              selectedEnterpriseRoleId={selectedEnterpriseRole}
            />
          </Box>
        </Card>
      </Box>
      {selectedTransaction && (
        <AspectsCard
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          onBack={() => router.back()}
          selectedTransaction={selectedTransaction}
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
