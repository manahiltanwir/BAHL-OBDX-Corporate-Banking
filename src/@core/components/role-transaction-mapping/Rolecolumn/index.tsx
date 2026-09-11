import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import { ColumnHeader } from '../Columnheader'
import { ColumnSearch } from '../Columnsearch'
import type { RoleApi } from 'src/types/apps/roleTransactionMapping'

interface RoleColumnProps {
    roles: RoleApi[]
    search: string
    onSearchChange: (v: string) => void
    selectedId: number | null
    onSelect: (id: number) => void
    onAddRole: () => void
    addDisabled: boolean
}

// Subtle theme-derived hairline — avoids the harsh black that the
// 'divider' palette token can resolve to in some themes
const hairline = { borderColor: (theme: any) => alpha(theme.palette.text.primary, 0.08) }

export function RoleColumn({ roles, search, onSearchChange, selectedId, onSelect, onAddRole, addDisabled }: RoleColumnProps) {
    return (
        <Box
            sx={{
                width: { xs: '100%', lg: 240 },
                flexShrink: 0,
                borderRight: { lg: 1 },
                borderBottom: { xs: 1, lg: 0 },
                ...hairline
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
                <ColumnHeader label='Roles' count={roles.length} />
                <Tooltip title={addDisabled ? 'Select an enterprise role first' : 'Create new role'}>
                    <span>
                        <IconButton size='small' onClick={onAddRole} disabled={addDisabled}>
                            <AddIcon fontSize='small' />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>
            <Box sx={{ px: 1.5, pb: 1.25 }}>
                <ColumnSearch value={search} onChange={onSearchChange} placeholder='Search' />
            </Box>
            <Box sx={{ borderTop: 1, ...hairline }} />
            <List sx={{ py: 0.5, maxHeight: 560, overflowY: 'auto' }}>
                {roles.map(role => {
                    const isSelected = role.id === selectedId
                    return (
                        <ListItemButton
                            key={role.id}
                            selected={isSelected}
                            onClick={() => onSelect(role.id)}
                            sx={{
                                pl: 2,
                                py: 1,
                                borderLeft: '3px solid transparent',
                                '&.Mui-selected': {
                                    bgcolor: theme => alpha(theme.palette.primary.main, 0.07),
                                    borderLeft: theme => `3px solid ${theme.palette.primary.main}`
                                },
                                '&.Mui-selected:hover': { bgcolor: theme => alpha(theme.palette.primary.main, 0.1) }
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Typography
                                        sx={{
                                            fontSize: 13.5,
                                            fontWeight: isSelected ? 600 : 500,
                                            color: isSelected ? 'primary.main' : 'text.primary'
                                        }}
                                    >
                                        {role.roleName}
                                    </Typography>
                                }
                            />
                        </ListItemButton>
                    )
                })}
                {roles.length === 0 && (
                    <Typography sx={{ fontSize: 12.5, color: 'text.secondary', textAlign: 'center', py: 3 }}>
                        {addDisabled ? 'Select an enterprise role to see roles.' : 'No roles found.'}
                    </Typography>
                )}
            </List>
        </Box>
    )
}