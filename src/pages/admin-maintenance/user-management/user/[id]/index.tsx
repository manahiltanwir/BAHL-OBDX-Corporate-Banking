import { Box, Chip, Divider, Grid, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import LoadingButton from '@mui/lab/LoadingButton'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import { StyledInfoLabel, StyledInfoValue } from 'src/@core/components/apps/admin-user-management/styled-components'
import { useAdminUserManagement } from 'src/@core/hooks/apps/useAdminUserManagement'
import { formatDateTime } from 'src/@core/utils/format'
import { AdminUserManagementForm } from 'src/types/apps/adminUserManagement'
import { AdminUserManagementService } from 'src/services'
import { clearAction } from 'src/store/apps/admin-user-management'

const Page = () => {
  const { query } = useRouter()
  const theme = useTheme()

  const { getUser, store, updateUserStatus, dispatch } = useAdminUserManagement(null)

  const user = store.entity?.userDTO
  const profile = store.entity?.userProfileDTO
  const fullName = profile ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() : ''

  useEffect(() => {
    if (!query.id) return

    getUser(query.id as string)

    return () => {
      dispatch(clearAction({ id: '12' }))
    }
  }, [query.id])

  const handleLockUser = () => {
    updateUserStatus(query.id as string, { isLocked: 'Y' } as AdminUserManagementForm)
  }

  const handleUnlockUser = () => {
    updateUserStatus(query.id as string, { isLocked: 'N' } as AdminUserManagementForm)
  }

    const handleResetPassword = () => {
    AdminUserManagementService.resetPassword(query.id as string)
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data?.message || 'Password reset successfully')
        }
      })
      .catch(() => toast.error('Internal Server Error'))
  }

  const handleResetUsername = () => {
    AdminUserManagementService.resendUsername(query.id as string)
      .then(res => {
        if (res.status === 200) {
          toast.success(res.data?.message || 'Username sent successfully')
        }
      })
      .catch(() => toast.error('Internal Server Error'))
  }

  return (
    <Grid container>
      <Grid container spacing={3} paddingBottom={5}>
        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>User ID</StyledInfoLabel>
          <StyledInfoValue>{profile?.userId}</StyledInfoValue>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>User Name</StyledInfoLabel>
          <StyledInfoValue>{user?.username}</StyledInfoValue>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>Full Name</StyledInfoLabel>
          <StyledInfoValue>{fullName}</StyledInfoValue>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>Title</StyledInfoLabel>
          <StyledInfoValue>{profile?.title}</StyledInfoValue>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>Email</StyledInfoLabel>
          <StyledInfoValue sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{profile?.email}</StyledInfoValue>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>Mobile Number</StyledInfoLabel>
          <StyledInfoValue>{profile?.mobileNumber}</StyledInfoValue>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>Date of Birth</StyledInfoLabel>
          <StyledInfoValue>{profile?.dob ? formatDateTime(profile.dob as Date) : ''}</StyledInfoValue>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>CNIC</StyledInfoLabel>
          <StyledInfoValue>{profile?.cnic}</StyledInfoValue>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>Passport</StyledInfoLabel>
          <StyledInfoValue>{profile?.passport}</StyledInfoValue>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>Lock Status</StyledInfoLabel>
          <Chip
            size='small'
            label={user?.isLocked == 'N' ? 'Unlocked' : 'Locked'}
            sx={{ fontWeight: 700, color: '#fff', bgcolor: theme.palette.customColors.bright }}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>Address</StyledInfoLabel>
          <StyledInfoValue>{profile?.address}</StyledInfoValue>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>City</StyledInfoLabel>
          <StyledInfoValue>{profile?.city}</StyledInfoValue>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>State</StyledInfoLabel>
          <StyledInfoValue>{profile?.state}</StyledInfoValue>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>Country</StyledInfoLabel>
          <StyledInfoValue>{profile?.country}</StyledInfoValue>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>Postal Code</StyledInfoLabel>
          <StyledInfoValue>{profile?.postalCode}</StyledInfoValue>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>Created By</StyledInfoLabel>
          <StyledInfoValue>{profile?.createdBy}</StyledInfoValue>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>Creation Date</StyledInfoLabel>
          <StyledInfoValue>{profile?.creationDate ? formatDateTime(profile.creationDate as Date) : ''}</StyledInfoValue>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>Updated By</StyledInfoLabel>
          <StyledInfoValue>{profile?.updatedBy}</StyledInfoValue>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledInfoLabel>Updated Date</StyledInfoLabel>
          <StyledInfoValue>{profile?.updatedDate ? formatDateTime(profile.updatedDate as Date) : ''}</StyledInfoValue>
        </Grid>
      </Grid>

      <Grid item xs={12} paddingBottom={5}>
        <Divider sx={{ my: 1 }} />
      </Grid>

      <Grid item xs={12}>
        <Box display='flex' justifyContent='space-evenly'>
          <LoadingButton variant='contained' startIcon={<VpnKeyIcon />} onClick={handleResetPassword}>
            Reset Password
          </LoadingButton>
          <LoadingButton variant='contained' startIcon={<VpnKeyIcon />} onClick={handleResetUsername}>
            Reset User Name
          </LoadingButton>
          {user?.isLocked == 'N' && (
            <LoadingButton
              variant='contained'
              startIcon={<VpnKeyIcon />}
              onClick={handleLockUser}
              loading={store.status == 'pending'}
            >
              Lock User
            </LoadingButton>
          )}
          {user?.isLocked == 'Y' && (
            <LoadingButton
              variant='contained'
              startIcon={<VpnKeyIcon />}
              onClick={handleUnlockUser}
              loading={store.status == 'pending'}
            >
              Unlock User
            </LoadingButton>
          )}
        </Box>
      </Grid>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'admin-maintenance-user-management-user-page'
}

export async function getServerSideProps() {
  return { props: {} }
}

export default Page