import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import {
  Box,
  Button,
  TextField,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { Workout, WorkoutExercise, ExerciseType } from 'src/types/workout'
import toast from 'react-hot-toast'
import exerciseService from 'src/@core/services/exercise.service'

interface WorkoutFormProps {
  onSubmit: (workout: Omit<Workout, '_id' | 'createdAt' | 'updatedAt'>) => void
  initialData?: Workout
}

export interface WorkoutFormRef {
  resetForm: () => void
}

const WorkoutForm = forwardRef<WorkoutFormRef, WorkoutFormProps>(({ onSubmit, initialData }, ref) => {
  const [workoutName, setWorkoutName] = useState(initialData?.name || '')
  const [exercises, setExercises] = useState<WorkoutExercise[]>(() => {
    if (initialData?.exercises) {
      return initialData.exercises.map(e => ({
        ...e,
        exerciseId: typeof e.exerciseId === 'object' ? (e.exerciseId as any)._id : e.exerciseId
      }))
    }
    return []
  })
  const [availableExercises, setAvailableExercises] = useState<ExerciseType[]>([])

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exercises = await exerciseService.getAllExercises()
        setAvailableExercises(exercises)
      } catch (error) {
        toast.error('Error loading exercises')
      }
    }
    fetchExercises()
  }, [])

  useEffect(() => {
    console.log('Current exercises:', exercises)
  }, [exercises])

  useImperativeHandle(ref, () => ({
    resetForm: () => {
      setWorkoutName('')
      setExercises([])
    }
  }))

  const updateExercise = (index: number, field: keyof WorkoutExercise, value: any) => {
    console.log('Updating exercise:', { index, field, value })
    const updatedExercises = [...exercises]
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: field === 'exerciseId' ? String(value || '') : value
    }
    setExercises(updatedExercises)
  }

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const addExercise = () => {
    setExercises([...exercises, { exerciseId: '', sets: 0, reps: 0 }])
  }

  const handleSubmit = () => {
    if (!workoutName.trim()) {
      toast.error('Please enter a workout name')
      return
    }

    if (exercises.length === 0) {
      toast.error('Please add at least one exercise')
      return
    }

    if (exercises.some(ex => !ex.exerciseId || ex.sets <= 0 || ex.reps <= 0)) {
      toast.error('Please fill in all exercise details')
      return
    }

    onSubmit({
      name: workoutName,
      exercises
    })
  }

  const renderSelect = (exercise: WorkoutExercise, index: number) => {
    return (
      <FormControl fullWidth>
        <InputLabel>Exercise</InputLabel>
        <Select
          value={exercise.exerciseId || ''}
          label='Exercise'
          onChange={e => updateExercise(index, 'exerciseId', e.target.value)}
        >
          <MenuItem value=''>
            <em>Select an exercise</em>
          </MenuItem>
          {availableExercises.map(ex => (
            <MenuItem key={ex._id} value={ex._id}>
              {ex.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }

  return (
    <Box>
      <TextField
        fullWidth
        label='Workout Name'
        value={workoutName}
        onChange={e => setWorkoutName(e.target.value)}
        sx={{ mb: 4 }}
      />

      {exercises.map((exercise, index) => (
        <Card key={index} sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2} alignItems='center'>
              <Grid item xs={12} sm={3}>
                {renderSelect(exercise, index)}
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  type='number'
                  label='Sets'
                  value={exercise.sets || ''}
                  onChange={e => {
                    const value = Math.max(0, parseInt(e.target.value) || 0)
                    updateExercise(index, 'sets', value)
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  type='number'
                  label='Reps'
                  value={exercise.reps || ''}
                  onChange={e => {
                    const value = Math.max(0, parseInt(e.target.value) || 0)
                    updateExercise(index, 'reps', value)
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  type='number'
                  label='Weight (kg)'
                  value={exercise.weight || ''}
                  onChange={e => {
                    const value = Math.max(0, parseInt(e.target.value) || 0)
                    updateExercise(index, 'weight', value || undefined)
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <IconButton color='error' onClick={() => removeExercise(index)}>
                  <Icon icon='mdi:delete' />
                </IconButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Button variant='outlined' startIcon={<Icon icon='mdi:plus' />} onClick={addExercise} sx={{ mt: 2, mb: 4 }}>
        Add Exercise
      </Button>

      <Button fullWidth variant='contained' onClick={handleSubmit}>
        Save Workout
      </Button>
    </Box>
  )
})

export default WorkoutForm
