export interface BaseErrorResponse {
  success: false
  error: string
}

export interface BaseSuccessResponse<T> {
  success: true
  result: T
}

export type BaseResponse<T> = BaseSuccessResponse<T> | BaseErrorResponse

export interface UserDataType {
  id?: string
  _id?: string
  email: string
  name: string
  surname?: string
  stripeEnabled?: boolean
}

export interface LoginResult {
  token: string
  user: UserDataType
}

export type AuthLoginResponse = BaseResponse<LoginResult>

export interface LoginParams {
  email: string
  password: string
}

export type ErrCallbackType = (err: { [key: string]: string }) => void

export interface AuthValuesType {
  user: UserDataType | null
  loading: boolean
  setUser: (user: UserDataType | null) => void
  setLoading: (loading: boolean) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => Promise<void>
  logout: () => void
  initAuth: () => Promise<void>
}
