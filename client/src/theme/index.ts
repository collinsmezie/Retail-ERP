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
    fontFamily: `var(--font-geist-sans, Inter), system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji"`,
  },
});

export default theme; 