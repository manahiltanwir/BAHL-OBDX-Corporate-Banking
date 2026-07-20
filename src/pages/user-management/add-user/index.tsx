import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import SearchIcon from '@mui/icons-material/Search'
import ApartmentIcon from '@mui/icons-material/Apartment'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import LockIcon from '@mui/icons-material/Lock'
import LoadingButton from '@mui/lab/LoadingButton'

const colors = {
  green: '#10b981',
  greenHover: '#059669'
}

interface AddUserForm {
  userName: string
  title: string
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  passportNo: string
  cnic: string
  emailId: string
  mobileNumber: string
  landlineNumber: string
  addressLine1: string
  addressLine2: string
  addressLine3: string
  addressLine4: string
  country: string
  city: string
  zipCode: string
  limit: string
}

const emptyForm: AddUserForm = {
  userName: '',
  title: '',
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  passportNo: '',
  cnic: '',
  emailId: '',
  mobileNumber: '',
  landlineNumber: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  addressLine4: '',
  country: '',
  city: '',
  zipCode: '',
  limit: ''
}
interface PartyInfo {
  partyId: string
  partyName: string
}

type PartySearchStatus = 'idle' | 'searching' | 'found' | 'not-found' | 'error'

const partyService = {
  mockDirectory: {
    'P-1001': 'Al-Falah Textiles (Pvt) Ltd',
    'P-1002': 'Zaman Trading Enterprises',
    'P-1003': 'Karachi Exports Co.',
    'P-1004': 'Indus Logistics Group'
  } as Record<string, string>,

  searchById(rawPartyId: string): Promise<PartyInfo | null> {
    const partyId = rawPartyId.trim().toUpperCase()

    if (!partyId) return Promise.resolve(null)

    // TODO: is poore body ko real API call se replace karein, e.g.:
    // const { data } = await axios.get(`/api/parties/${partyId}`)
    // return data ? { partyId: data.id, partyName: data.name } : null
    return new Promise(resolve => {
      window.setTimeout(() => {
        const partyName = partyService.mockDirectory[partyId]

        resolve(partyName ? { partyId, partyName } : null)
      }, 500)
    })
  }
}

type RoleKey = 'checker' | 'viewer' | 'maker' | 'offshoreViewer' | 'tradeMaker' | 'tradeViewer'

const roleOptions: { key: RoleKey; label: string }[] = [
  { key: 'checker', label: 'Checker' },
  { key: 'viewer', label: 'Viewer' },
  { key: 'maker', label: 'Maker' },
  // { key: 'offshoreViewer', label: 'Offshore Viewer' },
  { key: 'tradeMaker', label: 'Trade Maker' },
  { key: 'tradeViewer', label: 'Trade Viewer' }
]

const titleLabels: Record<string, string> = {
  mr: 'Mr',
  mrs: 'Mrs',
  ms: 'Ms',
  dr: 'Dr'
}

const countryLabels: Record<string, string> = {
  pk: 'Pakistan',
  ae: 'United Arab Emirates',
  sa: 'Saudi Arabia',
  uk: 'United Kingdom',
  us: 'United States'
}

const limitLabels: Record<string, string> = {
  '50k': '50,000 PKR',
  '250k': '250,000 PKR',
  '500k': '500,000 PKR',
  '1m': '1,000,000 PKR (Maximum Authorized)'
}

// Dropdown TextField "select" ko value ke liye code chahiye hota hai (e.g. 'mr'),
// lekin existing user record ke andar label ('Mr') ya code ('mr') - dono aa
// sakte hain. Yeh helper dono suraton mein sahi dropdown code dhoond leta hai.
const resolveOptionCode = (labels: Record<string, string>, value?: string) => {
  if (!value) return ''
  if (labels[value]) return value

  const match = Object.entries(labels).find(([, label]) => label.toLowerCase() === value.toLowerCase())

  return match ? match[0] : ''
}

