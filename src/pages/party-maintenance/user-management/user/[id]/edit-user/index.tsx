import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { Avatar, Box, Card, Checkbox, Divider, FormControlLabel, FormGroup, Grid, MenuItem, TextField, Typography } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import ApartmentIcon from '@mui/icons-material/Apartment'
import LockIcon from '@mui/icons-material/Lock'
import LoadingButton from '@mui/lab/LoadingButton'
import { useUserManagement } from 'src/@core/hooks/apps/useUserManagement'
import { InputField } from 'src/@core/components/form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { clearAction } from 'src/store/apps/userManagement'
import { REGIONS, NATIONALITIES, PAKISTAN } from 'src/@core/constants/countries'

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

const colors = {
    green: '#10b981',
    greenHover: '#059669'
}

// CNIC format: 12345-1234567-1
const cnicRegex = /^\d{5}-\d{7}-\d{1}$/

type RoleKey = 'checker' | 'viewer' | 'maker' | 'offshoreViewer' | 'tradeMaker' | 'tradeViewer'

const schema = {
    user: yup.object().shape({
        username: yup.string().optional().min(3).max(30),
        firstName: yup.string().optional().max(30),
        middleName: yup.string().optional().max(30),
        lastName: yup.string().optional().max(30),
        dob: yup.string().optional().max(30),
        title: yup.string().optional().max(30),
        region: yup.string().required('time zone region is required'),
        nationality: yup.string().required('nationality is required'),
        passport: yup.string().nullable().optional().max(10),

        cnic: yup
            .string()
            .nullable()
            .optional()
            .max(30)
            .test('national-id-rule', function (value) {
                const { nationality } = this.parent

                if (!value) {
                    return this.createError({ message: 'National Identification No. is required' })
                }

                if (nationality === PAKISTAN && !cnicRegex.test(value)) {
                    return this.createError({ message: 'National Identification No. must be in format: 12345-1234567-1' })
                }

                return true
            }),
        email: yup.string().optional().max(30),
        mobileNumber: yup.string().optional().max(30),
        landline: yup.string().optional().max(30),
        addressLineOne: yup.string().optional().max(30),
        addressLineTwo: yup.string().optional().max(30),
        addressLineThree: yup.string().optional().max(30),
        addressLineFour: yup.string().optional().max(30),
        country: yup.string().optional().max(30),
        city: yup.string().optional().max(30),
        zipCode: yup.string().optional().max(30),
        limit: yup.string().optional().max(30),
    })
}


