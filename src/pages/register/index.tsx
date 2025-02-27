import { ReactNode, useState } from 'react'

import Link from 'next/link'

import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import CustomTextField from 'src/@core/components/mui/text-field'

import Icon from 'src/@core/components/icon'

import BlankLayout from 'src/@core/layouts/BlankLayout'

import { useSettings } from 'src/@core/hooks/useSettings'

import toast from 'react-hot-toast'
import { AuthRegisterRequest } from 'src/@core/models/auth-models'
import authService from 'src/@core/services/auth.service'
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

// ** Styled Components
const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 600,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

const Register = () => {
  // ** States
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [request, setRequest] = useState<AuthRegisterRequest>({
    email: '',
    fullName: '',
    organizationName: '',
    password: ''
  })
  const [registerCompleted, setRegisterCompleted] = useState(false)
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const { skin } = settings

  const imageSource = skin === 'bordered' ? 'auth-v2-register-illustration-bordered' : 'auth-v2-register-illustration'
  const updateRequest = (key: keyof typeof request, value: string) => {
    setRequest(r => ({
      ...r,
      [key]: value
    }))
  }

  const register = async () => {
    if (!request.email || !request.fullName || !request.organizationName || !request.password) {
      return toast.error('Please fill out all the fields.')
    }
    const response = await authService.register(request)
    if (response.success) {
      setRequest({
        email: '',
        fullName: '',
        organizationName: '',
        password: ''
      })
      toast.success('Registered succesfully! Check the link in your email')
      setRegisterCompleted(true)
      return
    }
    return toast.error(response.error)
  }

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <RegisterIllustration
            alt='register-illustration'
            src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 24,
                filter: 'drop-shadow(1px 2px 1px #000)'
              }}
            ></Box>
            <Box sx={{ my: 6 }}>
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                Adventure starts here 🚀
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Make your workout management easy and fun!</Typography>
            </Box>
            {registerCompleted ? (
              <>
                <Typography variant='h5'>Register Completed</Typography>
                <Typography variant='body2'>Check your email to verify your account!</Typography>
              </>
            ) : (
              <form
                noValidate
                autoComplete='off'
                onSubmit={e => {
                  e.preventDefault()
                  register()
                }}
              >
                <CustomTextField
                  onChange={e => {
                    updateRequest('fullName', e.target.value)
                  }}
                  autoFocus
                  fullWidth
                  sx={{ mb: 4 }}
                  label='Your Name'
                  placeholder='John Doe'
                />
                <CustomTextField
                  onChange={e => {
                    updateRequest('organizationName', e.target.value)
                  }}
                  fullWidth
                  sx={{ mb: 4 }}
                  label='Organization Name'
                  placeholder='Acme Inc.'
                />
                <CustomTextField
                  onChange={e => {
                    updateRequest('email', e.target.value)
                  }}
                  fullWidth
                  label='Email'
                  sx={{ mb: 4 }}
                  placeholder='johndoe@acme.com'
                />
                <CustomTextField
                  onChange={e => {
                    updateRequest('password', e.target.value)
                  }}
                  fullWidth
                  label='Password'
                  id='auth-login-v2-password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='*****'
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ mb: 4, mt: 1.5, '& .MuiFormControlLabel-label': { fontSize: theme.typography.body2.fontSize } }}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <Typography sx={{ color: 'text.secondary' }}>I agree to</Typography>
                      <Typography component={LinkStyled} href='/' onClick={e => e.preventDefault()} sx={{ ml: 1 }}>
                        privacy policy & terms
                      </Typography>
                    </Box>
                  }
                />
                <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                  Sign up
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Typography sx={{ color: 'text.secondary', mr: 2 }}>Already have an account?</Typography>
                  <Typography component={LinkStyled} href='/login'>
                    Sign in instead
                  </Typography>
                </Box>
              </form>
            )}
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Register.guestGuard = true

export default Register
