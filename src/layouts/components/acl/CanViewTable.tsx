// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Types
import { NavSectionTitle } from 'src/@core/layouts/types'

// ** Auth Imports
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  children: ReactNode
  navTitle?: NavSectionTitle
}

const CanViewTable = (props: Props) => {
  // ** Props

  const { children, navTitle } = props

  // ** Hook
  const ability = useContext(AbilityContext)
  const auth = useAuth()
  const role = auth?.user?.role

  //   return ability && ability.can(navTitle?.action, navTitle?.subject) ? <>{children}</> : null
  return role?.code && role.code === 'SUPER_ADMIN' ? null : <>{children}</>
}

export default CanViewTable
