import React from 'react'
import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'

export interface ResultsTableColumn {
  key: string
  label: string
}

interface StyledRowProps {
  gridTemplateColumns: string
}

const StyledResultsCard = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3.75),
  borderRadius: theme.shape.borderRadius * 1.75,
  boxShadow: theme.shadows[2],
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper
}))

const TableHeaderRow = styled(Box, {
  shouldForwardProp: prop => prop !== 'gridTemplateColumns' && prop !== 'headerColor'
})<StyledRowProps & { headerColor: string }>(({ theme, gridTemplateColumns, headerColor }) => ({
  display: 'grid',
  gridTemplateColumns,
  gap: theme.spacing(1),
  backgroundColor: headerColor,
  color: '#fff',
  padding: theme.spacing(1.5, 2.5),
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase'
}))

const TableBodyRow = styled(Box, {
  shouldForwardProp: prop => prop !== 'gridTemplateColumns'
})<StyledRowProps>(({ theme, gridTemplateColumns }) => ({
  display: 'grid',
  gridTemplateColumns,
  gap: theme.spacing(1),
  alignItems: 'center',
  padding: theme.spacing(1.5, 2.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  '&:last-of-type': { borderBottom: 0 },
  '&:hover': { backgroundColor: theme.palette.action.hover }
}))

const buildGridTemplate = (columnCount: number) => `repeat(${columnCount}, 1fr)`

export interface ResultsTableProps<T> {
  columns: ResultsTableColumn[]
  rows: T[]
  getRowKey: (row: T) => string
  renderRow: (row: T) => React.ReactNode
  gridTemplateColumns?: string
  onRowClick?: (row: T) => void
  emptyMessage?: string
  headerColor?: string
}

function ResultsTable<T>({
  columns,
  rows,
  getRowKey,
  renderRow,
  gridTemplateColumns,
  onRowClick,
  emptyMessage = 'No records found.',
  headerColor = '#15804f'
}: ResultsTableProps<T>) {
  const template = gridTemplateColumns || buildGridTemplate(columns.length)

  return (
    <StyledResultsCard>
      <TableHeaderRow gridTemplateColumns={template} headerColor={headerColor}>
        {columns.map(column => (
          <Box key={column.key}>{column.label}</Box>
        ))}
      </TableHeaderRow>

      {rows.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant='body2' color='text.secondary'>
            {emptyMessage}
          </Typography>
        </Box>
      ) : (
        rows.map(row => (
          <TableBodyRow key={getRowKey(row)} gridTemplateColumns={template} onClick={() => onRowClick?.(row)}>
            {renderRow(row)}
          </TableBodyRow>
        ))
      )}
    </StyledResultsCard>
  )
}

export default ResultsTable