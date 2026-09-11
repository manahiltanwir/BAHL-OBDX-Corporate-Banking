import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import SaveIcon from '@mui/icons-material/Save'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

import { EnterpriseRoleColumn } from 'src/@core/components/role-transaction-mapping/Enterpriserolecolumn' 
import { RoleColumn } from 'src/@core/components/role-transaction-mapping/Rolecolumn' 
import { TaskServiceColumn } from 'src/@core/components/role-transaction-mapping/Taskservicecolumn' 
import type { EnabledServiceMap } from 'src/@core/components/role-transaction-mapping/Types'
// MOCK DATA — delete this import once the API is wired up (see mockData.ts)
import {
  ENTERPRISE_ROLES,
  ROLES,
  ENTERPRISE_ROLE_ROLES,
  TASKS,
  SERVICES,
  TASK_SERVICES,
  INITIAL_ENABLED,
} from 'src/@core/components/role-transaction-mapping/Mockdata'

const Page = () => {
  const [enterpriseSearch, setEnterpriseSearch] = useState('')
  const [roleSearch, setRoleSearch] = useState('')
  const [taskSearch, setTaskSearch] = useState('')

  const [enterpriseRoleId, setEnterpriseRoleId] = useState<number | null>(1)
  const [roleId, setRoleId] = useState<number | null>(1)
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null)

  const [enabledMap, setEnabledMap] = useState<EnabledServiceMap>(INITIAL_ENABLED)
  const [dirty, setDirty] = useState(false)
  const [toast, setToast] = useState(false)

  // ---- Enterprise Roles ----
  const filteredEnterpriseRoles = useMemo(() => {
    const q = enterpriseSearch.trim().toLowerCase()
    if (!q) return ENTERPRISE_ROLES
    return ENTERPRISE_ROLES.filter((e) => e.name.toLowerCase().includes(q))
  }, [enterpriseSearch])

  const roleCountByEnterpriseRoleId = useMemo(() => {
    const counts: Record<number, number> = {}
    for (const ent of ENTERPRISE_ROLES) counts[ent.id] = (ENTERPRISE_ROLE_ROLES[ent.id] || []).length
    return counts
  }, [])

  const selectedEnterpriseRole = ENTERPRISE_ROLES.find((e) => e.id === enterpriseRoleId) || null

  // ---- Roles ----
  const rolesForEnterpriseRole = useMemo(() => {
    if (!enterpriseRoleId) return []
    const ids = ENTERPRISE_ROLE_ROLES[enterpriseRoleId] || []
    return ROLES.filter((r) => ids.includes(r.id))
  }, [enterpriseRoleId])

  const filteredRoles = useMemo(() => {
    const q = roleSearch.trim().toLowerCase()
    if (!q) return rolesForEnterpriseRole
    return rolesForEnterpriseRole.filter((r) => r.name.toLowerCase().includes(q))
  }, [rolesForEnterpriseRole, roleSearch])

  const selectedRole = rolesForEnterpriseRole.find((r) => r.id === roleId) || null

  useEffect(() => {
    setRoleId(rolesForEnterpriseRole[0]?.id ?? null)
    setExpandedTaskId(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterpriseRoleId])

  useEffect(() => {
    setExpandedTaskId(null)
  }, [roleId])

  // ---- Tasks + Services ----
  const filteredTasks = useMemo(() => {
    const q = taskSearch.trim().toLowerCase()
    if (!q) return TASKS
    return TASKS.filter((t) => t.name.toLowerCase().includes(q))
  }, [taskSearch])

  const enabledForRole = (enterpriseRoleId && roleId && enabledMap[enterpriseRoleId]?.[roleId]) || {}

  const toggleService = (taskId: number, serviceId: number) => {
    if (!enterpriseRoleId || !roleId) return
    setEnabledMap((prev) => {
      const entRoleEntry = prev[enterpriseRoleId] || {}
      const roleEntry = entRoleEntry[roleId] || {}
      const current = roleEntry[taskId] || []
      const next = current.includes(serviceId)
        ? current.filter((s) => s !== serviceId)
        : [...current, serviceId]
      return {
        ...prev,
        [enterpriseRoleId]: { ...entRoleEntry, [roleId]: { ...roleEntry, [taskId]: next } },
      }
    })
    setDirty(true)
  }

  const handleSave = () => {
    // Persist enabledMap[enterpriseRoleId][roleId] to the backend here.
    setDirty(false)
    setToast(true)
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', p: { xs: 2, md: 3 } }}>
      {/* -------------------- Header: title, breadcrumb, save -------------------- */}
      <Paper
        variant="outlined"
        sx={{ borderRadius: 2, px: 2.5, py: 1.75, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}
      >
        <Box>
          <Typography sx={{ fontSize: 17, fontWeight: 700, color: 'text.primary', letterSpacing: '-0.01em' }}>
            Role Transaction Mapping
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
            {selectedEnterpriseRole ? (
              <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>
                {selectedEnterpriseRole.name}
                {selectedRole && (
                  <>
                    <Box component="span" sx={{ mx: 0.75, color: 'text.disabled' }}>
                      /
                    </Box>
                    <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                      {selectedRole.name}
                    </Box>
                  </>
                )}
              </Typography>
            ) : (
              <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>Select a role to configure access</Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {dirty && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <FiberManualRecordIcon sx={{ fontSize: 8, color: 'warning.main' }} />
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Unsaved changes</Typography>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SaveIcon sx={{ fontSize: 16 }} />}
            disabled={!dirty}
            onClick={handleSave}
            sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
          >
            Save changes
          </Button>
        </Box>
      </Paper>

      {/* -------------------- Three-column panel -------------------- */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' } }}>
          <EnterpriseRoleColumn
            enterpriseRoles={filteredEnterpriseRoles}
            roleCountByEnterpriseRoleId={roleCountByEnterpriseRoleId}
            search={enterpriseSearch}
            onSearchChange={setEnterpriseSearch}
            selectedId={enterpriseRoleId}
            onSelect={setEnterpriseRoleId}
          />

          <RoleColumn
            hasEnterpriseRoleSelected={!!selectedEnterpriseRole}
            roles={filteredRoles}
            search={roleSearch}
            onSearchChange={setRoleSearch}
            selectedId={roleId}
            onSelect={setRoleId}
          />

          <TaskServiceColumn
            hasRoleSelected={!!selectedRole}
            tasks={filteredTasks}
            services={SERVICES}
            taskServiceIds={TASK_SERVICES}
            enabledServiceIdsByTask={enabledForRole}
            search={taskSearch}
            onSearchChange={setTaskSearch}
            expandedTaskId={expandedTaskId}
            onToggleExpand={(taskId) => setExpandedTaskId((prev) => (prev === taskId ? null : taskId))}
            onToggleService={toggleService}
          />
        </Box>
      </Paper>

      <Snackbar
        open={toast}
        autoHideDuration={2500}
        onClose={() => setToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ top: { xs: 16, sm: 24 }, right: { xs: 16, sm: 24 }, bottom: 'auto !important', left: 'auto !important' }}
      >
        <Alert variant="filled" onClose={() => setToast(false)} icon={false} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          Changes saved for {selectedRole?.name} · {selectedEnterpriseRole?.name}.
        </Alert>
      </Snackbar>
    </Box>
  )
}

Page.acl = { action: 'itsHaveAccess', subject: 'role-transaction-mapping' }

export default Page