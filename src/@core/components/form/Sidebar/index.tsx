import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
const Sidebar = () => {
  const [activeItem, setActiveItem] = React.useState(0)
  const menuItems = [
    'LC Details',
    'Goods and Shipment Details',
    'Documents and Conditions',
    'Linkages',
    'Instructions',
    'Insurance',
    'Charges, Commissions and Taxes',
    'Attachments'
  ]

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: '#fff',
        px: 1,
        py: 2
      }}
    >
      <List>
        {menuItems.map((item, index) => (
          <ListItemButton

            selected={activeItem === index}
            onClick={() => setActiveItem(index)}
            key={index}
           sx={{
  mb: 1,
  borderRadius: 1,
  px: 2,

  ...(activeItem === index && {
    bgcolor: '#E8F5EE',
    borderLeft: '4px solid #008E5A',

    '& .MuiTypography-root': {
      color: '#008E5A',
      fontWeight: 600
    }
  }),

  '&:hover': {
    bgcolor: '#F4FBF7'
  }
}}
          >
            <ListItemIcon
  sx={{
    minWidth: 32
  }}
>
  <CheckCircleOutlineIcon
    sx={{
      fontSize: 18,
      color: activeItem === index ? '#008E5A' : '#8A8A8A'
    }}
  />
</ListItemIcon>
            <ListItemText
              primary={
                <Typography fontSize={14} fontWeight={500}>
                  {item}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}

export default Sidebar
