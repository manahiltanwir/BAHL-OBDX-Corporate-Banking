'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import EditIcon from '@mui/icons-material/Edit'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import Link from 'next/link'
import { useUserManagement } from 'src/@core/hooks/apps/useUserManagement'
import LoadingButton from '@mui/lab/LoadingButton'
import { EDIT_USER_STORAGE_KEY } from 'src/pages/user-management/add-user'
// ** Original Theme Colors (same palette as PartyUserManagement)
const colors = {
  green: '#15804f',
  greenHover: '#309a6a',
  yellow: '#eab308',
  yellowHover: '##F0A528',
  danger: '#ef4444',
  dangerHover: '#dc2626'
}



interface SearchFilters {
  userName: string
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
}

// ** Actual user shape (as used across the app)
interface UserType {
  fullName?: string
  userName?: string
  status?: string
  id: string
  image: string
  createdAt?: Date
  address?: string
  city?: string
  cnic?: string
  country?: string
  createdBy?: string
  creattionDate: Date
  dob?: Date
  email?: string
  firstName?: string
  lastName?: string
  middleName?: string
  mobileNumber?: string
  passport?: string
  postalCode?: string
  state?: string
  title?: string
  updatedBy?: string
  updatedDate?: Date
  userId?: string
}

const isBlocked = (user: UserType) => user.status?.toUpperCase() === 'BLOCKED'

const formatDate = (date?: Date) => (date ? new Date(date).toLocaleDateString() : '-')

// ** Dummy search results (replace with real API call later)
const getUserResults = (filters: SearchFilters): UserType[] => [
  {
    id: 'USR-1001',
    userId: 'USR-1001',
    userName: filters.userName || 'ahmed.khan',
    fullName: 'Ahmed Khan',
    firstName: 'Ahmed',
    lastName: 'Khan',
    email: 'ahmed.khan@bank.com',
    mobileNumber: '0300-1234567',
    status: 'ACTIVE',
    image: '',
    cnic: '35202-1234567-1',
    city: 'Karachi',
    country: 'Pakistan',
    creattionDate: new Date('2024-01-15')
  },
  {
    id: 'USR-1002',
    userId: 'USR-1002',
    userName: 'bilal.ahmed',
    fullName: 'Bilal Ahmed',
    firstName: 'Bilal',
    lastName: 'Ahmed',
    email: 'bilal.ahmed@bank.com',
    mobileNumber: '0301-2345678',
    status: 'BLOCKED',
    image: '',
    cnic: '35202-7654321-2',
    city: 'Lahore',
    country: 'Pakistan',
    creattionDate: new Date('2024-03-02')
  },
  {
    id: 'USR-1003',
    userId: 'USR-1003',
    userName: 'sara.malik',
    fullName: 'Sara Malik',
    firstName: 'Sara',
    lastName: 'Malik',
    email: 'sara.malik@bank.com',
    mobileNumber: '0302-3456789',
    status: 'ACTIVE',
    image: '',
    cnic: '35202-1122334-3',
    city: 'Islamabad',
    country: 'Pakistan',
    creattionDate: new Date('2024-05-20')
  }
]

// ** Styled Components
const StyledStatCard = styled(Card)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2.75),
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: theme.shadows[2],
  borderLeft: `6px solid ${colors.green}`
}))

const StyledSearchCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3.75),
  borderRadius: theme.shape.borderRadius * 1.75,
  boxShadow: theme.shadows[2]
}))

const StyledInfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  color: theme.palette.text.secondary,
  fontWeight: 700,
  textTransform: 'uppercase',
  marginBottom: theme.spacing(0.5)
}))

const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 44,
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: 3,
    backgroundColor: colors.green
  }
}))

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 44,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  '&.Mui-selected': {
    color: colors.green
  }
}))

// ** Results table styling
const StyledResultsCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3.75),
  borderRadius: theme.shape.borderRadius * 1.75,
  boxShadow: theme.shadows[2],
  overflow: 'hidden'
}))

const gridColumns = '1.3fr 1.7fr 2fr 1.3fr 1fr 1.4fr'

const TableHeaderRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: gridColumns,
  gap: theme.spacing(1),
  backgroundColor: colors.green,
  color: '#fff',
  padding: theme.spacing(1.5, 2.5),
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase'
}))

const TableBodyRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: gridColumns,
  gap: theme.spacing(1),
  alignItems: 'center',
  padding: theme.spacing(1.5, 2.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  '&:last-of-type': { borderBottom: 0 },
  '&:hover': { backgroundColor: theme.palette.action.hover }
}))

