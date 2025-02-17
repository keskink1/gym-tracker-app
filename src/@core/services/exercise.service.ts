import { axiosClient } from 'src/configs/axios-client'
import { BaseSuccessResponse } from 'src/types/auth'
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
  }
}

export default exerciseService
