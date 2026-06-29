import React, { useEffect, useState, useId, useMemo } from 'react'

import { useSelector } from 'react-redux'

// ** Types Imports
import { RootState } from 'src/store'
// import { IProject } from 'src/types/apps/project'

// ** MUI
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { useRouter } from 'next/router'

// interface IField {
//     onSelect: (project: IProject) => Promise<IProject>
// }
interface IField {
  onSelect: (project: any) => Promise<any>
}

export default function CountrySelect({ onSelect }: IField) {
  // ** hooks
  const { query } = useRouter()
  // const store = useSelector((state: RootState) => state.project)
  //
  // ** States
  const [selected, setSelected] = useState<any | {}>({})

  // useMemo(() => {
  //     if (query.projectId) {
  //         const project = store.projects.find((p) => p.id === query.projectId)
  //         project && setSelected(project)
  //         project && onSelect(project)
  //     }
  // }, [query.projectId])

  return (
    <h1></h1>
    // <Autocomplete
    //     id={`product-select-${useId()}`}
    //     fullWidth
    //     options={store.projects}
    //     autoHighlight
    //     getOptionLabel={(option) =>
    //         // @ts-ignore
    //         typeof option === 'string' ? option : option?.name || 'Not possible'
    //     }
    //     isOptionEqualToValue={() => true}
    //     value={selected}
    //     // @ts-ignore
    //     onChange={(event: any, newValue: IProject) => {
    //         newValue && setSelected(newValue)
    //         newValue && onSelect(newValue)
    //     }}
    //     // @ts-ignore
    //     renderOption={(props, option: IProject) => (
    //         <Box component="li" key={option && option.id} sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
    //             {option && option.name}
    //         </Box>
    //     )}
    //     renderInput={(params) => {
    //         return (
    //             <FormControl style={{ width: 220 }} fullWidth>
    //                 <TextField
    //                     {...params}
    //                     size='small'
    //                     label="Select Project"
    //                     inputProps={{
    //                         ...params.inputProps,
    //                         autoComplete: 'new-password', // disable autocomplete and autofill
    //                     }}
    //                 />
    //             </FormControl>
    //         )
    //     }}
    // />
  )
}
