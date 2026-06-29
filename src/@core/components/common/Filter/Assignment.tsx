import React, { useEffect, useState, useId, useMemo } from 'react'

import { useSelector } from 'react-redux'

// ** Types Imports
import { RootState } from 'src/store'
// import { IAssignment } from 'src/types/apps/assignment'

// ** MUI
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import FormControl from '@mui/material/FormControl'
import { useRouter } from 'next/router'

// interface IField {
//     onSelect: (assignment: IAssignment) => Promise<IAssignment>
// }
interface IField {
  onSelect: (assignment: any) => Promise<any>
}

export default function Select({ onSelect }: IField) {
  // ** hooks
  const { query } = useRouter()
  // const store = useSelector((state: RootState) => state.assignment)

  // ** States
  const [selected, setSelected] = useState<any | {}>({})

  // useMemo(() => {
  //     if (query.assignmentId) {
  //         const assignment = store.assignments.find((p) => p.id === query.assignmentId)
  //         assignment && setSelected(assignment)
  //         assignment && onSelect(assignment)
  //     }
  // }, [query.assignmentId])

  return (
    <h1></h1>
    // <Autocomplete
    //     id={`assignment-select-${useId()}`}
    //     fullWidth
    //     // options={store.assignments}
    //     autoHighlight
    //     getOptionLabel={(option) =>
    //         // @ts-ignore
    //         typeof option === 'string' ? option : option?.name || 'Not possible'
    //     }
    //     isOptionEqualToValue={() => true}
    //     value={selected}
    //     // @ts-ignore
    //     onChange={(event: any, newValue: IAssignment) => {
    //         newValue && setSelected(newValue)
    //         newValue && onSelect(newValue)
    //     }}
    //     // @ts-ignore
    //     renderOption={(props, option: IAssignment) => (
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
    //                     label="Select Assignment"
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
