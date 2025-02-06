import { Card, CardContent, Typography, IconButton, Box, Grid } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { Workout, Exercise } from 'src/types/workout'

interface WorkoutCardProps {
  workout: Workout
  onEdit: (workout: Workout) => void
  onDelete: (workout: Workout) => void
  exercises: Record<string, Exercise>
}

const WorkoutCard = ({ workout, onEdit, onDelete, exercises }: WorkoutCardProps) => {
  const getExerciseName = (exerciseId: string | any) => {
    if (typeof exerciseId === 'string') {
      return exercises[exerciseId]?.name
    }
    return exerciseId.name
  }

  return (
    <Card sx={{ mb: 6 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant='h6' component='div'>
            {workout.name}
          </Typography>
          <Box>
            <IconButton size='small' onClick={() => onEdit(workout)}>
              <Icon icon='mdi:pencil' />
            </IconButton>
            <IconButton size='small' color='error' onClick={() => onDelete(workout)}>
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
