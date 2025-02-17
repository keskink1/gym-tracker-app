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
import { Workout, ExerciseType } from 'src/types/workout'
import Icon from 'src/@core/components/icon'
import WorkoutForm, { WorkoutFormRef } from 'src/components/workout/WorkoutForm'
import exerciseService from 'src/@core/services/exercise.service'

const WorkoutDetails = ({ workout }: { workout: Workout }) => {
  const [expanded, setExpanded] = useState<string | false>(false)
  const [availableExercises, setAvailableExercises] = useState<ExerciseType[]>([])

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

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
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
          sx={{ mb: 4, boxShadow: 2, '&:before': { display: 'none' }, borderRadius: 1 }}
        >
          <AccordionSummary
            expandIcon={<Icon icon='mdi:chevron-down' />}
            sx={{ backgroundColor: 'action.hover', borderRadius: 1 }}
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
                          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant='body2' color='text.secondary'>
                              Weight: {exercise.setDetails?.find(s => s.setNumber === setIndex + 1)?.weight || 0} kg
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </AccordionDetails>
        </Accordion>
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
        exercises: workoutData.exercises.map(exercise => ({
          exerciseId: typeof exercise.exerciseId === 'object' ? exercise.exerciseId._id : exercise.exerciseId,
          sets: exercise.sets,
          reps: exercise.reps,
          setDetails: Array.from({ length: exercise.sets }, (_, i) => ({
            setNumber: i + 1,
            weight: exercise.setDetails?.find(s => s.setNumber === i + 1)?.weight || 0
          }))
        }))
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
                <WorkoutDetails workout={workout} />
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
