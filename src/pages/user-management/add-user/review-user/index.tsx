import React, { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import { Avatar, Box, Button, Card, Chip, Divider, Grid, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import LoadingButton from '@mui/lab/LoadingButton'
import ApartmentIcon from '@mui/icons-material/Apartment'
import { useUserManagement } from 'src/@core/hooks/apps/useUserManagement'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { usePartyManagement } from 'src/@core/hooks/apps/usePartyManagement'
import { formatDate } from 'src/@core/utils/format'

const ADD_USER_REVIEW_STORAGE_KEY = 'addUserReviewData'

type ReviewFieldData = {
  label: string
  value: string
}

type ReviewSectionData = {
  title: string
  fields: ReviewFieldData[]
}

type ReviewPayload = {
  sections: ReviewSectionData[]
  roles: string[]
}
const looksNumeric = (value: string) => /\d/.test(value) && value.replace(/[^0-9]/g, '').length / value.length > 0.3

const StyledPage = styled(Box)(({ theme }) => ({
  minHeight: '100%',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  }
}))

const LedgerCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 14,
  boxShadow: '0 1px 2px rgba(11, 31, 58, 0.04)',
  padding: theme.spacing(4, 4, 3.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2.5, 2.5)
  }
}))

const SectionIndex = styled(Typography)({
  position: 'absolute',
  top: -6,
  right: 20,
  fontFamily: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '4.5rem',
  fontWeight: 700,
  color: 'rgba(11, 31, 58, 0.05)',
  lineHeight: 1,
  userSelect: 'none',
  pointerEvents: 'none'
})

const StyledSectionTitle = styled(Typography)({
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '1.1px',
  fontWeight: 700
})

const FieldValue = styled(Typography)<{ component?: React.ElementType }>(() => ({
  fontWeight: 600,
  wordBreak: 'break-word'
}))

const StyledFormCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4.25),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2]
}))

// const StyledSectionTitle = styled(Typography)(({ theme }) => ({
//   fontSize: '0.8125rem',
//   textTransform: 'uppercase',
//   letterSpacing: '0.75px',
//   color: theme.palette.text.secondary,
//   fontWeight: 700,
//   marginBottom: theme.spacing(3)
// }))

const StyledPartyLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: theme.palette.text.secondary,
  marginBottom: 2
}))

// Single label + value line, laid out like an entry on a statement.
const ReviewField = ({ label, value }: ReviewFieldData) => {
  const hasValue = value && value.trim() !== ''

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant='caption' sx={{ display: 'block', mb: 0.5, letterSpacing: '0.2px' }}>
        {label}
      </Typography>
      <FieldValue
        variant='body1'
        sx={{
          fontFamily:
            hasValue && looksNumeric(value)
              ? '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace'
              : 'inherit',
          fontSize: hasValue && looksNumeric(value) ? '0.95rem' : '1rem',
          color: '#15804f'
        }}
      >
        {hasValue ? value : '—'}
      </FieldValue>
    </Grid>
  )
}

const DataField = ({ label, value, ...gridProps }: any) => (
  <Grid item xs={12} sm={6} md={4} {...gridProps}>
    <Typography
      variant="caption"
      sx={{ display: "block", mb: 0.5, letterSpacing: "0.2px" }}
    >
      {label}
    </Typography>
    <FieldValue
      variant="body1"
      sx={{
        fontFamily: "inherit",
        fontSize: "1rem",
        color: "#15804f",
      }}
    >
      {value}
    </FieldValue>
  </Grid>
);



