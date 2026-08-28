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
import ApartmentIcon from '@mui/icons-material/Apartment'
import Link from 'next/link'
import { useUserManagement } from 'src/@core/hooks/apps/useUserManagement'
import LoadingButton from '@mui/lab/LoadingButton'
import { EDIT_USER_STORAGE_KEY } from './add-user'
import ResultsTable, { ResultsTableColumn } from 'src/@core/components/Resultstable'
import { UserManagementForm } from 'src/types/apps/userManagement'
import { InputField } from 'src/@core/components/form'
import Table from 'src/@core/components/apps/user-management/Table'
import DeleteAlert from 'src/@core/components/common/deleteAlert'
import { ModalType } from 'src/types'
import UserStatusAlert from 'src/@core/components/apps/user-management/UserStatusAlert'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'

// ** Original Theme Colors (same palette as PartyUserManagement)
const colors = {
  green: '#15804f',
  greenHover: '#309a6a',
  yellow: '#eab308',
  yellowHover: '##F0A528',
  danger: '#ef4444',
  dangerHover: '#dc2626'
}

type RoleTab = 'maker' | 'checker' | 'viewer'

interface SearchFilters {
  userType: string
  userName: string
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  partyId: string
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
  partyId?: string
  partyName?: string
}

const isBlocked = (user: UserType) => user.status?.toUpperCase() === 'BLOCKED'

const formatDate = (date?: Date) => (date ? new Date(date).toLocaleDateString() : '-')

const getUserResults = (filters: SearchFilters): UserType[] => {
  const withParty = (fallbackPartyId: string, fallbackPartyName: string) => ({
    partyId: filters.partyId || fallbackPartyId,
    partyName: filters.partyId ? `${filters.partyId.toUpperCase()} — Sample Party` : fallbackPartyName
  })

  return [
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
      creattionDate: new Date('2024-01-15'),
      ...withParty('P-1001', 'Al-Falah Textiles (Pvt) Ltd')
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
      creattionDate: new Date('2024-03-02'),
      ...withParty('P-1002', 'Zaman Trading Enterprises')
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
      creattionDate: new Date('2024-05-20'),
      ...withParty('P-1003', 'Karachi Exports Co.')
    }
  ]
}

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
  boxShadow: theme.shadows[2],
  marginBottom: 10
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

const userResultsColumns: ResultsTableColumn[] = [
  { key: 'userName', label: 'User Name' },
  { key: 'fullName', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'mobileNumber', label: 'Mobile Number' },
  { key: 'status', label: 'Status' },
  { key: 'action', label: 'Action' }
]

const userResultsGridColumns = '1.3fr 1.7fr 2fr 1.3fr 1fr 1.4fr'

