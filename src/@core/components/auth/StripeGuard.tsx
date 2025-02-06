import { ReactNode } from 'react'

import { Button } from '@mui/material'
import { Box, SxProps } from '@mui/system'
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'

interface StripeGuardProps {
  children: ReactNode
  containerStyles?: SxProps
  fallback?: React.ReactElement
}

const StripeGuard = (props: StripeGuardProps) => {
  const { children, containerStyles, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  if (auth.user === null || !auth.user.stripeEnabled) {
    if (fallback) {
      return fallback
    }
    return (
      <Box sx={containerStyles}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <span>Please add your</span>
          <Icon icon='logos:stripe' height={24} />
          <span>api key to view this page.</span>
        </Box>
        <Button sx={{ mt: 4 }} variant='tonal' onClick={() => router.push('/settings')}>
          <Icon icon='tabler:settings' fontSize={20} style={{ marginRight: 8 }} /> Go to settings
        </Button>
      </Box>
    )
  }
  return <>{children}</>
}

export default StripeGuard
