// ** Icon imports
import Home from 'mdi-material-ui/Home'
import ViewDashboard from 'mdi-material-ui/ViewDashboard'
import ShapeOutline from 'mdi-material-ui/ShapeOutline'
import Domain from 'mdi-material-ui/Domain'
import AccountGroup from 'mdi-material-ui/AccountGroup'
import AccountCog from 'mdi-material-ui/AccountCog'
import AccountKey from 'mdi-material-ui/AccountKey'
import Sitemap from 'mdi-material-ui/Sitemap'
import AccountLock from 'mdi-material-ui/AccountLock'
import Gavel from 'mdi-material-ui/Gavel'
import FileTree from 'mdi-material-ui/FileTree'
import FileDocumentOutline from 'mdi-material-ui/FileDocumentOutline'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const navigation = (): VerticalNavItemsType => {
  const ability = useContext(AbilityContext)

  return [
    {
      title: 'Dashboard',
      icon: ViewDashboard,
      path: '/dashboard',
      action: 'itsHaveAccess',
      subject: 'dashboard-page'
    },
    {
      title: 'Category',
      icon: ShapeOutline,
      path: '/category',
      action: 'itsHaveAccess',
      subject: 'category-page'
    },
    {
      title: 'Dashboard',
      icon: Domain,
      path: '/corporate-dashboard',
      action: 'itsHaveAccess',
      subject: 'corporate-dashboard-page'
    },
    {
      title: 'Party Management',
      icon: AccountGroup,
      path: '/party-management',
      action: 'itsHaveAccess',
      subject: 'party-management-page'
    },
    {
      title: 'User Management',
      icon: AccountCog,
      path: '/user-management',
      action: 'itsHaveAccess',
      subject: 'user-management-page'
    },
    {
      title: 'Party Account Access',
      icon: AccountKey,
      path: '/party-account-access',
      action: 'itsHaveAccess',
      subject: 'party-account-access-page'
    },
    {
      title: 'Workflow Management',
      icon: Sitemap,
      path: '/workflow-management',
      action: 'itsHaveAccess',
      subject: 'workflow-management'
    },
    {
      title: 'User Account Access',
      icon: AccountLock,
      path: '/user-account-access',
      action: 'itsHaveAccess',
      subject: 'user-account-access'
    },
    {
      title: 'Rule Management',
      icon: Gavel,
      path: '/rule-management',
      action: 'itsHaveAccess',
      subject: 'rule-management'
    },

    // Page with children Example
    {
      title: 'Page With Children',
      icon: FileTree,
      action: 'itsHaveAccess',
      subject: 'teachers-page',
      children: [
        {
          title: 'Children 1',
          icon: FileDocumentOutline,
          path: '/child1',
          action: 'itsHaveAccess',
          subject: 'teachers-page'
        },
        {
          title: 'Children 2',
          icon: FileDocumentOutline,
          path: '/child2',
          action: 'itsHaveAccess',
          subject: 'teachers-page'
        },
        {
          title: 'Children 3',
          icon: FileDocumentOutline,
          path: '/child3',
          action: 'itsHaveAccess',
          subject: 'teachers-page'
        }
      ]
    }
  ]
}

export default navigation