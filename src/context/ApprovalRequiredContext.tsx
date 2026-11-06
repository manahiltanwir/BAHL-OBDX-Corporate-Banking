import React, { createContext, useState, useEffect } from 'react'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DialogActions } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { alpha, useTheme } from '@mui/material/styles'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import LoadingButton from '@mui/lab/LoadingButton'

interface ApprovalRequiredContextType {
  triggerGlobalApprovalRequired: (retryConfig: any, successInstance: any) => Promise<any>
}

const ApprovalRequiredContext = createContext<ApprovalRequiredContextType | undefined>(undefined)

let triggerApprovalFormOutsideReact: ((retryConfig: any, successInstance: any) => Promise<any>) | null = null

export const triggerGlobalApprovalRequired = (retryConfig: any, successInstance: any) => {
  if (triggerApprovalFormOutsideReact) {
    return triggerApprovalFormOutsideReact(retryConfig, successInstance)
  }
  return Promise.resolve(successInstance)
}

export const ApprovalRequiredProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [resolver, setResolver] = useState<any>(null)

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }

    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [open])

  const triggerGlobalApproval = (retryConfig: any, successInstance: any) => {
    setOpen(true)
    debugger
    setResponse(successInstance?.data || null)

    return new Promise(resolve => {
      setResolver({ resolve, originalResponse: successInstance })
    })
  }

  triggerApprovalFormOutsideReact = triggerGlobalApproval

  const handleClose = () => {
    setOpen(false)
    if (resolver) {
      resolver.resolve(resolver.originalResponse)
    }
  }

  const primaryColor = theme.palette.success.main || 'green'

  type Tone = 'success' | 'warning' | 'error' | 'info'
  const getTone = (status?: string): Tone => {
    const s = (status || '').toUpperCase()

    if (['SUCCESS', 'SUCCESSFUL', 'APPROVED', 'COMPLETED', 'PROCESSED'].includes(s)) return 'success'
    if (s.includes('PENDING') || s.includes('QUEUED') || s.includes('PROCESSING')) return 'warning'
    if (['FAILED', 'FAILURE', 'ERROR', 'REJECTED', 'DECLINED'].includes(s)) return 'error'

    return 'info'
  }

  const tone = getTone(response?.status)
  const color = theme.palette[tone].main

  const toneIcons: Record<Tone, React.ReactNode> = {
    success: <CheckCircleOutlineIcon sx={{ fontSize: 40 }} />,
    warning: <HourglassEmptyIcon sx={{ fontSize: 40 }} />,
    error: <ErrorOutlineIcon sx={{ fontSize: 40 }} />,
    info: <InfoOutlinedIcon sx={{ fontSize: 40 }} />
  }

  const formatStatus = (status?: string) =>
    (status || 'Unknown')
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  return (
    <ApprovalRequiredContext.Provider value={{ triggerGlobalApprovalRequired: triggerGlobalApproval }}>
      {children}
      <Dialog
        open={open}
        fullWidth
        maxWidth='xs'
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: 'none',
            minHeight: '500px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 3
          }
        }}
        disableScrollLock={false}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden'
            }
          }
        }}
      >
        <Box
          sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
          <DialogContent sx={{ pt: 4, textAlign: 'center' }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                mx: 'auto',
                mb: 2,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color,
                bgcolor: alpha(color, 0.12)
              }}
            >
              {toneIcons[tone]}
            </Box>

            <Typography
              sx={{
                display: 'inline-block',
                px: 2,
                py: 0.5,
                mb: 2,
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: 0.5,
                color,
                bgcolor: alpha(color, 0.12)
              }}
            >
              {formatStatus(response?.status) || 'PENDING APPROVAL'}
            </Typography>

            <Typography variant='body1' sx={{ fontWeight: 500 }}>
              {response?.message || 'Transaction submitted successfully for verification.'}
            </Typography>

            {response?.transactionReference && (
              <Box
                sx={{
                  mt: 3,
                  p: 1.5,
                  borderRadius: 1.5,
                  bgcolor: theme.palette.action.hover,
                  wordBreak: 'break-all'
                }}
              >
                <Typography variant='caption' color='text.secondary' sx={{ display: 'block' }}>
                  Transaction Reference
                </Typography>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {response?.transactionReference}
                </Typography>
              </Box>
            )}
          </DialogContent>
        </Box>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
          <LoadingButton
            fullWidth
            variant='contained'
            size='large'
            startIcon={<CloseIcon />}
            onClick={handleClose}
            sx={{ minWidth: 140, height: 50, mt: 2, borderRadius: '10px', fontWeight: 600 }}
            color='warning'
          >
            Close
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </ApprovalRequiredContext.Provider>
  )
}
