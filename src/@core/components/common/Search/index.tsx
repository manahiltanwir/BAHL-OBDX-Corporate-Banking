import React, { useState, useCallback, SyntheticEvent } from 'react'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** MUI
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

// ** Icons
import SearchIcon from '@mui/icons-material/Search'
import CancelIcon from '@mui/icons-material/Cancel'

// ** Actions
// import { ReportQueryAction } from 'src/store/apps/report'
// import { ProjectQueryAction } from 'src/store/apps/project'

// ** Types import
import { RootState, AppDispatch } from 'src/store'
import { fetchAllAction } from 'src/store/apps/category'

const Search: React.FC<{
  placeholder: string
  onSearch?: (v: string) => void
  module: 'report' | 'assignment' | 'project'
}> = ({ placeholder, module, onSearch }) => {
  const [text, setText] = useState<string>('')
  const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle')

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  const handleText = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setText(e.target.value)
      setStatus('idle')
    },
    [text]
  )

  const handleSearch = async (search: string) => {
    if (module === 'assignment') {
      await dispatch(fetchAllAction({ query: { search } }))
    } else if (module === 'report') {
      // @ts-ignore
      await dispatch(ReportQueryAction({ search }))
    } else if (module === 'project') {
      // @ts-ignore
      await dispatch(ProjectQueryAction({ search }))
    }
  }

  const submitSearch = async (e: SyntheticEvent) => {
    e.preventDefault()
    await handleSearch(text)
    setStatus('success')
  }

  const handleSearchCancel = async () => {
    setText('')
    setStatus('idle')
    handleSearch('')
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginX: 5 }}>
      <form noValidate onSubmit={submitSearch}>
        <TextField value={text} onChange={handleText} placeholder={`Search ${placeholder}`} size='small' />
        {status === 'idle' || text.length === 0 ? (
          <IconButton type='submit' color='primary'>
            <SearchIcon />
          </IconButton>
        ) : (
          <IconButton color='primary' onClick={handleSearchCancel}>
            <CancelIcon />
          </IconButton>
        )}
      </form>
    </Box>
  )
}

export default Search
