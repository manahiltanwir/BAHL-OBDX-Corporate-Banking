import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LoadingButton from '@mui/lab/LoadingButton'

interface UserRecord {
  fullName: string
  username: string
  primaryAccountNumber: string
  email: string
  mobile: string
  cif: string
  branch: string
}

// ** Original Theme Colors
const colors = {
  green: '#10b981',
  greenHover: '#059669',
  yellow: '#eab308',
  yellowHover: '#ca8a04',
  yellowLight: '#fef9c3',
  yellowText: '#854d0e',
  statusBg: '#d1fae5',
  statusText: '#065f46',
  statusBorder: '#a7f3d0',
  danger: '#ef4444',
  dangerHover: '#dc2626'
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

const StyledMainInfoCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4.25),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  height: '100%'
}))

const StyledActionsCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4.25),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.action.hover,
  height: '100%'
}))

const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  textTransform: 'uppercase',
  letterSpacing: '0.75px',
  color: theme.palette.text.secondary,
  fontWeight: 700,
  marginBottom: theme.spacing(3)
}))

const StyledInfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  color: theme.palette.text.secondary,
  fontWeight: 700,
  textTransform: 'uppercase',
  marginBottom: theme.spacing(0.5)
}))

const StyledInfoValue = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  color: theme.palette.text.primary
}))

const StyledRecoveryButton = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  textAlign: 'left',
  padding: theme.spacing(1.75, 2.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  fontSize: '0.875rem',
  fontWeight: 600,
  boxShadow: theme.shadows[1],
  '& .MuiButton-startIcon': {
    color: colors.green,
    transition: 'transform 0.2s ease'
  },
  '&:hover': {
    borderColor: colors.green,
    color: colors.greenHover,
    backgroundColor: theme.palette.background.paper,
    '& .MuiButton-startIcon': {
      transform: 'translateX(4px)'
    }
  }
}))

