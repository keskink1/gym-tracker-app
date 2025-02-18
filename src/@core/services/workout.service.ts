import { axiosClient } from 'src/configs/axios-client'
import { Workout } from 'src/types/workout'
import { BaseResponse } from '../models/base-response'
import { BaseSuccessResponse } from 'src/types/auth'

interface CalendarEntry {
  _id: string
  userId: string
  date: string
  workoutId: Workout
  createdAt: string
  updatedAt: string
}

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
  },

  scheduleWorkout: async (data: { workoutId: string; scheduledDate: Date }): Promise<BaseResponse<void>> => {
    try {
      const response = await axiosClient.post('/calendar', {
        workoutId: data.workoutId,
        date: data.scheduledDate.toISOString().split('T')[0]
      })

      if (response.data) {
        return {
          success: true,
          data: undefined
        }
      } else {
        return {
          success: false,
          error: {
            property: 'calendar',
            message: 'Failed to schedule workout'
          }
        }
      }
    } catch (error: any) {
      console.error('Schedule workout error:', error.response?.data || error)
      return {
        success: false,
        error: {
          property: 'calendar',
          message: error.response?.data || 'Failed to schedule workout'
        }
      }
    }
  },

  getScheduledWorkout: async (date: Date): Promise<BaseResponse<Workout | undefined>> => {
    try {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const { data } = await axiosClient.get<CalendarEntry[]>(`/calendar/month/${year}/${month}`)

      const targetDate = date.toISOString().split('T')[0]
      const entry = data.find((entry: CalendarEntry) => entry.date.split('T')[0] === targetDate)

      return {
        success: true,
        data: entry?.workoutId || undefined
      }
    } catch (error: any) {
      console.error('Get scheduled workout error:', error.response?.data || error)
      return {
        success: false,
        error: {
          property: 'calendar',
          message: error.response?.data || 'Failed to get scheduled workout'
        }
      }
    }
  },

  deleteScheduledWorkout: async (date: Date): Promise<BaseResponse<void>> => {
    try {
      const formattedDate = date.toISOString().split('T')[0]
      await axiosClient.delete(`/calendar/${formattedDate}`)
      return {
        success: true,
        data: undefined
      }
    } catch (error: any) {
      console.error('Delete scheduled workout error:', error.response?.data || error)
      return {
        success: false,
        error: {
          property: 'calendar',
          message: error.response?.data || 'Failed to delete scheduled workout'
        }
      }
    }
  },

  getMonthlyExerciseData: async (year: number, month: number): Promise<BaseResponse<any>> => {
    try {
      const { data } = await axiosClient.get(`/calendar/month/${year}/${month}`)
      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: {
          property: 'calendar',
          message: 'Failed to fetch exercise data'
        }
      }
    }
  },

  getMonthlyWorkouts: async (year: number, month: number): Promise<BaseResponse<CalendarEntry[]>> => {
    try {
      const { data } = await axiosClient.get(`/calendar/month/${year}/${month}`)
      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: {
          property: 'calendar',
          message: 'Failed to fetch monthly workouts'
        }
      }
    }
  },

  getMonthlyOverview: async (year: number, month: number): Promise<BaseResponse<any>> => {
    try {
      const { data } = await axiosClient.get(`/calendar/month/${year}/${month}`)
      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: {
          property: 'calendar',
          message: 'Failed to fetch monthly overview'
        }
      }
    }
  }
}

export default workoutService
