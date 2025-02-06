// ** React Imports
import { Fragment, SyntheticEvent, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'

interface Props {
  settings: Settings
}

const MenuItemStyled = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  '&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
    color: theme.palette.primary.main
  }
}))

const UserDropdown = (props: Props) => {
  const { settings } = props
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  const router = useRouter()
  const { logout, user } = useAuth()
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    px: 4,
    py: 1.75,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2.5,
      fontSize: '1.5rem',
      color: 'text.secondary'
    }
  }
  const userInitials =
    user &&
    (user?.fullName || '')
      .split(' ')
      .slice(0, 2)
      .map(x => x[0].toUpperCase())
      .join(' ')
  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar onClick={handleDropdownOpen} sx={{ width: 38, height: 38 }}>
          {userInitials}
        </Avatar>
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4.75 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ py: 1.75, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flex: 1, display: 'flex', ml: 2.5, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 500 }}>
                Hello, <br />
                {user?.fullName}
              </Typography>
              {/* <Typography variant='body2'>Admin</Typography> */}
            </Box>
            <Avatar onClick={handleDropdownOpen} sx={{ width: 38, height: 38 }}>
              {userInitials}
            </Avatar>
          </Box>
        </Box>
        <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
        {/* <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon='tabler:user-check' />
            My Profile
          </Box>
        </MenuItemStyled>
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon='tabler:settings' />
            Settings
          </Box>
        </MenuItemStyled>
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon='tabler:credit-card' />
            Billing
          </Box>
        </MenuItemStyled> */}
        {/* <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon='tabler:lifebuoy' />
            Help
          </Box>
        </MenuItemStyled>
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon='tabler:info-circle' />
            FAQ
          </Box>
        </MenuItemStyled>
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon='tabler:currency-dollar' />
            Pricing
          </Box>
        </MenuItemStyled> */}
        {/* <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} /> */}
        <MenuItemStyled sx={{ p: 0 }} onClick={handleLogout}>
          <Box sx={styles}>
            <Icon icon='tabler:logout' />
            Logout
          </Box>
        </MenuItemStyled>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
