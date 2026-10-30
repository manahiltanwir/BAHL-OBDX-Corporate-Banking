import { styled } from '@mui/material/styles'
import { Box, BoxProps, Card, CardContent, Grid, Typography } from '@mui/material'
import Link from 'next/link'
import { useAuth } from 'src/hooks/useAuth'

interface ActionItem {
  icon: string
  title: string
  description: string
  page?: any
  component?: string
}

type WidgetVariant = 'green' | 'yellow' | 'lightGreen'

interface WidgetCardProps {
  icon: string
  title: string
  variant: WidgetVariant
  actions: ActionItem[]
  cardMd?: number // dashboard par is card ki grid width (12 = full, 6 = half)
}

interface WidgetProps {
  cardMd?: number
}

const variantConfig: Record<WidgetVariant, { gradient: string; textColor: string; accent: string }> = {
  green: {
    gradient: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
    textColor: '#ffffff',
    accent: '#2d6a4f'
  },
  yellow: {
    gradient: 'linear-gradient(135deg, #ffcc00 0%, #e6b800 100%)',
    textColor: '#1b4332',
    accent: '#ffcc00'
  },
  lightGreen: {
    gradient: 'linear-gradient(135deg, #90ee90 0%, #74c69d 100%)',
    textColor: '#1b4332',
    accent: '#90ee90'
  }
}

// ** Styled Components
export const StyledWidgetCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  }
}))

interface WidgetHeaderProps extends BoxProps {
  variant: WidgetVariant
}

export const StyledWidgetHeader = styled(Box, {
  shouldForwardProp: prop => prop !== 'variant'
})<WidgetHeaderProps>(({ theme, variant }) => ({
  background: variantConfig[variant].gradient,
  color: variantConfig[variant].textColor,
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.875)
}))

interface ActionBoxProps extends BoxProps {
  accentColor: string
}

export const StyledActionBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'accentColor'
})<ActionBoxProps>(({ theme, accentColor }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(2.5),
  cursor: 'pointer',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  border: '1px solid transparent', // taake hover pe layout shift na ho
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: accentColor,
    boxShadow: `${theme.shadows[6]}, 0 4px 14px ${accentColor}40`,
    transform: 'scale(1.01)'
  },
  '&:hover .box-icon': {
    backgroundColor: `${accentColor}1a`
  }
}))

export const StyledIconBox = styled(Box)(({ theme }) => ({
  fontSize: 22,
  marginBottom: theme.spacing(1.5),
  width: 40,
  height: 40,
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'background-color 0.2s'
}))

export const StyledActionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
  lineHeight: 1.3
}))

export const StyledActionDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.5
}))

export const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 700,
  marginBottom: theme.spacing(0.75)
}))

export const StyledSectionSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.9375rem'
}))

// ** Reusable Sub-components

export const ActionBox = ({ icon, title, description, accentColor, page }: ActionItem & { accentColor: string }) => {
  return (
    <Link href={page ? page : '/'} style={{ textDecoration: 'none' }}>
      <StyledActionBox accentColor={accentColor}>
        <StyledIconBox className='box-icon'>{icon}</StyledIconBox>
        <StyledActionTitle>{title}</StyledActionTitle>
        <StyledActionDescription>{description}</StyledActionDescription>
      </StyledActionBox>
    </Link>
  )
}

// -----------------------------------------------------------------------
// Widget Wrappers
// -----------------------------------------------------------------------

export const PartyCorporateWidget = ({ cardMd }: WidgetProps) => {
  const actions: ActionItem[] = [
    {
      icon: '➕',
      title: 'Party Management',
      description: 'Register new corporate entities and business clients into the core system.',
      page: '/party-maintenance/party-management',
      component: 'party-maintenance-party-management-page'
    },
    {
      icon: '👤',
      title: 'User Management',
      description: 'Create and provision primary administrator accounts for corporate clients.',
      page: '/party-maintenance/user-management',
      component: 'party-maintenance-user-management-page'
    },
    {
      icon: '🔓',
      title: 'Party Account Access',
      description: 'Map and authorize specific bank accounts to corporate profiles.',
      page: '/party-maintenance/party-account-access',
      component: 'party-maintenance-party-account-access-page'
    },
    {
      icon: '🔐',
      title: 'User Account Access',
      description: 'Manage individual employee permissions for assigned corporate accounts.',
      page: '/party-maintenance/user-account-access',
      component: 'party-maintenance-user-account-access-page'
    },
    {
      icon: '⚙️',
      title: 'Workflow Management',
      description: 'Define multi-level approval hierarchies for corporate transactions.',
      page: '/party-maintenance/workflow-management',
      component: 'party-maintenance-workflow-management-page'
    },
    {
      icon: '📋',
      title: 'Rule Management',
      description: 'Create and manage business rules, validation policies, and transaction conditions.',
      page: '/party-maintenance/rule-management',
      component: 'party-maintenance-rule-management-page'
    },
    {
      icon: '📊',
      title: 'Limit - Package Management',
      description: 'Define and manage transaction limits, daily caps, and thresholds for corporate parties and users.',
      page: '/party-maintenance/party-limit-package-management',
      component: 'party-maintenance-party-limit-package-management-page'
    },
    {
      icon: '🛡️',
      title: 'Limit - Transaction Group',
      description: 'Configure internal bank roles, clearance levels, and department tags.',
      page: '/party-maintenance/party-limit-transaction-group',
      component: 'party-maintenance-party-limit-transaction-group-page'
    },
  ]

  return (
    <WidgetCard
      icon='🏢'
      title='Party Company Corporate Maintenance'
      variant='green'
      actions={actions}
      cardMd={cardMd}
    />
  )
}

