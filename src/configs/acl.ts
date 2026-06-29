// @ts-ignore
import { AbilityBuilder, Ability } from '@casl/ability'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

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
  can('manage', 'all')
  // can('itsHaveAccess', 'channels-page')

  // if (role === 'SUPER_ADMIN') {
  //   can('itsHaveAccess', 'like-videos-page')
  //   can('itsHaveAccess', 'dashboard-page')
  //   can('itsHaveAccess', 'saved-videos-page')
  //   can('itsHaveAccess', 'channels-page')
  //   can('itsHaveAccess', 'watch-videos')
  //   can('itsHaveAccess', 'playlist-page')
  //   can('itsHaveAccess', 'students-page')
  //   can('itsHaveAccess', 'teachers-page')
  //   can('itsHaveAccess', 'teachers-payments-page')
  //   can('itsHaveAccess', 'subscription-button')
  //   can('itsHaveAccess', 'edit-subscription-details')
  //   can('itsHaveAccess', 'payment-page')
  //   can('itsHaveAccess', 'thead')
  //   can('itsHaveAccess', 'settings-profile-page')
  //   can('itsHaveAccess', 'change-password-page')
  //   can('itsHaveAccess', 'workspace-page')
  //   can('itsHaveAccess', 'chat-page')
  //   can('itsHaveAccess', 'calendar-page')
  //   can('itsHaveAccess', 'community-page')
  // } else if (role === 'TEACHER') {
  //   can('itsHaveAccess', 'like-videos-page')
  //   can('itsHaveAccess', 'dashboard-page')
  //   can('itsHaveAccess', 'channels-page')
  //   can('itsHaveAccess', 'watch-videos')
  //   can('itsHaveAccess', 'playlist-page')
  //   can('itsHaveAccess', 'videos-page')
  //   can('itsHaveAccess', 'CreatePlaylist-Header-page')
  //   can('itsHaveAccess', 'create-channel-button')
  //   can('itsHaveAccess', 'create-playlist-button')
  //   can('itsHaveAccess', 'settings-profile-page')
  //   can('itsHaveAccess', 'change-password-page')
  //   can('itsHaveAccess', 'saved-videos-page')
  //   can('itsHaveAccess', 'workspace-page')
  //   can('itsHaveAccess', 'go-live-page')
  //   can('itsHaveAccess', 'upload-folder-button')
  //   can('itsHaveAccess', 'upload-files-button')
  //   can('itsHaveAccess', 'chat-page')
  //   can('itsHaveAccess', 'community-page')
  //   can('itsHaveAccess', 'calendar-page')
  // } else if (role === 'STUDENT') {
  //   can('itsHaveAccess', 'like-videos-page')
  //   can('itsHaveAccess', 'dashboard-page')
  //   can('itsHaveAccess', 'channels-page')
  //   can('itsHaveAccess', 'watch-videos')
  //   can('itsHaveAccess', 'playlist-page')
  //   can('itsHaveAccess', 'community-page')
  //   can('itsHaveAccess', 'payment-page')
  //   can('itsHaveAccess', 'payment-checkout-page')
  //   can('itsHaveAccess', 'payment-success-page')
  //   can('itsHaveAccess', 'invite-friends-page')
  //   can('itsHaveAccess', 'points-page')
  //   can('itsHaveAccess', 'share-invitations-page')
  //   can('itsHaveAccess', 'subscribe-button')
  //   can('itsHaveAccess', 'saved-videos-page')
  //   can('itsHaveAccess', 'settings-profile-page')
  //   can('itsHaveAccess', 'change-password-page')
  //   can('itsHaveAccess', 'workspace-page')
  //   can('itsHaveAccess', 'chat-page')
  //   can('itsHaveAccess', 'calendar-page')

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
