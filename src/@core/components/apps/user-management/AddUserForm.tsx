import { Box, Grid, Typography } from "@mui/material";
import { InputField } from "src/@core/components/form";
import { Control, UseFormHandleSubmit } from "react-hook-form";
import { PartyManagementForm } from "src/types/apps/partyManagement";
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from '@mui/icons-material/Search'

interface Props {
    partyInputControl: Control<PartyManagementForm, any>
    partyHandleSubmit: UseFormHandleSubmit<PartyManagementForm>
    onSubmit: (data: PartyManagementForm) => void
    // partySearchStatus : string
}

const AddUserForm = ({ partyInputControl, partyHandleSubmit, onSubmit, }: Props) => {
    return (
        <form onSubmit={partyHandleSubmit(onSubmit)}>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                Search the Party ID this user belongs to. Once found, you'll be able to fill in the user's details
                below.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, }}>
                <InputField
                    name='partyId'
                    label='Search By Party Id'
                    placeholder='Enter Party ID (e.g., PRT-9921)...'
                    type='text'
                    fullWidth
                    control={partyInputControl} />
                <LoadingButton
                    variant='contained'
                    // loading={partySearchStatus === 'searching'}
                    startIcon={<SearchIcon fontSize='small' />}
                    // onClick={handlePartySearch}
                    type='submit'
                >
                    Search Party
                </LoadingButton>
            </Box>
        </form>
    )
}

export default AddUserForm;