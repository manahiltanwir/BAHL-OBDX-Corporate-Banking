import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import {
  Box,
  Button,
  Card,
  Checkbox, 
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
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

type RoleKey = 'checker' | 'viewer' | 'maker' | 'offshoreViewer' | 'tradeMaker' | 'tradeViewer'

const roleOptions: { key: RoleKey; label: string }[] = [
  { key: 'checker', label: 'Checker' },
  { key: 'viewer', label: 'Viewer' },
  { key: 'maker', label: 'Maker' },
  { key: 'offshoreViewer', label: 'Offshore Viewer' },
  { key: 'tradeMaker', label: 'Trade Maker' },
  { key: 'tradeViewer', label: 'Trade Viewer' }
]

// Dropdown codes ko readable label mein badalne ke liye - yehi eak jagah hai
// jahan yeh mapping likhi jati hai. Review screen isko dobara define nahi karti.
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

// ============================================================
// SINGLE SOURCE OF TRUTH: yahan har field ka label define hota hai.
// Review screen mein koi label hardcode nahi - sab yahin se banta
// aur sessionStorage ke zariye pass hota hai.
// ============================================================
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
    fields: [
      { key: 'limit', label: 'Limit', resolve: v => limitLabels[v] ?? v }
    ]
  }
]

export const ADD_USER_REVIEW_STORAGE_KEY = 'addUserReviewData'

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

const Page = () => {
  const router = useRouter()

  const [form, setForm] = useState<AddUserForm>({
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
  })

  const [roles, setRoles] = useState<Record<RoleKey, boolean>>({
    checker: false,
    viewer: false,
    maker: false,
    offshoreViewer: false,
    tradeMaker: false,
    tradeViewer: false
  })

  const handleFieldChange = (field: keyof AddUserForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleRoleToggle = (key: RoleKey) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoles(prev => ({ ...prev, [key]: event.target.checked }))
  }

  const handleCheckAvailability = () => {
    // TODO: username availability check ke liye API call yahan karein
  }

 // Save button: fieldConfig ke through form ka data { label, value } pairs mein
  // resolve hota hai, roles ke selected labels nikaalte hain, aur poora structure
  // sessionStorage mein daal ke review screen par navigate karte hain.
  const handleSave = () => {
    const sections = reviewSectionsConfig.map(section => ({
      title: section.title,
      fields: section.fields.map(field => ({
        label: field.label,
        value: field.resolve ? field.resolve(form[field.key]) : form[field.key]
      }))
    }))

    const selectedRoleLabels = roleOptions
      .filter(role => roles[role.key])
      .map(role => role.label)

    const reviewPayload = { sections, roles: selectedRoleLabels }

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
            Create User
          </Typography>
        </Box>
      </Grid>

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
              variant='contained'
              loadingPosition='end'
              onClick={handleCheckAvailability}
            >
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
            Save User
          </LoadingButton>

        </Box>
      </Grid>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'add-user-page'
}

export default Page