
// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { DataGrid, RowOptions, CreatedAtCell } from 'src/@core/components/tables'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { IUserManagement } from 'src/types/apps/userManagement'
import RenderClient from 'src/@core/components/common/RenderClient'
import { fetchAllAction } from 'src/store/apps/userManagement'

interface CellType {
  row: IUserManagement
}

const columns = [
  {
    flex: 0.2,
    minWidth: 200,
    field: 'fullName',
    headerName: 'Full Name',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
            <RenderClient imageUrl={row.image} name={row.fullName} />
            <Typography noWrap component='a' variant='subtitle2' sx={{ color: 'text.primary', textDecoration: 'none' }}>
              {row.fullName}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 150,
    field: 'userName',
    headerName: 'User Name',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
            <Typography noWrap component='a' variant='subtitle2' sx={{ color: 'text.primary', textDecoration: 'none' }}>
              {row.userName}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 50,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', cursor: 'pointer' }}>
            <Typography noWrap component='a' variant='subtitle2' sx={{ color: 'text.primary', textDecoration: 'none' }}>
              {row.status || 0}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  // {
  //   flex: 0.1,
  //   minWidth: 110,
  //   field: 'mappedAccounts',
  //   headerName: 'Mapped Accounts',
  //   renderCell: ({ row }: CellType) => {
  //     return (
  //       <CustomChip
  //         skin='light'
  //         size='small'
  //         label={row.}
  //         color={row.status === 'PUBLIC' ? 'success' : 'error'}
  //         sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
  //       />
  //     )
  //   }
  // },
  {
    flex: 0.1,
    field: 'createdAt',
    headerName: 'Created At',
    renderCell: ({ row }: CellType) => {
      return (
        <CreatedAtCell createdAt={row.createdAt} />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
  }
]

const Table = () => {

  // ** Hooks
  const store:any = useSelector((state: RootState) => state.userManagement)

  const dispatch = useDispatch<AppDispatch>()

  return (
    <DataGrid
      rows={store.entities}
      columns={columns}
      loading={store.status === 'pending'}
      paginationModel={store.params.pagination}
      onPageSizeChange={(newPageSize) => dispatch(fetchAllAction({ query: { limit: `${newPageSize}` } }))}
      onPageChange={(newPage) => dispatch(fetchAllAction({ query: { page: `${newPage + 1}` } }))}
    />
  )
}

export default Table
