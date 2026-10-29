import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Box, Button, Divider, Switch, Typography } from '@mui/material'
import { AspectsCardProps, ITransactionAspects } from 'src/types/apps/transactionAspects'
import { useAuth } from 'src/hooks/useAuth'
import { useTransactionAspects } from 'src/@core/hooks/apps/useTransactionAspects'

const AspectsCard = ({ isEdit, setIsEdit, onBack, selectedTransaction }: AspectsCardProps) => {
  const [aspects, setAspects] = useState<Record<number, boolean>>({})

  const {
    user: { username }
  } = useAuth()

  const { updateTransactionAspect } = useTransactionAspects(null)

  useEffect(() => {
    if (selectedTransaction?.aspects) {
      const initialStates: Record<number, boolean> = {}
      selectedTransaction.aspects.forEach(aspect => {
        initialStates[aspect.id] = aspect.isEnabled === 'Y'
      })
      setAspects(initialStates)
    }
  }, [selectedTransaction])

  const handleToggle = (id: number) => {
    setAspects(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleSave = () => {
    const payload = Object.entries(aspects).map(([id, isTrue]) => ({
      aspectId: Number(id),
      isEnabled: isTrue ? 'Y' : 'N',
      updatedBy: username
    }))

    updateTransactionAspect('123', payload, selectedTransaction)
    setIsEdit(false)
  }

  const handleCancelInternal = () => {
    if (selectedTransaction?.aspects) {
      const initialStates: Record<number, boolean> = {}
      selectedTransaction.aspects.forEach(aspect => {
        initialStates[aspect.id] = aspect.isEnabled === 'Y'
      })
      setAspects(initialStates)
    }
    setIsEdit(false)
  }

  return (
    <Box
      sx={{
        width: '100%',
        fontFamily: 'inherit',
        boxSizing: 'border-box'
      }}
    >
      <Box sx={{ pt: 2, pb: 2 }}>
        <Typography
          sx={{
            color: '#16834f',
            fontSize: 25,
            fontWeight: 'bolder',
            textAlign: 'center'
            // lineHeight: '24px'
          }}
        >
          {selectedTransaction?.operationName} Aspects
        </Typography>
      </Box>
      <Divider sx={{ border: '1px solid' }} />
      <Box sx={{ px: 2.25 }}>
        {selectedTransaction?.aspects?.map((aspect, index) => (
          <Box
            key={aspect.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 56,
              ...(index === 0 && { mt: 0.5 })
            }}
          >
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 'bold',
                // color: '#666',
                lineHeight: 1.5,
                textTransform: 'capitalize'
              }}
            >
              {aspect?.aspect?.replace(/-/g, ' ')}
            </Typography>

            <Switch
              size='small'
              disabled={!isEdit}
              checked={!!aspects[aspect.id]}
              onChange={() => handleToggle(aspect.id)}
              inputProps={{
                'aria-label': aspect.aspect
              }}
              sx={{
                width: 44,
                height: 30,
                p: 0,
                mr: 15.5,
                '& .MuiSwitch-switchBase': {
                  p: '4px',
                  '&.Mui-checked': {
                    transform: 'translateX(14px)',
                    color: '#f5f5f5',
                    '& + .MuiSwitch-track': {
                      bgcolor: isEdit ? '#15804f' : '#cccccc',
                      opacity: 1
                    }
                  }
                },
                '& .MuiSwitch-thumb': {
                  width: 22,
                  height: 22,
                  boxShadow: 'none',
                  bgcolor: '#f2f2f2'
                },
                '& .MuiSwitch-track': {
                  borderRadius: 15,
                  bgcolor: '#cccccc',
                  opacity: 1
                }
              }}
            />
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3.5,
          px: 3.5,
          mt: 4.25,
          pb: 2
        }}
      >
        {isEdit ? (
          <>
            <Button variant='contained' onClick={handleSave} disableElevation color='primary'>
              Save
            </Button>
            <Button variant='outlined' onClick={handleCancelInternal} disableElevation color='warning'>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant='contained' onClick={() => setIsEdit(true)} disableElevation color='primary'>
              Edit
            </Button>
            <Button variant='outlined' onClick={onBack} color='error'>
              Back
            </Button>
          </>
        )}
      </Box>
    </Box>
  )
}

export default AspectsCard
