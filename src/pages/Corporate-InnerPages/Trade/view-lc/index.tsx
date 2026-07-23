import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { Box, Card, Grid, MenuItem, TextField, Typography, Chip, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import LoadingButton from '@mui/lab/LoadingButton'
import ReplayIcon from '@mui/icons-material/Replay'
import ResultsTable, { ResultsTableColumn } from 'src/@core/components/Resultstable'

const colors = {
  green: '#15804f',
  greenHover: '#309a6a'
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface LCRecord {
  id: string
  lcNumber: string
  applicantName: string
  applicantId: string
  beneficiary: string
  currency: string
  amount: string
  issueDate: string
  expiryDate: string
  status: 'Hold' | 'Rejected' | 'Active' | 'Closed' | 'Cancelled'
}

const StyledSearchCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3.75),
  borderRadius: theme.shape.borderRadius * 1.75,
  boxShadow: theme.shadows[2]
}))

// ---------------------------------------------------------------------------
// Dummy applicant list — API se aayega
// ---------------------------------------------------------------------------
const applicantOptions = [
  { id: '1001-172290_PA', name: 'Al-Habib Textiles (Pvt) Ltd — 1001-172290_PA' },
  { id: '1002-118834_PA', name: 'Zaman Steel Industries — 1002-118834_PA' },
  { id: '1003-204471_PA', name: 'Crescent Foods (Pvt) Ltd — 1003-204471_PA' },
  { id: '1004-339902_PA', name: 'Blue Ocean Chemicals — 1004-339902_PA' }
]

const statusOptions: LCRecord['status'][] = ['Hold', 'Rejected', 'Active', 'Closed', 'Cancelled']

// ---------------------------------------------------------------------------
// Dummy LC data — API se aayega
// ---------------------------------------------------------------------------
const dummyLCs: LCRecord[] = [
  {
    id: 'ILC-2026-004521',
    lcNumber: 'ILC-2026-004521',
    applicantName: 'Al-Habib Textiles (Pvt) Ltd',
    applicantId: '1001-172290_PA',
    beneficiary: 'Guangzhou Fabric Trading Co. Ltd',
    currency: 'USD',
    amount: '485,000.00',
    issueDate: '05-Jun-2026',
    expiryDate: '30-Sep-2026',
    status: 'Active'
  },
  {
    id: 'ILC-2026-004498',
    lcNumber: 'ILC-2026-004498',
    applicantName: 'Al-Habib Textiles (Pvt) Ltd',
    applicantId: '1001-172290_PA',
    beneficiary: 'Hanoi Cotton Mills JSC',
    currency: 'USD',
    amount: '212,300.00',
    issueDate: '18-May-2026',
    expiryDate: '31-Aug-2026',
    status: 'Active'
  },
  {
    id: 'ILC-2026-004350',
    lcNumber: 'ILC-2026-004350',
    applicantName: 'Al-Habib Textiles (Pvt) Ltd',
    applicantId: '1001-172290_PA',
    beneficiary: 'Istanbul Yarn Exports',
    currency: 'EUR',
    amount: '96,750.00',
    issueDate: '02-Apr-2026',
    expiryDate: '15-Jul-2026',
    status: 'Closed'
  },
  {
    id: 'ILC-2026-004290',
    lcNumber: 'ILC-2026-004290',
    applicantName: 'Al-Habib Textiles (Pvt) Ltd',
    applicantId: '1001-172290_PA',
    beneficiary: 'Dhaka Weaving Co.',
    currency: 'USD',
    amount: '58,900.00',
    issueDate: '20-Mar-2026',
    expiryDate: '10-Jun-2026',
    status: 'Cancelled'
  },
  {
    id: 'ILC-2026-004610',
    lcNumber: 'ILC-2026-004610',
    applicantName: 'Al-Habib Textiles (Pvt) Ltd',
    applicantId: '1001-172290_PA',
    beneficiary: 'Jakarta Polymer Traders',
    currency: 'USD',
    amount: '134,500.00',
    issueDate: '01-Jul-2026',
    expiryDate: '30-Oct-2026',
    status: 'Hold'
  },
  {
    id: 'ILC-2026-003987',
    lcNumber: 'ILC-2026-003987',
    applicantName: 'Al-Habib Textiles (Pvt) Ltd',
    applicantId: '1001-172290_PA',
    beneficiary: 'Osaka Machinery Corp',
    currency: 'PKR',
    amount: '5,420,000.00',
    issueDate: '10-Feb-2026',
    expiryDate: '25-May-2026',
    status: 'Rejected'
  }
]

