'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LoadingButton from '@mui/lab/LoadingButton'
import AccountSummaryTable from 'src/@core/components/apps/party-account-access/accountsummarytable'
 import {AccountType} from 'src/@core/components/apps/party-account-access/accountsummarytable'

const colors = {
  green: '#10b981',
  greenHover: '#059669',
  yellow: '#eab308',
  yellowHover: '#ca8a04'
}

interface SearchFilters {
  idType: string
  partyId: string
}

type MappingMode = 'manual' | 'auto'

interface AccountRow {
  id: string
  accountNumber: string
  currency: string
  productName: string
  status: string
  type: AccountType
}

const accountRows: AccountRow[] = [
  {
    id: '1001008189710018',
    accountNumber: '1001008189710018',
    currency: 'PKR',
    productName: '-',
    status: 'ACTIVE',
    type: 'currentSavings'
  },
  {
    id: '1001008189700015',
    accountNumber: '1001008189700015',
    currency: 'PKR',
    productName: '-',
    status: 'ACTIVE',
    type: 'currentSavings'
  },
  {
    id: '2001008189710011',
    accountNumber: '2001008189710011',
    currency: 'PKR',
    productName: 'Term Deposit',
    status: 'ACTIVE',
    type: 'termDeposits'
  },
  {
    id: '2001008189700012',
    accountNumber: '2001008189700012',
    currency: 'PKR',
    productName: 'Term Deposit',
    status: 'ACTIVE',
    type: 'termDeposits'
  }
]

const Page = () => {
  const router = useRouter()

  const [filters, setFilters] = useState<SearchFilters>({
    idType: 'cnic',
    partyId: ''
  })

  const [showResult, setShowResult] = useState(false)
  const [searchedPartyId, setSearchedPartyId] = useState('')

  const [selectedAccountType, setSelectedAccountType] =
    useState<AccountType | null>(null)

  const [mappingMode, setMappingMode] =
    useState<MappingMode>('manual')

  const [selectedAccounts, setSelectedAccounts] =
    useState<string[]>([])

  const [mappedCounts, setMappedCounts] = useState<
    Record<AccountType, number>
  >({
    currentSavings: 0,
    termDeposits: 0
  })

  const handleFilterChange =
    (field: keyof SearchFilters) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilters(prev => ({
        ...prev,
        [field]: event.target.value
      }))
    }

  const handleSearch = () => {
    if (!filters.partyId.trim()) return

    setSearchedPartyId(filters.partyId)
    setShowResult(true)
    setSelectedAccountType(null)
    setSelectedAccounts([])
    setMappingMode('manual')
  }

  const handleClear = () => {
    setFilters({
      idType: 'cnic',
      partyId: ''
    })

    setShowResult(false)
    setSearchedPartyId('')
    setSelectedAccountType(null)
    setSelectedAccounts([])
    setMappingMode('manual')

    setMappedCounts({
      currentSavings: 0,
      termDeposits: 0
    })
  }

  const handleAccountTypeClick = (accountType: AccountType) => {
    setSelectedAccountType(accountType)
    setSelectedAccounts([])
    setMappingMode('manual')
  }

  const handleTabChange = (
    _event: React.SyntheticEvent,
    value: AccountType
  ) => {
    setSelectedAccountType(value)
    setSelectedAccounts([])
    setMappingMode('manual')
  }

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccounts(previous =>
      previous.includes(accountId)
        ? previous.filter(id => id !== accountId)
        : [...previous, accountId]
    )
  }

  const visibleAccounts = selectedAccountType
    ? accountRows.filter(account => account.type === selectedAccountType)
    : []

  const allVisibleAccountsSelected =
    visibleAccounts.length > 0 &&
    visibleAccounts.every(account =>
      selectedAccounts.includes(account.id)
    )

  const handleMapAllAccounts = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      setSelectedAccounts(
        visibleAccounts.map(account => account.id)
      )
    } else {
      setSelectedAccounts([])
    }
  }

  const handleMappingModeChange = (mode: MappingMode) => {
  setMappingMode(mode)
  setSelectedAccounts([])
}

const handleSave = () => {
  if (!selectedAccountType) return

  if (selectedAccounts.length === 0) return

  setMappedCounts(previous => ({
    ...previous,
    [selectedAccountType]: selectedAccounts.length
  }))

  alert('Accounts mapped successfully')

  router.push('/dashboard')
}

  const handleBack = () => {
    setSelectedAccountType(null)
    setSelectedAccounts([])
    setMappingMode('manual')
  }

  return (
   
    <Grid container spacing={3}   sx={{
      pb: 6
    }}>
     
      <Grid item xs={12}>
        <Card
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            boxShadow: 2
          }}
        >
          <Typography
            variant='h6'
            sx={{
              fontWeight: 600,
              mb: 2
            }}
          >
            Party Account Access
          </Typography>

          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                size='small'
                label='ID Type'
                value={filters.idType}
                onChange={handleFilterChange('idType')}
              >
                <MenuItem value='cnic'>
                  CNIC/SNIC/NICOP/POC/JV/ARC
                </MenuItem>

                <MenuItem value='passport'>
                  Passport Number
                </MenuItem>

                <MenuItem value='ntn'>
                  NTN Number
                </MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size='small'
                label='Party ID'
                value={filters.partyId}
                onChange={handleFilterChange('partyId')}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap'
                }}
              >
                <LoadingButton
                  variant='contained'
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                >
                  Search
                </LoadingButton>

                <Button
                  variant='contained'
                  onClick={handleClear}
                  sx={{
                    bgcolor: colors.yellow,
                    color: '#fff',
                    '&:hover': {
                      bgcolor: colors.yellowHover
                    }
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {showResult && (
        <Grid item xs={12}>
          <Card
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              boxShadow: 2
            }}
          >
            {/* Party details */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1px 1fr'
                },
                alignItems: 'center',
                gap: { xs: 2, sm: 3 },
                pb: 2.5,
                mb: 2,
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  Party ID
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontWeight: 700,
                    color: colors.greenHover
                  }}
                >
                  {searchedPartyId}
                </Typography>
              </Box>

             <Box
  sx={{
    display: { xs: 'none', sm: 'block' },
    width: '1px',
    alignSelf: 'stretch',
    bgcolor: 'divider'
  }}
