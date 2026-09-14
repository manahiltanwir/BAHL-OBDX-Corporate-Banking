import React, { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DownloadIcon from '@mui/icons-material/Download'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import LoadingButton from '@mui/lab/LoadingButton'

const colors = {
  green: '#10b981',
  greenHover: '#059669',
  greenSoft: 'rgba(16, 185, 129, 0.08)',
  greenBorder: 'rgba(16, 185, 129, 0.25)',
  red: '#ef4444',
  redSoft: 'rgba(239, 68, 68, 0.08)',
  redBorder: 'rgba(239, 68, 68, 0.25)'
}

// ---------- Types ----------
interface BulkRecord {
  transferFrom: string
  toAccountIban: string
  amount: number
  currency: string
  beneficiary: string
  country: string
  purpose: string
  relationship: string
}

interface ValidatedRecord {
  record: BulkRecord
  errors: string[]
}

// ---------- Master account options ----------
// TODO: yeh dropdown real API / lookup data se replace karein
const transferFromAccounts = [
  {
    value: 'acc-001',
    iban: 'PK36BAHL0000123456789001',
    label: 'PK36BAHL0000123456789001 - PKR Account',
    currency: 'PKR',
    balance: 45000000
  },
  {
    value: 'acc-002',
    iban: 'PK36BAHL0000123456789002',
    label: 'PK36BAHL0000123456789002 - FCY Account',
    currency: 'USD',
    balance: 250000
  }
]

// ---------- Expected CSV format ----------
const expectedHeaders = [
  'Transfer From',
  'To Account Number/IBAN',
  'Amount',
  'Currency',
  'Beneficiary',
  'Country',
  'Purpose',
  'Relationship'
]

const parseCsvLine = (line: string): string[] => {
  const regex = /(?:"([^"]*)")|([^,]+)/g
  const row: string[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(line)) !== null) {
    row.push(match[1] !== undefined ? match[1] : match[2].trim())
  }

  return row
}

// Header row ko expected format se strictly compare karta hai.
// Extra column (jaise Attachment) ya missing/renamed column -> mismatch.
const validateHeader = (headerLine: string): { valid: boolean; found: string[] } => {
  const found = parseCsvLine(headerLine).map(h => h.trim())

  const normalize = (arr: string[]) => arr.map(h => h.toLowerCase().replace(/\s+/g, ' ').trim())

  const isValid =
    found.length === expectedHeaders.length &&
    normalize(found).every((h, index) => h === normalize(expectedHeaders)[index])

  return { valid: isValid, found }
}

// ---------- Helpers ----------
// TODO: is validation logic ko backend rules ke sath align/replace karein
const validateRecord = (rec: BulkRecord): string[] => {
  const errors: string[] = []

  if (!rec.toAccountIban || rec.toAccountIban.trim() === '') errors.push('Account/IBAN is required.')
  else if (rec.toAccountIban.length < 10) errors.push('Account/IBAN length too short.')

  if (Number.isNaN(rec.amount) || rec.amount <= 0) errors.push('Amount must be > 0.')
  if (!rec.beneficiary || rec.beneficiary.trim().length < 2) errors.push('Beneficiary name missing.')
  if (!rec.country || rec.country.trim() === '') errors.push('Country is required.')
  if (!rec.purpose || rec.purpose.trim() === '') errors.push('Purpose is required.')
  if (!rec.relationship || rec.relationship.trim() === '') errors.push('Relationship is required.')

  return errors
}

// CSV parser: quoted-field aware, header row skip karta hai.
const parseCSV = (text: string): BulkRecord[] => {
  const lines = text.trim().split(/\r\n|\n/)
  if (lines.length < 2) return []

  const result: BulkRecord[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const row = parseCsvLine(line)

    if (row.length >= 7) {
      result.push({
        transferFrom: row[0] || '',
        toAccountIban: row[1] || '',
        amount: parseFloat(row[2]) || 0,
        currency: row[3] || 'Pakistan Rupee',
        beneficiary: row[4] || '',
        country: row[5] || '',
        purpose: row[6] || '',
        relationship: row[7] || ''
      })
    }
  }

  return result
}

// ---------- Styled ----------
const StyledFormCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4.25),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2]
}))

const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  textTransform: 'uppercase',
  letterSpacing: '0.75px',
  color: theme.palette.text.secondary,
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}))

