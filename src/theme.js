import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a855f7',
      light: '#c084fc',
      dark: '#7c3aed',
    },
    secondary: {
      main: '#00d4ff',
      light: '#67e8f9',
      dark: '#0891b2',
    },
    success: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#16a34a',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    background: {
      default: '#0a0a1a',
      paper: 'rgba(255,255,255,0.05)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255,255,255,0.5)',
      disabled: 'rgba(255,255,255,0.2)',
    },
    divider: 'rgba(255,255,255,0.06)',
  },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    h1: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 700 },
    h2: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 700 },
    h4: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 600 },
    h5: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 600 },
    h6: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.95rem',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)',
            boxShadow: '0 4px 20px rgba(168, 85, 247, 0.3)',
          },
        },
        containedSuccess: {
          background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
            boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.03)',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
            '&.Mui-focused fieldset': { borderColor: '#00d4ff', borderWidth: 2 },
          },
          '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#00d4ff' },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'rgba(255,255,255,0.03)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255,255,255,0.05)',
        },
        head: {
          color: 'rgba(255,255,255,0.3)',
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(10, 10, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;
