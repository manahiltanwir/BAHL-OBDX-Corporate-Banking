import React, { useEffect, useState } from 'react'
import { styled, useTheme, alpha } from '@mui/material/styles'
import {Box, Card, Chip, CircularProgress, Dialog, DialogContent, Divider, Grid, IconButton, Table, TableBody, TableCell, TableContainer,
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
import { useAuth } from 'src/hooks/useAuth'
import { useTermDeposit } from 'src/@core/hooks/apps/useTermDeposit'
import { TermDepositAccount } from 'src/types/apps/termDeposit'

// ---------- Helpers ----------
const formatAmount = (currency: string, amount: number) =>
    `${currency} ${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// API ki date UTC midnight hoti hai, is liye UTC me format karte hain taake din na badle
const formatDate = (date?: string) => {
    if (!date) return '-'

    return new Date(date)
        .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
        .replace(/ /g, '-')
}

const formatTenor = (years?: number, months?: number, days?: number) => {
    const parts = [
        years ? `${years} ${years === 1 ? 'Year' : 'Years'}` : '',
        months ? `${months} ${months === 1 ? 'Month' : 'Months'}` : '',
        days ? `${days} ${days === 1 ? 'Day' : 'Days'}` : ''
    ].filter(Boolean)

    return parts.length ? parts.join(' ') : '-'
}

// Estimate: principal x rate x din / 365 (bank ka formula/field aaye to sirf yeh function badlega)
const getEstimatedProfit = (deposit: Pick<TermDepositAccount, 'principalAmount' | 'interestRate' | 'depositDate' | 'maturityDate'>) => {
    const days = Math.max(
        Math.round((new Date(deposit.maturityDate).getTime() - new Date(deposit.depositDate).getTime()) / 86400000),
        0
    )

    return (deposit.principalAmount * deposit.interestRate * days) / 100 / 365
}

const getStatusChip = (status: string): { label: string; color: 'primary' | 'default' } => ({
    label: status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : '-',
    color: String(status).toUpperCase() === 'ACTIVE' ? 'primary' : 'default'
})

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

const Page = () => {
    const theme = useTheme()
    const { user } = useAuth()
    const partyId = user?.partyId as string | undefined

    const { accounts, details, status, isLoading, isDetailsLoading, getAccounts, getDetails, clearDetails, clearAll } =
        useTermDeposit()

    const [selectedDeposit, setSelectedDeposit] = useState<TermDepositAccount | null>(null)

    // Page khulte hi party ke term deposits load karo (error ka toast slice me ApiError dikha deta hai)
    useEffect(() => {
        if (!partyId) return

        getAccounts(partyId).catch(() => undefined)

        return () => {
            clearAll()
        }
    }, [partyId])

    const handleRowClick = (deposit: TermDepositAccount) => {
        if (!partyId) return

        clearDetails()
        setSelectedDeposit(deposit)
        getDetails(partyId, deposit.accountId).catch(() => undefined)
    }

    const handleCloseModal = () => {
        setSelectedDeposit(null)
        clearDetails()
    }

    // Details aa jayein to wo, warna list ka data (modal foran khul jaye)
    const view = selectedDeposit ? (details && details.accountId === selectedDeposit.accountId ? details : selectedDeposit) : null
    const detailsReady = Boolean(details && selectedDeposit && details.accountId === selectedDeposit.accountId)

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
                                    <TableCell>Product</TableCell>
                                    <TableCell>Rate</TableCell>
                                    <TableCell>Maturity Date</TableCell>
                                    <TableCell>Estimated Profit</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </StyledTableHead>

                            <TableBody>
                                {accounts.map(deposit => {
                                    const chip = getStatusChip(deposit.accountStatus)

                                    return (
                                        <StyledTableRow key={deposit.accountId} onClick={() => handleRowClick(deposit)}>
                                            <TableCell>
                                                <Typography variant='body2' sx={{ fontWeight: 700 }}>
                                                    {deposit.accountId}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant='body2' color='text.secondary'>
                                                    {formatAmount(deposit.currency, deposit.principalAmount)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant='body2' color='primary.main' sx={{ fontWeight: 600 }}>
                                                    {deposit.productId}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant='body2' color='text.secondary'>
                                                    {Number(deposit.interestRate).toFixed(2)}%
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant='body2' sx={{ fontWeight: 700 }}>
                                                    {formatDate(deposit.maturityDate)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant='body2' sx={{ fontWeight: 700, color: 'primary.main' }}>
                                                    {formatAmount(deposit.currency, getEstimatedProfit(deposit))}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={chip.label}
                                                    color={chip.color}
                                                    size='small'
                                                    sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                                                />
                                            </TableCell>
                                        </StyledTableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {isLoading && (
                        <Box sx={{ py: 6, textAlign: 'center' }}>
                            <CircularProgress size={28} />
                        </Box>
                    )}

                    {!isLoading && status === 'error' && (
                        <Box sx={{ py: 6, textAlign: 'center' }}>
                            <Typography variant='body2' color='text.secondary'>
                                Unable to load term deposits.
                            </Typography>
                        </Box>
                    )}

                    {!isLoading && status === 'success' && accounts.length === 0 && (
                        <Box sx={{ py: 6, textAlign: 'center' }}>
                            <Typography variant='body2' color='text.secondary'>
                                No term deposits found.
                            </Typography>
                        </Box>
                    )}
                </StyledCard>
            </Grid>

            <Dialog open={!!selectedDeposit} onClose={handleCloseModal} maxWidth='xs' fullWidth>
                {selectedDeposit && view && (
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
                                    <Typography sx={{ fontWeight: 700 }}>{view.accountId}</Typography>
                                    <Chip
                                        label={getStatusChip(view.accountStatus).label}
                                        color={getStatusChip(view.accountStatus).color}
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

                        {isDetailsLoading && !detailsReady && (
                            <Box sx={{ py: 4, textAlign: 'center' }}>
                                <CircularProgress size={26} />
                            </Box>
                        )}

                        {(detailsReady || !isDetailsLoading) && (
                            <>
                                <DetailRow
                                    icon={<AccountBalanceIcon sx={{ fontSize: 18 }} />}
                                    label='Account No'
                                    value={view.accountId}
                                />
                                <Divider />
                                <DetailRow
                                    icon={<BadgeIcon sx={{ fontSize: 18 }} />}
                                    label='Deposit Amount'
                                    value={formatAmount(view.currency, view.principalAmount)}
                                    emphasize
                                />
                                <Divider />
                                <DetailRow
                                    icon={<ScheduleIcon sx={{ fontSize: 18 }} />}
                                    label='Tenor'
                                    value={
                                        detailsReady && details
                                            ? formatTenor(details.tenureYears, details.tenureMonths, details.tenureDays)
                                            : '-'
                                    }
                                />
                                <Divider />
                                <DetailRow
                                    icon={<PercentIcon sx={{ fontSize: 18 }} />}
                                    label='Rate'
                                    value={`${Number(view.interestRate).toFixed(2)}%`}
                                />
                                <Divider />
                                <DetailRow
                                    icon={<CalendarMonthIcon sx={{ fontSize: 18 }} />}
                                    label='Maturity Date'
                                    value={formatDate(view.maturityDate)}
                                    emphasize
                                />
                                <Divider />
                                <DetailRow
                                    icon={<PaidIcon sx={{ fontSize: 18 }} />}
                                    label='Estimated Profit'
                                    value={formatAmount(view.currency, getEstimatedProfit(view))}
                                />
                                <Divider />
                                <DetailRow
                                    icon={<FlagIcon sx={{ fontSize: 18 }} />}
                                    label='Status'
                                    value={getStatusChip(view.accountStatus).label}
                                />
                            </>
                        )}
                    </DialogContent>
                )}
            </Dialog>
        </Grid>
    )
}

Page.acl = {
    action: 'itsHaveAccess',
    subject: 'corporate-account-term-deposit-view-TDR-page'
}

export default Page