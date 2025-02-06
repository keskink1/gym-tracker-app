import { Box, Typography, Paper, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { ReactNode, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Icon } from '@iconify/react'

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

const CalendarPage = () => {
  const router = useRouter()

  const { days, currentDate } = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const today = now.getDate()

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
        isToday: i === today
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
  }, [])

  return (
    <Box sx={{ p: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
        <Button variant='outlined' startIcon={<Icon icon='mdi:home' />} onClick={() => router.push('/')}>
          Home
        </Button>
        <Typography variant='h3'>
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Typography>
      </Box>
      <CalendarGrid>
        {/* Haftanın günleri */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Typography key={day} variant='subtitle1' sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            {day}
          </Typography>
        ))}

        {/* Takvim hücreleri - örnek olarak 31 gün */}
        {days.map((dayInfo, index) => (
          <CalendarCell
            key={index}
            elevation={1}
            isToday={dayInfo?.isToday}
            sx={{
              opacity: dayInfo?.isCurrentMonth ? 1 : 0.5
            }}
          >
            <Typography>{dayInfo?.day}</Typography>
          </CalendarCell>
        ))}
      </CalendarGrid>
    </Box>
  )
}

CalendarPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default CalendarPage
