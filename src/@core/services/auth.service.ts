import { axiosClient } from 'src/configs/axios-client'
import { AuthLoginResponse, BaseResponse, UserDataType } from '../../../src/types/auth'
import { AuthRegisterRequest, AuthRegisterResponse } from '../models/auth-models'

interface LoginParams {
  email: string
  password: string
}

const authService = {
  meEndpoint: async (): Promise<BaseResponse<UserDataType>> => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        return {
          success: false,
          error: 'No authentication token found'
        }
      }

      const { data } = await axiosClient.get('/auth/me')

      if (!data) {
        return {
          success: false,
          error: 'No data received from server'
        }
      }

      const transformedUser: UserDataType = {
        _id: data._id,
        email: data.email,
        name: data.name,
        surname: data.surname
      }

      return {
        success: true,
        result: transformedUser
      }
    } catch (error: any) {
      console.error('Me endpoint error:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user data'
      }
    }
  },

  register: async (request: AuthRegisterRequest): Promise<BaseResponse<AuthRegisterResponse>> => {
    try {
      const { data } = await axiosClient.post('/auth/register', request)
      console.log('Register response:', data) // Debug için
      return data
    } catch (error: any) {
      console.error('Register error:', error.response?.data)
      throw error
    }
  },
  login: async (request: LoginParams): Promise<AuthLoginResponse> => {
    try {
      if (!request.email?.trim() || !request.password?.trim()) {
        return {
          success: false,
          error: 'Email and password are required'
        }
      }

      const { data } = await axiosClient.post('/auth/login', request)

      if (data && data.token) {
        localStorage.setItem('token', data.token)
        return {
          success: true,
          result: {
            token: data.token,
            user: {
              _id: data.user._id,
              email: data.user.email,
              name: data.user.name,
              surname: data.user.surname
            }
          }
        }
      }

      return {
        success: false,
        error: 'Invalid response from server'
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || 'Login failed'
      }
    }
  },
  verifyUser: async (request: { token: string }): Promise<BaseResponse<AuthLoginResponse>> => {
    const { data } = await axiosClient.post('/auth/verify-user', request)
    return data
  },
  resendVerificationMail: async (request: { email: string }): Promise<BaseResponse<null>> => {
    const { data } = await axiosClient.post('/auth/resend-verification-mail', request)
    return data
  },

  sendForgotPasswordCode: async (request: { email: string }): Promise<BaseResponse<null>> => {
    const response = await axiosClient.post('/auth/send-forgot-password-code', request)
    return response.data
  },
  checkForgotPasswordCode: async (request: { email: string; code: string }): Promise<BaseResponse<null>> => {
    const response = await axiosClient.post('/auth/check-forgot-password-code', request)
    return response.data
  },
  changePassword: async (request: { email: string; code: string; password: string }): Promise<BaseResponse<null>> => {
    const response = await axiosClient.post('/auth/change-password ', request)
    return response.data
  }
}

export default authService
