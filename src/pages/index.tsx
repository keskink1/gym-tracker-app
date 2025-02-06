// ** MUI Imports
import { useRouter } from 'next/router'
import { Box, Button, Typography, Grid } from '@mui/material'
import Icon from 'src/@core/components/icon'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import type { ReactNode } from 'react'
import { useAuth } from 'src/hooks/useAuth'

const HomePage = () => {
  const router = useRouter()
  const auth = useAuth()

  return (
    <Box sx={{ p: 6 }}>
      {/* Buttons in header */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 4 }}>
        <Button variant='outlined' startIcon={<Icon icon='mdi:cog' />} onClick={() => router.push('/settings')}>
          Settings
        </Button>
        <Button variant='contained' color='error' onClick={() => auth.logout()}>
          Logout
        </Button>
      </Box>

      <Typography variant='h3' sx={{ mb: 6, textAlign: 'center' }}>
        Welcome {auth.user?.name}! 🏋️‍♂️
      </Typography>

      <Grid container spacing={4} justifyContent='center'>
        <Grid item xs={12} md={4}>
          <Button
            fullWidth
            variant='contained'
            size='large'
            onClick={() => router.push('/workouts')}
            sx={{
              p: 4,
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
            startIcon={<Icon icon='mdi:weight-lifter' />}
          >
            <Typography variant='h6'>My Workouts</Typography>
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <Button
            fullWidth
            variant='contained'
            size='large'
            onClick={() => router.push('/exercises/create')}
            sx={{
              p: 4,
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Icon icon='mdi:plus-circle' fontSize='3rem' />
            <Typography variant='h6'>Create Exercise</Typography>
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <Button
            fullWidth
            variant='contained'
            size='large'
            onClick={() => router.push('/calendar')}
            sx={{
              p: 4,
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Icon icon='mdi:calendar' fontSize='3rem' />
            <Typography variant='h6'>Calendar</Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

// Layout'u ekleyelim
HomePage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default HomePage
