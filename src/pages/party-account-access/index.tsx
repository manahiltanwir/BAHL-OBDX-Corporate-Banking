import React, { useState } from 'react'
import { useRouter } from 'next/router'

import { Box, Button, Card, Grid, TextField, Typography, useTheme } from '@mui/material'
import { alpha, type SxProps, type Theme } from '@mui/material/styles'

import SearchIcon from '@mui/icons-material/Search'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import SaveIcon from '@mui/icons-material/Save'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import AccountMappingTable, { AccountRow } from 'src/@core/components/AccountMappingTable'

// ** Colors (matches the reference design)
const colors = {
  green: '#15804f',
  greenDark: '#10995c',
  greenLight: '#E7F5F0',
  greenBg: '#F4FAF8'
}

// ** Dummy account data
const accountRows: AccountRow[] = [
  { id: '1001008189710018', accountNumber: '1001008189710018', currency: 'PKR', productName: '-', status: 'ACTIVE' },
  { id: '1001008189710019', accountNumber: '1001008189710019', currency: 'PKR', productName: '-', status: 'ACTIVE' },
  { id: '1001008189710020', accountNumber: '1001008189710020', currency: 'PKR', productName: '-', status: 'ACTIVE' },
  { id: '1001008189710021', accountNumber: '1001008189710021', currency: 'PKR', productName: '-', status: 'ACTIVE' },
  { id: '1001008189700015', accountNumber: '1001008189700015', currency: 'PKR', productName: '-', status: 'ACTIVE' }
]

const styles: Record<string, SxProps<Theme>> = {
  searchCard: { p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 2 },
  searchLabel: { color: colors.green, fontWeight: 700 },
  searchRow: { display: 'flex', gap: 1.5, mt: 1, flexWrap: 'wrap' },
  searchField: { flex: 1, minWidth: 260 },
  searchFieldIcon: { mr: 1, color: 'text.secondary' },

  summaryCard: { p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 2 },
  summaryHeaderRow: { display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 },
  summaryIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: colors.greenLight,
    color: colors.green
  },
  summaryTitle: { fontWeight: 700 },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1px 1fr 1px 1fr' },
    alignItems: 'center',
    gap: { xs: 2, sm: 3 }
  },
  summaryCell: { textAlign: 'center' },
  summaryDivider: { display: { xs: 'none', sm: 'block' }, width: '1px', alignSelf: 'stretch', bgcolor: 'divider' },
  summaryCellLabel: { color: colors.green, fontWeight: 700 },
  summaryCellValue: { fontWeight: 700 },
  summaryCellValueLarge: { fontWeight: 700, color: colors.green, fontSize: 20 },

  // ---- Account mapping card ----
  mappingCard: { p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 2 },
  mappingHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 2,
    mb: 2
  },
  mappingHeaderLeft: { display: 'flex', alignItems: 'center', gap: 1.5 },
  mappingIconBox: {
    width: 40,
    height: 40,
    borderRadius: 1.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: colors.green,
    color: '#fff'
  },
  mappingTitle: { fontWeight: 700, color: colors.green },
  tablesRow: { display: 'flex', gap: 3, flexWrap: 'wrap' },
  backButtonRow: { display: 'flex', justifyContent: 'flex-end', mt: 3 }
}

