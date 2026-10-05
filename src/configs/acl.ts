// @ts-ignore
import { AbilityBuilder, Ability } from '@casl/ability'
import { useAuth } from 'src/hooks/useAuth'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete' | 'itsHaveAccess'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

// export const RoleCode: {
//   SUPER_ADMIN: 'SUPER_ADMIN',
//   COMPANY_ADMIN: 'COMPANY_ADMIN',
//   ADMIN: 'ADMIN',
//   MANAGER: 'MANAGER',
//   INSPECTOR: 'INSPECTOR'
// };
/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (role: string, subject: string) => {
  // console.log('=============defineRulesFor=========')
  // console.log('subject', subject)
  // console.log('role', role)
  // console.log('====================================')

  const { can, rules } = new AbilityBuilder(AppAbility)
  // console.log('============AbilityBuilder=========');
  // console.log('rules', rules)
  // console.log('====================================')
  // can('manage', 'all')

  const { user } = useAuth()

  if (Array.isArray(user?.userProfile?.authorizedUIComponents)) {
    user?.userProfile?.authorizedUIComponents.forEach((ele: any) => {
      if (ele && ele.component) {
        can('itsHaveAccess', ele.component)
      }
    })
  }

  // if (role === 'Administrator') {
  //   // dashboard
  //   can('itsHaveAccess', 'dashboard-page')
  //   // transaction activity
  //   can('itsHaveAccess', 'approval-screen-page')

  //   // Party Maintenance
  //   can('itsHaveAccess', 'party-maintenance') // parent
  //   can('itsHaveAccess', 'party-maintenance-party-management-page')
  //   can('itsHaveAccess', 'party-maintenance-user-management-page')
  //   can('itsHaveAccess', 'party-maintenance-user-management-user-page')
  //   can('itsHaveAccess', 'party-maintenance-user-management-edit-user-page')
  //   can('itsHaveAccess', 'party-maintenance-user-management-add-user-page')
  //   can('itsHaveAccess', 'party-maintenance-user-management-review-user-page')
  //   can('itsHaveAccess', 'party-maintenance-party-account-access-page')
  //   can('itsHaveAccess', 'party-maintenance-user-account-access-page')
  //   can('itsHaveAccess', 'party-maintenance-workflow-management-page')
  //   can('itsHaveAccess', 'party-maintenance-workflow-management-add-workflow-page')
  //   can('itsHaveAccess', 'party-maintenance-workflow-management-review-workflow-page')
  //   can('itsHaveAccess', 'party-maintenance-rule-management-page')
  //   can('itsHaveAccess', 'party-maintenance-rule-management-create-rule-page')
  //   can('itsHaveAccess', 'party-maintenance-rule-management-review-rule-page')
  //   // Admin Maintenance
  //   can('itsHaveAccess', 'admin-maintenance') // parent
  //   can('itsHaveAccess', 'admin-maintenance-role-transaction-component-page')
  //   can('itsHaveAccess', 'admin-maintenance-role-transaction-mapping-page')
  //   can('itsHaveAccess', 'admin-maintenance-user-management-page')
  //   can('itsHaveAccess', 'admin-maintenance-user-management-add-user-page')
  //   can('itsHaveAccess', 'admin-maintenance-user-management-review-user-page')
  //   // Setting Pages
  //   can('itsHaveAccess', 'settings') // parent
  //   can('itsHaveAccess', 'settings-profile-page')
  //   can('itsHaveAccess', 'settings-change-username-page')
  //   can('itsHaveAccess', 'settings-change-password-page')


  // } else if (role === 'Corporate User') {

  //   // Dashboard
  //   can('itsHaveAccess', 'corporate-dashboard-page')

  //   // Setting Pages
  //   can('itsHaveAccess', 'settings') // parent
  //   can('itsHaveAccess', 'settings-profile-page')
  //   can('itsHaveAccess', 'settings-change-username-page')
  //   can('itsHaveAccess', 'settings-change-password-page')

  //   // transaction activity
  //   can('itsHaveAccess', 'approval-screen-page')

  //   // account & statement pages
  //   can('itsHaveAccess', 'accounts') // parent
  //   can('itsHaveAccess', 'corporate-account-account-details-page')
  //   can('itsHaveAccess', 'corporate-account-statement-view-statement-page')
  //   can('itsHaveAccess', 'corporate-account-statement-request-statement-page')

  //   // account TD pages
  //   can('itsHaveAccess', 'term-deposit') // parent
  //   can('itsHaveAccess', 'corporate-account-term-deposit-create-TDR-page')
  //   can('itsHaveAccess', 'corporate-account-term-deposit-view-TDR-page')
  //   can('itsHaveAccess', 'corporate-account-term-deposit-encashment-page')

  //   // international payment pages
  //   can('itsHaveAccess', 'international-payments') // parent
  //   can('itsHaveAccess', 'international-payments-single-payment-page')
  //   can('itsHaveAccess', 'international-payments-review-single-payment-page')
  //   can('itsHaveAccess', 'international-payments-single-payment-success-page')
  //   can('itsHaveAccess', 'international-payments-bulk-payment-page')
  //   can('itsHaveAccess', 'international-payments-payments-inquiry-page')

  //   // domestic payment pages
  //   can('itsHaveAccess', 'domestic-payments') // parent
  //   can('itsHaveAccess', 'domestic-payments-funds-transfer-page')

  //   // beneficiary management pages
  //   can('itsHaveAccess', 'beneficiary-management') // parent
  //   can('itsHaveAccess', 'beneficiary-management-add-beneficiary-page')
  //   can('itsHaveAccess', 'beneficiary-management-add-beneficiary-success-page')
  //   can('itsHaveAccess', 'beneficiary-management-review-add-beneficiary-page')
  //   can('itsHaveAccess', 'beneficiary-management-view-beneficiary-page')

  //   // trade-lc pages
  //   can('itsHaveAccess', 'trade-lc') // parent
  //   can('itsHaveAccess', 'trade-create-lc-page')
  //   can('itsHaveAccess', 'trade-view-advice-page')
  //   can('itsHaveAccess', 'trade-view-advice-advice-result-page')
  //   can('itsHaveAccess', 'trade-view-lc-page')
  //   can('itsHaveAccess', 'trade-view-lc-lc-result-page')
  //   can('itsHaveAccess', 'trade-view-lc-draft-page')
  //   can('itsHaveAccess', 'trade-view-swift-draft-page')
  //   can('itsHaveAccess', 'trade-view-swift-draft-swift-result-page')

  //   // certificates
  //   can('itsHaveAccess', 'certificates') // parent
  //   can('itsHaveAccess', 'certificates-balance-certificate-page')
  //   can('itsHaveAccess', 'certificates-account-maintenance-certificate-page')

  // } else {
  //   can('itsHaveAccess', 'empty-dashboard-page')
  // }
  //   // can('allow', 'project-add')
  // } else {
  //   can(['read', 'create', 'update', 'delete'], subject)
  // }
  return rules
}

export const buildAbilityFor = (role: string, subject: string): AppAbility => {
  return new AppAbility(defineRulesFor(role, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
