import React from 'react'
import { Avatar, Box, Button, Card, Divider, TextField, Typography } from '@mui/material'
import ApartmentIcon from '@mui/icons-material/Apartment'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import LockIcon from '@mui/icons-material/Lock'
import SearchIcon from '@mui/icons-material/Search'
import LoadingButton from '@mui/lab/LoadingButton'
import { colors } from '../Constants' 

type PartyInfo = { partyId: string; partyName: string }

type Props = {
  isEditMode: boolean
  partyInfo: PartyInfo | null
  partyIdInput: string
  partyStatus: string
  onPartyIdInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearch: () => void
  onChangeParty: () => void
}

/** Party search box, or the "found party" summary card once a party is loaded. */
const PartySearchCard = ({
  isEditMode,
  partyInfo,
  partyIdInput,
  partyStatus,
  onPartyIdInputChange,
  onSearch,
  onChangeParty
}: Props) => (
  <Card sx={{ p: 5, mb: 6 }}>
    <Typography
      variant='caption'
      sx={{
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.75px',
        color: 'text.secondary',
        mb: 3,
        display: 'block'
      }}
    >
      Party
    </Typography>

    {!partyInfo ? (
      <>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          Search the Party ID this rule belongs to. Once found, you'll be able to configure the rule below.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <TextField
            fullWidth
            label='Party ID'
            placeholder='e.g. PRT-9921'
            value={partyIdInput}
            onChange={onPartyIdInputChange}
            onKeyDown={event => event.key === 'Enter' && onSearch()}
            error={partyStatus === 'not-found' || partyStatus === 'error'}
            helperText={
              partyStatus === 'not-found'
                ? 'No users found for this Party ID.'
                : partyStatus === 'error'
                  ? 'Party search failed. Please try again.'
                  : ' '
            }
          />
          <LoadingButton
            variant='contained'
            loading={partyStatus === 'searching'}
            startIcon={<SearchIcon fontSize='small' />}
            onClick={onSearch}
          >
            Search Party
          </LoadingButton>
        </Box>
      </>
    ) : (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          p: 2.5,
          borderRadius: 2,
          bgcolor: 'rgba(21, 128, 79, 0.08)',
          border: '1px solid rgba(21, 128, 79, 0.3)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
          <Avatar sx={{ bgcolor: colors.green, width: 44, height: 44 }}>
            <ApartmentIcon />
          </Avatar>
          <Box>
            <Typography variant='caption' sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
              Party ID
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>{partyInfo.partyId}</Typography>
          </Box>
          <Divider orientation='vertical' flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
          <Box>
            <Typography variant='caption' sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
              Party Name
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>{partyInfo.partyName}</Typography>
          </Box>
        </Box>

        {isEditMode ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
            <LockIcon fontSize='small' />
            <Typography variant='caption' sx={{ fontWeight: 600 }}>
              Party locked — cannot be changed
            </Typography>
          </Box>
        ) : (
          <Button
            size='small'
            variant='outlined'
            startIcon={<ChangeCircleIcon fontSize='small' />}
            onClick={onChangeParty}
            sx={{ color: colors.green, borderColor: colors.green, '&:hover': { borderColor: colors.greenHover } }}
          >
            Change Party
          </Button>
        )}
      </Box>
    )}
  </Card>
)

export default PartySearchCard