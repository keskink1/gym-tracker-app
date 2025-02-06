import { axiosClient } from 'src/configs/axios-client'
import { BaseSuccessResponse, UserDataType } from 'src/types/auth'

const userService = {
  getProfile: async (): Promise<BaseSuccessResponse<any>> => {
    const { data } = await axiosClient.get('/users/me')
    return {
      success: true,
      result: data
    }
  },

  deleteAccount: async (password?: string): Promise<BaseSuccessResponse<void>> => {
    const { data } = await axiosClient.delete('/users/me', {
      data: { password }
    })
    return {
      success: true,
      result: data
    }
  },

  updateProfile: async (userData: {
    name: string
    surname: string
    email: string
  }): Promise<BaseSuccessResponse<UserDataType>> => {
    const { data } = await axiosClient.put('/users/me', {
      name: userData.name,
      surname: userData.surname,
      email: userData.email
    })

    console.log('Backend update response:', data) // Backend'den gelen veriyi kontrol et

    return {
      success: true,
      result: data
    }
  }
}

export default userService
