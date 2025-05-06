import { IconButton } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <IconButton
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      color="inherit"
      sx={{
        bgcolor: 'rgba(255,255,255,0.1)',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
      }}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <DarkModeIcon fontSize="small" />
      ) : (
        <LightModeIcon fontSize="small"/>
      )}
      <span className="sr-only">Toggle theme</span>
    </IconButton>
  );
}