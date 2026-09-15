import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import type { EnterpriseRoleApi, RoleApi } from 'src/types/apps/roleTransactionMapping'

interface RoleSelectionBarProps {
    enterpriseRoles: EnterpriseRoleApi[]
    selectedEnterpriseRole: EnterpriseRoleApi | undefined
    enterpriseSearch: string
    onEnterpriseSearchChange: (v: string) => void
    onSelectEnterpriseRole: (id: number) => void

    roles: RoleApi[]
    selectedRole: RoleApi | undefined
    roleSearch: string
    onRoleSearchChange: (v: string) => void
    onSelectRole: (id: number) => void

    onAddRole: () => void
}

export function RoleSelectionBar({
    enterpriseRoles,
    selectedEnterpriseRole,
    enterpriseSearch,
    onEnterpriseSearchChange,
    onSelectEnterpriseRole,
    roles,
    selectedRole,
    roleSearch,
    onRoleSearchChange,
    onSelectRole,
    onAddRole
}: RoleSelectionBarProps) {
    const roleDisabled = !selectedEnterpriseRole

    return (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <Autocomplete
                sx={{ minWidth: 260, flex: 1 }}
                options={enterpriseRoles}
                value={selectedEnterpriseRole ?? null}
                inputValue={enterpriseSearch}
                onInputChange={(_, value, reason) => {
                    if (reason === 'input') onEnterpriseSearchChange(value)
                }}
                onChange={(_, value) => {
                    if (value) {
                        onSelectEnterpriseRole(value.id)
                        onEnterpriseSearchChange(value.enterpriseRole)
                    } else {
                        onEnterpriseSearchChange('')
                    }
                }}
                getOptionLabel={option => option.enterpriseRole}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={params => (
                    <TextField {...params} label='Enterprise Role' placeholder='Search enterprise role' size='small' />
                )}
            />

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', flex: 1, minWidth: 260 }}>
                <Autocomplete
                    sx={{ flex: 1 }}
                    options={roles}
                    disabled={roleDisabled}
                    value={selectedRole ?? null}
                    inputValue={roleSearch}
                    onInputChange={(_, value, reason) => {
                        if (reason === 'input') onRoleSearchChange(value)
                    }}
                    onChange={(_, value) => {
                        if (value) {
                            onSelectRole(value.id)
                            onRoleSearchChange(value.roleName)
                        } else {
                            onRoleSearchChange('')
                        }
                    }}
                    getOptionLabel={option => option.roleName}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label='Role'
                            placeholder={roleDisabled ? 'Select an enterprise role first' : 'Search role'}
                            size='small'
                        />
                    )}
                />
                <Tooltip title={roleDisabled ? 'Select an enterprise role first' : 'Create new role'}>
                    <span>
                        <IconButton onClick={onAddRole} disabled={roleDisabled} sx={{ mt: 0.5 }}>
                            <AddIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>
        </Box>
    )
}