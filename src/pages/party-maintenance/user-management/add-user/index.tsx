import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { Avatar, Box, Button, Card, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, MenuItem, TextField, Typography } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import ApartmentIcon from '@mui/icons-material/Apartment'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import LockIcon from '@mui/icons-material/Lock'
import LoadingButton from '@mui/lab/LoadingButton'
import { InputField } from 'src/@core/components/form'
import { usePartyManagement } from 'src/@core/hooks/apps/usePartyManagement'
import { PartyManagementForm } from 'src/types/apps/partyManagement'
import AddUserForm from 'src/@core/components/apps/user-management/AddUserForm'
import { clearEntityState } from 'src/store/apps/party-management'
import { useUserManagement } from 'src/@core/hooks/apps/useUserManagement'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { UserManagementService } from 'src/services'

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

    return new Promise(resolve => {
      window.setTimeout(() => {
        const partyName = partyService.mockDirectory[partyId]

        resolve(partyName ? { partyId, partyName } : null)
      }, 500)
    })
  }
}

type RoleKey = 'checker' | 'viewer' | 'maker' | 'offshoreViewer' | 'tradeMaker' | 'tradeViewer'

export const ADD_USER_REVIEW_STORAGE_KEY = 'addUserReviewData'

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
  zipCode: yup.string().required().max(30),
})

