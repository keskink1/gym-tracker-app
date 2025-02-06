// ** React Imports
import { ReactNode, createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types
import authService from 'src/@core/services/auth.service'
import { UserDataType, AuthValuesType, LoginParams, ErrCallbackType } from 'src/types/auth'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  initAuth: () => Promise.resolve(),
  setLoading: () => null,
  login: () => Promise.resolve(),
  logout: () => null
}

const AuthContext = createContext<AuthValuesType>(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (!token && !router.pathname.includes('/login')) {
        router.push('/login')
      } else {
        initAuth()
      }
    }
  }, [router.pathname])

  const initAuth = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        setLoading(false)
        if (!router.pathname.includes('/login')) {
          router.push('/login')
        }
        return
      }

      const response = await authService.meEndpoint()
      if (response.success) {
        setUser(response.result)
        setLoading(false)
      } else {
        localStorage.removeItem('token')
        setUser(null)
        if (!router.pathname.includes('/login')) {
          router.push('/login')
        }
      }
    } catch (error) {
      localStorage.removeItem('token')
      setUser(null)
      if (!router.pathname.includes('/login')) {
        router.push('/login')
      }
    }
  }

  const handleLogin = async (params: LoginParams, errorCallback?: ErrCallbackType) => {
    try {
      setLoading(true)

      if (!params.email?.trim() || !params.password?.trim()) {
        errorCallback?.({ login: 'Email and password are required' })
        return
      }

      const response = await authService.login(params)
      console.log('Login response in context:', response)

      if (response.success && response.result.token) {
        // Token'ı kaydet
        const token = response.result.token
        console.log('Saving token:', token.substring(0, 20) + '...')
        localStorage.setItem('token', token)

        // User bilgisini al
        const userResponse = await authService.meEndpoint()
        console.log('User response:', userResponse)

        if (userResponse.success) {
          setUser(userResponse.result)
          const returnUrl = router.query.returnUrl as string
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
          await router.push(redirectURL)
        } else {
          console.error('Failed to get user data:', userResponse.error)
          localStorage.removeItem('token')
          errorCallback?.({ login: 'Failed to get user data' })
        }
      } else {
        console.error('Login failed:', !response.success ? response.error : 'Unknown error')
        errorCallback?.({ login: !response.success ? response.error : 'Unknown error' })
      }
    } catch (error: any) {
      console.error('Login error in context:', error)
      errorCallback?.({
        login: 'Connection failed. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    initAuth,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
