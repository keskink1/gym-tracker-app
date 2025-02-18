import { ReactNode, useState, useEffect } from 'react'
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import workoutService from 'src/@core/services/workout.service'
import { useRouter } from 'next/router'
import { Icon } from '@iconify/react'

interface WorkoutSummary {
  totalWorkouts: number
  totalExercises: number
  mostFrequentWorkout?: string
  workoutDates: Array<{
    date: string
    workoutName: string
  }>
}

const OverviewPage = () => {
  const router = useRouter()
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [monthlyData, setMonthlyData] = useState<WorkoutSummary>({
    totalWorkouts: 0,
    totalExercises: 0,
    workoutDates: []
  })

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const year = new Date().getFullYear()
        const response = await workoutService.getMonthlyOverview(year, selectedMonth + 1)
        if (response.success) {
          const summary: WorkoutSummary = {
            totalWorkouts: response.data.length,
            totalExercises: response.data.reduce(
              (total: number, entry: any) => total + (entry.workoutId?.exercises?.length || 0),
              0
            ),
            workoutDates: response.data.map((entry: any) => ({
              date: new Date(entry.date).toLocaleDateString(),
              workoutName: entry.workoutId?.name || 'Unknown Workout'
            }))
          }

          // En sık yapılan workout'u bul
          const workoutCounts = response.data.reduce((counts: any, entry: any) => {
            const name = entry.workoutId?.name
            if (name) {
              counts[name] = (counts[name] || 0) + 1
            }
            return counts
          }, {})

          const mostFrequent = Object.entries(workoutCounts).sort(([, a]: any, [, b]: any) => b - a)[0]

          if (mostFrequent) {
            summary.mostFrequentWorkout = mostFrequent[0]
          }

          setMonthlyData(summary)
        }
      } catch (error) {
        console.error('Error fetching monthly data:', error)
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

  return (
    <Box sx={{ p: 6 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 6 }}>
        <Button variant='outlined' startIcon={<Icon icon='mdi:home' />} onClick={() => router.push('/')}>
          Home
        </Button>
      </Box>

      <Typography variant='h3' sx={{ mb: 4 }}>
        Monthly Overview
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
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent>
                <Typography color='textSecondary' gutterBottom>
                  Total Workouts
                </Typography>
                <Typography variant='h4'>{monthlyData.totalWorkouts}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent>
                <Typography color='textSecondary' gutterBottom>
                  Total Exercises
                </Typography>
                <Typography variant='h4'>{monthlyData.totalExercises}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {monthlyData.mostFrequentWorkout && (
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography color='textSecondary' gutterBottom>
                    Most Frequent Workout
                  </Typography>
                  <Typography variant='h5'>{monthlyData.mostFrequentWorkout}</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography color='textSecondary' gutterBottom>
                  Workout Dates
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {monthlyData.workoutDates.map((workout, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1 }}>
                      <Chip label={workout.date} sx={{ mb: 1 }} />
                      <Typography variant='caption' color='textSecondary'>
                        {workout.workoutName}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

OverviewPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default OverviewPage
