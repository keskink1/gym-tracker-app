import { ReactNode, useRef } from 'react'
import { Box, Typography, Button } from '@mui/material'
import WorkoutForm, { WorkoutFormRef } from 'src/components/workout/WorkoutForm'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import workoutService from 'src/@core/services/workout.service'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { Workout } from 'src/types/workout'
import { Icon } from '@iconify/react'

const CreateWorkoutPage = () => {
  const router = useRouter()
  const workoutFormRef = useRef<WorkoutFormRef>(null)

  const handleSubmit = async (workoutData: Omit<Workout, '_id'>) => {
    try {
      const response = await workoutService.createWorkout(workoutData)
      if (response.success) {
        toast.success('Workout created successfully')
        if (workoutFormRef.current) {
          workoutFormRef.current.resetForm()
        }
        router.push('/workouts')
      } else {
        toast.error('Failed to create workout')
      }
    } catch (error) {
      toast.error('Failed to create workout')
    }
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
          Create New Workout
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
        <WorkoutForm ref={workoutFormRef} onSubmit={handleSubmit} />
      </Box>
    </Box>
  )
}

CreateWorkoutPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default CreateWorkoutPage
