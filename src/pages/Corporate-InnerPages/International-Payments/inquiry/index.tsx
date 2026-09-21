import { useMemo, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Tab,
    Tabs,
    Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import CancelIcon from '@mui/icons-material/Cancel'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import ResultsTable from 'src/@core/components/Resultstable'
import PaymentSuccessReceipt from 'src/@core/components/apps/payments/PaymentSuccessReceipt'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type PaymentType = 'single' | 'bulk'
type PaymentStatus = 'success' | 'pending' | 'active' | 'reject'

interface PaymentRecord {
    id: string
    type: PaymentType
    reference: string
    beneficiary: string
    bank: string
    accountNumber: string
    amount: number
    currency: string
    date: string
    status: PaymentStatus
    totalRecords?: number // bulk only
}

// -----------------------------------------------------------------------------
// Mock data — replace with real API call (e.g. usePaymentInquiry hook) later
// -----------------------------------------------------------------------------

const mockPayments: PaymentRecord[] = [
    {
        id: 'p1',
        type: 'single',
        reference: 'TXN-2026-00891',
        beneficiary: 'Ali Raza',
        bank: 'HBL - Habib Bank Limited',
        accountNumber: 'PK27BAHL6002098102054201',
        amount: 125000,
        currency: 'USD',
        date: '18 Sep 2026, 11:42 AM',
        status: 'success'
    },
    {
        id: 'p2',
        type: 'bulk',
        reference: 'BATCH-OFTT-2026-4821',
        beneficiary: '48 Beneficiaries',
        bank: 'Multiple Banks',
        accountNumber: 'PK36BAHL0000123456789001',
        amount: 4820000,
        currency: 'USD',
        date: '19 Sep 2026, 3:05 PM',
        status: 'pending',
        totalRecords: 48
    },

    {
        id: 'p4',
        type: 'bulk',
        reference: 'BATCH-OFTT-2026-4790',
        beneficiary: '12 Beneficiaries',
        bank: 'Multiple Banks',
        accountNumber: 'PK36BAHL0000123456789002',
        amount: 980000,
        currency: 'USD',
        date: '20 Sep 2026, 5:30 PM',
        status: 'success',
        totalRecords: 12
    },
    {
        id: 'p5',
        type: 'single',
        reference: 'TXN-2026-00915',
        beneficiary: 'Ahmed Hussain',
        bank: 'Meezan Bank',
        accountNumber: 'PK27BAHL6002098102054209',
        amount: 75000,
        currency: 'USD',
        date: '21 Sep 2026, 10:20 AM',
        status: 'pending'
    },
    {
        id: 'p6',
        type: 'bulk',
        reference: 'BATCH-OFTT-2026-4655',
        beneficiary: '5 Beneficiaries',
        bank: 'Multiple Banks',
        accountNumber: 'PK36BAHL0000123456789001',
        amount: 150000,
        currency: 'USD',
        date: '21 Sep 2026, 2:10 PM',
        status: 'reject',
        totalRecords: 5
    }
]

const statusConfig: Record<PaymentStatus, { label: string; color: 'success' | 'warning' | 'secondary' | 'error'; icon: JSX.Element }> = {
    success: { label: 'Success', color: 'success', icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
    pending: { label: 'Pending', color: 'warning', icon: <HourglassEmptyIcon sx={{ fontSize: 14 }} /> },
    active: { label: 'Active', color: 'secondary', icon: <AutorenewIcon sx={{ fontSize: 14 }} /> },
    reject: { label: 'Rejected', color: 'error', icon: <CancelIcon sx={{ fontSize: 14 }} /> }
}

const typeLabels: Record<PaymentType, string> = {
    single: 'Single',
    bulk: 'Bulk'
}

const columns = [
    { key: 'type', label: 'Type' },
    { key: 'reference', label: 'Reference' },
    { key: 'beneficiary', label: 'Beneficiary' },
    { key: 'amount', label: 'Amount' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' }
]

const gridTemplateColumns = '0.8fr 1.6fr 1.8fr 1.3fr 1.6fr 1fr'

// ** Small helper for the view modal's label/value rows
const ReviewItem = ({ label, value }: { label: string; value?: string }) => (
    <Grid item xs={12} sm={6}>
        <Typography variant='caption' sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {label}
        </Typography>
        <Typography variant='body2' sx={{ fontWeight: 500, mt: 0.5 }}>
            {value || '—'}
        </Typography>
    </Grid>
)

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

type FilterTab = 'all' | PaymentType

const Page = () => {
    const theme = useTheme()

    const [filter, setFilter] = useState<FilterTab>('all')

    const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)
    const [viewOpen, setViewOpen] = useState(false)

    const [receiptOpen, setReceiptOpen] = useState(false)

    const filteredPayments = useMemo(
        () => (filter === 'all' ? mockPayments : mockPayments.filter(payment => payment.type === filter)),
        [filter]
    )

    const handleRowClick = (payment: PaymentRecord) => {
        setSelectedPayment(payment)
        setViewOpen(true)
    }

    const handleCloseView = () => {
        setViewOpen(false)
        setSelectedPayment(null)
    }

    const handleShowReceipt = () => {
        setViewOpen(false)
        setReceiptOpen(true)
    }

    const handleCloseReceipt = () => {
        setReceiptOpen(false)
        setSelectedPayment(null)
    }

    const formatAmount = (payment: PaymentRecord) =>
        `${payment.currency} ${payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

    return (
        <Box>
            <Typography variant='h5' sx={{ fontWeight: 700, mb: 1 }}>
                Payment Inquiry
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                Track the status of your single and bulk payments in one place.
            </Typography>

            <Tabs
                value={filter}
                onChange={(_event, value: FilterTab) => setFilter(value)}
                sx={{ mb: 1, minHeight: 36, '& .MuiTab-root': { minHeight: 36, textTransform: 'none', fontWeight: 600 } }}
            >
                <Tab value='all' label='All Payments' />
                <Tab value='single' label='Single Payment' />
                <Tab value='bulk' label='Bulk Payment' />
            </Tabs>

            <ResultsTable<PaymentRecord>
                columns={columns}
                rows={filteredPayments}
                getRowKey={payment => payment.id}
                gridTemplateColumns={gridTemplateColumns}
                headerColor={theme.palette.primary.main}
                emptyMessage='No Payments Found'
                onRowClick={handleRowClick}
                renderRow={payment => (
                    <>
                        <Chip
                            label={typeLabels[payment.type]}
                            size='small'
                            color='primary'
                            variant='outlined'
                            sx={{ fontWeight: 700, width: 'fit-content', justifySelf: 'start', whiteSpace: 'nowrap' }}
                        />

                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {payment.reference}
                        </Typography>

                        <Typography variant='body2'>{payment.beneficiary}</Typography>

                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {formatAmount(payment)}
                        </Typography>

                        <Typography variant='body2' color='text.secondary'>
                            {payment.date}
                        </Typography>

                        <Chip
                            size='small'
                            icon={statusConfig[payment.status].icon}
                            label={statusConfig[payment.status].label}
                            color={statusConfig[payment.status].color}
                            variant='outlined'
                            sx={{ fontWeight: 700, width: 'fit-content', justifySelf: 'start' }}
                        />
                    </>
                )}
            />

            {/* Payment Details Modal */}
            <Dialog open={viewOpen} onClose={handleCloseView} maxWidth='sm' fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Payment Details
                    <IconButton size='small' onClick={handleCloseView}>
                        <CloseIcon fontSize='small' />
                    </IconButton>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ pt: 4 }}>
                    {selectedPayment && (
                        <Grid container spacing={4}>
                            <ReviewItem label='Payment Type' value={typeLabels[selectedPayment.type]} />
                            <ReviewItem label='Reference' value={selectedPayment.reference} />
                            <ReviewItem
                                label={selectedPayment.type === 'bulk' ? 'Beneficiaries' : 'Beneficiary'}
                                value={selectedPayment.beneficiary}
                            />
                            <ReviewItem label='Bank' value={selectedPayment.bank} />
                            <ReviewItem label='Account Number / IBAN' value={selectedPayment.accountNumber} />
                            <ReviewItem label='Amount' value={formatAmount(selectedPayment)} />
                            <ReviewItem label='Date & Time' value={selectedPayment.date} />
                            <ReviewItem label='Status' value={statusConfig[selectedPayment.status].label} />
                            {selectedPayment.type === 'bulk' && (
                                <ReviewItem label='Total Records' value={String(selectedPayment.totalRecords ?? '—')} />
                            )}
                        </Grid>
                    )}
                </DialogContent>

                <Divider />

                <DialogActions sx={{ p: 3 }}>
                    <Button variant='outlined' color='secondary' onClick={handleCloseView}>
                        Close
                    </Button>

                    {/* Sirf Success status ke liye receipt button */}
                    {selectedPayment?.status === 'success' && (
                        <Button
                            variant='contained'
                            startIcon={<ReceiptLongIcon fontSize='small' />}
                            onClick={handleShowReceipt}
                        >
                            Show Payment Receipt
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Payment Receipt Modal */}
            <Dialog open={receiptOpen} onClose={handleCloseReceipt} maxWidth='md' fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Payment Receipt
                    <IconButton size='small' onClick={handleCloseReceipt}>
                        <CloseIcon fontSize='small' />
                    </IconButton>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ pt: 4, bgcolor: 'action.hover' }}>
                    {selectedPayment && (
                        <PaymentSuccessReceipt
                            headline='Payment Successful'
                            description='This payment has been completed successfully.'
                            amountText={formatAmount(selectedPayment)}
                            amountSubtext={
                                <>
                                    sent to <strong>{selectedPayment.beneficiary}</strong>
                                </>
                            }
                            referenceId={selectedPayment.reference}
                            homeLabel='Close'
                            onGoHome={handleCloseReceipt}
                            newActionLabel='Back to Inquiry'
                            onNewAction={handleCloseReceipt}
                            metaRows={[
                                { label: 'Reference ID', value: selectedPayment.reference },
                                { label: 'Payment Type', value: typeLabels[selectedPayment.type] },
                                { label: 'Date & Time', value: selectedPayment.date },
                                { label: 'Status', value: statusConfig[selectedPayment.status].label }
                            ]}
                            sections={[
                                {
                                    title: selectedPayment.type === 'bulk' ? 'Beneficiaries' : 'Beneficiary',
                                    rows: [
                                        {
                                            icon: <AccountBalanceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />,
                                            label: 'Bank',
                                            value: selectedPayment.bank
                                        },
                                        { label: 'Account Number / IBAN', value: selectedPayment.accountNumber },
                                        {
                                            icon: <PersonOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />,
                                            label: selectedPayment.type === 'bulk' ? 'Beneficiaries' : 'Beneficiary Name',
                                            value: selectedPayment.beneficiary
                                        },
                                        ...(selectedPayment.type === 'bulk'
                                            ? [{ label: 'Total Records', value: String(selectedPayment.totalRecords ?? '—') }]
                                            : [])
                                    ]
                                }
                            ]}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    )
}

Page.acl = { action: 'itsHaveAccess', subject: 'inquiry' }

export default Page