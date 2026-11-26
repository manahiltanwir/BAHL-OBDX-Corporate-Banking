import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
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
import ApartmentIcon from '@mui/icons-material/Apartment'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import LockIcon from '@mui/icons-material/Lock'
import LoadingButton from '@mui/lab/LoadingButton'
import { InputField } from 'src/@core/components/form'
import AddUserForm from 'src/@core/components/apps/user-management/AddUserForm'
import { useUserManagement } from 'src/@core/hooks/apps/useUserManagement'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { UserManagementService } from 'src/services'
import { REGIONS, NATIONALITIES, PAKISTAN } from 'src/@core/constants/countries'
import toast from 'react-hot-toast'

const colors = {
  green: '#10b981',
  greenHover: '#059669'
}

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

// ** Regex definitions
const alphabetOnlyRegex = /^[A-Za-z\s]+$/
const cnicRegex = /^\d{5}-\d{7}-\d{1}$/
const mobileNumberRegex = /^[0-9]{11}$/

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters'),

  title: yup.string().required('Title is required'),

  firstName: yup
    .string()
    .required('First Name is required')
    .matches(alphabetOnlyRegex, 'Only alphabets are allowed')
    .max(30),

  middleName: yup
    .string()
    // .nullable()
    // .transform(value => (value === '' ? null : value))
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

  dob: yup
    .string()
    .required('Date of birth is required')
    .test(
      'not-future',
      'Future date of birth is not allowed',
      value => !value || value <= new Date().toISOString().split('T')[0]
    ),

  region: yup.string().required('Time zone region is required'),

  nationality: yup.string().required('Nationality is required'),

  // National Identification No: har nationality ke liye mandatory.
  // Pakistan ho to format 12345-1234567-1 lazmi, warna free text (koi regex nahi).
  cnic: yup
    .string()
    .nullable()
    .transform(value => (value === '' ? null : value))
    .max(30, 'National Identification No cannot exceed 30 characters')
    .test('national-id-rule', function (value) {
      const { nationality } = this.parent

      if (!value) {
        return this.createError({ message: 'National Identification No is required' })
      }

      if (nationality === PAKISTAN && !cnicRegex.test(value)) {
        return this.createError({ message: 'National Identification No must be in format: 12345-1234567-1' })
      }

      return true
    }),

  // Passport: har case mein optional
  passport: yup
    .string()
    .nullable()
    .transform(value => (value === '' ? null : value))
    .max(30),

  roles: yup
    .mixed()
    .test('has-role', 'At least one role is required', value =>
      Object.values(value || {}).some((role: any) => role?.checked === true)
    ),

  email: yup.string().required('Email is required').email('Enter a valid email').max(50),

  mobileNumber: yup
    .string()
    .required('Mobile Number is required')
    .matches(mobileNumberRegex, 'Mobile Number must be exactly 11 digits and numbers only'),

  landlineNumber: yup.string().optional().max(30),

  addressLineOne: yup.string().required('Address Line is required').max(50),

  country: yup.string().required('Country is required').max(30),

  city: yup.string().required('City is required').max(30),

  zipCode: yup
    .string()
    .matches(/^[0-9]*$/, 'Zip Code must contain numbers only')
    .max(30, 'Zip Code cannot exceed 30 digits')
})

// Reusable TextField wired to react-hook-form (works for select and date too)
const ControlledTextField = ({ name, control, children, ...props }: any) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <TextField
        {...field}
        {...props}
        fullWidth
        size='small'
        error={!!fieldState.error}
        helperText={fieldState.error?.message || ''}
      >
        {children}
      </TextField>
    )}
  />
)

const emptyValues = {
  username: '',
  title: '',
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  region: '',
  nationality: '',
  // limit: '',
  email: '',
  mobileNumber: '',
  landlineNumber: '',
  cnic: '',
  passport: '',
  addressLineOne: '',
  addressLineTwo: '',
  addressLineThree: '',
  addressLineFour: '',
  city: '',
  country: '',
  zipCode: '',
  roles: {}
}

