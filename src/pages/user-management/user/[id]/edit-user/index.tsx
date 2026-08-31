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
import { useUserManagement } from 'src/@core/hooks/apps/useUserManagement'
import { InputField, Select } from 'src/@core/components/form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { IUserManagement } from 'src/types/apps/userManagement'
import { useAuth } from 'src/hooks/useAuth'


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
type RoleKey = 'checker' | 'viewer' | 'maker' | 'offshoreViewer' | 'tradeMaker' | 'tradeViewer'

const schema = {
    user: yup.object().shape({
        username: yup.string().optional().min(3).max(30),
        firstName: yup.string().optional().max(30),
        middleName: yup.string().optional().max(30),
        lastName: yup.string().optional().max(30),
        dob: yup.string().optional().max(30),
        title: yup.string().optional().max(30),
        passport: yup.string().optional().max(30),
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
        zipCode: yup.string().optional().max(30),
        limit: yup.string().optional().max(30),
    })
}


const Page = () => {

    const { query, push } = useRouter()

    const { getUser, store, updateUser, checkUsername } = useUserManagement(null)

    const { control, handleSubmit, getValues } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema.user)
    })

    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>(false)

    useEffect(() => {
        getUser(query.id as string)
    }, [query.id])

    const [roles, setRoles] = useState<Record<RoleKey, boolean>>({
        checker: false,
        viewer: false,
        maker: false,
        offshoreViewer: false,
        tradeMaker: false,
        tradeViewer: false
    })

    const handleCancel = () => {
        push('/user-management')
    }

    const onSubmit = (data: any) => {
        updateUser(query.id as string, data)
    }

    const handleCheckUsernameAvailablity = async () => {
        await checkUsername(getValues('username')).then((res: any) => {
            if (res.error) {
                setIsUsernameAvailable(true)
            }
        })
    }


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

            {/* Party Search / Party Card */}
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
                                <Typography sx={{ fontWeight: 700 }}>{store.entity.userProfileDTO?.cnic}</Typography>
                            </Box>
                            <Divider orientation='vertical' flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                            <Box>
                                <StyledPartyLabel>Party Name</StyledPartyLabel>
                                <Typography sx={{ fontWeight: 700 }}>{'userParties' in store.entity && store.entity?.userParties[0]?.partyName}</Typography>
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

            {/* Baaqi form Party mil jaane ke baad hi khulta hai */}
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Personal Information */}
                <Grid item xs={12} paddingBottom={5}>
                    <StyledFormCard>
                        <StyledSectionTitle>Personal Information</StyledSectionTitle>

                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, flexWrap: 'wrap', mb: 4 }}>
                            <Box sx={{ width: { xs: '100%', sm: 320 } }}>
                                {/* <TextField
                                    fullWidth
                                    size='small'
                                    label='User Name'
                                    value={'username'}
                                /> */}
                                <InputField
                                    name='username'
                                    label='User Name'
                                    placeholder='Enter User Name'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity.userDTO?.username}
                                />
                            </Box>
                            {/* <LoadingButton
                                variant='outlined'
                                loadingPosition='end'
                                startIcon={<AutorenewIcon fontSize='small' />}
                                sx={{ color: colors.green, borderColor: colors.green, '&:hover': { borderColor: colors.greenHover } }}
                            >
                                Suggest Username
                            </LoadingButton> */}
                            <LoadingButton
                                variant='contained'
                                loadingPosition='end'
                                onClick={() => handleCheckUsernameAvailablity()}
                                disabled={!isUsernameAvailable}
                            >
                                Check Availability
                            </LoadingButton>
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
                                    defaultValue={store.entity.userProfileDTO?.firstName}
                                />
                                {/* <TextField
                                    fullWidth
                                    size='small'
                                    label='First Name'
                                    value={'firstName'}
                                /> */}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='middleName'
                                    label='Middle Name'
                                    placeholder='Enter Middle Name'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity.userProfileDTO?.middleName}
                                />
                                {/* <TextField
                                    fullWidth
                                    size='small'
                                    label='Middle Name'
                                /> */}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='lastName'
                                    label='Last Name'
                                    placeholder='Enter Last Name'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity.userProfileDTO?.lastName}
                                />
                                {/* <TextField
                                    fullWidth
                                    size='small'
                                    label='Last Name'
                                /> */}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                {/* <TextField
                                    fullWidth
                                    size='small'
                                    type='date'
                                    label='Date of Birth'
                                    InputLabelProps={{ shrink: true }}
                                    value={store.entity.userProfileDTO?.dob}
                                    disabled
                                /> */}
                                <InputField
                                    name='dob'
                                    label='Date Of Birth'
                                    placeholder='Date Of Birth'
                                    // @ts-ignore
                                    type='date'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity.userProfileDTO?.dob as any}
                                    disabled
                                />
                            </Grid>
                            {/* <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    select
                                    fullWidth
                                    size='small'
                                    label='Title'
                                >
                                    <MenuItem value='mr'>Mr</MenuItem>
                                    <MenuItem value='mrs'>Mrs</MenuItem>
                                    <MenuItem value='ms'>Ms</MenuItem>
                                    <MenuItem value='dr'>Dr</MenuItem>
                                </TextField>
                            </Grid> */}
                            <Grid item xs={12} sm={6} md={4}>
                                {/* <TextField
                                    fullWidth
                                    size='small'
                                    label='Passport No'
                                /> */}
                                <InputField
                                    name='passport'
                                    label='Passport'
                                    placeholder='Enter Passport No'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity.userProfileDTO?.passport}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                {/* <TextField
                                    fullWidth
                                    size='small'
                                    label='CNIC'
                                /> */}
                                <InputField
                                    name='cnic'
                                    label='Cnic'
                                    placeholder='Enter CNIC No'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity.userProfileDTO?.cnic}
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
                                    defaultValue={store.entity.userProfileDTO?.email}
                                />
                                {/* <TextField
                                    fullWidth
                                    size='small'
                                    label='Email ID'
                                /> */}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='mobileNumber'
                                    label='Mobile No'
                                    placeholder='Enter Mobile No'
                                    type='number'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity.userProfileDTO?.mobileNumber as any}
                                />
                                {/* <TextField
                                    fullWidth
                                    size='small'
                                    label='Contact Number (Mobile)'
                                /> */}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='landline'
                                    label='Landline No'
                                    placeholder='Enter Landline No'
                                    type='number'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity.userProfileDTO?.landlineNumber as any}
                                />
                                {/* <TextField
                                    fullWidth
                                    size='small'
                                    label='Contact Number (Landline)'
                                /> */}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='addressLineOne'
                                    label='Address Line No 1'
                                    placeholder='Enter Address Line No'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity.userProfileDTO?.addressLineOne as any}
                                />
                                {/* <TextField
                                    fullWidth
                                    size='small'
                                    label='Address Line 1'
                                /> */}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='addressLineTwo'
                                    label='Address Landline No 2'
                                    placeholder='Enter Address Landline No 2'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity.userProfileDTO?.addressLineTwo as any}
                                />
                                {/* <TextField
                                    fullWidth
                                    size='small'
                                    label='Address Line 2'
                                /> */}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='addressLineThree'
                                    label='Address Landline No 3'
                                    placeholder='Enter Address Landline No 3'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity.userProfileDTO?.addressLineThree as any}
                                />
                                {/* <TextField
                                    fullWidth
                                    size='small'
                                    label='Address Line 3'
                                /> */}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='addressLineFour'
                                    label='Address Landline No 4'
                                    placeholder='Enter Address Landline No 4'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity.userProfileDTO?.addressLineFour as any}
                                />
                                {/* <TextField
                                    fullWidth
                                    size='small'
                                    label='Address Line 4'
                                /> */}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='country'
                                    label='Country'
                                    placeholder='Enter Country'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity.userProfileDTO?.country}
                                />
                                {/* <TextField
                                    select
                                    fullWidth
                                    size='small'
                                    label='Country'
                                >
                                    <MenuItem value='pk'>Pakistan</MenuItem>
                                    <MenuItem value='ae'>United Arab Emirates</MenuItem>
                                    <MenuItem value='sa'>Saudi Arabia</MenuItem>
                                    <MenuItem value='uk'>United Kingdom</MenuItem>
                                    <MenuItem value='us'>United States</MenuItem>
                                </TextField> */}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='city'
                                    label='City'
                                    placeholder='Enter City'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity.userProfileDTO?.city as any}
                                />
                                {/* <TextField
                                    fullWidth
                                    size='small'
                                    label='City'
                                /> */}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <InputField
                                    name='zipCode'
                                    label='Zip Code'
                                    placeholder='Enter Zip Code'
                                    type='text'
                                    control={control}
                                    size='small'
                                    defaultValue={store.entity.userProfileDTO?.zipCode as any}
                                />
                                {/* <TextField
                                    fullWidth
                                    size='small'
                                    label='Zip Code'
                                /> */}
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
                            {[
                                { key: 'checker', label: 'Checker' },
                                { key: 'viewer', label: 'Viewer' },
                                { key: 'maker', label: 'Maker' },
                                // { key: 'offshoreViewer', label: 'Offshore Viewer' },
                                { key: 'tradeMaker', label: 'Trade Maker' },
                                { key: 'tradeViewer', label: 'Trade Viewer' }
                            ]
                                .map(role => (
                                    <FormControlLabel
                                        key={role.key}
                                        label={role.label}
                                        control={
                                            <Checkbox
                                                // @ts-ignore
                                                checked={roles[role.key]}
                                                // onChange={handleRoleToggle(role.key)}
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
                {isUsernameAvailable && (
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
                            // onClick={handleSave}
                            >
                                {'Update User'}
                            </LoadingButton>
                        </Box>
                    </Grid>
                )}
            </form>
        </Grid>
    )
}


export async function getServerSideProps() {
    // Return the fetched data as props
    return {
        props: {}
    }
}

Page.acl = {
    action: 'itsHaveAccess',
    subject: 'edit-user-page'
}

export default Page