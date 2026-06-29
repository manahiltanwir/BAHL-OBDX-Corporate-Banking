// ** React Imports
import { ChangeEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColumns, GridRenderCellParams } from '@mui/x-data-grid'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
// import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
// import { DataGridRowType } from 'src/@fake-db/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

interface StatusObj {
  [key: string]: {
    title: string
    color: ThemeColor
  }
}

interface ITableEmployee {
  data: any[]
}

// ** renders client column
const renderClient = (params: GridRenderCellParams) => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  if (row.profile_picture) {
    return <CustomAvatar src={`${row.profile_picture}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={color as ThemeColor}
        sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
      >
        {getInitials(row.first_name ? row.first_name : 'User')}
      </CustomAvatar>
    )
  }
}

const statusObj: StatusObj = {
  ADMIN: { title: 'Admin', color: 'primary' },
  MANAGER: { title: 'Manager', color: 'success' },
  INSPECTOR: { title: 'Inspector', color: 'error' }
}

const escapeRegExp = (value: string) => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const columns: GridColumns = [
  // {
  //   flex: 0.2,
  //   minWidth: 100,
  //   field: 'profile_picture',
  //   headerName: 'Profile',
  //   renderCell: (params: GridRenderCellParams) => {
  //     const { row } = params

  //     return (
  //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //         {renderClient(params)}
  //       </Box>
  //     )
  //   }
  // },
  {
    flex: 0.275,
    minWidth: 290,
    headerName: 'Name',
    field: 'first_name',
    renderCell: (params: GridRenderCellParams) => {
      const { row } = params

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {row.first_name} {row.last_name}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 120,
    headerName: 'Email',
    field: 'email',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.email}
      </Typography>
    )
  },
  {
    flex: 0.2,
    minWidth: 120,
    headerName: 'Phone',
    field: 'phone',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.phone}
      </Typography>
    )
  },
  // {
  //   flex: 0.2,
  //   minWidth: 110,
  //   field: 'salary',
  //   headerName: 'Salary',
  //   renderCell: (params: GridRenderCellParams) => (
  //     <Typography variant='body2' sx={{ color: 'text.primary' }}>
  //       {params.row.salary}
  //     </Typography>
  //   )
  // },
  // {
  //   flex: 0.125,
  //   field: 'age',
  //   minWidth: 80,
  //   headerName: 'Age',
  //   renderCell: (params: GridRenderCellParams) => (
  //     <Typography variant='body2' sx={{ color: 'text.primary' }}>
  //       {params.row.age}
  //     </Typography>
  //   )
  // },
  {
    flex: 0.2,
    minWidth: 140,
    field: 'code',
    headerName: 'Role',
    renderCell: (params: GridRenderCellParams) => {
      const status = statusObj[params.row?.role?.code || 'NotPossible']
      return (
        <CustomChip
          size='small'
          skin='light'
          color={status.color}
          label={status.title}
          sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
        />
      )
    }
  }
]

const TableEmployee = ({ data = [] }: ITableEmployee) => {
  // ** States
  // const [data] = useState<DataGridRowType[]>(rows)
  const [pageSize, setPageSize] = useState<number>(7)
  const [searchText, setSearchText] = useState<string>('')
  // const [filteredData, setFilteredData] = useState<DataGridRowType[]>([])

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue)
  }

  return (
    <Card>
      <CardHeader title='Quick Filter' />
      <DataGrid
        autoHeight
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[7, 10, 25, 50]}
        // components={{ Toolbar: QuickSearchToolbar }}
        // rows={filteredData.length ? filteredData : data}
        rows={[]}
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
      // componentsProps={{
      //   toolbar: {
      //     value: searchText,
      //     clearSearch: () => handleSearch(''),
      //     onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)
      //   }
      // }}
      />
    </Card>
  )
}

export default TableEmployee
