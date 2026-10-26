import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { Box, Card, Checkbox, FormControlLabel, FormGroup, Grid, MenuItem, TextField, Typography } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import LoadingButton from '@mui/lab/LoadingButton'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { InputField } from 'src/@core/components/form'
import { useAdminUserManagement } from 'src/@core/hooks/apps/useAdminUserManagement'
import { clearAction } from 'src/store/apps/admin-user-management'

// TODO: confirm karein ke admin roles ki enterprise role id yehi hai ya alag
const ADMIN_ENTERPRISE_ROLE_ID = '100003'

const colors = { green: '#10b981', greenHover: '#059669' }

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
  username: yup.string().optional().min(3).max(30),
  firstName: yup.string().optional().max(30),
  middleName: yup.string().optional().max(30),
  lastName: yup.string().optional().max(30),
  dob: yup.string().optional().max(30),
  passport: yup.string().optional().max(10),
  cnic: yup.string().optional().max(30),
  email: yup.string().optional().max(30),
  mobileNumber: yup.string().optional().max(30),
  landline: yup.string().optional().max(30),
  addressLineOne: yup.string().optional().max(30),
  addressLineTwo: yup.string().optional().max(30),
  addressLineThree: yup.string().optional().max(30),
  addressLineFour: yup.string().optional().max(30),
  country: yup.string().optional().max(30),
  city: yup.string().optional().max(30),
  zipCode: yup.string().optional().max(30)
})

const personalFields = [
  { name: 'firstName', label: 'First Name' },
  { name: 'middleName', label: 'Middle Name' },
  { name: 'lastName', label: 'Last Name' }
]

const contactFields = [
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'mobileNumber', label: 'Mobile No', type: 'number' },
  { name: 'landline', label: 'Landline No', type: 'number' },
  { name: 'addressLineOne', label: 'Address Line No 1', type: 'text' },
  { name: 'addressLineTwo', label: 'Address Line No 2', type: 'text' },
  { name: 'addressLineThree', label: 'Address Line No 3', type: 'text' },
  { name: 'addressLineFour', label: 'Address Line No 4', type: 'text' },
  { name: 'country', label: 'Country', type: 'text' },
  { name: 'city', label: 'City', type: 'text' },
  { name: 'zipCode', label: 'Zip Code', type: 'text' }
]

const capitalize = (value?: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '')

