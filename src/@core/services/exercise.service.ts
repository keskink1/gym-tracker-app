import { axiosClient } from 'src/configs/axios-client'
import { BaseResponse, BaseSuccessResponse } from 'src/types/auth'
import { ExerciseType, CreateExerciseType } from 'src/types/workout'

const exerciseService = {
  getAllExercises: async (): Promise<ExerciseType[]> => {
    const { data } = await axiosClient.get('/exercises')
    return data
  },

  createExercise: async (exercise: CreateExerciseType): Promise<BaseSuccessResponse<ExerciseType>> => {
    const { data } = await axiosClient.post('/exercises', exercise)
    return {
      success: true,
      result: data
    }
  },

  deleteExercise: async (exerciseId: string): Promise<BaseResponse<void>> => {
    try {
      await axiosClient.delete(`/exercises/${exerciseId}`)
      return {
        success: true,
        result: undefined
      }
    } catch (error: any) {
      // Backend'den gelen özel hata mesajını kullan
      const errorMessage = error.response?.data || 'Failed to delete exercise'
      return {
        success: false,
        error: errorMessage
      }
    }
  }
}

export default exerciseService
