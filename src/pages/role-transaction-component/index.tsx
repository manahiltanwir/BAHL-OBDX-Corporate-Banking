import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { RoleSelectionBar } from 'src/@core/components/role-transaction-mapping/Roleselectionbar'
import { ComponentTreeChecklist } from 'src/@core/components/role-transaction-mapping/Componenttreechecklist'
import { CreateRoleModal } from 'src/@core/components/role-transaction-mapping/Createrolemodal'
import { useRoleTransactionComponentMapping } from 'src/@core/hooks/apps/Useroletransactioncomponentmapping'
import { useAuth } from 'src/hooks/useAuth'

const Page = () => {
  const { user } = useAuth()
  const currentUsername = user?.username

  const {
    store,
    enterpriseSearch,
    setEnterpriseSearch,
    roleSearch,
    setRoleSearch,
    componentSearch,
    setComponentSearch,

    filteredEnterpriseRoles,
    filteredRoles,
    filteredTree,

    selectedEnterpriseRoleId,
    selectedRoleId,
    selectEnterpriseRole,
    selectRole,

    isCreateRoleOpen,
    isCreatingRole,
    openCreateRole,
    closeCreateRole,
    submitCreateRole,

    getNodeState,
    toggleNode,
    hasPendingChanges,
    isSavingMapping,
    saveMapping,
    discardChanges
  } = useRoleTransactionComponentMapping()

  const selectedEnterpriseRole = store.enterpriseRoles.find(role => role.id === selectedEnterpriseRoleId)
  const selectedRole = selectedEnterpriseRoleId
    ? (store.rolesByEnterpriseRoleId[selectedEnterpriseRoleId] ?? []).find(role => role.id === selectedRoleId)
    : undefined

  return (
    <Box sx={{ pb: 6 }}>
      <Card sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <Typography sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>Role Component Mapping</Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2.5 }}>
          Pick an enterprise role and a role, then tick the components that role can access.
        </Typography>

        <RoleSelectionBar
          enterpriseRoles={filteredEnterpriseRoles}
          selectedEnterpriseRole={selectedEnterpriseRole}
          enterpriseSearch={enterpriseSearch}
          onEnterpriseSearchChange={setEnterpriseSearch}
          onSelectEnterpriseRole={selectEnterpriseRole}
          roles={filteredRoles}
          selectedRole={selectedRole}
          roleSearch={roleSearch}
          onRoleSearchChange={setRoleSearch}
          onSelectRole={selectRole}
          onAddRole={openCreateRole}
        />
      </Card>

      {selectedRoleId && (
        <Card sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 2 }}>
          <Typography sx={{ fontWeight: 700, mb: 2 }}>
            Components for <Box component='span' sx={{ color: 'primary.main' }}>{selectedRole?.roleName}</Box>
          </Typography>

          <ComponentTreeChecklist
            nodes={filteredTree}
            search={componentSearch}
            onSearchChange={setComponentSearch}
            getNodeState={getNodeState}
            onToggle={toggleNode}
            hasPendingChanges={hasPendingChanges}
            isSaving={isSavingMapping}
            onSave={() => saveMapping(currentUsername as string)}
            onDiscard={discardChanges}
          />
        </Card>
      )}

      <CreateRoleModal
        open={isCreateRoleOpen}
        enterpriseRoleName={selectedEnterpriseRole?.enterpriseRole ?? ''}
        isSubmitting={isCreatingRole}
        onClose={closeCreateRole}
        onSubmit={roleName => submitCreateRole(roleName, currentUsername as string)}
      />
    </Box>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'role-transaction-component'
}

export default Page