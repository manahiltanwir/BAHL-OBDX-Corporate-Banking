import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { AppDispatch, RootState } from 'src/store'
import {
  clearTasks,
  clearTemplates,
  fetchEnterpriseRolesAction,
  fetchTasksAction,
  fetchTemplatesAction,
  updateTemplateAction
} from 'src/store/apps/alert-maintenance'
import { IAlertTemplate, IEnterpriseRole, ITaskService } from 'src/types/apps/alertMaintenance'
import ConfirmActionDialog from 'src/@core/components/AlertMaintenance/ConfirmActionDialog'
import TemplateCard from 'src/@core/components/AlertMaintenance/TemplateCard'
import TemplateEditDialog from 'src/@core/components/AlertMaintenance/TemplateEditDialog'

type PendingAction =
  | { type: 'toggle'; template: IAlertTemplate }
  | { type: 'edit'; template: IAlertTemplate; content: string }

const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <Card variant='outlined' sx={{ borderStyle: 'dashed', borderRadius: 2, py: 8, px: 3, textAlign: 'center' }}>
    <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{title}</Typography>
    <Typography variant='body2' color='text.secondary'>
      {description}
    </Typography>
  </Card>
)

const channelLabel = (template: IAlertTemplate) => (template.alertType === 'EMAIL' ? 'Email' : 'SMS')

