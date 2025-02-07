import { axiosClient } from 'src/configs/axios-client'
import { Workout } from 'src/types/workout'
import { BaseResponse } from '../models/base-response'
import { BaseSuccessResponse } from 'src/types/auth'

const workoutService = {
  // Tüm workoutları getir
  getAllWorkouts: async (): Promise<BaseResponse<Workout[]>> => {
    const { data } = await axiosClient.get('/workouts')
    return {
      success: true,
      data: data
    }
  },

  // Tek bir workout getir
  getWorkout: async (id: string): Promise<BaseResponse<Workout>> => {
    try {
      const { data } = await axiosClient.get(`/workouts/${id}`)
      if (data._id) {
        return {
          success: true,
          data: data
        }
      }
      return data
    } catch (error) {
      return {
        success: false,
        error: {
          property: 'workout',
          message: 'Failed to load workout'
        }
      }
    }
  },

  // Yeni workout oluştur
  createWorkout: async (
    request: Omit<Workout, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<BaseSuccessResponse<Workout>> => {
    const { data } = await axiosClient.post('/workouts', request)
    return {
      success: true,
      result: data
    }
  },

  // Workout güncelle
  updateWorkout: async (id: string, workout: Partial<Workout>): Promise<BaseResponse<Workout>> => {
    const { data } = await axiosClient.put(`/workouts/${id}`, workout)
    return {
      success: true,
      data: data
    }
  },

  // Workout sil
  deleteWorkout: async (id: string): Promise<BaseResponse<null>> => {
    await axiosClient.delete(`/workouts/${id}`)
    return {
      success: true,
      data: null
    }
  }
}

export default workoutService
