import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material'
import { Workout } from 'src/types/workout'
import workoutService from 'src/@core/services/workout.service'
import toast from 'react-hot-toast'

interface DayWorkoutDialogProps {
  open: boolean
  onClose: () => void
  selectedDate: Date
  scheduledWorkout?: Workout
  onSave: () => void
}

const DayWorkoutDialog = ({ open, onClose, selectedDate, scheduledWorkout, onSave }: DayWorkoutDialogProps) => {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [selectedWorkout, setSelectedWorkout] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await workoutService.getAllWorkouts()
        if (response.success) {
          setWorkouts(response.data)
        }
      } catch (error) {
        console.error('Error fetching workouts:', error)
        toast.error('Failed to load workouts')
      }
    }

    if (open) {
      fetchWorkouts()
      if (scheduledWorkout) {
        setSelectedWorkout(scheduledWorkout._id)
      }
    }
  }, [open, scheduledWorkout])

  const handleSave = async () => {
    if (!selectedWorkout) {
      toast.error('Please select a workout')
      return
    }

    try {
      setLoading(true)
      const response = await workoutService.scheduleWorkout({
        workoutId: selectedWorkout,
        scheduledDate: selectedDate
      })

      if (response.success) {
        toast.success('Workout scheduled successfully')
        onSave()
        onClose()
      } else {
        toast.error(response.error?.message || 'Failed to schedule workout')
      }
    } catch (error) {
      toast.error('Failed to schedule workout')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      const response = await workoutService.deleteScheduledWorkout(selectedDate)

      if (response.success) {
        toast.success('Workout removed from schedule')
        onSave()
        onClose()
      }
    } catch (error) {
      toast.error('Failed to remove workout')
    } finally {
      setLoading(false)
      setDeleteConfirmOpen(false)
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
        <DialogTitle>Schedule Workout for {selectedDate.toLocaleDateString()}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            {scheduledWorkout && (
              <Typography
                variant='h6'
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  '& .workout-name': {
                    color: 'text.primary',
                    ml: 1
                  }
                }}
                gutterBottom
              >
                Currently scheduled:
                <span className='workout-name'>{scheduledWorkout.name}</span>
              </Typography>
            )}
          </Box>
          <FormControl fullWidth>
            <InputLabel>Select Workout</InputLabel>
            <Select value={selectedWorkout} label='Select Workout' onChange={e => setSelectedWorkout(e.target.value)}>
              {workouts.map(workout => (
                <MenuItem key={workout._id} value={workout._id}>
                  {workout.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          {scheduledWorkout && (
            <Button onClick={() => setDeleteConfirmOpen(true)} color='error' disabled={loading}>
              Remove Workout
            </Button>
          )}
          <Button onClick={handleSave} variant='contained' disabled={!selectedWorkout || loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Silme onay dialogu */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>Remove Workout</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove "{scheduledWorkout?.name}" from {selectedDate.toLocaleDateString()}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color='error' variant='contained' disabled={loading}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DayWorkoutDialog
