import React, { useState } from 'react'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  Card,
  Checkbox,
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

// ** Colors (matches the reference design)
const colors = {
  green: '#15804f',
  greenDark: '#10995c',
  greenLight: '#E7F5F0',
  greenBg: '#F4FAF8'
}

// ** Types
interface AccountRow {
  id: string
  accountNumber: string
  currency: string
  productName: string
  status: string
}

// A single user that belongs to the searched Party ID
interface PartyUserResult {
  partyId: string
  userId: string
  userName: string
  status: string
}

// ** Dummy account data
const accountRows: AccountRow[] = [
  {
    id: '1001008189710018',
    accountNumber: '1001008189710018',
    currency: 'PKR',
    productName: '-',
    status: 'ACTIVE'
  },
  {
    id: '1001008189710019',
    accountNumber: '1001008189710019',
    currency: 'PKR',
    productName: '-',
    status: 'ACTIVE'
  },
  {
    id: '1001008189710020',
    accountNumber: '1001008189710020',
    currency: 'PKR',
    productName: '-',
    status: 'ACTIVE'
  },
  {
    id: '1001008189710021',
    accountNumber: '1001008189710021',
    currency: 'PKR',
    productName: '-',
    status: 'ACTIVE'
  },
  {
    id: '1001008189700015',
    accountNumber: '1001008189700015',
    currency: 'PKR',
    productName: '-',
    status: 'ACTIVE'
  }
]

// ** Dummy users-against-party-id generator (replace with real API call later)
// All rows share the searched partyId - only the user changes.
const getPartyUsersResults = (partyId: string): PartyUserResult[] => [
  {
    partyId,
    userId: 'USR-1001',
    userName: 'Ahmed Khan',
    status: 'ACTIVE'
  },
  {
    partyId,
    userId: 'USR-1002',
    userName: 'Bilal Ahmed',
    status: 'ACTIVE'
  },
  {
    partyId,
    userId: 'USR-1003',
    userName: 'Sara Malik',
    status: 'INACTIVE'
  }
]

const styles: Record<string, SxProps<Theme>> = {
  searchCard: { p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 2 },
  searchLabel: { color: colors.green, fontWeight: 700 },
  searchRow: { display: 'flex', gap: 1.5, mt: 1, flexWrap: 'wrap' },
  searchField: { flex: 1, minWidth: 260 },
  searchFieldIcon: { mr: 1, color: 'text.secondary' },
  searchButton: {
    bgcolor: colors.green,
    '&:hover': { bgcolor: colors.greenDark },
    px: 3
  },

  // ---- Party users results card ----
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
  resultsScrollWrapper: { overflowX: 'auto' },
  resultsMinWidthWrapper: { minWidth: 560 },
  resultsGridHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 2fr 1fr 32px',
    bgcolor: colors.green,
    color: '#fff',
    px: 2,
    py: 1.25,
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase'
  },
  resultsRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 2fr 1fr 32px',
    alignItems: 'center',
    px: 2,
    py: 1.5,
    borderBottom: '1px solid',
    borderColor: 'divider',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    '&:last-of-type': { borderBottom: 0 }
  },
  resultsStatusText: { color: colors.green, fontWeight: 700 },
  resultsChevron: { color: colors.green, display: 'flex', justifyContent: 'flex-end' },
  resultsEmptyState: { p: 3, textAlign: 'center' },

  // ---- Party summary card ----
  summaryCard: {
    p: { xs: 2, md: 3 },
    borderRadius: 2,
    boxShadow: 2
  },
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
  summaryDivider: {
    display: { xs: 'none', sm: 'block' },
    width: '1px',
    alignSelf: 'stretch',
    bgcolor: 'divider'
  },
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
  backButtonRow: { display: 'flex', justifyContent: 'flex-end', mt: 3 },

  // ---- Shared account table pieces ----
  tableContainer: {
    flex: 1,
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 2,
    overflow: 'hidden'
  },
  tableHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    p: 2.5
  },
  tableHeaderLeft: { display: 'flex', alignItems: 'center', gap: 1.5 },
  tableIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: colors.greenLight,
    color: colors.green
  },
  tableHeaderTitle: { fontWeight: 700 },
  tableHeaderCountWrapper: { textAlign: 'right' },
  tableHeaderCountLabel: { color: colors.green, fontWeight: 600 },
  tableHeaderCountValue: { fontWeight: 700, color: colors.green },
  tableToggleAllRow: { px: 2.5, pb: 1.5, display: 'flex', alignItems: 'center' },
  tableScrollWrapper: { overflowX: 'auto' },
  tableMinWidthWrapper: { minWidth: 480 },
  tableGridHeader: {
    display: 'grid',
    gridTemplateColumns: '48px 2fr 1fr 1.5fr 1fr',
    bgcolor: colors.green,
    color: '#fff',
    px: 1,
    py: 1.25,
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase'
  },
  tableRowBase: {
    display: 'grid',
    gridTemplateColumns: '48px 2fr 1fr 1.5fr 1fr',
    alignItems: 'center',
    px: 1,
    py: 1,
    borderBottom: '1px solid',
    borderColor: 'divider',
    '&:last-of-type': { borderBottom: 0 }
  },
  tableStatusText: { color: colors.green, fontWeight: 700 },
  tableAlreadyMappedText: { color: colors.green, fontWeight: 700 },
  tableEmptyState: { p: 3, textAlign: 'center' },
  tableSaveRow: { display: 'flex', justifyContent: 'flex-end', p: 2 },
  saveMapButton: {
    bgcolor: colors.green,
    '&:hover': { bgcolor: colors.greenDark }
  }
}

