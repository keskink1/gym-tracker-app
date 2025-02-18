import { ReactNode, useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'
import exerciseService from 'src/@core/services/exercise.service'
import { ExerciseType } from 'src/types/workout'
import { toast } from 'react-hot-toast'

const ExercisesPage = () => {
  const router = useRouter()
  const [exercises, setExercises] = useState<ExerciseType[]>([])
  const [showExercises, setShowExercises] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [exerciseToDelete, setExerciseToDelete] = useState<ExerciseType | null>(null)

  useEffect(() => {
    if (showExercises) {
      const fetchExercises = async () => {
        try {
          const exercises = await exerciseService.getAllExercises()
          setExercises(exercises)
        } catch (error) {
          console.error('Error fetching exercises:', error)
        }
      }
      fetchExercises()
    }
  }, [showExercises])

  const menuItems = [
    {
      title: 'Create Exercise',
      description: 'Add a new exercise to your collection',
      icon: 'mdi:plus-circle',
      path: '/exercises/create'
    },
    {
      title: 'Manage Exercises',
      description: 'View and edit your exercises',
      icon: 'mdi:dumbbell',
      onClick: () => setShowExercises(!showExercises)
    }
  ]

  const handleDelete = async () => {
    if (!exerciseToDelete) return

    try {
      const response = await exerciseService.deleteExercise(exerciseToDelete._id)
      if (response.success) {
        toast.success('Exercise deleted successfully')
        setExercises(exercises.filter(ex => ex._id !== exerciseToDelete._id))
      } else {
        toast.error(response.error)
      }
    } catch (error) {
      toast.error('Failed to delete exercise')
    }
    setDeleteConfirmOpen(false)
    setExerciseToDelete(null)
  }

  return (
    <Box sx={{ p: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', gap: 2, mb: 6 }}>
        <Button variant='outlined' startIcon={<Icon icon='mdi:home' />} onClick={() => router.push('/')}>
          Home
        </Button>
      </Box>

      <Typography variant='h3' sx={{ mb: 6 }}>
        Exercises
      </Typography>

      {/* Menu Cards */}
      <Grid container spacing={6} sx={{ mb: 6 }}>
        {menuItems.map(item => (
          <Grid item xs={12} md={6} key={item.title}>
            <Card
              sx={{
                cursor: 'pointer',
                height: '100%',
                '&:hover': { boxShadow: 6 }
              }}
              onClick={() => (item.onClick ? item.onClick() : router.push(item.path))}
            >
              <CardContent sx={{ p: theme => `${theme.spacing(5)} !important` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Icon icon={item.icon} fontSize={36} />
                  <Typography variant='h5' sx={{ ml: 2 }}>
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant='body2'>{item.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Exercise List - sadece showExercises true ise göster */}
      {showExercises && (
        <>
          <Typography variant='h4' sx={{ mb: 4 }}>
            Your Exercises
          </Typography>
          <Grid container spacing={4}>
            {exercises.map(exercise => (
              <Grid item xs={12} md={4} key={exercise._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant='h6' gutterBottom>
                          {exercise.name}
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ textTransform: 'capitalize' }}>
                          Type: {exercise.type}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton
                          size='small'
                          color='error'
                          onClick={() => {
                            setExerciseToDelete(exercise)
                            setDeleteConfirmOpen(true)
                          }}
                        >
                          <Icon icon='mdi:delete' />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>Delete Exercise</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{exerciseToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

ExercisesPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default ExercisesPage