const StyledDropzone = styled(Box)<{ dragActive: number }>(({ theme, dragActive }) => ({
  position: 'relative',
  border: `2px dashed ${dragActive ? colors.green : colors.greenBorder}`,
  backgroundColor: dragActive ? colors.greenSoft : 'rgba(16, 185, 129, 0.03)',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(6, 3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  '&:hover': { backgroundColor: colors.greenSoft }
}))

const Page = () => {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [masterAccount, setMasterAccount] = useState('')
  const [batchReference] = useState(`BATCH-OFTT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`)

  const selectedAccount = transferFromAccounts.find(account => account.value === masterAccount)

  const [records, setRecords] = useState<BulkRecord[]>([])
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState('')
  const [fileError, setFileError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const validatedRecords: ValidatedRecord[] = useMemo(
    () => records.map(record => ({ record, errors: validateRecord(record) })),
    [records]
  )

  const validCount = validatedRecords.filter(r => r.errors.length === 0).length
  const errorCount = validatedRecords.length - validCount
  const totalAmount = validatedRecords
    .filter(r => r.errors.length === 0)
    .reduce((sum, r) => sum + r.record.amount, 0)

  const canSubmit = validatedRecords.length > 0 && errorCount === 0

  const loadFile = (file: File) => {
    const reader = new FileReader()

    reader.onload = event => {
      const text = (event.target?.result as string) ?? ''
      const lines = text.trim().split(/\r\n|\n/)

      setFileName(file.name)
      setFileSize(`${(file.size / 1024).toFixed(1)} KB`)

      if (lines.length === 0 || lines[0].trim() === '') {
        setRecords([])
        setFileError('This file appears to be empty.')
        return
      }

      const { valid, found } = validateHeader(lines[0])

      if (!valid) {
        setRecords([])
        setFileError(
          `Unsupported CSV format. Found columns: ${found.join(', ')}. ` +
            `The required columns are: ${expectedHeaders.join(', ')}. ` +
            `Please download the reference sample file, fill it exactly in that format, and upload again.`
        )
        return
      }

      setFileError(null)
      setRecords(parseCSV(text))
    }

    reader.readAsText(file)
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) loadFile(file)
    event.target.value = ''
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragActive(false)
    const file = event.dataTransfer.files?.[0]
    if (file) loadFile(file)
  }

  const handleClearFile = () => {
    setRecords([])
    setFileName('')
    setFileSize('')
    setFileError(null)
  }

  const handleCancel = () => {
    router.push('/Corporate-InnerPages/International-Payments/bulk-payment')
  }

  const handleDownloadSampleFile = () => {
    const headers = [
      'Transfer From',
      'To Account Number/IBAN',
      'Amount',
      'Currency',
      'Beneficiary',
      'Country',
      'Purpose',
      'Relationship'
    ]

    const csvContent = headers.join(',') + '\r\n'
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'bulk_payment_sample.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleSubmit = async () => {
    if (!canSubmit) return

    // TODO: is poore body ko real API call se replace karein, e.g.:
    // await axios.post('/api/payments/bulk', { masterAccount, batchReference, records })
    setSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
    } finally {
      setSubmitting(false)
    }
  }

  const validPercent = validatedRecords.length > 0 ? Math.round((validCount / validatedRecords.length) * 100) : 0

  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            startIcon={<ArrowBackIcon fontSize='small' />}
            onClick={handleCancel}
            sx={{ color: 'text.secondary' }}
          >
            Back
          </Button>
          <Typography variant='h5' sx={{ fontWeight: 700 }}>
            Bulk Payment
          </Typography>
        </Box>
      </Grid>

      {/* Master Source Account */}
      <Grid item xs={12}>
        <StyledFormCard>
          <StyledSectionTitle>
            <AccountBalanceIcon sx={{ fontSize: 18 }} />
            Default Transfer Source Account
          </StyledSectionTitle>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                size='small'
                label='Transfer From (Master Account)'
                value={masterAccount}
                onChange={event => setMasterAccount(event.target.value)}
              >
                {transferFromAccounts.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size='small'
                label='Available Balance'
                value={
                  selectedAccount
                    ? `${selectedAccount.currency} ${selectedAccount.balance.toLocaleString('en-US', {
                        minimumFractionDigits: 2
                      })}`
                    : 'Select an account'
                }
                InputProps={{ readOnly: true }}
                sx={{
                  '& .MuiInputBase-input': {
                    fontWeight: 700,
                    color: selectedAccount ? colors.green : 'text.disabled'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size='small'
                label='Batch Reference'
                value={batchReference}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </StyledFormCard>
      </Grid>

      {/* CSV Upload */}
      <Grid item xs={12}>
        <StyledFormCard>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1.5,
              mb: 3
            }}
          >
            <StyledSectionTitle sx={{ mb: 0 }}>
              <InsertDriveFileIcon sx={{ fontSize: 18 }} />
              Upload Bulk Transfer CSV File
            </StyledSectionTitle>

            <Button
              size='small'
              variant='outlined'
              startIcon={<DownloadIcon fontSize='small' />}
              onClick={handleDownloadSampleFile}
              sx={{ color: colors.green, borderColor: colors.green, '&:hover': { borderColor: colors.greenHover } }}
            >
              Download Sample File
            </Button>
          </Box>

          {!fileName ? (
            <StyledDropzone
              dragActive={dragActive ? 1 : 0}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={event => {
                event.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <input ref={fileInputRef} type='file' accept='.csv' hidden onChange={handleFileInputChange} />

              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: colors.green,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1.5
                }}
              >
                <CloudUploadIcon sx={{ color: '#fff' }} />
              </Box>
              <Typography sx={{ fontWeight: 700 }}>Drag & drop your CSV file here, or click to browse</Typography>
              <Typography variant='caption' color='text.secondary'>
                Submission is disabled if any record contains errors
              </Typography>
            </StyledDropzone>
          ) : (
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
                bgcolor: fileError ? colors.redSoft : colors.greenSoft,
                border: `1px solid ${fileError ? colors.redBorder : colors.greenBorder}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: fileError ? colors.red : colors.green,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {fileError ? (
                      <WarningAmberIcon sx={{ color: '#fff', fontSize: 20 }} />
                    ) : (
                      <InsertDriveFileIcon sx={{ color: '#fff', fontSize: 20 }} />
                    )}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{fileName}</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {fileError ? fileSize : `${fileSize} \u2022 ${validatedRecords.length} records parsed`}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Chip
                    size='small'
                    icon={fileError ? <CancelIcon sx={{ fontSize: 16 }} /> : <CheckCircleIcon sx={{ fontSize: 16 }} />}
                    label={fileError ? 'Rejected' : 'Parsed'}
                    sx={{
                      bgcolor: '#fff',
                      color: fileError ? colors.red : colors.green,
                      fontWeight: 600,
                      border: `1px solid ${fileError ? colors.redBorder : colors.greenBorder}`
                    }}
                  />
                  <IconButton size='small' onClick={handleClearFile} sx={{ color: 'text.secondary' }}>
                    <DeleteOutlineIcon fontSize='small' />
                  </IconButton>
                </Box>
              </Box>

              {fileError && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flexWrap: 'wrap' }}>
                  <Typography variant='body2' sx={{ color: colors.red, flex: 1, minWidth: 240 }}>
                    {fileError}
                  </Typography>
                  <Button
                    size='small'
                    variant='contained'
                    startIcon={<DownloadIcon fontSize='small' />}
                    onClick={handleDownloadSampleFile}
                    sx={{ bgcolor: colors.red, '&:hover': { bgcolor: '#dc2626' }, flexShrink: 0 }}
                  >
                    Download Sample File
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </StyledFormCard>
      </Grid>

      {/* Validation Table */}
      <Grid item xs={12}>
        <StyledFormCard sx={{ p: 0, overflow: 'hidden' }}>
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
                mb: validatedRecords.length > 0 ? 2 : 0
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem' }}>CSV Validation Summary</Typography>
                <Typography variant='caption' color='text.secondary'>
                  All errors must be resolved in the CSV before transfers can be processed
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  size='small'
                  icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                  label={`${validCount} Valid`}
                  sx={{ bgcolor: colors.greenSoft, color: colors.green, fontWeight: 700 }}
                />
                <Chip
                  size='small'
                  icon={<CancelIcon sx={{ fontSize: 14 }} />}
                  label={`${errorCount} Errors`}
                  sx={{ bgcolor: colors.redSoft, color: colors.red, fontWeight: 700 }}
                />
              </Box>
            </Box>

            {validatedRecords.length > 0 && (
              <LinearProgress
                variant='determinate'
                value={validPercent}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: colors.redSoft,
                  '& .MuiLinearProgress-bar': { bgcolor: colors.green, borderRadius: 3 }
                }}
              />
            )}
          </Box>

          <Divider />

          <TableContainer sx={{ maxHeight: 480 }}>
            <Table size='small' stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    'Row',
                    'Status',
                    'To Account / IBAN',
                    'Beneficiary',
                    'Amount',
                    'Currency',
                    'Country',
                    'Purpose',
                    'Relationship',
                    'Validation Errors'
                  ].map(header => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.6875rem',
                        textTransform: 'uppercase',
                        bgcolor: 'background.paper'
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {validatedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align='center' sx={{ py: 6, color: 'text.disabled', fontStyle: 'italic' }}>
                      {fileError
                        ? 'File format rejected. Fix the error above and re-upload.'
                        : 'No records loaded yet. Upload a CSV file to validate.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  validatedRecords.map(({ record, errors }, index) => {
                    const isValid = errors.length === 0

                    return (
                      <TableRow
                        key={index}
                        sx={{ bgcolor: isValid ? 'transparent' : colors.redSoft, verticalAlign: 'top' }}
                      >
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>#{index + 1}</TableCell>
                        <TableCell>
                          {isValid ? (
                            <Chip
                              size='small'
                              icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                              label='Valid'
                              sx={{ bgcolor: colors.greenSoft, color: colors.green, fontWeight: 600 }}
                            />
                          ) : (
                            <Chip
                              size='small'
                              icon={<CancelIcon sx={{ fontSize: 14 }} />}
                              label={`${errors.length} Error(s)`}
                              sx={{ bgcolor: '#fff', color: colors.red, fontWeight: 600, border: `1px solid ${colors.redBorder}` }}
                            />
                          )}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: 'monospace',
                            color: record.toAccountIban.length >= 10 ? 'text.primary' : colors.red,
                            fontWeight: record.toAccountIban.length >= 10 ? 400 : 700
                          }}
                        >
                          {record.toAccountIban || 'EMPTY'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: record.beneficiary ? 'text.primary' : colors.red }}>
                          {record.beneficiary || 'MISSING'}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: record.amount > 0 ? 'text.primary' : colors.red
                          }}
                        >
                          {record.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>{record.currency}</TableCell>
                        <TableCell>{record.country || 'N/A'}</TableCell>
                        <TableCell>{record.purpose || 'N/A'}</TableCell>
                        <TableCell>{record.relationship || 'N/A'}</TableCell>
                        <TableCell>
                          {errors.length > 0 ? (
                            <Box component='ul' sx={{ m: 0, pl: 2, color: colors.red, fontSize: '0.6875rem' }}>
                              {errors.map((err, errIndex) => (
                                <li key={errIndex}>{err}</li>
                              ))}
                            </Box>
                          ) : (
                            <Typography
                              variant='caption'
                              sx={{ color: colors.green, display: 'flex', alignItems: 'center', gap: 0.5 }}
                            >
                              <CheckCircleIcon sx={{ fontSize: 14 }} /> Passed
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer: totals + submit */}
          <Divider />
          <Box
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: colors.greenSoft,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ReceiptLongIcon sx={{ color: colors.green, fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant='caption' color='text.secondary' sx={{ textTransform: 'uppercase', display: 'block' }}>
                    Total Records
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>{validatedRecords.length} Transactions</Typography>
                </Box>
              </Box>

              <Divider orientation='vertical' flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

              <Box>
                <Typography variant='caption' color='text.secondary' sx={{ textTransform: 'uppercase', display: 'block' }}>
                  Total Valid Amount
                </Typography>
                <Typography sx={{ fontWeight: 700, color: colors.green }}>
                  PKR {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Box>

            <LoadingButton
              variant='contained'
              loadingPosition='end'
              loading={submitting}
              disabled={!canSubmit}
              startIcon={<SendIcon fontSize='small' />}
              onClick={handleSubmit}
              sx={{
                // bgcolor: colors.green,
                // '&:hover': { bgcolor: colors.greenHover },
                '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'text.disabled' }
              }}
            >
              {errorCount > 0 ? `Fix ${errorCount} Error(s) to Enable` : `Process ${validCount} Valid Transfers`}
            </LoadingButton>
          </Box>
        </StyledFormCard>
      </Grid>

      {/* Actions */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant='outlined' sx={{ borderColor: 'divider', color: 'text.primary' }} onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'bulk-payment'
}

export default Page