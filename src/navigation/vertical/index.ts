import Home from 'mdi-material-ui/Home'
import ViewDashboard from 'mdi-material-ui/ViewDashboard'
import Domain from 'mdi-material-ui/Domain'
import AccountGroup from 'mdi-material-ui/AccountGroup'
import AccountCog from 'mdi-material-ui/AccountCog'
import AccountKey from 'mdi-material-ui/AccountKey'
import Sitemap from 'mdi-material-ui/Sitemap'
import AccountLock from 'mdi-material-ui/AccountLock'
import Gavel from 'mdi-material-ui/Gavel'
import SwapHorizontal from 'mdi-material-ui/SwapHorizontal'
import SwapHorizontalBold from 'mdi-material-ui/SwapHorizontalBold'
import FilePlusOutline from 'mdi-material-ui/FilePlusOutline'
import FileFindOutline from 'mdi-material-ui/FileFindOutline'
import FileDocumentOutline from 'mdi-material-ui/FileDocumentOutline'
import FileDocumentEditOutline from 'mdi-material-ui/FileDocumentEditOutline'
import FileSendOutline from 'mdi-material-ui/FileSendOutline'
import FileAccountOutline from 'mdi-material-ui/FileAccountOutline'
import MessageTextOutline from 'mdi-material-ui/MessageTextOutline'
import CertificateOutline from 'mdi-material-ui/CertificateOutline'
import ScaleBalance from 'mdi-material-ui/ScaleBalance'
import PlusCircleOutline from 'mdi-material-ui/PlusCircleOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import CashRefund from 'mdi-material-ui/CashRefund'
import Import from 'mdi-material-ui/Import'
import Export from 'mdi-material-ui/Export'
import CogOutline from 'mdi-material-ui/CogOutline'
import LockReset from 'mdi-material-ui/LockReset'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import AccountEditOutline from 'mdi-material-ui/AccountEditOutline'
import VectorLink from 'mdi-material-ui/VectorLink'
import Earth from 'mdi-material-ui/Earth'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import CashMultiple from 'mdi-material-ui/CashMultiple'
import BankOutline from 'mdi-material-ui/BankOutline'
import BankTransfer from 'mdi-material-ui/BankTransfer'
import BankTransferOut from 'mdi-material-ui/BankTransferOut'
import WalletOutline from 'mdi-material-ui/WalletOutline'
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { ClipboardCheckOutline } from 'mdi-material-ui'
import Magnify from 'mdi-material-ui/Magnify'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'

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
      title: 'Dashboard',
      icon: Domain,
      path: '/corporate-dashboard',
      action: 'itsHaveAccess',
      subject: 'corporate-dashboard-page'
    },

    // ==================== ACCOUNTS ====================
    ...(ability?.can('itsHaveAccess', 'view-statement')
      ? [
          {
            title: 'Accounts',
            icon: BankOutline,
            action: 'itsHaveAccess',
            subject: 'view-statement',
            children: [
              {
                title: 'Current and Saving',
                icon: WalletOutline,
                action: 'itsHaveAccess',
                subject: 'view-statement',
                children: [
                  {
                    title: 'View Statement',
                    icon: EyeOutline,
                    path: '/Corporate-InnerPages/Statement/view-statement',
                    action: 'itsHaveAccess',
                    subject: 'view-statement'
                  },
                  {
                    title: 'Request Statement',
                    icon: FileSendOutline,
                    path: '/Corporate-InnerPages/Statement/request-statement',
                    action: 'itsHaveAccess',
                    subject: 'request-statement'
                  }
                ]
              },
              ...(ability?.can('itsHaveAccess', 'Term-Deposite')
                ? [
                    {
                      title: 'Term Deposit',
                      icon: CertificateOutline,
                      action: 'itsHaveAccess',
                      subject: 'Term-Deposite',
                      children: [
                        {
                          title: 'Create TDR',
                          icon: PlusCircleOutline,
                          path: '/Corporate-InnerPages/Term-Deposite/create-TDR',
                          action: 'itsHaveAccess',
                          subject: 'create-TDR'
                        },
                        {
                          title: 'View TDR',
                          icon: EyeOutline,
                          path: '/Corporate-InnerPages/Term-Deposite/view-TDR',
                          action: 'itsHaveAccess',
                          subject: 'view-TDR'
                        },
                        {
                          title: 'Encashment',
                          icon: CashRefund,
                          path: '/Corporate-InnerPages/Term-Deposite/encashment',
                          action: 'itsHaveAccess',
                          subject: 'encashment'
                        }
                      ]
                    }
                  ]
                : [])
            ]
          }
        ]
      : []),

    // ==================== PAYMENTS ====================
    ...(ability?.can('itsHaveAccess', 'Payment')
      ? [
          {
            title: 'Payments',
            icon: BankTransfer,
            action: 'itsHaveAccess',
            subject: 'Payment',
            children: [
              {
                title: 'International Payment',
                icon: Earth,
                action: 'itsHaveAccess',
                subject: 'payment',
                children: [
                  {
                    title: 'Single Payment',
                    icon: CurrencyUsd,
                    path: '/Corporate-InnerPages/International-Payments/single-payment',
                    action: 'itsHaveAccess',
                    subject: 'payment'
                  },
                  {
                    title: 'Bulk Payment',
                    icon: CashMultiple,
                    path: '/Corporate-InnerPages/International-Payments/bulk-payment',
                    action: 'itsHaveAccess',
                    subject: 'payment'
                  },
                  {
                    title: 'inquiry',
                    icon: Magnify,
                    path: '/Corporate-InnerPages/International-Payments/inquiry',
                    action: 'itsHaveAccess',
                    subject: 'payment'
                  }
                ]
              },
              ...(ability?.can('itsHaveAccess', 'Payment')
                ? [
                    {
                      title: 'Domestic Payment',
                      icon: SwapHorizontalBold,
                      action: 'itsHaveAccess',
                      subject: 'Payment',
                      children: [
                        {
                          title: 'Fund Transfer',
                          icon: BankTransferOut,
                          path: '/Corporate-InnerPages/Payments/fund-transfer',
                          action: 'itsHaveAccess',
                          subject: 'fund-transfer'
                        }
                      ]
                    }
                  ]
                : [])
            ]
          }
        ]
      : []),

        // ==================== Beni Management ====================
    ...(ability?.can('itsHaveAccess', 'beneficiary-management')
      ? [
          {
            title: 'Beneficiary Management',
            icon: AccountGroup,
            action: 'itsHaveAccess',
            subject: 'beneficiary-management',
            children: [
              {
                title: 'Add Beneficiary',
                icon: AccountPlusOutline,
                path: '/Corporate-InnerPages/beneficiary-management/add-beneficiary',
                action: 'itsHaveAccess',
                subject: 'add-beneficiary'
              },
              {
                title: 'View Beneficiary',
                icon: FileAccountOutline,
                path: '/Corporate-InnerPages/beneficiary-management/view-beneficiary',
                action: 'itsHaveAccess',
                subject: 'view-beneficiary'
              }
            ]
          }
        ]
      : []),


    // ==================== TRADE ====================
    ...(ability?.can('itsHaveAccess', 'create-lc')
      ? [
          {
            title: 'Trade',
            icon: SwapHorizontal,
            action: 'itsHaveAccess',
            subject: 'trade',
            children: [
              {
                title: 'Import',
                icon: Import,
                action: 'itsHaveAccess',
                subject: 'import',
                children: [
                  {
                    title: 'Create LC',
                    icon: FilePlusOutline,
                    path: '/Corporate-InnerPages/Trade/create-lc',
                    action: 'itsHaveAccess',
                    subject: 'create-lc'
                  },
                  {
                    title: 'View LC',
                    icon: FileFindOutline,
                    path: '/Corporate-InnerPages/Trade/view-lc',
                    action: 'itsHaveAccess',
                    subject: 'view-lc'
                  },
                  {
                    title: 'Debit Advice',
                    icon: FileDocumentOutline,
                    path: '/Corporate-InnerPages/Trade/view-advice',
                    action: 'itsHaveAccess',
                    subject: 'view-advice'
                  },
                  {
                    title: 'View Swift Draft',
                    icon: FileDocumentEditOutline,
                    path: '/Corporate-InnerPages/Trade/view-swift-draft',
                    action: 'itsHaveAccess',
                    subject: 'view-lc-draft'
                  },
                  {
                    title: 'View Swift Message',
                    icon: MessageTextOutline,
                    path: '/Corporate-InnerPages/Trade/view-lc-draft',
                    action: 'itsHaveAccess',
                    subject: 'view-lc-draft'
                  }
                ]
              },
              {
                title: 'Export',
                icon: Export,
                action: 'itsHaveAccess',
                subject: 'export',
                children: [
                  // Export child pages will be added here later
                ]
              }
            ]
          }
        ]
      : []),

      
    // ==================== CERTIFICATES ====================
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
                icon: FileAccountOutline,
                path: '/Corporate-InnerPages/Certificates/account-maintaince-certificate',
                action: 'itsHaveAccess',
                subject: 'balance-certificate'
              }
            ]
          }
        ]
      : []),
   
  
    // ==================== OPERATIONS & ADMINISTRATION ====================
    {
      title: 'Transaction Activity',
      icon: ClipboardCheckOutline,
      path: '/approval-screen',
      action: 'itsHaveAccess',
      subject: 'approval-screen'
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
      title: 'Role Transaction Mapping',
      icon: VectorLink,
      path: '/role-transaction-mapping',
      action: 'itsHaveAccess',
      subject: 'role-transaction-mapping'
    },

    // ==================== SETTINGS ====================
    {
      title: 'Settings',
      icon: CogOutline,
      action: 'itsHaveAccess',
      subject: 'settings',
      children: [
        {
          title: 'Profile',
          icon: AccountOutline,
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
        },
        {
          title: 'Change Username',
          icon: AccountEditOutline,
          path: '/settings/change-username',
          action: 'itsHaveAccess',
          subject: 'change-username'
        }
      ]
    }
  ]
}

export default navigation