const Page = () => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.alertMaintenance)

  const [selectedRole, setSelectedRole] = useState<IEnterpriseRole | null>(null)
  const [selectedService, setSelectedService] = useState<ITaskService | null>(null)
  const [editing, setEditing] = useState<IAlertTemplate | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    if (store.enterpriseRoles.length === 0) dispatch(fetchEnterpriseRolesAction())

  }, [])

  const services = useMemo(() => store.tasks.flatMap(task => task.taskServices ?? []), [store.tasks])

  const templates = useMemo(
    () => [...store.templates].sort((a, b) => String(a.alertType).localeCompare(String(b.alertType))),
    [store.templates]
  )

  const tasksLoading = store.tasksStatus === 'pending'
  const templatesLoading = store.templatesStatus === 'pending'

  const handleRoleChange = (role: IEnterpriseRole | null) => {
    setSelectedRole(role)
    setSelectedService(null)
    dispatch(clearTasks())
    dispatch(clearTemplates())
    if (role) dispatch(fetchTasksAction(role.id))
  }

  const handleServiceChange = (service: ITaskService | null) => {
    setSelectedService(service)
    if (service) dispatch(fetchTemplatesAction(service.id))
    else dispatch(clearTemplates())
  }

  // Ab koi bhi change seedha API par nahi jata, pehle confirmation
  const requestToggle = (template: IAlertTemplate) => setPendingAction({ type: 'toggle', template })

  const requestSave = (content: string) => {
    if (editing) setPendingAction({ type: 'edit', template: editing, content })
  }

  const handleConfirm = async () => {
    if (!pendingAction) return

    setIsConfirming(true)
    try {
      if (pendingAction.type === 'toggle') {
        const { template } = pendingAction
        await dispatch(
          updateTemplateAction({ id: template.id, data: { isEnabled: template.isEnabled === 'Y' ? 'N' : 'Y' } })
        ).unwrap()
      } else {
        await dispatch(
          updateTemplateAction({ id: pendingAction.template.id, data: { content: pendingAction.content } })
        ).unwrap()
        setEditing(null)
      }
    } catch (error) {
      // toast thunk mein ho chuka hai; edit dialog khula rehta hai taake dobara try ho sake
    } finally {
      setIsConfirming(false)
      setPendingAction(null)
    }
  }

  const confirmCopy = (() => {
    if (!pendingAction) return { title: '', message: '', label: '', color: 'primary' as const }

    const { template } = pendingAction
    const channel = channelLabel(template)
    const transaction = selectedService?.operationName ?? 'this transaction'
    const target = (
      <>
        the <b>{channel}</b> alert <b>“{template.subject || template.name}”</b> of <b>{transaction}</b>
      </>
    )

    if (pendingAction.type === 'edit') {
      return {
        title: `Update ${channel} content?`,
        message: <>You are about to change the content of {target}. Are you sure you want to save this change?</>,
        label: 'Yes, update',
        color: 'primary' as const
      }
    }

    const disabling = template.isEnabled === 'Y'

    return {
      title: disabling ? `Disable ${channel} alert?` : `Enable ${channel} alert?`,
      message: (
        <>
          You are about to <b>{disabling ? 'disable' : 'enable'}</b> {target}.{' '}
          {disabling ? 'Customers will stop receiving this alert.' : 'Customers will start receiving this alert.'} Are
          you sure?
        </>
      ),
      label: disabling ? 'Yes, disable' : 'Yes, enable',
      color: disabling ? ('error' as const) : ('success' as const)
    }
  })()

  return (
    <>
      {/* Header + selections */}
      <Card sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <Typography sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>Alert Maintenance</Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          Select an Enterprise Role and a Transaction, then enable, disable or edit its Email and SMS alerts.
        </Typography>

        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 500, mb: 1.5 }}>
              Enterprise Role
            </Typography>
            <Autocomplete
              fullWidth
              autoHighlight
              options={store.enterpriseRoles}
              value={selectedRole}
              loading={store.rolesStatus === 'pending'}
              getOptionLabel={option => option.enterpriseRole}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, role) => handleRoleChange(role)}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Enterprise Role'
                  placeholder='Select enterprise role'
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {store.rolesStatus === 'pending' ? <CircularProgress color='inherit' size={18} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          </Box>

          <Box>
            <Typography variant='h6' sx={{ fontWeight: 500, mb: 1.5 }}>
              Transactions
            </Typography>
            <Autocomplete
              fullWidth
              autoHighlight
              options={services}
              value={selectedService}
              disabled={!selectedRole || tasksLoading}
              loading={tasksLoading}
              loadingText='Loading transactions...'
              noOptionsText='No transactions available for this role'
              getOptionLabel={option => option.operationName}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, service) => handleServiceChange(service)}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Transaction'
                  placeholder='Search and select transaction'
                  helperText={
                    !selectedRole
                      ? 'Select an enterprise role first'
                      : tasksLoading
                      ? 'Loading transactions...'
                      : `${services.length} transaction${services.length === 1 ? '' : 's'} available`
                  }
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {tasksLoading ? <CircularProgress color='inherit' size={18} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          </Box>
        </Box>
      </Card>

      {/* Templates */}
      {!selectedRole ? (
        <EmptyState title='No enterprise role selected' description='Pick an enterprise role above to load its transactions.' />
      ) : !selectedService ? (
        <EmptyState title='No transaction selected' description='Pick a transaction above to view its alert templates.' />
      ) : templatesLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : templates.length === 0 ? (
        <EmptyState
          title='No alert templates'
          description={`There are no email or SMS alerts configured for ${selectedService.operationName}.`}
        />
      ) : (
        <>
          <Typography sx={{ fontWeight: 700, mb: 2 }}>
            {selectedService.operationName}
            <Typography component='span' variant='body2' color='text.secondary' sx={{ ml: 1 }}>
              {templates.length} alert{templates.length === 1 ? '' : 's'}
            </Typography>
          </Typography>

          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
            {templates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                busy={
                  isConfirming && pendingAction?.type === 'toggle' && pendingAction.template.id === template.id
                }
                onToggle={requestToggle}
                onEdit={setEditing}
              />
            ))}
          </Box>
        </>
      )}

      {editing && (
        <TemplateEditDialog
          key={editing.id}
          template={editing}
          saving={isConfirming && pendingAction?.type === 'edit'}
          onClose={() => setEditing(null)}
          onSave={requestSave}
        />
      )}

      <ConfirmActionDialog
        open={Boolean(pendingAction)}
        title={confirmCopy.title}
        message={confirmCopy.message}
        confirmLabel={confirmCopy.label}
        confirmColor={confirmCopy.color}
        loading={isConfirming}
        onConfirm={handleConfirm}
        onClose={() => setPendingAction(null)}
      />
    </>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'admin-maintenance-alert-maintenance-page' 
}

export default Page