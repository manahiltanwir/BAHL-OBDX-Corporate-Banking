import { useState } from 'react'

// ** Store
import { useDispatch } from 'react-redux'

// ** MUI
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import { alpha, Theme } from '@mui/material/styles'

// ** Hooks / Actions / Types
import { useAuth } from 'src/hooks/useAuth'
import { AppDispatch } from 'src/store'
import { updateAction } from 'src/store/apps/transaction-aspects'
import { IAspect, IAspectUpdatePayload, ITransactionAspects } from 'src/types/apps/transactionAspects'

interface TransactionAspectsPanelProps {
  transactions: ITransactionAspects[]
  enterpriseRoleId: number | string
  isLoading?: boolean
  onBack: () => void
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`

const isEnabledOnServer = (aspect: IAspect) => aspect.isEnabled === 'Y'

export const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <Card variant='outlined' sx={{ borderStyle: 'dashed', borderRadius: 2, py: 8, px: 3, textAlign: 'center' }}>
    <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{title}</Typography>
    <Typography variant='body2' color='text.secondary'>
      {description}
    </Typography>
  </Card>
)

const TransactionAspectsPanel = ({
  transactions,
  enterpriseRoleId,
  isLoading = false,
  onBack
}: TransactionAspectsPanelProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    user: { username }
  } = useAuth()

  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  // aspect id -> staged value. Only holds aspects that differ from what the server has.
  const [pending, setPending] = useState<Record<number, boolean>>({})

  const isOn = (aspect: IAspect) => pending[aspect.id] ?? isEnabledOnServer(aspect)
  const isChanged = (aspect: IAspect) => aspect.id in pending

  const applyTarget = (draft: Record<number, boolean>, aspect: IAspect, target: boolean) => {
    if (target === isEnabledOnServer(aspect)) delete draft[aspect.id]
    else draft[aspect.id] = target
  }

  const toggleAspect = (aspect: IAspect) =>
    setPending(previous => {
      const next = { ...previous }
      applyTarget(next, aspect, !(previous[aspect.id] ?? isEnabledOnServer(aspect)))

      return next
    })

  const setAllAspects = (aspects: IAspect[], target: boolean) =>
    setPending(previous => {
      const next = { ...previous }
      aspects.forEach(aspect => applyTarget(next, aspect, target))

      return next
    })

  // Only the transactions that are currently selected can contribute changes.
  const changes: IAspectUpdatePayload[] = transactions.flatMap(transaction =>
    (transaction.aspects ?? []).filter(isChanged).map(
      (aspect): IAspectUpdatePayload => ({
        aspectId: aspect.id,
        isEnabled: pending[aspect.id] ? 'Y' : 'N',
        updatedBy: username
      })
    )
  )
  const changedTransactionCount = transactions.filter(transaction => (transaction.aspects ?? []).some(isChanged)).length

  const allAspects = transactions.flatMap(transaction => transaction.aspects ?? [])
  const enabledCount = allAspects.filter(isOn).length

  const handleCancel = () => {
    setPending({})
    setIsEdit(false)
  }

  const handleSave = async () => {
    if (changes.length === 0 || isSaving) return

    setIsSaving(true)
    try {
      await dispatch(updateAction({ id: String(enterpriseRoleId), data: changes })).unwrap()
      setPending({})
      setIsEdit(false)
    } catch (error) {
      // The thunk already shows the error toast. Stay in edit mode so nothing the user staged is lost.
    } finally {
      setIsSaving(false)
    }
  }

  const summary =
    transactions.length === 0
      ? '0 transactions selected'
      : isEdit
      ? changes.length > 0
        ? `${plural(changes.length, 'unsaved change')} in ${plural(changedTransactionCount, 'transaction')}`
        : 'No changes yet. Toggle an aspect to get started.'
      : `${plural(transactions.length, 'transaction')} · ${enabledCount} of ${plural(
          allAspects.length,
          'aspect'
        )} enabled`

  return (
    <Box>
      {transactions.length === 0 ? (
        <EmptyState
          title={isLoading ? 'Loading transactions...' : 'No transactions selected'}
          description={
            isLoading
              ? 'Fetching the transactions for this enterprise role.'
              : 'Choose one or more transactions above to view and edit their aspects.'
          }
        />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }
          }}
        >
          {transactions.map(transaction => {
            const aspects = transaction.aspects ?? []
            const changedCount = aspects.filter(isChanged).length
            const enabledInTransaction = aspects.filter(isOn).length

            return (
              <Card
                key={transaction.taskServiceId}
                variant='outlined'
                sx={{ borderRadius: 2, borderColor: changedCount > 0 ? 'warning.main' : 'divider' }}
              >
                <Box
                  sx={{
                    px: 2.5,
                    py: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 1
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, color: 'primary.main', wordBreak: 'break-word' }}>
                      {transaction.operationName}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {enabledInTransaction} of {plural(aspects.length, 'aspect')} enabled
                    </Typography>
                  </Box>
                  {changedCount > 0 && <Chip size='small' color='warning' label={`${changedCount} changed`} />}
                </Box>
                <Divider />

                {aspects.length === 0 ? (
                  <Typography variant='body2' color='text.secondary' sx={{ px: 2.5, py: 3 }}>
                    No aspects configured for this transaction.
                  </Typography>
                ) : (
                  aspects.map(aspect => (
                    <FormControlLabel
                      key={aspect.id}
                      labelPlacement='start'
                      disabled={!isEdit || isSaving}
                      control={<Switch checked={isOn(aspect)} onChange={() => toggleAspect(aspect)} />}
                      label={aspect.aspect?.replace(/-/g, ' ')}
                      sx={{
                        m: 0,
                        px: 2.5,
                        py: 0.5,
                        width: '100%',
                        justifyContent: 'space-between',
                        borderBottom: 1,
                        borderColor: 'divider',
                        '&:last-of-type': { borderBottom: 0 },
                        bgcolor: isChanged(aspect) ? (theme: Theme) => alpha(theme.palette.warning.main, 0.1) : 'transparent',
                        '& .MuiFormControlLabel-label': { textTransform: 'capitalize', fontWeight: 500 },
                        // keep labels readable in view mode, only the switch looks disabled
                        '& .MuiFormControlLabel-label.Mui-disabled': { color: 'text.primary' }
                      }}
                    />
                  ))
                )}

                {isEdit && aspects.length > 1 && (
                  <Box sx={{ display: 'flex', gap: 1, px: 2, py: 1, borderTop: 1, borderColor: 'divider' }}>
                    <Button size='small' disabled={isSaving} onClick={() => setAllAspects(aspects, true)}>
                      Enable all
                    </Button>
                    <Button size='small' color='secondary' disabled={isSaving} onClick={() => setAllAspects(aspects, false)}>
                      Disable all
                    </Button>
                  </Box>
                )}
              </Card>
            )
          })}
        </Box>
      )}

      <Paper
        elevation={6}
        sx={{
          position: 'sticky',
          bottom: 16,
          zIndex: 2,
          mt: 3,
          px: 2.5,
          py: 1.5,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Typography variant='body2' sx={{ fontWeight: 500 }} color={changes.length > 0 ? 'warning.main' : 'text.secondary'}>
          {summary}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {isEdit ? (
            <>
              <Button variant='outlined' color='warning' disabled={isSaving} onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant='contained'
                disableElevation
                disabled={isSaving || changes.length === 0}
                onClick={handleSave}
                startIcon={isSaving ? <CircularProgress size={16} color='inherit' /> : undefined}
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </Button>
            </>
          ) : (
            <>
              <Button variant='outlined' color='error' onClick={onBack}>
                Back
              </Button>
              <Button variant='contained' disableElevation disabled={transactions.length === 0} onClick={() => setIsEdit(true)}>
                Edit
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default TransactionAspectsPanel