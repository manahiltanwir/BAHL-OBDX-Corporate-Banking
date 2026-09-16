// ** React Imports
import { useState, SyntheticEvent, Fragment, ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icons Imports
import BellOutline from 'mdi-material-ui/BellOutline'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'
import { CustomAvatarProps } from 'src/@core/components/mui/avatar/types'

interface Props {
  settings: Settings
}

interface NotificationItem {
  id: string
  name: string // person/entity name -> used to derive avatar initials
  title: string
  subtitle: string
  time: string
}

// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const styles = {
  maxHeight: 344,
  '& .MuiMenuItem-root:last-of-type': {
    border: 0
  }
}

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  ...styles
})

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)<CustomAvatarProps>({
  width: '2.375rem',
  height: '2.375rem',
  fontSize: '1.125rem'
})

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}))

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)<TypographyProps>({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

// ** Helper: derive initials from a name -> first letter of first word + first letter of last word
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// ** Dummy banking notifications
const notifications: NotificationItem[] = [
  {
    id: 'n1',
    name: 'Al-Habib Textiles',
    title: 'LC Advice Issued 📄',
    subtitle: 'ILC-2026-004521 advised — USD 485,000.00',
    time: 'Today'
  },
  {
    id: 'n2',
    name: 'Zaman Steel Industries',
    title: 'Fund Transfer Completed 💸',
    subtitle: 'PKR 1,250,000 transferred to Zaman Steel Industries',
    time: 'Yesterday'
  },
  {
    id: 'n3',
    name: 'Crescent Foods',
    title: 'LC Amendment Request 📝',
    subtitle: 'Amendment pending approval on ILC-2026-004498',
    time: '11 Aug'
  },
  {
    id: 'n4',
    name: 'Hanoi Cotton Mills',
    title: 'Payment Received ✅',
    subtitle: 'USD 212,300.00 credited from Hanoi Cotton Mills JSC',
    time: '25 May'
  },
  {
    id: 'n5',
    name: 'Blue Ocean Chemicals',
    title: 'Document Discrepancy Alert ⚠️',
    subtitle: 'Discrepancy found in shipping docs for ILC-2026-004610',
    time: '19 Mar'
  },
  {
    id: 'n6',
    name: 'Al-Habib Textiles',
    title: 'Account Statement Ready 📊',
    subtitle: 'Monthly statement generated for A/C 1001-172290_PA',
    time: '27 Dec'
  }
]

const NotificationDropdown = (props: Props) => {
  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)

  // ** Hook
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return <Box sx={{ ...styles, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return (
        <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
      )
    }
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <BellOutline />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem disableRipple>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontWeight: 600 }}>Notifications</Typography>
            <CustomChip
              skin='light'
              size='small'
              label={`${notifications.length} New`}
              color='primary'
              sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
            />
          </Box>
        </MenuItem>
        <ScrollWrapper>
          {notifications.map(item => (
            <MenuItem key={item.id} onClick={handleDropdownClose}>
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <Avatar
                  skin='filled'
                  color='primary'
                  sx={{ color: 'common.white', backgroundColor: 'primary.main', fontWeight: 200 }}
                >
                  {getInitials(item.name)}
                </Avatar>
                <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                  <MenuItemTitle>{item.title}</MenuItemTitle>
                  <MenuItemSubtitle variant='body2'>{item.subtitle}</MenuItemSubtitle>
                </Box>
                <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                  {item.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </ScrollWrapper>

        <MenuItem
          disableRipple
          sx={{ py: 3.5, borderBottom: 0, borderTop: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Button fullWidth variant='contained' onClick={handleDropdownClose}>
            Read All Notifications
          </Button>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown