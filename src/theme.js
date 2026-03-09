import { createTheme } from '@mui/material/styles';

// ─── Professional Dark Palette ────────────────────────────────
// Inspired by Linear, Vercel, Raycast — warm & refined
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7c5cfc',   // Soft indigo
      light: '#9b85fd',
      dark: '#6347d9',
    },
    secondary: {
      main: '#e0943a',   // Warm amber
      light: '#f0a84f',
      dark: '#c47e2e',
    },
    success: {
      main: '#3ecf8e',
      light: '#5ddba3',
      dark: '#2eb878',
    },
    error: {
      main: '#f75555',
      light: '#f97777',
      dark: '#e03e3e',
    },
    warning: {
      main: '#e8a838',
      light: '#f0bc5f',
      dark: '#c98f2e',
    },
    background: {
      default: '#0B0E14',
      paper: '#12151E',
    },
    text: {
      primary: '#E8E8ED',
      secondary: '#8B8B9E',
      disabled: '#4A4A5A',
    },
    divider: 'rgba(255,255,255,0.06)',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
    h1: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 600 },
    h6: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0' },
    body2: { lineHeight: 1.6 },
    caption: { lineHeight: 1.4 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, padding: '10px 20px', fontSize: '0.875rem', transition: 'all 0.2s ease' },
        containedPrimary: {
          backgroundColor: '#7c5cfc',
          '&:hover': { backgroundColor: '#6a4de8', boxShadow: '0 4px 16px rgba(124,92,252,0.25)' },
        },
        containedSuccess: {
          backgroundColor: '#3ecf8e',
          color: '#0B0E14',
          '&:hover': { backgroundColor: '#35b87d', boxShadow: '0 4px 16px rgba(62,207,142,0.25)' },
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.1)',
          '&:hover': { borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.03)' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.03)',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
            '&.Mui-focused fieldset': { borderColor: '#7c5cfc', borderWidth: 1.5 },
          },
          '& .MuiInputLabel-root': { color: '#8B8B9E' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#7c5cfc' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#12151E',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.04)', padding: '14px 16px' },
        head: { color: '#8B8B9E', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 6, fontWeight: 500, fontSize: '0.75rem' } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(11,14,20,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          boxShadow: 'none',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
  },
});

export default theme;
