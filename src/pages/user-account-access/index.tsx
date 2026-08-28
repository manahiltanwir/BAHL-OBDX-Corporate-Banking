import React, { useState } from 'react'

import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
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
import AccountMappingTable from 'src/@core/components/AccountMappingTable'

// ** Hook (Redux integration lives here now)
import { PartyUserResultRow } from 'src/types/apps/userAccountAccess'
import { useUserAccountAccess } from 'src/@core/hooks/apps/useUserAccountAccess'

const colors = {
  green: '#15804f',
  greenDark: '#10995c',
  greenLight: '#E7F5F0',
  greenBg: '#F4FAF8'
}

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
  searchError: { mt: 1.5, color: 'error.main' },

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

// ** Types for the confirmation dialog
type ConfirmAction = 'map' | 'unmap' | null

const Page = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  // Theme-aware hover / highlight colors so they stay visible in dark mode too
  const mappedRowBg = alpha(colors.green, isDark ? 0.16 : 0.08)

  const [partyId, setPartyId] = useState('CN421017654123')

  // ** Everything API/Redux related now comes from this hook
  const {
    store,
    stage,
    isSearching,
    searchError,
    searchedPartyId,
    accountRows,
    unmappedAccounts,
    mappedAccounts,
    selectedToMap,
    setSelectedToMap,
    selectedToUnmap,
    setSelectedToUnmap,
    searchPartyUsers,
    selectPartyUser,
    confirmMap,
    confirmUnmap,
    handleBackToResults
  } = useUserAccountAccess()

  // ** Confirmation dialog state (purely UI, stays local)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)

  const allUnmappedSelected =
    unmappedAccounts.length > 0 && unmappedAccounts.every(account => selectedToMap.includes(account.id))

  const allMappedSelected =
    mappedAccounts.length > 0 && mappedAccounts.every(account => selectedToUnmap.includes(account.id))

  // ---------- SEARCH ----------
  const handleSearch = () => {
    searchPartyUsers(partyId)
  }

  // ---------- SELECT A USER FROM RESULTS ----------
  const handleSelectUser = (user: PartyUserResultRow) => {
    selectPartyUser(user)
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
    setConfirmAction('map')
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
    setConfirmAction('unmap')
  }

  // ---------- CONFIRMATION DIALOG ----------
  const handleCloseConfirm = () => {
    setConfirmAction(null)
  }

  const handleConfirmSubmit = async () => {
    if (confirmAction === 'map') {
      await confirmMap()
    } else if (confirmAction === 'unmap') {
      await confirmUnmap()
    }

    setConfirmAction(null)
  }

  const isMapConfirm = confirmAction === 'map'
  const confirmCount = isMapConfirm ? selectedToMap.length : selectedToUnmap.length

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
          rows={store.users}
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
              placeholder='Enter Party ID (e.g., CN421017654123)...'
              value={partyId}
              onChange={e => setPartyId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              InputProps={{ startAdornment: <SearchIcon sx={styles.searchFieldIcon} /> }}
              sx={styles.searchField}
            />

            <Button
              variant='contained'
              startIcon={isSearching ? <CircularProgress size={16} color='inherit' /> : <SearchIcon />}
              onClick={handleSearch}
              disabled={isSearching}
              sx={styles.searchButton}
            >
              {isSearching ? 'Searching...' : 'Search Record'}
            </Button>
          </Box>

          {searchError && (
            <Typography variant='body2' sx={styles.searchError}>
              {searchError}
            </Typography>
          )}
        </Card>
      </Grid>

      {/* Stage 2: Search results - users found against the Party ID */}
      {stage === 'results' && renderResultsTable()}

      {stage === 'detail' && store.selectedUser && (
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
                  <Typography sx={styles.summaryCellValue}>{store.selectedUser.userName}</Typography>
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
                  alreadyMappedIds={mappedAccounts.map(account => account.id)}
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

      {/* Confirmation Dialog for Map / Unmap */}
      <Dialog open={confirmAction !== null} onClose={handleCloseConfirm} maxWidth='xs' fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {isMapConfirm ? 'Confirm Account Mapping' : 'Confirm Account Unmapping'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isMapConfirm
              ? `Are you sure you want to map ${confirmCount} selected account${
                  confirmCount > 1 ? 's' : ''
                } to this user?`
              : `Are you sure you want to unmap ${confirmCount} selected account${
                  confirmCount > 1 ? 's' : ''
                } from this user?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseConfirm} variant='outlined' color='inherit'>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            variant='contained'
            color={isMapConfirm ? 'primary' : 'error'}
            startIcon={isMapConfirm ? <SaveIcon /> : <LinkOffIcon />}
          >
            {isMapConfirm ? 'Confirm Mapping' : 'Confirm Unmapping'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'user-account-access'
}

export default Page