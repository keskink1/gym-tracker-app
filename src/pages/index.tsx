// ** MUI Imports
import { useRouter } from 'next/router'
import { Box, Button, Typography, Grid, Card, CardContent } from '@mui/material'
import Icon from 'src/@core/components/icon'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import type { ReactNode } from 'react'
import { useAuth } from 'src/hooks/useAuth'

const HomePage = () => {
  const router = useRouter()
  const auth = useAuth()

  const menuItems = [
    {
      title: 'Workouts',
      description: 'Create and manage your workout routines',
      icon: 'mdi:dumbbell',
      path: '/workouts'
    },
    {
      title: 'Exercises',
      description: 'Browse and manage exercises',
      icon: 'mdi:arm-flex',
      path: '/exercises'
    },
    {
      title: 'Calendar',
      description: 'Schedule your workouts',
      icon: 'mdi:calendar',
      path: '/calendar'
    },
    {
      title: 'Overview',
      description: 'View your monthly workout summary',
      icon: 'mdi:chart-timeline',
      path: '/overview'
    }
  ]

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

      <Grid container spacing={6}>
        {menuItems.map(item => (
          <Grid item xs={12} md={6} key={item.path}>
            <Card
              sx={{
                cursor: 'pointer',
                height: '100%',
                '&:hover': {
                  boxShadow: 6
                }
              }}
              onClick={() => router.push(item.path)}
            >
              <CardContent sx={{ p: theme => `${theme.spacing(5)} !important` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Icon icon={item.icon} fontSize={36} />
                  <Typography variant='h5' sx={{ ml: 2 }}>
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant='body2'>{item.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

// Layout'u ekleyelim
HomePage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default HomePage
