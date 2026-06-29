import React from 'react'

// ** utils
import { format, formatDistanceToNow } from 'date-fns'

// ** MUI
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface Props {
    serial: number | null
}

const formattedSerialNumbers = (serialNumber: number) => {
    const paddedSerialNumber = serialNumber.toString().padStart(3, '0');
    return `#${paddedSerialNumber}`;
};

const Serial: React.FC<Props> = ({ serial }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
            <Typography
                noWrap
                component='a'
                variant='subtitle2'
                sx={{ color: 'text.primary', textDecoration: 'none' }}
            >
                {serial && formattedSerialNumbers(serial)}
            </Typography>
        </Box>
    )
}

/*
* @Example
* @import 
import { SerialCell } from 'src/@core/components/tables'
{
    field: 'serial',
    headerName: 'No: #',
    renderCell: ({ row }: CellType) => {
        return (
            <SerialCell serial={row.serial} />
        )
    }
},
*/

export default Serial
