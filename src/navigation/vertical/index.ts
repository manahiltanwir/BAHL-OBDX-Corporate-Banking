// ** Icon imports
import VideoIcon from 'mdi-material-ui/Video'
import TelevisionIcon from 'mdi-material-ui/Television'
import AccessibilityIcon from '@mui/icons-material/Accessibility'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { Home} from 'mdi-material-ui'

const navigation = (): VerticalNavItemsType => {
  const ability = useContext(AbilityContext)

  return [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      action: 'itsHaveAccess',
      subject: 'dashboard-page'
    },
    {
      title: 'Category',
      icon: TelevisionIcon,
      path: '/category',
      action: 'itsHaveAccess',
      subject: 'category-page'
    },
    {
      title: 'Dashboard',
      icon: Home,
      path: '/corporate-dashboard',
      action: 'itsHaveAccess',
      subject: 'corporate-dashboard-page'
    },
    {
      title: 'Party Management',
      icon: Home,
      path: '/party-management',
      action: 'itsHaveAccess',
      subject: 'party-management-page'
    },
{
      title: 'User Management',
      icon: AccessibilityIcon,
      path: '/user-management',
      action: 'itsHaveAccess',
      subject: 'user-management-page'
    },
    {
      title: 'Party Account Access',
      icon: AccessibilityIcon,
      path: '/party-account-access',
      action: 'itsHaveAccess',
      subject: 'party-account-access-page'
    },
    {
      title: 'Workflow and Rule Management',
      icon: AccessibilityIcon,
      path: '/workflow-management',
      action: 'itsHaveAccess',
      subject: 'workflow-management'
    },
    {
      title: 'User Account Access',
      icon: AccessibilityIcon,
      path: '/user-account-access',
      action: 'itsHaveAccess',
      subject: 'user-account-access'
    },
    //Page with children Example
    {
      title: 'Page With Children',
      icon: AccessibilityIcon,
      action: 'itsHaveAccess',
      subject: 'teachers-page',
      children: [
        {
          title: 'Children 1',
          icon: AccessibilityIcon,
          path: '/child1',
          action: 'itsHaveAccess',
          subject: 'teachers-page'
        },
        {
          title: 'Children 2',
          icon: AccessibilityIcon,
          path: '/child2',
          action: 'itsHaveAccess',
          subject: 'teachers-page'
        },
        {
          title: 'Children 3',
          icon: AccessibilityIcon,
          path: '/child3',
          action: 'itsHaveAccess',
          subject: 'teachers-page'
        },
      ]
    }
  ]
}

export default navigation
