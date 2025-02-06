import { ReactNode, useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField
} from '@mui/material'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import userService from 'src/@core/services/user.service'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import authService from 'src/@core/services/auth.service'

const SettingsPage = () => {
  const router = useRouter()
  const auth = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    name: auth.user?.name ?? '',
    surname: auth.user?.surname ?? '',
    email: auth.user?.email ?? ''
  })

  // User bilgisi değiştiğinde state'i güncelle
  useEffect(() => {
    console.log('auth.user', auth.user)
    if (auth.user) {
      setUserData({
        name: auth.user.name ?? '',
        surname: auth.user.surname ?? '',
        email: auth.user.email ?? ''
      })
    }
  }, [auth.user])

  const handleSave = async () => {
    try {
      console.log('Sending update request with data:', userData)
      const response = await userService.updateProfile(userData)
      console.log('Update response:', response)

      if (response.success) {
        console.log('Update successful, fetching latest user data...')
        const userResponse = await authService.meEndpoint()
        console.log('Latest user data:', userResponse)

        if (userResponse.success) {
          console.log('Setting new user data:', userResponse.result)
          auth.setUser(userResponse.result)
          setUserData({
            name: userResponse.result.name ?? '',
            surname: userResponse.result.surname ?? '',
            email: userResponse.result.email ?? ''
          })

          toast.success('Profile updated successfully')
          setIsEditing(false)
        }
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.')

    if (confirmed) {
      try {
        const response = await userService.deleteAccount()
        if (response.success) {
          toast.success('Account deleted successfully')
          auth.logout()
        }
      } catch (error) {
        toast.error('Failed to delete account')
      }
    }
  }

  return (
    <Box sx={{ p: 6 }}>
      {/* Container for header */}
      <Box
        sx={{
          maxWidth: '800px',
          margin: '0 auto',
          px: 4,
          mb: 6,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {/* Buttons row */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant='outlined' startIcon={<Icon icon='mdi:home' />} onClick={() => router.push('/')}>
            Home
          </Button>
          {isEditing && (
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => {
                setIsEditing(false)
                setUserData({
                  name: auth.user?.name ?? '',
                  surname: auth.user?.surname ?? '',
                  email: auth.user?.email ?? ''
                })
              }}
              startIcon={<Icon icon='mdi:arrow-left' />}
            >
              Back
            </Button>
          )}
        </Box>

        {/* Title */}
        <Typography variant='h3' sx={{ textAlign: 'center' }}>
          Settings
        </Typography>
      </Box>

      {/* Container for content */}
      <Box
        sx={{
          maxWidth: '800px',
          margin: '0 auto',
          px: 4
        }}
      >
        {/* User Info */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant='h6'>Account Information</Typography>
            {!isEditing && (
              <Button variant='outlined' startIcon={<Icon icon='mdi:pencil' />} onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </Box>

          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component='th' sx={{ width: '30%' }}>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={userData.name ?? ''}
                        onChange={e => setUserData({ ...userData, name: e.target.value })}
                      />
                    ) : (
                      userData.name ?? ''
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component='th'>
                    <strong>Surname</strong>
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={userData.surname ?? ''}
                        onChange={e => setUserData({ ...userData, surname: e.target.value })}
                      />
                    ) : (
                      userData.surname ?? ''
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component='th'>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={userData.email ?? ''}
                        onChange={e => setUserData({ ...userData, email: e.target.value })}
                      />
                    ) : (
                      userData.email ?? ''
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Save ve Delete butonları */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {isEditing ? (
            <>
              <Button
                variant='contained'
                color='primary'
                onClick={handleSave}
                startIcon={<Icon icon='mdi:content-save' />}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant='contained'
              color='error'
              onClick={handleDeleteAccount}
              startIcon={<Icon icon='mdi:delete' />}
              size='small'
            >
              Delete Account
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

SettingsPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default SettingsPage
