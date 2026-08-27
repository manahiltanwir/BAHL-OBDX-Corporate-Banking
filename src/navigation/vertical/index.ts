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
import SwapHorizontal from 'mdi-material-ui/SwapHorizontal'
import FilePlusOutline from 'mdi-material-ui/FilePlusOutline'
import FileFindOutline from 'mdi-material-ui/FileFindOutline'
import CertificateOutline from 'mdi-material-ui/CertificateOutline'
import ScaleBalance from 'mdi-material-ui/ScaleBalance'
import AccountCheckOutline from 'mdi-material-ui/AccountCheckOutline'
import CogOutline from 'mdi-material-ui/CogOutline'
import LockReset from 'mdi-material-ui/LockReset'

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
            icon: SwapHorizontal,
            action: 'itsHaveAccess',
            subject: 'trade',
            children: [
              {
                title: 'Create LC',
                icon: FilePlusOutline,
                path: '/Corporate-InnerPages/Trade/create-lc',
                action: 'itsHaveAccess',
                subject: 'view-lc'
              },
              {
                title: 'View LC',
                icon: FileFindOutline,
                path: '/Corporate-InnerPages/Trade/view-lc',
                action: 'itsHaveAccess',
                subject: 'create-lc'
              }
            ]
          }
        ]
      : []),
       ...(ability?.can('itsHaveAccess', 'balance-certificate')
      ? [
          {
            title: 'Certificate',
            icon: CertificateOutline,
            action: 'itsHaveAccess',
            subject: 'trade',
            children: [
              {
                title: 'Balance Certificate',
                icon: ScaleBalance,
                path: '/Corporate-InnerPages/Certificates/balance-certificate',
                action: 'itsHaveAccess',
                subject: 'balance-certificate'
              },
              {
                title: 'Account Maintaince Certificate',
                icon: AccountCheckOutline,
                path: '/Corporate-InnerPages/Certificates/account-maintaince-certificate',
                action: 'itsHaveAccess',
                subject: 'balance-certificate'
              }
            ]
          }
        ]
      : []),
       ...(ability?.can('itsHaveAccess', 'view-statement')
      ? [
          {
            title: 'Statement',
            icon: FileTree,
            action: 'itsHaveAccess',
            subject: 'view-statement',
            children: [
              {
                title: 'View Statement',
                icon: FileDocumentOutline,
                path: '/Corporate-InnerPages/Statement/view-statement',
                action: 'itsHaveAccess',
                subject: 'view-statement'
              },
              {
                title: 'Request Statement',
                icon: FileDocumentOutline,
                path: '/Corporate-InnerPages/Statement/request-statement',
                action: 'itsHaveAccess',
                subject: 'request-statement'
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
      icon: CogOutline,
      action: 'itsHaveAccess',
      subject: 'settings',
      children: [
        {
          title: 'Profile',
          icon: LockReset,
          path: '/settings/profile',
          action: 'itsHaveAccess',
          subject: 'profile-page'
        },
        {
          title: 'Change Password',
          icon: LockReset,
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