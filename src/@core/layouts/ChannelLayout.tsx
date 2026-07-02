// ** MUI Imports
import { Box, Grid, IconButton, Menu, MenuItem, Stack, Tab, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { MouseEvent, useEffect, useState } from 'react'
// import { useChannels } from '../hooks/apps/useChannels'
import LoadingButton from '@mui/lab/LoadingButton'
import CheckIcon from '@mui/icons-material/Check'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
// import ChannelDrawer from 'src/@core/components/apps/channels/components/ChannelDrawer'

// ** Types
import { ChannelLayoutProps } from './types'
import { ModalType } from 'src/types'
import Link from 'next/link'
// import { IChannels } from 'src/types/apps/channels'
import useToggleDrawer from '../hooks/useToggleDrawer'
import { DeleteOutline, DotsVertical } from 'mdi-material-ui'
import DeleteAlert from '../components/common/deleteAlert'
import { useAuth } from 'src/hooks/useAuth'
import { textOverflow } from '../helper/text'

export const renderClient = (row: any) => {
  if (row?.thumnail_url) {
    return <CustomAvatar src={row?.thumnail_url} sx={{ mr: 3, width: 80, height: 80 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 80, height: 80, fontSize: '1rem' }}
      >
        {getInitials(row?.name)}
      </CustomAvatar>
    )
  }
}

// const RowOptions = ({ id }: { id: string }) => {

//   const { handleModal, handleDrawer } = useToggleDrawer()
//   // const { handleModal, handleDrawer, modalType } = useToggleDrawer()

//   // ** State
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

//   const rowOptionsOpen = Boolean(anchorEl)

//   const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget)
//   }
//   const handleRowOptionsClose = () => {
//     setAnchorEl(null)
//   }

//   const handleDelete = async () => {
//     handleModal(id, ModalType.CHANNEL)
//     handleRowOptionsClose()
//   }

//   const handleUpdate = () => {
//     handleRowOptionsClose()
//     handleDrawer(id)
//   }

//   return (
//     <>
//       <IconButton size='small' onClick={handleRowOptionsClick}>
//         <DotsVertical />
//       </IconButton>
//       <Menu
//         keepMounted
//         anchorEl={anchorEl}
//         open={rowOptionsOpen}
//         onClose={handleRowOptionsClose}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'right'
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right'
//         }}
//         PaperProps={{ style: { minWidth: '8rem' } }}
//       >
//         <MenuItem onClick={handleUpdate}>
//           <DeleteOutline fontSize='small' sx={{ mr: 2 }} />
//           Edit
//         </MenuItem>
//         <MenuItem onClick={handleDelete}>
//           <DeleteOutline fontSize='small' sx={{ mr: 2 }} />
//           Delete
//         </MenuItem>
//       </Menu>
//     </>
//   )
// }

const ChannelLayout = ({ children }: ChannelLayoutProps) => {

  // const { store, getChannelById, subscribeChannelsById, deleteChannels } = useChannels(null)

  const [value, setValue] = useState('1')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const router = useRouter()
  const routeSegments = router.pathname.split('/')
  const lastSegment = routeSegments.pop()

  let {
    query: { id }
  } = router

  useEffect(() => {
    // getChannelById(id)
  }, [id])

  const channelSubscription = (id: string) => {
    // subscribeChannelsById(id, 'ONE')
  }

  return (
    <>
      <Stack direction='row' justifyContent={'space-between'} spacing={10}>
        <Grid container alignItems={'center'}>
          <Grid xs={12} lg={8} md={6} sm={6}>
            <Box display={'flex'} flexDirection={'row'}>
              {/* {renderClient(store?.entity)} */}
              <Stack direction='column' spacing={0} marginLeft={5}>
                <Typography variant='h4' margin={0}>
                  {/* {textOverflow(store?.entity?.name, 25)} */}
                </Typography>
                <Typography variant='caption' margin={0} fontSize={20} >
                  {/* @{textOverflow(store?.entity?.slug, 30)} */}
                </Typography>
                <Typography variant='h6' margin={0}>
                  {/* {store?.entity?.subscriber?.length} Followers */}
                </Typography>
              </Stack>
            </Box>
          </Grid>
          <Grid xs={12} lg={4} md={6} sm={6}>
            <Box display={'flex'}>
              <LoadingButton
                // loading={store.status === 'pending'}
                // disabled={store.status === 'pending'}
                loadingPosition='end'
                style={{}
                  // store?.entity?.isSubscribed
                  //   ? { background: 'white', color: 'black' }
                  //   : { color: '#fff', background: 'linear-gradient(360deg, #EFD9AE -73.58%, #B4772C 97.53%)' }
                }
                sx={{
                  // display: 'flex',
                  marginLeft: 'auto',
                  width: '200px',
                  marginRight: 5
                }}
                variant='contained'
                type='submit'
                // onClick={() => channelSubscription(store?.entity?.id)}
                // endIcon={store?.entity?.isSubscribed ? <CheckIcon color='success' /> : null}
              >
                {/* {store?.entity?.isSubscribed ? 'Subscribed' : 'Subscribe'} */}
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Stack>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label='lab API tabs example'>
              {/* <Link href={`/channels/${store?.entity.id}`}> */}
                <Tab
                  label='Home'
                  value={children}
                  sx={
                    lastSegment === '[id]' ? { borderBottom: '2px solid #cf7404', color: '#cf7404' } : { color: '#fff' }
                  }
                />
              {/* </Link> */}
              {/* <Link href={`/channels/${store?.entity.id}/about`}> */}
                <Tab
                  label='About'
                  value={'2'}
                  sx={
                    lastSegment === 'about'
                      ? { borderBottom: '2px solid #cf7404', color: '#cf7404' }
                      : { color: '#fff' }
                  }
                />
              {/* </Link> */}
              {/* <Link href={`/channels/${store?.entity.id}/courses`}> */}
                <Tab
                  label='Courses'
                  value={'3'}
                  sx={
                    lastSegment === 'courses'
                      ? { borderBottom: '2px solid #cf7404', color: '#cf7404' }
                      : { color: '#fff' }
                  }
                />
              {/* </Link> */}
              {/* <Link href={`/channels/${store?.entity.id}/channels`}> */}
                <Tab
                  label='Channels'
                  value={'4'}
                  sx={
                    lastSegment === 'channels'
                      ? { borderBottom: '2px solid #cf7404', color: '#cf7404' }
                      : { color: '#fff' }
                  }
                />
              {/* </Link> */}
            </TabList>
          </Box>
          <TabPanel value='1'>{children}</TabPanel>
          <TabPanel value='2'>{children}</TabPanel>
          <TabPanel value='3'>{children}</TabPanel>
          <TabPanel value='4'>{children}</TabPanel>
        </TabContext>
      </Box>
    </>
  )
}

export default ChannelLayout
