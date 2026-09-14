import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import SaveIcon from '@mui/icons-material/Save'
import { ColumnHeader } from '../Columnheader'
import { ColumnSearch } from '../Columnsearch'
import type { MappedServiceItem } from 'src/types/apps/roleTransactionMapping'

interface ServiceColumnProps {
    services: MappedServiceItem[]
    pendingChanges: Record<number, boolean>
    search: string
    onSearchChange: (v: string) => void
    onToggle: (taskServiceId: number, currentIsMapped: boolean) => void
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

export function ServiceColumn({
    services,
    pendingChanges,
    search,
    onSearchChange,
    onToggle,
    onToggleAll,
    hasPendingChanges,
    isSaving,
    onSave,
    onDiscard,
    emptyMessage
}: ServiceColumnProps) {
    const allChecked = services.length > 0 && services.every(service => pendingChanges[service.taskServiceId] ?? service.isMapped)
    const someChecked = services.some(service => pendingChanges[service.taskServiceId] ?? service.isMapped)

    return (
        <Box sx={{ flex: 1, minWidth: 280 }}>
            <ColumnHeader label='Services' count={services.length} />
            <Box sx={{ px: 1.5, pb: 1.25 }}>
                <ColumnSearch value={search} onChange={onSearchChange} placeholder='Search services' />
            </Box>
            <Box sx={{ borderTop: 1, ...hairline }} />

            {services.length > 0 && (
                <>
                    <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 0.5 }}>
                        <Checkbox
                            size='small'
                            checked={allChecked}
                            indeterminate={someChecked && !allChecked}
                            onChange={e => onToggleAll(e.target.checked)}
                        />
                        <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>Select all</Typography>
                    </Box>
                    <Box sx={{ borderTop: 1, ...hairline }} />
                </>
            )}

            <List sx={{ py: 0.5, maxHeight: 500, overflowY: 'auto' }}>
                {services.map(service => {
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
                                    onChange={() => onToggle(service.taskServiceId, service.isMapped)}
                                />
                            }
                        >
                            <ListItemText
                                primary={<Typography sx={{ fontSize: 13.5, fontWeight: 500 }}>{service.operationName}</Typography>}
                                secondary={<Typography sx={{ fontSize: 11, color: 'text.disabled' }}>{service.apiEndpoint}</Typography>}
                            />
                        </ListItem>
                    )
                })}
                {services.length === 0 && (
                    <Typography sx={{ fontSize: 12.5, color: 'text.secondary', textAlign: 'center', py: 3 }}>
                        {emptyMessage}
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
        </Box>
    )
}