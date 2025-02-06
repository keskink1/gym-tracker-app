export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
}

export type UserDataType = {
  fullName: string
  email: string
  avatar?: string | null
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  initAuth: () => Promise<void>
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}
