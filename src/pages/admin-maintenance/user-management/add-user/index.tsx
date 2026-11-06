import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import {
  Box,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import LoadingButton from '@mui/lab/LoadingButton'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { InputField } from 'src/@core/components/form'
import { useAdminUserManagement } from 'src/@core/hooks/apps/useAdminUserManagement'
import { AdminUserManagementService } from 'src/services'

const ADMIN_ENTERPRISE_ROLE_ID = '100000'

const colors = { green: '#10b981', greenHover: '#059669' }

export const ADD_USER_REVIEW_STORAGE_KEY = 'addUserReviewData'
export const EDIT_USER_STORAGE_KEY = 'editUserData'

type RolesState = Record<string, { id: string; checked: boolean }>

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
const alphabetOnlyRegex = /^[A-Za-z\s]+$/
const cnicRegex = /^\d{5}-\d{7}-\d{1}$/
const mobileNumberRegex = /^[0-9]{11}$/

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters'),

  firstName: yup
    .string()
    .required('First Name is required')
    .matches(alphabetOnlyRegex, 'Only alphabets are allowed')
    .max(30),

  middleName: yup
    .string()
    .nullable()
    .transform(value => value === '' ? null : value)
    .matches(alphabetOnlyRegex, {
      message: 'Only alphabets are allowed',
      excludeEmptyString: true
    })
    .max(30),

  lastName: yup
    .string()
    .required('Last Name is required')
    .matches(alphabetOnlyRegex, 'Only alphabets are allowed')
    .max(30),

  passport: yup
    .string()
    .nullable()
    .transform(value => value === '' ? null : value)
    .max(30),

  cnic: yup
    .string()
    .nullable()
    .transform(value => value === '' ? null : value)
    .test(
      'cnic-format',
      'CNIC must be in format: 12345-1234567-1',
      value => !value || cnicRegex.test(value)
    ),

  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email')
    .max(50),

  mobileNumber: yup
    .string()
    .required('Mobile Number is required')
    .matches(
      mobileNumberRegex,
      'Mobile Number must be exactly 11 digits and numbers only'
    ),

  landlineNumber: yup
    .string()
    .optional()
    .max(30),

  addressLineOne: yup
    .string()
    .required('Address Line is required')
    .max(50),

  country: yup
    .string()
    .required('Country is required')
    .max(30),

  city: yup
    .string()
    .required('City is required')
    .max(30),

  zipCode: yup
    .string()
    .matches(/^[0-9]*$/, 'Zip Code must contain numbers only')
    .max(30, 'Zip Code cannot exceed 30 digits'),
})
const Field = ({ name, label, control }: { name: string; label: string; control: any }) => (
  <Grid item xs={12} sm={6} md={4}>
    <InputField
      fullWidth
      size='small'
      name={name}
      label={label}
      placeholder={`Enter ${label}`}
      type='text'
      control={control}
    />
  </Grid>
)

