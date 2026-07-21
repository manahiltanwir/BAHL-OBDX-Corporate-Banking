import React, { useState, SyntheticEvent } from 'react'
import { useRouter } from 'next/router'
import {
    Typography,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Box,
    Chip,
    Divider,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Stack,
    Button,
    IconButton,
    Tooltip
} from '@mui/material'

// ** Icons
import DownloadOutline from 'mdi-material-ui/DownloadOutline'
import PrinterOutline from 'mdi-material-ui/PrinterOutline'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import ArrowLeft from 'mdi-material-ui/ArrowLeft'
import BankOutline from 'mdi-material-ui/BankOutline'
import FileDocumentOutline from 'mdi-material-ui/FileDocumentOutline'
import HistoryIcon from 'mdi-material-ui/History'
import TruckDeliveryOutline from 'mdi-material-ui/TruckDeliveryOutline'
import LinkVariant from 'mdi-material-ui/LinkVariant'
import ForumOutline from 'mdi-material-ui/ForumOutline'
import CashMultiple from 'mdi-material-ui/CashMultiple'
import PaperclipIcon from 'mdi-material-ui/Paperclip'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface DetailRowProps {
    label: string
    value: React.ReactNode
}

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

// ---------------------------------------------------------------------------
// Dummy detail data — API se lcNumber (router.query.lcNumber) ke basis par
// fetch hoga, e.g. useEffect(() => { fetchLCDetail(lcNumber) }, [lcNumber])
//
// Shape yahan ImportLCApplicationState (importLcTypes.ts) ke fields ko
// mirror karti hai, taake Create-LC form mein jo bhi input liya ja raha
// hai wohi sab View-LC screen par bhi dikhaya ja sake.
// ---------------------------------------------------------------------------
const lcDetailData = {
    lcNumber: 'ILC-2026-004521',
    status: 'Active',
    applicationDate: '02-Jun-2026',
    issueDate: '05-Jun-2026',

    // ---- Category 1: LC Details ----
    customerType: 'Existing',
    applicantName: 'Al-Habib Textiles (Pvt) Ltd',
    applicantAddress: 'Plot 12, Sector 24, Korangi Industrial Area, Karachi, Pakistan',
    applicantAccount: '0110-0234567-01',
    accounteeName: 'Al-Habib Textiles (Pvt) Ltd',
    isTransferable: false,

    lcType: 'Sight',
    isRevolving: false,
    productId: 'PROD_IMPORT_SIGHT',
    expiryDate: '30-Sep-2026',
    expiryPlace: 'Karachi, Pakistan',
    customerReferenceNumber: 'REF-TXT-2216',

    beneficiaryType: 'Existing',
    beneficiaryName: 'Guangzhou Fabric Trading Co. Ltd',
    beneficiaryAddress: '88 Huanshi Road, Yuexiu District, Guangzhou, China',
    beneficiaryCountry: 'China',

    currency: 'USD',
    lcAmount: 485000,
    underTolerancePercent: 0,
    aboveTolerancePercent: 5,
    additionalAmountCovered: 'N/A',

    creditAvailableBy: 'BY NEGOTIATION',
    creditAvailableWith: 'Any Bank',

    drafts: [
        { id: 'd1', tenor: 'Sight', creditDaysFrom: 'B/L Date', draweeBank: 'MCB Bank Limited', amount: 485000 }
    ],

    issuingBank: 'MCB Bank Limited, Karachi',
    advisingBank: 'Bank of China, Guangzhou Branch',
    confirmingBank: 'N/A',

    // ---- Category 2: Goods & Shipment ----
    partialShipment: 'DISALLOWED',
    transShipment: 'DISALLOWED',
    placeOfTakingInCharge: 'Shenzhen Port, China',
    portOfLoading: 'Shenzhen Port, China',
    portOfDischarge: 'Port Qasim, Karachi',
    placeOfFinalDestination: 'Karachi, Pakistan',
    shipmentInputType: 'Date',
    latestShipmentDate: '15-Sep-2026',
    shipmentPeriod: '',

    goods: [
        {
            id: 'g1',
            category: 'Cotton Fabric',
            description:
                '100% Cotton Grey Fabric, 40x40 count, 133x72 construction, as per Proforma Invoice No. PI-GZ-2216 dated 20-May-2026.'
        }
    ],

    // ---- Category 3: Documents & Conditions ----
    documents: [
        { id: 'doc1', selected: true, name: 'Commercial Invoice', originals: 1, copies: 2 },
        { id: 'doc2', selected: true, name: 'Packing List', originals: 1, copies: 2 },
        { id: 'doc3', selected: true, name: 'Bill of Lading / Airway Bill', originals: 3, copies: 3 },
        { id: 'doc4', selected: true, name: 'Certificate of Origin', originals: 1, copies: 1 },
        { id: 'doc5', selected: false, name: 'Insurance Certificate / Policy', originals: 1, copies: 1 },
        { id: 'doc6', selected: false, name: 'Inspection Certificate', originals: 1, copies: 1 },
        { id: 'doc7', selected: true, name: "Beneficiary's Certificate", originals: 1, copies: 1 },
        { id: 'doc8', selected: false, name: 'Weight Certificate', originals: 1, copies: 1 },
        { id: 'doc9', selected: false, name: 'Phytosanitary Certificate', originals: 1, copies: 1 },
        { id: 'doc10', selected: false, name: 'Fumigation Certificate', originals: 1, copies: 1 }
    ],

    conditions: [
        {
            id: 'c1',
            code: 'ADD-01',
            identifier: 'Language',
            description: 'All documents must be presented in English.'
        },
        {
            id: 'c2',
            code: 'ADD-02',
            identifier: 'Third Party Docs',
            description: 'Third party documents acceptable except for Draft/Invoice.'
        },
        {
            id: 'c3',
            code: 'ADD-03',
            identifier: 'Presentation Period',
            description: 'Documents to be presented within 21 days after shipment date but within LC validity.'
        }
    ],

    presentationDays: '21 days after shipment',
    incoterms: 'CFR',

    // ---- Category 4: Linkages ----
    collateralCurrency: 'USD',
    collateralPercent: 100,
    collaterals: [
        {
            id: 'col1',
            accountNumber: '0110-0234567-01',
            balance: 550000,
            contributionPercent: 100,
            exchangeRate: 1,
            calculatedAmount: 509250
        }
    ],
    margins: [{ id: 'mar1', accountNumber: '0110-0234567-02', amount: 25000, maturityDate: '30-Sep-2026' }],

    // ---- Category 5: Instructions & Insurance ----
    advisingBankType: 'SWIFT',
    advisingBankSwift: 'BKCHCNBJ400',
    specialPaymentConditionsBeneficiary: 'N/A',
    specialPaymentConditionsBank: 'N/A',
    confirmationInstruction: 'WITHOUT',
    requestedConfirmationParty: 'ADVISING_BANK',
    senderToReceiverInfo: 'Please advise beneficiary without adding your confirmation.',
    chargesDetails: 'All banking charges outside Pakistan are for beneficiary account.',
    selectedInsurancePolicyId: 'N/A',

    // ---- Category 6: Charges & Attachments ----
    charges: [
        { id: 'ch1', accountNumber: '0110-0234567-01', description: 'LC Issuance Charges', currency: 'USD', amount: 450 }
    ],
    taxes: [{ id: 'tx1', accountNumber: '0110-0234567-01', description: 'FED / Sales Tax', currency: 'USD', amount: 72 }],
    commissions: [
        { id: 'cm1', accountNumber: '0110-0234567-01', description: 'Negotiation Commission', currency: 'USD', amount: 120 }
    ],
    attachedFileName: 'proforma-invoice-PI-GZ-2216.jpg',
    saveAsTemplate: false,
    templateName: '',
    accessType: 'Private',

    amendments: [
        { srNo: 1, date: '18-Jun-2026', description: 'Latest shipment date extended from 31-Aug-2026 to 15-Sep-2026', status: 'Accepted' },
        { srNo: 2, date: '02-Jul-2026', description: 'LC amount increased by USD 25,000.00', status: 'Accepted' }
    ]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
// const statusColor = (status: string) => {
//     switch (status) {
//         case 'Active':
//             return 'success'
//         case 'Expired':
//         case 'Rejected':
//         case 'Cancelled':
//             return 'error'
//         case 'Hold':
//             return 'warning'
//         case 'Closed':
//             return 'default'
//         default:
//             return 'default'
//     }
// }
const colors = {
    green: '#2e7d32'
}

const statusStyles: Record<string, { bg: string; color: string }> = {
    Active: { bg: '#e5f3ec', color: colors.green },
    Hold: { bg: '#fef4e5', color: '#b8770e' },
    Rejected: { bg: '#fbe9e9', color: '#c62828' },
    Cancelled: { bg: '#fbe9e9', color: '#c62828' },
    Closed: { bg: '#eceff1', color: '#546e7a' },
    Expired: { bg: '#fbe9e9', color: '#c62828' }
}
const fmtAmount = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const DetailRow = ({ label, value }: DetailRowProps) => (
    <Grid item xs={12} sm={6} md={4}>
        <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', letterSpacing: '0.4px' }}>
            {label}
        </Typography>
        <Typography variant='body1' sx={{ fontWeight: 500, mt: 0.5 }}>
            {value === '' || value == null ? '—' : value}
        </Typography>
    </Grid>
)

const TabPanel = ({ children, value, index }: TabPanelProps) => (
    <div role='tabpanel' hidden={value !== index}>
        {value === index && <Box sx={{ pt: 5 }}>{children}</Box>}
    </div>
)

const SectionHeading = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 3 }}>
        <Icon color='primary' />
        <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
            {title}
        </Typography>
    </Stack>
)

