import { AccordionDetails, AccordionSummary, Box, Button, Typography } from "@mui/material"
import { StyledAccordion, StyledReadOnlyField } from "./styled-components"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { usePartyManagement } from "src/@core/hooks/apps/usePartyManagement"

interface Props {
    handleSavePreferences: () => void;
    handleCancelEdit: () => void;
    handleBack: () => void;
}

const PartyDetails = ({ handleBack, handleCancelEdit, handleSavePreferences }: Props) => {

    const { store } = usePartyManagement(null)

    return (
        <>
            <Box>
                <Typography
                    variant='subtitle1'
                    sx={{ fontWeight: 700, mb: 1.5, pb: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}
                >
                    Details
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 1 }}>
                    <StyledReadOnlyField fullWidth label='Party ID' size='small' value={store.entity.partyId} disabled />
                    <StyledReadOnlyField fullWidth label='Party Name' size='small' value={store.entity.partyName} disabled />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                    <StyledAccordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>Cumulative Limits</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                                Cumulative limit configuration goes here.
                            </Typography>
                        </AccordionDetails>
                    </StyledAccordion>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                <Button variant='contained' onClick={handleSavePreferences}>
                    Save
                </Button>
                <Button variant='contained' onClick={handleCancelEdit}>
                    Cancel
                </Button>
                <Button variant='outlined' color='inherit' onClick={handleBack}>
                    Back
                </Button>
            </Box>
        </>
    )
}

export default PartyDetails;