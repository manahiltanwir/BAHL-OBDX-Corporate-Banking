import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled, alpha, useTheme } from '@mui/material/styles'
import { Box, Button, Card, CircularProgress, Divider, Grid, TextField, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import LoadingButton from '@mui/lab/LoadingButton'
import type { FtBeneficiaryInput, OfttBeneficiaryInput } from '../add-beneficiary'

// -----------------------------------------------------------------------------
// Mock lookups — replace with real API calls when wiring up the backend.
// -----------------------------------------------------------------------------

// Simulates the bank's own account directory used to resolve a name from an
// account number for same-bank (FT) transfers.
const mockBankAlHabibDirectory: Record<string, string> = {
    '1001001': 'Syed Muhammad Abbas',
    'PK27BAHL6002098102054201': 'Ali Raza',
    'PK27BAHL6002098102054208': 'Sara Khan',
    'PK27BAHL6002098102054209': 'Ahmed Hussain'
}

const verifyBankAlHabibAccount = (accountNumber: string): Promise<{ name: string } | null> => {
    const normalized = accountNumber.trim().toUpperCase()

    return new Promise(resolve => {
        setTimeout(() => {
            const name = mockBankAlHabibDirectory[normalized]
            resolve(name ? { name } : null)
        }, 900) // simulated network delay
    })
}

const countryLabels: Record<string, string> = {
    pk: 'Pakistan',
    ae: 'United Arab Emirates',
    sa: 'Saudi Arabia',
    uk: 'United Kingdom',
    us: 'United States'
}

const purposeLabels: Record<string, string> = {
    'family-support': 'Family Maintenance / Support',
    education: 'Education',
    medical: 'Medical Treatment',
    business: 'Business Payment',
    gift: 'Gift',
    other: 'Other'
}

const relationshipLabels: Record<string, string> = {
    brother: 'Brother',
    sister: 'Sister',
    father: 'Father',
    mother: 'Mother',
    son: 'Son',
    daughter: 'Daughter',
    spouse: 'Spouse',
    friend: 'Friend',
    'business-partner': 'Business Partner',
    other: 'Other'
}

// -----------------------------------------------------------------------------
// Styled bits
// -----------------------------------------------------------------------------

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
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
}))

