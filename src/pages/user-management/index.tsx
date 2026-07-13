'use client'

import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import {
  Box,
  Button,
  Card,
  Grid,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import SearchIcon from '@mui/icons-material/Search'
import Table from 'src/@core/components/apps/user-management/Table'
import Link from 'next/link'
import { useUserManagement } from 'src/@core/hooks/apps/useUserManagement'
import LoadingButton from '@mui/lab/LoadingButton'

// ** Original Theme Colors (same palette as PartyUserManagement)
const colors = {
  green: '#10b981',
  greenHover: '#059669',
  yellow: '#eab308',
  yellowHover: '#ca8a04',
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

// ** Stats shown per role, sirf label/values badalte hain, layout same rehta hai
const roleStats: Record<RoleTab, { totalLabel: string; total: string; active: string; blocked: string }> = {
  maker: { totalLabel: 'Total Makers', total: '1,284', active: '1,140', blocked: '18' },
  checker: { totalLabel: 'Total Checkers', total: '512', active: '470', blocked: '6' },
  viewer: { totalLabel: 'Total Viewers', total: '3,096', active: '2,910', blocked: '24' }
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

const Page = () => {
  const [activeTab, setActiveTab] = useState<RoleTab>('maker')

  const [filters, setFilters] = useState<SearchFilters>({
    userType: 'retail',
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    partyId: ''
  })

  const handleTabChange = (_event: React.SyntheticEvent, newValue: RoleTab) => {
    setActiveTab(newValue)
    // TODO: role badalte hi search results/filters ko reset ya re-fetch karein agar zaroorat ho
  }

  const handleFilterChange = (field: keyof SearchFilters) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleSearch = () => {
    // TODO: activeTab (maker/checker/viewer) + filters ke sath actual API call yahan karein
  }

  const handleCancel = () => {
    // TODO: search form ko band/collapse karne ka logic (agar future mein collapsible banaya)
  }

  const handleClear = () => {
    setFilters({
      userType: 'retail',
      userName: '',
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      partyId: ''
    })
  }

  const stats = roleStats[activeTab]

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
          <Typography variant='h5' sx={{ fontWeight: 700 }}>
            User Management
          </Typography>
          <Link href={'/user-management/add-user'}>
            <LoadingButton
              variant='contained'
              loadingPosition='end'
              startIcon={<PersonAddAltIcon />}
            >
              Create User
            </LoadingButton>
          </Link>
        </Box>
      </Grid>

      {/* Role Tabs: Maker / Checker / Viewer */}
      <Grid item xs={12}>
        <Card sx={{ px: 2, boxShadow: 2 }}>
          <StyledTabs value={activeTab} onChange={handleTabChange} variant='fullWidth'>
            <StyledTab label='Maker' value='maker' />
            <StyledTab label='Checker' value='checker' />
            <StyledTab label='Viewer' value='viewer' />
          </StyledTabs>
        </Card>
      </Grid>

      {/* Quick Stats — active tab ke mutabiq */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', gap: 2.5, flexDirection: { xs: 'column', md: 'row' } }}>
          <StyledStatCard>
            <StyledInfoLabel sx={{ mb: 0.75 }}>{stats.totalLabel}</StyledInfoLabel>
            <Typography sx={{ fontSize: '1.75rem', fontWeight: 700 }}>{stats.total}</Typography>
          </StyledStatCard>

          <StyledStatCard sx={{ borderLeftColor: colors.green }}>
            <StyledInfoLabel sx={{ mb: 0.75 }}>Active Users</StyledInfoLabel>
            <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.green }}>{stats.active}</Typography>
          </StyledStatCard>

          <StyledStatCard sx={{ borderLeftColor: colors.danger }}>
            <StyledInfoLabel sx={{ mb: 0.75 }}>Blocked Users</StyledInfoLabel>
            <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.danger }}>{stats.blocked}</Typography>
          </StyledStatCard>
        </Box>
      </Grid>

      {/* Search Engine */}
      <Grid item xs={12}>
        <StyledSearchCard>
          <Typography variant='h6' sx={{ fontWeight: 600, mb: 3 }}>
            Search {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}s
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                disabled
                size='small'
                label='User Type'
                value='corporate'
              >
                <MenuItem value='corporate'>Corporate</MenuItem>
              </TextField>
            </Grid>
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
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size='small'
                label='Party ID'
                value={filters.partyId}
                onChange={handleFilterChange('partyId')}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 1.5, mt: 4, flexWrap: 'wrap' }}>

            <LoadingButton
              variant='contained'
              startIcon={<SearchIcon fontSize='small' />}
              onClick={handleSearch}
            >
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
            
            <LoadingButton
              variant='outlined'
              onClick={handleClear}
            >
              Clear
            </LoadingButton>
          </Box>
        </StyledSearchCard>
        <Table />
      </Grid>
    </Grid> 
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'user-management-page'
}

export default Page