// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { DataGrid } from 'src/@core/components/tables'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { IUserManagement } from 'src/types/apps/userManagement'
import RenderClient from 'src/@core/components/common/RenderClient'
import { fetchAllAction } from 'src/store/apps/userManagement'
import { useMemo } from 'react'
import RowOptions from './RowOptions'

interface CellType {
  row: IUserManagement
}

interface TableProps {
  setClickedModule: (value: "resetPassword" | "resetUsername" | "InactiveUser" | "activeUser") => void
}

const Table = ({ setClickedModule }: TableProps) => {
  // ** Hooks
  const store: any = useSelector((state: RootState) => state.userManagement)
  const dispatch = useDispatch<AppDispatch>()

  const transformedRows = useMemo(() => {
    return (store.entities || []).map((ele: IUserManagement, index: number) => ({
      ...ele,
      id: ele.userDTO?.userId || ele.userDTO?.id || `row-${index}`
    }));
  }, [store.entities]);

  // ** Columns defined inside Table to access props context
  const columns = useMemo(() => [
    {
      flex: 0,
      minWidth: 200,
      field: 'userName',
      headerName: 'User Name',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
            <RenderClient imageUrl={''} name={row.userProfileDTO?.firstName + ' ' + row.userProfileDTO?.lastName} />
            <Typography noWrap component='a' variant='subtitle2' sx={{ color: 'text.primary', textDecoration: 'none' }}>
              {row.userDTO?.username}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'fullName',
      headerName: 'Full Name',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
            <Typography noWrap component='a' variant='subtitle2' sx={{ color: 'text.primary', textDecoration: 'none' }}>
              {row?.userProfileDTO?.firstName + ' ' + row?.userProfileDTO?.lastName}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', cursor: 'pointer' }}>
            <Typography noWrap component='a' variant='subtitle2' sx={{ color: 'text.primary', textDecoration: 'none' }}>
              {row?.userProfileDTO?.email}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'mobileNumber',
      headerName: 'Mobile Number',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', cursor: 'pointer' }}>
            <Typography noWrap component='a' variant='subtitle2' sx={{ color: 'text.primary', textDecoration: 'none' }}>
              {row?.userProfileDTO?.mobileNumber}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'lockStatus',
      headerName: 'Lock Status',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', cursor: 'pointer' }}>
            <Typography noWrap component='a' variant='subtitle2' sx={{ color: 'text.primary', textDecoration: 'none' }}>
              {row?.userDTO?.isLocked == 'N' ? 'Unlocked' : "Locked"}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <RowOptions
          id={row.userDTO?.userId || ''}
          row={row}
          setClickedModule={setClickedModule}
        // handleModal={handleModal} 
        />
      )
    }
  ], [setClickedModule]);

  return (
    <DataGrid
      rows={transformedRows || []}
      columns={columns}
      loading={store.status === 'pending'}
    />
  )
}

export default Table
