// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// ** Icons Imports
import ExportVariant from 'mdi-material-ui/ExportVariant'
import Search from 'src/@core/components/common/Search'
import { TableHeaderBox } from 'src/@core/components/common/TableHeaderBox'

interface TableHeaderProps {
  value: string
  toggle: () => void
  handleFilter: (val: string) => void
  exportTable: () => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, value, toggle, exportTable } = props

  return (
    <TableHeaderBox>
      <Button sx={{ mr: 4, mb: 2 }} color='secondary' variant='outlined' startIcon={<ExportVariant fontSize='small' />} onClick={exportTable}>
        Export
      </Button>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={value}
          sx={{ mr: 6, mb: 2 }}
          placeholder='Search '
          onChange={e => handleFilter(e.target.value)}
        />
      </Box>

      <Button sx={{ mr: 4 }} onClick={toggle} variant='contained'>
        Add Category
      </Button>
      <Search placeholder='by assignment..' module='assignment' />
    </TableHeaderBox>
  )
}

export default TableHeader