const Page = () => {

  const {
    form: { control: partyInputControl, handleSubmit: partyHandleSubmit, },
    getParty,
    store: partyStore,
    dispatch
  } = usePartyManagement(null)

  const { store, getRolesById } = useUserManagement(null)

  const { control, handleSubmit, formState: { errors, }, setError, getValues } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const router = useRouter()

  const [form, setForm] = useState<AddUserForm>(emptyForm)

  const [roles, setRoles] = useState<Record<RoleKey, boolean> | any>()

  const [partyInfo, setPartyInfo] = useState<PartyInfo | null>(null)

  const [isEditMode, setIsEditMode] = useState(false)

  const [isCheckAvailabilityDone, setIsCheckAvailabilityDone] = useState<boolean>(false)

  useEffect(() => {
    getRolesById('100003')
    return () => {
      setIsCheckAvailabilityDone(false)
    }
  }, [])

  const handleFieldChange = (field: keyof AddUserForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleRoleToggle = (key: RoleKey, id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {

    setRoles((prev: any) => ({
      ...prev, [key]: {
        id,
        checked: event.target.checked
      }
    }))
  }

  const handleCheckAvailability = () => {
    if (getValues('username') == undefined || getValues('username') == '' || getValues('username') == null) {
      setError('username', {
        type: 'manual', message: "Username field cannot be empty"
      }, { shouldFocus: true }
      )
      return;
    }
    UserManagementService.checkUsernameAvailability(getValues('username')).then((res) => {
      if (res.status == 200 && res.data == '') {
        setIsCheckAvailabilityDone(true)
      } else {
        setError('username', {
          type: 'manual', message: `${res.data} is already taken.`
        }, { shouldFocus: true }
        )
        return;
      }
    })
  }



  const handleCancel = () => {
    router.push('/party-maintenance/user-management')
  }

  const onSubmit = (data: PartyManagementForm) => {
    getParty(data.partyId).then((res) => {
      setPartyInfo(partyStore.entity)
    })
  }

  const handleCreateUser = (data: any) => {

    data = {
      ...data,
      title: form.title,
      limit: form.limit,
      roles: JSON.stringify(roles),
      dob: form.dateOfBirth
    }

    // clearErrors('limit')
    if (!data.limit || data.limit == '') {
      setError('limit', {
        type: 'manual',
        message: 'limit is required'
      })
      return
    }

    if (!data.title || data.title == '') {
      setError('title', {
        type: 'manual',
        message: 'title is required'
      })
      return
    }

    if (!data.dob || data.dob == '') {
      setError('dob', {
        type: 'manual',
        message: 'date of birth is required'
      })
      return
    }

    if (Object.values(data?.roles).every((value: any) => value === false)) {
      setError('roles', {
        type: 'manual',
        message: 'At lease one role is required'
      })
      return
    }

    router.push({
      pathname: '/party-maintenance/user-management/add-user/review-user',
      query: data
    },
      '/party-maintenance/user-management/add-user/review-user'
    )
  }

  return (
    <Grid container>
      {/* Header */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant='h5' sx={{ fontWeight: 700 }}>
            {isEditMode ? 'Edit User' : 'Create User'}
          </Typography>
        </Box>
      </Grid>

      {/* Party Search / Party Card */}
      <Grid item xs={12} paddingBottom={5}>
        <StyledFormCard>
          <StyledSectionTitle>Party</StyledSectionTitle>

          {!partyStore.entity.partyId ? (
            <AddUserForm partyInputControl={partyInputControl} partyHandleSubmit={partyHandleSubmit} onSubmit={onSubmit} />
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
                  <Typography sx={{ fontWeight: 700 }}>{partyStore.entity.partyId}</Typography>
                </Box>
                <Divider orientation='vertical' flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Box>
                  <StyledPartyLabel>Party Name</StyledPartyLabel>
                  <Typography sx={{ fontWeight: 700 }}>{partyStore.entity.partyName}</Typography>
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
                  onClick={() => dispatch(clearEntityState({ id: partyStore.entity.partyId }))}
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
      {partyStore.entity.partyId && (
        <form onSubmit={handleSubmit(handleCreateUser)}>
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
                    disabled={isCheckAvailabilityDone}
                  />
                </Box>
                <LoadingButton variant='contained' loadingPosition='end' onClick={handleCheckAvailability} disabled={isCheckAvailabilityDone}>
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
                    error={!!errors.dob}
                    // helperText={errors.root?.message}
                    // helperText={'date of birth is required'}
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
                    helperText={errors.title ? errors.title.message : '' as any}
                  // helperText={'title is required'}
                  >
                    <MenuItem value='mr'>Mr</MenuItem>
                    <MenuItem value='mrs'>Mrs</MenuItem>
                    <MenuItem value='ms'>Ms</MenuItem>
                    <MenuItem value='dr'>Dr</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputField
                    fullWidth
                    size='small'
                    name='passport'
                    label='Passport No'
                    placeholder='Enter Passport No'
                    type='text'
                    control={control} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputField
                    fullWidth
                    size='small'
                    name='cnic'
                    label='CNIC'
                    placeholder='Enter CNIC No'
                    type='text'
                    control={control} />
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
                    type='text'
                    control={control} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputField
                    fullWidth
                    size='small'
                    name='mobileNumber'
                    label='Mobile No'
                    placeholder='Enter Mobile No'
                    type='text'
                    control={control} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputField
                    fullWidth
                    size='small'
                    name='landlineNumber'
                    label='Landline No'
                    placeholder='Enter Landline No'
                    type='text'
                    control={control} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputField
                    fullWidth
                    size='small'
                    name='addressLineOne'
                    label='Address Line No'
                    placeholder='Enter Address Line No'
                    type='text'
                    control={control} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputField
                    fullWidth
                    size='small'
                    name='addressLineTwo'
                    label='Address Line No 2'
                    placeholder='Enter Address Line No 2'
                    type='text'
                    control={control} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputField
                    fullWidth
                    size='small'
                    name='addressLineThree'
                    label='Address Line No 3'
                    placeholder='Enter Address Line No 3'
                    type='text'
                    control={control} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputField
                    fullWidth
                    size='small'
                    name='addressLineFour'
                    label='Address Line No 4'
                    placeholder='Enter Address Line No 4'
                    type='text'
                    control={control} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputField
                    name='country'
                    label='Country'
                    placeholder='Enter Country'
                    type='text'
                    control={control}
                    size='small'
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputField
                    name='city'
                    label='City'
                    placeholder='Enter City'
                    type='text'
                    control={control}
                    size='small'
                  />
                </Grid>
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
                    error={!!errors.limit}
                    helperText={errors.limit ? errors.limit.message : '' as any}
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
              <FormControl error={!!errors.roles} component={'fieldset'} variant='standard'>
                <FormGroup row>
                  {store?.roleEntities?.map(role => (
                    <FormControlLabel
                      key={role.id}
                      label={role.roleName}
                      control={
                        <Checkbox
                          checked={roles && roles[role.id]}
                          onChange={handleRoleToggle(role?.roleName as RoleKey, role?.id)}
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
              </FormControl>
              {
                errors.roles && (
                  <FormHelperText sx={{ fontSize: '0.75rem', marginTop: '4px', color: "red" }}>
                    {errors.roles.message as string ? errors.roles.message as string : 'Roles are required'}
                  </FormHelperText>
                )
              }
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
                >Save User</LoadingButton>
              </Box>
            </Grid>
          )}
        </form>
      )}
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'party-maintenance-user-management-add-user-page'
}

export default Page