import React, { useState, useMemo } from 'react'
import { styled, useTheme, alpha } from '@mui/material/styles'
import {
    Box,
    Card,
    Chip,
    Dialog,
    DialogContent,
    Divider,
    Grid,
    IconButton,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PaymentsIcon from '@mui/icons-material/Payments'
import BadgeIcon from '@mui/icons-material/Badge'
import CategoryIcon from '@mui/icons-material/Category'
import DescriptionIcon from '@mui/icons-material/Description'
import PersonIcon from '@mui/icons-material/Person'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import FlagIcon from '@mui/icons-material/Flag'

// ---------- Types ----------
type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
type RequestType = 'Single Payment' | 'Bulk Payment' | 'Create User'

interface ApprovalRequest {
    id: string
    requestId: string
    type: RequestType
    details: string
    amount: number | null
    maker: string
    date: string
    status: RequestStatus
}

// TODO: yeh mock data API se replace karein
const approvalRequests: ApprovalRequest[] = [
    {
        id: '1',
        requestId: 'REQ-10231',
        type: 'Single Payment',
        details: 'Acme Technologies (Andorra)',
        amount: 250000,
        maker: 'Ahmed Raza',
        date: '2026-08-27 11:20 AM',
        status: 'PENDING'
    },
    {
        id: '2',
        requestId: 'REQ-10232',
        type: 'Bulk Payment',
        details: 'Batch BATCH-OFTT-2026-0825 (3 transactions)',
        amount: 489000,
        maker: 'Sana Khan',
        date: '2026-08-27 10:05 AM',
        status: 'PENDING'
    },
    {
        id: '3',
        requestId: 'REQ-10233',
        type: 'Create User',
        details: 'New user: fatima.tariq (Maker role)',
        amount: null,
        maker: 'Bilal Ahmed',
        date: '2026-08-26 04:40 PM',
        status: 'PENDING'
    },
    {
        id: '4',
        requestId: 'REQ-10201',
        type: 'Single Payment',
        details: 'Zenith Traders (PKR)',
        amount: 175000,
        maker: 'Ahmed Raza',
        date: '2026-08-24 09:12 AM',
        status: 'APPROVED'
    },
    {
        id: '5',
        requestId: 'REQ-10188',
        type: 'Bulk Payment',
        details: 'Batch BATCH-OFTT-2026-0812 (5 transactions)',
        amount: 612000,
        maker: 'Sana Khan',
        date: '2026-08-20 03:30 PM',
        status: 'REJECTED'
    }
]

// ---------- Styled (theme-driven) ----------
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[2],
    overflow: 'hidden'
}))

const StyledTabs = styled(Tabs)(({ theme }) => ({
    minHeight: 44,
    '& .MuiTabs-indicator': {
        height: 3,
        borderRadius: '3px 3px 0 0',
        backgroundColor: theme.palette.primary.main
    }
}))

const StyledTab = styled(Tab)(({ theme }) => ({
    minHeight: 44,
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
        color: theme.palette.primary.main
    }
}))

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    '& .MuiTableCell-root': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontWeight: 700,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        border: 'none',
        whiteSpace: 'nowrap'
    }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.04)
    },
    '& .MuiTableCell-root': {
        borderBottom: `1px solid ${theme.palette.divider}`
    }
}))

const DetailRow = ({
    icon,
    label,
    value,
    emphasize
}: {
    icon: React.ReactNode
    label: string
    value: string
    emphasize?: boolean
}) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box sx={{ color: 'text.secondary', display: 'flex' }}>{icon}</Box>
            <Typography variant='body2' color='text.secondary'>
                {label}
            </Typography>
        </Box>
        <Typography
            variant='body2'
            sx={{ fontWeight: emphasize ? 800 : 600, color: emphasize ? 'primary.main' : 'text.primary', textAlign: 'right', ml: 2 }}
        >
            {value}
        </Typography>
    </Box>
)

const statusChipProps: Record<RequestStatus, { label: string; color: 'warning' | 'success' | 'error' }> = {
    PENDING: { label: 'Pending', color: 'warning' },
    APPROVED: { label: 'Approved', color: 'success' },
    REJECTED: { label: 'Rejected', color: 'error' }
}

const tabConfig: { key: RequestStatus; label: string }[] = [
    { key: 'PENDING', label: 'Pending' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'REJECTED', label: 'Rejected' }
]

