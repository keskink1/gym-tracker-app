// Veritabanındaki egzersiz şablonu
export interface ExerciseType {
  _id: string
  name: string
  description?: string
  type?: string
}

interface SetDetails {
  reps: number
  weight: number
}

// Workout içindeki egzersiz instance'ı
export interface WorkoutExercise {
  exerciseId: string | ExerciseType
  sets: number
  reps: number
  weight?: number
  setWeights?: number[]
  setDetails?: SetDetails[] // Her set için detaylar
}

// Workout'un kendisi
export interface Workout {
  _id: string
  name: string
  exercises: WorkoutExercise[]
  createdAt: string
  updatedAt: string
}

// WorkoutCard için helper tip
export interface WorkoutWithExerciseDetails extends Workout {
  exercises: (WorkoutExercise & { name?: string })[] // Exercise bilgilerini ExerciseType ile birleştir
}