export const AdminUserWidget = ({ cardMd }: WidgetProps) => {
  const actions: ActionItem[] = [
    {
      icon: '🔑',
      title: 'User Management',
      description: 'Setup internal bank operator, auditor, and operational admin accounts.',
      page: '/admin-maintenance/user-management',
      component: 'admin-maintenance-user-management-page'
    },
    {
      icon: '🛡️',
      title: 'User Group Management',
      description: 'Configure internal bank roles, clearance levels, and department tags.',
      page: '/party-management',
      component: '' // TODO: iska component name yahan likho
    },
    {
      icon: '⚙️',
      title: 'Workflow Management',
      description: 'Define multi-level approval hierarchies for corporate transactions.',
      page: '/admin-maintenance/admin-workflow-management',
      component: 'admin-maintenance-workflow-management-page'
    },
    {
      icon: '📋',
      title: 'Rule Management',
      description: 'Create and manage business rules, validation policies, and transaction conditions.',
      page: '/admin-maintenance/admin-rule-management',
      component: 'admin-maintenance-rule-management-page'
    },
    {
      icon: '🔀',
      title: 'Role Transaction Mapping',
      description: 'Map specific transaction types and feature access permissions to user roles.',
      page: '/admin-maintenance/role-transaction-mapping',
      component: 'admin-maintenance-role-transaction-mapping-page'
    },
    {
      icon: '🧩',
      title: 'Role Transaction Component',
      description: 'Control which screens and features each role can access by mapping components to roles.',
      page: '/admin-maintenance/role-transaction-component',
      component: 'admin-maintenance-role-transaction-component-page'
    },
    {
      icon: '🔐',
      title: 'Transaction Aspects',
      description: 'Select an Enterprise Role to load its transactions, then configure operational security aspects like 2FA,auditing, and alerts.',
      page: '/admin-maintenance/transaction-aspects',
      component: 'admin-maintenance-transaction-aspects-page'
    },
  ]

  return (
    <WidgetCard
      icon='🛠️'
      title='Admin User Maintenance'
      variant='yellow'
      actions={actions}
      cardMd={cardMd}
    />
  )
}

export const BackOfficeUserWidget = ({ cardMd }: WidgetProps) => {
  const actions: ActionItem[] = [
    {
      icon: '🔑',
      title: 'User Management',
      description: 'Setup internal bank operator, auditor, and operational admin accounts.',
      page: '/party-management',
      component: '' // TODO: iska component name yahan likho
    },
    {
      icon: '🛡️',
      title: 'User Group Management',
      description: 'Configure internal bank roles, clearance levels, and department tags.',
      page: '/party-management',
      component: '' // TODO: iska component name yahan likho
    },
    {
      icon: '🔄',
      title: 'Workflow Management',
      description: 'Establish global system policies and internal check-and-balance steps.',
      page: '/backoffice-maintenance/backoffice-workflow-management',
      component: 'backoffice-maintenance-workflow-management-page'
    },
    {
      icon: '📋',
      title: 'Rule Management',
      description: 'Create and manage business rules, validation policies, and transaction conditions.',
      page: '/backoffice-maintenance/backoffice-rule-management',
      component: 'backoffice-maintenance-rule-management-page'
    }
  ]

  return (
    <WidgetCard
      icon='🛠️'
      title='Backoffice User Maintenance'
      variant='lightGreen'
      actions={actions}
      cardMd={cardMd}
    />
  )
}

export const WidgetCard = ({ icon, title, variant, actions, cardMd = 12 }: WidgetCardProps) => {
  const { user } = useAuth()
  const accentColor = variantConfig[variant].accent

  const allowed = new Set<string>(
    (user?.userProfile?.authorizedUIComponents ?? []).map((ele: any) => ele.component)
  )
  const visibleActions = actions.filter(action => !!action.component && allowed.has(action.component))

  // Full width card -> 3 boxes per row, half width card -> 2 boxes per row
  const mdCols = cardMd === 12 ? 4 : 6

  return (
    <StyledWidgetCard elevation={4}>
      <StyledWidgetHeader variant={variant}>
        <Box sx={{ fontSize: 24 }}>{icon}</Box>
        <Typography
          sx={{
            fontSize: '1.125rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#fff'
          }}
        >
          {title}
        </Typography>
      </StyledWidgetHeader>
      <CardContent sx={{ padding: '25px !important' }}>
        <Grid container spacing={2.5}>
          {visibleActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={mdCols} key={index}>
              <ActionBox {...action} accentColor={accentColor} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </StyledWidgetCard>
  )
}