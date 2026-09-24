import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { Box, Button, Card, Divider, Grid, InputAdornment, MenuItem, Tab, Tabs, TextField, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PublicIcon from '@mui/icons-material/Public'
import CategoryIcon from '@mui/icons-material/Category'
import GroupsIcon from '@mui/icons-material/Groups'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type BeneficiaryType = 'oftt' | 'ft'

export interface FtBeneficiaryInput {
  type: 'ft'
  bank: string
  accountNumber: string
}

export interface OfttBeneficiaryInput {
  type: 'oftt'
  bank: string
  accountNumber: string
  name: string
  country: string
  purpose: string
  relationship: string
  department: string
  subDepartment: string
  streetName: string
  buildingNumber: string
  buildingName: string
  floor: string
  postBox: string
  room: string
  postCode: string
  townName: string
  townLocationName: string
  districtName: string
  countrySubdivision: string
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const FT_FIXED_BANK = 'Bank Al Habib'

const countryOptions = [
  { value: 'pk', label: 'Pakistan' },
  { value: 'ae', label: 'United Arab Emirates' },
  { value: 'sa', label: 'Saudi Arabia' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'us', label: 'United States' }
]

const purposeOptions = [
  { value: 'family-support', label: 'Family Maintenance / Support' },
  { value: 'education', label: 'Education' },
  { value: 'medical', label: 'Medical Treatment' },
  { value: 'business', label: 'Business Payment' },
  { value: 'gift', label: 'Gift' },
  { value: 'other', label: 'Other' }
]

const relationshipOptions = [
  { value: 'brother', label: 'Brother' },
  { value: 'sister', label: 'Sister' },
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'friend', label: 'Friend' },
  { value: 'business-partner', label: 'Business Partner' },
  { value: 'other', label: 'Other' }
]

const emptyOfttInput: OfttBeneficiaryInput = {
  type: 'oftt',
  bank: '',
  accountNumber: '',
  name: '',
  country: '',
  purpose: '',
  relationship: '',
  department: '',
  subDepartment: '',
  streetName: '',
  buildingNumber: '',
  buildingName: '',
  floor: '',
  postBox: '',
  room: '',
  postCode: '',
  townName: '',
  townLocationName: '',
  districtName: '',
  countrySubdivision: ''
}

// -----------------------------------------------------------------------------
// Styled bits (kept consistent with the payment form pages)
// -----------------------------------------------------------------------------

const StyledFormCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4.25),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2]
}))

const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  textTransform: 'uppercase',
  letterSpacing: '0.75px',
  color: theme.palette.text.secondary,
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}))

// -----------------------------------------------------------------------------
// Fixes the classic MUI Select bug where, if the page (or a scrollable
// container inside the layout) is scrolled while the dropdown menu is open,
// the menu stays visually "stuck" in its original spot instead of following
// or closing. The Popover only repositions on window resize, not on scroll of
// a non-window scroll container, so instead we just close the menu the moment
// any scrolling happens. The `true` (capture phase) on the listener means it
// also catches scroll events from inner scrollable containers, not just the
// window itself.
// -----------------------------------------------------------------------------
const useScrollCloseSelect = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const closeOnScroll = () => setOpen(false)

    window.addEventListener('scroll', closeOnScroll, true)

    return () => window.removeEventListener('scroll', closeOnScroll, true)
  }, [open])

  return {
    open,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false)
  }
}

// -----------------------------------------------------------------------------
// Page
//
// Navigate here with `?type=ft` or `?type=oftt`. No type -> tabs let the user
// pick. Optional `returnTo` query param is threaded through to the review and
// success pages so "Go Home" / "Done" can return to a specific caller page.
// -----------------------------------------------------------------------------

