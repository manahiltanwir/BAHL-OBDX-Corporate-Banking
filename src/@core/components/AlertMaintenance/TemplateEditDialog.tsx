// -> src/@core/components/AlertMaintenance/TemplateEditDialog.tsx
//
// Parent mein aise render karna (key zaroori hai taake har template par state fresh ho):
// {editing && <TemplateEditDialog key={editing.id} template={editing} ... />}

import { useMemo, useState } from 'react'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { IAlertTemplate } from 'src/types/apps/alertMaintenance'
import RichTextEditor, { extractPlaceholders, htmlToText, isHtml, plainToHtml } from './RichTextEditor'

interface TemplateEditDialogProps {
  template: IAlertTemplate
  saving?: boolean
  onClose: () => void
  onSave: (content: string) => void
}

const smsSegments = (length: number) => (length === 0 ? 0 : length <= 160 ? 1 : Math.ceil(length / 153))

const TemplateEditDialog = ({ template, saving = false, onClose, onSave }: TemplateEditDialogProps) => {
  const isEmail = template.alertType === 'EMAIL'

  const initialHtml = useMemo(
    () => (isHtml(template.content) ? template.content : plainToHtml(template.content)),
    [template.content]
  )
  const placeholders = useMemo(() => extractPlaceholders(template.content), [template.content])

  const [html, setHtml] = useState(initialHtml)
  const [text, setText] = useState(template.content)
  const [dirty, setDirty] = useState(false)

  const currentText = isEmail ? htmlToText(html) : text
  const missingPlaceholders = placeholders.filter(token => !currentText.includes(token))
  const canSave = dirty && currentText.trim().length > 0 && !saving

  const handleSave = () => {
    if (!canSave) return
    onSave(isEmail ? html : text)
  }

  return (
    <Dialog open fullWidth maxWidth='md' onClose={saving ? undefined : onClose}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip size='small' color={isEmail ? 'primary' : 'warning'} label={isEmail ? 'Email' : 'SMS'} />
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            Edit {isEmail ? 'email template' : 'SMS template'}
          </Typography>
        </Box>
        <Typography variant='caption' color='text.secondary'>
          {template.name}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {isEmail && (
          <TextField fullWidth size='small' label='Subject' value={template.subject} disabled sx={{ mb: 3 }} />
        )}

        {isEmail ? (
          <RichTextEditor
            initialHtml={initialHtml}
            placeholders={placeholders}
            disabled={saving}
            onChange={next => {
              setHtml(next)
              setDirty(true)
            }}
          />
        ) : (
          <>
            <TextField
              fullWidth
              multiline
              minRows={5}
              maxRows={12}
              label='Message'
              value={text}
              disabled={saving}
              onChange={e => {
                setText(e.target.value)
                setDirty(true)
              }}
              helperText={`${text.length} characters · ${smsSegments(text.length)} SMS segment${
                smsSegments(text.length) === 1 ? '' : 's'
              }`}
            />
            {/* {placeholders.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                <Typography variant='caption' color='text.secondary'>
                  Insert placeholder:
                </Typography>
                {placeholders.map(token => (
                  <Chip
                    key={token}
                    size='small'
                    variant='outlined'
                    color='primary'
                    label={token}
                    disabled={saving}
                    onClick={() => {
                      setText(previous => `${previous}${token}`)
                      setDirty(true)
                    }}
                  />
                ))}
              </Box>
            )} */}
          </>
        )}

        {/* {missingPlaceholders.length > 0 && (
          <Alert severity='warning' sx={{ mt: 2 }}>
            These placeholders are no longer in the content: {missingPlaceholders.join(', ')}. The customer will not
            receive that information.
          </Alert>
        )} */}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant='outlined' color='warning' disabled={saving} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant='contained'
          disableElevation
          disabled={!canSave}
          onClick={handleSave}
          startIcon={saving ? <CircularProgress size={16} color='inherit' /> : undefined}
        >
          {saving ? 'Saving...' : 'Save changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TemplateEditDialog