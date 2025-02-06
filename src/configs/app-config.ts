export const API_BASE_URL = 'http://localhost:4000/api'
export const ASSETS_BASE_URL = 'http://localhost:4000/static/'

//export const API_BASE_URL = 'http://46.101.209.211:5000/api'
//export const ASSETS_BASE_URL = 'http://46.101.209.211:5000/static/'

export const NO_AUTH_ROUTES = [
  '/login',
  '/register',
  '/verify-registration',
  '/pay/',
  '/', // Ana sayfa
  '/dashboard' // Dashboard sayfasını da ekledik
]