const Page = () => {
  const router = useRouter()
  const theme = useTheme()

  // ** Theme-aware highlight for "Already Mapped" rows (works in light & dark mode)
  const mappedRowBg = alpha(colors.green, theme.palette.mode === 'dark' ? 0.16 : 0.08)

  const [partyId, setPartyId] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [searchedPartyId, setSearchedPartyId] = useState('')
  const [mappedAccountIds, setMappedAccountIds] = useState<string[]>([])
  const [selectedToMap, setSelectedToMap] = useState<string[]>([])
  const [selectedToUnmap, setSelectedToUnmap] = useState<string[]>([])

  const unmappedAccounts = accountRows.filter(account => !mappedAccountIds.includes(account.id))
  const mappedAccounts = accountRows.filter(account => mappedAccountIds.includes(account.id))

  const allUnmappedSelected =
    unmappedAccounts.length > 0 && unmappedAccounts.every(account => selectedToMap.includes(account.id))

  const allMappedSelected =
    mappedAccounts.length > 0 && mappedAccounts.every(account => selectedToUnmap.includes(account.id))

  const handleSearch = () => {
    if (!partyId.trim()) return

    setSearchedPartyId(partyId)
    setShowResult(true)
    setMappedAccountIds([])
    setSelectedToMap([])
    setSelectedToUnmap([])
  }

  // ---------- MAP SIDE ----------
  const handleMapAllToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedToMap(event.target.checked ? unmappedAccounts.map(account => account.id) : [])
  }

  const handleAccountMapSelect = (accountId: string) => {
    setSelectedToMap(previous =>
      previous.includes(accountId) ? previous.filter(id => id !== accountId) : [...previous, accountId]
    )
  }

  const handleSaveMap = () => {
    if (selectedToMap.length === 0) return

    setMappedAccountIds(previous => Array.from(new Set([...previous, ...selectedToMap])))
    setSelectedToMap([])
  }

  // ---------- UNMAP SIDE ----------
  const handleUnmapAllToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedToUnmap(event.target.checked ? mappedAccounts.map(account => account.id) : [])
  }

  const handleAccountUnmapSelect = (accountId: string) => {
    setSelectedToUnmap(previous =>
      previous.includes(accountId) ? previous.filter(id => id !== accountId) : [...previous, accountId]
    )
  }

  const handleSaveUnmap = () => {
    if (selectedToUnmap.length === 0) return

    setMappedAccountIds(previous => previous.filter(id => !selectedToUnmap.includes(id)))
    setSelectedToUnmap([])
  }

  const handleBack = () => {
    setShowResult(false)
    setSearchedPartyId('')
    setMappedAccountIds([])
    setSelectedToMap([])
    setSelectedToUnmap([])
  }

  return (
    <Grid container spacing={3} sx={{ pb: 6 }}>
      {/* Search */}
      <Grid item xs={12}>
        <Card sx={styles.searchCard}>
          <Typography variant='overline' sx={styles.searchLabel}>
            Search Registration ID
          </Typography>

          <Box sx={styles.searchRow}>
            <TextField
              fullWidth
              size='medium'
              placeholder='Enter Party ID (e.g., PRT-9921)...'
              value={partyId}
              onChange={e => setPartyId(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={styles.searchFieldIcon} /> }}
              sx={styles.searchField}
            />

            <Button variant='contained' startIcon={<SearchIcon />} onClick={handleSearch}>
              Search Record
            </Button>
          </Box>
        </Card>
      </Grid>

      {showResult && (
        <>
          {/* Party summary */}
          <Grid item xs={12}>
            <Card sx={styles.summaryCard}>
              <Box sx={styles.summaryHeaderRow}>
                <Box sx={styles.summaryIconWrapper}>
                  <AccountBalanceIcon />
                </Box>
                <Box>
                  <Typography sx={styles.summaryTitle}>Current & Savings Accounts</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Account summary for the searched party
                  </Typography>
                </Box>
              </Box>

              <Box sx={styles.summaryGrid}>
                <Box sx={styles.summaryCell}>
                  <Typography variant='caption' sx={styles.summaryCellLabel}>
                    PARTY ID
                  </Typography>
                  <Typography sx={styles.summaryCellValue}>{searchedPartyId}</Typography>
                </Box>

                <Box sx={styles.summaryDivider} />

                <Box sx={styles.summaryCell}>
                  <Typography variant='caption' sx={styles.summaryCellLabel}>
                    PARTY NAME
                  </Typography>
                  <Typography sx={styles.summaryCellValue}>OBDX CORPORATE TESTING 2</Typography>
                </Box>

                <Box sx={styles.summaryDivider} />

                <Box sx={styles.summaryCell}>
                  <Typography variant='caption' sx={styles.summaryCellLabel}>
                    TOTAL ACCOUNTS
                  </Typography>
                  <Typography sx={styles.summaryCellValueLarge}>{accountRows.length}</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Account mapping - same AccountMappingTable component used for both sides */}
          <Grid item xs={12}>
            <Card sx={styles.mappingCard}>
              <Box sx={styles.mappingHeaderRow}>
                <Box sx={styles.mappingHeaderLeft}>
                  <Box sx={styles.mappingIconBox}>
                    <SwapHorizIcon />
                  </Box>
                  <Box>
                    <Typography sx={styles.mappingTitle}>Account Mapping</Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Select the accounts you want to map or unmap
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={styles.tablesRow}>
                {/* Total Active Accounts (map side) */}
                <AccountMappingTable
                  icon={<AccountBalanceIcon />}
                  title='Total Active Accounts'
                  countLabel='Total Accounts'
                  countValue={accountRows.length}
                  toggleAllLabel='Map All Accounts'
                  toggleAllChecked={allUnmappedSelected}
                  toggleAllDisabled={unmappedAccounts.length === 0}
                  onToggleAllChange={handleMapAllToggle}
                  accounts={accountRows}
                  selectedIds={selectedToMap}
                  onSelectAccount={handleAccountMapSelect}
                  alreadyMappedIds={mappedAccountIds}
                  mappedRowBg={mappedRowBg}
                  saveButtonLabel='Save Mapping'
                  saveButtonIcon={<SaveIcon />}
                  onSave={handleSaveMap}
                  saveDisabled={selectedToMap.length === 0}
                  saveButtonVariant='contained'
                />

                {/* Total Mapped Accounts (unmap side) */}
                <AccountMappingTable
                  icon={<SwapHorizIcon />}
                  title='Total Mapped Accounts'
                  countLabel='Mapped Accounts'
                  countValue={mappedAccounts.length}
                  toggleAllLabel='Unmap All Accounts'
                  toggleAllChecked={allMappedSelected}
                  toggleAllDisabled={mappedAccounts.length === 0}
                  onToggleAllChange={handleUnmapAllToggle}
                  accounts={mappedAccounts}
                  selectedIds={selectedToUnmap}
                  onSelectAccount={handleAccountUnmapSelect}
                  emptyMessage='No accounts mapped yet.'
                  saveButtonLabel='Save Unmapping'
                  saveButtonIcon={<LinkOffIcon />}
                  onSave={handleSaveUnmap}
                  saveDisabled={selectedToUnmap.length === 0}
                  saveButtonVariant='outlined'
                  saveButtonColor='error'
                />
              </Box>

              <Box sx={styles.backButtonRow}>
                <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={handleBack}>
                  Back
                </Button>
              </Box>
            </Card>
          </Grid>
        </>
      )}
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'user-management-page'
}

export default Page