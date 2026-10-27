import { useEffect, useState } from 'react'
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
import toast from 'react-hot-toast'
import ResultsTable from 'src/@core/components/Resultstable'
import useBeneficiary from 'src/@core/hooks/apps/useBeneficiary'
import { useAuth } from 'src/hooks/useAuth'
import { Beneficiary } from 'src/types/apps/beneficiary'

const columns = [
  { key: 'type', label: 'Type' },
  { key: 'name', label: 'Beneficiary Name' },
  { key: 'bank', label: 'Bank' },
  { key: 'accountNumber', label: 'Account Number' },
  { key: 'nickname', label: 'Nickname' },
  { key: 'action', label: 'Action' }
]

const gridTemplateColumns = '1fr 1.8fr 1.8fr 1.8fr 1.3fr 0.7fr'

// ISO date ko "21 Oct 2026" format me badalta hai 
  const formatDate = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-GB', { day: '2-digit', month:
'short', year: 'numeric' })
}

// ** Small helper for the view modal's label/value rows 
const ReviewItem = ({ label, value }: { label: string; value?: string }) => (
  <Grid item xs={12} sm={6}>
    <Typography variant='caption' sx={{ color: 'text.secondary',
textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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

  const {
    user: {
      userProfile: { userId }
    }
  } = useAuth()

  const { beneficiaries, isLoading, fetchBeneficiaries, deleteBeneficiary } = useBeneficiary()

  // View details modal
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null)
  const [viewOpen, setViewOpen] = useState(false)

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<Beneficiary | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (userId) fetchBeneficiaries(userId)
  }, [userId])

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

  try {
    await deleteBeneficiary(deleteTarget.id)
    setDeleteOpen(false)
    setDeleteTarget(null)
  } catch (error) {
    // toast ApiError me dikh chuka hai, dialog khula rahega taake user dobara try kar sake
  } finally {
    setDeleting(false)
  }
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
        getRowKey={beneficiary => String(beneficiary.id)}
        gridTemplateColumns={gridTemplateColumns}
        headerColor={theme.palette.primary.main}
        emptyMessage={isLoading ? 'Loading beneficiaries...' : 'No Beneficiaries Found'}
        onRowClick={handleRowClick}
        renderRow={beneficiary => (
          <>
            <Chip
              label={beneficiary.beneficiaryType}
              size='small'
              color={beneficiary.beneficiaryType === 'INTERNAL' ?
'primary' : 'secondary'}
              variant='outlined'
              sx={{
                fontWeight: 700,
                width: 'fit-content',
                justifySelf: 'start',
                whiteSpace: 'nowrap'
              }}
            />

            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              {beneficiary.beneficiaryName}
            </Typography>

            <Typography variant='body2'>{beneficiary.bankName}</Typography>

            <Typography variant='body2' sx={{ wordBreak: 'break-all' }}>
              {beneficiary.accountInfo}
            </Typography>

            <Typography variant='body2' color={beneficiary.nickname ?
'text.primary' : 'text.secondary'}>
              {beneficiary.nickname || '—'}
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
        <DialogTitle sx={{ display: 'flex', alignItems: 'center',
justifyContent: 'space-between' }}>
          Beneficiary Details
          <IconButton size='small' onClick={handleCloseView}>
            <CloseIcon fontSize='small' />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 4 }}>
          {selectedBeneficiary && (
            <Grid container spacing={4}>
              <ReviewItem label='Beneficiary Type'
value={selectedBeneficiary.beneficiaryType} />
              <ReviewItem label='Beneficiary Name'
value={selectedBeneficiary.beneficiaryName} />
              <ReviewItem label='Bank' value={selectedBeneficiary.bankName} />
              <ReviewItem label='Account Number / IBAN'
value={selectedBeneficiary.accountInfo} />
              <ReviewItem label='Nickname'
value={selectedBeneficiary.nickname} />
              <ReviewItem label='Created On'
value={formatDate(selectedBeneficiary.creationDate)} />
            </Grid>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3 }}>
          <Button variant='outlined' color='secondary'
onClick={handleCloseView}>
            Close
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={() => {
              if (!selectedBeneficiary) return
              const target = selectedBeneficiary
              handleCloseView()
              handleDeleteClick(target)
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
            Are you sure you want to delete <strong>{deleteTarget?.nickname || deleteTarget?.beneficiaryName}</strong>{' '}
            ({deleteTarget?.beneficiaryType}) from your beneficiary list? This action cannot be undone.
          </Typography>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3 }}>
          <Button variant='outlined' color='secondary'
onClick={handleCloseDelete} disabled={deleting}>
            Cancel
          </Button>
          <LoadingButton variant='contained' color='error'
loading={deleting} onClick={handleConfirmDelete}>
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

Page.acl = { action: 'itsHaveAccess', subject:
'beneficiary-management-view-beneficiary-page' }

export default Page