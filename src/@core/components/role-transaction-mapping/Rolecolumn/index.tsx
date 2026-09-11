import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import { ColumnHeader } from '../Columnheader'
import { ColumnSearch } from '../Columnsearch'
import type { RoleDef } from '../Types'

interface RoleColumnProps {
    hasEnterpriseRoleSelected: boolean
    roles: RoleDef[]
    search: string
    onSearchChange: (v: string) => void
    selectedId: number | null
    onSelect: (id: number) => void
    onNewRole?: () => void
}

export function RoleColumn({
    hasEnterpriseRoleSelected,
    roles,
    search,
    onSearchChange,
    selectedId,
    onSelect,
    onNewRole,
}: RoleColumnProps) {
    return (
        <Box
            sx={{
                width: { xs: '100%', lg: 232 },
                flexShrink: 0,
                boxShadow: 2
            }}
        >
            <ColumnHeader label="Roles" count={roles.length} />
            <Box sx={{ px: 1.5, pb: 1.25, display: 'flex', gap: 1 }}>
                <ColumnSearch value={search} onChange={onSearchChange} placeholder="Search" />
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                    onClick={onNewRole}
                    sx={{ textTransform: 'none', flexShrink: 0, whiteSpace: 'nowrap', fontSize: 12.5, borderColor: 'divider', color: 'text.primary' }}
                >
                    New
                </Button>
            </Box>
            <Divider />
            <List sx={{ py: 0.5, maxHeight: 560, overflowY: 'auto' }}>
                {!hasEnterpriseRoleSelected ? (
                    <Typography sx={{ fontSize: 12.5, color: 'text.secondary', textAlign: 'center', py: 3 }}>
                        Select an enterprise role first.
                    </Typography>
                ) : roles.length === 0 ? (
                    <Typography sx={{ fontSize: 12.5, color: 'text.secondary', textAlign: 'center', py: 3 }}>
                        No role found.
                    </Typography>
                ) : (
                    roles.map((role) => {
                        const isSelected = role.id === selectedId
                        return (
                            <ListItemButton
                                key={role.id}
                                selected={isSelected}
                                onClick={() => onSelect(role.id)}
                                sx={{
                                    pl: 2,
                                    py: 0.9,
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
                                            {role.name}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        )
                    })
                )}
            </List>
        </Box>
    )
}