export interface Exercise {
  _id: string
  name: string
  description?: string
  type?: string
}

export interface WorkoutExercise {
  exerciseId: string
  sets: number
  reps: number
}

export interface Workout {
  _id: string
  name: string
  exercises: WorkoutExercise[]
  createdAt?: string
  updatedAt?: string
  __v?: number
}
