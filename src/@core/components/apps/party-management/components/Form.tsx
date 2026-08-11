import { Box, Grid, Typography } from "@mui/material";
import { StyledSearchCard } from "./styled-components";
import { InputField } from "src/@core/components/form";
import LoadingButton from "@mui/lab/LoadingButton";
import { Control, UseFormHandleSubmit } from "react-hook-form";
import { PartyManagementForm } from "src/types/apps/partyManagement";

interface Props {
    control: Control<PartyManagementForm, any>
    handleSubmit: UseFormHandleSubmit<PartyManagementForm>
    onSubmit: (data: PartyManagementForm) => void
}

const Form = ({ control, handleSubmit, onSubmit }: Props) => {
    return (
        <Grid item xs={12}>
            <StyledSearchCard>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 1, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                        <InputField
                            name='partyId'
                            label='Search By Party Id'
                            placeholder='Enter Party ID (e.g., PRT-9921)...'
                            type='text'
                            control={control} />
                        <LoadingButton
                            variant='contained'
                            size='small'
                            loadingPosition='end'
                            sx={{ height: 52, minWidth: 160, fontSize: 12 }}
                            type='submit'
                        >
                            Search Record
                        </LoadingButton>
                    </Box>
                </form>
            </StyledSearchCard>
        </Grid>
    )
}

export default Form;