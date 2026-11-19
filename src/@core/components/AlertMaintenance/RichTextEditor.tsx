import { useCallback, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { alpha, Theme } from '@mui/material/styles'

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const isHtml = (value: string) => /<\/?(p|br|div|b|strong|i|em|u|ul|ol|li|span|a|h[1-6])[\s>/]/i.test(value)

export const plainToHtml = (value: string) =>
  value
    .split('\n')
    .map(line => (line.trim() === '' ? '<p><br></p>' : `<p>${escapeHtml(line)}</p>`))
    .join('')

export const htmlToText = (value: string) => {
  const withBreaks = value.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
  if (typeof window === 'undefined') return withBreaks.replace(/<[^>]+>/g, '')

  return (new DOMParser().parseFromString(withBreaks, 'text/html').body.textContent ?? '').replace(/\n{3,}/g, '\n\n').trim()
}

export const extractPlaceholders = (value: string) => Array.from(new Set(value.match(/#\w+#/g) ?? []))

interface ToolButtonProps {
  label: React.ReactNode
  title: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  sx?: object
}

const ToolButton = ({ label, title, active = false, disabled, onClick, sx }: ToolButtonProps) => (
  <Button
    size='small'
    title={title}
    disabled={disabled}
    variant={active ? 'contained' : 'text'}
    color={active ? 'primary' : 'inherit'}
    disableElevation
    onMouseDown={e => e.preventDefault()}
    onClick={onClick}
    sx={{ minWidth: 34, px: 1, py: 0.25, lineHeight: 1.6, ...sx }}
  >
    {label}
  </Button>
)

interface RichTextEditorProps {
  initialHtml: string
  onChange: (html: string) => void
  placeholders?: string[]
  minHeight?: number
  disabled?: boolean
}

const RichTextEditor = ({ initialHtml, onChange, placeholders = [], minHeight = 260, disabled = false }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!editorRef.current) return
    editorRef.current.innerHTML = initialHtml
    try {
      document.execCommand('defaultParagraphSeparator', false, 'p')
    } catch (e) {
      // ignore
    }

  }, [])

  const refreshActive = useCallback(() => {
    const selection = document.getSelection()
    if (!editorRef.current || !selection?.anchorNode || !editorRef.current.contains(selection.anchorNode)) return

    setActive({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList')
    })
  }, [])

  useEffect(() => {
    document.addEventListener('selectionchange', refreshActive)

    return () => document.removeEventListener('selectionchange', refreshActive)
  }, [refreshActive])

  const emit = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }

  const run = (command: string, value?: string) => {
    if (disabled) return
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    emit()
    refreshActive()
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault()
    document.execCommand('insertText', false, event.clipboardData.getData('text/plain'))
    emit()
  }

  return (
    <Box>
      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          transition: 'border-color .15s, box-shadow .15s',
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: (theme: Theme) => `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}`
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 0.5,
            px: 1,
            py: 0.75,
            bgcolor: (theme: Theme) => alpha(theme.palette.text.primary, 0.03),
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <ToolButton label='B' title='Bold' active={active.bold} disabled={disabled} onClick={() => run('bold')} sx={{ fontWeight: 800 }} />
          <ToolButton
            label='I'
            title='Italic'
            active={active.italic}
            disabled={disabled}
            onClick={() => run('italic')}
            sx={{ fontStyle: 'italic', fontFamily: 'serif' }}
          />
          <ToolButton
            label='U'
            title='Underline'
            active={active.underline}
            disabled={disabled}
            onClick={() => run('underline')}
            sx={{ textDecoration: 'underline' }}
          />

          <Divider flexItem orientation='vertical' sx={{ mx: 0.5 }} />

          <ToolButton
            label='• List'
            title='Bullet list'
            active={active.insertUnorderedList}
            disabled={disabled}
            onClick={() => run('insertUnorderedList')}
          />
          <ToolButton
            label='1. List'
            title='Numbered list'
            active={active.insertOrderedList}
            disabled={disabled}
            onClick={() => run('insertOrderedList')}
          />

          <Divider flexItem orientation='vertical' sx={{ mx: 0.5 }} />

          <ToolButton label='Undo' title='Undo' disabled={disabled} onClick={() => run('undo')} />
          <ToolButton label='Redo' title='Redo' disabled={disabled} onClick={() => run('redo')} />
          <ToolButton label='Clear format' title='Remove formatting' disabled={disabled} onClick={() => run('removeFormat')} />
        </Box>

        <Box
          ref={editorRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          role='textbox'
          aria-multiline='true'
          onInput={emit}
          onPaste={handlePaste}
          onKeyUp={refreshActive}
          onMouseUp={refreshActive}
          sx={{
            minHeight,
            maxHeight: 420,
            overflowY: 'auto',
            p: 2,
            outline: 'none',
            fontSize: 14,
            lineHeight: 1.7,
            color: 'text.primary',
            wordBreak: 'break-word',
            '& p': { m: 0, mb: 1 },
            '& ul, & ol': { pl: 3, my: 1 },
            '& a': { color: 'primary.main' }
          }}
        />
      </Box>

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
              disabled={disabled}
              onMouseDown={e => e.preventDefault()}
              onClick={() => run('insertText', token)}
            />
          ))}
        </Box>
      )} */}
    </Box>
  )
}

export default RichTextEditor