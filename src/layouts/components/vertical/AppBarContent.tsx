// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icons Imports
import MenuIcon from 'mdi-material-ui/Menu'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import Autocomplete from 'src/layouts/components/Autocomplete'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import { Typography } from '@mui/material'
import { useRouter } from 'next/router'
import navigation from 'src/navigation/vertical'
import { useAuth } from 'src/hooks/useAuth'
import { useEffect } from 'react'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  const { pathname } = useRouter()

  const verticalNavOptions = navigation()

  // const findNavigationTitles = (items: any[], path: string, parents: string[] = []): string[] | null => {
  //   for (const item of items) {
  //     if (item.path === path) {
  //       return [...parents, item.title]
  //     }

  //     console.log(item.children);

  //     if (item.children) {
  //       const result = findNavigationTitles(item.children, path, [...parents, item.title])

  //       if (result) {
  //         return result
  //       }
  //     }
  //   }

  //   return null
  // }

  const findNavigationTitles = (items: any[], path: string, parents: string[] = []): string[] | null => {
    const normalizedPath = path.toLowerCase().replace(/^\/|\/$/g, '')

    let bestMatch: { count: number; result: string[] | null } = { count: 0, result: null }

    for (const item of items) {
      if (item.path) {
        const normalizedItemPath = item.path.toLowerCase().replace(/^\/|\/$/g, '')

        if (normalizedItemPath === normalizedPath) {
          return [...parents, item.title]
        }

        if (normalizedPath.startsWith(normalizedItemPath + '/')) {
          const segmentsCount = normalizedItemPath.split('/').length
          if (segmentsCount > bestMatch.count) {
            bestMatch = {
              count: segmentsCount,
              result: [...parents, item.title]
            }
          }
        }
      }

      if (item.children && Array.isArray(item.children)) {
        const childResult = findNavigationTitles(item.children, path, [...parents, item.title])
        if (childResult) {
          return childResult
        }
      }
    }

    return bestMatch.result
  }


  const titles = findNavigationTitles(verticalNavOptions, pathname)

  const currentTitle = titles?.join(' > ')

  const { user } = useAuth()

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center', p: 2 }}>
        {hidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <MenuIcon />
          </IconButton>
        ) : null}
        <Typography variant='body1'>{currentTitle}</Typography>
        <Autocomplete hidden={hidden} settings={settings} />
      </Box>
      <Typography variant='body1' marginLeft={'auto'} marginRight={2}>
        Logged in as <strong>{`${user?.userProfile?.firstName ?? ''} ${user?.userProfile?.lastName ?? ''}`}</strong>
      </Typography>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} /> */}
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        <NotificationDropdown settings={settings} />
        <UserDropdown settings={settings} />
      </Box>
    </Box>
  )
}

export default AppBarContent
