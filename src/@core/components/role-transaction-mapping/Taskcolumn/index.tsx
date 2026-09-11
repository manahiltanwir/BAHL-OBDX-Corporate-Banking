import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { ColumnHeader } from '../Columnheader'
import { ColumnSearch } from '../Columnsearch'
import { CoverageChip } from '../Coveragechip'
import type { TaskApi, TaskCoverage } from 'src/types/apps/roleTransactionMapping'

interface TaskColumnProps {
    tasks: TaskApi[]
    coverageByTaskId: Record<number, TaskCoverage>
    search: string
    onSearchChange: (v: string) => void
    selectedId: number | null
    onSelect: (id: number) => void
    emptyMessage: string
}

// Subtle theme-derived hairline — avoids the harsh black that the
// 'divider' palette token can resolve to in some themes
const hairline = { borderColor: (theme: any) => alpha(theme.palette.text.primary, 0.08) }

export function TaskColumn({
    tasks,
    coverageByTaskId,
    search,
    onSearchChange,
    selectedId,
    onSelect,
    emptyMessage
}: TaskColumnProps) {
    return (
        <Box
            sx={{
                width: { xs: '100%', lg: 260 },
                flexShrink: 0,
                borderRight: { lg: 1 },
                borderBottom: { xs: 1, lg: 0 },
                ...hairline
            }}
        >
            <ColumnHeader label='Tasks' count={tasks.length} />
            <Box sx={{ px: 1.5, pb: 1.25 }}>
                <ColumnSearch value={search} onChange={onSearchChange} placeholder='Search' />
            </Box>
            <Box sx={{ borderTop: 1, ...hairline }} />
            <List sx={{ py: 0.5, maxHeight: 560, overflowY: 'auto' }}>
                {tasks.map(task => {
                    const isSelected = task.id === selectedId
                    const coverage = coverageByTaskId[task.id] ?? { enabled: 0, total: task.taskServices.length }
                    return (
                        <ListItemButton
                            key={task.id}
                            selected={isSelected}
                            onClick={() => onSelect(task.id)}
                            sx={{
                                pl: 2,
                                py: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: 0.5,
                                borderLeft: '3px solid transparent',
                                '&.Mui-selected': {
                                    bgcolor: theme => alpha(theme.palette.primary.main, 0.07),
                                    borderLeft: theme => `3px solid ${theme.palette.primary.main}`
                                },
                                '&.Mui-selected:hover': { bgcolor: theme => alpha(theme.palette.primary.main, 0.1) }
                            }}
                        >
                            <ListItemText
                                sx={{ m: 0 }}
                                primary={
                                    <Typography
                                        sx={{
                                            fontSize: 13.5,
                                            fontWeight: isSelected ? 600 : 500,
                                            color: isSelected ? 'primary.main' : 'text.primary'
                                        }}
                                    >
                                        {task.taskName}
                                    </Typography>
                                }
                                secondary={<Typography sx={{ fontSize: 11, color: 'text.disabled' }}>{task.taskCode}</Typography>}
                            />
                            <CoverageChip enabled={coverage.enabled} total={coverage.total} />
                        </ListItemButton>
                    )
                })}
                {tasks.length === 0 && (
                    <Typography sx={{ fontSize: 12.5, color: 'text.secondary', textAlign: 'center', py: 3 }}>
                        {emptyMessage}
                    </Typography>
                )}
            </List>
        </Box>
    )
}