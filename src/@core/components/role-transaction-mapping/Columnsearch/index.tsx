import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'

interface ColumnSearchProps {
  value: string
  onChange: (v: string) => void
  placeholder: string
}

export function ColumnSearch({ value, onChange, placeholder }: ColumnSearchProps) {
  return (
    <TextField
      fullWidth
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ fontSize: 17 }} color="disabled" />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          bgcolor: 'background.paper',
          fontSize: 13.5,
          '& fieldset': { borderColor: 'divider' },
        },
      }}
    />
  )
}