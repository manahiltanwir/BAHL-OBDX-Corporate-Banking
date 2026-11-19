import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { IAlertTemplate } from 'src/types/apps/alertMaintenance'
import { htmlToText } from './RichTextEditor'

interface TemplateCardProps {
  template: IAlertTemplate
  busy?: boolean
  onToggle: (template: IAlertTemplate) => void
  onEdit: (template: IAlertTemplate) => void
}

const TemplateCard = ({ template, busy = false, onToggle, onEdit }: TemplateCardProps) => {
  const isEmail = template.alertType === 'EMAIL'
  const enabled = template.isEnabled === 'Y'

  return (
    <Card
      variant='outlined'
      sx={{
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        borderColor: enabled ? 'divider' : 'action.disabledBackground',
        transition: 'box-shadow .15s',
        '&:hover': { boxShadow: 3 }
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
            <Chip size='small' color={isEmail ? 'primary' : 'warning'} label={isEmail ? 'Email' : 'SMS'} />
            <Chip size='small' variant='outlined' color={enabled ? 'success' : 'error'} label={enabled ? 'Enabled' : 'Disabled'} />
          </Box>
          <Typography sx={{ fontWeight: 700, color: 'primary.main', wordBreak: 'break-word' }}>
            {template.subject || template.name}
          </Typography>
          <Typography variant='caption' color='text.secondary' sx={{ wordBreak: 'break-all' }}>
            {template.name}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {busy && <CircularProgress size={16} />}
          <Switch
            checked={enabled}
            color='primary'
            disabled={busy}
            onChange={() => onToggle(template)}
            sx={{
              '& .MuiSwitch-switchBase:not(.Mui-checked):not(.Mui-disabled)': { color: 'error.main' },
              '& .MuiSwitch-switchBase:not(.Mui-checked):not(.Mui-disabled) + .MuiSwitch-track': {
                backgroundColor: 'error.main'
              }
            }}
          />
        </Box>
      </Box>

      <Divider />

      <Box sx={{ px: 2.5, py: 2, flexGrow: 1, opacity: enabled ? 1 : 0.6 }}>
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{
            whiteSpace: 'pre-line',
            display: '-webkit-box',
            WebkitLineClamp: isEmail ? 6 : 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {htmlToText(template.content)}
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 1 }}>
        <Button size='small' disabled={busy} onClick={() => onEdit(template)}>
          Edit {isEmail ? 'email' : 'message'}
        </Button>
      </Box>
    </Card>
  )
}

export default TemplateCard