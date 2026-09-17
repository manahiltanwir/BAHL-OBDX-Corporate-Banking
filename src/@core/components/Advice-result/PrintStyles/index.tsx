import React from 'react'
import GlobalStyles from '@mui/material/GlobalStyles'

const PrintStyles = () => (
  <GlobalStyles
    styles={{
      '@media print': {
        html: {
          height: 'auto !important'
        },
        body: {
          height: 'auto !important',
          overflow: 'visible !important'
        },
        '.no-print': {
          display: 'none !important'
        },
        'body *': {
          visibility: 'hidden'
        },
        '#debit-advice-printable, #debit-advice-printable *, #advice-printable, #advice-printable *': {
          visibility: 'visible'
        },
        '#debit-advice-printable, #advice-printable': {
          position: 'absolute !important',
          left: '0 !important',
          top: '0 !important',
          right: '0 !important',
          width: '100% !important',
          maxWidth: '100% !important',
          margin: '0 !important',
          boxShadow: 'none !important',
          border: 'none !important',
          overflow: 'visible !important'
        }
      }
    }}
  />
)

export default PrintStyles