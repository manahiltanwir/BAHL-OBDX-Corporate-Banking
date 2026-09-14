import React from 'react'
import GlobalStyles from '@mui/material/GlobalStyles'


const PrintStyles = () => (
  <GlobalStyles
    styles={{
      '@media print': {
        '.no-print': {
          display: 'none !important'
        },
        'body *': {
          visibility: 'hidden'
        },
        '#debit-advice-printable, #debit-advice-printable *': {
          visibility: 'visible'
        },
        '#debit-advice-printable': {
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          boxShadow: 'none !important',
          border: 'none !important'
        }
      }
    }}
  />
)

export default PrintStyles