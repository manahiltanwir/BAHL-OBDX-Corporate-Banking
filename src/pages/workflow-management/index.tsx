import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import {
    Box,
    Button,
    Card,
    Grid,
    MenuItem,
    Tab,
    Tabs,
    InputAdornment,
    TextField,
    Typography
} from '@mui/material'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import SearchIcon from '@mui/icons-material/Search'
import Table from 'src/@core/components/apps/user-management/Table'
import Link from 'next/link'
import LoadingButton from '@mui/lab/LoadingButton'



type RoleTab = 'maker' | 'checker' | 'viewer'






const StyledSearchCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3.75),
    borderRadius: theme.shape.borderRadius * 1.75,
    boxShadow: theme.shadows[2]
}))


const Page = () => {
    const [partyIdInput, setPartyIdInput] = useState('')
    const [searchError, setSearchError] = useState(false)
    const [hasSearched, setHasSearched] = useState(false) 


    const handleSearch = () => {
        if (!partyIdInput.trim()) {
            setSearchError(true)
            setHasSearched(false)

            return
        }

        setSearchError(false)
        setHasSearched(true)
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
                        A centralized dashboard to create, update, and manage user accounts and permissions.
                    </Typography>
                    <Link href={'/workflow-management/add-workflow'}>
                        <LoadingButton
                            variant='contained'
                            loadingPosition='end'
                            startIcon={<PersonAddAltIcon />}
                        >
                            Create Workflow
                        </LoadingButton>
                    </Link>
                </Box>
            </Grid>

            {/* Search Engine */}
            <Grid item xs={12}>
                <StyledSearchCard>
                    <Typography
                        variant='caption'
                        sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                    >
                        Search With Party ID
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 1, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                        <TextField
                            fullWidth
                            placeholder='Enter Party ID (e.g., PRT-9921)...'
                            value={partyIdInput}
                            onChange={e => setPartyIdInput(e.target.value)}
                            error={searchError}
                            helperText={searchError ? 'Please provide a valid Party ID to look up.' : ' '}
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
                    <Table />
                </Grid>
            )}

        </Grid>
    )
}

Page.acl = {
    action: 'itsHaveAccess',
    subject: 'workflow-management'
}

export default Page