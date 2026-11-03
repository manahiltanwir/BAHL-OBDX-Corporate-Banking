import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

import { RoleSelectionBar } from 'src/@core/components/role-transaction-mapping/Roleselectionbar'
import { TaskServiceChecklist } from 'src/@core/components/role-transaction-mapping/Taskservicechecklist'
import { CreateRoleModal } from 'src/@core/components/role-transaction-mapping/Createrolemodal'
import ApiResponseDialog from 'src/@core/components/ApiResponseDialog'
import { useRoleTransactionMapping } from 'src/@core/hooks/apps/Useroletransactionmapping'
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
    taskSearch,
    setTaskSearch,
    serviceSearch,
    setServiceSearch,

    filteredEnterpriseRoles,
    filteredRoles,
    filteredTasks,
    servicesForSelectedTask,
    coverageByTaskId,

    selectedEnterpriseRoleId,
    selectedRoleId,
    selectedTaskId,
    selectEnterpriseRole,
    selectRole,
    selectTask,

    isCreateRoleOpen,
    isCreatingRole,
    openCreateRole,
    closeCreateRole,
    submitCreateRole,

    pendingChanges,
    hasPendingChanges,
    isSavingMapping,
    toggleService,
    toggleAllForTask,
    saveMapping,
    discardChanges,

    responseInfo,
    handleCloseResponse
  } = useRoleTransactionMapping()

  const selectedEnterpriseRole = store.enterpriseRoles.find(role => role.id === selectedEnterpriseRoleId)
  const selectedRole = selectedEnterpriseRoleId
    ? (store.rolesByEnterpriseRoleId[selectedEnterpriseRoleId] ?? []).find(role => role.id === selectedRoleId)
    : undefined

  return (
    <Box sx={{ pb: 6 }}>
      <Card sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <Typography sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>Role Transaction Mapping</Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2.5 }}>
          Pick an enterprise role and a role, then tick the services each task should have access to.
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
            Tasks for <Box component='span' sx={{ color: 'primary.main' }}>{selectedRole?.roleName}</Box>
          </Typography>

          <TaskServiceChecklist
            tasks={filteredTasks}
            coverageByTaskId={coverageByTaskId}
            search={taskSearch}
            onSearchChange={setTaskSearch}
            selectedTaskId={selectedTaskId}
            onSelectTask={selectTask}
            servicesForSelectedTask={servicesForSelectedTask}
            serviceSearch={serviceSearch}
            onServiceSearchChange={setServiceSearch}
            pendingChanges={pendingChanges}
            onToggleService={toggleService}
            onToggleAll={toggleAllForTask}
            hasPendingChanges={hasPendingChanges}
            isSaving={isSavingMapping}
            onSave={() => saveMapping(currentUsername)}
            onDiscard={discardChanges}
            emptyMessage='No tasks found.'
          />
        </Card>
      )}

      <CreateRoleModal
        open={isCreateRoleOpen}
        enterpriseRoleName={selectedEnterpriseRole?.enterpriseRole ?? ''}
        isSubmitting={isCreatingRole}
        onClose={closeCreateRole}
        onSubmit={roleName => submitCreateRole(roleName, currentUsername)}
      />
      <ApiResponseDialog open={responseInfo !== null} response={responseInfo} onClose={handleCloseResponse} />
    </Box>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'admin-maintenance-role-transaction-mapping-page'
}

export default Page