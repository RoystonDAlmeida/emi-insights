
import { Box, Container, Typography, Link, useTheme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite'; // Import a heart icon

const Footer = () => {
  const theme = useTheme(); // Get the MUI theme

  const personalLink = "https://github.com/royston-dalmeida"; 

  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, mt: 6, 
        bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : theme.palette.primary.dark, // Match Nav: Dark Gray for dark mode, Dark Purple for light
        color: theme.palette.getContrastText(theme.palette.mode === 'dark' ? '#1e1e1e' : theme.palette.primary.dark) // Ensure text contrasts
      }}>
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} • Crafted with <FavoriteIcon fontSize="small" sx={{ verticalAlign: 'middle', mx: '3px', color: 'inherit' }} /> by{' '}
          <Link 
            href={personalLink} 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ 
              fontWeight: 500, 
              textDecoration: 'underline', 
              textUnderlineOffset: '4px',
              color: 'inherit',
              '&:hover': { color: 'rgba(255,255,255,0.8)' }
            }}
          >
            Royston D'Almeida
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
