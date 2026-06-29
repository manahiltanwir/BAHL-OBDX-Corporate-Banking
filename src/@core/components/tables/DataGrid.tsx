// Some API clients return undefined while loading
import { useState, useEffect } from "react";
import { DataGrid, GridToolbar, DataGridProps } from "@mui/x-data-grid";
import { LinearProgress } from "@mui/material";

import NoRowsOverlay from 'src/@core/components/tables/NoRow'
import Pagination from 'src/@core/components/tables/Pagination'
import { GetParams } from "src/types/api";

interface Props extends DataGridProps {
  paginationModel: GetParams['pagination'];
  onPageSizeChange?: (newPageSize: number) => void
  onPageChange?: (newPage: number) => void
}

// Following lines are here to prevent `rowCountState` from being undefined during the loading
const Table: React.FC<Props> = ({ rows, columns, paginationModel, onPageSizeChange, onPageChange, ...props }) => {

  // ** State
  const [rowCountState, setRowCountState] = useState<number>(paginationModel?.total || 0);
  const [pageSize, setPageSize] = useState<number>(10)

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      paginationModel?.total !== undefined
        ? paginationModel?.total
        : prevRowCountState,
    );
  }, [paginationModel?.total, setRowCountState]);

  const handleSetPageSize = (newPageSize: number) => {
    newPageSize && setPageSize(newPageSize)
    onPageSizeChange && onPageSizeChange(newPageSize)
  }

  const handleChangePage = (newPage: number) => {
    onPageChange && onPageChange(newPage)
  }

  return (
    <DataGrid
      autoHeight
      rows={rows}
      columns={columns}
      checkboxSelection
      disableSelectionOnClick

      // pagination
      pagination
      paginationMode="server"
      rowCount={rowCountState}
      onPageChange={handleChangePage}

      // pagination page size
      pageSize={pageSize}
      rowsPerPageOptions={[3, 5, 10, 25, 50]}
      onPageSizeChange={handleSetPageSize}

      sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
      components={{
        Toolbar: GridToolbar,
        NoRowsOverlay,
        LoadingOverlay: LinearProgress,
        Pagination
      }}
      loading={props.loading}
    />
  )
}

export default Table