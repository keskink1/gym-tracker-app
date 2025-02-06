import { ReactNode, useEffect, useState, useRef } from 'react'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import WorkoutForm, { WorkoutFormRef } from 'src/components/workout/WorkoutForm'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import workoutService from 'src/@core/services/workout.service'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { Workout } from 'src/types/workout'
import { Icon } from '@iconify/react'

const EditWorkoutPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const workoutFormRef = useRef<WorkoutFormRef>(null)

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

  const handleSubmit = async (workoutData: Omit<Workout, '_id'>) => {
    try {
      const response = await workoutService.updateWorkout(id as string, {
        name: workoutData.name,
        exercises: workoutData.exercises.map(exercise => ({
          exerciseId: exercise.exerciseId,
          sets: exercise.sets,
          reps: exercise.reps
        }))
      })

      if (response.success) {
        toast.success('Workout updated successfully')
        router.push('/workouts')
      } else {
        toast.error('Failed to update workout')
      }
    } catch (error) {
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
            startIcon={<Icon icon='mdi:arrow-left' />}
            onClick={() => router.push('/workouts')}
          >
            Back
          </Button>
        </Box>

        {/* Title */}
        <Typography variant='h3' sx={{ textAlign: 'center' }}>
          Edit Workout
        </Typography>
      </Box>

      {/* Container div for form */}
      <Box
        sx={{
          maxWidth: '800px',
          margin: '0 auto',
          px: 4
        }}
      >
        {workout && <WorkoutForm ref={workoutFormRef} onSubmit={handleSubmit} initialData={workout} />}
      </Box>
    </Box>
  )
}

EditWorkoutPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default EditWorkoutPage
