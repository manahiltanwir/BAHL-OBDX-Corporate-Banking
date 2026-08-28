import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Typography, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { StyledInfoLabel, StyledInfoValue } from "src/@core/components/apps/user-management/styled-components"
import { useUserManagement } from "src/@core/hooks/apps/useUserManagement"
import ApartmentIcon from '@mui/icons-material/Apartment'
import { formatDateTime } from "src/@core/utils/format"
import LoadingButton from "@mui/lab/LoadingButton"
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import { InputField } from "src/@core/components/form"
import { UserManagementForm } from "src/types/apps/userManagement"
import * as yup from 'yup'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"


const schema = {
    resetUsername: yup.object().shape({
        newUsername: yup.string().min(8).max(22).required(),
        confirmNewUsername: yup.string().oneOf([yup.ref('newUsername')], 'Username must match')
    })
}

const Page = () => {

    const { control, handleSubmit, getValues,reset } = useForm({
        defaultValues: { newUsername: '', confirmNewUsername: '' },
        mode: 'onChange',
        resolver: yupResolver(schema.resetUsername)
    })

    const { query } = useRouter()

    const theme = useTheme()

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const [isShowSubmitBtn, setIsShowSubmitBtn] = useState<boolean>(false)

    const { getUser, store, updateUserStatus, checkUsername, updateUsername } = useUserManagement(null)

    useEffect(() => {
        getUser(query.id as string)
    }, [query.id])

    const handleEditUserName = () => {
        handleOpenModal()
    }

    const onSubmit = (data: any) => {
        checkUsername(data.newUsername as string).then((res) => {
            setIsShowSubmitBtn(true)
        }).catch((err) => {
            debugger
        })

    }

    // const usernameHandleSubmit = (data:any) => {
    //     console.log(data);

    // }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setIsShowSubmitBtn(false)
        reset()
    }

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    const handleUpdateUsername = () => {
        console.log(getValues('newUsername'));
        updateUsername(getValues('newUsername')).then((res) => {
            console.log(res);
        }).catch((err) => {
            debugger
        })
        // setIsShowSubmitBtn(true)
    }

    const handleLockUser = () => {
        updateUserStatus(query.id as string, { isLocked: 'Y' } as UserManagementForm)
    }

    const handleUnlockUser = () => {
        updateUserStatus(query.id as string, { isLocked: 'N' } as UserManagementForm)
    }

    return (
        <Grid container spacing={6} padding={5}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(21, 128, 79, 0.08)',
                    border: `1px solid rgba(21, 128, 79, 0.25)`,
                    width: '100%',
                    justifyContent: "space-evenly"
                }}
            >
                <Box display={"flex"} gap={2.5}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2.5,
                            flexWrap: 'wrap',
                            p: 2,
                            mb: 3,
                            borderRadius: 2,
                            bgcolor: 'rgba(21, 128, 79, 0.08)',
                            border: `1px solid rgba(21, 128, 79, 0.25)`
                        }}
                    >
                        <Avatar sx={{ bgcolor: theme.palette.primary.light, width: 40, height: 40 }}>
                            <ApartmentIcon fontSize='small' />
                        </Avatar>
                    </Box>
                    <Box textAlign={'center'}>
                        <StyledInfoLabel sx={{ mb: 0, fontSize: '20px', letterSpacing: '5px' }}>User Name</StyledInfoLabel>
                        <Typography sx={{ fontWeight: 700, fontSize: '20px', letterSpacing: '5px' }}>{store.entity.userDTO?.username}</Typography>
                    </Box>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>User ID</StyledInfoLabel>
                    <StyledInfoValue>{store.entity.userProfileDTO?.userId}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>User Name</StyledInfoLabel>
                    <StyledInfoValue>{store.entity.userDTO?.username}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Full Name</StyledInfoLabel>
                    <StyledInfoValue>
                        {store.entity.userProfileDTO?.firstName + ' ' + store.entity.userProfileDTO?.lastName}
                    </StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Title</StyledInfoLabel>
                    <StyledInfoValue>{store.entity.userProfileDTO?.title}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Email</StyledInfoLabel>
                    <StyledInfoValue sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{store.entity.userProfileDTO?.email}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Mobile Number</StyledInfoLabel>
                    <StyledInfoValue>{store.entity.userProfileDTO?.mobileNumber}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Date of Birth</StyledInfoLabel>
                    <StyledInfoValue>{formatDateTime(store.entity.userProfileDTO?.dob as Date)}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>CNIC</StyledInfoLabel>
                    <StyledInfoValue>{store.entity.userProfileDTO?.cnic}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Passport</StyledInfoLabel>
                    <StyledInfoValue>{store.entity.userProfileDTO?.passport}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Lock Status</StyledInfoLabel>
                    <Chip
                        size='small'
                        label={store.entity?.userDTO?.isLocked == 'N' ? 'Unlocked' : 'Locked'}
                        sx={{
                            fontWeight: 700,
                            color: '#fff',
                            bgcolor: theme.palette.customColors.bright
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Address</StyledInfoLabel>
                    <StyledInfoValue>{store.entity?.userProfileDTO?.address}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>City</StyledInfoLabel>
                    <StyledInfoValue>{store.entity?.userProfileDTO?.city}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>State</StyledInfoLabel>
                    <StyledInfoValue>{store.entity?.userProfileDTO?.state}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Country</StyledInfoLabel>
                    <StyledInfoValue>{store.entity?.userProfileDTO?.country}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Postal Code</StyledInfoLabel>
                    <StyledInfoValue>{store.entity?.userProfileDTO?.postalCode}</StyledInfoValue>
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Created By</StyledInfoLabel>
                    <StyledInfoValue>{store.entity?.userProfileDTO?.createdBy}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Creation Date</StyledInfoLabel>
                    <StyledInfoValue>{formatDateTime(store.entity?.userProfileDTO?.creationDate as Date)}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Updated By</StyledInfoLabel>
                    <StyledInfoValue>{store.entity?.userProfileDTO?.updatedBy}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Updated Date</StyledInfoLabel>
                    <StyledInfoValue>{formatDateTime(store.entity?.userProfileDTO?.updatedDate as Date)}</StyledInfoValue>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
            </Grid>
            <Grid item xs={12} sm={12}>
                <Box display={'flex'} justifyContent={'space-evenly'}>
                    <LoadingButton variant='contained' type='submit' startIcon={<VpnKeyIcon />}>
                        Reset Password
                    </LoadingButton>
                    <LoadingButton variant='contained' type='submit' startIcon={<VpnKeyIcon />}>
                        Reset User Name
                    </LoadingButton>
                    {
                        store.entity.userDTO?.isLocked == 'N' &&
                        <LoadingButton
                            variant='contained'
                            type='submit'
                            startIcon={<VpnKeyIcon />}
                            onClick={() => handleLockUser()}
                            loading={store.status == 'pending'}
                        >
                            Lock User
                        </LoadingButton>
                    }
                    {
                        store.entity.userDTO?.isLocked == "Y" &&
                        <LoadingButton
                            variant='contained'
                            type='submit'
                            startIcon={<VpnKeyIcon />}
                            onClick={() => handleUnlockUser()}
                            loading={store.status == 'pending'}
                        >
                            Unlock User
                        </LoadingButton>
                    }
                    <LoadingButton
                        variant='contained'
                        type='submit'
                        startIcon={<VpnKeyIcon />}
                        onClick={() => handleEditUserName()}
                        loading={store.status == 'pending'}
                    >
                        Edit User Name
                    </LoadingButton>
                </Box>
            </Grid>
            {
                isModalOpen && (
                    <Dialog
                        open={isModalOpen}
                        onClose={() => handleCloseModal()}
                        aria-labelledby='user-view-edit'
                        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
                        aria-describedby='user-view-edit-description'
                    >
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
                                Edit User Name
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                                    Updating user details will receive a privacy audit.
                                </DialogContentText>
                                <Grid container spacing={6}>
                                    <Grid item xs={12} sm={12}>
                                        <InputField
                                            name='username'
                                            label='User Name'
                                            placeholder='Enter User Name'
                                            type='text'
                                            control={control}
                                            size='small'
                                            fullWidth
                                            defaultValue={store.entity.userDTO?.username}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <InputField
                                            name='newUsername'
                                            label='New User Name'
                                            placeholder='Enter User Name'
                                            type='text'
                                            control={control}
                                            size='small'
                                            fullWidth
                                            disabled={isShowSubmitBtn}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <InputField
                                            name='confirmNewUsername'
                                            label='Confirm User Name'
                                            placeholder='Enter User Name'
                                            type='text'
                                            control={control}
                                            size='small'
                                            fullWidth
                                            disabled={isShowSubmitBtn}
                                        />
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions sx={{ justifyContent: 'center' }}>
                                {!isShowSubmitBtn && (
                                    <Button variant='contained' sx={{ mr: 1 }} type="submit" disabled={isShowSubmitBtn}>
                                        Check Availablity
                                    </Button>
                                )}
                                {isShowSubmitBtn && (
                                    <Button variant='contained' sx={{ mr: 1 }} onClick={() => handleUpdateUsername()}>
                                        Update Username
                                    </Button>
                                )}
                                <Button variant='outlined' color='secondary' onClick={() => handleCloseModal()}>
                                    Close
                                </Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                )
            }
        </Grid>
    )
}

Page.acl = {
    action: 'itsHaveAccess',
    subject: 'user-management-user-page'
}

export async function getServerSideProps() {
    // Return the fetched data as props
    return {
        props: {}
    }
}

export default Page