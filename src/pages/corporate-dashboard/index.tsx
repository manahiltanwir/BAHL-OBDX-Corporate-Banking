import React, { useEffect, useState } from 'react'
import CategoryTable from 'src/@core/components/apps/category/components/Table'
import TableHeader from 'src/@core/components/apps/category/components/TableHeader'
import ExampleDrawer from 'src/@core/components/apps/category/components/Drawer'
import SelectOne from 'src/@core/components/apps/category/components/SelectOne'
import SelectMany from 'src/@core/components/apps/category/components/SelectMany'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import DeleteAlert from 'src/@core/components/common/deleteAlert'
import { ModalType } from 'src/types'
import { useCategory } from 'src/@core/hooks/apps/useCategory'
import MultipleInput from 'src/@core/components/common/MultipleInput'
import { useGetPokemonByNameQuery } from 'src/store/apps/category/rtk'
import { Avatar, Box, Card, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material'

const dashboard = () => {

  return (
    <React.Fragment>
      <Grid container spacing={6} className='match-height'>
      {/* <h1>Hello</h1> */}

      </Grid>
    </React.Fragment>
  )
}

dashboard.acl = {
  action: 'itsHaveAccess',
  subject: 'corporate-dashboard-page'
}

export default dashboard
