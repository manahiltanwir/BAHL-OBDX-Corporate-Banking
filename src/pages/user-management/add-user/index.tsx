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

const AddUserUserManagement = () => {
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

  const handleSave = () => {
    // TODO: form + roles ke sath actual create-user API call yahan karein
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

AddUserUserManagement.acl = {
  action: 'itsHaveAccess',
  subject: 'adduser-user-management-page'
}

export default AddUserUserManagement