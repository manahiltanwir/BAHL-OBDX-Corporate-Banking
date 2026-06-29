import { useState, MouseEvent } from 'react'

// ** MUI Imports
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import { ImageEdit } from 'mdi-material-ui'

import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'

import DataGrid from 'src/@core/components/tables/DataGrid'
import NoRowsOverlay from 'src/@core/components/tables/NoRow'
import Pagination from 'src/@core/components/tables/Pagination'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Store Imports
import { useSelector } from 'react-redux'

// ** Import Custom hooks
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'

// ** Types Imports
import { RootState } from 'src/store'
import { ICategory } from 'src/types/apps/category'
import RenderClient from 'src/@core/components/common/RenderClient'

const RowOptions = ({ id }: { id: string }) => {
    // ** Hooks
    const { handleDrawer, handleModal } = useToggleDrawer()

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
        handleModal(id)
        handleRowOptionsClose()
    }

    const handleUpdate = () => {
        handleRowOptionsClose()
        handleDrawer(id)
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
                <MenuItem onClick={handleUpdate}>
                    <ImageEdit fontSize='small' sx={{ mr: 2 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <DeleteOutline fontSize='small' sx={{ mr: 2 }} />
                    Delete
                </MenuItem>
            </Menu>
        </>
    )
}

export default RowOptions;