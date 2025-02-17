import { useState } from 'react'
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { ExerciseType, CreateExerciseType } from 'src/types/workout'
import { toast } from 'react-hot-toast'

interface ExerciseFormProps {
  onSubmit: (exercise: CreateExerciseType) => void
  initialData?: ExerciseType
}

const ExerciseForm = ({ onSubmit, initialData }: ExerciseFormProps) => {
  const [name, setName] = useState(initialData?.name || '')
  const [type, setType] = useState(initialData?.type || '')

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter exercise name')
      return
    }

    if (!type) {
      toast.error('Please select exercise type')
      return
    }

    onSubmit({
      name: name.trim(),
      type: type
    })
  }

  return (
    <Box>
      <TextField fullWidth label='Name' value={name} onChange={e => setName(e.target.value)} sx={{ mb: 4 }} />
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Type</InputLabel>
        <Select value={type} label='Type' onChange={e => setType(e.target.value)}>
          <MenuItem value='chest'>Chest (Göğüs)</MenuItem>
          <MenuItem value='back'>Back (Sırt)</MenuItem>
          <MenuItem value='shoulders'>Shoulders (Omuz)</MenuItem>
          <MenuItem value='legs'>Legs (Bacak)</MenuItem>
          <MenuItem value='arms'>Arms (Kol)</MenuItem>
          <MenuItem value='abs'>Abs (Karın)</MenuItem>
          <MenuItem value='cardio'>Cardio (Kardiyo)</MenuItem>
          <MenuItem value='fullbody'>Full Body (Tüm Vücut)</MenuItem>
        </Select>
      </FormControl>
      <Button fullWidth variant='contained' onClick={handleSubmit}>
        Save Exercise
      </Button>
    </Box>
  )
}

export default ExerciseForm
