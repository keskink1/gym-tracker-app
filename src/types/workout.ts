// Veritabanındaki egzersiz şablonu
export interface ExerciseType {
  _id: string
  name: string
  type: string
  description?: string
  createdAt: string
  updatedAt: string
}

// Yeni egzersiz oluştururken kullanılacak tip
export interface CreateExerciseType {
  name: string
  type: string
}

export interface ExerciseSession {
  exerciseTime: number // Toplam egzersiz süresi (saniye)
  restTime: number // Toplam dinlenme süresi (saniye)
  completedAt: string // Tamamlanma tarihi
}

interface SetDetail {
  setNumber: number
  weight: number
}

// Workout içindeki egzersiz instance'ı
export interface WorkoutExercise {
  exerciseId: string | ExerciseType
  sets: number
  reps: number
  setDetails?: SetDetail[]
  sessions?: ExerciseSession[] // Egzersiz oturumları
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
