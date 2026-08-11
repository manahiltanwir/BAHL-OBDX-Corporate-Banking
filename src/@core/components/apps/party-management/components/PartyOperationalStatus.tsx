import { Box, Grid, Switch, Typography } from "@mui/material";
import { StyledAlertBox, StyledControlRow, StyledPanelCard, StyledPanelHeader } from "./styled-components";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { Dispatch, SetStateAction } from "react";

interface Props {
    statusEnabled: boolean;
    isEditing: boolean;
    setStatusEnabled: Dispatch<SetStateAction<boolean>>;
}

const PartyOperationalStatus = ({ statusEnabled, setStatusEnabled, isEditing }: Props) => {
    return (
        <Grid item xs={12} md={5}>
            <StyledPanelCard>
                <Box>
                    <StyledPanelHeader>
                        <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                            Party Enable / Disable
                        </Typography>
                    </StyledPanelHeader>

                    <StyledControlRow>
                        <Box sx={{ maxWidth: 180 }}>
                            <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                Operational Status
                            </Typography>
                            <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                                Toggle to suspend or authorize party actions instantly.
                            </Typography>
                        </Box>
                        <Switch
                            checked={statusEnabled}
                            onChange={e => setStatusEnabled(e.target.checked)}
                            disabled={!isEditing}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#15804f' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#15804f' }
                            }}
                        />
                    </StyledControlRow>
                    <StyledAlertBox>
                        <WarningAmberOutlinedIcon fontSize='small' sx={{ color: '#f0a528', mt: 0.25 }} />
                        <Typography variant='caption' sx={{ color: '#f0a528', lineHeight: 1.5 }}>
                            Changes will affect system validation rules immediately upon saving.
                        </Typography>
                    </StyledAlertBox>
                </Box>
            </StyledPanelCard>
        </Grid>
    )
}

export default PartyOperationalStatus;