const PartyUserManagement = () => {
  const [searchInput, setSearchInput] = useState('ACT-9920145')
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const [user, setUser] = useState<UserRecord>({
    fullName: 'Muhammad Ali Khan',
    username: 'alikhan.pk99',
    primaryAccountNumber: '0123-456789-011',
    email: 'ali.khan@example.com',
    mobile: '+92 300 1234567',
    cif: 'CIF-776352',
    branch: '0042 - DHA Karachi'
  })

  const [accountTagging, setAccountTagging] = useState('hni')
  const [dailyLimit, setDailyLimit] = useState('1m')

  const handleSearch = () => {
    if (searchInput.trim() === '') return

    setLoading(true)
    // TODO: actual API call yahan karein, .then()/.finally() mein setLoading(false) karein
    setTimeout(() => {
      setLoading(false)
      setShowResults(true)
    }, 500)
  }

  const handleForgotPassword = () => {
    // TODO: trigger password reset flow
  }

  const handleForgotUsername = () => {
    // TODO: trigger username recovery flow
  }

  const handleBlockUser = () => {
    // TODO: confirm + block user access
  }

  const handleUnblockUser = () => {
    // TODO: unblock user access
  }

  return (
    <Grid container spacing={6}>
      {/* Quick Stats */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', gap: 2.5, flexDirection: { xs: 'column', md: 'row' } }}>
          <StyledStatCard>
            <StyledInfoLabel sx={{ mb: 0.75 }}>Total Managed Users</StyledInfoLabel>
            <Typography sx={{ fontSize: '1.75rem', fontWeight: 700 }}>148,290</Typography>
          </StyledStatCard>

          <StyledStatCard sx={{ borderLeftColor: colors.green }}>
            <StyledInfoLabel sx={{ mb: 0.75 }}>Active Sessions</StyledInfoLabel>
            <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.green }}>3,412</Typography>
          </StyledStatCard>

          <StyledStatCard sx={{ borderLeftColor: colors.yellow }}>
            <StyledInfoLabel sx={{ mb: 0.75 }}>Flagged / Blocked Accounts</StyledInfoLabel>
            <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.yellowText }}>42</Typography>
          </StyledStatCard>
        </Box>
      </Grid>

      {/* Search */}
      <Grid item xs={12}>
        <StyledSearchCard>
          <Typography variant='h6' sx={{ fontWeight: 600, mb: 2.25 }}>
            User Identification & Lookup
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.75, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <TextField
              fullWidth
              placeholder='Enter Customer CIF, Account Number, Email or Mobile Number...'
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon fontSize='small' />
                  </InputAdornment>
                )
              }}
            />
            <LoadingButton
              variant='contained'
              loading={loading}
              loadingPosition='end'
              onClick={handleSearch}
              sx={{
                height: 52,
                minWidth: 160,
                bgcolor: colors.green,
                '&:hover': { bgcolor: colors.greenHover }
              }}
            >
              Search Profile
            </LoadingButton>
          </Box>
        </StyledSearchCard>
      </Grid>

      {/* Result Card — search hone ke baad hi dikhega */}
      {showResults && (
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {/* Left: Customer Details */}
            <Grid item xs={12} md={7}>
              <StyledMainInfoCard>
                <StyledSectionTitle>Customer Details Box</StyledSectionTitle>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Full Name</StyledInfoLabel>
                    <StyledInfoValue>{user.fullName}</StyledInfoValue>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Account Status</StyledInfoLabel>
                    <Chip
                      label='Active / Verified'
                      size='small'
                      sx={{
                        bgcolor: colors.statusBg,
                        color: colors.statusText,
                        border: `1px solid ${colors.statusBorder}`,
                        fontWeight: 600
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Username</StyledInfoLabel>
                    <StyledInfoValue>{user.username}</StyledInfoValue>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Primary Account Number</StyledInfoLabel>
                    <StyledInfoValue>{user.primaryAccountNumber}</StyledInfoValue>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Registered Email</StyledInfoLabel>
                    <StyledInfoValue>{user.email}</StyledInfoValue>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Mobile Number</StyledInfoLabel>
                    <StyledInfoValue>{user.mobile}</StyledInfoValue>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>CIF / Customer ID</StyledInfoLabel>
                    <StyledInfoValue>{user.cif}</StyledInfoValue>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Branch Code</StyledInfoLabel>
                    <StyledInfoValue>{user.branch}</StyledInfoValue>
                  </Grid>
                </Grid>

                <Box sx={{ borderTop: '1px dashed', borderColor: 'divider', pt: 3.75 }}>
                  <StyledSectionTitle sx={{ mb: 1 }}>Credential Management</StyledSectionTitle>
                  <Typography variant='body2' sx={{ color: 'text.secondary', mb: 2.5 }}>
                    Send secure reset tokens directly to user&apos;s registered communication channels.
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <StyledRecoveryButton startIcon={<ArrowForwardIcon fontSize='small' />} onClick={handleForgotPassword}>
                      Trigger Forgot Password Reset
                    </StyledRecoveryButton>
                    <StyledRecoveryButton startIcon={<ArrowForwardIcon fontSize='small' />} onClick={handleForgotUsername}>
                      Trigger Forgot Username Recovery
                    </StyledRecoveryButton>
                  </Box>
                </Box>
              </StyledMainInfoCard>
            </Grid>

            {/* Right: Governance / Actions */}
            <Grid item xs={12} md={5}>
              <StyledActionsCard>
                <StyledSectionTitle>Account Governance</StyledSectionTitle>

                <Box sx={{ mb: 3.25 }}>
                  <Typography variant='body2' sx={{ fontWeight: 600, mb: 1.25 }}>
                    Account Tagging / Segment
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size='small'
                    value={accountTagging}
                    onChange={e => setAccountTagging(e.target.value)}
                    sx={{ bgcolor: 'background.paper' }}
                  >
                    <MenuItem value='retail'>Standard Retail Account</MenuItem>
                    <MenuItem value='corporate'>Corporate / Business</MenuItem>
                    <MenuItem value='hni'>HNI / Premium VIP Account</MenuItem>
                    <MenuItem value='staff'>Bank Staff Account</MenuItem>
                  </TextField>
                </Box>

                <Box sx={{ mb: 3.25 }}>
                  <Typography variant='body2' sx={{ fontWeight: 600, mb: 1.25 }}>
                    Daily Transaction Limit (PKR)
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size='small'
                    value={dailyLimit}
                    onChange={e => setDailyLimit(e.target.value)}
                    sx={{ bgcolor: 'background.paper' }}
                  >
                    <MenuItem value='50k'>50,000 PKR</MenuItem>
                    <MenuItem value='250k'>250,000 PKR</MenuItem>
                    <MenuItem value='500k'>500,000 PKR</MenuItem>
                    <MenuItem value='1m'>1,000,000 PKR (Maximum Authorized)</MenuItem>
                  </TextField>
                </Box>

                <Box sx={{ height: '1px', bgcolor: 'divider', my: 3.75 }} />

                <Box>
                  <Typography variant='body2' sx={{ fontWeight: 700, color: colors.danger, mb: 1 }}>
                    Critical Security Controls
                  </Typography>
                  <Typography variant='body2' sx={{ color: 'text.secondary', mb: 2.5 }}>
                    Freeze or restore digital banking access immediately in case of active fraud or compliance holds.
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                      fullWidth
                      variant='contained'
                      onClick={handleBlockUser}
                      sx={{ bgcolor: colors.danger, '&:hover': { bgcolor: colors.dangerHover } }}
                    >
                      Block User Access
                    </Button>
                    <Button
                      fullWidth
                      variant='contained'
                      onClick={handleUnblockUser}
                      sx={{ bgcolor: colors.yellow, color: '#fff', '&:hover': { bgcolor: colors.yellowHover } }}
                    >
                      Unblock User Access
                    </Button>
                  </Box>
                </Box>
              </StyledActionsCard>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}

PartyUserManagement.acl = {
  action: 'itsHaveAccess',
  subject: 'user-management-page'
}

export default PartyUserManagement