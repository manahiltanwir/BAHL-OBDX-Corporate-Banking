import React from 'react'

// ** utils
import { format, formatDistanceToNow } from 'date-fns'

// ** MUI
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface Props {
    createdAt: Date | null
}

const CreatedAt: React.FC<Props> = ({ createdAt }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
            <Typography
                noWrap
                component='a'
                variant='subtitle2'
                sx={{ color: 'text.primary', textDecoration: 'none' }}
            >
                {(createdAt) && format(new Date(createdAt), 'dd/MM/yyy')}
            </Typography>
            <Typography variant='body2' >
                {(createdAt) && formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </Typography>
        </Box>
    )
}

/*
* @Example
* @import 
import { CreatedAtCell } from 'src/@core/components/tables'
{
    flex: 0.2,
    minWidth: 230,
    field: 'createdAt',
    headerName: 'Created At',
    renderCell: ({ row }: CellType) => {
        return (
            <CreatedAtCell createdAt={row.createdAt} />
        )
    }
},
*/

export default CreatedAt
