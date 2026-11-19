import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { ITask, ITaskService } from 'src/types/apps/alertMaintenance'

interface ServiceListProps {
  tasks: ITask[]
  search: string
  loading?: boolean
  hasRole: boolean
  selectedId?: number
  onSelect: (service: ITaskService) => void
}

const matches = (value: string, search: string) => value.toLowerCase().includes(search.trim().toLowerCase())

const Message = ({ children }: { children: React.ReactNode }) => (
  <Typography variant='body2' color='text.secondary' sx={{ px: 3, py: 6, textAlign: 'center' }}>
    {children}
  </Typography>
)

const ServiceList = ({ tasks, search, loading = false, hasRole, selectedId, onSelect }: ServiceListProps) => {
  if (!hasRole) return <Message>Select an enterprise role to see its transactions.</Message>

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    )
  }

  // Search task name ya operation name dono par chalta hai
  const groups = tasks
    .map(task => ({
      ...task,
      taskServices: (task.taskServices ?? []).filter(
        service => !search.trim() || matches(service.operationName, search) || matches(task.taskName, search)
      )
    }))
    .filter(task => task.taskServices.length > 0)

  if (groups.length === 0) {
    return <Message>{search.trim() ? 'No transactions match your search.' : 'No transactions found for this role.'}</Message>
  }

  return (
    <List disablePadding sx={{ maxHeight: 560, overflowY: 'auto' }}>
      {groups.map(task => (
        <li key={task.taskId}>
          <ul style={{ padding: 0, margin: 0 }}>
            <ListSubheader
              disableSticky={false}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', lineHeight: '40px', fontWeight: 700 }}
            >
              <span>{task.taskName}</span>
              <Chip size='small' variant='outlined' label={task.category} />
            </ListSubheader>

            {task.taskServices.map(service => (
              <ListItemButton
                key={service.id}
                selected={service.id === selectedId}
                onClick={() => onSelect(service)}
                sx={{ pl: 3, borderLeft: 3, borderColor: service.id === selectedId ? 'primary.main' : 'transparent' }}
              >
                <ListItemText
                  primary={service.operationName}
                  secondary={service.operationCode}
                  primaryTypographyProps={{ fontWeight: service.id === selectedId ? 700 : 500 }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItemButton>
            ))}
          </ul>
        </li>
      ))}
    </List>
  )
}

export default ServiceList