const Page = () => {
    const theme = useTheme()
    const [activeTab, setActiveTab] = useState<RequestStatus>('PENDING')
    const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null)

    const formatAmount = (amount: number | null) =>
        amount === null ? '—' : `PKR ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

    const counts = useMemo(
        () => ({
            PENDING: approvalRequests.filter(r => r.status === 'PENDING').length,
            APPROVED: approvalRequests.filter(r => r.status === 'APPROVED').length,
            REJECTED: approvalRequests.filter(r => r.status === 'REJECTED').length
        }),
        []
    )

    const filteredRequests = approvalRequests.filter(r => r.status === activeTab)

    const handleRowClick = (request: ApprovalRequest) => setSelectedRequest(request)
    const handleCloseModal = () => setSelectedRequest(null)

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Box sx={{  alignItems: 'center', gap: 1.5 }}>
                    <Typography variant='h5' sx={{ fontWeight: 700 }}>
                        View Term Deposite
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        Browse your active and matured deposits, with full details a tap away.
                    </Typography>
                </Box>
            </Grid>

            <Grid item xs={12}>
                <StyledCard>
                    <Box sx={{ px: 3, pt: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <StyledTabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
                            {tabConfig.map(tab => (
                                <StyledTab key={tab.key} value={tab.key} label={`${tab.label} (${counts[tab.key]})`} />
                            ))}
                        </StyledTabs>
                    </Box>

                    <TableContainer>
                        <Table>
                            <StyledTableHead>
                                <TableRow>
                                    <TableCell>Request ID</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Details</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Maker</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </StyledTableHead>

                            <TableBody>
                                {filteredRequests.map(request => (
                                    <StyledTableRow key={request.id} onClick={() => handleRowClick(request)}>
                                        <TableCell>
                                            <Typography variant='body2' sx={{ fontWeight: 700 }}>
                                                {request.requestId}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant='body2' color='primary.main' sx={{ fontWeight: 600 }}>
                                                {request.type}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant='body2' color='text.secondary'>
                                                {request.details}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant='body2' sx={{ fontWeight: 700 }}>
                                                {formatAmount(request.amount)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant='body2' color='text.secondary'>
                                                {request.maker}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant='body2' color='text.secondary'>
                                                {request.date}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={statusChipProps[request.status].label}
                                                color={statusChipProps[request.status].color}
                                                size='small'
                                                sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                                            />
                                        </TableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {filteredRequests.length === 0 && (
                        <Box sx={{ py: 6, textAlign: 'center' }}>
                            <Typography variant='body2' color='text.secondary'>
                                No {statusChipProps[activeTab].label.toLowerCase()} requests found.
                            </Typography>
                        </Box>
                    )}
                </StyledCard>
            </Grid>

            <Dialog
                open={!!selectedRequest}
                onClose={handleCloseModal}
                maxWidth='xs'
                fullWidth
            >
                {selectedRequest && (
                    <DialogContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        bgcolor: 'primary.main',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}
                                >
                                    <PaymentsIcon sx={{ color: theme.palette.primary.contrastText, fontSize: 20 }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 700 }}>{selectedRequest.requestId}</Typography>
                                    <Chip
                                        label={statusChipProps[selectedRequest.status].label}
                                        color={statusChipProps[selectedRequest.status].color}
                                        size='small'
                                        sx={{ fontWeight: 700, fontSize: '0.65rem', mt: 0.5 }}
                                    />
                                </Box>
                            </Box>
                            <IconButton size='small' onClick={handleCloseModal}>
                                <CloseIcon fontSize='small' />
                            </IconButton>
                        </Box>

                        <Divider sx={{ mb: 1 }} />

                        <DetailRow icon={<CategoryIcon sx={{ fontSize: 18 }} />} label='Type' value={selectedRequest.type} />
                        <Divider />
                        <DetailRow
                            icon={<DescriptionIcon sx={{ fontSize: 18 }} />}
                            label='Details'
                            value={selectedRequest.details}
                        />
                        <Divider />
                        <DetailRow
                            icon={<BadgeIcon sx={{ fontSize: 18 }} />}
                            label='Amount'
                            value={formatAmount(selectedRequest.amount)}
                            emphasize
                        />
                        <Divider />
                        <DetailRow icon={<PersonIcon sx={{ fontSize: 18 }} />} label='Maker' value={selectedRequest.maker} />
                        <Divider />
                        <DetailRow
                            icon={<CalendarMonthIcon sx={{ fontSize: 18 }} />}
                            label='Date'
                            value={selectedRequest.date}
                        />
                        <Divider />
                        <DetailRow
                            icon={<FlagIcon sx={{ fontSize: 18 }} />}
                            label='Status'
                            value={statusChipProps[selectedRequest.status].label}
                        />
                    </DialogContent>
                )}
            </Dialog>
        </Grid>
    )
}

Page.acl = { action: 'itsHaveAccess', subject: 'view-TDR' }

export default Page