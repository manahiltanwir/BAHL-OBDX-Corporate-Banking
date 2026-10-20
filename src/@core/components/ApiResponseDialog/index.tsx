import React from 'react'

import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CloseIcon from '@mui/icons-material/Close'

export interface ApiResponseInfo {
    status?: string
    message?: string
    transactionReference?: string
    [key: string]: any 
}

interface ApiResponseDialogProps {
    open: boolean
    onClose: () => void
    response: ApiResponseInfo | null
    closeLabel?: string
    maxWidth?: 'xs' | 'sm' | 'md'
}

type Tone = 'success' | 'warning' | 'error' | 'info'

const getTone = (status?: string): Tone => {
    const s = (status || '').toUpperCase()

    if (['SUCCESS', 'SUCCESSFUL', 'APPROVED', 'COMPLETED', 'PROCESSED'].includes(s)) return 'success'
    if (s.includes('PENDING') || s.includes('QUEUED') || s.includes('PROCESSING')) return 'warning'
    if (['FAILED', 'FAILURE', 'ERROR', 'REJECTED', 'DECLINED'].includes(s)) return 'error'

    return 'info'
}

const toneIcons: Record<Tone, React.ReactNode> = {
    success: <CheckCircleOutlineIcon sx={{ fontSize: 40 }} />,
    warning: <HourglassEmptyIcon sx={{ fontSize: 40 }} />,
    error: <ErrorOutlineIcon sx={{ fontSize: 40 }} />,
    info: <InfoOutlinedIcon sx={{ fontSize: 40 }} />
}

// PENDING_APPROVAL -> Pending Approval
const formatStatus = (status?: string) =>
    (status || 'Unknown')
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

const ApiResponseDialog = ({
    open,
    onClose,
    response,
    closeLabel = 'Close',
    maxWidth = 'xs'
}: ApiResponseDialogProps) => {
    const theme = useTheme()
    const tone = getTone(response?.status)
    const color = theme.palette[tone].main

    return (
        <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
            <DialogContent sx={{ pt: 4, textAlign: 'center' }}>
                {/* Status (top) */}
                <Box
                    sx={{
                        width: 72,
                        height: 72,
                        mx: 'auto',
                        mb: 2,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color,
                        bgcolor: alpha(color, 0.12)
                    }}
                >
                    {toneIcons[tone]}
                </Box>

                <Typography
                    sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        mb: 2,
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 13,
                        letterSpacing: 0.5,
                        color,
                        bgcolor: alpha(color, 0.12)
                    }}
                >
                    {formatStatus(response?.status)}
                </Typography>

                {/* Message */}
                <Typography variant='body1' sx={{ fontWeight: 500 }}>
                    {response?.message}
                </Typography>

                {/* Optional reference */}
                {response?.transactionReference && (
                    <Box
                        sx={{
                            mt: 3,
                            p: 1.5,
                            borderRadius: 1.5,
                            bgcolor: theme.palette.action.hover,
                            wordBreak: 'break-all'
                        }}
                    >
                        <Typography variant='caption' color='text.secondary' sx={{ display: 'block' }}>
                            Transaction Reference
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {response.transactionReference}
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
                <Button variant='contained' startIcon={<CloseIcon />} onClick={onClose} sx={{ minWidth: 140 }}>
                    {closeLabel}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ApiResponseDialog