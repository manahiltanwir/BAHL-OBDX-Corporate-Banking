import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { Box, Card, Grid, MenuItem, TextField, Typography, Chip } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import LoadingButton from '@mui/lab/LoadingButton'
import ReplayIcon from '@mui/icons-material/Replay'
import ResultsTable, { ResultsTableColumn } from 'src/@core/components/Resultstable'

const colors = {
  green: '#15804f',
  greenHover: '#309a6a'
}
interface AdviceRecord {
  id: string
  lcNumber: string
  applicantName: string
  applicantId: string
  beneficiary: string
  currency: string
  amount: string
  adviceDate: string
}

const StyledSearchCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3.75),
  borderRadius: theme.shape.borderRadius * 1.75,
  boxShadow: theme.shadows[2]
}))

const applicantOptions = [
  { id: '1001-172290_PA', name: 'Al-Habib Textiles (Pvt) Ltd — 1001-172290_PA' },
  { id: '1002-118834_PA', name: 'Zaman Steel Industries — 1002-118834_PA' },
  { id: '1003-204471_PA', name: 'Crescent Foods (Pvt) Ltd — 1003-204471_PA' },
  { id: '1004-339902_PA', name: 'Blue Ocean Chemicals — 1004-339902_PA' }
]

const dummyAdvices: AdviceRecord[] = [
  {
    id: 'ADV-2026-004521',
    lcNumber: 'ILC-2026-004521',
    applicantName: 'Al-Habib Textiles (Pvt) Ltd',
    applicantId: '1001-172290_PA',
    beneficiary: 'Guangzhou Fabric Trading Co. Ltd',
    currency: 'USD',
    amount: '485,000.00',
    adviceDate: '05-Jun-2026',

  },
  {
    id: 'ADV-2026-004498',
    lcNumber: 'ILC-2026-004498',
    applicantName: 'Al-Habib Textiles (Pvt) Ltd',
    applicantId: '1001-172290_PA',
    beneficiary: 'Hanoi Cotton Mills JSC',
    currency: 'USD',
    amount: '212,300.00',
    adviceDate: '18-May-2026',

  },
  {
    id: 'ADV-2026-004610',
    lcNumber: 'ILC-2026-004610',
    applicantName: 'Al-Habib Textiles (Pvt) Ltd',
    applicantId: '1001-172290_PA',
    beneficiary: 'Jakarta Polymer Traders',
    currency: 'USD',
    amount: '134,500.00',
    adviceDate: '01-Jul-2026',

  },
  {
    id: 'ADV-2026-004402',
    lcNumber: 'ILC-2026-004402',
    applicantName: 'Zaman Steel Industries',
    applicantId: '1002-118834_PA',
    beneficiary: 'Shenzhen Metal Works Co.',
    currency: 'USD',
    amount: '318,200.00',
    adviceDate: '22-Apr-2026',

  }
]



// ---------------------------------------------------------------------------
// Results table columns
// ---------------------------------------------------------------------------
const adviceResultsColumns: ResultsTableColumn[] = [
  { key: 'lcnumber', label: 'LC Number' },
  { key: 'beneficiary', label: 'Beneficiary' },
  { key: 'currency', label: 'Currency' },
  { key: 'amount', label: 'Amount' },
  { key: 'advicedate', label: 'Advice Date' },
  // { key:'Status' }
]
const adviceResultsGridColumns = '1.2fr 1.8fr 0.7fr 1fr 1fr'

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const Page = () => {
  const router = useRouter()

  const [applicantName, setApplicantName] = useState('')
  const [lcNumber, setLcNumber] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [hasSearched, setHasSearched] = useState(false)
  const [results, setResults] = useState<AdviceRecord[]>([])

  const handleSearch = () => {
    // API call yahan lagegi — filhal client-side dummy filter
    // Sirf Active status wali advices hi consider hongi
    const matches = dummyAdvices.filter(adv => {
      const matchesApplicant = applicantName ? adv.applicantId === applicantName : true
      const matchesLcNumber = lcNumber ? adv.lcNumber.toLowerCase().includes(lcNumber.trim().toLowerCase()) : true

      // Date range check (adviceDate ko Date object mein convert karke compare karo)
      let matchesDate = true
      if (dateFrom || dateTo) {
        const adviceDateObj = new Date(adv.adviceDate)
        if (dateFrom) {
          matchesDate = matchesDate && adviceDateObj >= new Date(dateFrom)
        }
        if (dateTo) {
          matchesDate = matchesDate && adviceDateObj <= new Date(dateTo)
        }
      }

      return matchesApplicant && matchesLcNumber && matchesDate
    })

    setResults(matches)
    setHasSearched(true)
  }

  const handleReset = () => {
    setApplicantName('')
    setLcNumber('')
    setDateFrom('')
    setDateTo('')
    setResults([])
    setHasSearched(false)
  }

  // const handleRowClick = (adv: AdviceRecord) => {
  //   router.push(`./view-swift-draft/swift-result`)
  // }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h6' fontWeight={"bold"}>
          Swift Message
        </Typography>
        <Typography variant='h6' sx={{ fontWeight: 200 }}>
          Search and view the status and details of your SWIFT Message.
        </Typography>
      </Grid>

      {/* Search Engine */}
      <Grid item xs={12}>
        <StyledSearchCard>
          <Typography
            variant='caption'
            sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}
          >
            View Swift Draft
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
              <TextField
                fullWidth
                label='LC Number'
                placeholder='e.g. ILC-2026-004521'
                value={lcNumber}
                onChange={e => setLcNumber(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type='date'
                label='Advice Date From'
                InputLabelProps={{ shrink: true }}
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type='date'
                label='Advice Date To'
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
            columns={adviceResultsColumns}
            gridTemplateColumns={adviceResultsGridColumns}
            rows={results}
            getRowKey={adv => adv.id}
            // onRowClick={handleRowClick}
            emptyMessage='No Active Advice found matching the selected criteria. Try adjusting the filters.'
            headerColor={colors.green}
            renderRow={adv => (
              <>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {adv.lcNumber}
                </Typography>
                <Typography variant='body2'>{adv.beneficiary}</Typography>
                <Typography variant='body2'>{adv.currency}</Typography>
                <Typography variant='body2'>{adv.amount}</Typography>
                <Typography variant='body2'>{adv.adviceDate}</Typography>
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
  subject: 'view-lc-draft'
}

export default Page