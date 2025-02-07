import { Card, CardContent, Typography, IconButton, Box, Grid } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { Workout, ExerciseType } from 'src/types/workout'
import { useRouter } from 'next/router'

interface WorkoutCardProps {
  workout: Workout
  exercises: Record<string, ExerciseType>
  onEdit: (workout: Workout) => void
  onDelete: (workout: Workout) => void
}

const WorkoutCard = ({ workout, onDelete, exercises }: WorkoutCardProps) => {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/workouts/${workout._id}`)
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/workouts/${workout._id}?edit=true`)
  }

  const getExerciseName = (exerciseId: string | any) => {
    if (typeof exerciseId === 'string') {
      return exercises[exerciseId]?.name
    }
    return exerciseId.name
  }

  return (
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
            <IconButton
              size='small'
              color='error'
              onClick={e => {
                e.stopPropagation()
                onDelete(workout)
              }}
            >
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
                  <Typography variant='body2'>{getExerciseName(exercise.exerciseId)}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {exercise.sets} sets × {exercise.reps} reps
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}

export default WorkoutCard