// ---------------------------------------------------------------------------
// Screen 2: LC Detail — separate route, e.g.
// pages/corporate-banking/view-lc/[lcNumber].tsx
// ---------------------------------------------------------------------------
const Page = () => {
    const router = useRouter()
    const { lcNumber } = router.query // URL se aayega, API call isi se hogi

    const [tab, setTab] = useState<number>(0)

    // Filhal dummy data use ho raha hai; real app mein lcNumber se fetch karke
    // state mein set karna hoga (useEffect + API call)
    const lcData = lcDetailData

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setTab(newValue)
    }

    const totalExposure = lcData.lcAmount + (lcData.lcAmount * lcData.aboveTolerancePercent) / 100
    const requiredCollateral = (totalExposure * lcData.collateralPercent) / 100
    const chargesTotal = lcData.charges.reduce((s, r) => s + r.amount, 0)
    const taxesTotal = lcData.taxes.reduce((s, r) => s + r.amount, 0)
    const commissionsTotal = lcData.commissions.reduce((s, r) => s + r.amount, 0)

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5, flexWrap: 'wrap', gap: 3 }}>
                <Stack direction='row' spacing={2} alignItems='center'>
                    <Tooltip title='Back to search results'>
                        <IconButton
                            size='small'
                            onClick={() => router.back()}
                            sx={{ border: theme => `1px solid ${theme.palette.divider}` }}
                        >
                            <ArrowLeft />
                        </IconButton>
                    </Tooltip>
                    <Box>
                        <Typography variant='h5' sx={{ fontWeight: 600 }}>
                            Letter of Credit — {lcNumber ?? lcData.lcNumber}
                        </Typography>
                        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                            {lcData.lcType} Documentary Credit &middot; Issued {lcData.issueDate}
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction='row' spacing={2} alignItems='center'>
                    {/* <Chip label={lcData.status} color={statusColor(lcData.status) as any} sx={{ fontWeight: 600 }} /> */}
                    <Chip
                        label={lcData.status}
                        sx={{
                            fontWeight: 600,
                            bgcolor: statusStyles[lcData.status]?.bg ?? '#eceff1',
                            color: statusStyles[lcData.status]?.color ?? '#546e7a'
                        }}
                    />
                    <Tooltip title='Print'>
                        <IconButton size='small' sx={{ border: theme => `1px solid ${theme.palette.divider}` }}>
                            <PrinterOutline fontSize='small' />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Download SWIFT MT700'>
                        <IconButton size='small' sx={{ border: theme => `1px solid ${theme.palette.divider}` }}>
                            <DownloadOutline fontSize='small' />
                        </IconButton>
                    </Tooltip>
                    <Button variant='contained' startIcon={<PencilOutline />}>
                        Request Amendment
                    </Button>
                </Stack>
            </Box>

            <Grid container spacing={6}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent sx={{ pb: 0 }}>
                            <Tabs
                                value={tab}
                                onChange={handleChange}
                                variant='scrollable'
                                scrollButtons='auto'
                                sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
                            >
                                <Tab label='LC Details' />
                                <Tab label='Goods & Shipment' />
                                <Tab label='Documents & Conditions' />
                                <Tab label='Linkages' />
                                <Tab label='Instructions & Insurance' />
                                <Tab label='Charges & Attachments' />
                                <Tab label='Amendment History' />
                            </Tabs>

                            {/* ---------------- Tab 0: LC Details ---------------- */}
                            <TabPanel value={tab} index={0}>
                                <SectionHeading icon={BankOutline} title='Applicant & Accountee' />
                                <Grid container spacing={5}>
                                    <DetailRow label='Customer Type' value={lcData.customerType} />
                                    <DetailRow label='Applicant Name' value={lcData.applicantName} />
                                    <DetailRow label='Accountee Name' value={lcData.accounteeName} />
                                    <DetailRow label='Applicant Account' value={lcData.applicantAccount} />
                                    <DetailRow label='Transferable LC' value={lcData.isTransferable ? 'Yes' : 'No'} />
                                    <DetailRow label='Applicant Address' value={lcData.applicantAddress} />
                                </Grid>

                                <Divider sx={{ my: 6 }} />

                                <SectionHeading icon={FileDocumentOutline} title='LC Type & Product' />
                                <Grid container spacing={5}>
                                    <DetailRow label='LC Number' value={lcData.lcNumber} />
                                    <DetailRow label='LC Type' value={lcData.lcType} />
                                    <DetailRow label='Product ID' value={lcData.productId} />
                                    <DetailRow label='Revolving LC' value={lcData.isRevolving ? 'Yes' : 'No'} />
                                    <DetailRow label='Application Date' value={lcData.applicationDate} />
                                    <DetailRow label='Issue Date' value={lcData.issueDate} />
                                    <DetailRow label='Expiry Date' value={lcData.expiryDate} />
                                    <DetailRow label='Expiry Place' value={lcData.expiryPlace} />
                                    <DetailRow label='Customer Reference Number' value={lcData.customerReferenceNumber} />
                                </Grid>

                                <Divider sx={{ my: 6 }} />

                                <SectionHeading icon={BankOutline} title='Beneficiary' />
                                <Grid container spacing={5}>
                                    <DetailRow label='Beneficiary Type' value={lcData.beneficiaryType} />
                                    <DetailRow label='Beneficiary Name' value={lcData.beneficiaryName} />
                                    <DetailRow label='Beneficiary Country' value={lcData.beneficiaryCountry} />
                                    <DetailRow label='Beneficiary Address' value={lcData.beneficiaryAddress} />
                                </Grid>

                                <Divider sx={{ my: 6 }} />

                                <SectionHeading icon={CashMultiple} title='Amount & Tolerance' />
                                <Grid container spacing={5}>
                                    <DetailRow label='Currency' value={lcData.currency} />
                                    <DetailRow label='LC Amount' value={`${lcData.currency} ${fmtAmount(lcData.lcAmount)}`} />
                                    <DetailRow label='Under Tolerance (%)' value={`${lcData.underTolerancePercent}%`} />
                                    <DetailRow label='Above Tolerance (%)' value={`${lcData.aboveTolerancePercent}%`} />
                                    <DetailRow label='Additional Amount Covered' value={lcData.additionalAmountCovered} />
                                </Grid>

                                <Divider sx={{ my: 6 }} />

                                <SectionHeading icon={CashMultiple} title='Credit Availability' />
                                <Grid container spacing={5}>
                                    <DetailRow label='Credit Available By' value={lcData.creditAvailableBy} />
                                    <DetailRow label='Credit Available With' value={lcData.creditAvailableWith} />
                                </Grid>

                                {lcData.drafts.length > 0 && (
                                    <React.Fragment>
                                        <Divider sx={{ my: 6 }} />
                                        <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 3 }}>
                                            Drafts
                                        </Typography>
                                        <TableContainer component={Paper} variant='outlined'>
                                            <Table size='small'>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Tenor</TableCell>
                                                        <TableCell>Credit Days From</TableCell>
                                                        <TableCell>Drawee Bank</TableCell>
                                                        <TableCell align='right'>Amount</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {lcData.drafts.map(row => (
                                                        <TableRow key={row.id}>
                                                            <TableCell>{row.tenor}</TableCell>
                                                            <TableCell>{row.creditDaysFrom}</TableCell>
                                                            <TableCell>{row.draweeBank}</TableCell>
                                                            <TableCell align='right'>{fmtAmount(row.amount)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </React.Fragment>
                                )}

                                <Divider sx={{ my: 6 }} />

                                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 3 }}>
                                    Banks Involved
                                </Typography>
                                <Grid container spacing={5}>
                                    <DetailRow label='Issuing Bank' value={lcData.issuingBank} />
                                    <DetailRow label='Advising Bank' value={lcData.advisingBank} />
                                    <DetailRow label='Confirming Bank' value={lcData.confirmingBank} />
                                </Grid>
                            </TabPanel>

                            {/* ---------------- Tab 1: Goods & Shipment ---------------- */}
                            <TabPanel value={tab} index={1}>
                                <SectionHeading icon={TruckDeliveryOutline} title='Shipment Terms' />
                                <Grid container spacing={5}>
                                    <DetailRow label='Partial Shipment' value={lcData.partialShipment} />
                                    <DetailRow label='Trans-Shipment' value={lcData.transShipment} />
                                    <DetailRow label='Place of Taking in Charge' value={lcData.placeOfTakingInCharge} />
                                    <DetailRow label='Port of Loading' value={lcData.portOfLoading} />
                                    <DetailRow label='Port of Discharge' value={lcData.portOfDischarge} />
                                    <DetailRow label='Place of Final Destination' value={lcData.placeOfFinalDestination} />
                                    <DetailRow
                                        label={lcData.shipmentInputType === 'Date' ? 'Latest Shipment Date' : 'Shipment Period'}
                                        value={lcData.shipmentInputType === 'Date' ? lcData.latestShipmentDate : lcData.shipmentPeriod}
                                    />
                                    <DetailRow label='Incoterms' value={lcData.incoterms} />
                                </Grid>

                                <Divider sx={{ my: 6 }} />

                                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 3 }}>
                                    Goods
                                </Typography>
                                <TableContainer component={Paper} variant='outlined'>
                                    <Table size='small'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width={220}>Category</TableCell>
                                                <TableCell>Description</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {lcData.goods.map(row => (
                                                <TableRow key={row.id}>
                                                    <TableCell>{row.category}</TableCell>
                                                    <TableCell>{row.description}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>

                            {/* ---------------- Tab 2: Documents & Conditions ---------------- */}
                            <TabPanel value={tab} index={2}>
                                <SectionHeading icon={FileDocumentOutline} title='Documents Required for Presentation' />
                                <TableContainer component={Paper} variant='outlined'>
                                    <Table size='small'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Document</TableCell>
                                                <TableCell align='right'>Originals</TableCell>
                                                <TableCell align='right'>Copies</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {lcData.documents
                                                .filter(d => d.selected)
                                                .map(row => (
                                                    <TableRow key={row.id}>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell align='right'>{row.originals}</TableCell>
                                                        <TableCell align='right'>{row.copies}</TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Divider sx={{ my: 6 }} />

                                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 3 }}>
                                    Additional Conditions
                                </Typography>
                                <TableContainer component={Paper} variant='outlined'>
                                    <Table size='small'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width={100}>Code</TableCell>
                                                <TableCell width={160}>Identifier</TableCell>
                                                <TableCell>Description</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {lcData.conditions.map(row => (
                                                <TableRow key={row.id}>
                                                    <TableCell>{row.code}</TableCell>
                                                    <TableCell>{row.identifier}</TableCell>
                                                    <TableCell>{row.description}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Divider sx={{ my: 6 }} />

                                <Grid container spacing={5}>
                                    <DetailRow label='Presentation Days' value={lcData.presentationDays} />
                                    <DetailRow label='Incoterms' value={lcData.incoterms} />
                                </Grid>
                            </TabPanel>

                            {/* ---------------- Tab 3: Linkages ---------------- */}
                            <TabPanel value={tab} index={3}>
                                <Grid container spacing={3} sx={{ mb: 5 }}>
                                    <Grid item xs={12} sm={6}>
                                        <Card variant='outlined' sx={{ p: 3, borderRadius: 2 }}>
                                            <Typography variant='caption' color='text.secondary'>
                                                Total Exposure
                                            </Typography>
                                            <Typography variant='h6' sx={{ fontWeight: 700 }}>
                                                {lcData.currency} {fmtAmount(totalExposure)}
                                            </Typography>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Card variant='outlined' sx={{ p: 3, borderRadius: 2 }}>
                                            <Typography variant='caption' color='text.secondary'>
                                                Required Collateral
                                            </Typography>
                                            <Typography variant='h6' sx={{ fontWeight: 700 }}>
                                                {lcData.collateralCurrency} {fmtAmount(requiredCollateral)}
                                            </Typography>
                                        </Card>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={5} sx={{ mb: 5 }}>
                                    <DetailRow label='Collateral Currency' value={lcData.collateralCurrency} />
                                    <DetailRow label='Collateral (%)' value={`${lcData.collateralPercent}%`} />
                                </Grid>

                                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 3 }}>
                                    Collateral Accounts
                                </Typography>
                                <TableContainer component={Paper} variant='outlined' sx={{ mb: 6 }}>
                                    <Table size='small'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Account Number</TableCell>
                                                <TableCell align='right'>Balance</TableCell>
                                                <TableCell align='right'>Contribution %</TableCell>
                                                <TableCell align='right'>Exchange Rate</TableCell>
                                                <TableCell align='right'>Calculated Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {lcData.collaterals.map(row => (
                                                <TableRow key={row.id}>
                                                    <TableCell>{row.accountNumber}</TableCell>
                                                    <TableCell align='right'>{fmtAmount(row.balance)}</TableCell>
                                                    <TableCell align='right'>{row.contributionPercent}%</TableCell>
                                                    <TableCell align='right'>{row.exchangeRate}</TableCell>
                                                    <TableCell align='right'>{fmtAmount(row.calculatedAmount)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 3 }}>
                                    Margin Accounts
                                </Typography>
                                <TableContainer component={Paper} variant='outlined'>
                                    <Table size='small'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Account Number</TableCell>
                                                <TableCell align='right'>Amount</TableCell>
                                                <TableCell align='right'>Maturity Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {lcData.margins.map(row => (
                                                <TableRow key={row.id}>
                                                    <TableCell>{row.accountNumber}</TableCell>
                                                    <TableCell align='right'>{fmtAmount(row.amount)}</TableCell>
                                                    <TableCell align='right'>{row.maturityDate}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>

                            {/* ---------------- Tab 4: Instructions & Insurance ---------------- */}
                            <TabPanel value={tab} index={4}>
                                <SectionHeading icon={ForumOutline} title='Advising Bank' />
                                <Grid container spacing={5}>
                                    <DetailRow label='Advising Bank Type' value={lcData.advisingBankType} />
                                    <DetailRow label='Advising Bank SWIFT' value={lcData.advisingBankSwift} />
                                </Grid>

                                <Divider sx={{ my: 6 }} />

                                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 3 }}>
                                    Special Payment Conditions
                                </Typography>
                                <Grid container spacing={5}>
                                    <DetailRow label='To Beneficiary' value={lcData.specialPaymentConditionsBeneficiary} />
                                    <DetailRow label='To Bank' value={lcData.specialPaymentConditionsBank} />
                                </Grid>

                                <Divider sx={{ my: 6 }} />

                                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 3 }}>
                                    Confirmation
                                </Typography>
                                <Grid container spacing={5}>
                                    <DetailRow label='Confirmation Instruction' value={lcData.confirmationInstruction} />
                                    <DetailRow label='Requested Confirmation Party' value={lcData.requestedConfirmationParty} />
                                </Grid>

                                <Divider sx={{ my: 6 }} />

                                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 3 }}>
                                    Correspondence
                                </Typography>
                                <Grid container spacing={5}>
                                    <DetailRow label='Sender to Receiver Info' value={lcData.senderToReceiverInfo} />
                                    <DetailRow label='Charges Details' value={lcData.chargesDetails} />
                                    <DetailRow label='Insurance Policy ID' value={lcData.selectedInsurancePolicyId} />
                                </Grid>
                            </TabPanel>

                            {/* ---------------- Tab 5: Charges & Attachments ---------------- */}
                            <TabPanel value={tab} index={5}>
                                {([
                                    { title: 'Charges', rows: lcData.charges, total: chargesTotal },
                                    { title: 'Taxes', rows: lcData.taxes, total: taxesTotal },
                                    { title: 'Commissions', rows: lcData.commissions, total: commissionsTotal }
                                ] as const).map((block, i) => (
                                    <React.Fragment key={block.title}>
                                        {i > 0 && <Divider sx={{ my: 6 }} />}
                                        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 3 }}>
                                            <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                                {block.title}
                                            </Typography>
                                            <Chip size='small' color='primary' label={`Total: ${fmtAmount(block.total)}`} />
                                        </Stack>
                                        <TableContainer component={Paper} variant='outlined'>
                                            <Table size='small'>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Account Number</TableCell>
                                                        <TableCell>Description</TableCell>
                                                        <TableCell>Currency</TableCell>
                                                        <TableCell align='right'>Amount</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {block.rows.map(row => (
                                                        <TableRow key={row.id}>
                                                            <TableCell>{row.accountNumber}</TableCell>
                                                            <TableCell>{row.description}</TableCell>
                                                            <TableCell>{row.currency}</TableCell>
                                                            <TableCell align='right'>{fmtAmount(row.amount)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </React.Fragment>
                                ))}

                                <Divider sx={{ my: 6 }} />

                                <SectionHeading icon={PaperclipIcon} title='Attachment' />
                                <Typography variant='body2'>{lcData.attachedFileName || '—'}</Typography>

                                <Divider sx={{ my: 6 }} />

                                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 3 }}>
                                    Template
                                </Typography>
                                <Grid container spacing={5}>
                                    <DetailRow label='Saved as Template' value={lcData.saveAsTemplate ? 'Yes' : 'No'} />
                                    {lcData.saveAsTemplate && (
                                        <React.Fragment>
                                            <DetailRow label='Template Name' value={lcData.templateName} />
                                            <DetailRow label='Access Type' value={lcData.accessType} />
                                        </React.Fragment>
                                    )}
                                </Grid>
                            </TabPanel>

                            {/* ---------------- Tab 6: Amendment History ---------------- */}
                            <TabPanel value={tab} index={6}>
                                <SectionHeading icon={HistoryIcon} title='Amendment History' />
                                <TableContainer component={Paper} variant='outlined'>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Sr#</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell align='right'>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {lcData.amendments.map(row => (
                                                <TableRow key={row.srNo}>
                                                    <TableCell>{row.srNo}</TableCell>
                                                    <TableCell>{row.date}</TableCell>
                                                    <TableCell>{row.description}</TableCell>
                                                    <TableCell align='right'>
                                                        <Chip
                                                            label={row.status}
                                                            size='small'
                                                            sx={{
                                                                fontWeight: 600,
                                                                bgcolor: statusStyles[row.status]?.bg ?? statusStyles.Active.bg,
                                                                color: statusStyles[row.status]?.color ?? statusStyles.Active.color
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 6 }}>
                        <CardHeader title='LC Summary' />
                        <CardContent>
                            <Stack spacing={4}>
                                <Box>
                                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                                        LC Amount
                                    </Typography>
                                    <Typography variant='h5' sx={{ fontWeight: 700 }}>
                                        {lcData.currency} {fmtAmount(lcData.lcAmount)}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                                        Applicant
                                    </Typography>
                                    <Typography variant='body2' sx={{ fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>
                                        {lcData.applicantName}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                                        Beneficiary
                                    </Typography>
                                    <Typography variant='body2' sx={{ fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>
                                        {lcData.beneficiaryName}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                                        Issuing Bank
                                    </Typography>
                                    <Typography variant='body2' sx={{ fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>
                                        {lcData.issuingBank}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                                        Total Exposure
                                    </Typography>
                                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                        {lcData.currency} {fmtAmount(totalExposure)}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                                        Expiry Date
                                    </Typography>
                                    <Typography variant='body2' sx={{ fontWeight: 600, color: 'warning.main' }}>
                                        {lcData.expiryDate}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader title='Quick Actions' />
                        <CardContent>
                            <Stack spacing={3}>
                                <Button fullWidth variant='outlined'>
                                    View SWIFT Message (MT700)
                                </Button>
                                <Button fullWidth variant='outlined'>
                                    Track Presentation Status
                                </Button>
                                <Button fullWidth variant='outlined' color='error'>
                                    Request Cancellation
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

Page.acl = {
    action: 'itsHaveAccess',
    subject: 'view-lc'
}

export default Page