const Page = () => {

    const router = useRouter()

    const { getUser, store, updateUser, getRolesById, dispatch, addUserData, setAddUserData } = useUserManagement(null)

    const [form, setForm] = useState<any>({ title: 'Mr', region: '', nationality: '' })

    const { control, handleSubmit, formState: { errors, isSubmitted }, setValue, trigger } = useForm<any>({
        mode: 'onChange',
        resolver: (values: any, ctx: any, options: any) =>
            yupResolver(schema.user)(
                {
                    ...values,
                    region: form.region,
                    nationality: form.nationality,
                    cnic: values.cnic ?? store.entity?.userProfileDTO?.cnic,
                    passport: values.passport ?? store.entity?.userProfileDTO?.passport
                },
                ctx,
                options
            )
    })

    const handleFieldChange = (field: keyof any) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev: any) => ({ ...prev, [field]: event.target.value }))
    }

    const paramData: any = Object.keys(router.query).find(key => key.startsWith('{"userDTO"'));

    let fallbackData: any = {}
    try {
        fallbackData = paramData ? JSON.parse(paramData) : {}
    } catch {
        fallbackData = {}
    }

    useEffect(() => {
        getUser(router.query.id as string)

        getRolesById('100003')

        const profile = fallbackData.userProfileDTO

        setForm({
            title: profile?.title,
            region: profile?.region ?? '',
            nationality: profile?.nationality ?? ''
        })
        setValue('username', store.entity?.userDTO?.username)

        return () => {
            dispatch(clearAction({ id: '12' }))
        }

    }, [router.query.id])

    // Nationality / region badalne par errors dobara check hon (submit ke baad)
    useEffect(() => {
        if (isSubmitted) trigger(['region', 'nationality', 'cnic'])
    }, [form.nationality, form.region])

    const [roles, setRoles] = useState<Record<string, { id: string; checked: boolean }>>({});

    useEffect(() => {
        if (store?.roleEntities && store?.entity?.userRoles) {
            const initialRoles: Record<string, { id: string; checked: boolean }> = {};

            store?.roleEntities?.forEach((role) => {
                const isAssigned = store?.entity?.userRoles?.some((ele) => ele.roleId == role.id);
                // @ts-ignore
                initialRoles[role?.roleName] = {
                    id: role.id,
                    checked: isAssigned
                };
            });

            setRoles(initialRoles);
        }
    }, [store?.roleEntities, store?.entity?.userRoles]);


    const handleCancel = () => {
        router.push('/party-maintenance/user-management')
    }

    const handleRoleToggle = (key: RoleKey, id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {

        setRoles((prev: any) => ({
            ...prev, [key]: {
                id,
                checked: event.target.checked
            }
        }))
    }

    const onSubmit = (data: any) => {

        const addressLines = [data?.addressLineOne, data?.addressLineTwo, data?.addressLineThree, data?.addressLineFour]

        const combinedAddress = addressLines.map((ele) => ele ? ele.trim() : '').filter(Boolean).join(', ')

        const activeRoles = Object.values(roles).filter((value: any) => value && typeof value === 'object' && value.checked === true).map((user: any) => ({ roleId: user.id }));

        data = {
            userProfileDTO: {
                email: data.email,
                mobileNumber: data.mobileNumber,
                cnic: data.cnic,
                passport: data.passport,
                title: form.title,
                firstName: data.firstName,
                middleName: data.middleName,
                lastName: data.lastName,
                dob: data.dob,
                address: combinedAddress,
                city: data.city,
                country: data.country,
                postalCode: data.zipCode,
                region: form.region,
                nationality: form.nationality
            },
            userDTO: {
                username: store?.entity?.userDTO?.username
            },
            userRoles: activeRoles,
            userParties: [{
                partyId: store?.entity && store?.entity?.userParties && store?.entity?.userParties[0].partyId
            }]
        }

        updateUser(router.query.id as string, data)
    }

    console.log(paramData)
    

    return (
        <Grid container>
            {/* Header */}
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant='h5' sx={{ fontWeight: 700 }}>
                        {'Edit User'}
                    </Typography>
                </Box>
            </Grid>

            {/* Party Card */}
            <Grid item xs={12} paddingBottom={5}>
                <StyledFormCard>
                    <StyledSectionTitle>Party</StyledSectionTitle>
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
                                <Typography sx={{ fontWeight: 700 }}>{store.entity && store.entity?.userParties && store.entity?.userParties[0]?.partyId}</Typography>
                            </Box>
                            <Divider orientation='vertical' flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                            <Box>
                                <StyledPartyLabel>Party Name</StyledPartyLabel>
                                <Typography sx={{ fontWeight: 700 }}>{store.entity && store.entity?.userParties && store.entity?.userParties[0]?.partyName}</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
                            <LockIcon fontSize='small' />
                            <Typography variant='caption' sx={{ fontWeight: 600 }}>
                                Party locked — cannot be changed
                            </Typography>
                        </Box>

                    </Box>
                </StyledFormCard>
            </Grid>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Personal Information */}
                <Grid item xs={12} paddingBottom={5}>
                    <StyledFormCard>
                        <StyledSectionTitle>Personal Information</StyledSectionTitle>

                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, flexWrap: 'wrap', mb: 4 }}>
                            <Box sx={{ width: { xs: '100%', sm: 320 } }}>
                                <InputField
                                    name='username'
                                    label='User Name'
                                    placeholder='Enter User Name'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity?.userDTO?.username || fallbackData.userDTO?.username}
                                    disabled
                                />
                            </Box>
                        </Box>

                        <Grid container spacing={3} >
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='firstName'
                                    label='First Name'
                                    placeholder='Enter First Name'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity?.userProfileDTO?.firstName || fallbackData.userProfileDTO?.firstName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='middleName'
                                    label='Middle Name'
                                    placeholder='Enter Middle Name'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity?.userProfileDTO?.middleName || fallbackData.userProfileDTO?.middleName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='lastName'
                                    label='Last Name'
                                    placeholder='Enter Last Name'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity?.userProfileDTO?.lastName || fallbackData.userProfileDTO?.lastName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='dob'
                                    label='Date Of Birth'
                                    placeholder='Date Of Birth'
                                    // @ts-ignore
                                    type='date'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity?.userProfileDTO?.dob || fallbackData.userProfileDTO?.dob as any}
                                    // disabled
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
                                >
                                    <MenuItem value='Mr'>Mr</MenuItem>
                                    <MenuItem value='Mrs'>Mrs</MenuItem>
                                    <MenuItem value='Ms'>Ms</MenuItem>
                                    <MenuItem value='Dr'>Dr</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    select
                                    fullWidth
                                    size='small'
                                    label='Time Zone Region'
                                    value={form.region}
                                    onChange={handleFieldChange('region')}
                                    error={!!(errors as any).region}
                                    helperText={(errors as any).region ? (errors as any).region.message : ''}
                                >
                                    {REGIONS.map(region => (
                                        <MenuItem key={region} value={region}>
                                            {region}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    select
                                    fullWidth
                                    size='small'
                                    label='Nationality'
                                    value={form.nationality}
                                    onChange={handleFieldChange('nationality')}
                                    error={!!(errors as any).nationality}
                                    helperText={(errors as any).nationality ? (errors as any).nationality.message : ''}
                                    SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 320 } } } }}
                                >
                                    {NATIONALITIES.map(country => (
                                        <MenuItem key={country} value={country}>
                                            {country}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='passport'
                                    label='Passport'
                                    placeholder='Enter Passport No.'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity?.userProfileDTO?.passport || fallbackData.userProfileDTO?.passport}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='cnic'
                                    label='National Identification No. *'
                                    placeholder={
                                        form.nationality === PAKISTAN
                                            ? 'Enter National Identification No. (12345-1234567-1)'
                                            : 'Enter National Identification No.'
                                    }
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity?.userProfileDTO?.cnic || fallbackData.userProfileDTO?.cnic}
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
                                    name='email'
                                    label='Email'
                                    placeholder='Enter Email ID'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity?.userProfileDTO?.email || fallbackData.userProfileDTO?.email}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='mobileNumber'
                                    label='Mobile No'
                                    placeholder='Enter Mobile No'
                                    type='number'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity?.userProfileDTO?.mobileNumber || fallbackData.userProfileDTO?.mobileNumber as any}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='landline'
                                    label='Landline No'
                                    placeholder='Enter Landline No'
                                    type='number'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity?.userProfileDTO?.landlineNumber || fallbackData.userProfileDTO?.landlineNumber as any}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='addressLineOne'
                                    label='Address Line No'
                                    placeholder='Enter Address Line No'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity?.userProfileDTO?.address || fallbackData.userProfileDTO?.address as any}
                                    // defaultValue={'HHHH'}
                                />
                            </Grid>
                            {/* <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='addressLineTwo'
                                    label='Address Landline No 2'
                                    placeholder='Enter Address Landline No 2'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity?.userProfileDTO?.addressLineTwo || fallbackData.userProfileDTO?.addressLineTwo as any}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='addressLineThree'
                                    label='Address Landline No 3'
                                    placeholder='Enter Address Landline No 3'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity?.userProfileDTO?.addressLineThree || fallbackData.userProfileDTO?.addressLineThree as any}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='addressLineFour'
                                    label='Address Landline No 4'
                                    placeholder='Enter Address Landline No 4'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity?.userProfileDTO?.addressLineFour || fallbackData.userProfileDTO?.addressLineFour as any}
                                />
                            </Grid> */}
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='country'
                                    label='Country'
                                    placeholder='Enter Country'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity?.userProfileDTO?.country || fallbackData.userProfileDTO?.country}
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
                                    defaultValue={store.entity?.userProfileDTO?.city || fallbackData.userProfileDTO?.city as any}
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
                                    defaultValue={store.entity?.userProfileDTO?.postalCode || fallbackData.userProfileDTO?.postalCode as any}
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
                            {store?.roleEntities?.map((role) => (
                                <FormControlLabel
                                    key={role.id}
                                    label={role.roleName}
                                    control={
                                        <Checkbox
                                            checked={!!roles[role.roleName as string]?.checked}
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
                        >
                            {'Update User'}
                        </LoadingButton>
                    </Box>
                </Grid>
            </form>

        </Grid>
    )
}


export async function getServerSideProps() {
    return {
        props: {}
    }
}

Page.acl = {
    action: 'itsHaveAccess',
    subject: 'party-maintenance-user-management-edit-user-page'
}

export default Page