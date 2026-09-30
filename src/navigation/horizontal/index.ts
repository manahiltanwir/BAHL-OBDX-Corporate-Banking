import { useContext } from 'react'
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
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import PuzzleOutline from 'mdi-material-ui/PuzzleOutline'
import ClipboardCheckOutline from 'mdi-material-ui/ClipboardCheckOutline'
import Magnify from 'mdi-material-ui/Magnify'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import { HorizontalNavItemsType } from 'src/@core/layouts/types'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const navigation = (): HorizontalNavItemsType => {
  const ability = useContext(AbilityContext)

  return [
    {
      title: 'Dashboard',
      icon: Domain,
      path: '/corporate-dashboard',
      action: 'itsHaveAccess',
      subject: 'corporate-dashboard-page'
    },
    {
      title: 'Dashboard',
      icon: ViewDashboard,
      path: '/dashboard',
      action: 'itsHaveAccess',
      subject: 'dashboard-page'
    },
    {
      title: 'Transaction Activity',
      icon: ClipboardCheckOutline,
      path: '/approval-screen',
      action: 'itsHaveAccess',
      subject: 'approval-screen-page'
    },

    // ==================== PARTY MAINTENANCE ====================
    ...(ability?.can('itsHaveAccess', 'party-maintenance')
      ? [
          {
            title: 'Party Maintenance',
            icon: VectorLink,
            children: [
              {
                title: 'Party Management',
                icon: AccountGroup,
                path: '/party-maintenance/party-management',
                action: 'itsHaveAccess',
                subject: 'party-maintenance-party-management-page'
              },
              {
                title: 'User Management',
                icon: AccountCog,
                path: '/party-maintenance/user-management',
                action: 'itsHaveAccess',
                subject: 'party-maintenance-user-management-page'
              },
              {
                title: 'Party Account Access',
                icon: AccountKey,
                path: '/party-maintenance/party-account-access',
                action: 'itsHaveAccess',
                subject: 'party-maintenance-party-account-access-page'
              },
              {
                title: 'User Account Access',
                icon: AccountLock,
                path: '/party-maintenance/user-account-access',
                action: 'itsHaveAccess',
                subject: 'party-maintenance-user-account-access-page'
              },
              {
                title: 'Workflow Management',
                icon: Sitemap,
                path: '/party-maintenance/workflow-management',
                action: 'itsHaveAccess',
                subject: 'party-maintenance-workflow-management-page'
              },
              {
                title: 'Rule Management',
                icon: Gavel,
                path: '/party-maintenance/rule-management',
                action: 'itsHaveAccess',
                subject: 'party-maintenance-rule-management-page'
              }
            ]
          }
        ]
      : []),

    // ==================== ACCOUNTS ====================
    ...(ability?.can('itsHaveAccess', 'accounts')
      ? [
          {
            title: 'Accounts',
            icon: BankOutline,
            children: [
              {
                title: 'Current and Saving',
                icon: WalletOutline,
                children: [
                  {
                    title: 'Account Details',
                    icon: CreditCardOutline,
                    path: '/Corporate-InnerPages/Account/account-details',
                    action: 'itsHaveAccess',
                    subject: 'corporate-account-account-details-page'
                  },
                  {
                    title: 'View Statement',
                    icon: EyeOutline,
                    path: '/Corporate-InnerPages/Statement/view-statement',
                    action: 'itsHaveAccess',
                    subject: 'corporate-account-statement-view-statement-page'
                  },
                  {
                    title: 'Request Statement',
                    icon: FileSendOutline,
                    path: '/Corporate-InnerPages/Statement/request-statement',
                    action: 'itsHaveAccess',
                    subject: 'corporate-account-statement-request-statement-page'
                  }
                ]
              },
              ...(ability?.can('itsHaveAccess', 'term-deposit')
                ? [
                    {
                      title: 'Term Deposit',
                      icon: CertificateOutline,
                      children: [
                        {
                          title: 'Create TDR',
                          icon: PlusCircleOutline,
                          path: '/Corporate-InnerPages/Term-Deposite/create-TDR',
                          action: 'itsHaveAccess',
                          subject: 'corporate-account-term-deposit-create-TDR-page'
                        },
                        {
                          title: 'View TDR',
                          icon: EyeOutline,
                          path: '/Corporate-InnerPages/Term-Deposite/view-TDR',
                          action: 'itsHaveAccess',
                          subject: 'corporate-account-term-deposit-view-TDR-page'
                        },
                        {
                          title: 'Encashment',
                          icon: CashRefund,
                          path: '/Corporate-InnerPages/Term-Deposite/encashment',
                          action: 'itsHaveAccess',
                          subject: 'corporate-account-term-deposit-encashment-page'
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
    ...(ability?.can('itsHaveAccess', 'international-payments')
      ? [
          {
            title: 'Payments',
            icon: BankTransfer,
            children: [
              {
                title: 'International Payment',
                icon: Earth,
                children: [
                  {
                    title: 'Single Payment',
                    icon: CurrencyUsd,
                    path: '/Corporate-InnerPages/International-Payments/single-payment',
                    action: 'itsHaveAccess',
                    subject: 'international-payments-single-payment-page'
                  },
                  {
                    title: 'Bulk Payment',
                    icon: CashMultiple,
                    path: '/Corporate-InnerPages/International-Payments/bulk-payment',
                    action: 'itsHaveAccess',
                    subject: 'international-payments-bulk-payment-page'
                  },
                  {
                    title: 'Payment Inquiry',
                    icon: Magnify,
                    path: '/Corporate-InnerPages/International-Payments/inquiry',
                    action: 'itsHaveAccess',
                    subject: 'international-payments-payments-inquiry-page'
                  }
                ]
              },
              ...(ability?.can('itsHaveAccess', 'domestic-payments')
                ? [
                    {
                      title: 'Domestic Payment',
                      icon: SwapHorizontalBold,
                      children: [
                        {
                          title: 'Fund Transfer',
                          icon: BankTransferOut,
                          path: '/Corporate-InnerPages/Payments/fund-transfer',
                          action: 'itsHaveAccess',
                          subject: 'domestic-payments-funds-transfer-page'
                        }
                      ]
                    }
                  ]
                : [])
            ]
          }
        ]
      : []),

    // ==================== BENEFICIARY MANAGEMENT ====================
    ...(ability?.can('itsHaveAccess', 'beneficiary-management')
      ? [
          {
            title: 'Beneficiary Management',
            icon: AccountGroup,
            children: [
              {
                title: 'Add Beneficiary',
                icon: AccountPlusOutline,
                path: '/Corporate-InnerPages/beneficiary-management/add-beneficiary',
                action: 'itsHaveAccess',
                subject: 'beneficiary-management-add-beneficiary-page'
              },
              {
                title: 'View Beneficiary',
                icon: FileAccountOutline,
                path: '/Corporate-InnerPages/beneficiary-management/view-beneficiary',
                action: 'itsHaveAccess',
                subject: 'beneficiary-management-view-beneficiary-page'
              }
            ]
          }
        ]
      : []),

    // ==================== TRADE ====================
    ...(ability?.can('itsHaveAccess', 'trade-lc')
      ? [
          {
            title: 'Trade',
            icon: SwapHorizontal,
            children: [
              {
                title: 'Import',
                icon: Import,
                children: [
                  {
                    title: 'Create LC',
                    icon: FilePlusOutline,
                    path: '/Corporate-InnerPages/Trade/create-lc',
                    action: 'itsHaveAccess',
                    subject: 'trade-create-lc-page'
                  },
                  {
                    title: 'View LC',
                    icon: FileFindOutline,
                    path: '/Corporate-InnerPages/Trade/view-lc',
                    action: 'itsHaveAccess',
                    subject: 'trade-view-lc-page'
                  },
                  {
                    title: 'Debit Advice',
                    icon: FileDocumentOutline,
                    path: '/Corporate-InnerPages/Trade/view-advice',
                    action: 'itsHaveAccess',
                    subject: 'trade-view-advice-page'
                  },
                  {
                    title: 'View Swift Draft',
                    icon: FileDocumentEditOutline,
                    path: '/Corporate-InnerPages/Trade/view-swift-draft',
                    action: 'itsHaveAccess',
                    subject: 'trade-view-swift-draft-page'
                  },
                  {
                    title: 'View Swift Message',
                    icon: MessageTextOutline,
                    path: '/Corporate-InnerPages/Trade/view-lc-draft',
                    action: 'itsHaveAccess',
                    subject: 'trade-view-lc-draft-page'
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
    ...(ability?.can('itsHaveAccess', 'certificates')
      ? [
          {
            title: 'Certificate',
            icon: CertificateOutline,
            children: [
              {
                title: 'Balance Certificate',
                icon: ScaleBalance,
                path: '/Corporate-InnerPages/Certificates/balance-certificate',
                action: 'itsHaveAccess',
                subject: 'certificates-balance-certificate-page'
              },
              {
                title: 'Account Maintaince Certificate',
                icon: FileAccountOutline,
                path: '/Corporate-InnerPages/Certificates/account-maintenance-certificate',
                action: 'itsHaveAccess',
                subject: 'certificates-account-maintenance-certificate-page'
              }
            ]
          }
        ]
      : []),

    // ==================== ADMIN MAINTENANCE ====================
    ...(ability?.can('itsHaveAccess', 'admin-maintenance')
      ? [
          {
            title: 'Admin Maintenance',
            icon: VectorLink,
            children: [
              {
                title: 'User Management',
                icon: SwapHorizontal,
                path: '/admin-maintenance/user-management',
                action: 'itsHaveAccess',
                subject: 'admin-maintenance-user-management-page'
              },
              {
                title: 'Role Transaction Mapping',
                icon: SwapHorizontal,
                path: '/admin-maintenance/role-transaction-mapping',
                action: 'itsHaveAccess',
                subject: 'admin-maintenance-role-transaction-component-page'
              },
              {
                title: 'Component Mapping',
                icon: PuzzleOutline,
                path: '/admin-maintenance/role-transaction-component',
                action: 'itsHaveAccess',
                subject: 'admin-maintenance-role-transaction-mapping-page'
              }
            ]
          }
        ]
      : []),

    // ==================== SETTINGS ====================
    ...(ability?.can('itsHaveAccess', 'settings')
      ? [
          {
            title: 'Settings',
            icon: CogOutline,
            children: [
              {
                title: 'Profile',
                icon: AccountOutline,
                path: '/settings/profile',
                action: 'itsHaveAccess',
                subject: 'settings-profile-page'
              },
              {
                title: 'Change Password',
                icon: LockReset,
                path: '/settings/change-password',
                action: 'itsHaveAccess',
                subject: 'settings-change-password-page'
              },
              {
                title: 'Change Username',
                icon: AccountEditOutline,
                path: '/settings/change-username',
                action: 'itsHaveAccess',
                subject: 'settings-change-username-page'
              }
            ]
          }
        ]
      : [])
  ]
}

export default navigation