const ReviewRow = ({ label, value }: { label: string; value?: string }) => {
    if (!value) return null

    return (
        <Grid item xs={12} sm={6}>
            <Typography variant='caption' color='text.secondary' sx={{ display: 'block' }}>
                {label}
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>{value}</Typography>
        </Grid>
    )
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

type ParsedInput = FtBeneficiaryInput | OfttBeneficiaryInput

const Page = () => {
    const router = useRouter()
    const theme = useTheme()

    const [input, setInput] = useState<ParsedInput | null>(null)
    const returnTo = typeof router.query.returnTo === 'string' ? router.query.returnTo : undefined

    // FT-specific verification state
    const [verifying, setVerifying] = useState(false)
    const [verifiedName, setVerifiedName] = useState<string | null>(null)
    const [notFound, setNotFound] = useState(false)

    const [confirming, setConfirming] = useState(false)
    const [nickname, setNickname] = useState('')

    useEffect(() => {
        if (!router.isReady) return

        const { data } = router.query

        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(decodeURIComponent(data)) as ParsedInput
                setInput(parsed)
            } catch {
                setInput(null)
            }
        }
    }, [router.isReady, router.query])

    // Run FT verification as soon as we have the input
    useEffect(() => {
        if (!input || input.type !== 'ft') return

        let cancelled = false
        setVerifying(true)
        setNotFound(false)

        verifyBankAlHabibAccount(input.accountNumber).then(result => {
            if (cancelled) return
            setVerifying(false)

            if (result) {
                setVerifiedName(result.name)
            } else {
                setNotFound(true)
            }
        })

        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input])

    const handleEdit = () => router.back()

    const buildSuccessQuery = (finalName: string) => {
        if (!input) return {}

        const successPayload =
            input.type === 'ft'
                ? { type: 'ft', bank: input.bank, accountNumber: input.accountNumber, name: finalName, nickname: nickname.trim() }
                : { ...input, name: finalName, nickname: nickname.trim() }

        return {
            data: encodeURIComponent(JSON.stringify(successPayload)),
            ...(returnTo ? { returnTo } : {})
        }
    }

    const handleConfirm = async () => {
        if (!input) return

        setConfirming(true)

        // Simulate the "add beneficiary" API call
        await new Promise(resolve => setTimeout(resolve, 700))

        setConfirming(false)

        const finalName = input.type === 'ft' ? verifiedName ?? '' : input.name

        router.push({
            pathname: '/Corporate-InnerPages/beneficiary-management/add-beneficiary-success',
            query: buildSuccessQuery(finalName)
        })
    }

    if (!input) return null

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Button startIcon={<ArrowBackIcon fontSize='small' />} onClick={handleEdit} sx={{ color: 'text.secondary' }}>
                        Back
                    </Button>
                    <Typography variant='h5' sx={{ fontWeight: 700 }}>
                        Review Beneficiary
                    </Typography>
                </Box>
            </Grid>

            {/* ---------------- FT: verifying / result ---------------- */}
            {input.type === 'ft' && (
                <Grid item xs={12}>
                    <StyledFormCard>
                        {verifying && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                                <CircularProgress size={22} />
                                <Typography color='text.secondary'>Verifying account number with Bank Al Habib…</Typography>
                            </Box>
                        )}

                        {!verifying && notFound && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                                <ErrorOutlineIcon color='error' />
                                <Box>
                                    <Typography sx={{ fontWeight: 600 }} color='error.main'>
                                        No Bank Al Habib account found with this number
                                    </Typography>
                                    <Typography variant='body2' color='text.secondary'>
                                        Please go back and double-check the account number.
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {!verifying && !notFound && verifiedName && (
                            <>
                                <StyledSectionTitle>
                                    <PersonOutlineIcon sx={{ fontSize: 18 }} />
                                    Confirm Beneficiary
                                </StyledSectionTitle>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        p: 2.5,
                                        borderRadius: 1.5,
                                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                        mb: 3
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: '50%',
                                            bgcolor: 'primary.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}
                                    >
                                        <PersonOutlineIcon sx={{ color: '#fff' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant='caption' color='text.secondary'>
                                            Account verified — beneficiary name
                                        </Typography>
                                        <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                            {verifiedName}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Grid container spacing={3}>
                                    <ReviewRow label='Bank' value={input.bank} />
                                    <ReviewRow label='Account Number' value={input.accountNumber} />
                                </Grid>
                            </>
                        )}
                    </StyledFormCard>
                </Grid>
            )}

            {/* ---------------- OFTT: full summary ---------------- */}
            {input.type === 'oftt' && (
                <Grid item xs={12}>
                    <StyledFormCard>
                        <StyledSectionTitle>
                            <PersonOutlineIcon sx={{ fontSize: 18 }} />
                            Confirm Beneficiary — {input.name}
                        </StyledSectionTitle>

                        <Grid container spacing={3}>
                            <ReviewRow label='Bank' value={input.bank} />
                            <ReviewRow label='Account Number / IBAN' value={input.accountNumber} />
                            <ReviewRow label='Beneficiary Name' value={input.name} />
                            <ReviewRow label='Country' value={countryLabels[input.country] ?? input.country} />
                            <ReviewRow label='Purpose' value={purposeLabels[input.purpose] ?? input.purpose} />
                            <ReviewRow label='Relationship' value={relationshipLabels[input.relationship] ?? input.relationship} />

                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                            </Grid>

                            <ReviewRow label='Department' value={input.department} />
                            <ReviewRow label='Sub-Department' value={input.subDepartment} />
                            <ReviewRow label='Street Name' value={input.streetName} />
                            <ReviewRow label='Building Number' value={input.buildingNumber} />
                            <ReviewRow label='Building Name' value={input.buildingName} />
                            <ReviewRow label='Floor' value={input.floor} />
                            <ReviewRow label='Post Box' value={input.postBox} />
                            <ReviewRow label='Room' value={input.room} />
                            <ReviewRow label='Post Code' value={input.postCode} />
                            <ReviewRow label='Town Name' value={input.townName} />
                            <ReviewRow label='Town Location Name' value={input.townLocationName} />
                            <ReviewRow label='District Name' value={input.districtName} />
                            <ReviewRow label='Country Subdivision' value={input.countrySubdivision} />
                        </Grid>
                    </StyledFormCard>
                </Grid>
            )}

            {/* ---------------- Nickname (optional, editable here) ---------------- */}
            {(input.type === 'oftt' || (input.type === 'ft' && !verifying && !notFound)) && (
                <Grid item xs={12}>
                    <StyledFormCard>
                        <StyledSectionTitle>
                            <PersonOutlineIcon sx={{ fontSize: 18 }} />
                            Give This Beneficiary a Nickname
                        </StyledSectionTitle>

                        <TextField
                            fullWidth
                            size='small'
                            label='Nickname (optional)'
                            placeholder='e.g. Mom, Office Rent, Ali Bhai'
                            value={nickname}
                            onChange={event => setNickname(event.target.value)}
                            inputProps={{ maxLength: 35 }}
                            helperText="Makes it easier to spot this beneficiary later — you'll see this nickname alongside the account when selecting a beneficiary for future transfers."
                        />
                    </StyledFormCard>
                </Grid>
            )}

            {/* ---------------- Actions ---------------- */}
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
                    <Button variant='outlined' sx={{ borderColor: 'divider', color: 'text.primary' }} onClick={handleEdit}>
                        Edit
                    </Button>
                    <LoadingButton
                        variant='contained'
                        loading={confirming}
                        disabled={input.type === 'ft' && (verifying || notFound)}
                        onClick={handleConfirm}
                    >
                        Confirm &amp; Add Beneficiary
                    </LoadingButton>
                </Box>
            </Grid>
        </Grid>
    )
}

Page.acl = { action: 'itsHaveAccess', subject: 'add-beneficiary' }

export default Page