const Page = () => {
  const router = useRouter()


  const [filters, setFilters] = useState<SearchFilters>({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
  })

  // Search results shown in the table below the search card
  const [results, setResults] = useState<UserType[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  // Selected user for the details dialog
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [newUserName, setNewUserName] = useState('')



  const handleFilterChange = (field: keyof SearchFilters) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleSearch = () => {
    // TODO: activeTab (maker/checker/viewer) + filters ke sath actual API call yahan karein
    setResults(getUserResults(filters))
    setHasSearched(true)
  }

  const handleCancel = () => {
    // TODO: search form ko band/collapse karne ka logic (agar future mein collapsible banaya)
  }

  const handleClear = () => {
    setFilters({
      userName: '',
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
    })
    setResults([])
    setHasSearched(false)
  }

  // ---------- BLOCK / UNBLOCK (inline, directly from the table) ----------
  const handleToggleBlock = (event: React.MouseEvent, userId: string) => {
    event.stopPropagation() // row click se detail dialog na khule

    setResults(previous =>
      previous.map(user =>
        user.id === userId ? { ...user, status: isBlocked(user) ? 'ACTIVE' : 'BLOCKED' } : user
      )
    )

    // TODO: actual Block/Unblock API call yahan karein
  }

  // ---------- ROW CLICK -> DETAILS DIALOG ----------
  const handleRowClick = (user: UserType) => {
    setSelectedUser(user)
    setNewUserName(user.userName || '')
  }

  const handleCloseDetails = () => {
    setSelectedUser(null)
    setNewUserName('')
  }

  // Edit Details: selected user ka data sessionStorage mein daal ke
  // add-user page ko "edit" mode mein kholte hain, taake wahan saari
  // fields usi user ke data se pehle se bhari hui dikhein.
  const handleEditDetails = () => {
    if (!selectedUser) return

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(EDIT_USER_STORAGE_KEY, JSON.stringify(selectedUser))
    }

    router.push('/user-management/add-user?mode=edit')
  }

  const handleResetPassword = () => {
    // TODO: Reset Password API call yahan karein
  }

  const handleChangeUserName = () => {
    if (!selectedUser || !newUserName.trim()) return

    setResults(previous =>
      previous.map(user => (user.id === selectedUser.id ? { ...user, userName: newUserName.trim() } : user))
    )
    setSelectedUser(previous => (previous ? { ...previous, userName: newUserName.trim() } : previous))

    // TODO: actual Change User Name API call yahan karein
  }

  const { getUsers } = useUserManagement(null)

  useEffect(() => {
    getUsers({ query: {} })
  }, [])

  return (
    <Grid container spacing={6}>
      {/* Header: Title + Create User */}
      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 200 }}>
            A centralized dashboard to create, update, and manage user and permissions.
          </Typography>
          <Link href={'/user-management/add-user'}>
            <LoadingButton variant='contained' loadingPosition='end' startIcon={<PersonAddAltIcon />}>
              Create Admin User
            </LoadingButton>
          </Link>
        </Box>
      </Grid>

      {/* Search Engine */}
      <Grid item xs={12}>
        <StyledSearchCard>
          <Typography variant='h6' sx={{ fontWeight: 600, mb: 3 }}>
            {/* Search {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}s */}
            Search Admin
          </Typography>

          <Grid container spacing={3}>
          
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size='small'
                label='User Name'
                value={filters.userName}
                onChange={handleFilterChange('userName')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size='small'
                label='First Name'
                value={filters.firstName}
                onChange={handleFilterChange('firstName')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size='small'
                label='Last Name'
                value={filters.lastName}
                onChange={handleFilterChange('lastName')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size='small'
                label='Email'
                value={filters.email}
                onChange={handleFilterChange('email')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size='small'
                label='Mobile Number'
                value={filters.mobileNumber}
                onChange={handleFilterChange('mobileNumber')}
              />
            </Grid>
            
          </Grid>

          <Box sx={{ display: 'flex', gap: 1.5, mt: 4, flexWrap: 'wrap' }}>
            <LoadingButton variant='contained' startIcon={<SearchIcon fontSize='small' />} onClick={handleSearch}>
              Search
            </LoadingButton>

            <LoadingButton
              variant='contained'
              loadingPosition='end'
              onClick={handleCancel}
              sx={{ bgcolor: colors.yellow, color: '#fff', '&:hover': { bgcolor: colors.yellowHover } }}
            >
              Cancel
            </LoadingButton>

            <LoadingButton variant='outlined' onClick={handleClear}>
              Clear
            </LoadingButton>
          </Box>
        </StyledSearchCard>

        {/* Search Results Table */}
        {hasSearched && (
          <StyledResultsCard>
            <TableHeaderRow>
              <Box>User Name</Box>
              <Box>Full Name</Box>
              <Box>Email</Box>
              <Box>Mobile Number</Box>
              <Box>Status</Box>
              <Box>Action</Box>
            </TableHeaderRow>

            {results.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant='body2' color='text.secondary'>
                  No users found for the given search criteria.
                </Typography>
              </Box>
            ) : (
              results.map(user => {
                const blocked = isBlocked(user)

                return (
                  <TableBodyRow key={user.id} onClick={() => handleRowClick(user)}>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      {user.userName}
                    </Typography>
                    <Typography variant='body2'>{user.fullName || `${user.firstName || ''} ${user.lastName || ''}`}</Typography>
                    <Typography variant='body2' sx={{ overflowWrap: 'anywhere' }}>
                      {user.email}
                    </Typography>
                    <Typography variant='body2'>{user.mobileNumber}</Typography>
                    <Box>
                      <Chip
                        size='small'
                        label={blocked ? 'Blocked' : 'Active'}
                        sx={{ fontWeight: 700, color: '#fff', bgcolor: blocked ? colors.danger : colors.green }}
                      />
                    </Box>
                    <Box>
                      <Button
                        size='small'
                        variant='outlined'
                        startIcon={blocked ? <LockOpenIcon /> : <LockIcon />}
                        onClick={event => handleToggleBlock(event, user.id)}
                        sx={
                          blocked
                            ? { color: colors.green, borderColor: colors.green, '&:hover': { borderColor: colors.greenHover, bgcolor: 'transparent' } }
                            : { color: colors.danger, borderColor: colors.danger, '&:hover': { borderColor: colors.dangerHover, bgcolor: 'transparent' } }
                        }
                      >
                        {blocked ? 'Unblock' : 'Block'}
                      </Button>
                    </Box>
                  </TableBodyRow>
                )
              })
            )}
          </StyledResultsCard>
        )}
      </Grid>

      {/* User Details Dialog */}
      <Dialog open={Boolean(selectedUser)} onClose={handleCloseDetails} fullWidth maxWidth='sm'>
        {selectedUser && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar src={selectedUser.image} alt={selectedUser.fullName}>
                  {(selectedUser.firstName || selectedUser.userName || '?').charAt(0).toUpperCase()}
                </Avatar>
                User Details
              </Box>
              <IconButton size='small' onClick={handleCloseDetails}>
                <CloseIcon fontSize='small' />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>User ID</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>{selectedUser.userId || selectedUser.id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>User Name</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>{selectedUser.userName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>Full Name</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>
                    {selectedUser.fullName || `${selectedUser.firstName || ''} ${selectedUser.middleName || ''} ${selectedUser.lastName || ''}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>Title</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>{selectedUser.title || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>Email</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{selectedUser.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>Mobile Number</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>{selectedUser.mobileNumber}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>Date of Birth</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>{formatDate(selectedUser.dob)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>CNIC</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>{selectedUser.cnic || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>Passport</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>{selectedUser.passport || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>Status</StyledInfoLabel>
                  <Chip
                    size='small'
                    label={isBlocked(selectedUser) ? 'Blocked' : 'Active'}
                    sx={{
                      fontWeight: 700,
                      color: '#fff',
                      bgcolor: isBlocked(selectedUser) ? colors.danger : colors.green
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>Address</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>{selectedUser.address || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>City</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>{selectedUser.city || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>State</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>{selectedUser.state || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>Country</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>{selectedUser.country || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>Postal Code</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>{selectedUser.postalCode || '-'}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>Created By</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>{selectedUser.createdBy || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>Creation Date</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>{formatDate(selectedUser.creattionDate)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>Updated By</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>{selectedUser.updatedBy || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledInfoLabel>Updated Date</StyledInfoLabel>
                  <Typography sx={{ fontWeight: 600 }}>{formatDate(selectedUser.updatedDate)}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Change User Name */}
              <StyledInfoLabel>Change User Name</StyledInfoLabel>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}>
                <TextField
                  fullWidth
                  size='small'
                  value={newUserName}
                  onChange={event => setNewUserName(event.target.value)}
                />
                <Button
                  variant='contained'
                  disabled={!newUserName.trim() || newUserName.trim() === selectedUser.userName}
                  onClick={handleChangeUserName}
                  sx={{
                    bgcolor: colors.green,
                    '&:hover': { bgcolor: colors.greenHover },
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    width: { xs: '100%', sm: 'auto' },
                    minWidth: { sm: 190 },
                    px: 3
                  }}
                >
                  Update User Name
                </Button>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2.5, flexWrap: 'wrap', gap: 1 }}>
              <Button variant='outlined' startIcon={<EditIcon fontSize='small' />} onClick={handleEditDetails}>
                Edit Details
              </Button>
              <Button
                variant='outlined'
                startIcon={<VpnKeyIcon fontSize='small' />}
                onClick={handleResetPassword}
                sx={{ color: colors.yellow, borderColor: colors.yellow, '&:hover': { borderColor: colors.yellowHover, bgcolor: 'transparent' } }}
              >
                Reset Password
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'user-management-page'
}

export default Page