/>

              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  Party Name
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontWeight: 700,
                    color: colors.greenHover
                  }}
                >
                  OBDX CORPORATE TESTING 2
                </Typography>
              </Box>
            </Box>

            {/* Summary */}
            <Typography
              sx={{
                color: colors.greenHover,
                fontWeight: 700,
                mb: 1.5
              }}
            >
              Own Account Mapping Summary
            </Typography>

            <AccountSummaryTable
              mappedCounts={mappedCounts}
              onAccountTypeClick={handleAccountTypeClick}
            />

            {/* Mapping section */}
            {selectedAccountType && (
              <Box sx={{ mt: 4 }}>
                <Typography
                  sx={{
                    color: colors.greenHover,
                    fontWeight: 700,
                    mb: 1
                  }}
                >
                  Account Mapping
                </Typography>

                <Box
                  sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                />

                <Tabs
                  value={selectedAccountType}
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTabs-indicator': {
                      bgcolor: colors.greenHover,
                    
                    }
                  }}
                >
                  <Tab
                    value='currentSavings'
                    label='Current & Savings'
                    sx={{
                      textTransform: 'none',
                      '&.Mui-selected': {
                        color: colors.greenHover
                      }
                    }}
                  />

                  <Tab
                    value='termDeposits'
                    label='Term Deposits'
                    sx={{
                      textTransform: 'none',
                      '&.Mui-selected': {
                        color: colors.greenHover
                      }
                    }}
                  />
                </Tabs>

                <Box
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1.5,
                    p: { xs: 2, md: 3 }
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      mb: 2
                    }}
                  >
                    New Accounts
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 4,
                      flexWrap: 'wrap'
                    }}
                  >
                    <Typography
                      variant='body2'
                      sx={{ mr: 1 }}
                    >
                      Map Accounts
                    </Typography>

                    <Button
                      size='small'
                      variant={
                        mappingMode === 'auto'
                          ? 'contained'
                          : 'outlined'
                      }
                      onClick={() =>
                        handleMappingModeChange('auto')
                      }
                    >
                      Auto
                    </Button>

                    <Button
                      size='small'
                      variant={
                        mappingMode === 'manual'
                          ? 'contained'
                          : 'outlined'
                      }
                      onClick={() =>
                        handleMappingModeChange('manual')
                      }
                    >
                      Manual
                    </Button>
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      mb: 1
                    }}
                  >
                    Existing Accounts
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1
                    }}
                  >
                    <Checkbox
                      size='small'
                      checked={allVisibleAccountsSelected}
                      onChange={handleMapAllAccounts}
                    />

                    <Typography variant='body2'>
                      Map All Accounts
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: '100%',
                      overflowX: 'auto',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1
                    }}
                  >
                    <Box sx={{ minWidth: 700 }}>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns:
                            '60px 2fr 1fr 1.5fr 1fr',
                          bgcolor: colors.greenHover,
                          color: '#fff',
                          px: 1,
                          py: 1.5,
                          fontWeight: 700
                        }}
                      >
                        <Box />
                        <Box>Account Number</Box>
                        <Box>Currency</Box>
                        <Box>Product Name</Box>
                        <Box>Account Status</Box>
                      </Box>

                      {visibleAccounts.map(account => (
                        <Box
                          key={account.id}
                          sx={{
                            display: 'grid',
                            gridTemplateColumns:
                              '60px 2fr 1fr 1.5fr 1fr',
                            alignItems: 'center',
                            px: 1,
                            py: 1,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '&:last-of-type': {
                              borderBottom: 0
                            }
                          }}
                        >
                          <Checkbox
                            size='small'
                            checked={selectedAccounts.includes(
                              account.id
                            )}
                            onChange={() =>
                              handleAccountSelect(account.id)
                            }
                          />

                          <Typography variant='body2'>
                            {account.accountNumber}
                          </Typography>

                          <Typography variant='body2'>
                            {account.currency}
                          </Typography>

                          <Typography variant='body2'>
                            {account.productName}
                          </Typography>

                          <Typography
                            variant='body2'
                            sx={{
                              color: colors.greenHover,
                              fontWeight: 700
                            }}
                          >
                            {account.status}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1.5,
                      mt: 3
                    }}
                  >
                    <Button
                      variant='outlined'
                      startIcon={<ArrowBackIcon />}
                      onClick={handleBack}
                    >
                      Back
                    </Button>

                    <Button
                      variant='contained'
                      disabled={selectedAccounts.length === 0}
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'user-management-page'
}

export default Page