const Page = () => {
  const router = useRouter()
  const { store, getRolesById, addUserData, setAddUserData } = useAdminUserManagement(null)

  // const {
  //   control,
  //   handleSubmit,
  //   watch,
  //   setError,
  //   getValues,
  //   formState: { errors }
  // } = useForm<any>({
  //   mode: 'onBlur',
  //   resolver: yupResolver(schema)
  // })

  const {
    control,
    handleSubmit,
    watch,
    setError,
    getValues,
    formState: { errors }
  } = useForm<any>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      username: addUserData?.username || '',
      firstName: addUserData?.firstName || '',
      email: addUserData?.email || '',
      mobileNumber: addUserData?.mobileNumber || '',
      landlineNumber: addUserData?.landlineNumber || '',
      cnic: addUserData?.cnic || '',
      passport: addUserData?.passport || '',
      middleName: addUserData?.middleName || '',
      lastName: addUserData?.lastName || '',
      addressLineOne: addUserData?.addressLineOne || '',
      addressLineTwo: addUserData?.addressLineTwo || '',
      addressLineThree: addUserData?.addressLineThree || '',
      addressLineFour: addUserData?.addressLineFour || '',
      city: addUserData?.city || '',
      country: addUserData?.country || '',
      zipCode: addUserData?.zipCode || ''
    }
  })

  debugger

  const [form, setForm] = useState({
    title: addUserData?.title || '',
    dateOfBirth: addUserData?.dob || '',
    
  })
  const [roles, setRoles] = useState<RolesState>(addUserData?.roles || {})
  const [isCheckAvailabilityDone, setIsCheckAvailabilityDone] = useState<boolean>(false)

  const username = watch('username')

  useEffect(() => {
    getRolesById(ADMIN_ENTERPRISE_ROLE_ID)
  }, [])

  useEffect(() => {
    setIsCheckAvailabilityDone(false)
  }, [username])

  const handleFieldChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleRoleToggle = (key: string, id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoles(prev => ({ ...prev, [key]: { id: String(id), checked: event.target.checked } }))
  }

  const handleCheckAvailability = () => {
    const value = getValues('username')

    if (!value) {
      setError('username', { type: 'manual', message: 'Username field cannot be empty' }, { shouldFocus: true })

      return
    }

    AdminUserManagementService.checkUsernameAvailability(value)
      .then(res => {
        const body = res.data
        const isTaken = Array.isArray(body?.data) ? body.data.length > 0 : !!body?.data

        if (res.status === 200 && !isTaken) {
          setIsCheckAvailabilityDone(true)
          // toast.success(body?.message || 'Username is available')
        } else {
          setError(
            'username',
            { type: 'manual', message: body?.message || `${body?.data} is already taken.` },
            { shouldFocus: true }
          )
        }
      })
      .catch(() => toast.error('Unable to check username availability'))
  }

  const handleCancel = () => {
    router.push('/admin-maintenance/user-management')
  }

  const handleCreateUser = (data: any) => {
    let hasError = false
    if (!form.title) {
      setError('title', { type: 'manual', message: 'title is required' })
      hasError = true
    }
    if (data.dob && data.dob > new Date().toISOString().split('T')[0]) {
      setError('dob' as any, {
        type: 'manual',
        message: 'Future date of birth is not allowed'
      })
      return
    }
    if (!form.dateOfBirth) {
      setError('dob', { type: 'manual', message: 'date of birth is required' })
      hasError = true
    }
    if (!Object.values(roles).some(role => role.checked)) {
      setError('roles', { type: 'manual', message: 'At least one role is required' })
      hasError = true
    }

    if (hasError) return

    const completeUserData = {
      ...data,
      title: form.title,
      dob: form.dateOfBirth,
      roles: roles
    }

    setAddUserData(completeUserData)

    router.push(
      {
        pathname: '/admin-maintenance/user-management/add-user/review-user',
        query: {
          ...data,
          title: form.title,
          // limit: form.limit,
          dob: form.dateOfBirth,
          roles: JSON.stringify(roles)
        }
      },
      '/admin-maintenance/user-management/add-user/review-user'
    )
  }

  return (
    <Grid container>
      <Grid item xs={12} paddingBottom={5}>
        <Typography variant='h5' sx={{ fontWeight: 700 }}>
          Create User
        </Typography>
      </Grid>

      <form onSubmit={handleSubmit(handleCreateUser)} style={{ width: '100%' }}>
        {/* Personal Information */}
        <Grid item xs={12} paddingBottom={5}>
          <StyledFormCard>
            <StyledSectionTitle>Personal Information</StyledSectionTitle>

            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, flexWrap: 'wrap', mb: 4 }}>
              <Box sx={{ width: { xs: '100%', sm: 320 } }}>
                <InputField
                  fullWidth
                  size='small'
                  name='username'
                  label='User Name'
                  placeholder='Enter User Name'
                  type='text'
                  control={control}
                />
              </Box>
              <LoadingButton
                variant='contained'
                loadingPosition='end'
                onClick={handleCheckAvailability}
                disabled={isCheckAvailabilityDone}
              >
                Check Availability
              </LoadingButton>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <InputField
                  fullWidth
                  size='small'
                  name='firstName'
                  label='First Name'
                  placeholder='Enter First Name'
                  type='text'
                  control={control} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InputField
                  fullWidth
                  size='small'
                  name='middleName'
                  label='Middle Name'
                  placeholder='Enter Middle Name'
                  type='text'
                  control={control} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InputField
                  fullWidth
                  size='small'
                  name='lastName'
                  label='Last Name'
                  placeholder='Enter Last Name'
                  type='text'
                  control={control} />
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
                  inputProps={{
                    max: new Date().toISOString().split('T')[0]
                  }}
                  error={!!errors.dob}
                  helperText={errors.dob ? errors.dob.message : '' as any}
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
                  error={!!errors.title}
                  helperText={errors.title ? (errors.title.message as string) : ''}
                >
                  <MenuItem value='mr'>Mr</MenuItem>
                  <MenuItem value='mrs'>Mrs</MenuItem>
                  <MenuItem value='ms'>Ms</MenuItem>
                  <MenuItem value='dr'>Dr</MenuItem>
                </TextField>
              </Grid>
              <Field name='passport' label='Passport No' control={control} />
              <Grid item xs={12} sm={6} md={4}>
                <InputField
                  fullWidth
                  size='small'
                  name='cnic'
                  label='CNIC'
                  placeholder='Enter CNIC No (12345-1234567-1)'
                  type='text'
                  control={control}
                />
              </Grid>

            </Grid>
          </StyledFormCard>
        </Grid>

        {/* Contact Details */}
        <Grid item xs={12} paddingBottom={5}>
          <StyledFormCard>
            <StyledSectionTitle>Contact Details</StyledSectionTitle>
            <Grid container spacing={3}>

              <Grid item xs={12} sm={6} md={4}>
                <InputField
                  fullWidth
                  size='small'
                  name='email'
                  label='Email'
                  placeholder='Enter Email'
                  type='email'
                  control={control}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <InputField
                  fullWidth
                  size='small'
                  name='mobileNumber'
                  label='Mobile No'
                  placeholder='Enter 11 digit Mobile No'
                  type='text'
                  control={control} />
              </Grid>


              <Field name='landlineNumber' label='Landline No' control={control} />
              <Field name='addressLineOne' label='Address Line No' control={control} />
              <Field name='country' label='Country' control={control} />
              <Field name='city' label='City' control={control} />
              <Grid item xs={12} sm={6} md={4}>
                <InputField
                  name='zipCode'
                  label='Zip Code'
                  placeholder='Enter Zip Code'
                  type='text'
                  control={control}
                  size='small'
                />
              </Grid>
            </Grid>
          </StyledFormCard>
        </Grid>

        {/* Limits & Roles */}
        <Grid item xs={12} paddingBottom={5}>
          <StyledFormCard>
            <StyledSectionTitle>Roles</StyledSectionTitle>


            <Typography variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
              Roles
            </Typography>
            <FormControl error={!!errors.roles} component='fieldset' variant='standard'>
              <FormGroup row>
                {store.roleEntities?.map((role: any) => (
                  <FormControlLabel
                    key={role.id}
                    label={role.roleName}
                    control={
                      <Checkbox
                        checked={!!roles[role.roleName]?.checked}
                        onChange={handleRoleToggle(role.roleName, role.id)}
                        sx={{ color: 'text.secondary', '&.Mui-checked': { color: colors.green } }}
                      />
                    }
                    sx={{ mr: 4 }}
                  />
                ))}
              </FormGroup>
            </FormControl>
            {errors.roles && (
              <FormHelperText sx={{ fontSize: '0.75rem', mt: '4px', color: 'red' }}>
                {(errors.roles.message as string) || 'Roles are required'}
              </FormHelperText>
            )}
          </StyledFormCard>
        </Grid>

        {/* Actions */}
        {isCheckAvailabilityDone && (
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
                type='submit'
              >
                Save User
              </LoadingButton>
            </Box>
          </Grid>
        )}
      </form>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'admin-maintenance-user-management-add-user-page'
}

export default Page