const Page = () => {
  const { store, getRolesById, party, partyForm, searchParty, resetParty, setAddUserData, addUserData } =
    useUserManagement(null)

  const { control: partyInputControl, handleSubmit: partyHandleSubmit } = partyForm

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    setError,
    clearErrors,
    getValues,
    setValue,
    watch,
    trigger,
    reset
  } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: addUserData?.username || '',
      title: addUserData?.title || '',
      firstName: addUserData?.firstName || '',
      middleName: addUserData?.middleName || '',
      lastName: addUserData?.lastName || '',
      dob: addUserData?.dob || '',
      region: addUserData?.region || '',
      nationality: addUserData?.nationality || '',
      // limit: addUserData?.limit || '',
      email: addUserData?.email || '',
      mobileNumber: addUserData?.mobileNumber || '',
      landlineNumber: addUserData?.landlineNumber || '',
      cnic: addUserData?.cnic || '',
      passport: addUserData?.passport || '',
      addressLineOne: addUserData?.addressLineOne || '',
      addressLineTwo: addUserData?.addressLineTwo || '',
      addressLineThree: addUserData?.addressLineThree || '',
      addressLineFour: addUserData?.addressLineFour || '',
      city: addUserData?.city || '',
      country: addUserData?.country || '',
      zipCode: addUserData?.zipCode || '',
      roles: addUserData?.roles || {}
    }
  })

  const router = useRouter()

  const nationality = watch('nationality')
  const roles: Record<string, { id: string; checked: boolean }> = watch('roles') || {}

  const [isEditMode] = React.useState(false)

  const [isCheckAvailabilityDone, setIsCheckAvailabilityDone] = React.useState<boolean>(false)
  const [openSelect, setOpenSelect] = React.useState<'title' | 'region' | 'nationality' | null>(null)

  useEffect(() => {
    getRolesById('100003')
    return () => {
      setIsCheckAvailabilityDone(false)
    }
  }, [])

  // Nationality badalne par National Identification No ki validation dobara chale
  useEffect(() => {
    if (isSubmitted) trigger(['cnic'])
  }, [nationality])

  useEffect(() => {
    if (!openSelect) return

    const preventPageScroll = (event: WheelEvent) => {
      const target = event.target
      const menuPaper = target instanceof Element ? target.closest('.MuiMenu-paper') : null

      if (!menuPaper || menuPaper.scrollHeight <= menuPaper.clientHeight) {
        event.preventDefault()
      }
    }

    window.addEventListener('wheel', preventPageScroll, { capture: true, passive: false })

    return () => window.removeEventListener('wheel', preventPageScroll, true)
  }, [openSelect])

  const handleCheckAvailability = () => {
    const username = getValues('username')

    if (username == undefined || username == '' || username == null) {
      setError(
        'username',
        {
          type: 'manual',
          message: 'Username field cannot be empty'
        },
        { shouldFocus: true }
      )
      return
    }

    UserManagementService.checkUsernameAvailability(username)
      .then(res => {
        if (res.data.data.length === 0) {
          setIsCheckAvailabilityDone(true)
          clearErrors('username')
          toast.success(`${username} is available`)
        } else if (res.data.data.length > 0) {
          setIsCheckAvailabilityDone(false)
          setError(
            'username',
            {
              type: 'manual',
              message: `${username} is already taken.`
            },
            { shouldFocus: true }
          )
        }
      })
      .catch(() => {
        setError(
          'username',
          {
            type: 'manual',
            message: 'Unable to check username. Please try again.'
          },
          { shouldFocus: true }
        )
      })
  }

  const handleCancel = () => {
    resetParty()
    router.push('/party-maintenance/user-management')
  }

  const onSubmit = (data: { partyId: string }) => {
    searchParty(data.partyId)
  }

  const handleCreateUser = (data: any) => {
    setAddUserData(data)

    router.push(
      {
        pathname: '/party-maintenance/user-management/add-user/review-user',
        query: { ...data, roles: JSON.stringify(data.roles) }
      },
      '/party-maintenance/user-management/add-user/review-user'
    )
  }

  const handleClearAllData = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('add_user_form_data')
    }
    setAddUserData(null)

    reset(emptyValues)
  }

  useEffect(() => {
    if (!party?.partyId) {
      handleClearAllData()
    }
  }, [party?.partyId])

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

          {!party?.partyId ? (
            <AddUserForm
              partyInputControl={partyInputControl as any}
              partyHandleSubmit={partyHandleSubmit as any}
              onSubmit={onSubmit as any}
            />
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
                  <Typography sx={{ fontWeight: 700 }}>{party?.partyId}</Typography>
                </Box>
                <Divider orientation='vertical' flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Box>
                  <StyledPartyLabel>Party Name</StyledPartyLabel>
                  <Typography sx={{ fontWeight: 700 }}>{party?.partyName}</Typography>
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
                  onClick={resetParty}
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

      {party?.partyId && (
        <form onSubmit={handleSubmit(handleCreateUser)}>
          {/* Personal Information */}
          <Grid item xs={12} paddingBottom={5}>
            <StyledFormCard>
              <StyledSectionTitle>Personal Information</StyledSectionTitle>

              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, flexWrap: 'wrap', mb: 4 }}>
                <Box
                  sx={{ width: { xs: '100%', sm: 320 }, cursor: isCheckAvailabilityDone ? 'pointer' : 'text' }}
                  onClick={() => {
                    if (isCheckAvailabilityDone) {
                      setIsCheckAvailabilityDone(false)
                      clearErrors('username')
                    }
                  }}
                >
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
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputField
                    fullWidth
                    size='small'
                    name='middleName'
                    label='Middle Name'
                    placeholder='Enter Middle Name'
                    type='text'
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputField
                    fullWidth
                    size='small'
                    name='lastName'
                    label='Last Name'
                    placeholder='Enter Last Name'
                    type='text'
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <ControlledTextField
                    name='dob'
                    control={control}
                    type='date'
                    label='Date of Birth'
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ max: new Date().toISOString().split('T')[0] }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <ControlledTextField
                    name='title'
                    control={control}
                    select
                    label='Title'
                    SelectProps={{
                      open: openSelect === 'title',
                      onOpen: () => setOpenSelect('title'),
                      onClose: () => setOpenSelect(null),
                      MenuProps: {
                        disableScrollLock: false,
                        PaperProps: { style: { overscrollBehaviorY: 'contain' } }
                      }
                    }}
                  >
                    <MenuItem value='mr'>Mr</MenuItem>
                    <MenuItem value='mrs'>Mrs</MenuItem>
                    <MenuItem value='ms'>Ms</MenuItem>
                    <MenuItem value='dr'>Dr</MenuItem>
                  </ControlledTextField>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <ControlledTextField
                    name='region'
                    control={control}
                    select
                    label='Time Zone Region'
                    SelectProps={{
                      open: openSelect === 'region',
                      onOpen: () => setOpenSelect('region'),
                      onClose: () => setOpenSelect(null),
                      MenuProps: {
                        disableScrollLock: false,
                        PaperProps: { style: { overscrollBehaviorY: 'contain' } }
                      }
                    }}
                  >
                    {REGIONS.map(region => (
                      <MenuItem key={region} value={region}>
                        {region}
                      </MenuItem>
                    ))}
                  </ControlledTextField>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <ControlledTextField
                    name='nationality'
                    control={control}
                    select
                    label='Nationality'
                    SelectProps={{
                      open: openSelect === 'nationality',
                      onOpen: () => setOpenSelect('nationality'),
                      onClose: () => setOpenSelect(null),
                      MenuProps: {
                        disableScrollLock: false,
                        PaperProps: { style: { maxHeight: 320, overscrollBehaviorY: 'contain' } }
                      }
                    }}
                  >
                    {NATIONALITIES.map(country => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </ControlledTextField>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputField
                    fullWidth
                    size='small'
                    name='passport'
                    label='Passport'
                    placeholder='Enter Passport No.'
                    type='text'
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputField
                    fullWidth
                    size='small'
                    name='cnic'
                    label='National Identification No *'
                    placeholder={
                      nationality === PAKISTAN
                        ? 'Enter National Identification No (12345-1234567-1)'
                        : 'Enter National Identification No'
                    }
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
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputField
                    fullWidth
                    size='small'
                    name='landlineNumber'
                    label='Landline No'
                    placeholder='Enter Landline No'
                    type='number'
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputField
                    fullWidth
                    size='small'
                    name='addressLineOne'
                    label='Address Line No'
                    placeholder='Enter Address Line No'
                    type='text'
                    control={control}
                  />
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
              {/* <StyledSectionTitle>Limits & Roles</StyledSectionTitle>

              <Grid container spacing={3} sx={{ mb: 3.5 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <ControlledTextField name='limit' control={control} select label='Limit'>
                    <MenuItem value='50k'>50,000 PKR</MenuItem>
                    <MenuItem value='250k'>250,000 PKR</MenuItem>
                    <MenuItem value='500k'>500,000 PKR</MenuItem>
                    <MenuItem value='1m'>1,000,000 PKR (Maximum Authorized)</MenuItem>
                  </ControlledTextField>
                </Grid>
              </Grid> */}

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
                          checked={!!roles?.[role.roleName as string]?.checked}
                          onChange={e =>
                            setValue(
                              'roles',
                              {
                                ...roles,
                                [role.roleName as string]: { id: role.id, checked: e.target.checked }
                              },
                              { shouldValidate: isSubmitted, shouldDirty: true }
                            )
                          }
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
              {errors.roles && (
                <FormHelperText sx={{ fontSize: '0.75rem', marginTop: '4px', color: 'red' }}>
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
      )}
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'party-maintenance-user-management-add-user-page'
}

export default Page