// ** Screen stage: search -> results list (users under the party) -> detail (account mapping)
type Stage = 'search' | 'results' | 'detail'

const Page = () => {
  const router = useRouter()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  // Theme-aware hover / highlight colors so they stay visible in dark mode too
  const mappedRowBg = alpha(colors.green, isDark ? 0.16 : 0.08)
  const resultsRowHoverBg = alpha(colors.green, isDark ? 0.24 : 0.08)

  const getTableRowSx = (isAlreadyMapped: boolean): SxProps<Theme> => ({
    ...(styles.tableRowBase as Record<string, unknown>),
    bgcolor: isAlreadyMapped ? mappedRowBg : 'transparent'
  })

  const getResultsRowSx = (): SxProps<Theme> => ({
    ...(styles.resultsRow as Record<string, unknown>),
    '&:hover': { bgcolor: resultsRowHoverBg }
  })

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

  // ** Results table: users found against the searched Party ID
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

        <Box sx={styles.resultsScrollWrapper}>
          <Box sx={styles.resultsMinWidthWrapper}>
            <Box sx={styles.resultsGridHeader}>
              <Box>Party ID</Box>
              <Box>User ID</Box>
              <Box>User Name</Box>
              <Box>Status</Box>
              <Box />
            </Box>

            {searchResults.length === 0 ? (
              <Box sx={styles.resultsEmptyState}>
                <Typography variant='body2' color='text.secondary'>
                  No users found for this Party ID.
                </Typography>
              </Box>
            ) : (
              searchResults.map(user => (
                <Box
                  key={user.userId}
                  sx={getResultsRowSx()}
                  onClick={() => handleSelectUser(user)}
                  role='button'
                  tabIndex={0}
                  onKeyDown={event => {
                    if (event.key === 'Enter') handleSelectUser(user)
                  }}
                >
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
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Card>
    </Grid>
  )

  // ** Left table: Total Active Accounts (accounts available to map)
  const renderTotalActiveAccountsTable = () => (
    <Box sx={styles.tableContainer}>
      <Box sx={styles.tableHeaderRow}>
        <Box sx={styles.tableHeaderLeft}>
          <Box sx={styles.tableIconWrapper}>
            <AccountBalanceIcon />
          </Box>
          <Typography sx={styles.tableHeaderTitle}>Total Active Accounts</Typography>
        </Box>

        <Box sx={styles.tableHeaderCountWrapper}>
          <Typography variant='caption' sx={styles.tableHeaderCountLabel}>
            Total Accounts
          </Typography>
          <Typography sx={styles.tableHeaderCountValue}>{accountRows.length}</Typography>
        </Box>
      </Box>

      <Box sx={styles.tableToggleAllRow}>
        <Checkbox
          size='small'
          checked={allUnmappedSelected}
          onChange={handleMapAllToggle}
          disabled={unmappedAccounts.length === 0}
        />
        <Typography variant='body2'>Map All Accounts</Typography>
      </Box>

      <Box sx={styles.tableScrollWrapper}>
        <Box sx={styles.tableMinWidthWrapper}>
          <Box sx={styles.tableGridHeader}>
            <Box />
            <Box>Account Number</Box>
            <Box>Currency</Box>
            <Box>Product Name</Box>
            <Box>Account Status</Box>
          </Box>

          {accountRows.map(account => {
            const isAlreadyMapped = mappedAccountIds.includes(account.id)

            return (
              <Box key={account.id} sx={getTableRowSx(isAlreadyMapped)}>
                {isAlreadyMapped ? (
                  <Box />
                ) : (
                  <Checkbox
                    size='small'
                    checked={selectedToMap.includes(account.id)}
                    onChange={() => handleAccountMapSelect(account.id)}
                  />
                )}
                <Typography variant='body2'>{account.accountNumber}</Typography>
                <Typography variant='body2'>{account.currency}</Typography>
                <Typography variant='body2'>{account.productName}</Typography>
                {isAlreadyMapped ? (
                  <Typography variant='caption' sx={styles.tableAlreadyMappedText}>
                    Already Mapped
                  </Typography>
                ) : (
                  <Typography variant='body2' sx={styles.tableStatusText}>
                    {account.status}
                  </Typography>
                )}
              </Box>
            )
          })}
        </Box>
      </Box>

      <Box sx={styles.tableSaveRow}>
        <Button
          variant='contained'
          size='small'
          startIcon={<SaveIcon />}
          onClick={handleSaveMap}
          disabled={selectedToMap.length === 0}
          sx={styles.saveMapButton}
        >
          Save Mapping
        </Button>
      </Box>
    </Box>
  )

  const renderTotalMappedAccountsTable = () => (
    <Box sx={styles.tableContainer}>
      <Box sx={styles.tableHeaderRow}>
        <Box sx={styles.tableHeaderLeft}>
          <Box sx={styles.tableIconWrapper}>
            <SwapHorizIcon />
          </Box>
          <Typography sx={styles.tableHeaderTitle}>Total Mapped Accounts</Typography>
        </Box>

        <Box sx={styles.tableHeaderCountWrapper}>
          <Typography variant='caption' sx={styles.tableHeaderCountLabel}>
            Mapped Accounts
          </Typography>
          <Typography sx={styles.tableHeaderCountValue}>{mappedAccounts.length}</Typography>
        </Box>
      </Box>

      <Box sx={styles.tableToggleAllRow}>
        <Checkbox
          size='small'
          checked={allMappedSelected}
          onChange={handleUnmapAllToggle}
          disabled={mappedAccounts.length === 0}
        />
        <Typography variant='body2'>Unmap All Accounts</Typography>
      </Box>

      <Box sx={styles.tableScrollWrapper}>
        <Box sx={styles.tableMinWidthWrapper}>
          <Box sx={styles.tableGridHeader}>
            <Box />
            <Box>Account Number</Box>
            <Box>Currency</Box>
            <Box>Product Name</Box>
            <Box>Account Status</Box>
          </Box>

          {mappedAccounts.length === 0 ? (
            <Box sx={styles.tableEmptyState}>
              <Typography variant='body2' color='text.secondary'>
                No accounts mapped yet.
              </Typography>
            </Box>
          ) : (
            mappedAccounts.map(account => (
              <Box key={account.id} sx={styles.tableRowBase}>
                <Checkbox
                  size='small'
                  checked={selectedToUnmap.includes(account.id)}
                  onChange={() => handleAccountUnmapSelect(account.id)}
                />
                <Typography variant='body2'>{account.accountNumber}</Typography>
                <Typography variant='body2'>{account.currency}</Typography>
                <Typography variant='body2'>{account.productName}</Typography>
                <Typography variant='body2' sx={styles.tableStatusText}>
                  {account.status}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Box>

      <Box sx={styles.tableSaveRow}>
        <Button
          variant='outlined'
          size='small'
          color='error'
          startIcon={<LinkOffIcon />}
          onClick={handleSaveUnmap}
          disabled={selectedToUnmap.length === 0}
        >
          Save Unmapping
        </Button>
      </Box>
    </Box>
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
              InputProps={{
                startAdornment: <SearchIcon sx={styles.searchFieldIcon} />
              }}
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

      {/* Stage 3: User detail + account mapping */}
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

          {/* Account mapping */}
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
                {renderTotalActiveAccountsTable()}
                {renderTotalMappedAccountsTable()}
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