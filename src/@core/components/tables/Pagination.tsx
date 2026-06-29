import { GridPagination, useGridApiContext, useGridSelector } from '@mui/x-data-grid'
// @ts-ignore
import { gridPageCountSelector } from '@mui/x-data-grid'
import MuiPagination from '@mui/material/Pagination'
import { TablePaginationProps } from '@mui/material/TablePagination'

function Pagination({
  page,
  onPageChange,
  className
}: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>) {
  const apiRef = useGridApiContext()
  const pageCount: number = useGridSelector(apiRef, gridPageCountSelector)

  return (
    <MuiPagination
      color='primary'
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as any, newPage - 1)
      }}
    />
  )
}

export default function CustomPagination(props: any) {
  return <GridPagination ActionsComponent={Pagination} {...props} />
}

// export default function CustomPaginationGrid() {
//   const { data } = useDemoData({
//     dataSet: 'Commodity',
//     rowLength: 100,
//     maxColumns: 6,
//   });

//   return (
//     <Box sx={{ height: 400, width: '100%' }}>
//       <DataGrid
//         pagination
//         slots={{
//           pagination: CustomPagination,
//         }}
//         {...data}
//         initialState={{
//           ...data.initialState,
//           pagination: { paginationModel: { pageSize: 25 } },
//         }}
//       />
//     </Box>
//   );
// }
