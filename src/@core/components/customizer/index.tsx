// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'

const Toggler = styled(Box)<BoxProps>(({ theme }) => ({
  right: 0,
  top: '50%',
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  padding: theme.spacing(2),
  zIndex: theme.zIndex.modal,
  transform: 'translateY(-50%)',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderBottomLeftRadius: theme.shape.borderRadius
}))

const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
  width: 400,
  zIndex: theme.zIndex.modal,
  '& .MuiFormControlLabel-root': {
    marginRight: '0.6875rem'
  },
  '& .MuiDrawer-paper': {
    border: 0,
    width: 400,
    zIndex: theme.zIndex.modal,
    boxShadow: theme.shadows[9]
  }
}))

const CustomizerSpacing = styled('div')(({ theme }) => ({
  padding: theme.spacing(5, 6)
}))

const ColorBox = styled(Box)<BoxProps>(({ theme }) => ({
  width: 45,
  height: 45,
  cursor: 'pointer',
  margin: theme.spacing(2.5, 1.75, 1.75),
  borderRadius: theme.shape.borderRadius,
  transition: 'margin .25s ease-in-out, width .25s ease-in-out, height .25s ease-in-out, box-shadow .25s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}))

const Customizer = () => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)

  // ** Hook
  const { settings, saveSettings } = useSettings()

  // ** Vars
  const { mode, layout, themeColor } = settings

  const handleChange = (field: keyof Settings, value: Settings[keyof Settings]): void => {
    saveSettings({ ...settings, [field]: value })
  }

  return (
    <div className='customizer'>
      <Toggler className='customizer-toggler' onClick={() => setOpen(true)}>
        <Icon icon='tabler:settings' />
      </Toggler>
      <Drawer open={open} hideBackdrop anchor='right' variant='persistent'>
        <Box
          className='customizer-header'
          sx={{
            position: 'relative',
            p: theme => theme.spacing(3.5, 5),
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
            Theme Customizer
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Customize & Preview in Real Time</Typography>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              right: 20,
              top: '50%',
              position: 'absolute',
              color: 'text.secondary',
              transform: 'translateY(-50%)'
            }}
          >
            <Icon icon='tabler:x' fontSize={20} />
          </IconButton>
        </Box>
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 5, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              Theming
            </Typography>

            {/* Mode */}
            <Box sx={{ mb: 5 }}>
              <Typography>Mode</Typography>
              <RadioGroup
                row
                value={mode}
                onChange={e => handleChange('mode', e.target.value as any)}
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
              >
                <FormControlLabel value='light' label='Light' control={<Radio />} />
                <FormControlLabel value='dark' label='Dark' control={<Radio />} />
                {layout === 'horizontal' ? null : (
                  <FormControlLabel value='semi-dark' label='Semi Dark' control={<Radio />} />
                )}
              </RadioGroup>
            </Box>

            {/* Color Picker */}
            <div>
              <Typography>Primary Color</Typography>
              <Box sx={{ display: 'flex' }}>
                <ColorBox
                  onClick={() => handleChange('themeColor', 'primary')}
                  sx={{
                    backgroundColor: '#1fb2a5',
                    ...(themeColor === 'primary'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'secondary')}
                  sx={{
                    backgroundColor: 'secondary.main',
                    ...(themeColor === 'secondary'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'success')}
                  sx={{
                    backgroundColor: 'success.main',
                    ...(themeColor === 'success'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'error')}
                  sx={{
                    backgroundColor: 'error.main',
                    ...(themeColor === 'error'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'warning')}
                  sx={{
                    backgroundColor: 'warning.main',
                    ...(themeColor === 'warning'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'info')}
                  sx={{
                    backgroundColor: 'info.main',
                    ...(themeColor === 'info' ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) } : {})
                  }}
                />
              </Box>
            </div>
          </CustomizerSpacing>

          <Divider sx={{ m: '0 !important' }} />
        </PerfectScrollbar>
      </Drawer>
    </div>
  )
}

export default Customizer
