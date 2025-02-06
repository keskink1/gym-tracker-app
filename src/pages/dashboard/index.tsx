import { Box, Button } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'

const DashboardPage = () => {
  const auth = useAuth()
  console.log('Auth context:', auth)

  return (
    <Box sx={{ p: 4 }}>
      <Button
        variant='contained'
        color='error'
        onClick={() => auth.logout()}
        sx={{ position: 'absolute', top: 20, right: 20 }}
      >
        Logout
      </Button>
    </Box>
  )
}

export default DashboardPage
