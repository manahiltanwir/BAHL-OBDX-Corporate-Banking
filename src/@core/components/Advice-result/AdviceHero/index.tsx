import React from 'react'
import { Box, Card, Chip, Grid, IconButton, Stack, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import PrintIcon from '@mui/icons-material/Print'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import VerifiedIcon from '@mui/icons-material/Verified'
import { colors, DebitAdviceData } from '../adviceTheme'

interface AdviceHeroProps {
  data: DebitAdviceData
  downloading: boolean
  onBack: () => void
  onPrint: () => void
  onDownloadPdf: () => void
}

const AdviceHero = ({ data, downloading, onBack, onPrint, onDownloadPdf }: AdviceHeroProps) => (
  <Grid item xs={12} className='no-print'>
    <Card
      variant='elevation'
      elevation={3}
      sx={{
        borderRadius: 4,
        p: { xs: 3, md: 4 },
        border: '1px solid',
        borderColor: 'rgba(21, 128, 79, 0.2)',
        boxShadow: '0 4px 20px 0 rgba(21, 128, 79, 0.15)'
      }}
    >
      <Grid container spacing={3} alignItems='center'>
        <Grid item xs={12} md={7}>
          <Stack direction='row' spacing={1.5} alignItems='center' sx={{ mb: 1.5 }}>
            <IconButton
              onClick={onBack}
              size='small'
              sx={{
                color: 'text.secondary',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': { bgcolor: colors.greenSofter, color: colors.green }
              }}
            >
              <ArrowBackIcon fontSize='small' />
            </IconButton>
            <Chip
              icon={<VerifiedIcon sx={{ color: `${colors.green} !important` }} />}
              label={data.status}
              size='small'
              sx={{
                bgcolor: colors.greenSoft,
                color: colors.green,
                fontWeight: 700,
                fontSize: '0.7rem',
                '& .MuiChip-label': { color: colors.green }
              }}
            />
          </Stack>

          <Typography variant='h5' sx={{ fontWeight: 700, color: 'text.primary' }}>
            Debit Advice
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary', mt: 0.5 }}>
            Against Letter of Credit&nbsp;
            <Box component='span' sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: 0.3 }}>
              {data.lcNumber}
            </Box>
          </Typography>
          <Typography variant='caption' sx={{ color: 'text.disabled' }}>
            Issued to {data.accountTitle} · {data.adviceDate}
          </Typography>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent={{ md: 'flex-end' }}>
            <LoadingButton
              variant='outlined'
              size='large'
              startIcon={<PrintIcon />}
              onClick={onPrint}
            >
              Print
            </LoadingButton>
            <LoadingButton
              variant='contained'
              size='large'
              loading={downloading}
              loadingPosition='start'
              startIcon={<PictureAsPdfIcon />}
              onClick={onDownloadPdf}
              
            >
              Download PDF
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  </Grid>
)

export default AdviceHero