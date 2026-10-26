import { Avatar, Box, Button, Card, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Typography, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { StyledInfoLabel, StyledInfoValue } from "src/@core/components/apps/user-management/styled-components"
import { useUserManagement, isPendingApproval } from "src/@core/hooks/apps/useUserManagement"
import ApartmentIcon from '@mui/icons-material/Apartment'
import { formatDateTime } from "src/@core/utils/format"
import LoadingButton from "@mui/lab/LoadingButton"
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import { InputField } from "src/@core/components/form"
import { UserManagementForm } from "src/types/apps/userManagement"
import * as yup from 'yup'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { UserManagementService } from "src/services"
import toast from "react-hot-toast"
import { styled } from '@mui/material/styles'
import LockIcon from '@mui/icons-material/Lock'
import { clearAction } from "src/store/apps/userManagement"
import ApiResponseDialog from "src/@core/components/ApiResponseDialog"

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

// Toast ko hamesha string chahiye
const getMessage = (data: any, fallback: string): string => {
    if (typeof data === 'string' && data.trim()) return data
    if (typeof data?.message === 'string') return data.message
    if (typeof data?.data === 'string') return data.data
    return fallback
}

// JSX mein kabhi object render na ho
const text = (value: any): string => {
    if (value === null || value === undefined || value === '') return '-'
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
}

// data khali ([] / '' / null / missing) => username available, warna taken
const isUsernameAvailable = (taken: any) =>
    taken === undefined ||
    taken === null ||
    taken === '' ||
    (Array.isArray(taken) && taken.length === 0)

const schema = {
    resetUsername: yup.object().shape({
        newUsername: yup.string().min(8).max(22).required(),
        confirmNewUsername: yup.string().oneOf([yup.ref('newUsername')], 'Username must match')
    })
}

const Page = () => {

    const { control, handleSubmit, getValues, reset, setError } = useForm({
        defaultValues: { newUsername: '', confirmNewUsername: '' },
        mode: 'onChange',
        resolver: yupResolver(schema.resetUsername)
    })

    const { query, isReady } = useRouter()
    const theme = useTheme()

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const [isShowSubmitBtn, setIsShowSubmitBtn] = useState<boolean>(false)

    const {
        getUser,
        store,
        updateUserStatus,
        checkUsername,
        updateUsername,
        dispatch,
        responseInfo,
        setResponseInfo,
        handleCloseResponse
    } = useUserManagement(null)

    // entity null/undefined ho to bhi crash na ho
    const entity: any = store.entity ?? {}
    const profile = entity.userProfileDTO
    const userDTO = entity.userDTO
    const party = entity.userParties?.[0]

    useEffect(() => {
        if (!isReady || !query.id) return

        getUser(query.id as string)

        return () => {
            dispatch(clearAction({ id: '12' }))
        }
    }, [isReady, query.id])

    // Username availability check
    const onSubmit = (data: any) => {
        checkUsername(data.newUsername as string).then((res: any) => {
            // API fail hui to slice already error toast dikha chuka hai
            if (res?.error) return

            const taken = res?.payload?.data

            if (isUsernameAvailable(taken)) {
                setIsShowSubmitBtn(true)
            } else {
                setError('newUsername', {
                    type: 'manual',
                    message: `${typeof taken === 'string' ? taken : data.newUsername} is already taken.`
                })
            }
        }).catch(() => { })
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setIsShowSubmitBtn(false)
        reset()
    }

    const handleUpdateUsername = async () => {
        const outcome = await updateUsername(getValues('newUsername'))

        // Pending ya success par edit modal band, response modal upar dikhega
        if (outcome !== 'failed') handleCloseModal()
    }

    const handleLockUser = () => {
        updateUserStatus(query.id as string, { isLocked: 'Y' } as UserManagementForm)
    }

    const handleUnlockUser = () => {
        updateUserStatus(query.id as string, { isLocked: 'N' } as UserManagementForm)
    }

    const handleResetPassword = () => {
        UserManagementService.resetPassword(query.id as string)
            .then(res => {
                if (isPendingApproval(res.data)) {
                    setResponseInfo(res.data)
                    return
                }

                const message = getMessage(res.data, '')
                if (message) toast.success(message)
            })
            .catch(err => {
                setResponseInfo({
                    status: 'FAILED',
                    message: getMessage(err?.response?.data, err?.message || '')
                })
            })
    }

    const handleResetUsername = () => {
        UserManagementService.resendUsername(query.id as string)
            .then(res => {
                if (isPendingApproval(res.data)) {
                    setResponseInfo(res.data)
                    return
                }

                const message = getMessage(res.data, '')
                if (message) toast.success(message)
            })
            .catch(err => {
                setResponseInfo({
                    status: 'FAILED',
                    message: getMessage(err?.response?.data, err?.message || '')
                })
            })
    }

    return (
        <Grid container>
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
                                <Typography sx={{ fontWeight: 700 }}>{text(party?.partyId)}</Typography>
                            </Box>
                            <Divider orientation='vertical' flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                            <Box>
                                <StyledPartyLabel>Party Name</StyledPartyLabel>
                                <Typography sx={{ fontWeight: 700 }}>{text(party?.partyName)}</Typography>
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

            <Grid container spacing={3} paddingBottom={5}>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>User ID</StyledInfoLabel>
                    <StyledInfoValue>{text(profile?.userId)}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>User Name</StyledInfoLabel>
                    <StyledInfoValue>{text(userDTO?.username)}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Full Name</StyledInfoLabel>
                    <StyledInfoValue>
                        {[profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || '-'}
                    </StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Title</StyledInfoLabel>
                    <StyledInfoValue>{text(profile?.title)}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Email</StyledInfoLabel>
                    <StyledInfoValue sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{text(profile?.email)}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Mobile Number</StyledInfoLabel>
                    <StyledInfoValue>{text(profile?.mobileNumber)}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Date of Birth</StyledInfoLabel>
                    <StyledInfoValue>{text(profile?.dob ? formatDateTime(profile.dob as Date) : '')}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>CNIC</StyledInfoLabel>
                    <StyledInfoValue>{text(profile?.cnic)}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Passport</StyledInfoLabel>
                    <StyledInfoValue>{text(profile?.passport)}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Lock Status</StyledInfoLabel>
                    <Chip
                        size='small'
                        label={userDTO?.isLocked == 'N' ? 'Unlocked' : 'Locked'}
                        sx={{
                            fontWeight: 700,
                            color: '#fff',
                            bgcolor: (theme.palette as any).customColors?.bright ?? theme.palette.primary.main
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Address</StyledInfoLabel>
                    <StyledInfoValue>{text(profile?.address)}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>City</StyledInfoLabel>
                    <StyledInfoValue>{text(profile?.city)}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>State</StyledInfoLabel>
                    <StyledInfoValue>{text(profile?.state)}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Country</StyledInfoLabel>
                    <StyledInfoValue>{text(profile?.country)}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Postal Code</StyledInfoLabel>
                    <StyledInfoValue>{text(profile?.postalCode)}</StyledInfoValue>
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Created By</StyledInfoLabel>
                    <StyledInfoValue>{text(profile?.createdBy)}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Creation Date</StyledInfoLabel>
                    <StyledInfoValue>{text(profile?.creationDate ? formatDateTime(profile.creationDate as Date) : '')}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Updated By</StyledInfoLabel>
                    <StyledInfoValue>{text(profile?.updatedBy)}</StyledInfoValue>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledInfoLabel>Updated Date</StyledInfoLabel>
                    <StyledInfoValue>{text(profile?.updatedDate ? formatDateTime(profile.updatedDate as Date) : '')}</StyledInfoValue>
                </Grid>
            </Grid>

            <Grid item xs={12} paddingBottom={5}>
                <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid item xs={12} sm={12}>
                <Box display={'flex'} justifyContent={'space-evenly'}>
                    <LoadingButton variant='contained' type='button' startIcon={<VpnKeyIcon />} onClick={() => handleResetPassword()}>
                        Reset Password
                    </LoadingButton>
                    <LoadingButton variant='contained' type='button' startIcon={<VpnKeyIcon />} onClick={() => handleResetUsername()}>
                        Reset User Name
                    </LoadingButton>
                    <LoadingButton variant='contained' type='button' startIcon={<VpnKeyIcon />} onClick={() => setIsModalOpen(true)}>
                        Edit User Name
                    </LoadingButton>
                    {userDTO?.isLocked == 'N' && (
                        <LoadingButton
                            variant='contained'
                            type='button'
                            startIcon={<VpnKeyIcon />}
                            onClick={() => handleLockUser()}
                            loading={store.status == 'pending'}
                        >
                            Lock User
                        </LoadingButton>
                    )}
                    {userDTO?.isLocked == 'Y' && (
                        <LoadingButton
                            variant='contained'
                            type='button'
                            startIcon={<VpnKeyIcon />}
                            onClick={() => handleUnlockUser()}
                            loading={store.status == 'pending'}
                        >
                            Unlock User
                        </LoadingButton>
                    )}
                </Box>
            </Grid>

            {isModalOpen && (
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
                                        defaultValue={userDTO?.username}
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
                                <Button variant='contained' sx={{ mr: 1 }} type='submit' disabled={isShowSubmitBtn}>
                                    Check Availablity
                                </Button>
                            )}
                            {isShowSubmitBtn && (
                                <Button variant='contained' sx={{ mr: 1 }} type='button' onClick={() => handleUpdateUsername()}>
                                    Update Username
                                </Button>
                            )}
                            <Button variant='outlined' color='secondary' type='button' onClick={() => handleCloseModal()}>
                                Close
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            )}

            <ApiResponseDialog open={responseInfo !== null} response={responseInfo} onClose={handleCloseResponse} />
        </Grid>
    )
}

Page.acl = {
    action: 'itsHaveAccess',
    subject: 'party-maintenance-user-management-user-page'
}

export async function getServerSideProps() {
    return {
        props: {}
    }
}

export default Page