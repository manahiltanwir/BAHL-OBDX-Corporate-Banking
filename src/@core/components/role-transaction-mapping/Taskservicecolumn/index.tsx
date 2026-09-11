import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import CircleIcon from '@mui/icons-material/Circle'
import { ColumnHeader } from '../Columnheader' 
import { ColumnSearch } from '../Columnsearch' 
import { CoverageChip } from '../Coveragechip' 
import type { ServiceDef, TaskDef } from '../Types' 

interface TaskServiceColumnProps {
  hasRoleSelected: boolean
  tasks: TaskDef[]
  services: ServiceDef[]
  taskServiceIds: Record<number, number[]> // taskId -> service ids belonging to that task
  enabledServiceIdsByTask: Record<number, number[]> // taskId -> enabled service ids for the selected role
  search: string
  onSearchChange: (v: string) => void
  expandedTaskId: number | null
  onToggleExpand: (taskId: number) => void
  onToggleService: (taskId: number, serviceId: number) => void
}

export function TaskServiceColumn({
  hasRoleSelected,
  tasks,
  services,
  taskServiceIds,
  enabledServiceIdsByTask,
  search,
  onSearchChange,
  expandedTaskId,
  onToggleExpand,
  onToggleService,
}: TaskServiceColumnProps) {
  return (
    <Box sx={{ flex: 1, width: '100%', minWidth: 0 }}>
      <ColumnHeader label="Tasks & services" count={tasks.length} />
      <Box sx={{ px: 1.5, pb: 1.25 }}>
        <ColumnSearch value={search} onChange={onSearchChange} placeholder="Search" />
      </Box>
      <Divider />

      {!hasRoleSelected ? (
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 13.5, color: 'text.secondary' }}>
            Select an enterprise role and a role to manage its tasks.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ maxHeight: 616, overflowY: 'auto' }}>
          {tasks.map((task, idx) => {
            const serviceIds = taskServiceIds[task.id] || []
            const enabledServiceIds = enabledServiceIdsByTask[task.id] || []
            const isExpanded = expandedTaskId === task.id
            return (
              <Box key={task.id} sx={{ borderTop: idx === 0 ? 0 : 1, borderColor: 'divider' }}>
                <Box
                  onClick={() => onToggleExpand(task.id)}
                  role="button"
                  tabIndex={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5,
                    px: 2,
                    py: 1.25,
                    cursor: 'pointer',
                    bgcolor: isExpanded ? (theme) => alpha(theme.palette.primary.main, 0.04) : 'transparent',
                    '&:hover': { bgcolor: (theme) => alpha(theme.palette.text.primary, 0.03) },
                  }}
                >
                  <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: 'text.primary' }}>{task.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <CoverageChip enabled={enabledServiceIds.length} total={serviceIds.length} />
                    <ExpandMoreRoundedIcon
                      sx={{
                        fontSize: 20,
                        color: 'text.disabled',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 150ms ease',
                      }}
                    />
                  </Box>
                </Box>

                {isExpanded && (
                  <Box sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
                    {serviceIds.length === 0 ? (
                      <Typography sx={{ fontSize: 12.5, color: 'text.secondary', px: 2, py: 1.5 }}>
                        No services defined for this task.
                      </Typography>
                    ) : (
                      serviceIds.map((serviceId, sIdx) => {
                        const service = services.find((s) => s.id === serviceId)
                        if (!service) return null
                        const active = enabledServiceIds.includes(serviceId)
                        return (
                          <Box
                            key={serviceId}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              pl: 4,
                              pr: 2,
                              py: 0.85,
                              bgcolor: sIdx % 2 === 1 ? (theme) => alpha(theme.palette.text.primary, 0.015) : 'transparent',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                              <CircleIcon sx={{ fontSize: 7, color: active ? 'success.main' : 'divider' }} />
                              <Typography sx={{ fontSize: 13, color: active ? 'text.primary' : 'text.secondary' }}>
                                {service.name}
                              </Typography>
                            </Box>
                            <Switch size="small" checked={active} onChange={() => onToggleService(task.id, serviceId)} color="primary" />
                          </Box>
                        )
                      })
                    )}
                  </Box>
                )}
              </Box>
            )
          })}
          {tasks.length === 0 && (
            <Typography sx={{ fontSize: 12.5, color: 'text.secondary', textAlign: 'center', py: 3 }}>
              No task found.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  )
}