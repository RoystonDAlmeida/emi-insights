
import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Container,
  useTheme // Import useTheme hook
} from "@mui/material";
import { ThemeToggle } from "./theme-toggle";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme(); // Get the theme object
  
  const routes = [
    { name: "HOME", path: "/" },
    { name: "EXCHANGE RATES (LIVE)", path: "/exchange-rates" },
    { name: "ABOUT", path: "/about" },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : theme.palette.primary.dark, // Dark Gray for dark mode, purple for light
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* Logo and Title */}
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <img src="/logo.svg" alt="EMI Insights Logo" style={{ height: '32px', marginRight: theme.spacing(1) }} /> {/* Use theme spacing */}
            <Typography variant="h6" component="span" fontWeight="bold" sx={{ color: 'white' }}>
              EMI Insights
            </Typography>
          </Box>
          
          {/* Mobile menu button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton 
            aria-label="open drawer" 
            edge="end" 
            onClick={() => setIsMobileMenuOpen(true)} 
            sx={{ color: 'white' }}
          >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
          
          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {routes.map((route) => (
              <Button 
                key={route.path}
                component={RouterLink}
                to={route.path}
                sx={{ 
                  borderRadius: 1,
                  backgroundColor: isActive(route.path) 
                    ? (theme.palette.mode === 'dark' ? 'rgba(70, 70, 70, 0.9)' : 'rgba(211, 211, 211, 0.9)') // Dark gray for active in dark, light gray in light
                    : 'transparent',
                  color: isActive(route.path) 
                    ? (theme.palette.mode === 'dark' ? 'white' : theme.palette.getContrastText('rgba(211, 211, 211, 0.9)'))
                    : 'white',
                  '&:hover': { 
                    backgroundColor: isActive(route.path) 
                      ? (theme.palette.mode === 'dark' ? 'rgba(90, 90, 90, 0.9)' : 'rgba(192, 192, 192, 0.9)')
                      : (theme.palette.mode === 'dark' ? 'rgba(50, 50, 50, 0.15)' : 'rgba(255, 255, 255, 0.15)'),
                    color: isActive(route.path) 
                      ? (theme.palette.mode === 'dark' ? 'white' : theme.palette.getContrastText('rgba(192, 192, 192, 0.9)'))
                      : 'white',
                  }
                }}
              >
                {route.name}
              </Button>
            ))}
            <ThemeToggle />
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      >
        <Box sx={{ width: 240, pt: 2, pb: 2 }}>
          <List>
            {routes.map((route) => (
              <ListItem key={route.path} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={route.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  // selected={isActive(route.path)} // We'll control styling via sx for consistency
                  sx={{
                    ...(isActive(route.path) && {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(70, 70, 70, 0.9)' : 'rgba(211, 211, 211, 0.9)',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(90, 90, 90, 0.9)' : 'rgba(192, 192, 192, 0.9)',
                      },
                    }),
                  }}
                >
                  <ListItemText 
                    primary={route.name} 
                    sx={{ 
                      color: isActive(route.path) 
                        ? (theme.palette.mode === 'dark' ? 'white' : theme.palette.getContrastText('rgba(211, 211, 211, 0.9)')) 
                        : 'inherit' // 'inherit' will pick up dark text in light mode drawer, light text in dark mode drawer (if drawer bg changes)
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem sx={{ justifyContent: 'center', pt: 2 }}>
              <ThemeToggle />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navigation;