const Page = () => {
  const router = useRouter()

  const { serviceId, isDrawerOpen, handleDrawer } = useToggleDrawer()

  const { form: { control, handleSubmit, reset }, getUsers, store, clickedModule, setClickedModule } = useUserManagement(null)

  const [filters, setFilters] = useState<SearchFilters>({
    userType: 'retail',
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    partyId: ''
  })

  // Search results shown in the table below the search card
  const [results, setResults] = useState<UserType[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  // Selected user for the details dialog
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [isEditing, setIsEditing] = useState(false)
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
  const handleEditSave = () => {
    if (isEditing) {
      console.log(selectedUser?.userName)
    }

    setIsEditing(!isEditing)
  }
  const handleClear = () => {
    reset()
    // setFilters({
    //   userType: 'retail',
    //   userName: '',
    //   firstName: '',
    //   lastName: '',
    //   email: '',
    //   mobileNumber: '',
    //   partyId: ''
    // })
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

  const handleEditDetails = () => {
    if (!selectedUser) return

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(EDIT_USER_STORAGE_KEY, JSON.stringify(selectedUser))
    }

    router.push('/user-management/add-user?mode=edit')
  }
  const handleChangeUserName = () => {
    if (!selectedUser || !newUserName.trim()) return

    setResults(previous =>
      previous.map(user => (user.id === selectedUser.id ? { ...user, userName: newUserName.trim() } : user))
    )
    setSelectedUser(previous => (previous ? { ...previous, userName: newUserName.trim() } : previous))

  }

  useEffect(() => {
    // getUsers({ query: {} })
  }, [])

  const onSubmit = (data: UserManagementForm) => {
    data.cnic = '';
    delete data.userType
    getUsers(data).then((res) => {
      setResults(getUserResults(filters))
      setHasSearched(true)
    })
  }

  const handleActivateUser = () => {
    console.log('Activate User Clicked');
  }

  const handleInactivateUser = () => {
    console.log('Inactivate User Clicked');
  }

  const handleResetPassword = () => {
    console.log('Reset Password Clicked');

  }

  const handleResetUserName = () => {
    console.log('Reset User Name Clicked');
  }

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
            A centralized dashboard to create, update, and manage user accounts and permissions.
          </Typography>
          <Link href={'/user-management/add-user'}>
            <LoadingButton variant='contained' loadingPosition='end' startIcon={<PersonAddAltIcon />}>
              Create User
            </LoadingButton>
          </Link>
        </Box>
      </Grid>

      {/* Search Engine */}
      <Grid item xs={12}>
        <StyledSearchCard>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant='h6' sx={{ fontWeight: 600, mb: 3 }}>
              Search User
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <InputField
                  name='userType'
                  label='Corporate'
                  placeholder='Corporate'
                  type='text'
                  disabled
                  control={control}
                  size='small'
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InputField
                  name='username'
                  label='User Name'
                  placeholder='Enter User Name'
                  type='text'
                  control={control}
                  size='small'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InputField
                  name='firstName'
                  label='First Name'
                  placeholder='Enter First Name'
                  type='text'
                  control={control}
                  size='small'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InputField
                  name='lastName'
                  label='Last Name'
                  placeholder='Enter Last Name'
                  type='text'
                  control={control}
                  fullWidth
                  size='small'
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InputField
                  name='email'
                  label='Email'
                  placeholder='Enter Email'
                  type='text'
                  control={control}
                  fullWidth
                  size='small'
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InputField
                  name='mobileNumber'
                  label='Mobile Number'
                  placeholder='Enter Mobile Number'
                  type='number'
                  control={control}
                  size='small'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InputField
                  name='partyId'
                  label='Party ID'
                  placeholder='Enter Party Id'
                  type='text'
                  control={control}
                  size='small'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InputField
                  name='userId'
                  label='User ID'
                  placeholder='Enter User Id'
                  type='text'
                  control={control}
                  size='small'
                  fullWidth
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 4, flexWrap: 'wrap' }}>
              <LoadingButton variant='contained' startIcon={<SearchIcon fontSize='small' />} type='submit'>
                Search
              </LoadingButton>

              {/* <LoadingButton
                variant='contained'
                loadingPosition='end'
                onClick={handleCancel}
                sx={{ bgcolor: colors.yellow, color: '#fff', '&:hover': { bgcolor: colors.yellowHover } }}
              >
                Cancel
              </LoadingButton> */}

              <LoadingButton variant='outlined' onClick={handleClear}>
                Clear
              </LoadingButton>
            </Box>
          </form>
        </StyledSearchCard>

        {/* Search Results Table */}
        {store.entities.length ? <Table setClickedModule={setClickedModule} /> : null}
        {/* {hasSearched && (
          <ResultsTable
            columns={userResultsColumns}
            gridTemplateColumns={userResultsGridColumns}
            rows={results}
            getRowKey={user => user.id}
            onRowClick={handleRowClick}
            emptyMessage='No users found for the given search criteria.'
            headerColor={colors.green}
            renderRow={user => {
              const blocked = isBlocked(user)

              return (
                <>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    {user.userName}
                  </Typography>
                  <Typography variant='body2'>
                    {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`}
                  </Typography>
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
                          ? {
                            color: colors.green,
                            borderColor: colors.green,
                            '&:hover': { borderColor: colors.greenHover, bgcolor: 'transparent' }
                          }
                          : {
                            color: colors.danger,
                            borderColor: colors.danger,
                            '&:hover': { borderColor: colors.dangerHover, bgcolor: 'transparent' }
                          }
                      }
                    >
                      {blocked ? 'Unblock' : 'Block'}
                    </Button>
                  </Box>
                </>
              )
            }}
          />
        )} */}
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
              {(selectedUser.partyId || selectedUser.partyName) && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2.5,
                    flexWrap: 'wrap',
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(21, 128, 79, 0.08)',
                    border: `1px solid rgba(21, 128, 79, 0.25)`
                  }}
                >
                  <Avatar sx={{ bgcolor: colors.green, width: 40, height: 40 }}>
                    <ApartmentIcon fontSize='small' />
                  </Avatar>
                  <Box>
                    <StyledInfoLabel sx={{ mb: 0 }}>Party ID</StyledInfoLabel>
                    <Typography sx={{ fontWeight: 700 }}>{selectedUser.partyId || '-'}</Typography>
                  </Box>
                  <Divider orientation='vertical' flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                  <Box>
                    <StyledInfoLabel sx={{ mb: 0 }}>Party Name</StyledInfoLabel>
                    <Typography sx={{ fontWeight: 700 }}>{selectedUser.partyName || '-'}</Typography>
                  </Box>
                </Box>
              )}

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
                    {selectedUser.fullName ||
                      `${selectedUser.firstName || ''} ${selectedUser.middleName || ''} ${selectedUser.lastName || ''}`}
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

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <TextField
                  fullWidth
                  label="Username"
                  value={selectedUser?.userName || ''}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setSelectedUser(prev =>
                      prev
                        ? {
                          ...prev,
                          userName: e.target.value
                        }
                        : null
                    )
                  }
                />

                <Button
                  variant="contained"
                  onClick={handleEditSave}
                  sx={{ whiteSpace: 'nowrap', height: 45 }}
                >
                  {isEditing ? 'Save' : 'Edit Username'}
                </Button>
              </Box>
              <Divider sx={{ my: 3 }} />
            </DialogContent>

            <DialogActions sx={{ p: 2, flexWrap: 'wrap', }}>
              <Button variant='contained' startIcon={<EditIcon fontSize='small' />} onClick={handleEditDetails}>
                Edit Details
              </Button>
              <Button
                variant='contained'
                startIcon={<VpnKeyIcon fontSize='small' />}
              // onClick={handleResetPassword}
              >
                Reset Password
              </Button>
              <Button
                variant='contained'
                startIcon={<VpnKeyIcon fontSize='small' />}
              // onClick={handleResetPassword}
              >
                Reset Username
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      {/* <UserStatusAlert title={clickedModule == 'InactiveUser' ? 'User Status' : clickedModule == 'resetPassword' ? 'Reset Password' : "Reset User Name"} type={ModalType.DEFAULT} onAgree={clickedModule == 'InactiveUser' ? () => handleActivateUser() : clickedModule == 'resetPassword' ? () => handleResetPassword() : () => handleResetUserName()} /> */}
      {/* <UserStatusAlert
        title={
          clickedModule === 'activeUser' ? 'Active User Status' :
            clickedModule === 'resetPassword' ? 'Reset Password' :
              clickedModule === 'resetUsername' ? 'Reset User Name' : 
              clickedModule === 'InactiveUser' ? 'Inactive User Status' : 
              ''
        }
        type={ModalType.DEFAULT}
        onAgree={
          (clickedModule === 'activeUser') ? () => handleActivateUser() :
            clickedModule === 'resetPassword' ? () => handleResetPassword() :
              clickedModule === 'resetUsername' ? () => handleResetUserName() :
              clickedModule === 'InactiveUser' ? () => handleInactivateUser() :
                () => { } // Safe fallback for empty state
        }
      /> */}

    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'user-management-page'
}

export default Page