const statusStyles: Record<LCRecord['status'], { bg: string; color: string }> = {
  Active: { bg: '#e5f3ec', color: colors.green },
  Hold: { bg: '#fef4e5', color: '#b8770e' },
  Rejected: { bg: '#fbe9e9', color: '#c62828' },
  Cancelled: { bg: '#fbe9e9', color: '#c62828' },
  Closed: { bg: '#eceff1', color: '#546e7a' }
}

// ---------------------------------------------------------------------------
// Results table columns
// ---------------------------------------------------------------------------
const lcResultsColumns: ResultsTableColumn[] = [
  { key: 'lcnumber', label: 'LC Number' },
  { key: 'beneficiary', label: 'Beneficiary' },
  { key: 'currency', label: 'Currency' },
  { key: 'amount', label: 'Amount' },
  { key: 'issuedate', label: 'Issue Date' },
  { key: 'expirydate', label: 'Expiry Date' },
  { key: 'status', label: 'Status' }
]
const lcResultsGridColumns = '1.2fr 1.8fr 0.7fr 1fr 1fr 1fr 0.8fr'

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const Page = () => {
  const router = useRouter()

  const [applicantName, setApplicantName] = useState('')
  const [lcStatus, setLcStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [hasSearched, setHasSearched] = useState(false)
  const [results, setResults] = useState<LCRecord[]>([])

  const handleSearch = () => {
    // API call yahan lagegi — filhal client-side dummy filter
    const matches = dummyLCs.filter(lc => {
      const matchesApplicant = applicantName ? lc.applicantId === applicantName : true
      const matchesStatus = lcStatus ? lc.status === lcStatus : true

      return matchesApplicant && matchesStatus
    })

    setResults(matches)
    setHasSearched(true)
  }

  const handleReset = () => {
    setApplicantName('')
    setLcStatus('')
    setDateFrom('')
    setDateTo('')
    setResults([])
    setHasSearched(false)
  }

  const handleRowClick = (lc: LCRecord) => {
    router.push(`./view-lc/lc-result`)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
          <Typography variant='h6' sx={{ fontWeight: 200 }}>
          View LC (Letter of Credit)
        </Typography>
        <Typography variant='h6' sx={{ fontWeight: 200 }}>
          Search and view the status and details of your Import Letters of Credit.
        </Typography>
      </Grid>

      {/* Search Engine */}
      <Grid item xs={12}>
        <StyledSearchCard>
          <Typography
            variant='caption'
            sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}
          >
            View Import LC
          </Typography>

          <Grid container spacing={4} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label='Applicant Name'
                value={applicantName}
                onChange={e => setApplicantName(e.target.value)}
              >
                <MenuItem value=''>Please Select</MenuItem>
                {applicantOptions.map(opt => (
                  <MenuItem key={opt.id} value={opt.id}>
                    {opt.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField select fullWidth label='LC Status' value={lcStatus} onChange={e => setLcStatus(e.target.value)}>
                <MenuItem value=''>Please Select</MenuItem>
                {statusOptions.map(status => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type='date'
                label='Issue Date From'
                InputLabelProps={{ shrink: true }}
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type='date'
                label='Issue Date To'
                InputLabelProps={{ shrink: true }}
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 1.5, mt: 4 }}>
            <LoadingButton
              variant='contained'
              size='large'
              loadingPosition='end'
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              sx={{ height: 52, minWidth: 160, fontSize: 12 }}
            >
              Search
            </LoadingButton>
            <LoadingButton
              variant='outlined'
              size='large'
              loadingPosition='end'
              startIcon={<ReplayIcon />}
              onClick={handleReset}
              sx={{ height: 52, minWidth: 140, fontSize: 12 }}
            >
              Reset
            </LoadingButton>
          </Box>
        </StyledSearchCard>

        {hasSearched && (
          <ResultsTable
            columns={lcResultsColumns}
            gridTemplateColumns={lcResultsGridColumns}
            rows={results}
            getRowKey={lc => lc.id}
            onRowClick={handleRowClick}
            emptyMessage='No LC found matching the selected criteria. Try adjusting the filters.'
            headerColor={colors.green}
            renderRow={lc => (
              <>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {lc.lcNumber}
                </Typography>
                <Typography variant='body2'>{lc.beneficiary}</Typography>
                <Typography variant='body2'>{lc.currency}</Typography>
                <Typography variant='body2'>{lc.amount}</Typography>
                <Typography variant='body2'>{lc.issueDate}</Typography>
                <Typography variant='body2'>{lc.expiryDate}</Typography>
                <Box>
                  <Chip
                    label={lc.status}
                    sx={{
                      backgroundColor: statusStyles[lc.status].bg,
                      color: statusStyles[lc.status].color,
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      height: 24
                    }}
                  />
                </Box>
              </>
            )}
          />
        )}
      </Grid>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'view-lc'
}

export default Page