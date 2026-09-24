import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import Collapse from '@mui/material/Collapse'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { ComponentNode } from 'src/types/apps/roleTransactionMapping'

interface NodeState {
  total: number
  checkedCount: number
  checked: boolean
  indeterminate: boolean
  disabled: boolean
}

interface TreeRowProps {
  node: ComponentNode
  depth: number
  getNodeState: (node: ComponentNode) => NodeState
  onToggle: (node: ComponentNode) => void
}

const TreeRow = ({ node, depth, getNodeState, onToggle }: TreeRowProps) => {
  const [open, setOpen] = useState(true)
  const hasChildren = (node.components?.length ?? 0) > 0
  const state = getNodeState(node)

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', pl: depth * 3, py: 0.25 }}>
        <Box
          onClick={() => hasChildren && setOpen(previous => !previous)}
          sx={{ width: 24, textAlign: 'center', cursor: hasChildren ? 'pointer' : 'default', color: 'text.secondary', userSelect: 'none' }}
        >
          {hasChildren ? (open ? '▾' : '▸') : ''}
        </Box>

        <Checkbox
          size='small'
          checked={state.checked}
          indeterminate={state.indeterminate}
          disabled={state.disabled}
          onChange={() => onToggle(node)}
        />

        <Typography sx={{ fontSize: 14, fontWeight: hasChildren ? 600 : 400, color: state.disabled ? 'text.disabled' : 'text.primary' }}>
          {node.name}
        </Typography>

        {hasChildren && (
          <Typography sx={{ ml: 1, fontSize: 12, color: 'text.secondary' }}>
            ({state.checkedCount}/{state.total})
          </Typography>
        )}
      </Box>

      {hasChildren && (
        <Collapse in={open} unmountOnExit>
          {node.components.map(child => (
            <TreeRow key={child.id} node={child} depth={depth + 1} getNodeState={getNodeState} onToggle={onToggle} />
          ))}
        </Collapse>
      )}
    </Box>
  )
}

interface Props {
  nodes: ComponentNode[]
  search: string
  onSearchChange: (value: string) => void
  getNodeState: (node: ComponentNode) => NodeState
  onToggle: (node: ComponentNode) => void
  hasPendingChanges: boolean
  isSaving: boolean
  onSave: () => void
  onDiscard: () => void
  emptyMessage?: string
}

export const ComponentTreeChecklist = ({
  nodes,
  search,
  onSearchChange,
  getNodeState,
  onToggle,
  hasPendingChanges,
  isSaving,
  onSave,
  onDiscard,
  emptyMessage = 'No components found.'
}: Props) => {
  return (
    <Box>
      <TextField
        size='small'
        fullWidth
        placeholder='Search components...'
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box sx={{ maxHeight: 480, overflowY: 'auto', mb: 2 }}>
        {nodes.length === 0 ? (
          <Typography variant='body2' color='text.secondary'>
            {emptyMessage}
          </Typography>
        ) : (
          nodes.map(node => <TreeRow key={node.id} node={node} depth={0} getNodeState={getNodeState} onToggle={onToggle} />)
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button variant='outlined' disabled={!hasPendingChanges || isSaving} onClick={onDiscard}>
          Discard
        </Button>
        <Button
          variant='contained'
          disabled={!hasPendingChanges || isSaving}
          onClick={onSave}
          startIcon={isSaving ? <CircularProgress size={16} color='inherit' /> : undefined}
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}