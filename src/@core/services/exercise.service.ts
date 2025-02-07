import { axiosClient } from 'src/configs/axios-client'
import { BaseSuccessResponse } from 'src/types/auth'
import { ExerciseType } from 'src/types/workout'

const exerciseService = {
  getAllExercises: async (): Promise<ExerciseType[]> => {
    const { data } = await axiosClient.get('/exercises')
    return data
  },

  createExercise: async (request: Omit<ExerciseType, '_id'>): Promise<BaseSuccessResponse<ExerciseType>> => {
    const { data } = await axiosClient.post('/exercises', request)
    return {
      success: true,
      result: data
    }
  }
}

export default exerciseService
