import React from 'react'

const Page = () => {
  return (
    <div>Page</div>
  )
}

export default Page

// import React, { useMemo, useContext, useEffect } from 'react'
// import Breadcrumbs from '@mui/material/Breadcrumbs'
// import Typography from '@mui/material/Typography'
// import Link from '@mui/material/Link'
// import Stack from '@mui/material/Stack'
// import Card from '@mui/material/Card'
// import NavigateNextIcon from '@mui/icons-material/NavigateNext'
// import { LocationContext, ILocation } from 'src/context/LocationContext'
// import { useRouter } from 'next/router'

// export default function CustomSeparator() {
//   const { locations, changeLocation, removeAllLocations } = useContext(LocationContext)
//   const router = useRouter()
//   const pathArray = router.pathname.split('/')

//   useMemo(() => {
//     pathArray.shift()
//   }, [pathArray])

//   useEffect(() => {
//     // ** Auto location setting in project and accosited module
//     if (pathArray.includes('project')) {
//       changeLocation({
//         asPath: router.asPath,
//         path: router.pathname,
//         title: pathArray[pathArray.length - 1]
//       })
//     }

//     return () => {
//       removeAllLocations()
//     }
//   }, [router.asPath])

//   function handleRedirect(location: ILocation) {
//     router.push(location.asPath)
//   }

//   return (
//     <Card sx={{ p: 5 }}>
//       <Stack spacing={2}>
//         <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />} aria-label='breadcrumb'>
//           {/* {breadcrumbs} */}
//           {locations.map((location, i) => (
//             <Link
//               key={i}
//               href='#'
//               underline='hover'
//               color={locations.length == i + 1 ? 'Highlight' : 'ActiveBorder'}
//               onClick={() => handleRedirect(location)}
//             >
//               {location.title.toUpperCase()}
//             </Link>
//           ))}
//         </Breadcrumbs>
//       </Stack>
//     </Card>
//   )
// }
