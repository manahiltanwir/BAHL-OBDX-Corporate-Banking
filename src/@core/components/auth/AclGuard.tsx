import { ReactNode, useMemo } from 'react'
import { useRouter } from 'next/router'
import type { ACLObj } from 'src/configs/acl'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { buildAbilityFor } from 'src/configs/acl'
import NotAuthorized from 'src/pages/401'
import BlankLayout from 'src/@core/layouts/GuestLayout'
import { useAuth } from 'src/hooks/useAuth'

interface AclGuardProps {
  children: ReactNode
  guestGuard: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  const { aclAbilities, children, guestGuard } = props

  const auth = useAuth()
  const router = useRouter()

  const ability = useMemo(() => {
    if (auth.user && auth.user.userProfile) {
      return buildAbilityFor(auth.user.userProfile.enterpriseRole, aclAbilities.subject, auth.user)
    }

    return undefined
  }, [auth.user, aclAbilities.subject])

  if (guestGuard || router.route === '/404' || router.route === '/500' || router.route === '/') {
    return <>{children}</>
  }

  if (ability && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard