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
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
  const [name, setName] = useState(initialData?.name || '')
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
  const [deleteExerciseConfirmOpen, setDeleteExerciseConfirmOpen] = useState(false)
  const [exerciseToDelete, setExerciseToDelete] = useState<number | null>(null)

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
      setName('')
      setExercises([])
    }
  }))

  const updateExercise = (index: number, field: string, value: any) => {
    console.log('Updating exercise:', { index, field, value })
    setExercises(prev => {
      const newExercises = [...prev]
      if (field === 'setDetails') {
        const exercise = newExercises[index]
        const newSetDetails = [...(exercise.setDetails || [])]
        const setIndex = newSetDetails.findIndex(s => s.setNumber === value.setNumber)

        if (setIndex >= 0) {
          newSetDetails[setIndex] = value
        } else {
          newSetDetails.push(value)
        }

        newExercises[index] = {
          ...exercise,
          setDetails: newSetDetails
        }
      } else {
        newExercises[index] = {
          ...newExercises[index],
          [field]: value
        }
      }
      return newExercises
    })
  }

  const handleRemoveExercise = (index: number) => {
    setExerciseToDelete(index)
    setDeleteExerciseConfirmOpen(true)
  }

  const confirmDeleteExercise = () => {
    if (exerciseToDelete !== null) {
      const newExercises = [...exercises]
      newExercises.splice(exerciseToDelete, 1)
      setExercises(newExercises)
    }
    setDeleteExerciseConfirmOpen(false)
    setExerciseToDelete(null)
  }

  const addExercise = () => {
    setExercises([...exercises, { exerciseId: '', sets: 0, reps: 0 }])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (name.length < 3) {
      toast.error('Workout name must be at least 3 characters long')
      return
    }

    if (exercises.length === 0) {
      toast.error('Please add at least one exercise')
      return
    }

    onSubmit({
      name,
      exercises: exercises.map(exercise => ({
        exerciseId: exercise.exerciseId,
        sets: exercise.sets,
        reps: exercise.reps,
        setDetails: exercise.setDetails
      }))
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
    <>
      <Box>
        <TextField
          fullWidth
          label='Workout Name'
          value={name}
          onChange={e => setName(e.target.value)}
          error={name.length > 0 && name.length < 3}
          helperText={name.length > 0 && name.length < 3 ? 'Workout name must be at least 3 characters' : ''}
          sx={{ mb: 4 }}
        />

        {exercises.map((exercise, exerciseIndex) => (
          <Card key={exerciseIndex} sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={2} alignItems='center'>
                <Grid item xs={12} sm={3}>
                  {renderSelect(exercise, exerciseIndex)}
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Sets'
                    value={exercise.sets || ''}
                    onChange={e => {
                      const value = Math.max(0, parseInt(e.target.value) || 0)
                      updateExercise(exerciseIndex, 'sets', value)
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
                      updateExercise(exerciseIndex, 'reps', value)
                    }}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='subtitle2' sx={{ mb: 1 }}>
                    Weights per Set:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {Array.from({ length: exercise.sets || 0 }).map((_, setIndex) => (
                      <TextField
                        key={setIndex}
                        type='number'
                        size='small'
                        label={`Set ${setIndex + 1} (kg)`}
                        value={exercise.setDetails?.find(s => s.setNumber === setIndex + 1)?.weight || ''}
                        onChange={e => {
                          const value = Math.max(0, parseInt(e.target.value) || 0)
                          const setDetail = {
                            setNumber: setIndex + 1,
                            weight: value
                          }
                          updateExercise(exerciseIndex, 'setDetails', setDetail)
                        }}
                        inputProps={{ min: 0 }}
                        sx={{ width: 120 }}
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton color='error' onClick={() => handleRemoveExercise(exerciseIndex)}>
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

      {/* Exercise Silme Onay Dialogu */}
      <Dialog
        open={deleteExerciseConfirmOpen}
        onClose={() => setDeleteExerciseConfirmOpen(false)}
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle>Remove Exercise</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove this exercise?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteExerciseConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteExercise} color='error' variant='contained'>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
})

export default WorkoutForm
