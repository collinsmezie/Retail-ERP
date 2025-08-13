import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0EA5E9', // light blue
    },
    secondary: {
      main: '#38BDF8', // lighter blue
    },
    error: {
      main: '#DC2626', // red
    },
    warning: {
      main: '#FBBF24', // yellow
    },
    background: {
      default: '#F5F6FA', // light gray
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A202C', // dark slate
      secondary: '#4B5563',
    },
    success: {
      main: '#0EA5E9', // light blue for healthy
    },
    info: {
      main: '#2563EB',
    },
    divider: '#E2E8F0',
  },
  shape: { 
    borderRadius: 8 
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
        contained: {
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#0284C7',
          },
        },
        containedPrimary: {
          backgroundColor: '#0EA5E9',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#0284C7',
          },
        },
      },
    },
    MuiPaper: { 
      styleOverrides: { 
        root: { 
          border: "1px solid #E2E8F0" 
        } 
      } 
      },
    },
  typography: {
    fontFamily: `var(--font-geist), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    h1: {
      fontFamily: `var(--font-geist), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
      fontWeight: 600,
    },
    h2: {
      fontFamily: `var(--font-geist), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
      fontWeight: 600,
    },
    h3: {
      fontFamily: `var(--font-geist), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
      fontWeight: 600,
    },
    h4: {
      fontFamily: `var(--font-geist), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
      fontWeight: 600,
    },
    h5: {
      fontFamily: `var(--font-geist), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
      fontWeight: 600,
    },
    h6: {
      fontFamily: `var(--font-geist), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
      fontWeight: 600,
    },
    body1: {
      fontFamily: `var(--font-geist), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    },
    body2: {
      fontFamily: `var(--font-geist), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    },
    button: {
      fontFamily: `var(--font-geist), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
      fontWeight: 500,
    },
    caption: {
      fontFamily: `var(--font-geist), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    },
    overline: {
      fontFamily: `var(--font-geist), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    },
  },
});

export default theme; 