const Page = () => {
  const router = useRouter()
  const [data, setData] = useState<ReviewPayload | null>(null)

  const { setAddUserData, addUserData, addUser } = useUserManagement(null)

  const { store: partyStore } = usePartyManagement(null)

  const [submitting, setSubmitting] = useState(false)


  // console.log(router.query);


  useEffect(() => {
    if (router.isReady) {
      const queryData = { ...router.query }
      if (typeof queryData.roles === 'string') {
        try {
          queryData.roles = JSON.parse(queryData.roles)
          setAddUserData(queryData)
        } catch (error) {
          console.log('failed to parse roles');

        }
      }
    }
    // if (typeof window === 'undefined') return

    // const raw = window.sessionStorage.getItem(ADD_USER_REVIEW_STORAGE_KEY)

    // if (raw) {
    //   try {
    //     const parsed = JSON.parse(raw)

    //     const isValid = parsed && Array.isArray(parsed.sections) && Array.isArray(parsed.roles)

    //     setData(isValid ? parsed : null)
    //     // setData(addUserData)
    //   } catch (e) {
    //     setData(null)
    //   }
    // }
  }, [router.isReady, router.query])

  const handleCancel = () => {
    router.push('/user-management/add-user')
  }

  const handleSubmit = async () => {

    const addressLines = [addUserData?.addressLineOne, addUserData?.addressLineTwo, addUserData?.addressLineThree, addUserData?.addressLineFour]

    const combinedAddress = addressLines.map((ele) => ele ? ele.trim() : '').filter(Boolean).join(', ')

    const formattedTitle = addUserData?.title ? addUserData?.title.charAt(0).toUpperCase() + addUserData?.title?.slice(1).toLowerCase() : '';

    const activeRoles = addUserData?.roles ? Object.keys(addUserData?.roles).filter((ele: any) => addUserData?.roles[ele] == true) : []

    const data:any = {
      userProfileDTO: {
        email: addUserData.email,
        mobileNumber: addUserData.mobileNumber,
        cnic: addUserData.cnic,
        passport: addUserData.passport,
        title: formattedTitle,
        firstName: addUserData.firstName,
        middleName: addUserData.middleName,
        lastName: addUserData.lastName,
        dob: addUserData.dob,
        address: combinedAddress,
        city: addUserData.city,
        country: addUserData.country,
        postalCode: addUserData.zipCode
      },
      userDTO: {
        username: addUserData.username
      },
      userRoles: activeRoles,
      userParties: [{
        partyId: partyStore?.entity?.partyId
      }]
    }

    addUser(data)

  }

  if (!addUserData) {
    return (
      <StyledPage>
        <Grid container spacing={6} justifyContent='center'>
          <Grid item xs={12} md={6}>
            <LedgerCard sx={{ textAlign: 'center', py: 6 }}>
              <ShieldOutlinedIcon sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>
                Nothing to review yet
              </Typography>
              <Typography variant='body2' sx={{ mb: 3 }}>
                Complete the onboarding form first — the applicant's details will appear here for final approval.
              </Typography>
              <Button startIcon={<ArrowBackIcon fontSize='small' />} variant='contained' onClick={handleCancel}>
                Go to onboarding form
              </Button>
            </LedgerCard>
          </Grid>
        </Grid>
      </StyledPage>
    )
  }

  // const totalFields = data.sections.reduce((sum, s) => sum + s.fields.length, 0)

  return (
    <StyledPage>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant='h5' sx={{ fontWeight: 700, mt: 0.5, textAlign: 'center' }}>
            Review before activation
          </Typography>
        </Grid>

        <Grid item xs={12}>
          {/* Section 01: Party Information */}
          {(partyStore?.entity?.partyId || partyStore?.entity?.partyName) && (
            <LedgerCard sx={{ mb: 5 }}>
              <SectionIndex>01</SectionIndex>
              <Stack direction={'row'} alignItems={'center'} spacing={1} sx={{ mb: 3 }}>
                <StyledSectionTitle>Party Information</StyledSectionTitle>
              </Stack>
              <Grid container spacing={3}>
                {partyStore?.entity?.partyId && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant='caption' sx={{ display: 'block', mb: 0.5, letterSpacing: '0.2px' }}>
                      Party ID
                    </Typography>
                    <FieldValue variant='body1' sx={{ fontFamily: 'inherit', fontSize: '1rem', color: '#15804f' }}>
                      {partyStore.entity.partyId}
                    </FieldValue>
                  </Grid>
                )}
                {partyStore?.entity?.partyName && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant='caption' sx={{ display: 'block', mb: 0.5, letterSpacing: '0.2px' }}>
                      Party Name
                    </Typography>
                    <FieldValue variant='body1' sx={{ fontFamily: 'inherit', fontSize: '1rem', color: '#15804f' }}>
                      {partyStore.entity.partyName}
                    </FieldValue>
                  </Grid>
                )}
              </Grid>
            </LedgerCard>
          )}

          {/* Section 02: Personal Information */}
          <LedgerCard sx={{ mb: 5 }}>
            <SectionIndex>02</SectionIndex>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <StyledSectionTitle>Personal Information</StyledSectionTitle>
            </Stack>
            <Grid container spacing={3} sx={{ mb: 5 }}>
              <DataField label="User Name" value={addUserData?.username} />
              <DataField label="Title" value={addUserData?.title} />
              <DataField label="First Name" value={addUserData?.firstName} />
              <DataField label="Middle Name" value={addUserData?.middleName} />
              <DataField label="Last Name" value={addUserData?.lastName} />
              {/* Added a conditional check for dob before formatting to avoid errors */}
              <DataField label="Date of Birth" value={addUserData?.dob ? formatDate(addUserData.dob) : ""} />
              <DataField label="Passport No" value={addUserData?.passport} />
              <DataField label="CNIC" value={addUserData?.cnic} />
            </Grid>
          </LedgerCard>

          {/* Section 03: Contact Details */}
          <LedgerCard sx={{ mb: 5 }}>
            <SectionIndex>03</SectionIndex>
            <Stack direction={'row'} alignItems={'center'} spacing={1} sx={{ mb: 3 }}>
              <StyledSectionTitle>Contact Details</StyledSectionTitle>
            </Stack>
            <Grid container spacing={3} sx={{ mb: 5 }}>
              <DataField label="Email ID" value={addUserData?.email} />
              <DataField label="Contact Number (Mobile)" value={addUserData?.mobileNumber} />
              <DataField label="Contact No Landline" value={addUserData?.landlineNumber} />
              <DataField label="Address Line 1" value={addUserData?.addressLineOne} />
              <DataField label="Address Line 2" value={addUserData?.addressLineTwo} />
              <DataField label="Address Line 3" value={addUserData?.addressLineThree} />
              <DataField label="Address Line 4" value={addUserData?.addressLineFour} />
              <DataField label="Country" value={addUserData?.country} />
              <DataField label="City" value={addUserData?.city} />
              <DataField label="Zip Code" value={addUserData?.zipCode} />
            </Grid>
          </LedgerCard>

          {/* Section 04: Limits & Roles */}
          <LedgerCard sx={{ mb: 5 }}>
            <SectionIndex>04</SectionIndex>
            <Stack direction={'row'} alignItems={'center'} spacing={1} sx={{ mb: 3 }}>
              <StyledSectionTitle>Limits & Roles</StyledSectionTitle>
            </Stack>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={12} mb={5}>
                <DataField label="Limit" value={addUserData?.limit} />

                {/* Only show the Roles block if there are valid active roles */}
                {addUserData?.roles && Object.values(addUserData.roles).some(Boolean) && (
                  <Box sx={{ mt: 3.5, pt: 3, borderTop: '1px solid' }}>
                    <Typography variant='body2' sx={{ fontWeight: 700, mb: 1.5 }}>
                      Roles
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
                      {Object.entries(addUserData.roles)
                        .filter(([_, isActive]) => isActive)
                        .map(([roleKey]) => {
                          const formattedLabel = roleKey
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase());
                          return (
                            <Chip
                              key={roleKey}
                              icon={<CheckCircleIcon sx={{ color: `#15804f !important`, fontSize: 16 }} />}
                              label={formattedLabel}
                              size="small"
                              sx={{
                                color: "#15804f",
                                fontWeight: 600,
                                border: "none",
                                "& .MuiChip-label": { px: 1 },
                                p: 1,
                              }}
                            />
                          );
                        })}
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          </LedgerCard>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column-reverse', sm: 'row' },
              alignItems: { sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              pt: 1
            }}
          >
            <Typography variant='caption' sx={{ maxWidth: 420 }}>
              By submitting, you confirm the details above are accurate and the applicant has consented to onboarding checks.
            </Typography>

            <Stack direction='row' spacing={1.5} sx={{ display: 'flex', gap: 1.5 }}>
              <LoadingButton variant='outlined' loadingPosition='end' onClick={handleCancel} disabled={submitting}>
                Cancel
              </LoadingButton>

              <LoadingButton variant='contained' loadingPosition='end' loading={submitting} onClick={handleSubmit}>
                Approve &amp; submit
              </LoadingButton>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </StyledPage>
  );

}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'review-user-page'
}

export default Page