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

// TODO: confirm karein ke admin roles ki enterprise role id yehi hai ya alag
const ADMIN_ENTERPRISE_ROLE_ID = '100000'

const colors = { green: '#10b981', greenHover: '#059669' }

// Doosre pages in keys ko import kar rahe ho sakte hain, isliye export rakhi hain
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

const schema = yup.object().shape({
  username: yup.string().required().min(3).max(30),
  firstName: yup.string().required().max(30),
  middleName: yup.string().required().max(30),
  lastName: yup.string().required().max(30),
  passport: yup.string().required().max(30),
  cnic: yup.string().required().max(30),
  email: yup.string().required().max(30),
  mobileNumber: yup.string().required().max(30),
  landlineNumber: yup.string().required().max(30),
  addressLineOne: yup.string().required().max(30),
  addressLineTwo: yup.string().required().max(30),
  addressLineThree: yup.string().required().max(30),
  addressLineFour: yup.string().required().max(30),
  country: yup.string().required().max(30),
  city: yup.string().required().max(30),
  zipCode: yup.string().required().max(30)
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
  const { store, getRolesById } = useAdminUserManagement(null)

  const {
    control,
    handleSubmit,
    watch,
    setError,
    getValues,
    formState: { errors }
  } = useForm<any>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const [form, setForm] = useState({ title: '', dateOfBirth: '' })
  const [roles, setRoles] = useState<RolesState>({})
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
    if (!form.dateOfBirth) {
      setError('dob', { type: 'manual', message: 'date of birth is required' })
      hasError = true
    }
    if (!Object.values(roles).some(role => role.checked)) {
      setError('roles', { type: 'manual', message: 'At least one role is required' })
      hasError = true
    }

    if (hasError) return

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
              <Field name='firstName' label='First Name' control={control} />
              <Field name='middleName' label='Middle Name' control={control} />
              <Field name='lastName' label='Last Name' control={control} />
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  size='small'
                  type='date'
                  label='Date of Birth'
                  InputLabelProps={{ shrink: true }}
                  value={form.dateOfBirth}
                  onChange={handleFieldChange('dateOfBirth')}
                  error={!!errors.dob}
                  helperText={errors.dob ? (errors.dob.message as string) : ''}
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
              <Field name='cnic' label='CNIC' control={control} />
            </Grid>
          </StyledFormCard>
        </Grid>

        {/* Contact Details */}
        <Grid item xs={12} paddingBottom={5}>
          <StyledFormCard>
            <StyledSectionTitle>Contact Details</StyledSectionTitle>
            <Grid container spacing={3}>
              <Field name='email' label='Email' control={control} />
              <Field name='mobileNumber' label='Mobile No' control={control} />
              <Field name='landlineNumber' label='Landline No' control={control} />
              <Field name='addressLineOne' label='Address Line No' control={control} />
              <Field name='addressLineTwo' label='Address Line No 2' control={control} />
              <Field name='addressLineThree' label='Address Line No 3' control={control} />
              <Field name='addressLineFour' label='Address Line No 4' control={control} />
              <Field name='country' label='Country' control={control} />
              <Field name='city' label='City' control={control} />
              <Field name='zipCode' label='Zip Code' control={control} />
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