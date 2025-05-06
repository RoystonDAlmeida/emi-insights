import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Typography, Box, Paper, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom color="error">
              Oops! Something Went Wrong
            </Typography>
            <Typography variant="body1" gutterBottom>
              We're sorry for the inconvenience. An unexpected error occurred.
              Please try again, or return to the homepage.
            </Typography>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box 
                my={2} 
                sx={{ 
                  maxHeight: 150, 
                  overflowY: 'auto', 
                  textAlign: 'left', 
                  p:1, 
                  border: '1px solid #ccc', 
                  borderRadius: 1, 
                  background: (theme) => theme.palette.mode === 'dark' ? '#333' : '#f9f9f9',
                  color: (theme) => theme.palette.text.secondary
                }}
              >
                <Typography variant="caption" component="pre" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {this.state.error.toString()}
                  {this.state.error.stack && `\n${this.state.error.stack}`}
                </Typography>
              </Box>
            )}
            <Box mt={3}>
              <Button variant="contained" color="primary" component={RouterLink} to="/" onClick={() => this.setState({ hasError: false, error: undefined })} sx={{ mr: 1 }}>
                Go to Homepage
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </Box>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;