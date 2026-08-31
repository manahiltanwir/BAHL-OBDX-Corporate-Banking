import { useState, MouseEvent } from 'react'

// ** MUI Imports
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import { ImageEdit } from 'mdi-material-ui'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import DataGrid from 'src/@core/components/tables/DataGrid'
import NoRowsOverlay from 'src/@core/components/tables/NoRow'
import Pagination from 'src/@core/components/tables/Pagination'
import PencilOutline from 'mdi-material-ui/PencilOutline'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Store Imports
import { useSelector } from 'react-redux'

// ** Import Custom hooks
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types Imports
import { IUserManagement } from 'src/types/apps/userManagement'

const RowOptions = ({ id, row, setClickedModule }: {
    id: string, row: IUserManagement
    setClickedModule: (value: "resetPassword" | "resetUsername" | "InactiveUser" | "activeUser") => void
}) => {
    // ** Hooks
    const { handleDrawer, handleModal } = useToggleDrawer()

    const { push } = useRouter()

    // ** State
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleRowOptionsClose = () => {
        setAnchorEl(null)
    }

    const handleDelete = async () => {
        if (row?.userDTO?.status == 'A') {
            setClickedModule('InactiveUser')
        } else {
            setClickedModule('activeUser')
        }
        handleModal(id)
        handleRowOptionsClose()
    }

    const handleView = () => {
        handleRowOptionsClose()
        handleDrawer(id)
        push(
            {
                pathname: `/user-management/user/${id}`,
                query: row.userProfileDTO as any
            },
            `/user-management/user/${id}`
        )
        // push(`/user-management/user/${id}`)
    }

    const handleResetPassword = () => {
        setClickedModule('resetPassword')
        handleRowOptionsClose()
        handleModal(id)
    }

    const handleResetUserName = () => {
        setClickedModule('resetUsername')
        handleRowOptionsClose()
        handleModal(id)
    }

    return (
        <>
            <IconButton size='small' onClick={handleRowOptionsClick}>
                <DotsVertical />
            </IconButton>
            <Menu
                keepMounted
                anchorEl={anchorEl}
                open={rowOptionsOpen}
                onClose={handleRowOptionsClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                PaperProps={{ style: { minWidth: '8rem' } }}
            >
                <MenuItem onClick={handleView}>
                    <EyeOutline fontSize='small' sx={{ mr: 2 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={() => push(`/user-management/user/${row.userDTO?.userId}/edit-user`)}>
                    <PencilOutline fontSize='small' sx={{ mr: 2 }} />
                    Edit Details
                </MenuItem>
                {/* <MenuItem onClick={handleResetPassword}>
                    <VpnKeyIcon fontSize='small' sx={{ mr: 2 }} />
                    Reset Password
                </MenuItem>
                <MenuItem onClick={handleResetUserName}>
                    <VpnKeyIcon fontSize='small' sx={{ mr: 2 }} />
                    Reset User Name
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    {row?.userDTO?.status == 'A' ? <LockIcon fontSize='small' sx={{ mr: 2 }} /> : <LockOpenIcon fontSize='small' sx={{ mr: 2 }} />}
                    {row?.userDTO?.status == 'A' ? "Inactive User" : "Active User"}
                </MenuItem> */}
            </Menu>
        </>
    )
}

export default RowOptions;