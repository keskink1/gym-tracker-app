import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import exerciseService from 'src/@core/services/exercise.service'
import toast from 'react-hot-toast'
import { CreateExerciseType } from 'src/types/workout'

interface CreateExerciseDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

const CreateExerciseDialog = ({ open, onClose, onSuccess }: CreateExerciseDialogProps) => {
  const [name, setName] = useState('')
  const [type, setType] = useState('')

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Please enter exercise name')
      return
    }

    if (!type) {
      toast.error('Please select exercise type')
      return
    }

    try {
      const exerciseData: CreateExerciseType = {
        name: name.trim(),
        type: type
      }

      const response = await exerciseService.createExercise(exerciseData)

      if (response.success) {
        toast.success('Exercise created successfully')
        onSuccess()
        handleClose()
      } else {
        toast.error('Failed to create exercise')
      }
    } catch (error) {
      toast.error('Failed to create exercise')
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Create New Exercise</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='Exercise Name'
          fullWidth
          value={name}
          onChange={e => setName(e.target.value)}
          sx={{ mb: 4 }}
        />
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select value={type} label='Type' onChange={e => setType(e.target.value)}>
            <MenuItem value='chest'>Chest</MenuItem>
            <MenuItem value='back'>Back</MenuItem>
            <MenuItem value='legs'>Legs</MenuItem>
            <MenuItem value='shoulders'>Shoulders</MenuItem>
            <MenuItem value='arms'>Arms</MenuItem>
            <MenuItem value='core'>Core</MenuItem>
            <MenuItem value='fullbody'>Full Body</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant='contained'>
          Save Exercise
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateExerciseDialog
