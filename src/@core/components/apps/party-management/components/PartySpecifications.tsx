import { Box, Chip, Typography } from "@mui/material";
import { StyledHighlightValue, StyledInfoValue, StyledPanelHeader } from "./styled-components";
import LoadingButton from "@mui/lab/LoadingButton";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import { usePartyManagement } from "src/@core/hooks/apps/usePartyManagement";

interface Props {
    isCreatingNew: boolean
    handleEdit: () => void
    handleSavePreferences: () => void
}

const PartySpecifications = ({ isCreatingNew, handleEdit, handleSavePreferences }: Props) => {

    const { store } = usePartyManagement(null)
    const alreadyExist = !!store.entity?.alreadyExist
    const isLoading = store.status === 'pending'

    return (
        <>
            <Box>
                <StyledPanelHeader>
                    <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                        Party Specifications
                    </Typography>
                    <Chip
                        label={isCreatingNew || !alreadyExist ? 'New Record' : 'Verified Record'}
                        size='small'
                        sx={{ fontWeight: 700, fontSize: '0.6875rem', textTransform: 'uppercase' }}
                    />
                </StyledPanelHeader>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25, mb: 3 }}>
                    <Box>
                        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                            Party Identification Number
                        </Typography>
                        <StyledHighlightValue>{'partyId' in store.entity && store.entity.partyId}</StyledHighlightValue>
                    </Box>
                    <Box>
                        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                            Registered Legal Name
                        </Typography>
                        <StyledInfoValue>{'partyName' in store.entity && store.entity.partyName}</StyledInfoValue>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto' }}>
                <LoadingButton
                    variant='contained'
                    loading={isLoading}
                    loadingPosition='end'
                    startIcon={alreadyExist ? <EditOutlinedIcon /> : <SaveOutlinedIcon />}
                    onClick={alreadyExist ? handleEdit : handleSavePreferences}
                    sx={{ height: 52, minWidth: 160, fontSize: 12 }}
                >
                    {alreadyExist ? 'Modify Details' : 'Save'}
                </LoadingButton>
            </Box>
        </>
    )
}

export default PartySpecifications;