import React, { useState } from 'react'
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SavingsIcon from '@mui/icons-material/Savings'
import BadgeIcon from '@mui/icons-material/Badge'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PercentIcon from '@mui/icons-material/Percent'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PaidIcon from '@mui/icons-material/Paid'
import FlagIcon from '@mui/icons-material/Flag'

// ---------- Types ----------
type DepositStatus = 'ACTIVE'

interface TermDeposit {
    id: string
    accountNo: string
    depositAmount: number
    tenor: string
    rate: number
    maturityDate: string
    estimatedProfit: number
    status: DepositStatus
}

// TODO: yeh mock data API se replace karein
const termDeposits: TermDeposit[] = [
    {
        id: '1',
        accountNo: '0011-2233445-01',
        depositAmount: 50000,
        tenor: '6 Months',
        rate: 5.25,
        maturityDate: '10-Nov-2026',
        estimatedProfit: 1312.5,
        status: 'ACTIVE'
    },
    {
        id: '2',
        accountNo: '0011-2233445-02',
        depositAmount: 120000,
        tenor: '1 Year',
        rate: 5.75,
        maturityDate: '15-May-2027',
        estimatedProfit: 6900,
        status: 'ACTIVE'
    },
    {
        id: '3',
        accountNo: '0022-8871290-01',
        depositAmount: 75000,
        tenor: '3 Months',
        rate: 4.9,
        maturityDate: '18-Dec-2026',
        estimatedProfit: 918.75,
        status: 'ACTIVE'
    },
    {
        id: '4',
        accountNo: '0033-4451209-05',
        depositAmount: 200000,
        tenor: '2 Years',
        rate: 6.1,
        maturityDate: '05-Sep-2028',
        estimatedProfit: 24400,
        status: 'ACTIVE'
    },
    {
        id: '5',
        accountNo: '0044-1102938-03',
        depositAmount: 35000,
        tenor: '9 Months',
        rate: 5.4,
        maturityDate: '22-Jun-2027',
        estimatedProfit: 1417.5,
        status: 'ACTIVE'
    }
]

// ---------- Styled (theme-driven) ----------
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[2],
    overflow: 'hidden'
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
        whiteSpace: 'nowrap',
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5)
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

const statusChipProps: Record<DepositStatus, { label: string; color: 'primary' }> = {
    ACTIVE: { label: 'Active', color: 'primary' }
}

const Page = () => {
    const theme = useTheme()
    const [selectedDeposit, setSelectedDeposit] = useState<TermDeposit | null>(null)

    const formatUSD = (amount: number) =>
        `USD ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    const handleRowClick = (deposit: TermDeposit) => setSelectedDeposit(deposit)
    const handleCloseModal = () => setSelectedDeposit(null)

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Box sx={{ alignItems: 'center', gap: 1.5 }}>
                    <Typography variant='h5' sx={{ fontWeight: 700 }}>
                        View Term Deposit
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        Browse your active term deposits, with full details a tap away.
                    </Typography>
                </Box>
            </Grid>

            <Grid item xs={12}>
                <StyledCard>
                    <TableContainer>
                        <Table>
                            <StyledTableHead>
                                <TableRow>
                                    <TableCell>Account No</TableCell>
                                    <TableCell>Deposit Amount</TableCell>
                                    <TableCell>Tenor</TableCell>
                                    <TableCell>Rate</TableCell>
                                    <TableCell>Maturity Date</TableCell>
                                    <TableCell>Estimated Profit</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </StyledTableHead>

                            <TableBody>
                                {termDeposits.map(deposit => (
                                    <StyledTableRow key={deposit.id} onClick={() => handleRowClick(deposit)}>
                                        <TableCell>
                                            <Typography variant='body2' sx={{ fontWeight: 700 }}>
                                                {deposit.accountNo}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant='body2' color='text.secondary'>
                                                {formatUSD(deposit.depositAmount)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant='body2' color='primary.main' sx={{ fontWeight: 600 }}>
                                                {deposit.tenor}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant='body2' color='text.secondary'>
                                                {deposit.rate.toFixed(2)}%
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant='body2' sx={{ fontWeight: 700 }}>
                                                {deposit.maturityDate}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant='body2' sx={{ fontWeight: 700, color: 'primary.main' }}>
                                                {formatUSD(deposit.estimatedProfit)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={statusChipProps[deposit.status].label}
                                                color={statusChipProps[deposit.status].color}
                                                size='small'
                                                sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                                            />
                                        </TableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {termDeposits.length === 0 && (
                        <Box sx={{ py: 6, textAlign: 'center' }}>
                            <Typography variant='body2' color='text.secondary'>
                                No term deposits found.
                            </Typography>
                        </Box>
                    )}
                </StyledCard>
            </Grid>

            <Dialog
                open={!!selectedDeposit}
                onClose={handleCloseModal}
                maxWidth='xs'
                fullWidth
            >
                {selectedDeposit && (
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
                                    <SavingsIcon sx={{ color: theme.palette.primary.contrastText, fontSize: 20 }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 700 }}>{selectedDeposit.accountNo}</Typography>
                                    <Chip
                                        label={statusChipProps[selectedDeposit.status].label}
                                        color={statusChipProps[selectedDeposit.status].color}
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

                        <DetailRow
                            icon={<AccountBalanceIcon sx={{ fontSize: 18 }} />}
                            label='Account No'
                            value={selectedDeposit.accountNo}
                        />
                        <Divider />
                        <DetailRow
                            icon={<BadgeIcon sx={{ fontSize: 18 }} />}
                            label='Deposit Amount'
                            value={formatUSD(selectedDeposit.depositAmount)}
                            emphasize
                        />
                        <Divider />
                        <DetailRow
                            icon={<ScheduleIcon sx={{ fontSize: 18 }} />}
                            label='Tenor'
                            value={selectedDeposit.tenor}
                        />
                        <Divider />
                        <DetailRow
                            icon={<PercentIcon sx={{ fontSize: 18 }} />}
                            label='Rate'
                            value={`${selectedDeposit.rate.toFixed(2)}%`}
                        />
                        <Divider />
                        <DetailRow
                            icon={<CalendarMonthIcon sx={{ fontSize: 18 }} />}
                            label='Maturity Date'
                            value={selectedDeposit.maturityDate}
                            emphasize
                        />
                        <Divider />
                        <DetailRow
                            icon={<PaidIcon sx={{ fontSize: 18 }} />}
                            label='Estimated Profit'
                            value={formatUSD(selectedDeposit.estimatedProfit)}
                        />
                        <Divider />
                        <DetailRow
                            icon={<FlagIcon sx={{ fontSize: 18 }} />}
                            label='Status'
                            value={statusChipProps[selectedDeposit.status].label}
                        />
                    </DialogContent>
                )}
            </Dialog>
        </Grid>
    )
}

Page.acl = { action: 'itsHaveAccess', subject: 'view-TDR' }

export default Page