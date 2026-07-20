'use client';

import { createTheme } from '@mui/material/styles';
import { muiTypography } from './mui-typographgy';

declare module '@mui/material/styles' {
  interface Palette {
    stageIdea: Palette['primary'];
    stagePicked: Palette['primary'];
    stagePlanned: Palette['primary'];
  }
  interface PaletteOptions {
    stageIdea?: PaletteOptions['primary'];
    stagePicked?: PaletteOptions['primary'];
    stagePlanned?: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f8fafc',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      disabled: '#cbd5e1',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
    info: {
      main: '#3b82f6',
    },
    stageIdea: {
      main: '#f59e0b',
    },
    stagePicked: {
      main: '#3b82f6',
    },
    stagePlanned: {
      main: '#10b981',
    },
  },
...muiTypography,
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--border-radius-md)',
          transition: 'var(--transition-base)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-md)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 'var(--border-radius-md)',
          },
        },
      },
    },
  },
});

export default theme;
