import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { getLoginStyles } from '../Login.styles'
import themeConfig from 'src/configs/themeConfig'

const LoginLeftPanel = () => {
  const theme = useTheme()
  const styles = getLoginStyles(theme)

  return (
    <Box sx={styles.leftPanel}>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography sx={styles.heading}>
          Welcome to
          <br />
          {themeConfig.templateName}
        </Typography>
        <Typography sx={styles.description}>
          Experience the next generation of secure digital banking. Your assets, protected by world-class encryption.
        </Typography>
      </Box>
      <Typography sx={styles.footer}>© 2026 {themeConfig.templateName}. All rights reserved.</Typography>
    </Box>
  )
}

export default LoginLeftPanel