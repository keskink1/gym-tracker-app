import Box from '@mui/material/Box'
import { Settings } from 'src/@core/context/settingsContext'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}
const AppBarContent = (props: Props) => {
  const { settings } = props

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <UserDropdown settings={settings} />
    </Box>
  )
}

export default AppBarContent
