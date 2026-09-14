import React, { useRef, useState } from 'react'
import { Box, Card, Divider, Grid, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { dummyAdvice } from 'src/@core/components/Advice-result/adviceTheme'
import { downloadElementAsPdf } from 'src/@core/components/Advice-result/pdfExport'
import AdviceHero from 'src/@core/components/Advice-result/AdviceHero'
import AdviceStats from 'src/@core/components/Advice-result/AdviceStats'
import DebitAdviceSlip from 'src/@core/components/Advice-result/DebitAdviceSlip'
import PrintStyles from 'src/@core/components/Advice-result/PrintStyles'

const Page = () => {
  const router = useRouter()
  const theme = useTheme()
  const printRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  const data = dummyAdvice 

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPdf = async () => {
    if (!printRef.current) return
    setDownloading(true)
    try {
      await downloadElementAsPdf(printRef.current, `Debit-Advice-${data.lcNumber}.pdf`)
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Grid container spacing={6}>
      <AdviceHero
        data={data}
        downloading={downloading}
        onBack={() => router.back()}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
      />

      <AdviceStats data={data} />

      <Grid item xs={12}>
        <Box className='no-print' sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant='overline' sx={{ color: 'text.secondary', letterSpacing: 1 }}>
            Official Copy
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        <Card
          elevation={0}
          sx={{
            maxWidth: 850,
            mx: 'auto',
            borderRadius: 3,
            p: { xs: 1, md: 2 },
            bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#fafafa',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <DebitAdviceSlip data={data} ref={printRef} />
        </Card>
      </Grid>

      <PrintStyles />
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'advice-result'
}

export default Page