// Existing user record ki dob Date / ISO string kisi bhi shape mein ho sakti
// hai - <input type='date'> ko hamesha 'YYYY-MM-DD' chahiye hota hai.
const toDateInputValue = (value: unknown) => {
  if (!value) return ''

  const date = new Date(value as string)

  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

type FieldConfig = {
  key: keyof AddUserForm
  label: string
  resolve?: (value: string) => string
}

type SectionConfig = {
  title: string
  fields: FieldConfig[]
}

const reviewSectionsConfig: SectionConfig[] = [
  {
    title: 'Personal Information',
    fields: [
      { key: 'userName', label: 'User Name' },
      { key: 'title', label: 'Title', resolve: v => titleLabels[v] ?? v },
      { key: 'firstName', label: 'First Name' },
      { key: 'middleName', label: 'Middle Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'dateOfBirth', label: 'Date of Birth' },
      { key: 'passportNo', label: 'Passport No' },
      { key: 'cnic', label: 'CNIC' }
    ]
  },
  {
    title: 'Contact Details',
    fields: [
      { key: 'emailId', label: 'Email ID' },
      { key: 'mobileNumber', label: 'Contact Number (Mobile)' },
      { key: 'landlineNumber', label: 'Contact Number (Landline)' },
      { key: 'addressLine1', label: 'Address Line 1' },
      { key: 'addressLine2', label: 'Address Line 2' },
      { key: 'addressLine3', label: 'Address Line 3' },
      { key: 'addressLine4', label: 'Address Line 4' },
      { key: 'country', label: 'Country', resolve: v => countryLabels[v] ?? v },
      { key: 'city', label: 'City' },
      { key: 'zipCode', label: 'Zip Code' }
    ]
  },
  {
    title: 'Limits & Roles',
    fields: [{ key: 'limit', label: 'Limit', resolve: v => limitLabels[v] ?? v }]
  }
]

export const ADD_USER_REVIEW_STORAGE_KEY = 'addUserReviewData'

// Edit Details (user-management page se) yahi key use kar ke selected user
// ka data sessionStorage mein rakhta hai, aur yeh page usay yahan se parh
// ke form pre-fill karta hai. Naya "Create User" flow isse bilkul affect
// nahi hota - agar yeh data mojood na ho to form hamesha khali hi khulta hai.
export const EDIT_USER_STORAGE_KEY = 'editUserData'

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
  marginBottom: theme.spacing(3)
}))

const StyledPartyLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: theme.palette.text.secondary,
  marginBottom: 2
}))

