import { Box, Grid, Typography } from "@mui/material"
import { StyledModuleIcon } from "./styled-components"
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'

const HeaderDescription = () => {
    return (
        <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <StyledModuleIcon>
                        <PeopleAltOutlinedIcon />
                    </StyledModuleIcon>
                    <Box>
                        <Typography variant='h6' sx={{ color: 'text.secondary', mt: 0.25 }}>
                            Search, audit, and modify registered business party records.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Grid>
    )
}

export default HeaderDescription