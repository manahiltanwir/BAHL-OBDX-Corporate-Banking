import { CardMedia } from '@mui/material'
import React from 'react'

const Video = () => {
  return (
    <>
      <CardMedia
        component='video'
        image={'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'}
        autoPlay
        width='345px'
        height='250px'
        controls
      />
      {/* <video width='345px' height='250px' controls autoPlay>
        <source
          src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
          type='video/mp4'
        />
      </video> */}
    </>
  )
}

export default Video
