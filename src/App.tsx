
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider as ShadcnThemeProvider, useTheme as useShadcnTheme } from "@/components/theme-provider";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";
import About from "@/pages/About";
import ExchangeRates from "@/pages/ExchangeRates";
import NotFound from "@/pages/NotFound";
import ErrorBoundary from "@/components/ErrorBoundary"; // Import the new ErrorBoundary

const queryClient = new QueryClient();

// This component will be a child of ShadcnThemeProvider and can access its theme
const ThemedAppLayout = () => {
  const { theme: shadcnActiveTheme } = useShadcnTheme();

  // Determine the MUI mode based on the Shadcn theme
  const muiMode = shadcnActiveTheme === 'system'
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : shadcnActiveTheme;

  // Create a Material UI theme dynamically
  const muiTheme = createTheme({
    palette: {
      mode: muiMode, // Set MUI mode based on Shadcn theme
      primary: {
        main: '#9b87f5', // Primary Purple
        light: '#d6bcfa', // Light Purple
        dark: '#6E59A5', // Tertiary Purple
      },
      secondary: {
        main: '#7E69AB', // Secondary Purple
      },
      // MUI will set background.default and paper based on the mode.
      // We override paper for a specific black in dark mode.
      background: {
        default: muiMode === 'dark' ? '#1e1e1e' : '#f5f5f5', // Slightly off-black for body, or use MUI default
        paper: muiMode === 'dark' ? '#121212' : '#ffffff',   // Black for Card/Paper components in dark mode
      },
    },
    typography: {
      fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
      h1: { fontWeight: 700 },
      h2: { fontWeight: 600 },
      button: { textTransform: 'none' },
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline /> {/* This will now apply mode-appropriate backgrounds */}
      <CurrencyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {/* Using Outlet for nested routes if App.tsx defines the BrowserRouter structure */}
          <div className="min-h-screen flex flex-col"> {/* Use Tailwind classes for overall structure if needed */}
            <Navigation />
            <main className="flex-grow">
              <ErrorBoundary>
                <Outlet /> {/* Routes will be rendered here, wrapped by ErrorBoundary */}
              </ErrorBoundary>
            </main>
          </div>
          <Footer />
        </TooltipProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ShadcnThemeProvider defaultTheme="light"> {/* Shadcn provider is outermost */}
      <BrowserRouter> {/* BrowserRouter should wrap route definitions */}
        <Routes
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Route element={<ThemedAppLayout />}> {/* Layout component wraps page routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/exchange-rates" element={<ExchangeRates />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ShadcnThemeProvider>
  </QueryClientProvider>
);

export default App;
