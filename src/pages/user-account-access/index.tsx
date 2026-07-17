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
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ResultsTable, { ResultsTableColumn } from 'src/@core/components/Resultstable'
import AccountMappingTable, { AccountRow } from 'src/@core/components/AccountMappingTable'

const colors = {
  green: '#15804f',
  greenDark: '#10995c',
  greenLight: '#E7F5F0',
  greenBg: '#F4FAF8'
}

interface PartyUserResult {
  partyId: string
  userId: string
  userName: string
  status: string
}

// ** Dummy account data
const accountRows: AccountRow[] = [
  { id: '1001008189710018', accountNumber: '1001008189710018', currency: 'PKR', productName: '-', status: 'ACTIVE' },
  { id: '1001008189710019', accountNumber: '1001008189710019', currency: 'PKR', productName: '-', status: 'ACTIVE' },
  { id: '1001008189710020', accountNumber: '1001008189710020', currency: 'PKR', productName: '-', status: 'ACTIVE' },
  { id: '1001008189710021', accountNumber: '1001008189710021', currency: 'PKR', productName: '-', status: 'ACTIVE' },
  { id: '1001008189700015', accountNumber: '1001008189700015', currency: 'PKR', productName: '-', status: 'ACTIVE' }
]

// ** Dummy users-against-party-id generator (replace with real API call later)
const getPartyUsersResults = (partyId: string): PartyUserResult[] => [
  { partyId, userId: 'USR-1001', userName: 'Ahmed Khan', status: 'ACTIVE' },
  { partyId, userId: 'USR-1002', userName: 'Bilal Ahmed', status: 'ACTIVE' },
  { partyId, userId: 'USR-1003', userName: 'Sara Malik', status: 'INACTIVE' }
]

// ** Columns + grid template for the "users under this Party ID" results table
const partyUserResultsColumns: ResultsTableColumn[] = [
  { key: 'partyId', label: 'Party ID' },
  { key: 'userId', label: 'User ID' },
  { key: 'userName', label: 'User Name' },
  { key: 'status', label: 'Status' },
  { key: 'chevron', label: '' }
]

const partyUserResultsGridColumns = '2fr 1.5fr 2fr 1fr 32px'

const styles: Record<string, SxProps<Theme>> = {
  searchCard: { p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 2 },
  searchLabel: { color: colors.green, fontWeight: 700 },
  searchRow: { display: 'flex', gap: 1.5, mt: 1, flexWrap: 'wrap' },
  searchField: { flex: 1, minWidth: 260 },
  searchFieldIcon: { mr: 1, color: 'text.secondary' },
  searchButton: { bgcolor: colors.green, '&:hover': { bgcolor: colors.greenDark }, px: 3 },

  resultsCard: { p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 2 },
  resultsHeaderRow: { display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 },
  resultsIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: colors.greenLight,
    color: colors.green
  },
  resultsTitle: { fontWeight: 700, color: colors.green },
  resultsStatusText: { color: colors.green, fontWeight: 700 },
  resultsChevron: { color: colors.green, display: 'flex', justifyContent: 'flex-end' },

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
  backButtonRow: { display: 'flex', justifyContent: 'flex-end', mt: 3 },
  saveMapButton: { bgcolor: colors.green, '&:hover': { bgcolor: colors.greenDark } }
}

// ** Screen stage: search -> results list (users under the party) -> detail (account mapping)
type Stage = 'search' | 'results' | 'detail'

