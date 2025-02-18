import { Box, Typography, Paper, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { styled } from '@mui/material/styles'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { ReactNode, useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Icon } from '@iconify/react'
import DayWorkoutDialog from 'src/components/calendar/DayWorkoutDialog'
import workoutService from 'src/@core/services/workout.service'
import { Workout } from 'src/types/workout'

// Basit bir takvim grid'i için styled component
const CalendarGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: theme.spacing(1),
  padding: theme.spacing(2)
}))

const CalendarCell = styled(Paper, {
  shouldForwardProp: prop => prop !== 'isToday'
})<{ isToday?: boolean }>(({ theme, isToday }) => ({
  padding: theme.spacing(2),
  height: '100px',
  cursor: 'pointer',
  backgroundColor: isToday ? theme.palette.error.light : theme.palette.background.paper,
  color: isToday ? theme.palette.error.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: isToday ? theme.palette.error.main : theme.palette.action.hover
  }
}))

interface CalendarDay {
  day: number
  isCurrentMonth: boolean
  isToday?: boolean
  workout?: {
    name: string
    _id: string
  }
}

interface CalendarEntry {
  date: string
  workoutId: {
    _id: string
    name: string
  }
}

const CalendarPage = () => {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [scheduledWorkout, setScheduledWorkout] = useState<Workout | undefined>(undefined)
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear] = useState(new Date().getFullYear())

  const { days, currentDate } = useMemo(() => {
    // Seçili ay ve yıl için tarihi oluştur
    const now = new Date(selectedYear, selectedMonth)
    const year = now.getFullYear()
    const month = now.getMonth()
    const today = new Date().getDate()
    const isCurrentMonth = month === new Date().getMonth() && year === new Date().getFullYear()

    // Ayın ilk gününü bul
    const firstDay = new Date(year, month, 1)
    const startingDay = firstDay.getDay()

    // Aydaki toplam gün sayısını bul
    const lastDay = new Date(year, month + 1, 0)
    const totalDays = lastDay.getDate()

    // Takvim array'ini oluştur
    const days = Array(42).fill(null) // 6 hafta x 7 gün

    // Önceki ayın günlerini ekle
    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()
    for (let i = 0; i < startingDay; i++) {
      days[i] = {
        day: prevMonthDays - startingDay + i + 1,
        isCurrentMonth: false
      }
    }

    // Mevcut ayın günlerini ekle
    for (let i = 1; i <= totalDays; i++) {
      days[startingDay + i - 1] = {
        day: i,
        isCurrentMonth: true,
        isToday: isCurrentMonth && i === today
      }
    }

    // Sonraki ayın günlerini ekle
    let nextMonthDay = 1
    for (let i = startingDay + totalDays; i < 42; i++) {
      days[i] = {
        day: nextMonthDay++,
        isCurrentMonth: false
      }
    }

    return {
      days,
      currentDate: now
    }
  }, [selectedMonth, selectedYear])

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1
        const response = await workoutService.getMonthlyWorkouts(year, month)

        if (response.success) {
          const updatedDays = days.map(day => {
            if (day.isCurrentMonth) {
              const date = new Date(year, month - 1, day.day).toISOString().split('T')[0]
              const workoutForDay = response.data.find((entry: CalendarEntry) => entry.date.split('T')[0] === date)

              return {
                ...day,
                workout: workoutForDay?.workoutId
              }
            }
            return day
          })
          setCalendarData(updatedDays)
        }
      } catch (error) {
        console.error('Error fetching calendar data:', error)
      }
    }

    fetchCalendarData()
  }, [currentDate, days])

  const handleDayClick = async (date: Date) => {
    try {
      const response = await workoutService.getScheduledWorkout(date)
      if (response.success) {
        setScheduledWorkout(response.data)
      } else {
        setScheduledWorkout(undefined)
      }
      setSelectedDate(date)
    } catch (error) {
      console.error('Error fetching scheduled workout:', error)
      setScheduledWorkout(undefined)
    }
  }

  const refreshCalendarData = async () => {
    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      const response = await workoutService.getMonthlyWorkouts(year, month)

      if (response.success) {
        const updatedDays = days.map(day => {
          if (day.isCurrentMonth) {
            const date = new Date(year, month - 1, day.day).toISOString().split('T')[0]
            const workoutForDay = response.data.find((entry: CalendarEntry) => entry.date.split('T')[0] === date)

            return {
              ...day,
              workout: workoutForDay?.workoutId
            }
          }
          return day
        })
        setCalendarData(updatedDays)
      }
    } catch (error) {
      console.error('Error refreshing calendar data:', error)
    }
  }

  const handleWorkoutSave = async () => {
    await refreshCalendarData()
  }

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
        <Button variant='outlined' startIcon={<Icon icon='mdi:home' />} onClick={() => router.push('/')}>
          Home
        </Button>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Month</InputLabel>
          <Select value={selectedMonth} label='Select Month' onChange={e => setSelectedMonth(Number(e.target.value))}>
            {months.map((month, index) => (
              <MenuItem key={index} value={index}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant='h3'>{currentDate.toLocaleString('default', { year: 'numeric' })}</Typography>
      </Box>
      <CalendarGrid>
        {/* Haftanın günleri */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Typography key={day} variant='subtitle1' sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            {day}
          </Typography>
        ))}

        {/* Takvim hücreleri */}
        {calendarData.map((dayInfo, index) => (
          <CalendarCell
            key={index}
            elevation={1}
            isToday={dayInfo?.isToday}
            onClick={() => {
              if (dayInfo) {
                const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayInfo.day)
                handleDayClick(clickedDate)
              }
            }}
            sx={{
              opacity: dayInfo?.isCurrentMonth ? 1 : 0.5,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Typography>{dayInfo?.day}</Typography>
            {dayInfo?.workout && (
              <Typography
                variant='caption'
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  p: 0.5,
                  borderRadius: 1,
                  mt: 1,
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {dayInfo.workout.name}
              </Typography>
            )}
          </CalendarCell>
        ))}
      </CalendarGrid>
      {selectedDate && (
        <DayWorkoutDialog
          open={!!selectedDate}
          onClose={() => {
            setSelectedDate(null)
            setScheduledWorkout(undefined)
          }}
          selectedDate={selectedDate}
          scheduledWorkout={scheduledWorkout}
          onSave={handleWorkoutSave}
        />
      )}
    </Box>
  )
}

CalendarPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default CalendarPage
