import { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import CloseIcon from '@mui/icons-material/Close'
import LoadingButton from '@mui/lab/LoadingButton'
import ResultsTable from 'src/@core/components/Resultstable'

type BeneficiaryType = 'ft' | 'oftt'

interface Beneficiary {
  id: string
  type: BeneficiaryType
  name: string
  bank: string
  accountNumber: string
  nickname?: string
}

const mockBeneficiaries: Beneficiary[] = [
  { id: '1', type: 'ft', name: 'Ali Raza', bank: 'Bank Al Habib', accountNumber: 'PK27BAHL6002098102054201', nickname: 'Ali Bhai' },
  { id: '2', type: 'oftt', name: 'Sara Khan', bank: 'UBL - United Bank Limited', accountNumber: 'PK27BAHL6002098102054208', nickname: 'Office Rent' },
  { id: '3', type: 'ft', name: 'Ahmed Hussain', bank: 'HBL - Habib Bank Limited', accountNumber: 'PK27BAHL6002098102054209' }
]

const beneficiaryTypeLabels: Record<BeneficiaryType, string> = {
  ft: 'FT',
  oftt: 'OFTT'
}

const columns = [
  { key: 'type', label: 'Type' },
  { key: 'name', label: 'Beneficiary Name' },
  { key: 'bank', label: 'Bank' },
  { key: 'accountNumber', label: 'Account Number' },
  { key: 'nickname', label: 'Nickname' },
  { key: 'action', label: 'Action' }
]

const gridTemplateColumns = '1fr 1.8fr 1.8fr 1.8fr 1.3fr 0.7fr'

// ** Small helper for the view modal's label/value rows
const ReviewItem = ({ label, value }: { label: string; value?: string }) => (
  <Grid item xs={12} sm={6}>
    <Typography variant='caption' sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}
    </Typography>
    <Typography variant='body2' sx={{ fontWeight: 500, mt: 0.5 }}>
      {value || '—'}
    </Typography>
  </Grid>
)

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

const Page = () => {
  const theme = useTheme()

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(mockBeneficiaries)

  // View details modal
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null)
  const [viewOpen, setViewOpen] = useState(false)

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<Beneficiary | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleRowClick = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary)
    setViewOpen(true)
  }

  const handleCloseView = () => {
    setViewOpen(false)
    setSelectedBeneficiary(null)
  }

  const handleDeleteClick = (beneficiary: Beneficiary) => {
    setDeleteTarget(beneficiary)
    setDeleteOpen(true)
  }

  const handleCloseDelete = () => {
    if (deleting) return
    setDeleteOpen(false)
    setDeleteTarget(null)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)

    await new Promise(resolve => setTimeout(resolve, 700))

    setBeneficiaries(prev => prev.filter(b => b.id !== deleteTarget.id))
    setDeleting(false)
    setDeleteOpen(false)
    setDeleteTarget(null)
  }

  return (
    <Box>
      <Typography variant='h5' sx={{ fontWeight: 700, mb: 1 }}>
        View Beneficiary
      </Typography>
      <Typography variant='body2' color='text.secondary'>
        View and manage your saved beneficiaries.
      </Typography>

      <ResultsTable<Beneficiary>
        columns={columns}
        rows={beneficiaries}
        getRowKey={beneficiary => beneficiary.id}
        gridTemplateColumns={gridTemplateColumns}
        headerColor={theme.palette.primary.main}
        emptyMessage='No Beneficiaries Found'
        onRowClick={handleRowClick}
        renderRow={beneficiary => (
          <>
            <Chip
              label={beneficiaryTypeLabels[beneficiary.type]}
              size='small'
              color={beneficiary.type === 'ft' ? 'primary' : 'secondary'}
              variant='outlined'
              sx={{
                fontWeight: 700,
                width: 'fit-content',
                justifySelf: 'start',
                whiteSpace: 'nowrap'
              }}
            />

            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              {beneficiary.name}
            </Typography>

            <Typography variant='body2'>{beneficiary.bank}</Typography>

            <Typography variant='body2' sx={{ wordBreak: 'break-all' }}>
              {beneficiary.accountNumber}
            </Typography>

            <Typography variant='body2' color={beneficiary.nickname ? 'text.primary' : 'text.secondary'}>
              {beneficiary.nickname ?? '—'}
            </Typography>

            <IconButton
              size='small'
              color='error'
              onClick={event => {
                event.stopPropagation()
                handleDeleteClick(beneficiary)
              }}
              sx={{
                justifySelf: 'center',
                width: 34,
                height: 34
              }}
            >
              <DeleteOutlineIcon fontSize='small' />
            </IconButton>
          </>
        )}
      />

      <Dialog open={viewOpen} onClose={handleCloseView} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Beneficiary Details
          <IconButton size='small' onClick={handleCloseView}>
            <CloseIcon fontSize='small' />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 4 }}>
          {selectedBeneficiary && (
            <Grid container spacing={4}>
              <ReviewItem label='Beneficiary Type' value={beneficiaryTypeLabels[selectedBeneficiary.type]} />
              <ReviewItem label='Beneficiary Name' value={selectedBeneficiary.name} />
              <ReviewItem label='Bank' value={selectedBeneficiary.bank} />
              <ReviewItem label='Account Number / IBAN' value={selectedBeneficiary.accountNumber} />
              <ReviewItem label='Nickname' value={selectedBeneficiary.nickname} />
            </Grid>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3 }}>
          <Button variant='outlined' color='secondary' onClick={handleCloseView}>
            Close
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={() => {
              if (!selectedBeneficiary) return
              handleCloseView()
              handleDeleteClick(selectedBeneficiary)
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onClose={handleCloseDelete} maxWidth='xs' fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonOutlineIcon color='error' />
          Delete Beneficiary
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 4 }}>
          <Typography>
            Are you sure you want to delete <strong>{deleteTarget?.nickname || deleteTarget?.name}</strong>{' '}
            ({deleteTarget ? beneficiaryTypeLabels[deleteTarget.type] : ''}) from your beneficiary list? This action
            cannot be undone.
          </Typography>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3 }}>
          <Button variant='outlined' color='secondary' onClick={handleCloseDelete} disabled={deleting}>
            Cancel
          </Button>
          <LoadingButton variant='contained' color='error' loading={deleting} onClick={handleConfirmDelete}>
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

Page.acl = { action: 'itsHaveAccess', subject: 'view-beneficiary' }

export default Page