const Page = () => {
  const router = useRouter()

  const [form, setForm] = useState<AddUserForm>(emptyForm)

  const [roles, setRoles] = useState<Record<RoleKey, boolean>>({
    checker: false,
    viewer: false,
    maker: false,
    offshoreViewer: false,
    tradeMaker: false,
    tradeViewer: false
  })

  // ---------- Party search state ----------
  const [partyIdInput, setPartyIdInput] = useState('')
  const [partySearchStatus, setPartySearchStatus] = useState<PartySearchStatus>('idle')
  const [partyInfo, setPartyInfo] = useState<PartyInfo | null>(null)

  // Edit mode: URL mein ?mode=edit ho aur sessionStorage mein user data
  // mojood ho, to form ko usi data se pre-fill kar dete hain. Warna yeh
  // hamesha ki tarah normal "Create User" form hi rehta hai.
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    if (router.query.mode !== 'edit') return
    if (typeof window === 'undefined') return

    const stored = window.sessionStorage.getItem(EDIT_USER_STORAGE_KEY)
    if (!stored) return

    try {
      const user = JSON.parse(stored)

      setForm(prev => ({
        ...prev,
        userName: user.userName ?? '',
        title: resolveOptionCode(titleLabels, user.title),
        firstName: user.firstName ?? '',
        middleName: user.middleName ?? '',
        lastName: user.lastName ?? '',
        dateOfBirth: toDateInputValue(user.dob),
        passportNo: user.passport ?? '',
        cnic: user.cnic ?? '',
        emailId: user.email ?? '',
        mobileNumber: user.mobileNumber ?? '',
        addressLine1: user.address ?? '',
        country: resolveOptionCode(countryLabels, user.country),
        city: user.city ?? '',
        zipCode: user.postalCode ?? ''
      }))

      // Existing user apni Party ke sath already linked hota hai, is liye
      // edit mein Party card seedha "found" state mein khulta hai — user ko
      // dobara search nahi karni padti, sirf chahe to "Change Party" se
      // dusri party select kar sakta hai.
      if (user.partyId) {
        setPartyIdInput(user.partyId)
        setPartyInfo({ partyId: user.partyId, partyName: user.partyName || 'N/A' })
        setPartySearchStatus('found')
      }

      setIsEditMode(true)
    } catch {
      // Data corrupt ya missing ho to chup chaap normal "Create User" form
      // dikhate rahein - is se naya user banane ka flow kabhi break nahi hoga.
    }
  }, [router.isReady, router.query.mode])

  const handleFieldChange = (field: keyof AddUserForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleRoleToggle = (key: RoleKey) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoles(prev => ({ ...prev, [key]: event.target.checked }))
  }

  const handleCheckAvailability = () => {
    // TODO: username availability check ke liye API call yahan karein
  }

  const handleGenerateUsername = () => {
    const base = `${form.firstName}.${form.lastName}`
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9.]/g, '')
      .replace(/\.+/g, '.')
      .replace(/^\.|\.$/g, '')

    const randomSuffix = Math.floor(100 + Math.random() * 900)

    setForm(prev => ({ ...prev, userName: `${base || 'user'}${randomSuffix}` }))
  }

  // ---------- Party search handlers ----------
  const handlePartyIdInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPartyIdInput(event.target.value)

    if (partySearchStatus === 'not-found') {
      setPartySearchStatus('idle')
    }
  }

  const handlePartySearch = async () => {
    if (!partyIdInput.trim()) return

    setPartySearchStatus('searching')

    try {
      const result = await partyService.searchById(partyIdInput)

      if (result) {
        setPartyInfo(result)
        setPartySearchStatus('found')
      } else {
        setPartyInfo(null)
        setPartySearchStatus('not-found')
      }
    } catch {
      setPartyInfo(null)
      setPartySearchStatus('error')
    }
  }

  const handleChangeParty = () => {
    if (isEditMode) return // Party ek dafa link hone ke baad edit mode mein change nahi ho sakti

    setPartyInfo(null)
    setPartyIdInput('')
    setPartySearchStatus('idle')
  }

  const handleSave = () => {
    if (!partyInfo) return

    const partySection: ReviewSectionForSave = {
      title: 'Party Information',
      fields: [
        { label: 'Party ID', value: partyInfo.partyId },
        { label: 'Party Name', value: partyInfo.partyName }
      ]
    }

    const formSections = reviewSectionsConfig.map(section => ({
      title: section.title,
      fields: section.fields.map(field => ({
        label: field.label,
        value: field.resolve ? field.resolve(form[field.key]) : form[field.key]
      }))
    }))

    const selectedRoleLabels = roleOptions.filter(role => roles[role.key]).map(role => role.label)

    const reviewPayload = { sections: [partySection, ...formSections], roles: selectedRoleLabels }

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(ADD_USER_REVIEW_STORAGE_KEY, JSON.stringify(reviewPayload))
    }

    router.push('/user-management/add-user/review-user')
  }

  const handleCancel = () => {
    router.push('/user-management')
  }

  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            startIcon={<ArrowBackIcon fontSize='small' />}
            onClick={handleCancel}
            sx={{ color: 'text.secondary' }}
          >
            Back
          </Button>
          <Typography variant='h5' sx={{ fontWeight: 700 }}>
            {isEditMode ? 'Edit User' : 'Create User'}
          </Typography>
        </Box>
      </Grid>

      {/* Party Search / Party Card */}
      <Grid item xs={12}>
        <StyledFormCard>
          <StyledSectionTitle>Party</StyledSectionTitle>

          {!partyInfo ? (
            <>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                Search the Party ID this user belongs to. Once found, you'll be able to fill in the user's details
                below.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, }}>
                <TextField
                  fullWidth
                  label='Party ID'
                  placeholder='e.g. P-1001'
                  value={partyIdInput}
                  onChange={handlePartyIdInputChange}
                  onKeyDown={event => event.key === 'Enter' && handlePartySearch()}
                  error={partySearchStatus === 'not-found' || partySearchStatus === 'error'}
                  helperText={
                    partySearchStatus === 'not-found'
                      ? 'No party found with this ID.'
                      : partySearchStatus === 'error'
                        ? 'Party search failed. Please try again.'
                        : ' '
                  }
                />
                <LoadingButton
                  variant='contained'
                  loading={partySearchStatus === 'searching'}
                  startIcon={<SearchIcon fontSize='small' />}
                  onClick={handlePartySearch}
                >
                  Search Party
                </LoadingButton>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
                p: 2.5,
                borderRadius: 2,
                bgcolor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
                <Avatar sx={{ bgcolor: colors.green, width: 44, height: 44 }}>
                  <ApartmentIcon />
                </Avatar>
                <Box>
                  <StyledPartyLabel>Party ID</StyledPartyLabel>
                  <Typography sx={{ fontWeight: 700 }}>{partyInfo.partyId}</Typography>
                </Box>
                <Divider orientation='vertical' flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Box>
                  <StyledPartyLabel>Party Name</StyledPartyLabel>
                  <Typography sx={{ fontWeight: 700 }}>{partyInfo.partyName}</Typography>
                </Box>
              </Box>

              {isEditMode ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
                  <LockIcon fontSize='small' />
                  <Typography variant='caption' sx={{ fontWeight: 600 }}>
                    Party locked — cannot be changed
                  </Typography>
                </Box>
              ) : (
                <Button
                  size='small'
                  variant='outlined'
                  startIcon={<ChangeCircleIcon fontSize='small' />}
                  onClick={handleChangeParty}
                  sx={{
                    color: colors.green,
                    borderColor: colors.green,
                    '&:hover': { borderColor: colors.greenHover }
                  }}
                >
                  Change Party
                </Button>
              )}
            </Box>
          )}
        </StyledFormCard>
      </Grid>

      {/* Baaqi form Party mil jaane ke baad hi khulta hai */}
      {partyInfo && (
        <>
          {/* Personal Information */}
          <Grid item xs={12}>
            <StyledFormCard>
              <StyledSectionTitle>Personal Information</StyledSectionTitle>

              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, flexWrap: 'wrap', mb: 4 }}>
                <Box sx={{ width: { xs: '100%', sm: 320 } }}>
                  <TextField
                    fullWidth
                    size='small'
                    label='User Name'
                    value={form.userName}
                    onChange={handleFieldChange('userName')}
                  />
                </Box>
                <LoadingButton
                  variant='outlined'
                  loadingPosition='end'
                  startIcon={<AutorenewIcon fontSize='small' />}
                  onClick={handleGenerateUsername}
                  sx={{ color: colors.green, borderColor: colors.green, '&:hover': { borderColor: colors.greenHover } }}
                >
                  Suggest Username
                </LoadingButton>
                <LoadingButton variant='contained' loadingPosition='end' onClick={handleCheckAvailability}>
                  Check Availability
                </LoadingButton>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='First Name'
                    value={form.firstName}
                    onChange={handleFieldChange('firstName')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Middle Name'
                    value={form.middleName}
                    onChange={handleFieldChange('middleName')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Last Name'
                    value={form.lastName}
                    onChange={handleFieldChange('lastName')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    type='date'
                    label='Date of Birth'
                    InputLabelProps={{ shrink: true }}
                    value={form.dateOfBirth}
                    onChange={handleFieldChange('dateOfBirth')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    select
                    fullWidth
                    size='small'
                    label='Title'
                    value={form.title}
                    onChange={handleFieldChange('title')}
                  >
                    <MenuItem value='mr'>Mr</MenuItem>
                    <MenuItem value='mrs'>Mrs</MenuItem>
                    <MenuItem value='ms'>Ms</MenuItem>
                    <MenuItem value='dr'>Dr</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Passport No'
                    value={form.passportNo}
                    onChange={handleFieldChange('passportNo')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='CNIC'
                    value={form.cnic}
                    onChange={handleFieldChange('cnic')}
                  />
                </Grid>
              </Grid>
            </StyledFormCard>
          </Grid>

          {/* Contact Details */}
          <Grid item xs={12}>
            <StyledFormCard>
              <StyledSectionTitle>Contact Details</StyledSectionTitle>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Email ID'
                    value={form.emailId}
                    onChange={handleFieldChange('emailId')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Contact Number (Mobile)'
                    value={form.mobileNumber}
                    onChange={handleFieldChange('mobileNumber')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Contact Number (Landline)'
                    value={form.landlineNumber}
                    onChange={handleFieldChange('landlineNumber')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Address Line 1'
                    value={form.addressLine1}
                    onChange={handleFieldChange('addressLine1')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Address Line 2'
                    value={form.addressLine2}
                    onChange={handleFieldChange('addressLine2')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Address Line 3'
                    value={form.addressLine3}
                    onChange={handleFieldChange('addressLine3')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Address Line 4'
                    value={form.addressLine4}
                    onChange={handleFieldChange('addressLine4')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    select
                    fullWidth
                    size='small'
                    label='Country'
                    value={form.country}
                    onChange={handleFieldChange('country')}
                  >
                    <MenuItem value='pk'>Pakistan</MenuItem>
                    <MenuItem value='ae'>United Arab Emirates</MenuItem>
                    <MenuItem value='sa'>Saudi Arabia</MenuItem>
                    <MenuItem value='uk'>United Kingdom</MenuItem>
                    <MenuItem value='us'>United States</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='City'
                    value={form.city}
                    onChange={handleFieldChange('city')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Zip Code'
                    value={form.zipCode}
                    onChange={handleFieldChange('zipCode')}
                  />
                </Grid>
              </Grid>
            </StyledFormCard>
          </Grid>

          {/* Limits & Roles */}
          <Grid item xs={12}>
            <StyledFormCard>
              <StyledSectionTitle>Limits & Roles</StyledSectionTitle>

              <Grid container spacing={3} sx={{ mb: 3.5 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    select
                    fullWidth
                    size='small'
                    label='Limit'
                    value={form.limit}
                    onChange={handleFieldChange('limit')}
                  >
                    <MenuItem value='50k'>50,000 PKR</MenuItem>
                    <MenuItem value='250k'>250,000 PKR</MenuItem>
                    <MenuItem value='500k'>500,000 PKR</MenuItem>
                    <MenuItem value='1m'>1,000,000 PKR (Maximum Authorized)</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              <Typography variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
                Roles
              </Typography>
              <FormGroup row>
                {roleOptions.map(role => (
                  <FormControlLabel
                    key={role.key}
                    label={role.label}
                    control={
                      <Checkbox
                        checked={roles[role.key]}
                        onChange={handleRoleToggle(role.key)}
                        sx={{
                          color: 'text.secondary',
                          '&.Mui-checked': { color: colors.green }
                        }}
                      />
                    }
                    sx={{ mr: 4 }}
                  />
                ))}
              </FormGroup>
            </StyledFormCard>
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
              <LoadingButton
                variant='outlined'
                loadingPosition='end'
                sx={{ borderColor: 'divider', color: 'text.primary' }}
                onClick={handleCancel}
              >
                Cancel
              </LoadingButton>

              <LoadingButton
                variant='contained'
                loadingPosition='end'
                startIcon={<SaveIcon fontSize='small' />}
                onClick={handleSave}
              >
                {isEditMode ? 'Update User' : 'Save User'}
              </LoadingButton>
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  )
}

type ReviewSectionForSave = {
  title: string
  fields: { label: string; value: string }[]
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'add-user-page'
}

export default Page