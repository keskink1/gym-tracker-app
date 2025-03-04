// ** React Imports
import { ReactNode } from 'react'

// ** Component Imports
// ** Types
import { NavLink } from 'src/@core/layouts/types'
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  navLink?: NavLink
  children: ReactNode
}

const CanViewNavLink = (props: Props) => {
  // ** Props
  const { children, navLink } = props
  const auth = useAuth()

  if (auth.user || (navLink && navLink.auth === false)) {
    return <>{children}</>
  } else {
    return null
  }
}

export default CanViewNavLink
