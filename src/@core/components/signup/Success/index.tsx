// ** React Imports
import { Fragment } from 'react'

// // ** Next Imports
import Link from 'next/link'

// ** MUI Components
import LoadingButton from '@mui/material'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

// ** custom hooks
// import { useCompany } from 'src/@core/hooks/form/useCompany'
import { useAuth } from 'src/hooks/useAuth'

const SuccessMsg = ({ step }: { step: number }) => {
  return (
    <Fragment key={step}>
      <Grid container spacing={8}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link href={'/login'}>
            <Button fullWidth size='large' variant='contained'>
              Return to login
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default SuccessMsg
