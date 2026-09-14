import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { ColumnHeader } from '../Columnheader'
import { ColumnSearch } from '../Columnsearch'
import type { EnterpriseRoleApi } from 'src/types/apps/roleTransactionMapping'

interface EnterpriseRoleColumnProps {
    enterpriseRoles: EnterpriseRoleApi[]
    search: string
    onSearchChange: (v: string) => void
    selectedId: number | null
    onSelect: (id: number) => void
}

// Subtle theme-derived hairline — avoids the harsh black that the
// 'divider' palette token can resolve to in some themes
const hairline = { borderColor: (theme: any) => alpha(theme.palette.text.primary, 0.08) }

export function EnterpriseRoleColumn({
    enterpriseRoles,
    search,
    onSearchChange,
    selectedId,
    onSelect
}: EnterpriseRoleColumnProps) {
    return (
        <Box
            sx={{
                width: { xs: '100%', lg: 220 },
                flexShrink: 0,
                borderRight: { lg: 1 },
                borderBottom: { xs: 1, lg: 0 },
                ...hairline
            }}
        >
            <ColumnHeader label='Enterprise roles' count={enterpriseRoles.length} />
            <Box sx={{ px: 1.5, pb: 1.25 }}>
                <ColumnSearch value={search} onChange={onSearchChange} placeholder='Search' />
            </Box>
            <Box sx={{ borderTop: 1, ...hairline }} />
            <List sx={{ py: 0.5, maxHeight: 560, overflowY: 'auto' }}>
                {enterpriseRoles.map(ent => {
                    const isSelected = ent.id === selectedId
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
                                        {ent.enterpriseRole}
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