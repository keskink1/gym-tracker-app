import { useState } from 'react'
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { ExerciseType } from 'src/types/workout'
import { toast } from 'react-hot-toast'

const exerciseTypes = [
  { value: 'chest', label: 'Chest (Göğüs)' },
  { value: 'back', label: 'Back (Sırt)' },
  { value: 'shoulders', label: 'Shoulders (Omuz)' },
  { value: 'legs', label: 'Legs (Bacak)' },
  { value: 'arms', label: 'Arms (Kol)' },
  { value: 'abs', label: 'Abs (Karın)' },
  { value: 'cardio', label: 'Cardio (Kardiyo)' },
  { value: 'fullbody', label: 'Full Body (Tüm Vücut)' }
]

interface ExerciseFormProps {
  onSubmit: (exercise: Omit<ExerciseType, '_id'>) => void
  initialData?: ExerciseType
}

const ExerciseForm = ({ onSubmit, initialData }: ExerciseFormProps) => {
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [type, setType] = useState(initialData?.type || '')

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter exercise name')
      return
    }

    onSubmit({
      name: name.trim(),
      description: description.trim() || '',
      type: type || 'other'
    })
  }

  return (
    <Box>
      <TextField fullWidth label='Name' value={name} onChange={e => setName(e.target.value)} sx={{ mb: 4 }} />
      <TextField
        fullWidth
        label='Description'
        value={description}
        onChange={e => setDescription(e.target.value)}
        sx={{ mb: 4 }}
      />
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Type</InputLabel>
        <Select value={type} label='Type' onChange={e => setType(e.target.value)}>
          {exerciseTypes.map(type => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button fullWidth variant='contained' onClick={handleSubmit}>
        Save Exercise
      </Button>
    </Box>
  )
}

export default ExerciseForm
