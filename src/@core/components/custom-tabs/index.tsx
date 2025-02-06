import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import Icon from '../icon'

const CustomTabs: React.FC<{
  selectedIndex: number
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
  tabs: { icon: string; title: string }[]
  orientation?: 'horizontal' | 'vertical'
}> = ({ selectedIndex, setSelectedIndex, tabs, orientation = 'horizontal' }) => {
  return (
    <List sx={{ width: '100%', p: 4, display: 'flex', flexDirection: orientation === 'horizontal' ? 'row' : 'column' }}>
      {tabs.map((tab, index) => (
        <ListItem
          disablePadding
          key={index}
          sx={{
            width: 'unset'
          }}
        >
          <ListItemButton
            sx={{ borderRadius: 0.75 }}
            selected={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
          >
            <ListItemIcon>
              <Icon icon={tab.icon} />
            </ListItemIcon>
            <ListItemText primary={tab.title} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}
export default CustomTabs
