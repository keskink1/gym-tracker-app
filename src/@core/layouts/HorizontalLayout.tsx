// ** MUI Imports
import AppBar from '@mui/material/AppBar'
import Box, { BoxProps } from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import MuiToolbar, { ToolbarProps } from '@mui/material/Toolbar'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

// ** Components
import Customizer from 'src/@core/components/customizer'
import ScrollToTop from 'src/@core/components/scroll-to-top'
import AppBarContent from './components/horizontal/app-bar-content'
import Navigation from './components/horizontal/navigation'

// ** Util Import
import { IconButton } from '@mui/material'
import { useState } from 'react'
import { hexToRGBA } from '../utils/hex-to-rgba'

const HorizontalLayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex',
  ...(themeConfig.horizontalMenuAnimation && { overflow: 'clip' })
})

const MainContentWrapper = styled(Box)<BoxProps>({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
})

const Toolbar = styled(MuiToolbar)<ToolbarProps>(({ theme }) => ({
  width: '100%',
  padding: `${theme.spacing(0, 6)} !important`,
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(4)
  },
  [theme.breakpoints.down('xs')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}))

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const HorizontalLayout = (props: LayoutProps) => {
  // ** Props
  const { hidden, children, settings, scrollToTop, saveSettings, contentHeightFixed, horizontalLayoutProps } = props

  // ** Vars
  const { skin, appBar, navHidden, appBarBlur, contentWidth } = settings
  const appBarProps = horizontalLayoutProps?.appBar?.componentProps
  const userNavMenuContent = horizontalLayoutProps?.navMenu?.content
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  let userAppBarStyle = {}
  if (appBarProps && appBarProps.sx) {
    userAppBarStyle = appBarProps.sx
  }
  const userAppBarProps = Object.assign({}, appBarProps)
  delete userAppBarProps.sx

  return (
    <HorizontalLayoutWrapper className='layout-wrapper'>
      <MainContentWrapper className='layout-content-wrapper' sx={{ ...(contentHeightFixed && { maxHeight: '100vh' }) }}>
        {/* Navbar (or AppBar) and Navigation Menu Wrapper */}
        <AppBar
          color='default'
          elevation={skin === 'bordered' ? 0 : 2}
          className='layout-navbar-and-nav-container'
          position={appBar === 'fixed' ? 'sticky' : 'static'}
          sx={{
            alignItems: 'center',
            color: 'text.primary',
            justifyContent: 'center',
            ...(appBar === 'static' && { zIndex: 13 }),
            transition: 'border-bottom 0.2s ease-in-out',
            ...(appBarBlur && { backdropFilter: 'blur(6px)' }),
            backgroundColor: theme => hexToRGBA(theme.palette.background.paper, appBarBlur ? 0.95 : 1),
            ...(skin === 'bordered' && { borderBottom: theme => `1px solid ${theme.palette.divider}` }),
            ...userAppBarStyle
          }}
          {...userAppBarProps}
        >
          {/* Navbar / AppBar */}
          <Box
            className='layout-navbar'
            sx={{
              width: '100%',
              ...(navHidden ? {} : { borderBottom: theme => `1px solid ${theme.palette.divider}` })
            }}
          >
            <Toolbar
              className='navbar-content-container'
              sx={{
                mx: 'auto',
                ...(contentWidth === 'boxed' && { '@media (min-width:1440px)': { maxWidth: 1440 } }),
                minHeight: theme => `${(theme.mixins.toolbar.minHeight as number) - 2}px !important`
              }}
            >
              <Box
                sx={{
                  display: 'none',
                  '@media screen and (max-width: 878px)': {
                    '&': {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      ml: -2
                    }
                  }
                }}
              >
                <IconButton
                  color={showMobileMenu ? 'primary' : 'default'}
                  onClick={() => setShowMobileMenu(v => !v)}
                  sx={{ p: 1, transition: 'all 0.35s' }}
                >
                  <Icon icon='tabler:menu-2' height={36} />
                </IconButton>
              </Box>
              <AppBarContent
                {...props}
                hidden={hidden}
                settings={settings}
                saveSettings={saveSettings}
                appBarContent={horizontalLayoutProps?.appBar?.content}
                appBarBranding={horizontalLayoutProps?.appBar?.branding}
              >
                {navHidden ? null : (
                  <Box
                    onClick={() => setShowMobileMenu(false)}
                    className='layout-horizontal-nav'
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      ...horizontalLayoutProps?.navMenu?.sx,
                      '@media screen and (max-width: 878px)': {
                        '&': {
                          display: 'flex',
                          transition: 'opacity 0.25s linear',
                          position: 'absolute',
                          top: 61,
                          left: showMobileMenu ? 0 : '-100%',
                          opacity: showMobileMenu ? 1 : 0,
                          '.menu-content': {
                            flexDirection: 'column',
                            backgroundColor: theme => theme.palette.background.paper,
                            width: '100%',
                            minWidth: 200,
                            alignItems: 'flex-start',
                            '.MuiList-root': {
                              width: '100%',
                              mr: 0,
                              maxWidth: '100%',
                              display: 'flex',
                              py: 0.5,
                              justifyContent: 'center',
                              '.MuiListItemIcon-root': {
                                mr: 2
                              },
                              a: {
                                borderRadius: 0,
                                gap: 2,
                                display: 'flex',
                                width: '100%'
                              }
                            }
                          }
                        }
                      }
                    }}
                  >
                    {(userNavMenuContent && userNavMenuContent(props)) || (
                      <Navigation
                        {...props}
                        horizontalNavItems={
                          (horizontalLayoutProps as NonNullable<LayoutProps['horizontalLayoutProps']>).navMenu?.navItems
                        }
                      />
                    )}
                  </Box>
                )}
              </AppBarContent>
            </Toolbar>
          </Box>
          {/* Navigation Menu */}
        </AppBar>
        {/* Content */}
        <ContentWrapper
          className='layout-page-content'
          sx={{
            ...(contentHeightFixed && { display: 'flex', overflow: 'hidden' }),
            ...(contentWidth === 'boxed' && {
              mx: 'auto',
              '@media (min-width:1440px)': { maxWidth: 1440 },
              '@media (min-width:1200px)': { maxWidth: '100%' }
            })
          }}
        >
          {children}
        </ContentWrapper>
        {/* Footer */}
        {/* <Footer {...props} footerStyles={footerProps?.sx} footerContent={footerProps?.content} /> */}
        {/* Customizer */}
        {themeConfig.disableCustomizer || hidden ? null : <Customizer />}
        {/* Scroll to top button */}
        {scrollToTop ? (
          scrollToTop(props)
        ) : (
          <ScrollToTop className='mui-fixed'>
            <Fab color='primary' size='small' aria-label='scroll back to top'>
              <Icon icon='tabler:arrow-up' />
            </Fab>
          </ScrollToTop>
        )}
      </MainContentWrapper>
    </HorizontalLayoutWrapper>
  )
}

export default HorizontalLayout
