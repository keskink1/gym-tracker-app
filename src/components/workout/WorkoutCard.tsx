import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { Workout, ExerciseType } from 'src/types/workout'
import { useRouter } from 'next/router'
import { useState } from 'react'

interface WorkoutCardProps {
  workout: Workout
  exercises: Record<string, ExerciseType>
  onEdit: (workout: Workout) => void
  onDelete: (workout: Workout) => void
}

const WorkoutCard = ({ workout, onDelete, exercises }: WorkoutCardProps) => {
  const router = useRouter()
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const handleCardClick = () => {
    router.push(`/workouts/${workout._id}`)
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/workouts/${workout._id}?edit=true`)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    onDelete(workout)
    setDeleteConfirmOpen(false)
  }

  const getExerciseName = (exerciseId: string | ExerciseType, exercises: ExerciseType[]) => {
    if (typeof exerciseId === 'string') {
      const exercise = exercises.find(e => e._id === exerciseId)
      return exercise?.name || 'Unknown Exercise'
    }
    return exerciseId?.name || 'Unknown Exercise'
  }

  return (
    <>
      <Card
        sx={{
          mb: 4,
          cursor: 'pointer',
          '&:hover': {
            boxShadow: 6
          }
        }}
        onClick={handleCardClick}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant='h6' component='div'>
              {workout.name}
            </Typography>
            <Box>
              <IconButton size='small' onClick={handleEditClick}>
                <Icon icon='mdi:pencil' />
              </IconButton>
              <IconButton size='small' color='error' onClick={handleDelete}>
                <Icon icon='mdi:delete' />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              Exercises:
            </Typography>
            <Grid container spacing={2}>
              {workout.exercises.map((exercise, index) => (
                <Grid item xs={12} key={`${workout._id}-${exercise.exerciseId}-${index}`}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2'>
                      {getExerciseName(exercise.exerciseId, Object.values(exercises))}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {exercise.sets && exercise.sets > 0 && `${exercise.sets} sets`}
                      {exercise.reps && exercise.reps > 0 && ` x ${exercise.reps} reps`}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>Delete Workout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "{workout.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default WorkoutCard
