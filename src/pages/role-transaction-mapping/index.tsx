// import Box from '@mui/material/Box'
// import Card from '@mui/material/Card'
// import Paper from '@mui/material/Paper'
// import Typography from '@mui/material/Typography'
// import { alpha } from '@mui/material/styles'

// import { EnterpriseRoleColumn } from 'src/@core/components/role-transaction-mapping/Enterpriserolecolumn'
// import { RoleColumn } from 'src/@core/components/role-transaction-mapping/Rolecolumn'
// import { TaskColumn } from 'src/@core/components/role-transaction-mapping/Taskcolumn'
// import { ServiceColumn } from 'src/@core/components/role-transaction-mapping/Servicecolumn'
// import { CreateRoleModal } from 'src/@core/components/role-transaction-mapping/Createrolemodal'
// import { useRoleTransactionMapping } from 'src/@core/hooks/apps/Useroletransactionmapping'
// import { useAuth } from 'src/hooks/useAuth'

// // Subtle theme-derived hairline — avoids the harsh black that the
// // 'divider' palette token can resolve to in some themes
// const hairline = { borderColor: (theme: any) => alpha(theme.palette.text.primary, 0.08) }

// const Page = () => {
//   const { user } = useAuth()
//   const currentUsername = user?.username

//   const {
//     store,
//     enterpriseSearch,
//     setEnterpriseSearch,
//     roleSearch,
//     setRoleSearch,
//     taskSearch,
//     setTaskSearch,
//     serviceSearch,
//     setServiceSearch,

//     filteredEnterpriseRoles,
//     filteredRoles,
//     filteredTasks,
//     servicesForSelectedTask,
//     coverageByTaskId,

//     selectedEnterpriseRoleId,
//     selectedRoleId,
//     selectedTaskId,
//     selectEnterpriseRole,
//     selectRole,
//     selectTask,

//     isCreateRoleOpen,
//     isCreatingRole,
//     openCreateRole,
//     closeCreateRole,
//     submitCreateRole,

//     pendingChanges,
//     hasPendingChanges,
//     isSavingMapping,
//     toggleService,
//     toggleAllForTask,
//     saveMapping,
//     discardChanges
//   } = useRoleTransactionMapping()

//   const selectedEnterpriseRole = store.enterpriseRoles.find(role => role.id === selectedEnterpriseRoleId)
//   const selectedRole = selectedEnterpriseRoleId
//     ? (store.rolesByEnterpriseRoleId[selectedEnterpriseRoleId] ?? []).find(role => role.id === selectedRoleId)
//     : undefined
//   const selectedTask = selectedTaskId ? store.tasks.find(task => task.id === selectedTaskId) : undefined

//   return (
//     <Box sx={{ pb: 6 }}>
//       {/* -------------------- Header: title, stepper, breadcrumb -------------------- */}
//       <Card sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2, boxShadow: 2 }}>
//         <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>Role Transaction Mapping</Typography>
//         <Typography variant='body2' color='text.secondary' sx={{ mb: selectedEnterpriseRole ? 2 : 0 }}>
//           Pick an enterprise role, then a role, then a task — enable or disable the services that role can access.
//         </Typography>

//         {selectedEnterpriseRole && (
//           <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5, pt: 1, borderTop: 1, ...hairline }}>
//             <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{selectedEnterpriseRole.enterpriseRole}</Typography>
//             {selectedRole && (
//               <>
//                 <Typography sx={{ fontSize: 12.5, color: 'text.disabled' }}>/</Typography>
//                 <Typography sx={{ fontSize: 12.5, color: selectedTask ? 'text.secondary' : 'primary.main', fontWeight: selectedTask ? 400 : 600 }}>
//                   {selectedRole.roleName}
//                 </Typography>
//               </>
//             )}
//             {selectedTask && (
//               <>
//                 <Typography sx={{ fontSize: 12.5, color: 'text.disabled' }}>/</Typography>
//                 <Typography sx={{ fontSize: 12.5, color: 'primary.main', fontWeight: 600 }}>{selectedTask.taskName}</Typography>
//               </>
//             )}
//           </Box>
//         )}
//       </Card>

//       {/* -------------------- Four-column panel -------------------- */}
//       <Paper variant='outlined' sx={{ borderRadius: 2, overflow: 'hidden', ...hairline }}>
//         <Box sx={{ display: 'flex', flexWrap: { xs: 'wrap', lg: 'nowrap' } }}>
//           <EnterpriseRoleColumn
//             enterpriseRoles={filteredEnterpriseRoles}
//             search={enterpriseSearch}
//             onSearchChange={setEnterpriseSearch}
//             selectedId={selectedEnterpriseRoleId}
//             onSelect={selectEnterpriseRole}
//           />

//           <RoleColumn
//             roles={filteredRoles}
//             search={roleSearch}
//             onSearchChange={setRoleSearch}
//             selectedId={selectedRoleId}
//             onSelect={selectRole}
//             onAddRole={openCreateRole}
//             addDisabled={!selectedEnterpriseRoleId}
//           />

//           <TaskColumn
//             tasks={filteredTasks}
//             coverageByTaskId={coverageByTaskId}
//             search={taskSearch}
//             onSearchChange={setTaskSearch}
//             selectedId={selectedTaskId}
//             onSelect={selectTask}
//             emptyMessage={selectedRoleId ? 'No tasks found.' : 'Select a role to see its tasks.'}
//           />

//           <ServiceColumn
//             services={servicesForSelectedTask}
//             pendingChanges={pendingChanges}
//             search={serviceSearch}
//             onSearchChange={setServiceSearch}
//             onToggle={toggleService}
//             onToggleAll={toggleAllForTask}
//             hasPendingChanges={hasPendingChanges}
//             isSaving={isSavingMapping}
//             onSave={() => saveMapping(currentUsername)}
//             onDiscard={discardChanges}
//             emptyMessage={selectedTaskId ? 'No services found.' : 'Select a task to see its services.'}
//           />
//         </Box>
//       </Paper>

//       <CreateRoleModal
//         open={isCreateRoleOpen}
//         enterpriseRoleName={selectedEnterpriseRole?.enterpriseRole ?? ''}
//         isSubmitting={isCreatingRole}
//         onClose={closeCreateRole}
//         onSubmit={roleName => submitCreateRole(roleName, currentUsername)}
//       />
//     </Box>
//   )
// }

// Page.acl = {
//   action: 'itsHaveAccess',
//   subject: 'role-transaction-mapping'
// }

// export default Page

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

import { RoleSelectionBar } from 'src/@core/components/role-transaction-mapping/Roleselectionbar'
import { TaskServiceChecklist } from 'src/@core/components/role-transaction-mapping/Taskservicechecklist'
import { CreateRoleModal } from 'src/@core/components/role-transaction-mapping/Createrolemodal'
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
    discardChanges
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
    </Box>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'role-transaction-mapping'
}

export default Page