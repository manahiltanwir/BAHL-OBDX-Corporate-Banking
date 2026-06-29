// ** React Import
import { ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icons
import Close from 'mdi-material-ui/Close'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import Image from 'next/image'

interface Props {
  hidden: boolean
  navHover: boolean
  settings: Settings
  collapsedNavWidth: number
  menuLockedIcon?: ReactNode
  menuUnlockedIcon?: ReactNode
  navigationBorderWidth: number
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
  verticalNavMenuBranding?: (props?: any) => ReactNode
}

// ** Styled Components
const MenuHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  paddingRight: theme.spacing(4),
  justifyContent: 'space-between',
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const HeaderTitle = styled(Typography)<TypographyProps>({
  fontWeight: 700,
  lineHeight: 1.2,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
})

const StyledLink = styled('a')({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const VerticalNavHeader = (props: Props) => {
  // ** Props
  const {
    hidden,
    navHover,
    settings,
    saveSettings,
    collapsedNavWidth,
    toggleNavVisibility,
    navigationBorderWidth,
    menuLockedIcon: userMenuLockedIcon,
    menuUnlockedIcon: userMenuUnlockedIcon,
    verticalNavMenuBranding: userVerticalNavMenuBranding
  } = props

  // ** Hooks & Vars
  const theme = useTheme()
  const { skin, direction, navCollapsed } = settings
  const menuCollapsedStyles = navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }

  const svgFillSecondary = () => {
    if (skin === 'semi-dark' && theme.palette.mode === 'light') {
      return `rgba(${theme.palette.customColors.dark}, 0.68)`
    } else if (skin === 'semi-dark' && theme.palette.mode === 'dark') {
      return `rgba(${theme.palette.customColors.light}, 0.68)`
    } else {
      return theme.palette.text.secondary
    }
  }
  const svgFillDisabled = () => {
    if (skin === 'semi-dark' && theme.palette.mode === 'light') {
      return `rgba(${theme.palette.customColors.dark}, 0.38)`
    } else if (skin === 'semi-dark' && theme.palette.mode === 'dark') {
      return `rgba(${theme.palette.customColors.light}, 0.38)`
    } else {
      return theme.palette.text.disabled
    }
  }

  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userVerticalNavMenuBranding) {
        return 0
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 40) / 8
      }
    } else {
      return 5.5
    }
  }

  const svgRotationDeg = () => {
    if (navCollapsed) {
      if (direction === 'rtl') {
        if (navHover) {
          return 0
        } else {
          return 180
        }
      } else {
        if (navHover) {
          return 180
        } else {
          return 0
        }
      }
    } else {
      if (direction === 'rtl') {
        return 180
      } else {
        return 0
      }
    }
  }

  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: menuHeaderPaddingLeft() }}>
      {userVerticalNavMenuBranding ? (
        userVerticalNavMenuBranding(props)
      ) : (
        <Box sx={{ paddingY: 10, marginBottom: 12 }}>
          <Link href='/' passHref>
            <StyledLink>
              {/* <svg width='200' height='70' viewBox='0 0 202 70' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <g clip-path='url(#clip0_175_2533)'>
                  <path
                    d='M56.9952 30.7171L59.014 27.8527C60.2285 29.1185 62.1214 30.2042 64.5067 30.2042C66.5528 30.2042 67.5102 29.2985 67.5102 28.2946C67.5102 25.2993 57.5642 27.3889 57.5642 20.9072C57.5642 18.0374 60.0534 15.6641 64.1183 15.6641C66.8646 15.6641 69.146 16.4934 70.8529 18.0701L68.8068 20.809C67.4063 19.516 65.5407 18.9267 63.7791 18.9267C62.2254 18.9267 61.3446 19.5978 61.3446 20.629C61.3446 23.3406 71.2632 21.5074 71.2632 27.94C71.2632 31.0881 68.9819 33.4669 64.3481 33.4669C61.0108 33.456 58.6256 32.3429 56.9952 30.7171Z'
                    fill='url(#paint0_linear_175_2533)'
                  />
                  <path
                    d='M89.1693 33.1447V25.2663C89.1693 24.1042 88.6495 23.2804 87.3037 23.2804C86.1384 23.2804 85.181 24.0551 84.716 24.7262V33.1502H81.4007V25.2663C81.4007 24.1042 80.8809 23.2804 79.5351 23.2804C78.3972 23.2804 77.4398 24.0551 76.9474 24.7262V33.1502H73.6594V20.6669H76.9474V22.2655C77.489 21.5454 79.1248 20.356 81.0396 20.356C82.8778 20.356 84.0704 21.2071 84.5081 22.6038C85.2357 21.4908 86.8934 20.356 88.8082 20.356C91.1169 20.356 92.4846 21.5726 92.4846 24.126V33.1393H89.1693V33.1447Z'
                    fill='url(#paint1_linear_175_2533)'
                  />
                  <path
                    d='M104.356 33.1447V31.5461C103.372 32.7846 102.026 33.4557 100.494 33.4557C97.3591 33.4557 94.952 31.0769 94.952 26.8922C94.952 22.8384 97.3099 20.356 100.494 20.356C101.971 20.356 103.344 20.9779 104.356 22.2655V20.6669H107.672V33.1447H104.356ZM104.356 29.1128V24.7207C103.815 23.8969 102.622 23.2749 101.533 23.2749C99.6405 23.2749 98.3494 24.748 98.3494 26.8922C98.3494 29.0637 99.6459 30.5313 101.533 30.5313C102.617 30.5368 103.809 29.9421 104.356 29.1128Z'
                    fill='url(#paint2_linear_175_2533)'
                  />
                  <path
                    d='M110.938 33.1447V20.6669H114.226V22.3474C115.134 21.2616 116.66 20.356 118.214 20.356V23.5586C117.979 23.5095 117.694 23.4822 117.306 23.4822C116.217 23.4822 114.767 24.1042 114.226 24.9008V33.1393H110.938V33.1447Z'
                    fill='url(#paint3_linear_175_2533)'
                  />
                  <path
                    d='M120.938 30.0188V23.5371H118.865V20.6673H120.938V17.2573H124.226V20.6673H126.765V23.5371H124.226V29.1459C124.226 29.9479 124.642 30.5371 125.364 30.5371C125.857 30.5371 126.322 30.3571 126.502 30.1498L127.203 32.654C126.71 33.0905 125.829 33.4561 124.456 33.4561C122.153 33.4561 120.938 32.2667 120.938 30.0188Z'
                    fill='url(#paint4_linear_175_2533)'
                  />
                  <path
                    d='M134.927 24.5464C134.927 19.2268 138.943 15.6313 144.151 15.6313C147.932 15.6313 150.136 17.6719 151.351 19.8434L148.189 21.3928C147.467 19.9961 145.907 18.8886 144.151 18.8886C140.989 18.8886 138.713 21.2892 138.713 24.5464C138.713 27.8036 140.995 30.2042 144.151 30.2042C145.913 30.2042 147.467 29.0912 148.189 27.6999L151.351 29.2222C150.131 31.3663 147.932 33.456 144.151 33.456C138.943 33.456 134.927 29.8387 134.927 24.5464Z'
                    fill='url(#paint5_linear_175_2533)'
                  />
                  <path
                    d='M161.948 33.145V25.5503C161.948 23.8207 161.04 23.2751 159.639 23.2751C158.343 23.2751 157.331 24.0008 156.789 24.721V33.145H153.474V15.915H156.789V22.2658C157.593 21.3383 159.12 20.3562 161.166 20.3562C163.912 20.3562 165.23 21.8566 165.23 24.2845V33.145H161.948Z'
                    fill='url(#paint6_linear_175_2533)'
                  />
                  <path
                    d='M177.108 33.1447V31.5461C176.123 32.7846 174.777 33.4557 173.245 33.4557C170.11 33.4557 167.703 31.0769 167.703 26.8922C167.703 22.8384 170.061 20.356 173.245 20.356C174.722 20.356 176.096 20.9779 177.108 22.2655V20.6669H180.423V33.1447H177.108ZM177.108 29.1128V24.7207C176.566 23.8969 175.373 23.2749 174.285 23.2749C172.392 23.2749 171.101 24.748 171.101 26.8922C171.101 29.0637 172.397 30.5313 174.285 30.5313C175.368 30.5368 176.561 29.9421 177.108 29.1128Z'
                    fill='url(#paint7_linear_175_2533)'
                  />
                  <path
                    d='M183.377 17.3607C183.377 16.275 184.258 15.4238 185.319 15.4238C186.408 15.4238 187.289 16.275 187.289 17.3607C187.289 18.4464 186.408 19.3248 185.319 19.3248C184.258 19.3248 183.377 18.4464 183.377 17.3607ZM183.689 33.1448V20.667H186.977V33.1448H183.689Z'
                    fill='url(#paint8_linear_175_2533)'
                  />
                  <path
                    d='M198.685 33.1447V25.6046C198.685 23.8751 197.777 23.2804 196.381 23.2804C195.085 23.2804 194.1 24.006 193.531 24.7262V33.1502H190.243V20.6669H193.531V22.2655C194.335 21.338 195.889 20.356 197.908 20.356C200.682 20.356 202 21.9054 202 24.3334V33.1447H198.685Z'
                    fill='url(#paint9_linear_175_2533)'
                  />
                  <path
                    d='M70.4152 54.2596L69.3539 51.4116H62.1269L61.0655 54.2596H56.9952L63.4891 37.4443H67.9916L74.4855 54.2596H70.4152ZM65.7431 41.0289L63.1116 48.2635H68.3691L65.7431 41.0289Z'
                    fill='url(#paint10_linear_175_2533)'
                  />
                  <path
                    d='M75.2022 48.1598C75.2022 44.4279 77.9322 41.7817 81.6742 41.7817C84.1744 41.7817 85.6953 42.8675 86.4995 43.975L84.3987 45.9392C83.8188 45.0826 82.9325 44.6298 81.8219 44.6298C79.8743 44.6298 78.5121 46.0428 78.5121 48.1598C78.5121 50.2767 79.8798 51.7116 81.8219 51.7116C82.9325 51.7116 83.8188 51.2096 84.3987 50.3749L86.4995 52.339C85.6898 53.4466 84.1744 54.5596 81.6742 54.5596C77.9322 54.5651 75.2022 51.9189 75.2022 48.1598Z'
                    fill='url(#paint11_linear_175_2533)'
                  />
                  <path
                    d='M96.9926 54.2595V52.6991C96.0297 53.9103 94.7167 54.5651 93.2232 54.5651C90.165 54.5651 87.8125 52.2463 87.8125 48.1598C87.8125 44.2042 90.1157 41.7817 93.2232 41.7817C94.662 41.7817 96.0024 42.3873 96.9926 43.6477V42.0873H100.226V54.265H96.9926V54.2595ZM96.9926 50.3258V46.0374C96.4619 45.2299 95.2966 44.6243 94.2353 44.6243C92.3916 44.6243 91.1278 46.0592 91.1278 48.1543C91.1278 50.2712 92.3916 51.7061 94.2353 51.7061C95.2966 51.7116 96.4619 51.1333 96.9926 50.3258Z'
                    fill='url(#paint12_linear_175_2533)'
                  />
                  <path
                    d='M111.808 54.2596V52.6992C110.845 53.9104 109.532 54.5651 108.038 54.5651C104.98 54.5651 102.628 52.2464 102.628 48.1598C102.628 44.2043 104.925 41.7818 108.038 41.7818C109.477 41.7818 110.845 42.3874 111.808 43.6478V37.4443H115.041V54.2596H111.808ZM111.808 50.3259V46.0157C111.277 45.2082 110.112 44.6298 109.05 44.6298C107.207 44.6298 105.943 46.0648 105.943 48.1598C105.943 50.2768 107.207 51.7117 109.05 51.7117C110.117 51.7117 111.277 51.1333 111.808 50.3259Z'
                    fill='url(#paint13_linear_175_2533)'
                  />
                  <path
                    d='M117.454 48.1598C117.454 44.6297 120.08 41.7817 123.772 41.7817C127.438 41.7817 129.889 44.5043 129.889 48.4653V49.2237H120.813C121.037 50.7131 122.251 51.9462 124.325 51.9462C125.364 51.9462 126.776 51.5206 127.558 50.7623L128.997 52.8792C127.783 53.9867 125.862 54.5651 123.964 54.5651C120.255 54.5651 117.454 52.0662 117.454 48.1598ZM123.772 44.4061C121.776 44.4061 120.917 45.7919 120.791 47.0031H126.809C126.705 45.841 125.895 44.4061 123.772 44.4061Z'
                    fill='url(#paint14_linear_175_2533)'
                  />
                  <path
                    d='M147.357 54.2595V46.5721C147.357 45.4372 146.854 44.6298 145.535 44.6298C144.397 44.6298 143.462 45.3827 143.008 46.0428V54.2595H139.775V46.5721C139.775 45.4372 139.266 44.6298 137.953 44.6298C136.842 44.6298 135.907 45.3827 135.425 46.0428V54.2595H132.214V42.0818H135.425V43.6477C135.956 42.9439 137.548 41.7817 139.419 41.7817C141.213 41.7817 142.373 42.6165 142.805 43.975C143.511 42.8893 145.131 41.7817 147.002 41.7817C149.25 41.7817 150.59 42.9657 150.59 45.4645V54.2595H147.357Z'
                    fill='url(#paint15_linear_175_2533)'
                  />
                  <path
                    d='M153.632 57.386L155.071 55.0945C155.957 56.153 157.445 56.584 158.737 56.584C160.81 56.584 162.025 55.1709 162.025 53.4577V52.1974C161.187 53.1085 159.727 54.036 157.724 54.036C155.044 54.036 153.78 52.5738 153.78 50.206V42.082H156.991V48.9402C156.991 50.6261 157.878 51.1826 159.24 51.1826C160.476 51.1826 161.467 50.5006 162.019 49.7968V42.082H165.23V53.4523C165.23 57.1078 162.626 59.1974 158.731 59.1974C156.69 59.2028 155.049 58.6245 153.632 57.386Z'
                    fill='url(#paint16_linear_175_2533)'
                  />
                  <path
                    d='M48.8875 53.2938L45.7253 51.5752V54.0795L46.7155 54.6196L46.7976 58.1333L43.7886 59.9719L42.5139 59.279L40.5116 60.6976L43.8543 62.5144L49.0406 59.3554L48.8875 53.2938Z'
                    fill='url(#paint17_linear_175_2533)'
                  />
                  <path
                    d='M44.0731 35.3055L26.3421 27.4271V24.0062L21.0737 20.9727L15.8053 24.0062V30.0623L21.0737 33.0958L24.9853 30.8425L40.3912 37.6952V54.2595L24.5641 65.4824L8.72051 54.0685V49.2073H9.91863L12.9549 43.9532L9.91863 38.71H3.84052L0.804199 43.9532L3.84052 49.2073H5.03863V55.9508L24.5477 69.9999L44.0731 56.1527V35.3055ZM18.0155 28.7911V25.272L21.0737 23.5151L24.1319 25.272V28.5401L23.9842 28.8783L21.0737 30.5533L18.0155 28.7911ZM3.35361 43.9532L5.11522 40.9142H8.64392L10.411 43.9532L8.72598 46.8612L8.64392 47.0031H5.11522L5.0441 46.8776L3.35361 43.9532Z'
                    fill='url(#paint18_linear_175_2533)'
                  />
                  <path
                    d='M2.22663 12.276L5.26295 10.481L6.19847 11.0102L8.18985 9.59709L5.2356 7.93848L0 11.0211L0.0601793 17.0881L3.39192 18.9595V16.428L2.25946 15.7896L2.22663 12.276Z'
                    fill='url(#paint19_linear_175_2533)'
                  />
                  <path
                    d='M45.2767 21.3437H44.0786V14.06L24.5641 0L5.03864 13.8527V34.6999L22.6438 42.5129V42.5183L23.1581 46.5012L28.7712 48.8363L33.6019 45.159L32.8196 39.1411L27.2065 36.8114L24.1264 39.152L8.72051 32.3102V15.7459L24.5477 4.52299L40.3912 15.9314V21.3437H39.1931L36.1568 26.5869L39.1931 31.841H45.2767L48.313 26.5869L45.2767 21.3437ZM27.5402 39.332L30.7954 40.6851L31.244 44.1715L28.4484 46.3102L25.1932 44.9571L24.7939 41.8963V41.8909L25.1057 41.1925L27.5402 39.332ZM43.9965 29.6368H40.4678L38.7062 26.5869L40.3912 23.6734L40.4624 23.5479H43.9911L44.0731 23.6898L45.7581 26.5924L43.9965 29.6368Z'
                    fill='url(#paint20_linear_175_2533)'
                  />
                </g>
                <defs>
                  <linearGradient
                    id='paint0_linear_175_2533'
                    x1='64.1312'
                    y1='-24.9341'
                    x2='64.1312'
                    y2='47.1662'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stop-color='#3F2200' />
                    <stop offset='0.00473363' stop-color='#422400' />
                    <stop offset='0.1601' stop-color='#9B5400' />
                    <stop offset='0.2303' stop-color='#BF6700' />
                    <stop offset='0.5393' stop-color='#FFF4D3' />
                    <stop offset='0.8483' stop-color='#A05600' />
                    <stop offset='1' stop-color='#522C00' />
                  </linearGradient>
                  <linearGradient
                    id='paint1_linear_175_2533'
                    x1='83.0693'
                    y1='-24.9344'
                    x2='83.0693'
                    y2='47.166'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stop-color='#3F2200' />
                    <stop offset='0.00473363' stop-color='#422400' />
                    <stop offset='0.1601' stop-color='#9B5400' />
                    <stop offset='0.2303' stop-color='#BF6700' />
                    <stop offset='0.5393' stop-color='#FFF4D3' />
                    <stop offset='0.8483' stop-color='#A05600' />
                    <stop offset='1' stop-color='#522C00' />
                  </linearGradient>
                  <linearGradient
                    id='paint2_linear_175_2533'
                    x1='101.311'
                    y1='-24.9344'
                    x2='101.311'
                    y2='47.166'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stop-color='#3F2200' />
                    <stop offset='0.00473363' stop-color='#422400' />
                    <stop offset='0.1601' stop-color='#9B5400' />
                    <stop offset='0.2303' stop-color='#BF6700' />
                    <stop offset='0.5393' stop-color='#FFF4D3' />
                    <stop offset='0.8483' stop-color='#A05600' />
                    <stop offset='1' stop-color='#522C00' />
                  </linearGradient>
                  <linearGradient
                    id='paint3_linear_175_2533'
                    x1='114.576'
                    y1='-24.9344'
                    x2='114.576'
                    y2='47.166'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stop-color='#3F2200' />
                    <stop offset='0.00473363' stop-color='#422400' />
                    <stop offset='0.1601' stop-color='#9B5400' />
                    <stop offset='0.2303' stop-color='#BF6700' />
                    <stop offset='0.5393' stop-color='#FFF4D3' />
                    <stop offset='0.8483' stop-color='#A05600' />
                    <stop offset='1' stop-color='#522C00' />
                  </linearGradient>
                  <linearGradient
                    id='paint4_linear_175_2533'
                    x1='123.035'
                    y1='-24.934'
                    x2='123.035'
                    y2='47.1663'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stop-color='#3F2200' />
                    <stop offset='0.00473363' stop-color='#422400' />
                    <stop offset='0.1601' stop-color='#9B5400' />
                    <stop offset='0.2303' stop-color='#BF6700' />
                    <stop offset='0.5393' stop-color='#FFF4D3' />
                    <stop offset='0.8483' stop-color='#A05600' />
                    <stop offset='1' stop-color='#522C00' />
                  </linearGradient>
                  <linearGradient
                    id='paint5_linear_175_2533'
                    x1='143.139'
                    y1='-24.9341'
                    x2='143.139'
                    y2='47.1662'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stop-color='#3F2200' />
                    <stop offset='0.00473363' stop-color='#422400' />
                    <stop offset='0.1601' stop-color='#9B5400' />
                    <stop offset='0.2303' stop-color='#BF6700' />
                    <stop offset='0.5393' stop-color='#FFF4D3' />
                    <stop offset='0.8483' stop-color='#A05600' />
                    <stop offset='1' stop-color='#522C00' />
                  </linearGradient>
                  <linearGradient
                    id='paint6_linear_175_2533'
                    x1='159.358'
                    y1='-24.9341'
                    x2='159.358'
                    y2='47.1662'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stop-color='#3F2200' />
                    <stop offset='0.00473363' stop-color='#422400' />
                    <stop offset='0.1601' stop-color='#9B5400' />
                    <stop offset='0.2303' stop-color='#BF6700' />
                    <stop offset='0.5393' stop-color='#FFF4D3' />
                    <stop offset='0.8483' stop-color='#A05600' />
                    <stop offset='1' stop-color='#522C00' />
                  </linearGradient>
                  <linearGradient
                    id='paint7_linear_175_2533'
                    x1='174.062'
                    y1='-24.9344'
                    x2='174.062'
                    y2='47.166'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stop-color='#3F2200' />
                    <stop offset='0.00473363' stop-color='#422400' />
                    <stop offset='0.1601' stop-color='#9B5400' />
                    <stop offset='0.2303' stop-color='#BF6700' />
                    <stop offset='0.5393' stop-color='#FFF4D3' />
                    <stop offset='0.8483' stop-color='#A05600' />
                    <stop offset='1' stop-color='#522C00' />
                  </linearGradient>
                  <linearGradient
                    id='paint8_linear_175_2533'
                    x1='185.333'
                    y1='-24.9343'
                    x2='185.333'
                    y2='47.166'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stop-color='#3F2200' />
                    <stop offset='0.00473363' stop-color='#422400' />
                    <stop offset='0.1601' stop-color='#9B5400' />
                    <stop offset='0.2303' stop-color='#BF6700' />
                    <stop offset='0.5393' stop-color='#FFF4D3' />
                    <stop offset='0.8483' stop-color='#A05600' />
                    <stop offset='1' stop-color='#522C00' />
                  </linearGradient>
                  <linearGradient
                    id='paint9_linear_175_2533'
                    x1='196.123'
                    y1='-24.9344'
                    x2='196.123'
                    y2='47.166'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stop-color='#3F2200' />
                    <stop offset='0.00473363' stop-color='#422400' />
                    <stop offset='0.1601' stop-color='#9B5400' />
                    <stop offset='0.2303' stop-color='#BF6700' />
                    <stop offset='0.5393' stop-color='#FFF4D3' />
                    <stop offset='0.8483' stop-color='#A05600' />
                    <stop offset='1' stop-color='#522C00' />
                  </linearGradient>
                  <linearGradient
                    id='paint10_linear_175_2533'
                    x1='65.741'
                    y1='-20.2991'
                    x2='65.741'
                    y2='85.0899'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop offset='0.00561798' />
                    <stop offset='0.5562' stop-color='white' />
                    <stop offset='0.9888' stop-color='#151413' />
                  </linearGradient>
                  <linearGradient
                    id='paint11_linear_175_2533'
                    x1='80.8499'
                    y1='-20.2992'
                    x2='80.8499'
                    y2='85.0899'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop offset='0.00561798' />
                    <stop offset='0.5562' stop-color='white' />
                    <stop offset='0.9888' stop-color='#151413' />
                  </linearGradient>
                  <linearGradient
                    id='paint12_linear_175_2533'
                    x1='94.0222'
                    y1='-20.2992'
                    x2='94.0222'
                    y2='85.0899'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop offset='0.00561798' />
                    <stop offset='0.5562' stop-color='white' />
                    <stop offset='0.9888' stop-color='#151413' />
                  </linearGradient>
                  <linearGradient
                    id='paint13_linear_175_2533'
                    x1='108.84'
                    y1='-20.2991'
                    x2='108.84'
                    y2='85.0899'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop offset='0.00561798' />
                    <stop offset='0.5562' stop-color='white' />
                    <stop offset='0.9888' stop-color='#151413' />
                  </linearGradient>
                  <linearGradient
                    id='paint14_linear_175_2533'
                    x1='123.67'
                    y1='-20.2992'
                    x2='123.67'
                    y2='85.0899'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop offset='0.00561798' />
                    <stop offset='0.5562' stop-color='white' />
                    <stop offset='0.9888' stop-color='#151413' />
                  </linearGradient>
                  <linearGradient
                    id='paint15_linear_175_2533'
                    x1='141.406'
                    y1='-20.2992'
                    x2='141.406'
                    y2='85.0899'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop offset='0.00561798' />
                    <stop offset='0.5562' stop-color='white' />
                    <stop offset='0.9888' stop-color='#151413' />
                  </linearGradient>
                  <linearGradient
                    id='paint16_linear_175_2533'
                    x1='159.436'
                    y1='-20.299'
                    x2='159.436'
                    y2='85.0901'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop offset='0.00561798' />
                    <stop offset='0.5562' stop-color='white' />
                    <stop offset='0.9888' stop-color='#151413' />
                  </linearGradient>
                  <linearGradient
                    id='paint17_linear_175_2533'
                    x1='44.7758'
                    y1='16.0919'
                    x2='44.7758'
                    y2='73.1331'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop offset='0.00561798' />
                    <stop offset='0.5562' stop-color='white' />
                    <stop offset='0.9888' stop-color='#151413' />
                  </linearGradient>
                  <linearGradient
                    id='paint18_linear_175_2533'
                    x1='22.44'
                    y1='16.0919'
                    x2='22.44'
                    y2='73.1331'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop offset='0.00561798' />
                    <stop offset='0.5562' stop-color='white' />
                    <stop offset='0.9888' stop-color='#151413' />
                  </linearGradient>
                  <linearGradient
                    id='paint19_linear_175_2533'
                    x1='2.27527'
                    y1='-16.8624'
                    x2='6.28361'
                    y2='48.9071'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stop-color='#3F2200' />
                    <stop offset='0.00473363' stop-color='#422400' />
                    <stop offset='0.1601' stop-color='#9B5400' />
                    <stop offset='0.2303' stop-color='#BF6700' />
                    <stop offset='0.5393' stop-color='#FFF4D3' />
                    <stop offset='0.8483' stop-color='#A05600' />
                    <stop offset='1' stop-color='#522C00' />
                  </linearGradient>
                  <linearGradient
                    id='paint20_linear_175_2533'
                    x1='23.684'
                    y1='-18.1672'
                    x2='27.6923'
                    y2='47.6023'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stop-color='#3F2200' />
                    <stop offset='0.00473363' stop-color='#422400' />
                    <stop offset='0.1601' stop-color='#9B5400' />
                    <stop offset='0.2303' stop-color='#BF6700' />
                    <stop offset='0.5393' stop-color='#FFF4D3' />
                    <stop offset='0.8483' stop-color='#A05600' />
                    <stop offset='1' stop-color='#522C00' />
                  </linearGradient>
                  <clipPath id='clip0_175_2533'>
                    <rect width='202' height='70' fill='white' />
                  </clipPath>
                </defs>
              </svg> */}
              <div style={{ width: 200, height: 'auto' }}>
                <Image src={'/images/apple-touch-icon.png'} width={200} height={60} alt="logo" />
              </div>
              {/* <HeaderTitle variant='h6' sx={{ ...menuCollapsedStyles, ...(navCollapsed && !navHover ? {} : { ml: 2 }) }}>
              {themeConfig.templateName}
            </HeaderTitle> */}
            </StyledLink>
          </Link>
        </Box>
      )}

      {hidden ? (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={toggleNavVisibility}
          sx={{ p: 0, backgroundColor: 'transparent !important' }}
        >
          <Close fontSize='small' />
        </IconButton>
      ) : (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={() => saveSettings({ ...settings, navCollapsed: !navCollapsed })}
          sx={{ p: 0, color: 'text.primary', backgroundColor: 'transparent !important' }}
        >
          {userMenuLockedIcon && userMenuUnlockedIcon ? (
            navCollapsed ? (
              userMenuUnlockedIcon
            ) : (
              userMenuLockedIcon
            )
          ) : (
            <Box
              width={22}
              fill='none'
              height={22}
              component='svg'
              viewBox='0 0 22 22'
              xmlns='http://www.w3.org/2000/svg'
              sx={{
                transform: `rotate(${svgRotationDeg()}deg)`,
                transition: 'transform .25s ease-in-out .35s'
              }}
            >
              <path
                fill={svgFillSecondary()}
                d='M11.4854 4.88844C11.0082 4.41121 10.2344 4.41121 9.75716 4.88844L4.51029 10.1353C4.03299 10.6126 4.03299 11.3865 4.51029 11.8638L9.75716 17.1107C10.2344 17.5879 11.0082 17.5879 11.4854 17.1107C11.9626 16.6334 11.9626 15.8597 11.4854 15.3824L7.96674 11.8638C7.48943 11.3865 7.48943 10.6126 7.96674 10.1353L11.4854 6.61667C11.9626 6.13943 11.9626 5.36568 11.4854 4.88844Z'
              />
              <path
                fill={svgFillDisabled()}
                d='M15.8683 4.88844L10.6214 10.1353C10.1441 10.6126 10.1441 11.3865 10.6214 11.8638L15.8683 17.1107C16.3455 17.5879 17.1193 17.5879 17.5965 17.1107C18.0737 16.6334 18.0737 15.8597 17.5965 15.3824L14.0779 11.8638C13.6005 11.3865 13.6005 10.6126 14.0779 10.1353L17.5965 6.61667C18.0737 6.13943 18.0737 5.36568 17.5965 4.88844C17.1193 4.41121 16.3455 4.41121 15.8683 4.88844Z'
              />
            </Box>
          )}
        </IconButton>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
