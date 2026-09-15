import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import SaveIcon from '@mui/icons-material/Save'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { ColumnSearch } from '../Columnsearch'
import { CoverageChip } from '../Coveragechip'
import type { MappedServiceItem, TaskApi, TaskCoverage } from 'src/types/apps/roleTransactionMapping'

interface TaskServiceChecklistProps {
    tasks: TaskApi[]
    coverageByTaskId: Record<number, TaskCoverage>
    search: string
    onSearchChange: (v: string) => void
    selectedTaskId: number | null
    onSelectTask: (id: number) => void
    servicesForSelectedTask: MappedServiceItem[]
    serviceSearch: string
    onServiceSearchChange: (v: string) => void
    pendingChanges: Record<number, boolean>
    onToggleService: (taskServiceId: number, currentIsMapped: boolean) => void
    onToggleAll: (checked: boolean) => void
    hasPendingChanges: boolean
    isSaving: boolean
    onSave: () => void
    onDiscard: () => void
    emptyMessage: string
}

// Subtle theme-derived hairline — avoids the harsh black that the
// 'divider' palette token can resolve to in some themes
const hairline = { borderColor: (theme: any) => alpha(theme.palette.text.primary, 0.08) }

export function TaskServiceChecklist({
    tasks,
    coverageByTaskId,
    search,
    onSearchChange,
    selectedTaskId,
    onSelectTask,
    servicesForSelectedTask,
    serviceSearch,
    onServiceSearchChange,
    pendingChanges,
    onToggleService,
    onToggleAll,
    hasPendingChanges,
    isSaving,
    onSave,
    onDiscard,
    emptyMessage
}: TaskServiceChecklistProps) {
    const allChecked =
        servicesForSelectedTask.length > 0 &&
        servicesForSelectedTask.every(service => pendingChanges[service.taskServiceId] ?? service.isMapped)
    const someChecked = servicesForSelectedTask.some(service => pendingChanges[service.taskServiceId] ?? service.isMapped)

    return (
        <Box>
            <Box sx={{ mb: 1.5, maxWidth: 360 }}>
                <ColumnSearch value={search} onChange={onSearchChange} placeholder='Search tasks' />
            </Box>

            {tasks.length === 0 && (
                <Typography sx={{ fontSize: 13, color: 'text.secondary', textAlign: 'center', py: 4 }}>{emptyMessage}</Typography>
            )}

            {tasks.map(task => {
                const coverage = coverageByTaskId[task.id] ?? { enabled: 0, total: task.taskServices.length }
                const isExpanded = selectedTaskId === task.id

                return (
                    <Accordion
                        key={task.id}
                        expanded={isExpanded}
                        onChange={() => onSelectTask(task.id)}
                        disableGutters
                        elevation={0}
                        sx={{ border: 1, borderRadius: 1.5, mb: 1, '&:before': { display: 'none' }, overflow: 'hidden', ...hairline }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 1 }}>
                                <Box>
                                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary' }}>{task.taskName}</Typography>
                                    <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>{task.taskCode}</Typography>
                                </Box>
                                <CoverageChip enabled={coverage.enabled} total={coverage.total} />
                            </Box>
                        </AccordionSummary>

                        <AccordionDetails sx={{ p: 0, borderTop: 1, ...hairline }}>
                            {isExpanded && (
                                <>
                                    <Box sx={{ p: 1.5 }}>
                                        <ColumnSearch value={serviceSearch} onChange={onServiceSearchChange} placeholder='Search services' />
                                    </Box>

                                    {servicesForSelectedTask.length > 0 && (
                                        <>
                                            <Box sx={{ borderTop: 1, ...hairline }} />
                                            <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 0.5 }}>
                                                <Checkbox
                                                    size='small'
                                                    checked={allChecked}
                                                    indeterminate={someChecked && !allChecked}
                                                    onChange={e => onToggleAll(e.target.checked)}
                                                />
                                                <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>Select all</Typography>
                                            </Box>
                                        </>
                                    )}

                                    <Box sx={{ borderTop: 1, ...hairline }} />
                                    <List sx={{ py: 0.5 }}>
                                        {servicesForSelectedTask.map(service => {
                                            const checked = pendingChanges[service.taskServiceId] ?? service.isMapped
                                            return (
                                                <ListItem
                                                    key={service.taskServiceId}
                                                    disablePadding
                                                    sx={{ px: 1.5, py: 0.25 }}
                                                    secondaryAction={
                                                        <Checkbox
                                                            edge='end'
                                                            size='small'
                                                            checked={checked}
                                                            onChange={() => onToggleService(service.taskServiceId, service.isMapped)}
                                                        />
                                                    }
                                                >
                                                    <ListItemText
                                                        primary={
                                                            <Typography sx={{ fontSize: 13.5, fontWeight: 500 }}>{service.operationName}</Typography>
                                                        }
                                                        secondary={
                                                            <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>{service.apiEndpoint}</Typography>
                                                        }
                                                    />
                                                </ListItem>
                                            )
                                        })}
                                        {servicesForSelectedTask.length === 0 && (
                                            <Typography sx={{ fontSize: 12.5, color: 'text.secondary', textAlign: 'center', py: 3 }}>
                                                No services found.
                                            </Typography>
                                        )}
                                    </List>

                                    {hasPendingChanges && (
                                        <>
                                            <Box sx={{ borderTop: 1, ...hairline }} />
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 1.5 }}>
                                                <Button size='small' variant='outlined' color='inherit' onClick={onDiscard} disabled={isSaving}>
                                                    Discard
                                                </Button>
                                                <Button
                                                    size='small'
                                                    variant='contained'
                                                    startIcon={isSaving ? <CircularProgress size={14} color='inherit' /> : <SaveIcon fontSize='small' />}
                                                    onClick={onSave}
                                                    disabled={isSaving}
                                                >
                                                    {isSaving ? 'Saving...' : 'Save Mapping'}
                                                </Button>
                                            </Box>
                                        </>
                                    )}
                                </>
                            )}
                        </AccordionDetails>
                    </Accordion>
                )
            })}
        </Box>
    )
}