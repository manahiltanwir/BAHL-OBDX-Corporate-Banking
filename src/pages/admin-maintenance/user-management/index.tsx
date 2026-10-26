'use client'

import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Card, Grid, Typography } from '@mui/material'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import SearchIcon from '@mui/icons-material/Search'
import Link from 'next/link'
import LoadingButton from '@mui/lab/LoadingButton'
import { useAdminUserManagement } from 'src/@core/hooks/apps/useAdminUserManagement'
import { AdminUserManagementForm } from 'src/types/apps/adminUserManagement'
import { InputField } from 'src/@core/components/form'
import Table from 'src/@core/components/apps/admin-user-management/Table'
import { clearAction } from 'src/store/apps/admin-user-management'

const StyledSearchCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3.75),
  borderRadius: theme.shape.borderRadius * 1.75,
  boxShadow: theme.shadows[2],
  marginBottom: 10
}))

const searchFields = [
  { name: 'username', label: 'User Name', type: 'text' },
  { name: 'firstName', label: 'First Name', type: 'text' },
  { name: 'lastName', label: 'Last Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'mobileNumber', label: 'Mobile Number', type: 'number' },
  // { name: 'userId', label: 'User ID', type: 'text' }
]

const Page = () => {
  const {
    form: { control, handleSubmit, reset, setError },
    getUsers,
    store,
    setClickedModule,
    dispatch
  } = useAdminUserManagement(null)

  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    return () => {
      dispatch(clearAction({ id: '1' }))
    }
  }, [])

  const handleClear = () => {
    reset()
    setHasSearched(false)
    dispatch(clearAction({ id: '1' }))
  }

  const onSubmit = (data: AdminUserManagementForm) => {
    const hasAtLeastOneField = Object.values(data).some(
      value => value !== null && value !== undefined && value.toString().trim() !== ''
    )

    if (!hasAtLeastOneField) {
      setError('username', { type: 'manual', message: 'At least one field is mandatory.' }, { shouldFocus: true })

      return
    }

    const { userType, ...rest } = data as any

    getUsers({ ...rest, cnic: '' }).then(() => setHasSearched(true))
  }

  return (
    <Grid container spacing={6}>
      {/* Header */}
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
          <Link href={'/admin-maintenance/user-management/add-user'}>
            <LoadingButton variant='contained' loadingPosition='end' startIcon={<PersonAddAltIcon />}>
              Create User
            </LoadingButton>
          </Link>
        </Box>
      </Grid>

      {/* Search */}
      <Grid item xs={12}>
        <StyledSearchCard>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant='h6' sx={{ fontWeight: 600, mb: 3 }}>
              Search User
            </Typography>
            <Grid container spacing={3}>
              {searchFields.map(field => (
                <Grid item xs={12} sm={6} md={3} key={field.name}>
                  <InputField
                    name={field.name}
                    label={field.label}
                    placeholder={`Enter ${field.label}`}
                    type={field.type as any}
                    control={control}
                    size='small'
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 4, flexWrap: 'wrap' }}>
              <LoadingButton
                variant='contained'
                startIcon={<SearchIcon fontSize='small' />}
                type='submit'
                loading={store.status === 'pending'}
              >
                Search
              </LoadingButton>

              <LoadingButton variant='outlined' onClick={handleClear}>
                Clear
              </LoadingButton>
            </Box>
          </form>
        </StyledSearchCard>

        {/* Results */}
        {store.entities.length ? (
          <Table setClickedModule={setClickedModule} />
        ) : hasSearched && store.status !== 'pending' ? (
          <Typography variant='body2' color='text.secondary' sx={{ p: 4, textAlign: 'center' }}>
            No users found for the given search criteria.
          </Typography>
        ) : null}
      </Grid>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'admin-maintenance-user-management-page'
}

export default Page