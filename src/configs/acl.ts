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


const defineRulesFor = (role: string, subject: string, user?: any) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  if (Array.isArray(user?.userProfile?.authorizedUIComponents)) {
    user?.userProfile?.authorizedUIComponents.forEach((ele: any) => {
      if (ele && ele.component) {
        can('itsHaveAccess', ele.component)
      }
    })
  }
  return rules
}

export const buildAbilityFor = (role: string, subject: string, user?: any): AppAbility => {
  return new AppAbility(defineRulesFor(role, subject, user), {
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
