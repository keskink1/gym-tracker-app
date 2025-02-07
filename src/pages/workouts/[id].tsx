import { ReactNode, useEffect, useState, useRef } from 'react'
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Chip
} from '@mui/material'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import workoutService from 'src/@core/services/workout.service'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { Workout, WorkoutExercise, ExerciseType, ExerciseSession } from 'src/types/workout'
import Icon from 'src/@core/components/icon'
import WorkoutForm, { WorkoutFormRef } from 'src/components/workout/WorkoutForm'
import exerciseService from 'src/@core/services/exercise.service'

const WorkoutDetails = ({
  workout,
  setWorkout,
  isEditing
}: {
  workout: Workout
  setWorkout: (workout: Workout) => void
  isEditing: boolean
}) => {
  const [expanded, setExpanded] = useState<string | false>(false)
  const [availableExercises, setAvailableExercises] = useState<ExerciseType[]>([])
  const [activeExercise, setActiveExercise] = useState<string | null>(null)
  const [isExercisePaused, setIsExercisePaused] = useState(false)
  const [exerciseTime, setExerciseTime] = useState(0)
  const [restTime, setRestTime] = useState(0)
  const exerciseTimerRef = useRef<NodeJS.Timeout>()
  const restTimerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exercises = await exerciseService.getAllExercises()
        setAvailableExercises(exercises)
      } catch (error) {
        console.error('Error loading exercises:', error)
      }
    }
    fetchExercises()
  }, [])

  // Timer'ları temizle
  useEffect(() => {
    return () => {
      if (exerciseTimerRef.current) clearInterval(exerciseTimerRef.current)
      if (restTimerRef.current) clearInterval(restTimerRef.current)
    }
  }, [])

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleStartExercise = (exerciseId: string) => {
    setActiveExercise(exerciseId)
    setExerciseTime(0)
    exerciseTimerRef.current = setInterval(() => {
      setExerciseTime(prev => prev + 1)
    }, 1000)
  }

  const handleTimeout = () => {
    setIsExercisePaused(true)
    clearInterval(exerciseTimerRef.current)
    setRestTime(0)
    restTimerRef.current = setInterval(() => {
      setRestTime(prev => prev + 1)
    }, 1000)
  }

  const handleContinue = () => {
    setIsExercisePaused(false)
    clearInterval(restTimerRef.current)
    setRestTime(0)
    exerciseTimerRef.current = setInterval(() => {
      setExerciseTime(prev => prev + 1)
    }, 1000)
  }

  const handleFinishExercise = async (exercise: WorkoutExercise) => {
    try {
      const currentExerciseId = typeof exercise.exerciseId === 'object' ? exercise.exerciseId._id : exercise.exerciseId

      const updatedExercises = workout.exercises.map(ex => {
        const exId = typeof ex.exerciseId === 'object' ? ex.exerciseId._id : ex.exerciseId

        if (exId === currentExerciseId) {
          // Önceki sessions'ları _id olmadan yeni array'e kopyala
          const previousSessions = (ex.sessions || []).map(session => ({
            exerciseTime: session.exerciseTime,
            restTime: session.restTime,
            completedAt: session.completedAt
          }))

          return {
            exerciseId: exId,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            sessions: [
              ...previousSessions,
              {
                exerciseTime,
                restTime,
                completedAt: new Date().toISOString()
              }
            ]
          }
        }
        return {
          exerciseId: exId,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          sessions: ex.sessions?.map(session => ({
            exerciseTime: session.exerciseTime,
            restTime: session.restTime,
            completedAt: session.completedAt
          }))
        }
      })

      const response = await workoutService.updateWorkout(workout._id, {
        name: workout.name,
        exercises: updatedExercises
      })

      if (response.success) {
        setWorkout({
          ...workout,
          exercises: updatedExercises
        })
        toast.success('Exercise session saved')
      }
    } catch (error) {
      console.error('Error saving exercise session:', error)
      toast.error('Failed to save exercise session')
    } finally {
      setActiveExercise(null)
      setIsExercisePaused(false)
      clearInterval(exerciseTimerRef.current)
      clearInterval(restTimerRef.current)
      setExerciseTime(0)
      setRestTime(0)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Box>
      {/* Workout Başlığı */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4'>{workout.name}</Typography>
        <Typography variant='body2' color='text.secondary'>
          Created: {new Date(workout.createdAt).toLocaleString()}
        </Typography>
      </Box>

      {/* Egzersizler */}
      {workout.exercises.map((exercise, index) => (
        <Accordion
          key={typeof exercise.exerciseId === 'object' ? exercise.exerciseId._id : exercise.exerciseId}
          expanded={
            expanded === (typeof exercise.exerciseId === 'object' ? exercise.exerciseId._id : exercise.exerciseId)
          }
          onChange={handleChange(
            typeof exercise.exerciseId === 'object' ? exercise.exerciseId._id : exercise.exerciseId
          )}
          sx={{
            mb: 4,
            boxShadow: 2,
            '&:before': { display: 'none' },
            borderRadius: 1
          }}
        >
          <AccordionSummary
            expandIcon={<Icon icon='mdi:chevron-down' />}
            sx={{
              backgroundColor: 'action.hover',
              borderRadius: 1
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Typography variant='h6' sx={{ color: 'primary.main' }}>
                {typeof exercise.exerciseId === 'object'
                  ? exercise.exerciseId.name
                  : availableExercises.find(ex => ex._id === exercise.exerciseId)?.name || `Exercise ${index + 1}`}
              </Typography>
              <Chip label={`${exercise.sets} sets`} color='primary' size='small' />
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Card variant='outlined'>
              <CardContent>
                {/* Set'leri yatay olarak göster */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Typography variant='subtitle1'>Sets:</Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                      <Card key={setIndex} variant='outlined' sx={{ minWidth: 120 }}>
                        <CardContent>
                          <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                            Set {setIndex + 1}
                          </Typography>
                          <Typography variant='body2' gutterBottom>
                            Reps: {exercise.reps}
                          </Typography>

                          {/* Weight gösterimi */}
                          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant='body2' color='text.secondary'>
                              {exercise.weight ? `Weight: ${exercise.weight} kg` : 'No weight set'}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>

                {/* Timer ve butonlar */}
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  {activeExercise ===
                    (typeof exercise.exerciseId === 'object' ? exercise.exerciseId._id : exercise.exerciseId) && (
                    <>
                      <Typography variant='h6'>
                        Exercise Time: {formatTime(exerciseTime)}
                        {isExercisePaused && restTime > 0 && ` (Rest: ${formatTime(restTime)})`}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant='contained'
                          color={isExercisePaused ? 'success' : 'warning'}
                          size='small'
                          onClick={isExercisePaused ? handleContinue : handleTimeout}
                        >
                          {isExercisePaused ? 'Continue' : 'Timeout'}
                        </Button>
                        <Button
                          variant='contained'
                          color='error'
                          size='small'
                          onClick={() => handleFinishExercise(exercise)}
                        >
                          Finish Exercise
                        </Button>
                      </Box>
                    </>
                  )}
                  {!activeExercise && !isEditing && (
                    <Button
                      variant='contained'
                      color='primary'
                      size='small'
                      startIcon={<Icon icon='mdi:play' />}
                      onClick={() =>
                        handleStartExercise(
                          typeof exercise.exerciseId === 'object' ? exercise.exerciseId._id : exercise.exerciseId
                        )
                      }
                    >
                      Start Exercise
                    </Button>
                  )}
                </Box>

                {/* Egzersiz geçmişini göster */}
                <ExerciseHistory sessions={exercise.sessions} formatTime={formatTime} />
              </CardContent>
            </Card>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

// Egzersiz geçmişini göstermek için yeni bir component
const ExerciseHistory = ({
  sessions,
  formatTime
}: {
  sessions?: ExerciseSession[]
  formatTime: (seconds: number) => string
}) => {
  if (!sessions?.length) return null

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant='subtitle1' gutterBottom>
        Exercise History:
      </Typography>
      {sessions.map((session, idx) => (
        <Card key={idx} variant='outlined' sx={{ mb: 1, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='body2'>
              Exercise Time: {formatTime(session.exerciseTime)}
              {session.restTime > 0 && ` (Rest: ${formatTime(session.restTime)})`}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {new Date(session.completedAt).toLocaleDateString()} {new Date(session.completedAt).toLocaleTimeString()}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  )
}

const EditWorkoutPage = () => {
  const router = useRouter()
  const { id, edit } = router.query
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(edit === 'true')
  const workoutFormRef = useRef<WorkoutFormRef>(null)

  useEffect(() => {
    setIsEditing(edit === 'true')
  }, [edit])

  useEffect(() => {
    const fetchWorkout = async () => {
      if (typeof id === 'string') {
        setLoading(true)
        try {
          const response = await workoutService.getWorkout(id)
          if (response.success) {
            setWorkout(response.data)
          } else {
            toast.error('Workout not found')
            router.push('/workouts')
          }
        } catch (error) {
          toast.error('Failed to load workout')
          router.push('/workouts')
        } finally {
          setLoading(false)
        }
      }
    }

    if (id) {
      fetchWorkout()
    }
  }, [id, router])

  const handleSubmit = async (workoutData: Omit<Workout, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await workoutService.updateWorkout(id as string, {
        name: workoutData.name,
        exercises: workoutData.exercises.map(exercise => {
          const exerciseId = typeof exercise.exerciseId === 'object' ? exercise.exerciseId._id : exercise.exerciseId

          return {
            exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight
          }
        })
      })

      if (response.success) {
        toast.success('Workout updated successfully')
        setIsEditing(false)
        const updatedWorkout = await workoutService.getWorkout(id as string)
        if (updatedWorkout.success) {
          setWorkout(updatedWorkout.data)
        }
      }
    } catch (error) {
      console.error('Error updating workout:', error)
      toast.error('Failed to update workout')
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 6 }}>
      {/* Header Container */}
      <Box sx={{ maxWidth: '800px', margin: '0 auto', px: 4, mb: 6 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button variant='outlined' startIcon={<Icon icon='mdi:home' />} onClick={() => router.push('/')}>
            Home
          </Button>
          <Button variant='outlined' startIcon={<Icon icon='mdi:arrow-left' />} onClick={() => router.back()}>
            Back
          </Button>
        </Box>

        <Typography variant='h3' sx={{ textAlign: 'center', mb: 4 }}>
          Workout Details
        </Typography>
      </Box>

      {/* Content Container */}
      <Box sx={{ maxWidth: '800px', margin: '0 auto', px: 4 }}>
        {workout && (
          <>
            {isEditing ? (
              <WorkoutForm ref={workoutFormRef} onSubmit={handleSubmit} initialData={workout} />
            ) : (
              <>
                <WorkoutDetails workout={workout} setWorkout={setWorkout} isEditing={isEditing} />
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant='contained'
                    color='primary'
                    startIcon={<Icon icon='mdi:pencil' />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Workout
                  </Button>
                </Box>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}

EditWorkoutPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default EditWorkoutPage
