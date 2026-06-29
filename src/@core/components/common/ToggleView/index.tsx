
import React from 'react'

// ** MUI
import { styled } from '@mui/material/styles'
import { Stack, Switch } from '@mui/material'

// ** Hooks
import useToggleDrawer from "src/@core/hooks/useToggleDrawer"

// ** Customize MUI
// const AntSwitch = styled(Switch)(({ theme }) => ({
//   width: 28,
//   height: 16,
//   padding: 0,
//   display: 'flex',
//   '&:active': {
//     '& .MuiSwitch-thumb': {
//       width: 15,
//     },
//     '& .MuiSwitch-switchBase.Mui-checked': {
//       transform: 'translateX(9px)',
//     },
//   },
//   '& .MuiSwitch-switchBase': {
//     padding: 2,
//     '&.Mui-checked': {
//       transform: 'translateX(12px)',
//       color: '#fff',
//       '& + .MuiSwitch-track': {
//         opacity: 1,
//         backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
//       },
//     },
//   },
//   '& .MuiSwitch-thumb': {
//     boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     transition: theme.transitions.create(['width'], {
//       duration: 200,
//     }),
//   },
//   '& .MuiSwitch-track': {
//     borderRadius: 16 / 2,
//     opacity: 1,
//     backgroundColor:
//       theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
//     boxSizing: 'border-box',
//   },
// }));

// const useStyles = makeStyles({
const AntSwitch = styled(Switch)(({ theme }) => ({
  root: {
    width: "50px",
    height: "24px",
    padding: "0px"
  },
  switchBase: {
    color: "#818181",
    padding: "1px",
    "&$checked": {
      "& + $track": {
        backgroundColor: "#23bf58"
      }
    }
  },
  thumb: {
    color: "white",
    width: "20px",
    height: "20px",
    margin: "1px"
  },
  track: {
    borderRadius: "20px",
    backgroundColor: "#818181",
    opacity: "1 !important",
    "&:after, &:before": {
      color: "white",
      fontSize: "11px",
      position: "absolute",
      top: "6px"
    },
    "&:after": {
      content: "'On'",
      left: "8px"
    },
    "&:before": {
      content: "'Off'",
      right: "7px"
    }
  },
  checked: {
    color: "#23bf58 !important",
    transform: "translateX(26px) !important"
  }
}));

const ToggleView = () => {

  const { view, toggleView } = useToggleDrawer();
  // const classes = useStyles();

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <AntSwitch
        inputProps={{ 'aria-label': 'ant design' }}
        name="view"
        onChange={() => toggleView()}
        checked={view === 'CARD' ? true : false}
      />
    </Stack>
  )
}

export default ToggleView
