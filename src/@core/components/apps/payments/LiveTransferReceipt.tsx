import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme, alpha, darken } from '@mui/material/styles'
import { Box, Chip, Typography, IconButton, Tooltip, Snackbar, Alert } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import CheckIcon from '@mui/icons-material/Check'

export type ReceiptStage = 'form' | 'review' | 'success'

export interface LiveTransferReceiptProps {
  layoutId?: string
  stage: ReceiptStage
  currency: string
  amount: string
  fromAccountLabel: string
  beneficiaryBank: string
  beneficiaryAccountNumber: string
  beneficiaryName: string
  beneficiaryNameLoading?: boolean
  referenceId?: string
  dateLabel: string
}

const MotionBox = motion(Box)

const Field = ({
  label,
  value,
  empty,
  labelColor,
  valueColor,
  emptyColor
}: {
  label: string
  value: string
  empty?: boolean
  labelColor: string
  valueColor: string
  emptyColor: string
}) => (
  <Box>
    <Typography sx={{ fontSize: '0.72rem', color: labelColor }}>{label}</Typography>
    <Typography
      sx={{
        fontSize: '0.95rem',
        fontWeight: 600,
        mt: 0.4,
        color: empty ? emptyColor : valueColor,
        wordBreak: 'break-word'
      }}
    >
      {value}
    </Typography>
  </Box>
)

