import { axiosClient } from 'src/configs/axios-client'
import { BaseSuccessResponse } from 'src/types/auth'
import { Exercise } from 'src/types/workout'

const exerciseService = {
  getAllExercises: async (): Promise<Exercise[]> => {
    try {
      const { data } = await axiosClient.get('/exercises')
      return data
    } catch (error) {
      return []
    }
  },

  createExercise: async (request: Omit<Exercise, '_id'>): Promise<BaseSuccessResponse<Exercise>> => {
    const { data } = await axiosClient.post('/exercises', request)
    return {
      success: true,
      result: data
    }
  }
}

export default exerciseService
