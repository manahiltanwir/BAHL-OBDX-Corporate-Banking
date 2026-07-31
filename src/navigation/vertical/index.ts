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
    ...(ability?.can('itsHaveAccess', 'create-lc')
      ? [
          {
            title: 'Trade',
            icon: FileTree,
            action: 'itsHaveAccess',
            subject: 'trade',
            children: [
              {
                title: 'Create LC',
                icon: FileDocumentOutline,
                path: '/Corporate-InnerPages/Trade/create-lc',
                action: 'itsHaveAccess',
                subject: 'view-lc'
              },
              {
                title: 'View LC',
                icon: FileDocumentOutline,
                path: '/Corporate-InnerPages/Trade/view-lc',
                action: 'itsHaveAccess',
                subject: 'create-lc'
              }
            ]
          }
        ]
      : []),
    //  {
    //   title: 'Trade',
    //   icon: ViewDashboard,
    //   path: '/Corporate-InnerPages/Trade',
    //   action: 'itsHaveAccess',
    //   subject: 'trade'
    // },

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
    {
      title: 'Settings',
      icon: FileTree,
      action: 'itsHaveAccess',
      subject: 'settings',
      children: [
        {
          title: 'Change Password',
          icon: FileDocumentOutline,
          path: '/settings/change-password',
          action: 'itsHaveAccess',
          subject: 'change-password'
        }
      ]
    }
    // Page with children Example
  ]
}

export default navigation