const Page = () => {
  const router = useRouter()

  const { getUser, store, updateUser, getRolesById, dispatch } = useAdminUserManagement(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const [title, setTitle] = useState('')
  const [roles, setRoles] = useState<Record<string, { id: string; checked: boolean }>>({})

  // RowOptions se aane wala JSON-key param (agar ho) - safe parse
  const paramData = Object.keys(router.query).find(key => key.startsWith('{"userDTO"'))

  const parsedParam = useMemo(() => {
    try {
      return paramData ? JSON.parse(paramData) : null
    } catch {
      return null
    }
  }, [paramData])

  // Store ka data pehle, warna param ka data
  const entity: any = store.entity?.userDTO ? store.entity : parsedParam
  const profile: any = entity?.userProfileDTO

  useEffect(() => {
    if (!router.isReady) return

    getUser(router.query.id as string)
    getRolesById(ADMIN_ENTERPRISE_ROLE_ID)

    return () => {
      dispatch(clearAction({ id: '12' }))
    }
  }, [router.isReady, router.query.id])

  // Form ko data ke aate hi bhar do
  useEffect(() => {
    if (!profile) return

    reset({
      username: entity?.userDTO?.username ?? '',
      firstName: profile.firstName ?? '',
      middleName: (profile.middleName ?? '').trim(),
      lastName: profile.lastName ?? '',
      dob: profile.dob ?? '',
      passport: profile.passport ?? '',
      cnic: profile.cnic ?? '',
      email: profile.email ?? '',
      mobileNumber: profile.mobileNumber ?? '',
      landline: profile.landlineNumber ?? '',
      // API sirf ek "address" string deti hai, usay Line 1 mein dikhate hain
      addressLineOne: profile.addressLineOne ?? profile.address ?? '',
      addressLineTwo: profile.addressLineTwo ?? '',
      addressLineThree: profile.addressLineThree ?? '',
      addressLineFour: profile.addressLineFour ?? '',
      country: profile.country ?? '',
      city: profile.city ?? '',
      zipCode: profile.postalCode ?? ''
    })

    setTitle((profile.title ?? '').toLowerCase())
  }, [profile])

  // Roles: jo assign hain unhein checked dikhao
  useEffect(() => {
    if (store.roleEntities && store.entity?.userRoles) {
      const initialRoles: Record<string, { id: string; checked: boolean }> = {}

      store.roleEntities.forEach((role: any) => {
        initialRoles[role.roleName] = {
          id: String(role.id),
          checked: !!store.entity.userRoles?.some(ele => String(ele.roleId) === String(role.id))
        }
      })

      setRoles(initialRoles)
    }
  }, [store.roleEntities, store.entity?.userRoles])

  const handleCancel = () => {
    router.push('/admin-maintenance/user-management')
  }

  const handleRoleToggle = (key: string, id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoles(prev => ({ ...prev, [key]: { id: String(id), checked: event.target.checked } }))
  }

  const onSubmit = (data: any) => {
    const combinedAddress = [data.addressLineOne, data.addressLineTwo, data.addressLineThree, data.addressLineFour]
      .map(ele => (ele ? String(ele).trim() : ''))
      .filter(Boolean)
      .join(', ')

    const activeRoles = Object.values(roles)
      .filter(role => role.checked)
      .map(role => ({ roleId: role.id }))

    const payload: any = {
      userProfileDTO: {
        email: data.email,
        mobileNumber: data.mobileNumber,
        landlineNumber: data.landline,
        cnic: data.cnic || profile?.cnic,
        passport: data.passport,
        title: capitalize(title),
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        dob: data.dob || profile?.dob,
        address: combinedAddress,
        city: data.city,
        country: data.country,
        postalCode: data.zipCode
      },
      userDTO: {
        username: entity?.userDTO?.username
      },
      userRoles: activeRoles
    }

    updateUser(router.query.id as string, payload)
  }

  return (
    <Grid container>
      <Grid item xs={12} paddingBottom={5}>
        <Typography variant='h5' sx={{ fontWeight: 700 }}>
          Edit User
        </Typography>
      </Grid>

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        {/* Personal Information */}
        <Grid item xs={12} paddingBottom={5}>
          <StyledFormCard>
            <StyledSectionTitle>Personal Information</StyledSectionTitle>

            <Box sx={{ width: { xs: '100%', sm: 320 }, mb: 4 }}>
              <InputField
                name='username'
                label='User Name'
                placeholder='Enter User Name'
                type='text'
                control={control}
                size='small'
                disabled
              />
            </Box>

            <Grid container spacing={3}>
              {personalFields.map(field => (
                <Grid item xs={12} sm={6} md={4} key={field.name}>
                  <InputField
                    name={field.name}
                    label={field.label}
                    placeholder={`Enter ${field.label}`}
                    type='text'
                    control={control}
                    size='small'
                  />
                </Grid>
              ))}
              <Grid item xs={12} sm={6} md={4}>
                <InputField
                  name='dob'
                  label='Date Of Birth'
                  placeholder='Date Of Birth'
                  type={'date' as any}
                  control={control}
                  size='small'
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  size='small'
                  label='Title'
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  error={!!errors.title}
                >
                  <MenuItem value='mr'>Mr</MenuItem>
                  <MenuItem value='mrs'>Mrs</MenuItem>
                  <MenuItem value='ms'>Ms</MenuItem>
                  <MenuItem value='dr'>Dr</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InputField
                  name='passport'
                  label='Passport'
                  placeholder='Enter Passport No'
                  type='text'
                  control={control}
                  size='small'
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InputField
                  name='cnic'
                  label='CNIC'
                  placeholder='Enter CNIC No'
                  type='text'
                  control={control}
                  size='small'
                  disabled
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
              {contactFields.map(field => (
                <Grid item xs={12} sm={6} md={4} key={field.name}>
                  <InputField
                    name={field.name}
                    label={field.label}
                    placeholder={`Enter ${field.label}`}
                    type={field.type as any}
                    control={control}
                    size='small'
                  />
                </Grid>
              ))}
            </Grid>
          </StyledFormCard>
        </Grid>

        {/* Roles */}
        <Grid item xs={12} paddingBottom={5}>
          <StyledFormCard>
            <StyledSectionTitle>Roles</StyledSectionTitle>
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
              type='submit'
              loading={store.status === 'pending'}
            >
              Update User
            </LoadingButton>
          </Box>
        </Grid>
      </form>
    </Grid>
  )
}

export async function getServerSideProps() {
  return { props: {} }
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'admin-maintenance-user-management-edit-user-page'
}

export default Page