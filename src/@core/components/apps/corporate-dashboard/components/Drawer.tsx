import * as React from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** Third Party Imports
import { useCategory } from 'src/@core/hooks/apps/useCategory'

import Form from 'src/@core/components/apps/category/components/Form'

// ** import form support components
import { InputField, Select } from 'src/@core/components/form'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

// ** Types Imports
import { CircularProgress, Grid, MenuItem } from '@mui/material'
import { DrawerHeader } from 'src/@core/components/common/DrawerHeader'
import { DrawerFooter } from 'src/@core/components/common/DrawerFooter'


interface SidebarAddUserType {
  open: boolean
  toggle: () => void
  serviceId: string | null
}

const ExampleDrawer = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle, serviceId } = props


  const handleClose = () => {
    // reset()
    toggle()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: false }}
      sx={{ '& .MuiDrawer-paper': { width: 700 } }}
    >
      <DrawerHeader>
        <Typography variant='h6'>{!serviceId ? 'Add Category' : 'Update Category'}</Typography>
        <Close fontSize='small' onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </DrawerHeader>
      <Form serviceId={serviceId} />
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 5 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <InputField name='title' label='Title' placeholder='Title' type='text' control={control} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputField name='name' label='Name' placeholder='Name' type='text' control={control} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputField name='order' label='order' placeholder='Enter order' type='number' control={control} />
            </Grid>
          </Grid>
        </Box>
        <DrawerFooter sx={{ position: 'absolute', bottom: '0', width: '100%' }}>
          <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            sx={{ mr: 3 }}
            loading={store.status === 'pending'}
            disabled={store.status === 'pending'}
            loadingPosition='end'
            size='large'
            variant='contained'
            type='submit'
            endIcon={store.status === "pending" && <CircularProgress size={20} />}
          >
            Submit
          </LoadingButton>
        </DrawerFooter>
      </form> */}
    </Drawer>
  )
}

export default ExampleDrawer