const Page = () => {
  const router = useRouter()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  // Theme-aware hover / highlight colors so they stay visible in dark mode too
  const mappedRowBg = alpha(colors.green, isDark ? 0.16 : 0.08)

  const [partyId, setPartyId] = useState('')
  const [stage, setStage] = useState<Stage>('search')

  // ** Search results: users that belong to the searched Party ID
  const [searchResults, setSearchResults] = useState<PartyUserResult[]>([])

  // ** The party id that was searched, and the user selected from the results table
  const [searchedPartyId, setSearchedPartyId] = useState('')
  const [searchedUserId, setSearchedUserId] = useState('')
  const [searchedUserName, setSearchedUserName] = useState('')

  const [mappedAccountIds, setMappedAccountIds] = useState<string[]>([])
  const [selectedToMap, setSelectedToMap] = useState<string[]>([])
  const [selectedToUnmap, setSelectedToUnmap] = useState<string[]>([])

  const unmappedAccounts = accountRows.filter(account => !mappedAccountIds.includes(account.id))
  const mappedAccounts = accountRows.filter(account => mappedAccountIds.includes(account.id))

  const allUnmappedSelected =
    unmappedAccounts.length > 0 && unmappedAccounts.every(account => selectedToMap.includes(account.id))

  const allMappedSelected =
    mappedAccounts.length > 0 && mappedAccounts.every(account => selectedToUnmap.includes(account.id))

  // ---------- SEARCH ----------
  const handleSearch = () => {
    if (!partyId.trim()) return

    const trimmedPartyId = partyId.trim()

    setSearchedPartyId(trimmedPartyId)
    setSearchResults(getPartyUsersResults(trimmedPartyId))
    setStage('results')
  }

  // ---------- SELECT A USER FROM RESULTS ----------
  const handleSelectUser = (user: PartyUserResult) => {
    setSearchedUserId(user.userId)
    setSearchedUserName(user.userName)
    setMappedAccountIds([])
    setSelectedToMap([])
    setSelectedToUnmap([])
    setStage('detail')
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

  // ---------- BACK NAVIGATION ----------
  // Detail screen ka "Back" -> results list (users) pe wapis
  const handleBackToResults = () => {
    setSearchedUserId('')
    setSearchedUserName('')
    setMappedAccountIds([])
    setSelectedToMap([])
    setSelectedToUnmap([])
    setStage('results')
  }

  const renderResultsTable = () => (
    <Grid item xs={12}>
      <Card sx={styles.resultsCard}>
        <Box sx={styles.resultsHeaderRow}>
          <Box sx={styles.resultsIconWrapper}>
            <PersonSearchIcon />
          </Box>
          <Box>
            <Typography sx={styles.resultsTitle}>Search Results</Typography>
            <Typography variant='body2' color='text.secondary'>
              Click a user to view and map their accounts
            </Typography>
          </Box>
        </Box>

        <ResultsTable
          columns={partyUserResultsColumns}
          gridTemplateColumns={partyUserResultsGridColumns}
          rows={searchResults}
          getRowKey={user => user.userId}
          onRowClick={handleSelectUser}
          emptyMessage='No users found for this Party ID.'
          headerColor={colors.green}
          renderRow={user => (
            <>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                {user.partyId}
              </Typography>
              <Typography variant='body2'>{user.userId}</Typography>
              <Typography variant='body2'>{user.userName}</Typography>
              <Typography variant='body2' sx={styles.resultsStatusText}>
                {user.status}
              </Typography>
              <Box sx={styles.resultsChevron}>
                <ChevronRightIcon fontSize='small' />
              </Box>
            </>
          )}
        />
      </Card>
    </Grid>
  )

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

            <Button variant='contained' startIcon={<SearchIcon />} onClick={handleSearch} sx={styles.searchButton}>
              Search Record
            </Button>
          </Box>
        </Card>
      </Grid>

      {/* Stage 2: Search results - users found against the Party ID */}
      {stage === 'results' && renderResultsTable()}

      {stage === 'detail' && (
        <>
          {/* Party / user summary */}
          <Grid item xs={12}>
            <Card sx={styles.summaryCard}>
              <Box sx={styles.summaryHeaderRow}>
                <Box sx={styles.summaryIconWrapper}>
                  <AccountBalanceIcon />
                </Box>
                <Box>
                  <Typography sx={styles.summaryTitle}>Current & Savings Accounts</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Account summary for the selected user
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
                    USER NAME
                  </Typography>
                  <Typography sx={styles.summaryCellValue}>{searchedUserName}</Typography>
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
                  saveButtonSx={styles.saveMapButton}
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
                <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={handleBackToResults}>
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
  subject: 'user-account-access'
}

export default Page