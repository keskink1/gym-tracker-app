import { ReactNode, useState, useEffect } from 'react'
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import workoutService from 'src/@core/services/workout.service'
import { useRouter } from 'next/router'
import { Icon } from '@iconify/react'

// Chart.js'yi kaydet
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const GraphicsPage = () => {
  const router = useRouter()
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [exerciseData, setExerciseData] = useState<any>({})

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const year = new Date().getFullYear()
        const response = await workoutService.getMonthlyExerciseData(year, selectedMonth + 1)
        console.log('Response from server:', response)
        if (response.success) {
          console.log('Exercise data:', response.data)
          setExerciseData(response.data)
        }
      } catch (error) {
        console.error('Error fetching exercise data:', error)
      }
    }

    fetchMonthlyData()
  }, [selectedMonth])

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 240,
        ticks: {
          stepSize: 20
        },
        title: {
          display: true,
          text: 'Weight (kg)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  }

  return (
    <Box sx={{ p: 6 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 6 }}>
        <Button variant='outlined' startIcon={<Icon icon='mdi:home' />} onClick={() => router.push('/')}>
          Home
        </Button>
      </Box>

      <Typography variant='h3' sx={{ mb: 4 }}>
        Exercise Progress
      </Typography>

      <FormControl sx={{ mb: 4, minWidth: 200 }}>
        <InputLabel>Select Month</InputLabel>
        <Select value={selectedMonth} label='Select Month' onChange={e => setSelectedMonth(Number(e.target.value))}>
          {months.map((month, index) => (
            <MenuItem key={index} value={index}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mt: 4 }}>
        {Object.entries(exerciseData).map(([exerciseName, data]: [string, any]) => (
          <Box key={exerciseName} sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ mb: 2 }}>
              {exerciseName}
            </Typography>
            <Box sx={{ height: 400 }}>
              <Line
                options={chartOptions}
                data={{
                  labels: data.dates.map((date: string) => new Date(date).toLocaleDateString()),
                  datasets: [
                    {
                      label: 'Weight',
                      data: data.weights,
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1,
                      fill: false
                    }
                  ]
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

GraphicsPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default GraphicsPage
