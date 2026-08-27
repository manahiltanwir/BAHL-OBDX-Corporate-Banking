import { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icons
import AccountOutline from 'mdi-material-ui/AccountOutline'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import PhoneOutline from 'mdi-material-ui/PhoneOutline'
import MapMarkerOutline from 'mdi-material-ui/MapMarkerOutline'
import CalendarOutline from 'mdi-material-ui/CalendarOutline'
import CardAccountDetailsOutline from 'mdi-material-ui/CardAccountDetailsOutline'
import PassportBiometric from 'mdi-material-ui/PassportBiometric'
import ShieldAccountOutline from 'mdi-material-ui/ShieldAccountOutline'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { debug } from 'console'

interface UserProfile {
  address: string
  city: string
  cnic: string
  country: string
  createdBy: string
  creationDate: string
  dob: string
  email: string
  enterpriseRole: string
  firstName: string
  lastName: string
  middleName: string
  mobileNumber: string
  passport: string
  postalCode: string
  rights: Record<string, unknown>
  roles: string[]
  state: string
  taskCodes: string[]
  title: string
  updatedBy: string
  updatedDate: string
  userId: string
  username: string
}

// ---------- Helpers ----------

const getFullName = (profile: UserProfile) =>
  [profile.title, profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(' ')

const getInitials = (profile: UserProfile) =>
  `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase()

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return isNaN(d.getTime())
    ? dateStr
    : d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ---------- Reusable Components ----------

const InfoRow = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
  <Stack direction='row' spacing={2} alignItems='flex-start' sx={{ mb: 3 }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 38,
        height: 38,
        borderRadius: '10px',
        backgroundColor: 'action.hover',
        color: 'primary.main',
        flexShrink: 0
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant='caption' sx={{ color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant='body1' sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
        {value || '-'}
      </Typography>
    </Box>
  </Stack>
)

const NamePart = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
      <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
        {label}:
      </Box>{' '}
      {value}
    </Typography>
  ) : null

// ---------- Page ----------

const Page = () => {
  const { user } = useAuth() as { user: any }
  const profile: UserProfile | null = user?.userProfile ? { ...user.userProfile, username: user.username } : null

  if (!profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  console.log(user);
  
  const fullName = getFullName(profile)

  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid item xs={12}>
        <Card>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 4
            }}
          >
            <Avatar sx={{ width: 90, height: 90, fontSize: '2rem', fontWeight: 600, bgcolor: '#DCE9E5', color: '#158258' }}>
              {getInitials(profile)}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant='h5' sx={{ fontWeight: 600 }}>
                {fullName}
              </Typography>

              <Stack direction='row' spacing={2} flexWrap='wrap' useFlexGap sx={{ mt: 0.5, mb: 1 }}>
                <NamePart label='First' value={profile.firstName} />
                <NamePart label='Middle' value={profile.middleName} />
                <NamePart label='Last' value={profile.lastName} />
              </Stack>

              <Typography variant='body2' sx={{ color: 'text.secondary', mb: 2 }}>
                @{profile.username}
              </Typography>

              <Stack direction='row' spacing={2} flexWrap='wrap' useFlexGap>
                <Chip
                  icon={<ShieldAccountOutline sx={{ fontSize: '1rem !important' }} />}
                  label={profile.enterpriseRole}
                  color='primary'
                  variant='outlined'
                  size='small'
                />
                {profile.roles?.map(role => (
                  <Chip key={role} label={role} size='small' color='secondary' variant='outlined' />
                ))}
              </Stack>
            </Box>

            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                User ID
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 500 }}>
                {profile.userId}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Personal Information */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4, fontWeight: 600 }}>
              Personal Information
            </Typography>
            <InfoRow icon={<AccountOutline />} label='CNIC' value={profile.cnic} />
            <InfoRow icon={<CalendarOutline />} label='Date of Birth' value={formatDate(profile.dob)} />
            <InfoRow icon={<CardAccountDetailsOutline />} label='Enterprise Role' value={profile.enterpriseRole} />
            <InfoRow icon={<PassportBiometric />} label='Passport' value={profile.passport} />
          </CardContent>
        </Card>
      </Grid>

      {/* Contact & Address */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4, fontWeight: 600 }}>
              Contact &amp; Address
            </Typography>
            <InfoRow icon={<EmailOutline />} label='Email' value={profile.email} />
            <InfoRow icon={<PhoneOutline />} label='Mobile Number' value={profile.mobileNumber} />
            <InfoRow
              icon={<MapMarkerOutline />}
              label='Address'
              value={[profile.address, profile.city, profile.state, profile.postalCode, profile.country]
                .filter(Boolean)
                .join(', ')}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Account / System Info */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4, fontWeight: 600 }}>
              Account Information
            </Typography>
            <Grid container spacing={4}>
              {[
                { label: 'Created By', value: profile.createdBy },
                { label: 'Creation Date', value: formatDateTime(profile.creationDate) },
                { label: 'Updated By', value: profile.updatedBy },
                { label: 'Updated Date', value: formatDateTime(profile.updatedDate) }
              ].map(({ label, value }) => (
                <Grid item xs={12} sm={6} md={3} key={label}>
                  <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                    {label}
                  </Typography>
                  <Typography variant='body2' sx={{ fontWeight: 500 }}>
                    {value || '-'}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            {profile.taskCodes?.length > 0 && (
              <>
                <Divider sx={{ my: 4 }} />
                <Typography variant='caption' sx={{ color: 'text.disabled', display: 'block', mb: 2 }}>
                  Task Codes
                </Typography>
                <Stack direction='row' spacing={2} flexWrap='wrap' useFlexGap>
                  {profile.taskCodes.map(code => (
                    <Chip key={code} label={code} size='small' variant='outlined' />
                  ))}
                </Stack>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Page

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'profile-page'
}