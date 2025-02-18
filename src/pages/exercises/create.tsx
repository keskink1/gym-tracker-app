import { ReactNode } from 'react'
import { Box, Typography, Button } from '@mui/material'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import exerciseService from 'src/@core/services/exercise.service'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { CreateExerciseType } from 'src/types/workout'
import { Icon } from '@iconify/react'
import ExerciseForm from 'src/components/exercise/ExerciseForm'

const CreateExercisePage = () => {
  const router = useRouter()

  const handleSubmit = async (exerciseData: CreateExerciseType) => {
    try {
      const response = await exerciseService.createExercise(exerciseData)
      if (response.success) {
        toast.success('Exercise created successfully')
        router.push('/exercises')
      }
    } catch (error) {
      toast.error('Error creating exercise')
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
          <Button variant='outlined' startIcon={<Icon icon='mdi:arrow-left' />} onClick={() => router.back()}>
            Back
          </Button>
        </Box>

        {/* Title */}
        <Typography variant='h3' sx={{ textAlign: 'center' }}>
          Create New Exercise
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
        <ExerciseForm onSubmit={handleSubmit} />
      </Box>
    </Box>
  )
}

// Next.js için layout tanımı (opsiyonel)
CreateExercisePage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
export default CreateExercisePage
