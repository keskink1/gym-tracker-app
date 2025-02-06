import { useEffect, useState, ReactNode } from 'react'
import { Box, Typography, CircularProgress, Button } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { Exercise, Workout } from 'src/types/workout'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import workoutService from 'src/@core/services/workout.service'
import exerciseService from 'src/@core/services/exercise.service'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import WorkoutCard from 'src/components/workout/WorkoutCard'

const WorkoutsPage = () => {
  const router = useRouter()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [exercises, setExercises] = useState<Record<string, Exercise>>({})
  const [loading, setLoading] = useState(true)

  const fetchExercises = async () => {
    try {
      const exercises = await exerciseService.getAllExercises()
      const exerciseMap: Record<string, Exercise> = {}
      exercises.forEach(exercise => {
        exerciseMap[exercise._id] = exercise
      })
      setExercises(exerciseMap)
    } catch (error) {
      toast.error('Error loading exercises')
    }
  }

  const fetchWorkouts = async () => {
    try {
      const response = await workoutService.getAllWorkouts()
      if (response.success) {
        console.log('Available workouts:', response.data)
        setWorkouts(response.data)
      }
    } catch (error) {
      toast.error('Error loading workouts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchWorkouts(), fetchExercises()])
    }
    fetchData()
  }, [])

  const handleDelete = async (workout: Workout) => {
    try {
      const response = await workoutService.deleteWorkout(workout._id)
      if (response.success) {
        toast.success('Workout deleted successfully')
        fetchWorkouts()
      } else {
        toast.error('Failed to delete workout')
      }
    } catch (error) {
      toast.error('Failed to delete workout')
    }
  }

  const handleEdit = (workout: Workout) => {
    router.push(`/workouts/${workout._id}`)
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
      {/* Container for header */}
      <Box
        sx={{
          maxWidth: '800px',
          margin: '0 auto',
          px: 4,
          mb: 6,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {/* Buttons row */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant='outlined' startIcon={<Icon icon='mdi:home' />} onClick={() => router.push('/')}>
            Home
          </Button>
          <Button
            variant='outlined'
            startIcon={<Icon icon='mdi:plus' />}
            onClick={() => router.push('/workouts/create')}
          >
            Create Workout
          </Button>
        </Box>

        {/* Title */}
        <Typography variant='h3' sx={{ textAlign: 'center' }}>
          My Workouts
        </Typography>
      </Box>

      {/* Container div for workouts */}
      <Box
        sx={{
          maxWidth: '800px',
          margin: '0 auto',
          px: 4
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          workouts.map(workout => (
            <Box key={workout._id} sx={{ mb: 6 }}>
              <WorkoutCard workout={workout} exercises={exercises} onEdit={handleEdit} onDelete={handleDelete} />
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}

WorkoutsPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default WorkoutsPage