const Page = () => {
  const router = useRouter()

  const queryType = typeof router.query.type === 'string' ? router.query.type : undefined
  const returnTo = typeof router.query.returnTo === 'string' ? router.query.returnTo : undefined

  const [manualType, setManualType] = useState<BeneficiaryType>('ft')
  const activeType: BeneficiaryType = queryType === 'oftt' || queryType === 'ft' ? queryType : manualType

  // FT state
  const [ftAccountNumber, setFtAccountNumber] = useState('')
  const [ftTouched, setFtTouched] = useState(false)
  const ftError = ftTouched && ftAccountNumber.trim() === ''

  // OFTT state
  const [oftt, setOftt] = useState<OfttBeneficiaryInput>(emptyOfttInput)
  const [ofttTouched, setOfttTouched] = useState<Record<string, boolean>>({})

  // Scroll-safe dropdowns (see useScrollCloseSelect above)
  const countrySelect = useScrollCloseSelect()
  const purposeSelect = useScrollCloseSelect()
  const relationshipSelect = useScrollCloseSelect()

  const handleOfttChange = (field: keyof OfttBeneficiaryInput) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setOftt(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleOfttBlur = (field: keyof OfttBeneficiaryInput) => () => {
    setOfttTouched(prev => ({ ...prev, [field]: true }))
  }

  const ofttRequiredFields: Array<keyof OfttBeneficiaryInput> = [
    'bank',
    'accountNumber',
    'name',
    'country',
    'purpose',
    'townName'
  ]

  const isOfttValid =
    ofttRequiredFields.every(field => String(oftt[field]).trim() !== '') && oftt.country.trim().length <= 2

  const ofttErrorFor = (field: keyof OfttBeneficiaryInput) =>
    Boolean(ofttTouched[field]) && ofttRequiredFields.includes(field) && String(oftt[field]).trim() === ''

  const pushToReview = (payload: FtBeneficiaryInput | OfttBeneficiaryInput) => {
    router.push({
      pathname: '/Corporate-InnerPages/beneficiary-management/review-add-beneficiary',
      query: {
        data: encodeURIComponent(JSON.stringify(payload)),
        ...(returnTo ? { returnTo } : {})
      }
    })
  }

  const handleFtReview = () => {
    if (ftAccountNumber.trim() === '') {
      setFtTouched(true)
      return
    }

    pushToReview({ type: 'ft', bank: FT_FIXED_BANK, accountNumber: ftAccountNumber.trim() })
  }

  const handleOfttReview = () => {
    if (!isOfttValid) {
      const allTouched: Record<string, boolean> = {}
      ofttRequiredFields.forEach(field => (allTouched[field] = true))
      setOfttTouched(allTouched)
      return
    }

    pushToReview(oftt)
  }

  const handleBack = () => router.back()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button startIcon={<ArrowBackIcon fontSize='small' />} onClick={handleBack} sx={{ color: 'text.secondary' }}>
            Back
          </Button>
          <Typography variant='h5' sx={{ fontWeight: 700 }}>
            Add Beneficiary
          </Typography>
        </Box>
      </Grid>

      {!queryType && (
        <Grid item xs={12}>
          <Tabs
            value={manualType}
            onChange={(_event, value: BeneficiaryType) => setManualType(value)}
            sx={{ minHeight: 36, '& .MuiTab-root': { minHeight: 36, textTransform: 'none', fontWeight: 600 } }}
          >
            <Tab value='ft' label='Same-Bank (Fund Transfer)' />
            <Tab value='oftt' label='International (OFTT)' />
          </Tabs>
        </Grid>
      )}

      {activeType === 'ft' ? (
        <Grid item xs={12}>
          <StyledFormCard>
            <StyledSectionTitle>
              <PersonOutlineIcon sx={{ fontSize: 18 }} />
              Add Beneficiary — Bank Al Habib
            </StyledSectionTitle>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size='small'
                  label='Bank'
                  value={FT_FIXED_BANK}
                  disabled
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <AccountBalanceIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size='small'
                  label='Account Number'
                  placeholder='e.g. PK27BAHL6002098102054201'
                  value={ftAccountNumber}
                  onChange={event => setFtAccountNumber(event.target.value)}
                  onBlur={() => setFtTouched(true)}
                  error={ftError}
                  helperText={ftError ? 'Account Number is required' : ' '}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <CreditCardIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>

            <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 1 }}>
              Since this is a same-bank transfer, we'll look up the beneficiary's name automatically
              on the next screen once the account number is verified.
            </Typography>
          </StyledFormCard>
        </Grid>
      ) : (
        <>
          <Grid item xs={12}>
            <StyledFormCard>
              <StyledSectionTitle>
                <PersonOutlineIcon sx={{ fontSize: 18 }} />
                Beneficiary Details
              </StyledSectionTitle>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Bank'
                    placeholder='e.g. Habib Bank Limited'
                    value={oftt.bank}
                    onChange={handleOfttChange('bank')}
                    onBlur={handleOfttBlur('bank')}
                    error={ofttErrorFor('bank')}
                    helperText={ofttErrorFor('bank') ? 'Bank is required' : ' '}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <AccountBalanceIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Account Number / IBAN'
                    placeholder='e.g. PK00XXXX0000000000000000'
                    value={oftt.accountNumber}
                    onChange={handleOfttChange('accountNumber')}
                    onBlur={handleOfttBlur('accountNumber')}
                    error={ofttErrorFor('accountNumber')}
                    helperText={ofttErrorFor('accountNumber') ? 'Account Number is required' : ' '}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <CreditCardIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Beneficiary Name'
                    value={oftt.name}
                    onChange={handleOfttChange('name')}
                    onBlur={handleOfttBlur('name')}
                    error={ofttErrorFor('name')}
                    helperText={ofttErrorFor('name') ? 'Beneficiary Name is required' : ' '}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <PersonOutlineIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    size='small'
                    label='Purpose'
                    value={oftt.purpose}
                    onChange={handleOfttChange('purpose')}
                    onBlur={handleOfttBlur('purpose')}
                    error={ofttErrorFor('purpose')}
                    helperText={ofttErrorFor('purpose') ? 'Purpose is required' : ' '}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <CategoryIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        </InputAdornment>
                      )
                    }}
                    SelectProps={{
                      open: purposeSelect.open,
                      onOpen: purposeSelect.onOpen,
                      onClose: purposeSelect.onClose
                    }}
                  >
                    {purposeOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 0.5 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    size='small'
                    label='Relationship with Beneficiary'
                    value={oftt.relationship}
                    onChange={handleOfttChange('relationship')}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <GroupsIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        </InputAdornment>
                      )
                    }}
                    SelectProps={{
                      open: relationshipSelect.open,
                      onOpen: relationshipSelect.onOpen,
                      onClose: relationshipSelect.onClose
                    }}
                  >
                    {relationshipOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </StyledFormCard>
          </Grid>

          <Grid item xs={12}>
            <StyledFormCard>
              <StyledSectionTitle>
                <PublicIcon sx={{ fontSize: 18 }} />
                Beneficiary Address
              </StyledSectionTitle>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Department'
                    value={oftt.department}
                    onChange={handleOfttChange('department')}
                    InputLabelProps={{ shrink: Boolean(oftt.department) }}
                    inputProps={{ maxLength: 70 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Sub-Department'
                    value={oftt.subDepartment}
                    onChange={handleOfttChange('subDepartment')}
                    InputLabelProps={{ shrink: Boolean(oftt.subDepartment) }}
                    inputProps={{ maxLength: 70 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Street Name'
                    value={oftt.streetName}
                    onChange={handleOfttChange('streetName')}
                    InputLabelProps={{ shrink: Boolean(oftt.streetName) }}
                    inputProps={{ maxLength: 70 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Building Number'
                    value={oftt.buildingNumber}
                    onChange={handleOfttChange('buildingNumber')}
                    InputLabelProps={{ shrink: Boolean(oftt.buildingNumber) }}
                    inputProps={{ maxLength: 16 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Building Name'
                    value={oftt.buildingName}
                    onChange={handleOfttChange('buildingName')}
                    InputLabelProps={{ shrink: Boolean(oftt.buildingName) }}
                    inputProps={{ maxLength: 35 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Floor'
                    value={oftt.floor}
                    onChange={handleOfttChange('floor')}
                    InputLabelProps={{ shrink: Boolean(oftt.floor) }}
                    inputProps={{ maxLength: 70 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Post Box'
                    value={oftt.postBox}
                    onChange={handleOfttChange('postBox')}
                    InputLabelProps={{ shrink: Boolean(oftt.postBox) }}
                    inputProps={{ maxLength: 16 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Room'
                    value={oftt.room}
                    onChange={handleOfttChange('room')}
                    InputLabelProps={{ shrink: Boolean(oftt.room) }}
                    inputProps={{ maxLength: 70 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Post Code'
                    value={oftt.postCode}
                    onChange={handleOfttChange('postCode')}
                    InputLabelProps={{ shrink: Boolean(oftt.postCode) }}
                    inputProps={{ maxLength: 16 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 0.5 }} />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    required
                    fullWidth
                    size='small'
                    label='Town Name'
                    value={oftt.townName}
                    onChange={handleOfttChange('townName')}
                    onBlur={handleOfttBlur('townName')}
                    error={ofttErrorFor('townName')}
                    helperText={ofttErrorFor('townName') ? 'Town Name is required' : ' '}
                    InputLabelProps={{ shrink: Boolean(oftt.townName) }}
                    inputProps={{ maxLength: 35 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Town Location Name'
                    value={oftt.townLocationName}
                    onChange={handleOfttChange('townLocationName')}
                    InputLabelProps={{ shrink: Boolean(oftt.townLocationName) }}
                    inputProps={{ maxLength: 35 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='District Name'
                    value={oftt.districtName}
                    onChange={handleOfttChange('districtName')}
                    InputLabelProps={{ shrink: Boolean(oftt.districtName) }}
                    inputProps={{ maxLength: 35 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Country Subdivision'
                    value={oftt.countrySubdivision}
                    onChange={handleOfttChange('countrySubdivision')}
                    InputLabelProps={{ shrink: Boolean(oftt.countrySubdivision) }}
                    inputProps={{ maxLength: 35 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    required
                    fullWidth
                    size='small'
                    label='Country'
                    value={oftt.country}
                    onChange={handleOfttChange('country')}
                    onBlur={handleOfttBlur('country')}
                    error={ofttErrorFor('country')}
                    helperText={ofttErrorFor('country') ? 'Country is required' : ' '}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <PublicIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        </InputAdornment>
                      )
                    }}
                    SelectProps={{
                      open: countrySelect.open,
                      onOpen: countrySelect.onOpen,
                      onClose: countrySelect.onClose
                    }}
                  >
                    {countryOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </StyledFormCard>
          </Grid>
        </>
      )}

      <Grid item xs={12}>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button variant='outlined' sx={{ borderColor: 'divider', color: 'text.primary' }} onClick={handleBack}>
            Cancel
          </Button>
          <Button variant='contained' onClick={activeType === 'ft' ? handleFtReview : handleOfttReview}>
            Review
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

Page.acl = { action: 'itsHaveAccess', subject: 'add-beneficiary' }

export default Page