const LiveTransferReceipt = ({
  layoutId = 'transfer-receipt',
  stage,
  currency,
  amount,
  fromAccountLabel,
  beneficiaryBank,
  beneficiaryAccountNumber,
  beneficiaryName,
  beneficiaryNameLoading,
  referenceId,
  dateLabel
}: LiveTransferReceiptProps) => {
  const theme = useTheme()
  const isSuccess = stage === 'success'
  const isCentered = stage !== 'form'

  const receiptRef = useRef<HTMLDivElement | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })

  const primaryMain = theme.palette.primary.main
  const primaryDark = darken(primaryMain, 0.25)
  const lineColor = alpha(primaryMain, 0.35)
  const softText = theme.palette.text.secondary
  const emptyColor = alpha(theme.palette.text.primary, 0.32)
  const mainText = theme.palette.text.primary

  const hasAmount = amount !== '' && !Number.isNaN(Number(amount)) && Number(amount) > 0
  const amountDisplay = hasAmount
    ? `${currency} ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    : ''

  const handleDownload = async () => {
    if (!receiptRef.current) return
    setDownloading(true)
    try {
      // Lazy-loaded so it never affects the initial bundle/SSR
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#FFFFFF',
        scale: 2,
        useCORS: true
      })
      const link = document.createElement('a')
      link.download = `transfer-receipt-${referenceId || Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      setToast({ open: true, message: 'Receipt downloaded', severity: 'success' })
    } catch (err) {
      setToast({ open: true, message: 'Could not download receipt. Please try again.', severity: 'error' })
    } finally {
      setDownloading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <MotionBox
        layoutId={layoutId}
        layout
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5
        }}
      >
        <Box
          ref={receiptRef}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            p: { xs: 4, sm: 5 },
            width: isCentered ? { xs: '94vw', sm: 560 } : { xs: '100%', sm: 420 },
            maxWidth: '100%',
            bgcolor: '#FFFFFF',
            color: mainText,
            border: `1px solid ${alpha(primaryMain, 0.15)}`,
            boxShadow: isCentered ? '0 50px 90px -20px rgba(0,0,0,0.35)' : theme.shadows[4]
          }}
        >
          {/* subtle brand-colored security texture, purely decorative */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              backgroundImage: `repeating-linear-gradient(115deg, ${alpha(primaryMain, 0.045)} 0 1.5px, transparent 1.5px 14px)`
            }}
          />

          <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                component='img'
                src='/images/pages/alhabib.png'
                alt='Bank Al Habib'
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  objectFit: 'contain',
                  bgcolor: '#FFFFFF'
                }}
              />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Bank Al Habib</Typography>
                <Typography sx={{ fontSize: '0.76rem', color: softText }}>Corporate Banking</Typography>
              </Box>
            </Box>

            <Chip
              size='small'
              label={isSuccess ? 'Sent' : 'Draft'}
              sx={{
                bgcolor: isSuccess ? alpha(primaryMain, 0.15) : alpha(primaryMain, 0.08),
                color: primaryMain,
                fontWeight: 600
              }}
            />
          </Box>

          <Box sx={{ position: 'relative', mt: 4 }}>
            <Typography sx={{ fontSize: '0.76rem', color: softText }}>Amount</Typography>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: hasAmount ? '2.5rem' : '1.3rem',
                lineHeight: 1.15,
                color: hasAmount ? mainText : emptyColor
              }}
            >
              {amountDisplay || 'Not entered yet'}
            </Typography>
          </Box>

          <Box sx={{ position: 'relative', mt: 3, pt: 2.25, borderTop: `1px dotted ${lineColor}` }}>
            <Typography sx={{ fontSize: '0.76rem', color: softText }}>Pay to the order of</Typography>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: beneficiaryName ? '1.35rem' : '1rem',
                mt: 0.3,
                color: beneficiaryName ? mainText : emptyColor
              }}
            >
              {beneficiaryNameLoading ? 'Verifying name…' : beneficiaryName || 'Beneficiary name'}
            </Typography>
          </Box>

          <Box
            sx={{
              position: 'relative',
              mt: 3,
              pt: 2.25,
              borderTop: `1px dotted ${lineColor}`,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 3
            }}
          >
            <Field label='From account' value={fromAccountLabel || '—'} empty={!fromAccountLabel} labelColor={softText} valueColor={mainText} emptyColor={emptyColor} />
            <Field label='Beneficiary bank' value={beneficiaryBank} labelColor={softText} valueColor={mainText} emptyColor={emptyColor} />
            <Field
              label='Account number'
              value={beneficiaryAccountNumber || '—'}
              empty={!beneficiaryAccountNumber}
              labelColor={softText}
              valueColor={mainText}
              emptyColor={emptyColor}
            />
            <Field label='Date' value={dateLabel} labelColor={softText} valueColor={mainText} emptyColor={emptyColor} />
          </Box>

          <Box
            sx={{
              position: 'relative',
              mt: 3,
              pt: 2.25,
              borderTop: `1px dotted ${lineColor}`,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: softText
            }}
          >
            <span>Reference</span>
            <span style={{ fontFamily: 'monospace' }}>{referenceId || '•••• ••••'}</span>
          </Box>

          {/* ---------------- POLISHED SEAL / STAMP ---------------- */}
          {isSuccess && (
            <MotionBox
              initial={{ scale: 1.8, opacity: 0, rotate: -18 }}
              animate={{ scale: 1, opacity: 1, rotate: -12 }}
              transition={{ type: 'spring', stiffness: 240, damping: 14, delay: 0.2 }}
              sx={{
                position: 'absolute',
                right: 18,
                bottom: 56,
                width: 128,
                height: 128,
                pointerEvents: 'none'
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: primaryMain,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: `2.5px solid ${primaryMain}`
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 7,
                    borderRadius: '50%',
                    border: `1px dashed ${alpha(primaryMain, 0.55)}`
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.4
                  }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      bgcolor: primaryMain,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 18, color: '#fff' }} />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.62rem',
                      letterSpacing: 1.2,
                      lineHeight: 1.2,
                      textAlign: 'center'
                    }}
                  >
                    PAYMENT
                    <br />
                    SENT
                  </Typography>
                </Box>
              </Box>
            </MotionBox>
          )}
        </Box>

        {/* ---------------- SAVE / DOWNLOAD ACTIONS ---------------- */}
        {isSuccess && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            sx={{
              display: 'flex',
              gap: 1,
              '@media print': { display: 'none' }
            }}
          >
            <Tooltip title='Download as image'>
              <IconButton
                onClick={handleDownload}
                disabled={downloading}
                sx={{
                  bgcolor: alpha('#fff', 0.9),
                  border: `1px solid ${alpha(primaryMain, 0.25)}`,
                  '&:hover': { bgcolor: '#fff' }
                }}
              >
                <DownloadIcon fontSize='small' sx={{ color: primaryMain }} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Print / Save as PDF'>
              <IconButton
                onClick={handlePrint}
                sx={{
                  bgcolor: alpha('#fff', 0.9),
                  border: `1px solid ${alpha(primaryMain, 0.25)}`,
                  '&:hover': { bgcolor: '#fff' }
                }}
              >
                <PrintOutlinedIcon fontSize='small' sx={{ color: primaryMain }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </MotionBox>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} variant='filled' sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default LiveTransferReceipt