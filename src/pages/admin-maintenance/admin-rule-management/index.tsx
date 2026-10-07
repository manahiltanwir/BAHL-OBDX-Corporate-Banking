import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Card, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import SearchIcon from '@mui/icons-material/Search'
import Link from 'next/link'
import LoadingButton from '@mui/lab/LoadingButton'
import AdminRuleTable from 'src/@core/components/admin-rule-management/AdminRuleTable'
import { ADMIN_RULE_ROUTES } from 'src/@core/components/admin-rule-management/types'
import { useAdminRuleSearch } from 'src/@core/hooks/apps/useAdminRuleManagement'
const StyledSearchCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3.75),
    borderRadius: theme.shape.borderRadius * 1.75,
    boxShadow: theme.shadows[2]
}))

const Page = () => {
    const [ruleIdInput, setRuleIdInput] = useState('')
    const [searchError, setSearchError] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const { rules, status, fallback, searchRules, resetSearch } = useAdminRuleSearch()

    const handleSearch = async () => {
        const value = ruleIdInput.trim()

        if (!value) {
            setSearchError(true)
            setHasSearched(false)
            resetSearch()

            return
        }

        setSearchError(false)
        setHasSearched(true)

        // pehle rule code se, na mile to get-all (slice ke andar)
        await searchRules(value)
    }
    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2
                    }}
                >
                    <Typography variant='h6' sx={{ fontWeight: 200 }}>
                        Create and manage business rules, validation policies, and transaction conditions.
                    </Typography>
                    <Link href={ADMIN_RULE_ROUTES.create}>
                        <LoadingButton variant='contained' loadingPosition='end' startIcon={<PersonAddAltIcon />}>
                            Create Rule
                        </LoadingButton>
                    </Link>
                </Box>
            </Grid>

            <Grid item xs={12}>
                <StyledSearchCard>
                    <Typography
                        variant='caption'
                        sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                    >
                        Search With Rule ID
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 1, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                        <TextField
                            fullWidth
                            placeholder='Enter Rule ID (e.g., RULE001)...'
                            value={ruleIdInput}
                            onChange={e => setRuleIdInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            error={searchError}
                            helperText={searchError ? 'Please provide a valid Rule ID to look up.' : ' '}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <SearchIcon fontSize='small' />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <LoadingButton
                            variant='contained'
                            size='large'
                            loadingPosition='end'
                            onClick={handleSearch}
                            sx={{ height: 52, minWidth: 160, fontSize: 12 }}
                        >
                            Search Record
                        </LoadingButton>
                    </Box>
                </StyledSearchCard>
            </Grid>

            {hasSearched && (
                <Grid item xs={12}>
                    {fallback && status === 'success' && (
                        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                         No rule was found for this Rule ID, which is why all rules are being displayed.
                        </Typography>
                    )}
                    <AdminRuleTable
                        rules={rules}
                        loading={status === 'pending'}
                        error={status === 'error'}
                        editRoute={ADMIN_RULE_ROUTES.create}
                    />
                </Grid>
            )}
        </Grid>
    )
}

Page.acl = {
    action: 'itsHaveAccess',
    subject: 'admin-maintenance-rule-management-page'
}

export default Page