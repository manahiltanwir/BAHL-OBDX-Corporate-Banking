import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import { ColumnHeader } from '../Columnheader'
import { ColumnSearch } from '../Columnsearch'
import type { EnterpriseRoleDef } from '../Types'

interface EnterpriseRoleColumnProps {
    enterpriseRoles: EnterpriseRoleDef[]
    roleCountByEnterpriseRoleId: Record<number, number>
    search: string
    onSearchChange: (v: string) => void
    selectedId: number | null
    onSelect: (id: number) => void
}

export function EnterpriseRoleColumn({
    enterpriseRoles,
    roleCountByEnterpriseRoleId,
    search,
    onSearchChange,
    selectedId,
    onSelect,
}: EnterpriseRoleColumnProps) {
    return (
        <Box
            sx={{
                width: { xs: '100%', lg: 232 },
                flexShrink: 0,
                boxShadow: 1
            }}
        >
            <ColumnHeader label="Enterprise roles" count={enterpriseRoles.length} />
            <Box sx={{ px: 1.5, pb: 1.25 }}>
                <ColumnSearch value={search} onChange={onSearchChange} placeholder="Search" />
            </Box>
            <Divider />
            <List sx={{ py: 0.5, maxHeight: 560, overflowY: 'auto' }}>
                {enterpriseRoles.map((ent) => {
                    const isSelected = ent.id === selectedId
                    const roleCount = roleCountByEnterpriseRoleId[ent.id] || 0
                    return (
                        <ListItemButton
                            key={ent.id}
                            selected={isSelected}
                            onClick={() => onSelect(ent.id)}
                            sx={{
                                pl: 2,
                                py: 1,
                                borderLeft: '3px solid transparent',
                                '&.Mui-selected': {
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.07),
                                    borderLeft: (theme) => `3px solid ${theme.palette.primary.main}`,
                                },
                                '&.Mui-selected:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) },
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontSize: 13.5, fontWeight: isSelected ? 600 : 500, color: isSelected ? 'primary.main' : 'text.primary' }}>
                                        {ent.name}
                                    </Typography>
                                }
                                secondary={
                                    <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
                                        {roleCount} role{roleCount === 1 ? '' : 's'}
                                    </Typography>
                                }
                            />
                        </ListItemButton>
                    )
                })}
                {enterpriseRoles.length === 0 && (
                    <Typography sx={{ fontSize: 12.5, color: 'text.secondary', textAlign: 'center', py: 3 }}>
                        No match found.
                    </Typography>
                )}
            </List>
        </Box>
    )
}