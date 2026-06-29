// ** MUI Imports
import { Theme } from '@mui/material/styles'

const Drawer = (theme: Theme) => {
  return {
    MuiDrawer: {
      styleOverrides: {
        root: {
          border: 0,
          color: theme.palette.text.primary
        }
      }
    }
  }
}

export default Drawer
