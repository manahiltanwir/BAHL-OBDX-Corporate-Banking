// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = (role: string) => {
  // if (role === 'client') return '/acl'
  // else return '/dashboards/crm'
  return '/category'
}

const Home = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    // console.log('==========Auth=======================');
    // console.log(auth);
    // console.log('====================================');
    if (auth.user && auth.user.role) {
      const homeRoute = getHomeRoute(auth.user.role.code)

      // Redirect user to Home URL
      router.replace(homeRoute)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Spinner />
}

export default Home
