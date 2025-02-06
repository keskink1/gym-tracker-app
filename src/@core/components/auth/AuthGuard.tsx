// ** React Imports
import { ReactElement, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { NO_AUTH_ROUTES } from 'src/configs/app-config'
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(
    () => {
      if (!router.isReady) {
        return
      }

      // Şu anki path'in auth gerektirip gerektirmediğini kontrol et
      const isPublicRoute = NO_AUTH_ROUTES.some(route => router.pathname === route || router.pathname.startsWith(route))

      // Eğer login sayfasındaysak ve kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
      if (router.pathname === '/login' && (auth.user || window.localStorage.getItem('token'))) {
        router.replace('/')
        return
      }

      // Eğer public olmayan bir sayfadaysak ve kullanıcı giriş yapmamışsa login'e yönlendir
      if (!isPublicRoute && !auth.user && !window.localStorage.getItem('token')) {
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath }
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady, router.pathname, auth.user]
  )

  if (auth.loading) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
