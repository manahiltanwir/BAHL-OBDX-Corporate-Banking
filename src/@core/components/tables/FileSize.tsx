import React from 'react'

// ** MUI
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { convertBitData } from 'src/@core/utils/bit-convert'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

interface Props {
    size: number | null
}

const FileSize: React.FC<Props> = ({ size }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
            <CustomChip
                skin='light'
                size='small'
                label={convertBitData(size || 0)}
                color={'info'}
                sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
            />
        </Box>
    )
}

/*
* @Example
* @import 
import { FileSize } from 'src/@core/components/tables'
{
    field: 'fileSize',
    headerName: 'FIle Size',
    renderCell: ({ row }: CellType) => {
        return (
            <FileSize size={row.size} />
        )
    }
},
*/

export default FileSize
