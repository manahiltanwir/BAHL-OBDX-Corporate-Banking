import * as React from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** Third Party Imports
import { useCategory } from 'src/@core/hooks/apps/useCategory'

// ** import form support components
import { InputField, Select } from 'src/@core/components/form'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

// ** Types Imports
import { CircularProgress, Grid, MenuItem } from '@mui/material'
import { DrawerHeader } from 'src/@core/components/common/DrawerHeader'
import { DrawerFooter } from 'src/@core/components/common/DrawerFooter'

interface Props {
    serviceId: string | null;
    onClose?: () => void;
}

const Form: React.FC<Props> = ({ serviceId, onClose }) => {

    // ** Hooks
    const {
        form: {
            control,
            reset,
            handleSubmit,
            formState: { errors },
            setValue
        },
        addCategory,
        updateCategory,
        store
    } = useCategory(serviceId)

    const onSubmit = async (data: any) => {
        data.order = parseInt(data.order)
        if (serviceId) {
            await updateCategory(serviceId, data)
        } else {
            await addCategory(data)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
        </form>
    )
}

export default Form
