// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'

// ** Type Import
import React from 'react'
import { LayoutProps } from 'src/@core/layouts/types'

// ** Theme Config Import

interface Props {
  hidden: LayoutProps['hidden']
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  appBarContent: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['appBar']>['content']
  appBarBranding: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['appBar']>['branding']
  children?: React.ReactNode
}

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))

const AppBarContent = (props: Props) => {
  // ** Props
  const { appBarContent: userAppBarContent, appBarBranding: userAppBarBranding, children } = props

  // ** Hooks
  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62 }}>
      {userAppBarBranding ? (
        userAppBarBranding(props)
      ) : (
        <LinkStyled sx={{ mr: 0 }} href='/'>
          {/* <PricialLogoSvg width={140} height='auto' /> */}
          LOGO
        </LinkStyled>
      )}
      {children ? children : undefined}
      {userAppBarContent ? (
        <Box sx={{ width: 140, display: 'flex', justifyContent: 'flex-end' }}>{userAppBarContent(props)}</Box>
      ) : null}
    </Box>
  )
}

export const PricialLogoSvg = (params: { height?: number | 'auto'; width?: number }) => {
  const theme = useTheme()
  const fill = theme.palette.mode === 'dark' ? '#ececec' : '#333'
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      id='katman_2'
      data-name='katman 2'
      viewBox='0 0 2253 599.52'
      style={{ height: params.height || 36, width: params.width || 'auto' }}
    >
      <defs>
        <style>{`.cls-2{fill:${fill};}.cls-2{transition: fill 0.5s linear;}`}</style>
      </defs>
      <g id='katman_1' data-name='katman 1'>
        <path
          d='M0 0h306.95v372.9H0z'
          style={{
            fill: '#d926aa'
          }}
        />
        <path
          d='M306.95 0h85.73c102.91 0 186.46 83.55 186.46 186.45 0 102.91-83.55 186.45-186.45 186.45h-85.73V0Z'
          style={{
            fill: '#1fb2a5'
          }}
        />
        <path
          d='M0 372.9h306.95v226.62H0z'
          style={{
            fill: '#661ae6'
          }}
        />
        <path
          d='m919.76 184.39-16.37 134.15s-34.49-6.39-57.87-6.39c-29.23 0-71.31 4.97-71.31 61.04V570.5H629.25V180.84h78.91l42.08 44.01c22.21-30.52 56.7-51.81 108.13-51.81 36.82 0 61.37 11.36 61.37 11.36ZM947.22 180.13h144.96V570.5H947.22zM947.84 85.61c0-40.59 32.76-60.88 72.2-60.88s71.53 20.29 71.53 60.88-32.76 60.88-71.53 60.88-72.2-20.29-72.2-60.88ZM1123.15 377.44c0-125.63 69.56-204.41 211.01-204.41 76.57 0 139.11 41.17 143.79 41.17l-44.42 117.82c-4.09 0-55.53-34.78-98.78-34.78-40.33 0-59.62 24.84-59.62 75.95 0 57.49 29.81 76.65 88.84 76.65 49.1 0 81.25-19.16 85.34-19.16l41.5 92.98c-4.09 0-49.68 53.94-154.31 53.94-143.79 0-213.35-73.11-213.35-200.15ZM1515.36 180.13h144.96V570.5h-144.96zM1515.97 85.61c0-40.59 32.76-60.88 72.2-60.88s71.53 20.29 71.53 60.88-32.76 60.88-71.53 60.88-72.2-20.29-72.2-60.88ZM2064.2 310.73V570.5h-94.11l-20.46-51.81c-19.87 24.13-60.2 58.91-126.84 58.91-85.92 0-135.02-46.84-135.02-117.11 0-112.85 97.61-128.47 162.49-128.47 31.56 0 60.2 4.26 83 9.23v-12.78c0-23.42-10.52-39.04-57.28-39.04-57.87 0-119.82 32.65-119.82 32.65l-29.23-104.34s80.08-41.17 158.99-41.17c122.16 0 178.27 58.2 178.27 134.15Zm-206.91 149.76c38.58 0 59.03-14.19 75.99-29.1v-7.1c-16.37-2.13-35.07-3.55-56.11-3.55-33.9 0-62.54 6.39-62.54 22.71 0 11.36 18.7 17.03 42.67 17.03ZM2108.04 23.98H2253V570.5h-144.96V23.98Z'
          className='cls-2'
        />
      </g>
    </svg>
  )
}

export default AppBarContent
