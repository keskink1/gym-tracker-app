// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { PricialLogoSvg } from 'src/@core/layouts/components/horizontal/app-bar-content'

const FallbackSpinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <PricialLogoSvg height={48} />
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
